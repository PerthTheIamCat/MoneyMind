const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();      

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.post('/create', jwtValidate, (req, res) => {
    const { user_id, account_name, balance, color_code, icon_id } = req.body;

    if (req.user.UserID !== user_id) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !account_name || !balance || !color_code || !icon_id) {
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'INSERT INTO bankaccounts (user_id, account_name, balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?)',
        [user_id, account_name, balance, color_code, icon_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Bank account created")
            res.status(201).json({ message: 'Bank account created', success: true });
        }
    )
})

router.get('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM bankaccounts WHERE user_id = ?', [req.params.id], (err, result) => {
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

router.put('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== user_id) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'UPDATE bankaccounts SET ? WHERE user_id = ?', [req.body], [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            res.status(200).json({ message: 'User updated', success: true });
        }
    )
})

router.delete('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== user_id) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'DELETE FROM bankaccounts WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            res.status(200).json({ message: 'User deleted', success: true });
        }
    )
})

module.exports = {
    router
}