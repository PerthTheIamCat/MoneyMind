const express = require('express')
// const cv = require('opencv4nodejs');
const multer = require('multer');
const router = express.Router()
const fs = require('fs');
require('dotenv').config();

const Tesseract = require('tesseract.js');
const path = require('path');

const { router: authRouter, jwtValidate, otpValidate, getUserIDbyusername, getUserIDbyemail } = require('./auth')
const db = require('./db');

// (1) ระบุไฟล์รูป OCR
//const imagePath = path.join(__dirname, 'K.jpg'); // เปลี่ยนเป็นชื่อไฟล์จริง

router.use(express.json())
router.use(express.urlencoded({ extended: false }))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        console.error("No file uploaded");
        return res.status(400).json({ message: "No image uploaded", success: false });
    }

    console.log("Uploaded File Info:", req.file);
    Tesseract.recognize(
        req.file.path,
        'tha+eng', // ใช้ภาษาไทย + อังกฤษ
        { logger: m => console.log(m) }
    )
        .then(({ data: { text } }) => {
            console.log('OCR Output (raw):\n', text);

            // ----------------------------------------------------------------------
            // (2) ทำความสะอาดข้อความ (Cleaning)
            // ----------------------------------------------------------------------
            let cleanedText = text
                // 2.1 ตัดช่องว่างซ้ำให้เหลือช่องว่างเดียว
                .replace(/\s+/g, ' ')
                // 2.2 ตัดอักขระพิเศษที่อาจรบกวนการทำงานของ Regex
                .replace(/[^\w\dก-ฮ๐-๙.,:/-]/g, '')
                // 2.3 แก้การติดกันของวัน/เดือน เช่น "26ม.ค." → "26 ม.ค."
                .replace(
                    /(\d{1,2})\s*(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?)/g,
                    '$1 $2'
                )
                // 2.4 แก้คำ OCR ผิด เช่น "จํานวนเงน", "คธรรมนยม"
                .replace(/จ[ำบ]วนเงิน|จำนวนงิน|จํานวนงน|จำนวนเงน|จนวนงน/g, 'จำนวนเงิน')
                .replace(/คธรรมนยม|คาธรรมนยม/g, 'ค่าธรรมเนียม')
                // 2.5 จัดรูปแบบตัวเลข เช่น "5.000.00" → "5000.00"
                .replace(/(\d+)\.(\d{3})\.(\d{2})/, '$1$2.$3')
                // 2.6 กันกรณี "จำนวนเงิน5000" → "จำนวนเงิน 5000"
                .replace(/จำนวนเงิน(\d+)/, 'จำนวนเงิน $1')
                // 2.7 กันค่าธรรมเนียม "000" → "0.00"
                .replace(/ค่าธรรมเนียม\s*000/, 'ค่าธรรมเนียม 0.00')
                // 2.8 ใส่ช่องว่าง เมื่อปี (2 หลัก) ติดกับเวลา (เช่น 6709:50 → 67 09:50)
                .replace(/(\d{2})(\d{1,2}:\d{2})/g, '$1 $2')
                // 2.9 จัดการ "น." ต่อท้ายเวลา (ถ้าเจอ)
                .replace(/(\d{1,2}:\d{2})น\.?/g, '$1 น.')
                // 2.10 ถ้า OCR อ่าน "บท" แทน "บาท" ให้แก้เป็น "บาท"
                .replace(/บท/g, 'บาท')
                // 2.11 ลบ "php" ที่ติดมาไม่พึงประสงค์
                .replace(/php/g, '')
                // 2.12 ถ้าเจอ "จำนวนเงิน 5000.00abc" → "จำนวนเงิน 5000.00 บาท"
                .replace(/จำนวนเงิน\s*(\d+\.\d{2})[^0-9]/, 'จำนวนเงิน $1 บาท');

            console.log('\nOCR Output (cleaned):\n', cleanedText);

            // ----------------------------------------------------------------------
            // (3) ดึงวันที่และเวลา (day / month / year / hour / minute)
            // ----------------------------------------------------------------------
            const dateTimeRegex = /(\d{1,2})\s*(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?)\s*(\d{2,4})[,\s-]*(\d{1,2}):(\d{2})(?: น\.?)?/;
            const dateTimeMatch = cleanedText.match(dateTimeRegex);

            let dateMatch, timeMatch;
            if (dateTimeMatch) {
                const [, day, month, year, hour, minute] = dateTimeMatch;
                dateMatch = `${day} ${month} ${year}`;
                timeMatch = `${hour}:${minute}`;
            } else {
                dateMatch = 'ไม่พบข้อมูล';
                timeMatch = 'ไม่พบข้อมูล';
            }

            // ----------------------------------------------------------------------
            // (4) ดึงค่าธรรมเนียม (fee)
            // ----------------------------------------------------------------------
            // จับ "ค่าธรรมเนียม ... บาท" หากไม่เจอให้เป็น 0.00
            let fee = '0.00';
            const feeMatch = cleanedText.match(
                /(?:ค่าธรรมเนียม)\s*([\d,]+(?:\.\d{1,2})?)?\s*บาท/
            );
            if (feeMatch && feeMatch[1]) {
                fee = feeMatch[1].replace(/,/g, '');
            }

            // ----------------------------------------------------------------------
            // (5) ดึง "จำนวนเงิน" หลัก (amount) โดยใช้ “ค่าที่มากที่สุด” แทนการเอา “ตัวสุดท้าย”
            // ----------------------------------------------------------------------
            //  ขั้นตอน:
            //    5.1 matchAll() -> หา "ตัวเลข + บาท" ทั้งหมดในสลิป
            //    5.2 แปลงเป็น Number แล้วเลือกค่าสูงสุด
            //    5.3 ถ้าไม่พบเลยให้เป็น 'ไม่พบข้อมูล'

            const moneyMatches = [...cleanedText.matchAll(
                /([\d,]+(?:\.\d{1,2}))\s*บาท/g
            )];
            let amount = 'ไม่พบข้อมูล';

            if (moneyMatches.length > 0) {
                // ดึงเฉพาะ group(1) → ลบ "," → parseFloat
                const numbers = moneyMatches.map(m => parseFloat(m[1].replace(/,/g, '')));
                // เลือกค่าที่มากที่สุด (หรือคุณจะเลือกตัวแรก/ตัวท้ายก็ได้ตามต้องการ)
                const maxVal = Math.max(...numbers);

                // สมมติถ้า maxVal = 0 แสดงว่าเจอแต่ 0.00 บาท
                // เราอาจเช็คเงื่อนไขเพิ่มเติม หรือถือว่าคือ '0.00'
                if (maxVal > 0) {
                    amount = maxVal.toFixed(2);
                } else {
                    amount = '0.00';
                }
            }

            // ----------------------------------------------------------------------
            // (6) รวมผลลัพธ์
            // ----------------------------------------------------------------------
            const extractedData = {
                date: dateMatch,   // ตัวอย่าง: "31 ธ.ค. 67"
                time: timeMatch,   // ตัวอย่าง: "09:50"
                amount,           // ตัวอย่าง: "5316.00"
                fee               // ตัวอย่าง: "0.00"
            };

            console.log('\nData:', extractedData);
            return res.status(200).json({ message: "OCR success", success: true, extractedData })
        })
        .catch(err => {
            console.error('Error:', err);
            return res.status(500).json({ message: "OCR not success", error: err.message, success: false });
        });
})

module.exports = router