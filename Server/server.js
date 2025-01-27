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
        'SELECT * FROM users WHERE UserID = ?',
        [req.params.id],
        function(err, result) {
            res.json(result)
        }
    )
})

const sendEmailRouter = require('./routes/sendEmail')

app.use('/sendEmail', sendEmailRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
