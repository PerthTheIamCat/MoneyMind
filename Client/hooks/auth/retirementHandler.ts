import axios from "axios";

export interface RetirementRequest {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlySalary: number;
  monthlyExpenses: number;
  expectedReturn: number;
  monthlyExpensePostRetirement: number;
  inflationRate: number;
  expectedPostRetirementReturn: number;
  socialSecurityFunds: {
    startWorkingYear: number;
    currentYear: number;
    salaryIncreaseRate: number;
  }[];
  nsfFunds: {
    ageStarted: number;
    savingsPerYear: number;
  }[];
  pvdFunds: {
    salaryIncreaseRate: number;
    savingsRate: number;
    contributionRate: number;
    investmentReturnRate: number;
    accumulatedMoney: number;
    employeeContributions: number;
    accumulatedBenefits: number;
    contributionBenefits: number;
  }[];
  rmfFunds: {
    currentBalance: number;
    annualInvestment: number;
    rateOfReturn: number;
  }[];
  ssfFunds: {
    currentBalance: number;
    annualInvestment: number;
    rateOfReturn: number;
  }[];
  gpfFunds: {
    yearStartedWorking: number;
    currentYear: number;
    savingsRate: number;
    contributionRate: number;
    rateOfReturn: number;
    accumulatedMoney: number;
    employeeContributions: number;
    compensation: number;
    initialMoney: number;
    accumulatedBenefits: number;
    contributionBenefits: number;
    compensationBenefits: number;
    initialBenefits: number;
  }[];
  lifeInsurance: number;
}

export interface RetirementResponse {
  success: boolean;
  totalNeededAtRetirement: number; // เงินก้อนที่ต้องมี ณ วันเกษียณ
  totalFundFV: number; // รวม FV ของกองทุนทั้งหมด
  netShortfallAtRetirement: number; // เงินที่ขาด
  monthlySavingNeeded: number;
}

export interface RetirementError {
  success: boolean;
  message: string;
}

export const CalculateRetirement = async (
  url: string,
  request: RetirementRequest,
  token: string
): Promise<RetirementError | RetirementResponse> => {
  try {
    const response = await axios.post<RetirementResponse>(
      `${url}/retirement`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

export const GetRetirement = async (
  url: string,
  userID: string,
  token: string
): Promise<RetirementError | RetirementResponse> => {
  try {
    const response = await axios.get<RetirementResponse>(
      `${url}/retirement/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};
