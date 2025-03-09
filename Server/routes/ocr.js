const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
// 📌 เพิ่ม Jimp สำหรับการประมวลผลภาพล่วงหน้า (Preprocessing)
const Jimp = require('jimp');

require('dayjs/locale/th'); // ใช้งานภาษาไทย
dayjs.extend(customParseFormat);

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// กำหนดโฟลเดอร์สำหรับเก็บไฟล์อัปโหลด (uploads/) และสร้างโฟลเดอร์หากยังไม่มี
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่า Multer สำหรับจัดการไฟล์รูปภาพที่อัปโหลด
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

/**
 * รับคำขอ (POST) โดยคาดว่ามีไฟล์รูปภาพแนบมาด้วยในฟิลด์ 'image'
 * ทำการบันทึกไฟล์, ประมวลผลภาพล่วงหน้า (Preprocessing),
 * ดึงข้อความจากภาพ (OCR) จากนั้นจึงทำความสะอาดข้อความและดึงข้อมูลที่สำคัญ
 */
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
        console.log(`🔍 Preprocessing image: ${imagePath}`);

        // ─────────────────────────────────────────────────────
        // การประมวลผลภาพล่วงหน้า (Preprocessing) ด้วย Jimp
        // ─────────────────────────────────────────────────────
        let jimpImage = await Jimp.read(imagePath);

        // 1) แปลงภาพให้เป็นขาวดำ (Grayscale)
        jimpImage = jimpImage.grayscale();

        // 2) เพิ่ม Contrast เพื่อให้ตัวหนังสือชัดเจนขึ้น (ปรับค่าตามความเหมาะสม)
        jimpImage = jimpImage.contrast(0.5);

        // 3) แปลงภาพเป็นโทนขาวดำแบบไบนารี (Threshold)
        // สามารถปรับค่า { max: 128 } ตามลักษณะเฉพาะของภาพ
        jimpImage = jimpImage.threshold({ max: 128 });

        // บันทึกทับไฟล์ต้นฉบับ (หรืออาจบันทึกเป็นไฟล์ใหม่เพื่อเก็บข้อมูลไว้ใช้งาน)
        await jimpImage.writeAsync(imagePath);

        console.log('✅ Preprocessing completed.');

        // OCR อ่านข้อมูลจากภาพที่ผ่านการประมวลผลแล้ว
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'tha+eng', // รองรับภาษาไทยและภาษาอังกฤษ
            { logger: m => console.log(m) }
        );

        console.log('📜 OCR Output (raw):\n', text);

        // บันทึกข้อความดิบ (Raw OCR Text) ลงไฟล์ .txt
        fs.writeFileSync(rawTextPath, text, 'utf8');

        // ทำความสะอาดข้อความ (Clean Text)
        let cleanedText = cleanText(text);
        console.log('📜 OCR Output (cleaned):\n', cleanedText);

        // บันทึกข้อความที่ทำความสะอาดแล้วลงไฟล์ .txt
        fs.writeFileSync(cleanedTextPath, cleanedText, 'utf8');

        // ดึง (Extract) ข้อมูลสำคัญจากเนื้อความ (เช่น วันที่, ยอดเงิน)
        const extractedData = extractReceiptData(cleanedText);
        console.log('📊 Extracted Data:', extractedData);

        // บันทึกข้อมูลที่ดึงมาได้ในรูปแบบ JSON
        fs.writeFileSync(extractedDataPath, JSON.stringify(extractedData, null, 2), 'utf8');

        // ตอบกลับไปยัง client พร้อมข้อมูลการประมวลผล
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

/**
 * ฟังก์ชัน cleanText
 * ทำหน้าที่ลบอักขระหรือคำที่ไม่จำเป็น รวมทั้งแก้ไขคำผิดที่พบได้บ่อย
 * @param {string} text ข้อความดิบที่ได้จาก OCR
 * @returns {string} ข้อความที่ผ่านการทำความสะอาด
 */
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ') // ลบช่องว่างซ้ำซ้อน
        .replace(/[^\w\dก-ฮ๐-๙.,:/-]/g, '') // ลบอักขระพิเศษที่ไม่ต้องการ
        .replace(/บท/g, 'บาท') // แก้การอ่านผิดของ OCR
        .replace(/php/g, '') // ลบคำไม่จำเป็น
        .replace(/ยอดสทธ/g, 'ยอดสุทธิ') // แก้คำผิดที่พบบ่อย
        .replace(/รวม/g, 'รวม') // อาจใช้เพื่อแก้คำผิด หรือปรับแต่งตามความต้องการ
        .trim();
}

/**
 * ฟังก์ชัน extractReceiptData
 * ทำหน้าที่สกัด (Extract) ข้อมูลที่สำคัญจากใบเสร็จ เช่น
 * ชื่อธนาคาร/ร้านค้า, วันที่, เวลา, หมายเลขอ้างอิง, ยอดเงิน, ภาษี ฯลฯ
 * @param {string} text ข้อความ (หลังทำความสะอาด) ที่ได้จาก OCR
 * @returns {Object} วัตถุ (Object) ที่บรรจุข้อมูลสำคัญของใบเสร็จ
 */
