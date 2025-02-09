const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();    

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.post('/create', jwtValidate, (req, res) => {
    const { user_id,
            account_id, 
            split_name, 
            amount_allocated, 
            color_code,
            icon_id
        } = req.body;

    const remaining_balance = amount_allocated

    if (req.user.UserID !== user_id) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !account_id || !split_name || !amount_allocated || !color_code) {
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'SELECT b.balance, SUM(s.amount_allocated) AS sumAmount FROM bankaccounts b LEFT JOIN splitpayments s ON b.id = s.account_id WHERE b.id = ? and b.user_id = ? GROUP BY b.id, b.balance', [account_id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or Split Pay not found', success: false });
            }

            let sumSplitpay = result[0]
            console.log(sumSplitpay)

            let remaining = sumSplitpay.balance - sumSplitpay.sumAmount
            console.log(remaining)

            if (remaining - amount_allocated < 0) {
                return res.status(400).json({ message: 'Your Bank balance remaining does not enough', success: false });
            }

            db.query(
                'INSERT INTO splitpayments (account_id, split_name, amount_allocated, remaining_balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?, ?)',
                [account_id, split_name, amount_allocated, remaining_balance, color_code, icon_id || null],
                (err, splitpeyResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
                    console.log('Splitpayment Created')
                    return res.status(201).json({splitpeyResult, message: 'Splitpayment Created', success: true })
                }
            )
        } 
    )
})

router.get('/:id', jwtValidate, (req, res) => {
    db.query(
        'SELECT * FROM splitpayments WHERE account_id = ?', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Splitpayment not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

router.put('/:id', jwtValidate, (req, res) => {
    const bankID = req.params.id;

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [account_id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            
        }
    )
})

router.delete('/:id', jwtValidate, (req, res) => {
    
})


module.exports = {
    router
}