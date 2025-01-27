const express = require('express')
const nodemailer = require("nodemailer")
const router = express.Router()

router.use(express.json());
router.use(express.urlencoded({ extended: false }))

router.post('/', async (req, res) => {
    const { email, subject, text, html } = req.body;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: 'nakrobpanejohn@gmail.com',
            pass: 'xkgd alam gjvj gwzc'
        }
    })

    const msg = {
        from: '"MoneyMind" <no-reply@gmail.com>',
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
        res.status(200).json({ message: "Email sent successfully!", messageId: info.messageId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }

})

module.exports = router