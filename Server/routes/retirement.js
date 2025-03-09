/******************************************************
 * retirementRouter.js
 ******************************************************/
const express = require('express');
const router = express.Router();
require('dotenv').config();

const { jwtValidate } = require('./auth'); // middleware ตรวจสอบ token
const db = require('./db');               // ถ้ามี DB ก็ require มา (ถ้าไม่ใช้ก็ลบทิ้ง)

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/**
 * =============================
 * 1) Helper Functions ของกองทุน
 * =============================
 */

/**
 * Future Value ของเงินสมทบประกันสังคม (Social Security)
 * - สมมติว่าพารามิเตอร์ salary เป็น "เงินรายปี"
 * - ถ้าจะจำกัดที่ 9,000 บาท/ปี (เพดานจ่ายประกันสังคม) ก็จับ min(5% ของเงินรายปี, 9000)
 */
function calculateFutureValueSocialSecurityFunds(fundsArray, retirementAge, annualSalary, nominalRate) {
  // ถ้าไม่ใช่ array หรือเป็น array ว่าง => FV = 0
  if (!Array.isArray(fundsArray) || fundsArray.length === 0) return 0;

  let totalFV = 0;

  fundsArray.forEach((fund) => {
    const {
      startWorkingYear = 0,
      currentYear = 0,
      salaryIncreaseRate = 0
    } = fund;

    let yearsWorked = currentYear - startWorkingYear;
    let yearsToRetirement = retirementAge - yearsWorked;

    if (yearsToRetirement <= 0) return;

    let individualFV = 0;
    for (let t = 0; t < yearsToRetirement; t++) {
      let salary = annualSalary * Math.pow(1 + salaryIncreaseRate, t);

      // 5% ของเงินรายปี จำกัดที่ 9000 ต่อปี
      let annualContribution = Math.min(salary * 0.05, 9000);

      individualFV += annualContribution * Math.pow(1 + nominalRate, yearsToRetirement - t);
    }

    totalFV += individualFV;
  });

  return totalFV;
}

/**
 * Future Value ของกองทุนการออมแห่งชาติ (NSF)
 * - สมมติว่าปีไหนก็ออมเท่ากันทุกปี = savingsPerYear
 * - พอเกษียณก็ได้ FV จากการทบต้น
 */
function calculateFutureValueNSF(fundsArray, currentAge, retirementAge, nominalRate) {
  if (!Array.isArray(fundsArray) || fundsArray.length === 0) return 0;

  let yearsToRetirement = retirementAge - currentAge;
  if (yearsToRetirement <= 0) return 0;

  let totalFV = 0;

  fundsArray.forEach((fund) => {
    const {
      ageStarted = 0,
      savingsPerYear = 0
    } = fund;

    let individualFV = savingsPerYear * (
      (Math.pow(1 + nominalRate, yearsToRetirement) - 1) / nominalRate
    );
    totalFV += individualFV;
  });

  return totalFV;
}

/**
 * Future Value ของกองทุนสำรองเลี้ยงชีพ (PVD)
 * - พารามิเตอร์ initialSalary เป็น "เงินรายปี"
 * - ลบ *12 ที่ซ้ำซ้อนออก
 * - สมมติ employerContribution = salary * (contributionRate/100) ไม่ต้องคูณเพิ่ม
 */
function calculateFutureValuePvdFunds(fundsArray, annualSalary, yearsToRetirement) {
  if (!Array.isArray(fundsArray) || fundsArray.length === 0) return 0;
  if (yearsToRetirement <= 0) return 0;

  let totalFV = 0;

  fundsArray.forEach((fund) => {
    const {
      salaryIncreaseRate = 0,
      savingsRate = 0,
      contributionRate = 0,
      investmentReturnRate = 0,
      accumulatedMoney = 0,
      employeeContributions = 0,
      accumulatedBenefits = 0,
      contributionBenefits = 0
    } = fund;

    let totalFundMoney =
      accumulatedMoney +
      employeeContributions +
      accumulatedBenefits +
      contributionBenefits;

    // งอกเงยจากการลงทุนในอนาคต
    let futureValCurrent = totalFundMoney * Math.pow(1 + investmentReturnRate, yearsToRetirement);

    // คำนวณเงินสมทบในอนาคต
    let futureValContrib = 0;
    for (let year = 0; year < yearsToRetirement; year++) {
      let salary = annualSalary * Math.pow(1 + salaryIncreaseRate, year);

      // ฝั่งลูกจ้าง
      let employeeSavings = salary * (savingsRate / 100);

      // ฝั่งนายจ้าง
      let employerContribution = salary * (contributionRate / 100);

      // รวมกันถือเป็น annual contribution
      let annualCont = (employeeSavings + employerContribution);

      // ทบต้นในอนาคต
      futureValContrib += annualCont * Math.pow(1 + investmentReturnRate, yearsToRetirement - year);
    }

    totalFV += (futureValCurrent + futureValContrib);
  });

  return totalFV;
}

