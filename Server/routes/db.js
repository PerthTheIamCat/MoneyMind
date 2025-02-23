const mysql = require('mysql')
const fs = require('fs')
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, //Enter MySQL password in .env file
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca:[fs.readFileSync(process.env.DB_SSL, "utf8")]
    }
})

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
    connection.release(); // ปล่อย connection กลับไปที่ pool
});

module.exports = db;