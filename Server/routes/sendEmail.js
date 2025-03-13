const express = require('express')
const nodemailer = require("nodemailer")
const router = express.Router()
require('dotenv').config();

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

const sendEmail = async ({ email, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const msg = {
        from: '"MoneyMind" <nakrobpanejohn@gmail.com>',
        to: email,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(msg);
        console.log('Message sent: %s', info.messageId);
        return { messageId: info.messageId, success: true };
    } catch (error) {
        console.log('Error sending email:', error);
        return { messageId: 'Error sending email', success: false };
    }
};

router.post('/', async (req, res) => {
    const { email, subject, text, html } = req.body;
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    const msg = {
        from: '"MoneyMind" <nakrobpanejohn@gmail.com>',
        to: `${email}`,
        subject: `${subject}`,
        text: `${text}`,
        html: `${html}`
    }

    try {
        // Use await here to get the resolved value of sendMail
        const info = await transporter.sendMail(msg);

        console.log('Email sent!');
        console.log("Message sent: %s", info.messageId);
        return res.status(200).json({ message: "Email sent successfully!", messageId: info.messageId, success: true});
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Failed to send email", error: error.message, success: false });
    }

})

module.exports = {
    router,
    sendEmail
}