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
            transaction_date,
            note,
            color_code
        } = req.body;

    console.log("DATA:", user_id, account_id, split_payment_id, transaction_name, amount, transaction_type, transaction_date, note, color_code)

    if (req.user.UserID !== user_id) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !account_id || !transaction_name || !amount || !transaction_type || !color_code) {
        console.log("Please fill all fields")
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?', [account_id, user_id], (err, result) => {
            if (err) {
                console.log("Error from /create from SELECT * FROM bankaccounts WHERE id = ? AND user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from /create from result.length === 0");
                console.log("Unauthorized user or account not found")
                return res.status(403).json({ message: 'Unauthorized user or account not found', success: false });
            }

            let bankData = result[0];
            let balance = bankData.balance;

            console.log("Bank Data:", bankData)
            console.log("Balance:", balance)

            if (split_payment_id) {
                db.query('SELECT * FROM splitpayments WHERE id = ? AND account_id = ?', [split_payment_id, account_id], (err, splitResult) => {
                    if (err) {
                        console.log("Error from /create from SELECT * FROM splitpayments WHERE id = ? AND account_id = ?");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    if (splitResult.length === 0) {
                        console.log("Error from /create from splitResult.length === 0");
                        console.log("Split payment not found")
                        return res.status(404).json({ message: 'Split payment not found', success: false });
                    }

                    let splitPayment = splitResult[0];
                    console.log("Split Payment:", splitPayment);

                    if (transaction_type === 'expense' && splitPayment.remaining_balance < amount) {
                        console.log("From /create from transaction_type === 'expense' && splitPayment.remaining_balance < amount")
                        console.log("Insufficient split payment balance")
                        return res.status(400).json({ message: 'Insufficient split payment balance', success: false });
                    } else if (transaction_type === 'income' && splitPayment.remaining_balance + amount > splitPayment.amount_allocated) {
                        console.log("From /create from transaction_type === 'income' && splitPayment.remaining_balance + amount > splitPayment.amount_allocated")
                        console.log("Exceeds allocated limit")
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
                    console.log("Balance:", balance);
                } else if (transaction_type === 'expense') {
                    balance -= amount;
                    if (balance < 0) {
                        console.log("Balance:", balance);
                        console.log("From /create from balance < 0");
                        console.log("Insufficient bank account balance")
                        return res.status(400).json({ message: 'Insufficient bank account balance', success: false });
                    }
                } else {
                    console.log("Invalid transaction type")
                    return res.status(404).json({ message: 'Invalid transaction type', success: false });
                }

                db.query(
                    'INSERT INTO transactions (user_id, account_id, split_payment_id, transaction_name, amount, transaction_type, transaction_date, note, color_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, account_id, split_payment_id || null, transaction_name, amount, transaction_type, transaction_date, note || null, color_code],
                    (err, result) => {
                        if (err) {
                            console.log("Error from /create from INSERT INTO transactions (user_id, account_id, split_payment_id, transaction_name, amount, transaction_type, transaction_date, note, color_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                            console.log("Database query failed");
                            console.log("Error:", err);
                            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                        }

                        db.query('UPDATE bankaccounts SET balance = ? WHERE id = ?', [balance, account_id], (err) => {
                            if (err) {
                                console.log("Error from /create from UPDATE bankaccounts SET balance = ? WHERE id = ?");
                                console.log("Database query failed");
                                console.log("Error:", err);
                                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                            }
                            
                            if (split_payment_id) {
                                let splitUpdateQuery = transaction_type === 'expense' 
                                    ? 'UPDATE splitpayments SET remaining_balance = remaining_balance - ? WHERE id = ?' 
                                    : 'UPDATE splitpayments SET remaining_balance = remaining_balance + ? WHERE id = ?';
                                
                                db.query(splitUpdateQuery, [amount, split_payment_id], (err) => {
                                    if (err) {
                                        console.log("Error from /create from splitUpdateQuery");
                                        console.log("Failed to update split payment");
                                        console.log("Error:", err);
                                        return res.status(500).json({ message: 'Failed to update split payment', error: err.message, success: false });
                                    }

                                    console.log("Transaction and split payment updated successfully")
                                    return res.status(200).json({ message: 'Transaction and split payment updated successfully', success: true });
                                });
                            } else {
                                console.log("Transaction created successfully")
                                return res.status(200).json({ message: 'Transaction created successfully', success: true });
                            }
                        });
                    }
                );
            }
        }
    );
});

router.get('/sum_income/:id', jwtValidate, (req, res) => { //user_id

    console.log("UserID:", req.user.UserID)

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT SUM(amount) AS total_income FROM transactions WHERE user_id = ? AND transaction_type = "income"', [req.params.id], (err, result) => {
            if (err) {
                console.log("Error from /sum_income/:id from SELECT SUM(amount) AS total_income FROM transactions WHERE user_id = ? AND transaction_type = 'income'");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Get sum income successfully")
            return res.status(200).json({ result: result[0], message: 'Get sum income successfully', success: true });
        }
    )

})

