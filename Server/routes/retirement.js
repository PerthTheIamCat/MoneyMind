/******************************************************
 * retirementRouter.js
 ******************************************************/
const express = require('express');
const router = express.Router();
require('dotenv').config();

const { jwtValidate } = require('./auth'); // สมมติว่ามี middleware ตรวจสอบ token
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
 */
function calculateFutureValueSocialSecurityFunds(fundsArray, retirementAge, initialSalary, nominalRate) {
  console.log("Entered calculateFutureValueSocialSecurityFunds", { fundsArray, retirementAge, initialSalary, nominalRate });
  let totalFV = 0;

  fundsArray.forEach((fund, index) => {
    const { startWorkingYear, currentYear, salaryIncreaseRate } = fund;
    console.log(`SocialSecurity Fund [${index}] input:`, fund);

    let yearsWorked = currentYear - startWorkingYear;
    let yearsToRetirement = retirementAge - yearsWorked;
    let individualFV = 0;

    for (let t = 0; t < yearsToRetirement; t++) {
      let salary = initialSalary * Math.pow(1 + salaryIncreaseRate, t);
      let annualContribution = Math.min(salary * 0.05 * 12, 9000);
      individualFV += annualContribution * Math.pow(1 + nominalRate, yearsToRetirement - t);
      console.log(`SocialSecurity Fund [${index}] year ${t}: salary=${salary}, annualContribution=${annualContribution}, interimFV=${individualFV}`);
    }

    totalFV += individualFV;
    console.log(`SocialSecurity Fund [${index}] individualFV=${individualFV}, totalFV so far=${totalFV}`);
  });

  console.log("Exiting calculateFutureValueSocialSecurityFunds with totalFV=", totalFV);
  return totalFV;
}

/**
 * Future Value ของกองทุนการออมแห่งชาติ (NSF)
 */
function calculateFutureValueNSF(fundsArray, currentAge, retirementAge, nominalRate) {
  console.log("Entered calculateFutureValueNSF", { fundsArray, currentAge, retirementAge, nominalRate });
  let yearsToRetirement = retirementAge - currentAge;
  let totalFV = 0;

  fundsArray.forEach((fund, index) => {
    const { ageStarted, savingsPerYear } = fund;
    console.log(`NSF Fund [${index}] input:`, fund);

    if (yearsToRetirement > 0) {
      let individualFV = savingsPerYear * ((Math.pow(1 + nominalRate, yearsToRetirement) - 1) / nominalRate);
      totalFV += individualFV;
      console.log(`NSF Fund [${index}] individualFV=${individualFV}, totalFV so far=${totalFV}`);
    }
  });

  console.log("Exiting calculateFutureValueNSF with totalFV=", totalFV);
  return totalFV;
}

/**
 * Future Value ของกองทุนสำรองเลี้ยงชีพ (PVD)
 */
function calculateFutureValuePvdFunds(fundsArray, initialSalary, yearsToRetirement) {
  console.log("Entered calculateFutureValuePvdFunds", { fundsArray, initialSalary, yearsToRetirement });
  let totalFV = 0;

  fundsArray.forEach((fund, index) => {
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
    console.log(`PVD Fund [${index}] input:`, fund);

    let totalFundMoney = accumulatedMoney + employeeContributions + accumulatedBenefits + contributionBenefits;
    let futureValCurrent = totalFundMoney * Math.pow(1 + investmentReturnRate, yearsToRetirement);

    let futureValContrib = 0;
    for (let year = 0; year < yearsToRetirement; year++) {
      let salary = initialSalary * Math.pow(1 + salaryIncreaseRate, year);
      let employeeSavings = salary * (savingsRate / 100);
      let employerContribution = salary * (contributionRate / 100);
      let annualCont = (employeeSavings + employerContribution) * 12 * 1.5;
      futureValContrib += annualCont * Math.pow(1 + investmentReturnRate, yearsToRetirement - year);
      console.log(`PVD Fund [${index}] year ${year}: salary=${salary}, annualCont=${annualCont}, interimFVContrib=${futureValContrib}`);
    }
    let fundFV = futureValCurrent + futureValContrib;
    totalFV += fundFV;
    console.log(`PVD Fund [${index}] futureValCurrent=${futureValCurrent}, futureValContrib=${futureValContrib}, fundFV=${fundFV}, totalFV so far=${totalFV}`);
  });

  console.log("Exiting calculateFutureValuePvdFunds with totalFV=", totalFV);
  return totalFV;
}

