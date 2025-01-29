const express = require('express')  // Import express
const mysql = require('mysql')      // Import mysql
const app = express()               // Create express app
const bcrypt = require('bcrypt')    // Import bcrypt for password hashing
const jwt = require('jsonwebtoken') // Import jsonwebtoken for token generation
require('dotenv').config();        // Import dotenv for environment variables

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3000

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, //Enter MySQL password in .env file
    database: process.env.DB_NAME,
})

db.connect((err) => {
    try{
        if (err) {
            throw err
        }
        console.log('Connected to database')
    }catch(err){
        console.error('Error connecting to database')
    }

})


const jwtAccessTokenGenrate = (UserID, username, email) => {
    const accessToken = jwt.sign(
        { UserID, username, email },
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '3m', algorithm: 'HS256' })
    
    return accessToken
}

const jwtRefreshTokenGenrate = (UserID, username, email) => {
    const refreshToken = jwt.sign(
        { UserID, username, email },
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '1d', algorithm: 'HS256' })
    
    return refreshToken
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
        });
        next();
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const jwtRefreshValidate = (req, res, next) => {
    try {
        if(!req.headers['authorization']){
            console.log('No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = req.headers['authorization'].replace('Bearer ', '');

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error('Invalid token:', err.message);
                return res.status(403).json({ message: 'Invalid token' });
            }

            const UserID = decoded.UserID

            db.query('SELECT refresh_token FROM users WHERE id = ?', [UserID], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database query failed', error: err.message });
                }

                if (result.length === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                if (result[0].refresh_token !== token) {
                    return res.status(403).json({ message: 'Invalid token' });
                }
            })

            req.user = decoded
            req.user.token = token
            delete req.user.exp
            delete req.user.iat
        })
        next()

    } catch (err) {
        console.error('Unexpected error:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserID = (username) => {
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

//routes
app.get('/', jwtValidate, (req, res) => {
    res.send('Hello World')
})

app.get('/users', jwtValidate, (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message });
        }
        res.status(200).json(result);
    });
});

app.get('/users/:id', jwtValidate, (req, res) => {
    db.query(
        'SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(result);
        }
    )
})

app.post('/register', (req, res) => {
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

                db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash], async (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message });
                    }
                    
                    const UserID = await getUserID(username)

                    console.log(UserID, username, email)

                    const accessToken = jwtAccessTokenGenrate(UserID, username, email)
                    const refreshToken = jwtRefreshTokenGenrate(UserID, username, email)

                    console.log('User created')
                    return res.status(201).json({ accessToken, refreshToken, message: 'User created'})
                })
            })
        })
    })

})

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0]

        bcrypt.compare(password, user.password_hash, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Password comparison failed', error: err.message });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const UserID = getUserID(username)

            const accessToken = jwtAccessTokenGenrate(UserID, username, user.email)
            const refreshToken = jwtRefreshTokenGenrate(UserID, username, user.email)

            return res.status(200).json({ accessToken, refreshToken, message: 'Login successful' });
        });
    });
})

app.post('/auth/refresh', jwtRefreshValidate, (req, res) => {
    const { username } = req.body

})

const sendEmailRouter = require('./routes/sendEmail')
//const ocrRouter = require('./routes/ocr')

app.use('/sendEmail', sendEmailRouter)
//app.use('/ocr', ocrRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
