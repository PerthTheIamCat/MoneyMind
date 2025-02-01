const express = require('express')  // Import express
const mysql = require('mysql')      // Import mysql
const app = express()               // Create express app
const bcrypt = require('bcrypt')    // Import bcrypt for password hashing
const jwt = require('jsonwebtoken') // Import jsonwebtoken for token generation
const fs = require('fs')            // Import fs for file system
require('dotenv').config();        // Import dotenv for environment variables

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const sendEmailRouter = require('./routes/sendEmail')
const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./routes/auth')
const db = require('./routes/db');
//const ocrRouter = require('./routes/ocr')

app.use('/sendEmail', sendEmailRouter)
app.use('/auth', authRouter)
//app.use('/ocr', ocrRouter)

const port = process.env.PORT || 3000

//routes
app.get('/', jwtValidate, (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})