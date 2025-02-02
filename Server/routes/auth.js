const express = require('express')  // Import express
const router = express.Router()     // Create express app
const bcrypt = require('bcrypt')    // Import bcrypt for password hashing
const jwt = require('jsonwebtoken') // Import jsonwebtoken for token generation
const otpGenerator = require('otp-generator') // Import otp-generator for OTP generation
require('dotenv').config();        // Import dotenv for environment variables

const db = require('./db');
const {sendEmail} = require('./sendEmail')

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const getUserIDbyusername = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM users WHERE username = ?', [username], (err, result) => {
            if (err) {
                return reject(new Error('Database query failed'))
            }

            if (result.length === 0) {
                return reject(new Error('User not found'))
            }

            resolve(result[0].id)
        })
    })
}

const getUserIDbyemail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                return reject(new Error('Database query failed'))
            }

            if (result.length === 0) {
                return reject(new Error('Email not found'))
            }

            resolve(result[0].id)
        })
    })
}

const jwtAccessTokenGenrate = (UserID, username, email) => {
    const accessToken = jwt.sign(
        { UserID, username, email },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '10s', algorithm: 'HS256' })
    
    return accessToken
}

const jwtValidate = (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No token provided', success: false });
        }

        const token = req.headers['authorization'].replace('Bearer ', '');

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error('Invalid token:', err.message);
                return res.status(403).json({ message: 'Invalid token', success: false });
            }
            console.log(decoded);
            next();
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

router.post('/register', (req, res) => {
    const { username, email, password, password2, otp} = req.body
    
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (!emailRegex.test(`${email}`)) {
        return res.status(400).json({message: 'Invalid email format', success: false})
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false});
        }

        if (result.length > 0) {
            return res.status(409).json({ message: 'Username already exists', success: false});
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false});
            }

            if (result.length > 0) {
                return res.status(409).json({ message: 'Email already exists', success: false});
            }

            if (password !== password2) {
                return res.status(400).json({ message: 'Passwords do not match', success: false});
            }

            db.query('SELECT * FROM otp WHERE email = ?', [email], async (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false});
                }

                const otpData = result[0]

                // console.log(otp)
                // console.log(otpData.otp_code)

                if (otpData.otp_code === otp) {
                    if (otpData.expires_at < new Date()) {
                        return res.status(400).json({ message: 'OTP expired', success: false });
                    }else{
                        console.log('OTP verified')
                        bcrypt.hash(password, 10, (err, hash) => {
                            if (err) {
                                console.error('Error hashing password:', err)
                                return res.status(500).json({ message: 'Password hashing failed', error: err.message, success: false});
                            }
            
                            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], async (err, result) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false});
                                }
                                
                                const UserID = await getUserIDbyusername(username)
            
                                console.log(UserID, username, email)
            
                                const accessToken = jwtAccessTokenGenrate(UserID, username, email)
            
                                console.log('User created')
                                return res.status(201).json({ accessToken, message: 'User created', success: true})
                            })
                        })
                    }
                }else{
                    return res.status(400).json({ message: 'Invalid OTP', success: false });
                }
            })
        })
    })

})

router.post('/login', (req, res) => {
    const { input, password } = req.body
    let userOrEmail = "username"

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (emailRegex.test(`${input}`)){
        userOrEmail = "email"
    }
    
    console.log(`SELECT * FROM users WHERE ${userOrEmail} = ?`, [input]);
    
    db.query(`SELECT * FROM users WHERE ${userOrEmail} = ?`, [input], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message , success: false});
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User or Email not found', success: false });
        }

        const user = result[0]
        console.log(user)

        bcrypt.compare(password, user.password, async (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Password comparison failed', error: err.message, success: false });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid password', success: false });
            }

            const UserID = userOrEmail === "email" ? await getUserIDbyemail(input) : await getUserIDbyusername(input);

            const accessToken = jwtAccessTokenGenrate(UserID, user.username, user.email)
            return res.status(200).json({ accessToken, message: 'Login successful', success: true });
        });
    });
})

router.post('/otpSend', (req, res) => {
    const { email } = req.body

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format', success: false })
    }

    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })

    const created_at = new Date()
    const expires_at = new Date(Date.now() + 5 * 60 * 1000)

    db.query('SELECT * FROM otp WHERE email = ?', [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false })
        }

        try {
            const subject = 'Your OTP Code'
            const text = `Your OTP is: ${otp}.`
            const html = `<p>Your OTP is: <strong>${otp}</strong></p>`

            const emailResult = await sendEmail({ email, subject, text, html })
            console.log(emailResult)

            if (emailResult.success) {
                if (result.length > 0) {
                    db.query(
                        'UPDATE otp SET otp_code = ?, created_at = ?, expires_at = ?, is_used = 0 WHERE email = ?', [otp, created_at, expires_at, email],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ message: 'Database update failed', error: err.message, success: false })
                            }

                            return res.status(200).json({ message: 'OTP resent successfully', success: true })
                        }
                    )
                } else {
                    db.query(
                        'INSERT INTO otp (email, otp_code, created_at, expires_at) VALUES (?, ?, ?, ?)', [email, otp, created_at, expires_at],
                        (err) => {
                            if (err) {
                                return res.status(500).json({ message: 'Database insert failed', error: err.message, success: false })
                            }

                            return res.status(200).json({ message: 'OTP sent successfully', success: true })
                        }
                    )
                }
            } else {
                return res.status(500).json({ message: 'Failed to send OTP email', success: false })
            }
        } catch (error) {
            console.error('Error sending OTP email:', error)
            return res.status(500).json({ message: 'Failed to send OTP email', error: error.message, success: false })
        }
    })
})

module.exports = {
    router,
    jwtValidate,
    getUserIDbyusername,
    getUserIDbyemail
}