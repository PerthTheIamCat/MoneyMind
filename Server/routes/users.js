const express = require('express')  // Import express
const router = express.Router()     // Create express app
const bcrypt = require('bcrypt')
require('dotenv').config();

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

const {router: authRouter, jwtValidate, otpValidate, getUserIDbyusername, getUserIDbyemail} = require('./auth')
const db = require('./db');

router.get('/', jwtValidate, (req, res) => {

    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
        }
        return res.status(200).json(result);
    });
});

router.post('/forgotpwd', otpValidate, (req, res) => {
    const { password} = req.body

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters', success: false});
    }

    if(req.user.otpValidate){
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err)
                return res.status(500).json({ message: 'Password hashing failed', error: err.message, success: false});
            }
        
            db.query(
                'UPDATE users SET password = ? WHERE email = ?', [hash, req.user.email], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                    }
        
                    if (result.length === 0) {
                        return res.status(404).json({ message: 'User not found', success: false });
                       }
    
                       req.user.otpValidate = false
        
                       return res.status(200).json({ message: 'Password Changed', success: true });
                }
            )
        })
    }else{
        return res.status(400).json({ message: 'Cannot validate OTP', success: false });
    }

})

router.get('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
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

router.put('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    if (req.body.id || req.body.password || req.body.email){
        console.log('Can not change!')
        return res.status(400).json({message: 'Can not change!', success: false})
    }else{
        db.query(
            'UPDATE users SET ? WHERE id = ?', [req.body, req.params.id], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
                }
    
                if (result.length === 0) {
                    return res.status(404).json({ message: 'User not found', success: false });
                }
    
                return res.status(200).json({ message: 'User updated', success: true });
            }
        )
    }
})

router.delete('/:id', jwtValidate, (req, res) => {
    if (req.user.UserID !== parseInt(req.params.id, 10)) { //user_id
        return res.status(403).json({ message: 'Unauthorized user', success: false });
    }

    db.query(
        'DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database query failed', error: err.message, success: false });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found', success: false });
            }

            res.status(200).json({ message: 'User deleted', success: true });
        }
    )
})

module.exports = {
    router
}