router.get('/sum_expense/:id', jwtValidate, (req, res) => { //user_id

    console.log("UserID:", req.user.UserID)

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT SUM(amount) AS total_expense FROM transactions WHERE user_id = ? AND transaction_type = "expense"', [req.params.id], (err, result) => {
            if (err) {
                console.log("Error from /sum_expense/:id from SELECT SUM(amount) AS total_expense FROM transactions WHERE user_id = ? AND transaction_type = 'expense'");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            console.log("Get sum expense successfully")
            return res.status(200).json({ result: result[0], message: 'Get sum expense successfully', success: true });
        }
    )

})

router.get('/:id', jwtValidate, (req, res) => { //user_id

    console.log("UserID:", req.user.UserID)

    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date desc', [req.params.id], (err, result) => {
            if (err) {
                console.log("Error from /:id from SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date desc");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from .get/:id from result.length === 0");
                console.log("Transactions not found")
                return res.status(404).json({ message: 'Transactions not found', success: false });
            }

            return res.status(200).json({result, message: 'Get transaction successfully', success: true});
        }
    )
})

router.get('/transactionID/:id', (req, res) => { //transaction_id
    const transactionId = req.params.id;
    console.log("Transaction ID:", transactionId)
    db.query(
        'SELECT * FROM transactions WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                console.log("Error from /:id from SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date desc");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            return res.status(200).json({result, message: 'Get transaction successfully', success: true});
        }
    )
})


