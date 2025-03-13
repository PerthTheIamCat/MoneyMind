const express = require('express')  // Import express
const router = express.Router()     // Create express app
require('dotenv').config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const { router: authRouter, jwtValidate, getUserIDbyusername, getUserIDbyemail } = require('./auth')
const db = require('./db');
const { use } = require('./ocr');

router.post('/retirement', jwtValidate, (req, res) => {
    const { user_id,
        amount_allocated,
        color_code,
        icon_id
    } = req.body;

    const split_name = "Retirement"

    console.log("DATA:", user_id, split_name, amount_allocated, color_code, icon_id)

    if (req.user.UserID !== user_id) {
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (!user_id || !amount_allocated) {
        console.log("Please fill all fields")
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'SELECT * FROM bankaccounts WHERE user_id = ? AND account_name = "Retirement"',
        [user_id],
        (err, result) => {
            if (err) {
                console.log("Error from /retirement from SELECT * FROM bankaccounts WHERE user_id = ? AND account_name = 'Retirement'");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from /retirement from result.length === 0");
                console.log("Bankaccount not found");
                return res.status(403).json({ message: 'Bankaccount not found', success: false });
            }

            const account_id = result[0].id

            db.query(
                'SELECT * FROM splitpayments WHERE account_id = ? AND split_name = "Retirement"',
                [account_id],
                (err, result) => {
                    if (err) {
                        console.log("Error from /retirement from SELECT * FROM splitpayments WHERE account_id = ? AND split_name = 'Retirement'");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    const splitResult = result[0];

                    if (result.length > 0) {

                       db.query(
                        'UPDATE splitpayments SET account_id = ?, split_name = ? , amount_allocated = ? , remaining_balance = ?, color_code = ?, icon_id = ? WHERE id = ?',
                        [account_id, split_name, amount_allocated, splitResult.remaining_balance, color_code || null, icon_id || null, splitResult.id],
                        (err, result) => {
                            if (err) {
                                console.log("Error from /retirement from UPDATE splitpayments SET account_id = ?, split_name = ? , amount_allocated = ? , remaining_balance = ?, color_code = ?, icon_id = ? WHERE id = ?");
                                console.log("Database query failed");
                                console.log("Error:", err);
                                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                            }

                                console.log('Retirement Splitpayment Updated')
                                return res.status(200).json({ result, message: 'Retirement Splitpayment Updated', success: true })
                            })
                    } else {
                        db.query(
                            'INSERT INTO splitpayments (account_id, split_name, amount_allocated, remaining_balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?, ?)',
                            [account_id, split_name, amount_allocated, 0, color_code || null, icon_id || null],
                            (err, splitpeyResult) => {
                                if (err) {
                                    console.log("Error from /retirement from INSERT INTO splitpayments (account_id, split_name, amount_allocated, remaining_balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?, ?)");
                                    console.log("Database query failed");
                                    console.log("Error:", err);
                                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                                }

                                console.log('Retirement Splitpayment Created')
                                return res.status(201).json({ splitpeyResult, message: 'Retirement Splitpayment Created', success: true })
                            }
                        )
                    }
                }
            )
        }
    )

});

router.post('/create', jwtValidate, (req, res) => {
    const { user_id,
        account_id,
        split_name,
        amount_allocated,
        color_code,
        icon_id
    } = req.body;

    const remaining_balance = amount_allocated

    console.log("DATA:", user_id, account_id, split_name, amount_allocated, color_code, icon_id)
    console.log("Remaining Balance:", remaining_balance)

    if (req.user.UserID !== user_id) { //user_id
        console.log("Unauthorized user")
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (split_name === "Retirement") {
        console.log("Split name cannot be Retirement")
        return res.status(400).json({ message: 'Split name cannot be Retirement', success: false });
    }

    if (!user_id || !account_id || !split_name || !amount_allocated) {
        console.log("Please fill all fields")
        return res.status(400).json({ message: 'Please fill all fields', success: false });
    }

    db.query(
        'SELECT ba.balance, SUM(sp.remaining_balance) AS sumAmount FROM bankaccounts ba LEFT JOIN splitpayments sp ON ba.id = sp.account_id WHERE ba.id = ? and ba.user_id = ? GROUP BY ba.id, ba.balance',
        [account_id, user_id],
        (err, result) => {
            if (err) {
                console.log("Error from /create from SELECT ba.balance, SUM(sp.amount_allocated) AS sumAmount FROM bankaccounts ba LEFT JOIN splitpayments sp ON ba.id = sp.account_id WHERE ba.id = ? and ba.user_id = ? GROUP BY ba.id, ba.balance");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from /create from result.length === 0");
                console.log("Unauthorized user or Split Pay not found");
                return res.status(403).json({ message: 'Unauthorized user or Split Pay not found', success: false });
            }

            let sumSplitpay = result[0]
            console.log("Sum amount splitpayment:", sumSplitpay)

            let remaining = sumSplitpay.balance - sumSplitpay.sumAmount
            console.log("Remaining can allocate from balance:", remaining)

            if (remaining - amount_allocated < 0) {
                console.log("Error from /create from remaining - amount_allocated < 0");
                console.log("Your Bank balance remaining does not enough")
                return res.status(400).json({ message: 'Your Bank balance remaining does not enough', success: false });
            }

            db.query(
                'INSERT INTO splitpayments (account_id, split_name, amount_allocated, remaining_balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?, ?)',
                [account_id, split_name, amount_allocated, remaining_balance, color_code || null, icon_id || null],
                (err, splitpeyResult) => {
                    if (err) {
                        console.log("Error from /create from INSERT INTO splitpayments (account_id, split_name, amount_allocated, remaining_balance, color_code, icon_id) VALUES (?, ?, ?, ?, ?, ?)");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    console.log('Splitpayment Created')
                    return res.status(201).json({ splitpeyResult, message: 'Splitpayment Created', success: true })
                }
            )
        }
    )
})

router.get('/:id', jwtValidate, (req, res) => { //account_id

    db.query(
        'SELECT * FROM splitpayments WHERE account_id = ?',
        [req.params.id, req.user.UserID],
        (err, result) => {
            if (err) {
                console.log("Error from .get/:id from SELECT * FROM splitpayments WHERE account_id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from .get/:id from result.length === 0");
                console.log("Splitpayment not found or Unauthorized user");
                return res.status(404).json({ message: 'Splitpayment not found or Unauthorized user', success: false });
            }

            console.log("Get Splitpayment")
            return res.status(200).json({ result, success: true });
        }
    )
})

router.put('/:id', jwtValidate, (req, res) => { //splitpayment_id
    const splitPaymentId = req.params.id;
    const { split_name, amount_allocated, color_code, icon_id } = req.body;

    console.log("DATA:", split_name, amount_allocated, color_code, icon_id)

    db.query(
        'SELECT sp.account_id, ba.user_id, sp.amount_allocated, sp.remaining_balance FROM splitpayments sp JOIN bankaccounts ba ON sp.account_id = ba.id WHERE sp.id = ? AND ba.user_id = ?',
        [splitPaymentId, req.user.UserID],
        (err, result) => {
            if (err) {
                console.log("Error from .put/:id from SELECT sp.account_id, ba.user_id, sp.amount_allocated, sp.remaining_balance FROM splitpayments sp JOIN bankaccounts ba ON sp.account_id = ba.id WHERE sp.id = ? AND ba.user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err)
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }
            if (result.length === 0) {
                console.log("Error from .put/:id from result.length === 0");
                console.log("Unauthorized user or split payment not found");
                return res.status(403).json({ message: 'Unauthorized user or split payment not found', success: false });
            }

            const bankId = result[0].account_id
            const amount_allocated_old = result[0].amount_allocated
            let remaining_balance_old = result[0].remaining_balance

            console.log("Bank ID:", bankId)
            console.log("Amount Allocated Old:", amount_allocated_old)
            console.log("Remaining Balance Old:", remaining_balance_old)

            db.query(
                'SELECT ba.balance, SUM(sp.amount_allocated) AS sumAmount FROM bankaccounts ba LEFT JOIN splitpayments sp ON ba.id = sp.account_id WHERE ba.id = ? and ba.user_id = ? GROUP BY ba.id, ba.balance',
                [bankId, req.user.UserID],
                (err, result) => {
                    if (err) {
                        console.log("Error from .put/:id from SELECT ba.balance, SUM(sp.amount_allocated) AS sumAmount FROM bankaccounts ba LEFT JOIN splitpayments sp ON ba.id = sp.account_id WHERE ba.id = ? and ba.user_id = ? GROUP BY ba.id, ba.balance");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }

                    if (result.length === 0) {
                        console.log("Error from .put/:id from result.length === 0");
                        console.log("Bankaccount not found");
                        return res.status(403).json({ message: 'Bankaccount not found', success: false });
                    }

                    let sumSplitpay = result[0]
                    console.log("Sum Splitpayment:", sumSplitpay)


                    let remaining = sumSplitpay.balance - sumSplitpay.sumAmount + amount_allocated_old
                    console.log("Remaining can allocate:", remaining)

                    let remaining_balance_new = remaining_balance_old + amount_allocated - amount_allocated_old

                    console.log("Remaining Balance New:", remaining_balance_new)

                    if (remaining - amount_allocated < 0) {
                        console.log("Error from .put/:id from remaining - amount_allocated < 0");
                        console.log("Your Bank balance remaining does not enough");
                        return res.status(400).json({ message: 'Your Bank balance remaining does not enough', success: false });
                    } else if (remaining_balance_new < 0) {
                        console.log("Error from .put/:id from remaining_balance_new < 0");
                        console.log("Your Split Payment remaining balance does not enough");
                        return res.status(400).json({ message: 'Your Split Payment remaining balance does not enough', success: false });
                    } else {
                        db.query(
                            'UPDATE splitpayments SET split_name = ?, amount_allocated = ?, remaining_balance = ?, color_code = ?, icon_id = ? WHERE id = ?',
                            [split_name, amount_allocated, remaining_balance_new, color_code, icon_id || null, splitPaymentId],
                            (err, updateResult) => {
                                if (err) {
                                    console.log("Error from .put/:id from UPDATE splitpayments SET split_name = ?, amount_allocated = ?, remaining_balance = ?, color_code = ?, icon_id = ? WHERE id = ?");
                                    console.log("Database query failed");
                                    console.log("Error:", err);
                                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                                }

                                console.log("Split Payment updated successfully")
                                return res.status(200).json({ message: 'Split Payment updated successfully', success: true });
                            }
                        );
                    }
                }
            )
        }
    );
})

router.delete('/:id', jwtValidate, (req, res) => { //splitpayment_id
    const splitPaymentId = req.params.id;

    console.log("Split Payment ID:", splitPaymentId)

    db.query(
        'SELECT sp.account_id, ba.user_id FROM splitpayments sp JOIN bankaccounts ba ON sp.account_id = ba.id WHERE sp.id = ? AND ba.user_id = ?',
        [splitPaymentId, req.user.UserID],
        (err, result) => {
            if (err) {
                console.log("Error from .delete/:id from SELECT sp.account_id, ba.user_id FROM splitpayments sp JOIN bankaccounts ba ON sp.account_id = ba.id WHERE sp.id = ? AND ba.user_id = ?");
                console.log("Database query failed");
                console.log("Error:", err);
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                console.log("Error from .delete/:id from result.length === 0");
                console.log("Unauthorized user or split payment not found");
                return res.status(403).json({ message: 'Unauthorized user or split payment not found', success: false });
            }

            db.query(
                'UPDATE transactions SET split_payment_id = NULL WHERE split_payment_id = ?',
                [splitPaymentId],
                (err, updateResult) => {
                    if (err) {
                        console.log("Error from .delete/:id from UPDATE transactions SET split_payment_id = NULL WHERE split_payment_id = ?");
                        console.log("Database query failed");
                        console.log("Error:", err);
                        return res.status(500).json({ message: 'Failed to update transactions', error: err.message, success: false });
                    }

                    db.query('DELETE FROM splitpayments WHERE id = ?', [splitPaymentId], (err, deleteResult) => {
                        if (err) {
                            console.log("Error from .delete/:id from DELETE FROM splitpayments WHERE id = ?");
                            console.log("Database query failed");
                            console.log("Error:", err);
                            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                        }

                        console.log("Split Payment deleted successfully and related transactions updated")
                        return res.status(200).json({ updateResult, message: 'Split Payment deleted successfully and related transactions updated', success: true });
                    });
                }
            );
        }
    );
})


module.exports = {
    router
}