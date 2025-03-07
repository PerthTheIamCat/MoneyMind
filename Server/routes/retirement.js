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
  let totalFV = 0;

  fundsArray.forEach((fund) => {
    const { startWorkingYear, currentYear, salaryIncreaseRate } = fund;

    let yearsWorked = currentYear - startWorkingYear;
    let yearsToRetirement = retirementAge - yearsWorked;
    let individualFV = 0;

    for (let t = 0; t < yearsToRetirement; t++) {
      let salary = initialSalary * Math.pow(1 + salaryIncreaseRate, t);
      // 0.05 * 12 = 5% ของเงินเดือน ตลอดปี
      // จำกัดที่ 9000 บาท/ปี
      let annualContribution = Math.min(salary * 0.05 * 12, 9000);
      individualFV += annualContribution * Math.pow(1 + nominalRate, yearsToRetirement - t);
    }

    totalFV += individualFV;
  });

  return totalFV;
}

/**
 * Future Value ของกองทุนการออมแห่งชาติ (NSF)
 */
function calculateFutureValueNSF(fundsArray, currentAge, retirementAge, nominalRate) {
  let yearsToRetirement = retirementAge - currentAge;
  let totalFV = 0;

  fundsArray.forEach((fund) => {
    const { ageStarted, savingsPerYear } = fund;

    if (yearsToRetirement > 0) {
      // FV ของ Annuity (เงินออมรายปี)
      let individualFV = savingsPerYear * (
        (Math.pow(1 + nominalRate, yearsToRetirement) - 1) / nominalRate
      );
      totalFV += individualFV;
    }
  });

  return totalFV;
}

/**
 * Future Value ของกองทุนสำรองเลี้ยงชีพ (PVD)
 */
