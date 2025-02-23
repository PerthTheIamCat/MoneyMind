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

            let bankData = result[0];
            let balance = bankData.balance;

            if (split_payment_id) {
                db.query('SELECT * FROM splitpayments WHERE id = ? AND account_id = ?', [split_payment_id, account_id], (err, splitResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
                    if (splitResult.length === 0) {
                        return res.status(404).json({ message: 'Split payment not found', success: false });
                    }

                    let splitPayment = splitResult[0];
                    if (transaction_type === 'expense' && splitPayment.remaining_balance < amount) {
                        return res.status(400).json({ message: 'Insufficient split payment balance', success: false });
                    } else if (transaction_type === 'income' && splitPayment.remaining_balance + amount > splitPayment.amount_allocated) {
                        return res.status(400).json({ message: 'Exceeds allocated limit', success: false })
                    }

                    processTransaction();
                });
            } else {
                processTransaction();
            }

            function processTransaction() {
                if (transaction_type === 'income') {
                    balance += amount;
                } else if (transaction_type === 'expense') {
                    balance -= amount;
                    if (balance < 0) {
                        return res.status(400).json({ message: 'Insufficient bank account balance', success: false });
                    }
                } else {
                    return res.status(404).json({ message: 'Invalid transaction type', success: false });
                }

                db.query(
                    'INSERT INTO transactions (user_id, account_id, split_payment_id, transaction_name, amount, transaction_type, note, color_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, account_id, split_payment_id || null, transaction_name, amount, transaction_type, note || null, color_code],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                        }

                        db.query('UPDATE bankaccounts SET balance = ? WHERE id = ?', [balance, account_id], (err) => {
                            if (err) {
                                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                            }
                            
                            if (split_payment_id) {
                                let splitUpdateQuery = transaction_type === 'expense' 
                                    ? 'UPDATE splitpayments SET remaining_balance = remaining_balance - ? WHERE id = ?' 
                                    : 'UPDATE splitpayments SET remaining_balance = remaining_balance + ? WHERE id = ?';
                                
                                db.query(splitUpdateQuery, [amount, split_payment_id], (err) => {
                                    if (err) {
                                        return res.status(500).json({ message: 'Failed to update split payment', error: err.message, success: false });
                                    }
                                    return res.status(200).json({ message: 'Transaction and split payment updated successfully', success: true });
                                });
                            } else {
                                return res.status(200).json({ message: 'Transaction created successfully', success: true });
                            }
                        });
                    }
                );
            }
        }
    );
});

router.get('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY id', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Transactions not found', success: false });
            }

            return res.status(200).json({result, success: true});
        }
    )
})