function extractReceiptData(text) {
    // ตรวจสอบชื่อธนาคารหรือร้านค้า
    const bankOrShopRegex = /(ธนาคาร|Bank|ร้าน|บริษัท|Shop|Store|7-11|Tesco|Lotus|Big C|Makro|True|AIS|DTAC|TOT|การไฟฟ้า|การประปา)\s*([\w\s]+)/;
    const bankOrShop = text.match(bankOrShopRegex)?.[0] || 'ไม่พบข้อมูล';

    // ตรวจสอบรูปแบบวันที่ (ภาษาไทย) เช่น "DD เดือน YYYY"
    const dateRegexThai = /(\d{1,2})\s*(ม\.?ค\.?|ก\.?พ\.?|มี\.?ค\.?|เม\.?ย\.?|พ\.?ค\.?|มิ\.?ย\.?|ก\.?ค\.?|ส\.?ค\.?|ก\.?ย\.?|ต\.?ค\.?|พ\.?ย\.?|ธ\.?ค\.?)\s*(\d{2,4})/;
    // ตรวจสอบรูปแบบวันที่ (ตัวเลขล้วน) เช่น "DD/MM/YYYY" หรือ "DD-MM-YYYY"
    const dateRegexNumeric = /(?:วัน[ที่ที]\s*[:：]?\s*)?(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;

    let formattedDate = null;

    // ตรวจสอบ "DD เดือน YYYY" (ไทย)
    const dateMatchThai = text.match(dateRegexThai);
    if (dateMatchThai) {
        let [_, day, monthThai, year] = dateMatchThai;
        const monthMap = {
            "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
            "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
            "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12"
        };
        let month = monthMap[monthThai] || "01"; // เผื่อกรณี OCR อ่านผิด

        // แปลง พ.ศ. เป็น ค.ศ. (หากปีมากกว่า 2500)
        if (parseInt(year) > 2500) {
            year = parseInt(year) - 543;
        }

        formattedDate = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD").toDate();
    }

    // ตรวจสอบ "DD/MM/YYYY" (ตัวเลขล้วน) และใช้ได้เฉพาะถ้ายังไม่ได้ฟอร์แมตวันที่จากรูปแบบภาษาไทย
    const dateMatchNumeric = text.match(dateRegexNumeric);
    if (dateMatchNumeric && !formattedDate) {
        let [_, day, month, year] = dateMatchNumeric;
        if (parseInt(year) > 2500) {
            year = parseInt(year) - 543;
        }
        formattedDate = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD").toDate();
    }

    // ตรวจสอบเวลาในรูปแบบ HH:mm หรือ HH:mm:ss
    const timeRegex = /(\d{1,2}):(\d{2})(?::(\d{2}))?/;
    const timeMatch = text.match(timeRegex);
    let formattedTime = null;
    if (timeMatch) {
        let hours = timeMatch[1];
        let minutes = timeMatch[2];
        let seconds = timeMatch[3] || "00"; // กรณีที่ไม่มีวินาที
        formattedTime = dayjs(`${hours}:${minutes}:${seconds}`, "HH:mm:ss").toDate();
    }

    // ตรวจสอบหมายเลขอ้างอิง (Reference No.)
    const refRegex = /(INV|RECEIPT|TAX|BAYM|SCB|KTB|KBank|TTB|UOB|CIMB|GSB|BBL|TMB|QR|PAYMENT|REF)\d+/;
    const referenceNo = text.match(refRegex)?.[0] || 'ไม่พบข้อมูล';

    // ตรวจสอบยอดเงินรวม
    // หา "จำนวนเงิน" / "รวม" / "ยอดสุทธิ" / "โอนเงิน" ตามด้วยตัวเลข
    const moneyRegex = /(?:จำนวนเงิน|รวม|ยอดสุทธิ|โอนเงิน)?\s*[:：]?\s*([\d]{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(THB|บาทถ้วน|บาท)?/gi;
    let moneyMatches = [...text.matchAll(moneyRegex)]
        // กรองเฉพาะรายการที่มีตัวเลข และมีบริบทเกี่ยวกับยอดเงิน
        .filter(m => m[1] && (m[2] || /(?:จำนวนเงิน|รวม|ยอดสุทธิ|โอนเงิน)/.test(text.substring(m.index - 15, m.index))))
        // แปลงเป็น float โดยตัด ',' ออกก่อน
        .map(m => parseFloat(m[1].replace(/,/g, '')));

    const totalAmount = moneyMatches.length > 0 ? Math.max(...moneyMatches).toFixed(2) : 'ไม่พบข้อมูล';

    // ตรวจสอบภาษีมูลค่าเพิ่ม (VAT) 7%
    const vatRegex = /ภาษีมูลค่าเพิ่ม\s*([\d,]+(?:\.\d{1,2})?)\s*(THB|บาท)/;
    const vatMatch = text.match(vatRegex);
    const vat = vatMatch ? parseFloat(vatMatch[1].replace(/,/g, '')).toFixed(2) : '0.00';

    return { bankOrShop, date: formattedDate, time: formattedTime, referenceNo, totalAmount, vat };
}

module.exports = router;
