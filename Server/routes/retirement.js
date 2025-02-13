// calculateRetirement.js

function calculateRetirementMonthlyNeeded(params) {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      monthlyExpense,
      expectedReturn,       // %/ปี (Nominal)
      inflationRate,        // %/ปี
      initialCapital = 0,   // เงินต้นรวมของผู้ใช้
      funds                 // กองทุน (array) แต่ละกองสามารถมี initialFundCapital
    } = params;
  
    if (
      currentAge == null ||
      retirementAge == null ||
      lifeExpectancy == null ||
      monthlyExpense == null ||
      expectedReturn == null ||
      inflationRate == null
    ) {
      throw new Error("ข้อมูลไม่ครบถ้วน");
    }
    if (retirementAge >= lifeExpectancy) {
      throw new Error("lifeExpectancy ต้องมากกว่า retirementAge");
    }
    if (initialCapital < 0) {
      throw new Error("initialCapital ต้องไม่ติดลบ");
    }
  
    const yearsToRetirement = retirementAge - currentAge;
    if (yearsToRetirement <= 0) {
      throw new Error("อายุเกษียณต้องมากกว่าปัจจุบัน");
    }
    const totalMonths = yearsToRetirement * 12;
  
    const retirementPeriod = lifeExpectancy - retirementAge;
    const r_nominal = expectedReturn / 100;
    const i = inflationRate / 100;
    if (r_nominal <= i) {
      throw new Error("expectedReturn ต้องมากกว่า inflationRate");
    }
  
    const inflationFactor = Math.pow(1 + i, yearsToRetirement);
    const monthlyExpenseAtRetirement = monthlyExpense * inflationFactor;
    const annualExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
    const realReturn = r_nominal - i;
    if (realReturn <= 0) {
      throw new Error("realReturn <= 0 ไม่สามารถคำนวณได้");
    }
  
    // เงินก้อนที่ต้องมีตอนเกษียณ (PV of Annuity)
    const requiredCorpus =
      annualExpenseAtRetirement *
      (1 - Math.pow(1 + realReturn, -retirementPeriod)) /
      realReturn;
  
    // Future Value ของเงินต้นรวมของผู้ใช้ (initialCapital)
    let futureValueUserLumpSum = 0;
    if (initialCapital > 0) {
      const monthlyRateUser = r_nominal / 12;
      futureValueUserLumpSum = initialCapital * Math.pow(1 + monthlyRateUser, totalMonths);
    }
  
    let totalMonthlyFundContribution = 0;
    let futureValueFunds = 0;
  
    if (Array.isArray(funds)) {
      funds.forEach(fund => {
        // แต่ละกองทุนมี initialFundCapital, monthlyContribution, fundReturn
        const {
          initialFundCapital = 0,
          monthlyContribution = 0,
          fundReturn
        } = fund;
        if (fundReturn == null) {
          throw new Error("ข้อมูลกองทุนไม่ครบ (fundReturn)");
        }
        if (initialFundCapital < 0 || monthlyContribution < 0) {
          throw new Error("initialFundCapital, monthlyContribution ต้องไม่ติดลบ");
        }
  
        // FV ของเงินต้นกองทุน
        const monthlyRateFund = (fundReturn / 100) / 12;
        let fundLumpSumFV = 0;
        if (initialFundCapital > 0) {
          fundLumpSumFV = initialFundCapital * Math.pow(1 + monthlyRateFund, totalMonths);
        }
  
        // FV ของ DCA
        let fundDCAFV = 0;
        if (monthlyContribution > 0) {
          fundDCAFV = monthlyContribution *
            ((Math.pow(1 + monthlyRateFund, totalMonths) - 1) / monthlyRateFund);
        }
  
        futureValueFunds += (fundLumpSumFV + fundDCAFV);
        totalMonthlyFundContribution += monthlyContribution;
      });
    }
  
    // รวม FV ทั้งหมด (เงินต้นผู้ใช้ + ทุกกองทุน)
    const totalFutureValue = futureValueUserLumpSum + futureValueFunds;
  
    // คำนวณ shortfall ถ้ายังไม่ถึง requiredCorpus
    const shortfall = Math.max(requiredCorpus - totalFutureValue, 0);
  
    // แปลง shortfall เป็น "ออมเพิ่มรายเดือน"
    let monthlySavingsNeeded = 0;
    if (shortfall > 0) {
      const r_monthly = r_nominal / 12;
      const factor = Math.pow(1 + r_monthly, totalMonths) - 1;
      monthlySavingsNeeded = shortfall * (r_monthly / factor);
    }
  
    // สรุปต้องเก็บต่อเดือน = (ทุนกองทุน) + (ออมเพิ่มถ้าขาด)
    const monthlyNeeded = totalMonthlyFundContribution + monthlySavingsNeeded;
  
    return {
      totalCorpusRequired: Number(requiredCorpus.toFixed(2)),
      monthlyNeeded: Number(monthlyNeeded.toFixed(2))
    };
  }
  
  module.exports = {
    calculateRetirementMonthlyNeeded
  };
  /*
    const params = {
    currentAge: 35,            // อายุปัจจุบัน 35 ปี
    retirementAge: 65,         // อายุเกษียณที่ตั้งไว้ 65 ปี
    lifeExpectancy: 90,        // อายุคาดหมายอยู่ 90 ปี
    monthlyExpense: 25000,     // ค่าใช้จ่ายรายเดือน ณ ปัจจุบัน 25,000 บาท
    expectedReturn: 7,         // ผลตอบแทนรายปีสำหรับเงินต้นผู้ใช้ 7%
    inflationRate: 3,          // อัตราเงินเฟ้อ 3%/ปี
    initialCapital: 2000000,   // เงินต้นส่วนตัว 2,000,000 บาท
    funds: [
      {
        initialFundCapital: 1000000, // เงินต้นเริ่มต้นในกองทุนแรก 1,000,000 บาท
        monthlyContribution: 5000,   // ฝากเงินรายเดือนในกองทุนแรก 5,000 บาท
        fundReturn: 8                // ผลตอบแทนของกองทุนแรก 8%/ปี
      },
      {
        initialFundCapital: 500000,  // เงินต้นเริ่มต้นในกองทุนที่สอง 500,000 บาท
        monthlyContribution: 7000,   // ฝากเงินรายเดือนในกองทุนที่สอง 7,000 บาท
        fundReturn: 10               // ผลตอบแทนของกองทุนที่สอง 10%/ปี
      }
    ]
  };
  */