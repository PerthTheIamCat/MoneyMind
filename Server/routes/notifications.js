const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.post('/create', jwtValidate,(req, res) => {
    const { user_id, 
        notification_type, 
        message
    } = req.body;

    if (req.user.UserID !== parseInt(user_id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !notification_type || !message) {
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)',
        [user_id, notification_type, message], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Notification Created")
            return res.status(201).json({result, message: 'Notification Created', success: true});
        }
    )
})

router.get('/new/:id', jwtValidate,(req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.params.id], (err, result) => { //user_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Notification not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

router.get('/:id', jwtValidate,(req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM notifications WHERE user_id = ?', [req.params.id], (err, result) => { //user_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Notification not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

router.put('/:id', jwtValidate,(req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'UPDATE notifications SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => { //noti_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Nofitication not found', success: false });
            }

            return res.status(200).json({ message: 'Nofitication updated', success: true });
        }
    )
})

router.delete('/:id', jwtValidate,(req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'DELETE FROM notifications WHERE id = ?', [req.params.id], (err, result) => { //noti_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Nofitication not found', success: false });
            }

            res.status(200).json({ message: 'Nofitication deleted', success: true });
        }
    )
})

module.exports = {
    router
}