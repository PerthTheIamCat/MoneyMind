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
            split_payment_id, 
            transaction_name, 
            amount,
            transaction_type,
            note,
            color_code
        } = req.body;

    if (req.user.UserID !== user_id) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !account_id || !transaction_name || !amount || !transaction_type || !color_code) {
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [account_id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            let bankData = result[0]
            let balance
            console.log(bankData.balance)

            if (transaction_type === 'income') {
                balance = bankData.balance+amount
                console.log(balance)
            }else if (transaction_type === 'expense') {
                balance = bankData.balance-amount
                console.log(balance)
            }else {
                console.log('Invalid transaction type')
                return res.status(404).json({message: 'Invalid transaction type'})
            }

            db.query(
                'INSERT INTO transactions (user_id, account_id, split_payment_id, transaction_name, amount, transaction_type, note, color_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id, account_id, split_payment_id || null, transaction_name, amount, transaction_type, note || null, color_code],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    db.query(
                        'UPDATE bankaccounts SET balance = ? WHERE id = ?', [balance, account_id], (err, updateResult) => {
                            if (err) {
                                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                            }
                
                            if (updateResult.length === 0) {
                                return res.status(404).json({ message: 'Bank Account not found', success: false });
                            }
                
                            console.log("Transaction created and update Bank accout")
                            return res.status(200).json({updateResult, message: 'Transaction created and update Bank accout'});
                        }
                    )
                }
            )
        } 
    )
})

router.get('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM transactions WHERE user_id = ?', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

// router.put('/:id', jwtValidate, (req, res) => {
//     const bankID = req.params.id;

//     db.query(
//         'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [bankID, req.user.UserID], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
//             }

//             if (result.length === 0) {
//                 return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
//             }

//             db.query(
//                 'UPDATE bankaccounts SET ? WHERE id = ?', [req.body, req.params.id], (err, updateResult) => {
//                     if (err) {
//                         return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
//                     }
        
//                     if (updateResult.length === 0) {
//                         return res.status(404).json({ message: 'Bank Account not found', success: false });
//                     }
        
//                     return res.status(200).json({ message: 'Bank Account updated', success: true });
//                 }
//             )
//         }
//     )
// })

// router.delete('/:id', jwtValidate, (req, res) => {
//     const bankID = req.params.id;

//     db.query(
//         'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [bankID, req.user.UserID], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
//             }

//             if (result.length === 0) {
//                 return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
//             }

//             // Proceed to delete the bank account
//             db.query('DELETE FROM bankaccounts WHERE id = ?', [bankID], (err, deleteResult) => {
//                 if (err) {
//                     return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
//                 }
    
//                 if (deleteResult.length === 0) {
//                     return res.status(404).json({ message: 'Bank Account deleted', success: false });
//                 }
    
//                 return res.status(200).json({ message: 'Bank Account deleted', success: true });
//             })
//         }
//     )
// })

module.exports = {
    router
}