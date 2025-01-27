const express = require('express')
const mysql = require('mysql')
const app = express()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'PASS', //Enter MySQL password here
    database: 'moneymind'
})

app.use(express.json())

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

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