/**
 * Future Value ของ RMF
 */
function calculateFutureValueRMF(fundsArray, yearsToRetirement) {
  console.log("Entered calculateFutureValueRMF", { fundsArray, yearsToRetirement });
  let totalFV = 0;
  let n = yearsToRetirement;

  fundsArray.forEach((fund, index) => {
    const { currentBalance, annualInvestment, rateOfReturn } = fund;
    console.log(`RMF Fund [${index}] input:`, fund);

    let futureValueCurrent = currentBalance * Math.pow(1 + rateOfReturn, n);
    let futureValueDCA = annualInvestment * ((Math.pow(1 + rateOfReturn, n) - 1) / rateOfReturn);
    let fundFV = futureValueCurrent + futureValueDCA;
    totalFV += fundFV;
    console.log(`RMF Fund [${index}] futureValueCurrent=${futureValueCurrent}, futureValueDCA=${futureValueDCA}, fundFV=${fundFV}, totalFV so far=${totalFV}`);
  });

  console.log("Exiting calculateFutureValueRMF with totalFV=", totalFV);
  return totalFV;
}

/**
 * Future Value ของ SSF
 */
function calculateFutureValueSsfFunds(fundsArray, yearsToRetirement) {
  console.log("Entered calculateFutureValueSsfFunds", { fundsArray, yearsToRetirement });
  let totalFV = 0;
  let n = yearsToRetirement;

  fundsArray.forEach((fund, index) => {
    const { currentBalance, annualInvestment, rateOfReturn } = fund;
    console.log(`SSF Fund [${index}] input:`, fund);

    let futureValueCurrent = currentBalance * Math.pow(1 + rateOfReturn, n);
    let futureValueDCA = annualInvestment * ((Math.pow(1 + rateOfReturn, n) - 1) / rateOfReturn);
    let fundFV = futureValueCurrent + futureValueDCA;
    totalFV += fundFV;
    console.log(`SSF Fund [${index}] futureValueCurrent=${futureValueCurrent}, futureValueDCA=${futureValueDCA}, fundFV=${fundFV}, totalFV so far=${totalFV}`);
  });

  console.log("Exiting calculateFutureValueSsfFunds with totalFV=", totalFV);
  return totalFV;
}

/**
 * Future Value ของกองทุนบำเหน็จบำนาญข้าราชการ (GPF)
 */
