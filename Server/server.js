const express = require('express')  // Import express
const app = express()               // Create express app
require('dotenv').config();        // Import dotenv for environment variables

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const {router: sendEmailRouter} = require('./routes/sendEmail')
const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./routes/auth')
const {router: usersRouter} = require('./routes/users')
const {router: bankaccountsRouter} = require('./routes/bankaccounts')
const {router: transactionsRouter} = require('./routes/transactions')
const {router: notifications} = require('./routes/notifications')
const ocrRouter = require('./routes/ocr')

app.use('/bankaccounts', bankaccountsRouter)
app.use('/transactions', transactionsRouter)
app.use('/sendEmail', sendEmailRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/ocr', ocrRouter)
app.use('/notifications',notifications)

const port = process.env.PORT || 3000

//routes
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})