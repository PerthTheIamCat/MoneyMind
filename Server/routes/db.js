const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306,
    ssl: {
        rejectUnauthorized: true,
        ca: [fs.readFileSync("/Users/perth/mobile_app/MoneyMind/Server/DigiCertGlobalRootCA.crt.pem", "utf8")]
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1); // Exit the process if the database connection fails
    }
    console.log('Connected to database');
});

module.exports = db;