function calculateFutureValueGPF(fundsArray, retirementAge, initialSalary, salaryIncreaseRateOrReturn) {
  console.log("Entered calculateFutureValueGPF", { fundsArray, retirementAge, initialSalary, salaryIncreaseRateOrReturn });
  let totalFV = 0;

  fundsArray.forEach((fund, index) => {
    const {
      yearStartedWorking,
      currentYear,
      savingsRate,
      contributionRate,
      rateOfReturn,
      accumulatedMoney,
      employeeContributions,
      compensation,
      initialMoney,
      accumulatedBenefits,
      contributionBenefits,
      compensationBenefits,
      initialBenefits
    } = fund;
    console.log(`GPF Fund [${index}] input:`, fund);

    let totalFundMoney = (
      accumulatedMoney +
      employeeContributions +
      initialMoney +
      compensationBenefits +
      initialBenefits +
      compensation +
      accumulatedBenefits +
      contributionBenefits
    );

    let yearsWorked = currentYear - yearStartedWorking;
    let yearsToRetirement = retirementAge - yearsWorked;
    let r = rateOfReturn;

    let futureValueCurrent = totalFundMoney * Math.pow(1 + r, yearsToRetirement);
    let futureValueContrib = 0;
    for (let year = 0; year < yearsToRetirement; year++) {
      let salary = initialSalary * Math.pow(1 + salaryIncreaseRateOrReturn, year);
      let employeeSavings = salary * (savingsRate / 100);
      let governmentContribution = salary * (contributionRate / 100);
      let totalContribution = (employeeSavings + governmentContribution) * 12;
      futureValueContrib += totalContribution * Math.pow(1 + r, yearsToRetirement - year);
      console.log(`GPF Fund [${index}] year ${year}: salary=${salary}, totalContribution=${totalContribution}, interimFVContrib=${futureValueContrib}`);
    }

    let fundFV = futureValueCurrent + futureValueContrib;
    totalFV += fundFV;
    console.log(`GPF Fund [${index}] futureValueCurrent=${futureValueCurrent}, futureValueContrib=${futureValueContrib}, fundFV=${fundFV}, totalFV so far=${totalFV}`);
  });

  console.log("Exiting calculateFutureValueGPF with totalFV=", totalFV);
  return totalFV;
}

/**
 * Future Value ของ Life Insurance (สมมุติแบบสะสมทรัพย์)
 */
function calculateFutureValueLifeInsurance(lifeInsuranceFund, rateOfReturn, yearsToRetirement) {
  console.log("Entered calculateFutureValueLifeInsurance", { lifeInsuranceFund, rateOfReturn, yearsToRetirement });
  const fv = lifeInsuranceFund * Math.pow(1 + rateOfReturn, yearsToRetirement);
  console.log("Exiting calculateFutureValueLifeInsurance with fv=", fv);
  return fv;
}

/**
 * =============================
 * 2) ฟังก์ชันคำนวณหลัก
 * =============================
 */

/**
 * (A) หาเงินก้อนที่ต้องมีเมื่อเกษียณ (Target Retirement Fund)
 *     โดยคิดจากรายจ่ายปีละเท่าๆ กัน (annualExpense) เป็นเวลาหลังเกษียณ n ปี
 */
function calculateTargetRetirementFund(annualExpense, postRetirementReturn, yearsInRetirement) {
  console.log("Entered calculateTargetRetirementFund", { annualExpense, postRetirementReturn, yearsInRetirement });
  if (postRetirementReturn <= 0) {
    let fund = annualExpense * yearsInRetirement;
    console.log("Exiting calculateTargetRetirementFund with fund =", fund);
    return fund;
  }
  const fund = annualExpense * (1 - Math.pow(1 + postRetirementReturn, -yearsInRetirement)) / postRetirementReturn;
  console.log("Exiting calculateTargetRetirementFund with fund =", fund);
  return fund;
}

/**
 * (B) หา "ต้องออมเท่าไหร่ต่อปี" ให้ได้ FV = netShortfall
 *     สูตร Annuity: C * [((1+r)^n - 1) / r] = FV
 *     => C = FV * r / [((1+r)^n - 1)]
 */
function calculateAnnualSavingRequired(netShortfall, annualReturn, years) {
  console.log("Entered calculateAnnualSavingRequired", { netShortfall, annualReturn, years });
  if (netShortfall <= 0) {
    console.log("No annual saving needed as netShortfall is <= 0");
    return 0;
  }
  if (!netShortfall) {
    console.log("Exiting calculateAnnualSavingRequired with NaN values");
    return 0;
  }
  if (annualReturn <= 0 || years <= 0) {
    const saving = netShortfall / years;
    console.log("Exiting calculateAnnualSavingRequired with saving (no return case) =", saving);
    return saving;
  }
  const numerator = netShortfall * annualReturn;
  const denominator = Math.pow(1 + annualReturn, years) - 1;
  const saving = numerator / denominator;
  console.log("Exiting calculateAnnualSavingRequired with saving", saving);
  return saving;
}