router.put('/:id', jwtValidate, (req, res) => { //transaction_id
    const transactionId = req.params.id;
    const { account_id, split_payment_id, transaction_name, amount, transaction_type, note, color_code } = req.body;

    console.log("Transaction ID:", transactionId)
    console.log("DATA:", account_id, split_payment_id, transaction_name, amount, transaction_type, note, color_code)

    db.query(
        'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
        [transactionId, req.user.UserID],
        (err, result) => {
            if (err) {
                console.log("Error from .put/:id from SELECT * FROM transactions WHERE id = ? AND user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            if (result.length === 0) {
                console.log("Error from .put/:id from result.length === 0");
                console.log("Unauthorized user or transaction not found")
                return res.status(403).json({ message: 'Unauthorized user or transaction not found', success: false });
            }

            const oldTransaction = result[0];
            console.log("Old Transaction:", oldTransaction);

            db.query(
                'SELECT balance FROM bankaccounts WHERE id = ?',
                [account_id],
                (err, bankResult) => {
                    if (err) {
                        console.log("Error from .put/:id from SELECT balance FROM bankaccounts WHERE id = ?");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    if (bankResult.length === 0) {
                        console.log("Error from .put/:id from bankResult.length === 0");
                        console.log("Bank account not found")
                        return res.status(404).json({ message: 'Bank account not found', success: false });
                    }

                    let balance = bankResult[0].balance;
                    console.log("Balance:", balance);

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
                        console.log("Balance:", balance);
                        console.log("From .put/:id from balance < 0");
                        console.log("Insufficient balance in the account")
                        return res.status(400).json({ message: 'Insufficient balance in the account', success: false });
                    }

                    db.query(
                        'UPDATE transactions SET account_id = ?, split_payment_id = ?, transaction_name = ?, amount = ?, transaction_type = ?, note = ?, color_code = ? WHERE id = ?',
                        [account_id, split_payment_id || null, transaction_name, amount, transaction_type, note || null, color_code, transactionId],
                        (err, updateResult) => {
                            if (err) {
                                console.log("Error from .put/:id from UPDATE transactions SET account_id = ?, split_payment_id = ?, transaction_name = ?, amount = ?, transaction_type = ?, note = ?, color_code = ? WHERE id = ?");
                                console.log("Database query failed");
                                console.log("Error:", err);
                                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                            }

                            db.query(
                                'UPDATE bankaccounts SET balance = ? WHERE id = ?',
                                [balance, account_id],
                                (err) => {
                                    if (err) {
                                        console.log("Error from .put/:id from UPDATE bankaccounts SET balance = ? WHERE id = ?");
                                        console.log("Database query failed");
                                        console.log("Error:", err);
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
                                                    console.log("Error from .put/:id from splitUpdateQuery");
                                                    console.log("Failed to update split payment");
                                                    console.log("Error:", err);
                                                    return res.status(500).json({ message: 'Failed to update split payment', error: err.message, success: false });
                                                }

                                                console.log("Transaction and split payment updated successfully")
                                                return res.status(200).json({ message: 'Transaction and split payment updated successfully', success: true });
                                            }
                                        );
                                    } else {
                                        console.log("Transaction updated successfully")
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

router.delete('/:id', jwtValidate, (req, res) => { //transaction_id
    const transactionId = req.params.id;
    const userId = req.user.UserID;

    console.log("Transaction ID:", transactionId)
    console.log("UserID:", userId)

    db.query(
        'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
        [transactionId, userId],
        (err, result) => {
            if (err) {
                console.log("Error from .delete/:id from SELECT * FROM transactions WHERE id = ? AND user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from .delete/:id from result.length === 0");
                console.log("Unauthorized user or transaction not found")
                return res.status(403).json({ message: 'Unauthorized user or transaction not found', success: false });
            }

            const transaction = result[0];
            console.log("Transaction:", transaction);

            db.query(
                'SELECT balance FROM bankaccounts WHERE id = ?',
                [transaction.account_id],
                (err, bankResult) => {
                    if (err) {
                        console.log("Error from .delete/:id from SELECT balance FROM bankaccounts WHERE id = ?");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    if (bankResult.length === 0) {
                        console.log("Error from .delete/:id from bankResult.length === 0");
                        console.log("Bank account not found")
                        return res.status(404).json({ message: 'Bank account not found', success: false });
                    }

                    let balance = bankResult[0].balance;
                    console.log("Balance:", balance);

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
                                    console.log("Error from .delete/:id from UPDATE bankaccounts SET balance = ? WHERE id = ?");
                                    console.log("Database query failed");
                                    console.log("Error:", err);
                                    return res.status(500).json({ message: 'Failed to update bank balance', error: err.message, success: false });
                                }

                                db.query('DELETE FROM transactions WHERE id = ?', [transactionId], (err) => {
                                    if (err) {
                                        console.log("Error from .delete/:id from DELETE FROM transactions WHERE id = ?");
                                        console.log("Database query failed");
                                        console.log("Error:", err);
                                        return res.status(500).json({ message: 'Failed to delete transaction', error: err.message, success: false });
                                    }

                                    console.log("Transaction deleted successfully")
                                    return res.status(200).json({ message: 'Transaction deleted successfully', success: true });
                                });
                            }
                        );
                    };

                    if (transaction.split_payment_id) {
                        console.log("Transaction has split payment");
                        db.query(
                            'SELECT remaining_balance, amount_allocated FROM splitpayments WHERE id = ?',
                            [transaction.split_payment_id],
                            (err, splitResult) => {
                                if (err) {
                                    console.log("Error from .delete/:id from SELECT remaining_balance, amount_allocated FROM splitpayments WHERE id = ?");
                                    console.log("Database query failed");
                                    console.log("Error:", err);
                                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                                }

                                if (splitResult.length === 0) {
                                    console.log("Error from .delete/:id from splitResult.length === 0");
                                    console.log("Split payment not found")
                                    return res.status(404).json({ message: 'Split payment not found', success: false });
                                }

                                let remainingBalance = splitResult[0].remaining_balance;
                                console.log("Remaining Balance:", remainingBalance);

                                if (transaction.transaction_type === 'expense') {
                                    remainingBalance += transaction.amount;
                                    if (remainingBalance > splitResult[0].amount_allocated) {
                                        console.log("Remaining Balance:", remainingBalance);
                                        console.log("From .delete/:id from remainingBalance > splitResult[0].amount_allocated");
                                        console.log("Remaining balance cannot exceed allocated amount")
                                        return res.status(400).json({
                                            message: 'Error: Remaining balance cannot exceed allocated amount.',
                                            success: false
                                        });
                                    }
                                } else {
                                    remainingBalance -= transaction.amount;
                                    if (remainingBalance < 0) {
                                        console.log("Remaining Balance:", remainingBalance);
                                        console.log("From .delete/:id from remainingBalance < 0");
                                        console.log("Remaining balance cannot be negative")
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
                                            console.log("Error from .delete/:id from UPDATE splitpayments SET remaining_balance = ? WHERE id = ?");
                                            console.log("Database query failed");
                                            console.log("Error:", err);
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