function calculateFutureValuePvdFunds(fundsArray, initialSalary, yearsToRetirement) {
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

    // รวมยอดเงินตั้งต้นทั้งหมด
    let totalFundMoney = accumulatedMoney + employeeContributions + accumulatedBenefits + contributionBenefits;
    // งอกเงยจากการลงทุน
    let futureValCurrent = totalFundMoney * Math.pow(1 + investmentReturnRate, yearsToRetirement);

    // คำนวณเงินสมทบในอนาคต
    let futureValContrib = 0;
    for (let year = 0; year < yearsToRetirement; year++) {
      let salary = initialSalary * Math.pow(1 + salaryIncreaseRate, year);
      let employeeSavings = salary * (savingsRate / 100);
      let employerContribution = salary * (contributionRate / 100);

      // สมมติว่ามี Matching 50% ตามโค้ดเดิม
      let annualCont = (employeeSavings + employerContribution) * 12 * 1.5;

      // ไปทบต้นจนถึงปีเกษียณ
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
  let totalFV = 0;
  let n = yearsToRetirement;

  fundsArray.forEach((fund) => {
    const { currentBalance, annualInvestment, rateOfReturn } = fund;

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
  let totalFV = 0;
  let n = yearsToRetirement;

  fundsArray.forEach((fund) => {
    const { currentBalance, annualInvestment, rateOfReturn } = fund;

    let futureValueCurrent = currentBalance * Math.pow(1 + rateOfReturn, n);
    let futureValueDCA = annualInvestment * ((Math.pow(1 + rateOfReturn, n) - 1) / rateOfReturn);

    totalFV += (futureValueCurrent + futureValueDCA);
  });

  return totalFV;
}

/**
 * Future Value ของกองทุนบำเหน็จบำนาญข้าราชการ (GPF)
 */
function calculateFutureValueGPF(fundsArray, retirementAge, initialSalary, salaryIncreaseRateOrReturn) {
  let totalFV = 0;

  fundsArray.forEach((fund) => {
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

    // รวมยอดเงินตั้งต้น
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
    let r = rateOfReturn; // ผลตอบแทน GPF

    // มูลค่าอนาคตของเงินต้น
    let futureValueCurrent = totalFundMoney * Math.pow(1 + r, yearsToRetirement);

    // คำนวณเงินสะสมเพิ่มเติมในแต่ละปี
    let futureValueContrib = 0;
    for (let year = 0; year < yearsToRetirement; year++) {
      let salary = initialSalary * Math.pow(1 + salaryIncreaseRateOrReturn, year);
      let employeeSavings = salary * (savingsRate / 100);
      let governmentContribution = salary * (contributionRate / 100);
      let totalContribution = (employeeSavings + governmentContribution) * 12;

      futureValueContrib += totalContribution * Math.pow(1 + r, yearsToRetirement - year);
    }

    totalFV += (futureValueCurrent + futureValueContrib);
  });

  return totalFV;
}

/**
 * Future Value ของ Life Insurance (สมมุติแบบสะสมทรัพย์)
 */
function calculateFutureValueLifeInsurance(lifeInsuranceFund, rateOfReturn, yearsToRetirement) {
  // ตัวอย่างสมมติ แค่ทบต้น
  return lifeInsuranceFund * Math.pow(1 + rateOfReturn, yearsToRetirement);
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
  if (postRetirementReturn <= 0) {
    // ถ้าผลตอบแทนน้อยกว่าหรือเท่ากับ 0 ก็คิดเส้นตรง
    return annualExpense * yearsInRetirement;
  }
  return (
    annualExpense *
    (1 - Math.pow(1 + postRetirementReturn, -yearsInRetirement)) /
    postRetirementReturn
  );
}

/**
 * (B) หา "ต้องออมเท่าไหร่ต่อปี" ให้ได้ FV = netShortfall
 *     สูตร Annuity: C * [((1+r)^n - 1) / r] = FV
 *     => C = FV * r / [((1+r)^n - 1)]
 */
function calculateAnnualSavingRequired(netShortfall, annualReturn, years) {
  if (netShortfall <= 0) return 0; // ไม่ขาด ก็ไม่ต้องออมเพิ่ม
  if (annualReturn <= 0 || years <= 0) {
    // ถ้าผลตอบแทน <= 0 ก็ต้องหารเส้นตรง
    return netShortfall / years;
  }
  const numerator = netShortfall * annualReturn;
  const denominator = Math.pow(1 + annualReturn, years) - 1;
  return numerator / denominator; // เงินออมต่อปี
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
  const futureMonthlyExpenseAtRetirement = monthlyExpensePostRetirement * Math.pow(1 + inflationRate, yearsToRetirement);
  const annualExpenseAtRetirement = futureMonthlyExpenseAtRetirement * 12;
  const yearsInRetirement = lifeExpectancy - retirementAge;

  // เงินก้อนที่ต้องมี (Target Retirement Fund)
  const totalNeededAtRetirement = calculateTargetRetirementFund(
    annualExpenseAtRetirement,
    expectedPostRetirementReturn,
    yearsInRetirement
  );

  // =====================
  // 3) รวม Future Value ของกองทุนต่าง ๆ (เงินที่ "คาดว่าจะมี")
  // =====================
  const currentIncome = monthlySalary * 12;
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

  // สมมติว่าใน GPF จะใช้ expectedReturn เป็นตัว rateOfReturn หรือตามที่กำหนด
  const fvGpf = calculateFutureValueGPF(gpfFunds, retirementAge, currentIncome, expectedReturn);

  // สมมติว่า lifeInsurance เป็นตัวเลขกองเดียว
  const fvLifeIns = calculateFutureValueLifeInsurance(
    lifeInsurance, 0.035, yearsToRetirement
  );

  // รวมทั้งหมด
  const totalFundFV = fvSocialSecurity + fvNsf + fvPvd + fvRmf + fvSsf + fvGpf + fvLifeIns;

  // สมมติว่า futureSavings ถ้าไม่มีข้อมูลในระบบ ก็ตั้งต้นเป็น 0 ไปก่อน
  const futureSavings = 0;

  // =====================
  // 4) เงินที่ขาด (Net Shortfall)
  // =====================
  const netShortfallAtRetirement = totalNeededAtRetirement - (totalFundFV + futureSavings);

  // =====================
  // 5) ถ้ายังขาด => หาค่า "ต้องออมต่อเดือน"
  // =====================
  const annualSavingNeeded = calculateAnnualSavingRequired(
    netShortfallAtRetirement,
    expectedReturn,
    yearsToRetirement
  );
  const monthlySavingNeeded = annualSavingNeeded / 12;

  // =====================
  // ส่งผลลัพธ์กลับ
  // =====================
  return res.status(200).json({
    success: true,
    totalNeededAtRetirement,   // เงินก้อนที่ต้องมี ณ วันเกษียณ
    totalFundFV,               // รวม FV ของกองทุนทั้งหมด
    netShortfallAtRetirement,  // เงินที่ขาด
    monthlySavingNeeded        // ต้องออม/เดือน ตั้งแต่วันนี้จนวันเกษียณ
  });
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
