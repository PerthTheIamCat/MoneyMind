const express = require('express')  // Import express
const router = express.Router()     // Create express app
const bcrypt = require('bcrypt')
require('dotenv').config();

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.get('/', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
        }
        res.status(200).json(result);
    });
});

router.get('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

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

router.put('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'UPDATE users SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
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
    if (req.user.UserID !== parseInt(req.params.id, 10)) {
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
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