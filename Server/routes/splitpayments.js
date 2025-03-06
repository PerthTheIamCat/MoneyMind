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
        'SELECT ba.balance, SUM(sp.amount_allocated) AS sumAmount FROM bankaccounts ba LEFT JOIN splitpayments sp ON ba.id = sp.account_id WHERE ba.id = ? and ba.user_id = ? GROUP BY ba.id, ba.balance', 
        [account_id, user_id], 
        (err, result) => {
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
        'SELECT * FROM splitpayments WHERE account_id = ?', 
        [req.params.id], 
        (err, result) => {
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
    const splitPaymentId = req.params.id;
    const { split_name, amount_allocated, color_code, icon_id } = req.body;
    
    db.query(
        'SELECT sp.account_id, ba.user_id, sp.amount_allocated, sp.remaining_balance FROM splitpayments sp JOIN bankaccounts ba ON sp.account_id = ba.id WHERE sp.id = ? AND ba.user_id = ?',
        [splitPaymentId, req.user.UserID],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or split payment not found', success: false });
            }

            const bankId = result[0].account_id
            const amount_allocated_old = result[0].amount_allocated
            let remaining_balance_old = result[0].remaining_balance

            db.query(
                'SELECT ba.balance, SUM(sp.amount_allocated) AS sumAmount FROM bankaccounts ba LEFT JOIN splitpayments sp ON ba.id = sp.account_id WHERE ba.id = ? and ba.user_id = ? GROUP BY ba.id, ba.balance',
                [bankId, req.user.UserID],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    if (result.length === 0) {
                        return res.status(403).json({ message: 'Bankaccount not found', success: false });
                    }

                    let sumSplitpay = result[0]
                    console.log(sumSplitpay)


                    let remaining = sumSplitpay.balance - sumSplitpay.sumAmount + amount_allocated_old
                    console.log(remaining)

                    let remaining_balance_new = remaining_balance_old + amount_allocated - amount_allocated_old

                    if (remaining - amount_allocated < 0) {
                        return res.status(400).json({ message: 'Your Bank balance remaining does not enough', success: false });
                    } else if (remaining_balance_new < 0) {
                        return res.status(400).json({ message: 'Your Split Payment remaining balance does not enough', success: false });
                    } else {
                        db.query(
                            'UPDATE splitpayments SET split_name = ?, amount_allocated = ?, remaining_balance = ?, color_code = ?, icon_id = ? WHERE id = ?',
                            [split_name, amount_allocated, remaining_balance_new, color_code, icon_id || null, splitPaymentId],
                            (err, updateResult) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                                }
                                return res.status(200).json({ message: 'Split Payment updated successfully', success: true });
                            }
                        );
                    }
                }
            )
        }
    );
})

router.delete('/:id', jwtValidate, (req, res) => {
    const splitPaymentId = req.params.id;

    db.query(
        'SELECT sp.account_id, ba.user_id FROM splitpayments sp JOIN bankaccounts ba ON sp.account_id = ba.id WHERE sp.id = ? AND ba.user_id = ?',
        [splitPaymentId, req.user.UserID],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or split payment not found', success: false });
            }

            db.query(
                'UPDATE transactions SET split_payment_id = NULL WHERE split_payment_id = ?',
                [splitPaymentId],
                (err, updateResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Failed to update transactions', error: err.message, success: false });
                    }

                    db.query('DELETE FROM splitpayments WHERE id = ?', [splitPaymentId], (err, deleteResult) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                        }
                        return res.status(200).json({updateResult, message: 'Split Payment deleted successfully and related transactions updated', success: true });
                    });
                }
            );
        }
    );
})


module.exports = {
    router
}