/**
 * =============================
 * 3) Router Handler
 * =============================
 */
router.post('/', jwtValidate, (req, res) => {
  console.log("POST / called with body:", req.body);
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

    // กองทุนต่าง ๆ
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
    console.log("Validation failed: Missing required fields");
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ครบถ้วน'
    });
  }

  if (retirementAge >= lifeExpectancy) {
    console.log("Validation failed: retirementAge >= lifeExpectancy");
    return res.status(400).json({
      success: false,
      message: 'lifeExpectancy ต้องมากกว่า retirementAge'
    });
  }

  const yearsToRetirement = retirementAge - currentAge;
  if (yearsToRetirement <= 0) {
    console.log("Validation failed: yearsToRetirement <= 0");
    return res.status(400).json({
      success: false,
      message: 'อายุเกษียณต้องมากกว่าปัจจุบัน'
    });
  }

  // =====================
  // 2) คำนวณ "เงินก้อนที่ต้องมี" ณ วันเกษียณ
  // =====================
  const futureMonthlyExpenseAtRetirement = monthlyExpensePostRetirement * Math.pow(1 + inflationRate, yearsToRetirement);
  console.log("futureMonthlyExpenseAtRetirement =", futureMonthlyExpenseAtRetirement);
  const annualExpenseAtRetirement = futureMonthlyExpenseAtRetirement * 12;
  console.log("annualExpenseAtRetirement =", annualExpenseAtRetirement);
  const yearsInRetirement = lifeExpectancy - retirementAge;
  console.log("yearsInRetirement =", yearsInRetirement);

  const totalNeededAtRetirement = calculateTargetRetirementFund(
    annualExpenseAtRetirement,
    expectedPostRetirementReturn,
    yearsInRetirement
  );
  console.log("totalNeededAtRetirement =", totalNeededAtRetirement);

  // =====================
  // 3) รวม Future Value ของกองทุนต่าง ๆ (เงินที่ "คาดว่าจะมี")
  // =====================
  const currentIncome = monthlySalary * 12;
  console.log("currentIncome =", currentIncome);
  const fvSocialSecurity = calculateFutureValueSocialSecurityFunds(
    socialSecurityFunds, retirementAge, currentIncome, 0.035
  );
  const fvNsf = calculateFutureValueNSF(
    nsfFunds, currentAge, retirementAge, 0.035
  );
  const fvPvd = calculateFutureValuePvdFunds(
    pvdFunds, currentIncome, yearsToRetirement
  );
  const fvRmf = calculateFutureValueRMF(rmfFunds, yearsToRetirement);
  const fvSsf = calculateFutureValueSsfFunds(ssfFunds, yearsToRetirement);
  const fvGpf = calculateFutureValueGPF(gpfFunds, retirementAge, currentIncome, expectedReturn);
  const fvLifeIns = calculateFutureValueLifeInsurance(
    lifeInsurance, 0.035, yearsToRetirement
  );

  const totalFundFV = fvSocialSecurity + fvNsf + fvPvd + fvRmf + fvSsf + fvGpf + fvLifeIns;
  console.log("totalFundFV =", totalFundFV);

  const futureSavings = 0;
  console.log("futureSavings =", futureSavings);

  // =====================
  // 4) เงินที่ขาด (Net Shortfall)
  // =====================
  const netShortfallAtRetirement = totalNeededAtRetirement - (totalFundFV + futureSavings);
  console.log("netShortfallAtRetirement =", netShortfallAtRetirement);

  // =====================
  // 5) ถ้ายังขาด => หาค่า "ต้องออมต่อเดือน"
  // =====================
  const annualSavingNeeded = calculateAnnualSavingRequired(
    netShortfallAtRetirement,
    expectedReturn,
    yearsToRetirement
  );
  const monthlySavingNeeded = totalNeededAtRetirement / (yearsToRetirement * 12);
  console.log("annualSavingNeeded =", annualSavingNeeded, "monthlySavingNeeded =", monthlySavingNeeded);

  // =====================
  // ส่งผลลัพธ์กลับ
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
          'INSERT INTO retirementplan (user_id, total_savings_goal, total_fund_fv, netShortfallAtRetirement, monthly_savings_goal) VALUES (?, ?, ?, ?, ?)',
          [req.user.UserID, totalNeededAtRetirement, totalFundFV, netShortfallAtRetirement, monthlySavingNeeded],
          (err, result) => {
            if (err) {
              console.log("Error from INSERT INTO retirementplan");
              console.log("Error:", err);
              return res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
              });
            }

            console.log("Returning response with calculated values");
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
          'UPDATE retirementplan SET total_savings_goal = ?, total_fund_fv = ?, netShortfallAtRetirement = ?, monthly_savings_goal = ? WHERE user_id = ?',
          [totalNeededAtRetirement, totalFundFV, netShortfallAtRetirement, monthlySavingNeeded, req.user.UserID],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
              });
            }

            console.log("Returning response with calculated values");
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
  const {monthly_savings_goal, total_savings_goal, current_savings, total_fund_fv, netShortfallAtRetirement} = req.body;
  console.log("PUT / called with body:", req.body);

  if(monthly_savings_goal == null || total_savings_goal == null || current_savings == null || total_fund_fv == null || netShortfallAtRetirement == null) {
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

      if(result.length === 0) {
        console.log("No retirement plan found for user");
        return res.status(404).json({
          success: false,
          message: 'No retirement plan found for user'
        });
      }

      db.query(
        'UPDATE retirementplan SET monthly_savings_goal = ?, total_savings_goal = ?, current_savings = ?, total_fund_fv = ?, netShortfallAtRetirement = ? WHERE user_id = ?',
        [monthly_savings_goal, total_savings_goal, current_savings, total_fund_fv, netShortfallAtRetirement, req.user.UserID],
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
        })
    }
  )

});