/**
 * Future Value ของ RMF
 */
function calculateFutureValueRMF(fundsArray, yearsToRetirement) {
  if (!Array.isArray(fundsArray) || fundsArray.length === 0) return 0;
  if (yearsToRetirement <= 0) return 0;

  let totalFV = 0;
  let n = yearsToRetirement;

  fundsArray.forEach((fund) => {
    const {
      currentBalance = 0,
      annualInvestment = 0,
      rateOfReturn = 0
    } = fund;

    let futureValueCurrent = currentBalance * Math.pow(1 + rateOfReturn, n);
    let futureValueDCA = annualInvestment * ((Math.pow(1 + rateOfReturn, n) - 1) / rateOfReturn);

    totalFV += (futureValueCurrent + futureValueDCA);
  });

  return totalFV;
}

/**
 * Future Value ของ SSF
 */
function calculateFutureValueSsfFunds(fundsArray, yearsToRetirement) {
  if (!Array.isArray(fundsArray) || fundsArray.length === 0) return 0;
  if (yearsToRetirement <= 0) return 0;

  let totalFV = 0;
  let n = yearsToRetirement;

  fundsArray.forEach((fund) => {
    const {
      currentBalance = 0,
      annualInvestment = 0,
      rateOfReturn = 0
    } = fund;

    let futureValueCurrent = currentBalance * Math.pow(1 + rateOfReturn, n);
    let futureValueDCA = annualInvestment * ((Math.pow(1 + rateOfReturn, n) - 1) / rateOfReturn);

    totalFV += (futureValueCurrent + futureValueDCA);
  });

  return totalFV;
}

/**
 * Future Value ของกองทุนบำเหน็จบำนาญข้าราชการ (GPF)
 * - พารามิเตอร์ initialSalary เป็น "เงินรายปี"
 */
function calculateFutureValueGPF(fundsArray, retirementAge, annualSalary, rateOfReturn) {
  if (!Array.isArray(fundsArray) || fundsArray.length === 0) return 0;

  let totalFV = 0;

  fundsArray.forEach((fund) => {
    const {
      yearStartedWorking = 0,
      currentYear = 0,
      savingsRate = 0,
      contributionRate = 0,

      accumulatedMoney = 0,
      employeeContributions = 0,
      accumulatedBenefits = 0,
      contributionBenefits = 0,
      compensation = 0,
      compensationBenefits = 0,

      initialMoney = 0,
      initialBenefits = 0
    } = fund;

    let yearsWorked = currentYear - yearStartedWorking;
    let yearsToRetirement = retirementAge - yearsWorked;

    if (yearsToRetirement <= 0) return;

    let totalFundMoney = (
      accumulatedMoney +
      employeeContributions +
      initialMoney +
      accumulatedBenefits +
      contributionBenefits +
      compensation +
      compensationBenefits +
      initialBenefits
    );

    // เงินต้นที่มีอยู่ทบต้นไปจนเกษียณ
    let futureValueCurrent = totalFundMoney * Math.pow(1 + rateOfReturn, yearsToRetirement);

    // เงินสมทบในอนาคต
    let futureValueContrib = 0;
    for (let year = 0; year < yearsToRetirement; year++) {
      let salary = annualSalary * Math.pow(1 + rateOfReturn, year);
      let employeeSavings = salary * (savingsRate / 100);
      let governmentContribution = salary * (contributionRate / 100);
      let totalContribution = (employeeSavings + governmentContribution);

      futureValueContrib += totalContribution * Math.pow(1 + rateOfReturn, yearsToRetirement - year);
    }

    totalFV += (futureValueCurrent + futureValueContrib);
  });

  return totalFV;
}

/**
 * Future Value ของ Life Insurance (สมมุติแบบสะสมทรัพย์)
 */
function calculateFutureValueLifeInsurance(lifeInsuranceArray, rateOfReturn, yearsToRetirement) {
  if (!Array.isArray(lifeInsuranceArray) || lifeInsuranceArray.length === 0) return 0;
  if (yearsToRetirement <= 0) return 0;

  let total = 0;
  lifeInsuranceArray.forEach((policy) => {
    const { currentValue = 0 } = policy;
    total += currentValue * Math.pow(1 + rateOfReturn, yearsToRetirement);
  });

  return total;
}

/**
 * =============================
 * 2) ฟังก์ชันคำนวณหลัก
 * =============================
 */

/**
 * (A) หาเงินก้อนที่ต้องมีเมื่อเกษียณ (Target Retirement Fund)
 */
