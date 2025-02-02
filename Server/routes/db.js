const mysql = require('mysql')
const fs = require('fs')
require('dotenv').config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, //Enter MySQL password in .env file
    database: process.env.DB_NAME,
    port: 3306,
    ssl: {
        rejectUnauthorized: true,
        ca:[fs.readFileSync(process.env.DB_SSL, "utf8")]
    }
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

module.exports = db;