module.exports = {
  router
};
/*
  {
    "currentAge": 30,
    "retirementAge": 60,
    "lifeExpectancy": 85,

    "monthlySalary": 30000,
    "monthlyExpenses": 20000,

    "expectedReturn": 0.05,              // ผลตอบแทนก่อนเกษียณ (ต่อปี)
    "monthlyExpensePostRetirement": 15000,
    "inflationRate": 0.03,
    "expectedPostRetirementReturn": 0.03,

    "socialSecurityFunds": [
      {
        "startWorkingYear": 2010,
        "currentYear": 2023,
        "salaryIncreaseRate": 0.03
      }
    ],
    "nsfFunds": [
      {
        "ageStarted": 30,
        "savingsPerYear": 20000
      }
    ],
    "pvdFunds": [
      {
        "salaryIncreaseRate": 0.03,
        "savingsRate": 5,
        "contributionRate": 5,
        "investmentReturnRate": 0.04,
        "accumulatedMoney": 100000,
        "employeeContributions": 0,
        "accumulatedBenefits": 0,
        "contributionBenefits": 0
      }
    ],
    "rmfFunds": [
      {
        "currentBalance": 50000,
        "annualInvestment": 20000,
        "rateOfReturn": 0.05
      }
    ],
    "ssfFunds": [
      {
        "currentBalance": 30000,
        "annualInvestment": 15000,
        "rateOfReturn": 0.04
      }
    ],
    "gpfFunds": [
      {
        "yearStartedWorking": 2010,
        "currentYear": 2023,
        "savingsRate": 3,
        "contributionRate": 3,
        "rateOfReturn": 0.035,
        "accumulatedMoney": 50000,
        "employeeContributions": 0,
        "compensation": 0,
        "initialMoney": 0,
        "accumulatedBenefits": 0,
        "contributionBenefits": 0,
        "compensationBenefits": 0,
        "initialBenefits": 0
      }
    ],
    "lifeInsurance": 50000
  }
*/