function calculateTargetRetirementFund(annualExpense, postRetirementReturn, yearsInRetirement) {
  if (postRetirementReturn <= 0) {
    return annualExpense * yearsInRetirement;
  }
  return (
    annualExpense *
    (1 - Math.pow(1 + postRetirementReturn, -yearsInRetirement)) /
    postRetirementReturn
  );
}

/**
 * =============================
 * 3) Router Handler
 * =============================
 */
router.post('/', jwtValidate, (req, res) => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,

    monthlySalary,
    monthlyExpenses,
    expectedReturn, // ผลตอบแทนต่อปีก่อนเกษียณ

    monthlyExpensePostRetirement, // เงินที่ต้องใช้ต่อเดือนหลังเกษียณ (ค่าเงินปัจจุบัน)
    inflationRate,
    expectedPostRetirementReturn, // ผลตอบแทนต่อปีหลังเกษียณ

    socialSecurityFunds = [],
    nsfFunds = [],
    pvdFunds = [],
    rmfFunds = [],
    ssfFunds = [],
    gpfFunds = [],
    lifeInsurance = []
  } = req.body;

  // =====================
  // 1) Basic Validation
  // =====================
  if (
    currentAge == null ||
    retirementAge == null ||
    lifeExpectancy == null ||
    monthlySalary == null ||
    monthlyExpensePostRetirement == null ||
    inflationRate == null ||
    expectedReturn == null ||
    expectedPostRetirementReturn == null
  ) {
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ครบถ้วน'
    });
  }

  if (retirementAge >= lifeExpectancy) {
    return res.status(400).json({
      success: false,
      message: 'lifeExpectancy ต้องมากกว่า retirementAge'
    });
  }

  const yearsToRetirement = retirementAge - currentAge;
  if (yearsToRetirement <= 0) {
    return res.status(400).json({
      success: false,
      message: 'อายุเกษียณต้องมากกว่าปัจจุบัน'
    });
  }

  // =====================
  // 2) คำนวณ "เงินก้อนที่ต้องมี" ณ วันเกษียณ
  // =====================
  const futureMonthlyExpenseAtRetirement =
    monthlyExpensePostRetirement * Math.pow(1 + inflationRate, yearsToRetirement);
  const annualExpenseAtRetirement = futureMonthlyExpenseAtRetirement * 12;
  const yearsInRetirement = lifeExpectancy - retirementAge;

  const totalNeededAtRetirement = calculateTargetRetirementFund(
    annualExpenseAtRetirement,
    expectedPostRetirementReturn,
    yearsInRetirement
  );

  // =====================
  // 3) รวม Future Value ของกองทุนต่าง ๆ
  // =====================
  // สมมติ currentIncome = รายปี
  const currentIncome = monthlySalary * 12;

  const fvSocialSecurity = calculateFutureValueSocialSecurityFunds(
    socialSecurityFunds,
    retirementAge,
    currentIncome,
    0.035
  );
  const fvNsf = calculateFutureValueNSF(
    nsfFunds,
    currentAge,
    retirementAge,
    0.035
  );
  const fvPvd = calculateFutureValuePvdFunds(
    pvdFunds,
    currentIncome,
    yearsToRetirement
  );
  const fvRmf = calculateFutureValueRMF(rmfFunds, yearsToRetirement);
  const fvSsf = calculateFutureValueSsfFunds(ssfFunds, yearsToRetirement);

  // สมมติ GPF ใช้ expectedReturn เป็น rateOfReturn
  const fvGpf = calculateFutureValueGPF(
    gpfFunds,
    retirementAge,
    currentIncome,
    expectedReturn
  );
  const fvLifeIns = calculateFutureValueLifeInsurance(
    lifeInsurance,
    0.035,
    yearsToRetirement
  );

  const totalFundFV =
    fvSocialSecurity + fvNsf + fvPvd + fvRmf + fvSsf + fvGpf + fvLifeIns;

  // ตัวอย่าง: ไม่มี futureSavings อื่น => = 0
  const futureSavings = 0;

  // =====================
  // 4) เงินที่ขาด (Net Shortfall)
  // =====================
  const netShortfallAtRetirement = totalNeededAtRetirement - (totalFundFV + futureSavings);

  // =====================
  // 5) อยากให้ Monthly Saving มาจาก netShortfall ล้วน ๆ
  // =====================
  let monthlySavingNeeded = 0;
  if (netShortfallAtRetirement > 0) {
    monthlySavingNeeded = netShortfallAtRetirement / (yearsToRetirement * 12);
  }

  // ตัวแปร annualSavingNeeded
  let annualSavingNeeded = monthlySavingNeeded * 12;
  console.log("annualSavingNeeded =", annualSavingNeeded, "monthlySavingNeeded =", monthlySavingNeeded);

  // =====================
  // ส่งผลลัพธ์กลับ + บันทึกลง DB
  // =====================
  db.query(
    'SELECT * FROM retirementplan WHERE user_id = ?',
    [req.user.UserID],
    (err, result) => {
      if (err) {
        console.log("Error from SELECT * FROM retirementplan WHERE user_id = ?");
        console.log("Error:", err);
        return res.status(500).json({
          success: false,
          message: 'Database query failed'
        });
      }

      if (result.length === 0) {
        db.query(
          `INSERT INTO retirementplan 
            (user_id, total_savings_goal, total_fund_fv, netShortfallAtRetirement, monthly_savings_goal) 
          VALUES (?, ?, ?, ?, ?)`,
          [
            req.user.UserID,
            totalNeededAtRetirement ? totalNeededAtRetirement : 0,
            totalFundFV ? totalFundFV : 0,
            netShortfallAtRetirement ? netShortfallAtRetirement : 0,
            monthlySavingNeeded ? monthlySavingNeeded : 0
          ],
          (err, result) => {
            if (err) {
              console.log("Error from INSERT INTO retirementplan");
              console.log("Error:", err);
              return res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
              });
            }
            console.log("Returning response with calculated values (INSERT case)");
            return res.status(200).json({
              success: true,
              totalNeededAtRetirement,   // เงินก้อนที่ต้องมี ณ วันเกษียณ
              totalFundFV,               // รวม FV ของกองทุนทั้งหมด
              netShortfallAtRetirement,  // เงินที่ขาด
              monthlySavingNeeded        // ต้องออม/เดือน ตั้งแต่วันนี้จนวันเกษียณ
            });
          }
        );
      } else {
        db.query(
          `UPDATE retirementplan 
           SET total_savings_goal = ?, total_fund_fv = ?, netShortfallAtRetirement = ?, monthly_savings_goal = ? 
           WHERE user_id = ?`,
          [
            totalNeededAtRetirement ? totalNeededAtRetirement : 0,
            totalFundFV ? totalFundFV : 0,
            netShortfallAtRetirement ? netShortfallAtRetirement : 0,
            monthlySavingNeeded ? monthlySavingNeeded : 0,
            req.user.UserID
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
              });
            }
            console.log("Returning response with calculated values (UPDATE case)");
            return res.status(200).json({
              success: true,
              totalNeededAtRetirement,   // เงินก้อนที่ต้องมี ณ วันเกษียณ
              totalFundFV,               // รวม FV ของกองทุนทั้งหมด
              netShortfallAtRetirement,  // เงินที่ขาด
              monthlySavingNeeded        // ต้องออม/เดือน ตั้งแต่วันนี้จนวันเกษียณ
            });
          }
        );
      }
    }
  )
});