router.put('/:id', jwtValidate, (req, res) => {
    const transactionId = req.params.id;
    const { account_id, split_payment_id, transaction_name, amount, transaction_type, note, color_code } = req.body;

    db.query(
        'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
        [transactionId, req.user.UserID],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or transaction not found', success: false });
            }

            const oldTransaction = result[0];

            db.query(
                'SELECT balance FROM bankaccounts WHERE id = ?',
                [account_id],
                (err, bankResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
                    if (bankResult.length === 0) {
                        return res.status(404).json({ message: 'Bank account not found', success: false });
                    }

                    let balance = bankResult[0].balance;

                    if (oldTransaction.transaction_type === 'income') {
                        balance -= oldTransaction.amount;
                    } else if (oldTransaction.transaction_type === 'expense') {
                        balance += oldTransaction.amount;
                    }

                    if (transaction_type === 'income') {
                        balance += amount;
                    } else if (transaction_type === 'expense') {
                        balance -= amount;
                    }

                    if (balance < 0) {
                        return res.status(400).json({ message: 'Insufficient balance in the account', success: false });
                    }

                    db.query(
                        'UPDATE transactions SET account_id = ?, split_payment_id = ?, transaction_name = ?, amount = ?, transaction_type = ?, note = ?, color_code = ? WHERE id = ?',
                        [account_id, split_payment_id || null, transaction_name, amount, transaction_type, note || null, color_code, transactionId],
                        (err, updateResult) => {
                            if (err) {
                                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                            }

                            db.query(
                                'UPDATE bankaccounts SET balance = ? WHERE id = ?',
                                [balance, account_id],
                                (err) => {
                                    if (err) {
                                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                                    }
                                    
                                    if (split_payment_id) {
                                        let splitUpdateQuery = transaction_type === 'expense' 
                                            ? 'UPDATE splitpayments SET remaining_balance = remaining_balance - ? WHERE id = ?' 
                                            : 'UPDATE splitpayments SET remaining_balance = remaining_balance + ? WHERE id = ?';
                                        
                                        db.query(
                                            splitUpdateQuery,
                                            [amount, split_payment_id],
                                            (err) => {
                                                if (err) {
                                                    return res.status(500).json({ message: 'Failed to update split payment', error: err.message, success: false });
                                                }
                                                return res.status(200).json({ message: 'Transaction and split payment updated successfully', success: true });
                                            }
                                        );
                                    } else {
                                        return res.status(200).json({ message: 'Transaction updated successfully', success: true });
                                    }
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

router.delete('/:id', jwtValidate, (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user.UserID;

    db.query(
        'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
        [transactionId, userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            if (result.length === 0) {
                return res.status(403).json({ message: 'Unauthorized user or transaction not found', success: false });
            }

            const transaction = result[0];

            db.query(
                'SELECT balance FROM bankaccounts WHERE id = ?',
                [transaction.account_id],
                (err, bankResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
                    if (bankResult.length === 0) {
                        return res.status(404).json({ message: 'Bank account not found', success: false });
                    }

                    let balance = bankResult[0].balance;

                    if (transaction.transaction_type === 'income') {
                        balance -= transaction.amount;
                    } else if (transaction.transaction_type === 'expense') {
                        balance += transaction.amount;
                    }

                    const updateBankAccount = () => {
                        db.query(
                            'UPDATE bankaccounts SET balance = ? WHERE id = ?',
                            [balance, transaction.account_id],
                            (err) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Failed to update bank balance', error: err.message, success: false });
                                }

                                db.query('DELETE FROM transactions WHERE id = ?', [transactionId], (err) => {
                                    if (err) {
                                        return res.status(500).json({ message: 'Failed to delete transaction', error: err.message, success: false });
                                    }
                                    return res.status(200).json({ message: 'Transaction deleted successfully', success: true });
                                });
                            }
                        );
                    };

                    if (transaction.split_payment_id) {
                        db.query(
                            'SELECT remaining_balance, amount_allocated FROM splitpayments WHERE id = ?',
                            [transaction.split_payment_id],
                            (err, splitResult) => {
                                if (err) {
                                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                                }
                                if (splitResult.length === 0) {
                                    return res.status(404).json({ message: 'Split payment not found', success: false });
                                }

                                let remainingBalance = splitResult[0].remaining_balance;

                                if (transaction.transaction_type === 'expense') {
                                    remainingBalance += transaction.amount;
                                    if (remainingBalance > splitResult[0].amount_allocated) {
                                        return res.status(400).json({
                                            message: 'Error: Remaining balance cannot exceed allocated amount.',
                                            success: false
                                        });
                                    }
                                } else {
                                    remainingBalance -= transaction.amount;
                                    if (remainingBalance < 0) {
                                        return res.status(400).json({
                                            message: 'Error: Remaining balance cannot be negative.',
                                            success: false
                                        });
                                    }
                                }

                                db.query(
                                    'UPDATE splitpayments SET remaining_balance = ? WHERE id = ?',
                                    [remainingBalance, transaction.split_payment_id],
                                    (err) => {
                                        if (err) {
                                            return res.status(500).json({ message: 'Failed to update split payment balance', error: err.message, success: false });
                                        }
                                        updateBankAccount();
                                    }
                                );
                            }
                        );
                    } else {
                        updateBankAccount();
                    }
                }
            );
        }
    );
});


module.exports = {
    router
}