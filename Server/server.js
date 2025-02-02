const express = require('express')  // Import express
const app = express()               // Create express app
require('dotenv').config();        // Import dotenv for environment variables

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const sendEmailRouter = require('./routes/sendEmail')
const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./routes/auth')
const db = require('./routes/db');
const ocrRouter = require('./routes/ocr')

app.use('/sendEmail', sendEmailRouter)
app.use('/auth', authRouter)
app.use('/ocr', ocrRouter)

const port = process.env.PORT || 3000

//routes
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/users', jwtValidate, (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
        }
        res.status(200).json(result);
    });
});

app.get('/users/:id', jwtValidate, (req, res) => {
    db.query(
        'SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            res.status(200).json(result);
        }
    )
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})