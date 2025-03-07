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
        color_type,
        message
    } = req.body;

    console.log("DATA:", user_id, notification_type, color_type, message)

    if (req.user.UserID !== parseInt(user_id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !notification_type || !message || !color_type) {
        console.log("Please fill all fields")
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'INSERT INTO notifications (user_id, notification_type, color_type, message) VALUES (?, ?, ?, ?)',
        [user_id, notification_type, color_type, message], 
        (err, result) => {
            if (err) {
                console.log("Error from /create from INSERT INTO notifications (user_id, notification_type, color_type, message) VALUES (?, ?, ?, ?)");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Notification Created")
            return res.status(201).json({result, message: 'Notification Created', success: true});
        }
    )
})

router.get('/new/:id', jwtValidate,(req, res) => { //user_id
    console.log("User ID:", req.params.id)

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.params.id], (err, result) => { //user_id
            if (err) {
                console.log("Error from .get/:id from SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("From .get/new/:id from result.length === 0")
                console.log("Notification not found")
                return res.status(404).json({ message: 'Notification not found', success: false });
            }

            console.log("Get Notification")
            return res.status(200).json({result, message: "Get Notification", success: true});
        }
    )
})

router.get('/:id', jwtValidate,(req, res) => { //user_id
    console.log("User ID:", req.params.id)

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM notifications WHERE user_id = ?', [req.params.id], (err, result) => { //user_id
            if (err) {
                console.log("Error from .get/:id from SELECT * FROM notifications WHERE user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("From .get/:id from result.length === 0")
                console.log("Notification not found")
                return res.status(404).json({ message: 'Notification not found', success: false });
            }

            console.log("Get Notification")
            return res.status(200).json({result, message: "Get Notification", success: true});
        }
    )
})

router.put('/:id', jwtValidate,(req, res) => { //noti_id
    console.log("Notification ID:", req.params.id)

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'UPDATE notifications SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => { //noti_id
            if (err) {
                console.log("Error from .put/:id from UPDATE notifications SET ? WHERE id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("From .put/:id from result.length === 0")
                console.log("Notification not found")
                return res.status(404).json({ message: 'Nofitication not found', success: false });
            }

            console.log("Notification updated")
            return res.status(200).json({ message: 'Nofitication updated', success: true });
        }
    )
})

router.delete('/:id', jwtValidate,(req, res) => { //noti_id
    console.log("Notification ID:", req.params.id)

    db.query(
        'DELETE FROM notifications WHERE id = ?', [parseInt(req.params.id, 10)], (err, result) => { //noti_id
            if (err) {
                console.log("Error from .delete/:id from DELETE FROM notifications WHERE id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.affectedRows === 0) {
                console.log("From .delete/:id from result.affectedRows === 0")
                console.log("Notification not found")
                return res.status(404).json({ message: 'Nofitication not found', success: false });
            }

            console.log("Notification deleted")
            res.status(200).json({ message: 'Nofitication deleted', success: true });
        }
    )
})

module.exports = {
    router
}