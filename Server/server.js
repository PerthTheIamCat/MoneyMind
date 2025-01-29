const express = require('express')  // Import express
const mysql = require('mysql')      // Import mysql
const app = express()               // Create express app
const bcrypt = require('bcrypt')    // Import bcrypt for password hashing
require('dotenv').config();        // Import dotenv for environment variables

const port = process.env.PORT || 3000

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, //Enter MySQL password in .env file
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) throw err
    console.log('Connected to database')
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message });
        }
        res.status(200).json(result);
    });
});

app.get('/users/:id', (req, res) => {
    db.query(
        'SELECT * FROM users WHERE UserID = ?', [req.params.id], (err, result) => {
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

app.post('/auth/register', (req, res) => {
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

                db.query('INSERT INTO users (username, email, passwordhash) VALUES (?, ?, ?)', [username, email, hash], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message });
                    }

                    res.status(201).json({ message: 'User created' });
                })
            })
        })
    })

})

app.post('/auth/login', (req, res) => {

})

app.post('/auth/refresh', (req, res) => {

})

const sendEmailRouter = require('./routes/sendEmail')

app.use('/sendEmail', sendEmailRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
