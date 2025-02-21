const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.post('/create', jwtValidate,(req, res) => {
    const { user_id, 
        device_name, 
        ip_address,
        location,
        token 
    } = req.body;

    if (req.user.UserID !== parseInt(user_id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !device_name || !ip_address || !token) {
        return res.status(400).json({ message: 'Please fill all needed fields', success: false });
    }

    db.query(
        'INSERT INTO devices (user_id, device_name, ip_address, location, token, last_login) VALUES (?, ?, ?, ?, ?, NOW())',
        [user_id, device_name, ip_address, location || null, token], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Device Created")
            return res.status(201).json({result, message: 'Device Created', success: true});
        }
    )
})

router.get('/:id', jwtValidate,(req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM devices WHERE user_id = ?', [req.params.id], (err, result) => { //user_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'devices not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

// router.put('/:id', jwtValidate,(req, res) => {
//     if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
//         return res.status(403).json({ message: 'Unauthorized user', success: false });
//     }

//     db.query(
//         'UPDATE devices SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => { //noti_id
//             if (err) {
//                 return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
//             }

//             if (result.length === 0) {
//                 return res.status(404).json({ message: 'Device not found', success: false });
//             }

//             return res.status(200).json({ message: 'Device updated', success: true });
//         }
//     )
// })

router.delete('/:id', jwtValidate,(req, res) => {
    const { user_id } = req.body

    if (req.user.UserID !== parseInt(user_id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'DELETE FROM devices WHERE id = ?', [req.params.id], (err, result) => { //noti_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Device not found', success: false });
            }

            res.status(200).json({ message: 'Device signed out', success: true });
        }
    )
})

router.delete('/user/:id', jwtValidate,(req, res) => {
    const { device_id } = req.body;

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM devices WHERE id = ?', 
        [device_id], 
        (err, result) => { //noti_id
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Device not found', success: false });
            }

            db.query(
                'DELETE FROM devices WHERE user_id = ? AND id != ?', [req.params.id, device_id], 
                (err, result) => { //noti_id
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
        
                    if (result.length === 0) {
                        return res.status(404).json({ message: 'Device not found', success: false });
                    }
        
                    res.status(200).json({ message: 'Signed out from all other devices', success: true });
                }
            )
        }
    )
})

module.exports = {
    router
}