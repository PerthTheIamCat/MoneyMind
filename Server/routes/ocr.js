const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
require('dayjs/locale/th'); // ใช้ภาษาไทย
dayjs.extend(customParseFormat);

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// 🔥 ตั้งค่าโฟลเดอร์ uploads/ ถ้ายังไม่มีให้สร้าง
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ ตั้งค่า multer ให้จัดการการอัปโหลดรูป
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `uploaded_${timestamp}${ext}`);
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded", success: false });
    }

    const imagePath = path.join(uploadDir, req.file.filename);
    const timestamp = Date.now();
    const rawTextPath = path.join(uploadDir, `ocr_raw_${timestamp}.txt`);
    const cleanedTextPath = path.join(uploadDir, `ocr_cleaned_${timestamp}.txt`);
    const extractedDataPath = path.join(uploadDir, `ocr_data_${timestamp}.json`);

    try {
        console.log(`🔍 Processing OCR for ${imagePath}`);

        // ✅ OCR อ่านภาพโดยตรง
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'tha+eng', // รองรับภาษาไทยและอังกฤษ
            { logger: m => console.log(m) }
        );

        console.log('📜 OCR Output (raw):\n', text);

        // ✅ บันทึก Raw OCR Text
        fs.writeFileSync(rawTextPath, text, 'utf8');

        // ✅ ทำความสะอาดข้อความ
        let cleanedText = cleanText(text);
        console.log('📜 OCR Output (cleaned):\n', cleanedText);

        // ✅ บันทึก Cleaned OCR Text
        fs.writeFileSync(cleanedTextPath, cleanedText, 'utf8');

        // ✅ ดึงข้อมูลที่ต้องการ
        const extractedData = extractReceiptData(cleanedText);
        console.log('📊 Extracted Data:', extractedData);

        // ✅ บันทึก Extracted Data เป็น JSON
        fs.writeFileSync(extractedDataPath, JSON.stringify(extractedData, null, 2), 'utf8');

        return res.status(200).json({
            message: "OCR success",
            success: true,
            imagePath,
            extractedData,
            savedFiles: {
                rawTextPath,
                cleanedTextPath,
                extractedDataPath
            }
        });

    } catch (error) {
        console.error('❌ OCR Error:', error);
        return res.status(500).json({ message: "OCR failed", error: error.message, success: false });
    }
});

// 📌 ฟังก์ชันทำความสะอาดข้อความ
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ') // ลบช่องว่างซ้ำกัน
        .replace(/[^\w\dก-ฮ๐-๙.,:/-]/g, '') // ลบอักขระพิเศษ
        .replace(/บท/g, 'บาท') // แก้ OCR อ่านผิดจาก 'บท' เป็น 'บาท'
        .replace(/php/g, '') // ลบอักขระที่ผิดพลาด
        .trim();
}

// 📌 ฟังก์ชันดึงข้อมูลจากใบเสร็จทุกประเภท
function extractReceiptData(text) {
    // 🏦 ธนาคาร / ร้านค้า
    const bankOrShopRegex = /(ธนาคาร|Bank|ร้าน|บริษัท|Shop|Store|7-11|Tesco|Lotus|Big C|Makro|True|AIS|DTAC|TOT|การไฟฟ้า|การประปา)\s*([\w\s]+)/;
    const bankOrShop = text.match(bankOrShopRegex)?.[0] || 'ไม่พบข้อมูล';

    // 📅 แปลง "วันที่" ให้อยู่ใน `Date` format
    const dateRegex = /(\d{1,2})\s*(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?)\s*(\d{2,4})/;
    const dateMatch = text.match(dateRegex);
    let formattedDate = null;

    if (dateMatch) {
        let [_, day, monthThai, year] = dateMatch;
        const monthMap = {
            "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
            "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
            "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12"
        };
        let month = monthMap[monthThai] || "01"; // เผื่อ OCR อ่านผิด

        // 🔥 แปลงปี พ.ศ. -> ค.ศ.
        if (parseInt(year) > 2500) {
            year = parseInt(year) - 543;
        }

        // 🔥 แปลงเป็น `Date` format
        formattedDate = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD").toDate();
    }

    // ⏰ เวลา
    const timeRegex = /(\d{1,2}):(\d{2})/;
    const timeMatch = text.match(timeRegex);
    const formattedTime = timeMatch ? dayjs(`${timeMatch[1]}:${timeMatch[2]}`, "HH:mm").toDate() : null;

    // 🔢 หมายเลขอ้างอิง
    const refRegex = /(INV|RECEIPT|TAX|BAYM|SCB|KTB|KBank|TTB|UOB|CIMB|GSB|BBL|TMB|QR|PAYMENT|REF)\d+/;
    const referenceNo = text.match(refRegex)?.[0] || 'ไม่พบข้อมูล';

    // 💰 จำนวนเงิน
    const moneyRegex = /([\d,]+(?:\.\d{1,2})?)\s*(THB|บาทถ้วน|บาท)/g;
    let moneyMatches = [...text.matchAll(moneyRegex)].map(m => parseFloat(m[1].replace(/,/g, '')));
    const totalAmount = moneyMatches.length > 0 ? Math.max(...moneyMatches).toFixed(2) : 'ไม่พบข้อมูล';

    // 💲 VAT 7%
    const vatRegex = /ภาษีมูลค่าเพิ่ม\s*([\d,]+(?:\.\d{1,2})?)\s*(THB|บาท)/;
    const vatMatch = text.match(vatRegex);
    const vat = vatMatch ? parseFloat(vatMatch[1].replace(/,/g, '')).toFixed(2) : '0.00';

    return { bankOrShop, date: formattedDate, time: formattedTime, referenceNo, totalAmount, vat };
}

module.exports = router;