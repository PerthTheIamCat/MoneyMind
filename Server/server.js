const express = require('express')
const mysql = require('mysql')
const app = express()
require('dotenv').config();

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
    db.query(
        'SELECT * FROM users',
        function(err, result) {
            res.json(result)
        }
    )
})

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
