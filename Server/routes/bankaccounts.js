const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();      

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.post('/create', jwtValidate, (req, res) => {
    const { user_id, account_name, balance, color_code, icon_id } = req.body;

    if (req.user.UserID !== user_id) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !account_name || !balance || !color_code) {
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'INSERT INTO bankaccounts (user_id, account_name, balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?)',
        [user_id, account_name, balance, color_code, icon_id || null],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Bank account created")
            return res.status(201).json({ message: 'Bank account created', success: true });
        }
    )
})

router.get('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM bankaccounts WHERE user_id = ? ORDER BY id', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({result, message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({result, message: 'Bank Account or User not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

router.put('/:id', jwtValidate, (req, res) => {
    const bankID = req.params.id;

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [bankID, req.user.UserID], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            db.query(
                'UPDATE bankaccounts SET ? WHERE id = ?', [req.body, req.params.id], (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
        
                    if (updateResult.length === 0) {
                        return res.status(404).json({ message: 'Bank Account not found', success: false });
                    }
        
                    return res.status(200).json({ message: 'Bank Account updated', success: true });
                }
            )
        }
    )
})

router.delete('/:id', jwtValidate, (req, res) => {
    const bankID = req.params.id;

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', 
        [bankID, req.user.UserID], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            db.query('DELETE FROM transactions WHERE user_id = ?', [req.user.UserID], (err, result) => {
                if (err) {
                    console.error("Error deleting transactions:", err);
                    return res.status(500).json({ error: "Failed to delete transactions" });
                }
            
                db.query('DELETE FROM splitpayments WHERE account_id = ?', [bankID], (err, result) => {
                    if (err) {
                        console.error("Error deleting splitpayments:", err);
                        return res.status(500).json({ error: "Failed to delete splitpayments" });
                    }

                    db.query('DELETE FROM bankaccounts WHERE id = ?', [bankID], (err, deleteResult) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                        }
            
                        if (deleteResult.length === 0) {
                            return res.status(404).json({ message: 'Bank Account deleted', success: false });
                        }
            
                        return res.status(200).json({deleteResult, message: 'Bank Account deleted', success: true });
                    })
                })
            })
        }
    )
})

module.exports = {
    router
}