router.put('/', jwtValidate, (req, res) => {
  const {
    monthly_savings_goal,
    total_savings_goal,
    current_savings,
    total_fund_fv,
    netShortfallAtRetirement
  } = req.body;

  console.log("PUT / called with body:", req.body);

  if (
    monthly_savings_goal == null ||
    total_savings_goal == null ||
    current_savings == null ||
    total_fund_fv == null ||
    netShortfallAtRetirement == null
  ) {
    console.log("Validation failed: Missing required fields");
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  db.query(
    'SELECT * FROM retirementplan WHERE user_id = ?',
    [req.user.UserID],
    (err, result) => {
      if (err) {
        console.log("Error from SELECT * FROM retirementplan WHERE user_id = ?");
        console.log("Error:", err);
        return res.status(500).json({
          success: false,
          message: 'Database query failed'
        });
      }

      if (result.length === 0) {
        console.log("No retirement plan found for user");
        return res.status(404).json({
          success: false,
          message: 'No retirement plan found for user'
        });
      }

      db.query(
        `UPDATE retirementplan 
         SET monthly_savings_goal = ?, total_savings_goal = ?, current_savings = ?, total_fund_fv = ?, netShortfallAtRetirement = ?
         WHERE user_id = ?`,
        [
          monthly_savings_goal,
          total_savings_goal,
          current_savings,
          total_fund_fv,
          netShortfallAtRetirement,
          req.user.UserID
        ],
        (err, result) => {
          if (err) {
            console.log("Error from UPDATE retirementplan SET ... WHERE user_id = ?");
            console.log("Error:", err);
            return res.status(500).json({
              success: false,
              message: 'Database query failed'
            });
          }

          console.log("Returning response with updated values");
          return res.status(200).json({
            success: true,
            message: 'Updated retirement plan'
          });
        }
      );
    }
  );
});

module.exports = {
  router
};
