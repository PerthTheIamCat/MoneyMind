const express = require('express')  // Import express
const mysql = require('mysql')      // Import mysql
const router = express.Router()     // Create express app
const bcrypt = require('bcrypt')    // Import bcrypt for password hashing
const jwt = require('jsonwebtoken') // Import jsonwebtoken for token generation
require('dotenv').config();        // Import dotenv for environment variables

const db = require('./db');

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
        { expiresIn: '20m', algorithm: 'HS256' })
    
    return accessToken
}

const jwtValidate = (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = req.headers['authorization'].replace('Bearer ', '');

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error('Invalid token:', err.message);
                return res.status(403).json({ message: 'Invalid token' });
            }
            console.log(decoded);
            next();
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/
    if (!emailRegex.test(`${email}`)) {
        return res.status(400).json({
            message: 'Invalid email format'
        })
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message });
            }

            if (result.length > 0) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            if (password !== password2) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err)
                    return res.status(500).json({ message: 'Password hashing failed', error: err.message });
                }

                db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], async (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message });
                    }
                    
                    const UserID = await getUserIDbyusername(username)

                    console.log(UserID, username, email)

                    const accessToken = jwtAccessTokenGenrate(UserID, username, email)

                    console.log('User created')
                    return res.status(201).json({ accessToken, message: 'User created'})
                })
            })
        })
    })

})

router.post('/login', (req, res) => {
    const { input, password } = req.body
    let userOrEmail = "username"

    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/
    if (emailRegex.test(`${input}`)){
        userOrEmail = "email"
    }
    
    console.log(`SELECT * FROM users WHERE ${userOrEmail} = ?`, [input]);
    
    db.query(`SELECT * FROM users WHERE ${userOrEmail} = ?`, [input], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User or Email not found' });
        }

        const user = result[0]
        console.log(user)

        bcrypt.compare(password, user.password, async (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Password comparison failed', error: err.message });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const UserID = userOrEmail === "email" ? await getUserIDbyemail(input) : await getUserIDbyusername(input);

            const accessToken = jwtAccessTokenGenrate(UserID, user.username, user.email)
            return res.status(200).json({ accessToken, message: 'Login successful' });
        });
    });
})

module.exports = {
    router,
    jwtValidate,
    getUserIDbyusername,
    getUserIDbyemail
}