import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInputHorizontal } from "@/components/ThemedInputHorizontal";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useEffect, useState, useContext } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

export default function Retire_form() {
  // State
  const [step, setStep] = useState<number>(0);

  // Form 1
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [ageToRetire, setAgeToRetire] = useState<number>(0);
  const [ageAfterRetire, setAgeAfterRetire] = useState<number>(0);

  // Form 2
  const [currentIncome, setCurrentIncome] = useState<number>(0);
  const [currentExpenses, setCurrentExpenses] = useState<number>(0);
  const [expectedRateFromSaving, setExpectedRateFromSaving] =
    useState<number>(0);
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(0);
  const [expectedRateFromSaving2, setExpectedRateFromSaving2] =
    useState<number>(0);

  // Form 3
  const [isSocialSecurityFund, setIsSocialSecurityFund] =
    useState<boolean>(false);
  const [startWorkingAge, setStartWorkingAge] = useState<number>(0);
  const [currentWorkingYear, setCurrentWorkingYear] = useState<number>(0);
  const [salaryIncreaseRate, setSalaryIncreaseRate] = useState<number>(0);

  const [isNationalSavingsFund, setIsNationalSavingsFund] =
    useState<boolean>(false);
  const [ageSavingsStarted, setAgeSavingsStarted] = useState<number>(0);
  const [savingsAmount, setSavingsAmount] = useState<number>(0);

  const [isProvidentFund, setIsProvidentFund] = useState<boolean>(false);
  const [salaryIncreaseRate2, setSalaryIncreaseRate2] = useState<number>(0);
  const [savingsRate, setSavingsRate] = useState<number>(0);
  const [contributionRate, setContributionRate] = useState<number>(0);
  const [investmentReturnRate, setInvestmentReturnRate] = useState<number>(0);
  const [accumulatedMoney, setAccumulatedMoney] = useState<number>(0);
  const [employeeContributions, setEmployeeContributions] = useState<number>(0);
  const [accumulatedBenefits, setAccumulatedBenefits] = useState<number>(0);
  const [contributionBenefits, setContributionBenefits] = useState<number>(0);

  const [isRetirementMutualFund, setIsRetirementMutualFund] =
    useState<boolean>(false);
  const [currentBalanceRMF, setCurrentBalanceRMF] = useState<number>(0);
  const [RMFInvestmentAmount, setRMFInvestmentAmount] = useState<number>(0);
  const [rateOfReturn, setRateOfReturn] = useState<number>(0);

  const [isSuperSavingsFund, setIsSuperSavingsFund] = useState<boolean>(false);
  const [currentBalanceSSF, setCurrentBalanceSSF] = useState<number>(0);
  const [SSFInvestmentAmount, setSSFInvestmentAmount] = useState<number>(0);
  const [rateOfReturn2, setRateOfReturn2] = useState<number>(0);

  const [isGovernmentPensionFund, setIsGovernmentPensionFund] =
    useState<boolean>(false);
  const [yearStartedWorking, setYearStartedWorking] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [savingsRate2, setSavingsRate2] = useState<number>(0);
  const [contributionRate2, setContributionRate2] = useState<number>(0);
  const [rateOfReturn3, setRateOfReturn3] = useState<number>(0);
  const [accumulatedMoney2, setAccumulatedMoney2] = useState<number>(0);
  const [employeeContributions2, setEmployeeContributions2] =
    useState<number>(0);
  const [compensation, setCompensation] = useState<number>(0);
  const [initialMoney, setInitialMoney] = useState<number>(0);
  const [accumulatedBenefits2, setAccumulatedBenefits2] = useState<number>(0);
  const [contributionBenefits2, setContributionBenefits2] = useState<number>(0);
  const [compensationBenefits, setCompensationBenefits] = useState<number>(0);
  const [initialBenefits, setInitialBenefits] = useState<number>(0);

  const [isLifeInsurance, setIsLifeInsurance] = useState<boolean>(false);
  const [lifeInsuranceFund, setLifeInsuranceFund] = useState<number>(0);

  return (
    <ThemedView className="h-full !justify-start">
      {/* Stage */}
      <ThemedView className="flex-row justify-around w-full py-5">
        <ThemedView className="w-28">
          {step <= 0 ? (
            step === 0 ? (
              <AntDesign
                key={"loading1"}
                name="loading2"
                size={44}
                color="#CEB036"
                className="animate-spin-ease"
              />
            ) : (
              <Entypo name="circle" size={44} color="#2B9348" />
            )
          ) : (
            <AntDesign name="checkcircle" size={44} color="#2B9348" />
          )}
          <ThemedText className="font-bold">AGE</ThemedText>
        </ThemedView>
        <ThemedView className="w-28">
          {step <= 1 ? (
            step === 1 ? (
              <AntDesign
                key={"loading2"}
                name="loading2"
                size={44}
                color="#CEB036"
                className="animate-spin-ease"
              />
            ) : (
              <Entypo name="circle" size={44} color="#2B9348" />
            )
          ) : (
            <AntDesign name="checkcircle" size={44} color="#2B9348" />
          )}
          <ThemedText className="font-bold">FINANCE</ThemedText>
        </ThemedView>
        <ThemedView className="w-28">
          {step <= 2 ? (
            step === 2 ? (
              <AntDesign
                key={"loading3"}
                name="loading2"
                size={44}
                color="#CEB036"
                className="animate-spin-ease"
              />
            ) : (
              <Entypo name="circle" size={44} color="#2B9348" />
            )
          ) : (
            <AntDesign name="checkcircle" size={44} color="#2B9348" />
          )}
          <ThemedText className="font-bold">INVESTMENT</ThemedText>
        </ThemedView>
      </ThemedView>

      <KeyboardAvoidingView
        style={{
          width: "100%",
          height: "70%",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 100}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Form 1 */}
          {step === 0 && (
            <ThemedView className="w-full px-5 gap-10">
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Current Age"
                    className="w-full"
                    keyboardType="numeric"
                    value={currentAge.toString()}
                    onChangeText={(text) => setCurrentAge(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-5">
                  years
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Age to Retire"
                    className="w-full"
                    keyboardType="numeric"
                    value={ageToRetire.toString()}
                    onChangeText={(text) => setAgeToRetire(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-5">
                  years
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Age after Retire"
                    className="w-full"
                    keyboardType="numeric"
                    value={ageAfterRetire.toString()}
                    onChangeText={(text) => setAgeAfterRetire(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-5">
                  years
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* Form 2 */}
          {step === 1 && (
            <ThemedView className="w-full px-5 gap-10 pb-10">
              <ThemedText className="text-3xl font-bold w-[80%]">
                Period Before Retirement
              </ThemedText>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Current Income"
                    className="w-full"
                    keyboardType="numeric"
                    value={currentIncome.toString()}
                    onChangeText={(text) => setCurrentIncome(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-5">
                  Bath/Month
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Current Expenses"
                    className="w-full"
                    keyboardType="numeric"
                    value={currentExpenses.toString()}
                    onChangeText={(text) => setCurrentExpenses(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-6">
                  Bath/Month
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Expected rate from saving"
                    className="w-full"
                    keyboardType="numeric"
                    value={expectedRateFromSaving.toString()}
                    onChangeText={(text) =>
                      setExpectedRateFromSaving(Number(text))
                    }
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-14">
                  %/year
                </ThemedText>
              </ThemedView>
              <ThemedText className="text-3xl font-bold w-[80%] mt-5">
                Period After Retirement
              </ThemedText>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Monthly salary"
                    className="w-full"
                    keyboardType="numeric"
                    value={monthlySalary.toString()}
                    onChangeText={(text) => setMonthlySalary(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-5">
                  Bath/Month
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Inflation rate"
                    className="w-full"
                    keyboardType="numeric"
                    value={inflationRate.toString()}
                    onChangeText={(text) => setInflationRate(Number(text))}
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-6">
                  %/year
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput
                    title="Expected rate from saving"
                    className="w-full"
                    keyboardType="numeric"
                    value={expectedRateFromSaving2.toString()}
                    onChangeText={(text) =>
                      setExpectedRateFromSaving2(Number(text))
                    }
                  />
                </ThemedView>
                <ThemedText className="text-2xl font-bold mt-14">
                  %/year
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* Form 3 */}
          {step === 2 && (
            <ThemedView className="px-5 ">
              <CollapsibleSection
                title="Social Security Fund"
                onToggle={(isOpen) => setIsSocialSecurityFund(isOpen)}
                disabled={isNationalSavingsFund}
              >
                <ThemedInputHorizontal
                  title="Start working age"
                  className="w-full"
                  unit="years(B.E.)"
                  keyboardType="numeric"
                  value={startWorkingAge.toString()}
                  editable={!isSocialSecurityFund}
                  onChangeText={(text) => setStartWorkingAge(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Current working year"
                  className="w-full"
                  unit="years(B.E.)"
                  keyboardType="numeric"
                  value={currentWorkingYear.toString()}
                  onChangeText={(text) => setCurrentWorkingYear(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Salary increase rate"
                  className="w-full"
                  unit="%/years"
                  keyboardType="numeric"
                  value={salaryIncreaseRate.toString()}
                  onChangeText={(text) => setSalaryIncreaseRate(Number(text))}
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="National Savings Fund (NSF)"
                onToggle={(isOpen) => setIsNationalSavingsFund(isOpen)}
                disabled={
                  isSocialSecurityFund ||
                  isProvidentFund ||
                  isGovernmentPensionFund
                }
              >
                <ThemedInputHorizontal
                  title="Age savings started"
                  className="w-full"
                  unit="years"
                  keyboardType="numeric"
                  value={ageSavingsStarted.toString()}
                  onChangeText={(text) => setAgeSavingsStarted(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Savings amount"
                  className="w-full"
                  unit="years(B.E.)"
                  keyboardType="numeric"
                  value={savingsAmount.toString()}
                  onChangeText={(text) => setSavingsAmount(Number(text))}
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="Provident Fund (PVD)"
                onToggle={(isOpen) => setIsProvidentFund(isOpen)}
                disabled={isNationalSavingsFund || isGovernmentPensionFund}
              >
                <ThemedInputHorizontal
                  title="Salary increase rate"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  disabled={""}
                  value={salaryIncreaseRate2.toString()}
                  onChangeText={(text) => setSalaryIncreaseRate2(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Savings rate"
                  className="w-full"
                  unit="%/Month"
                  keyboardType="numeric"
                  value={savingsRate.toString()}
                  onChangeText={(text) => setSavingsRate(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Contribution rate"
                  className="w-full"
                  unit="%/Month"
                  keyboardType="numeric"
                  value={contributionRate.toString()}
                  onChangeText={(text) => setContributionRate(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Investment return rate"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  value={investmentReturnRate.toString()}
                  onChangeText={(text) => setInvestmentReturnRate(Number(text))}
                />
                <ThemedText className="font-bold">
                  Latest amount of money in the fund
                </ThemedText>
                <ThemedInputHorizontal
                  title="Accumulated money"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={accumulatedMoney.toString()}
                  onChangeText={(text) => setAccumulatedMoney(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Employee contributions"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={employeeContributions.toString()}
                  onChangeText={(text) =>
                    setEmployeeContributions(Number(text))
                  }
                />
                <ThemedInputHorizontal
                  title="Accumulated benefits"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={accumulatedBenefits.toString()}
                  onChangeText={(text) => setAccumulatedBenefits(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Contribution benefits"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={contributionBenefits.toString()}
                  onChangeText={(text) => setContributionBenefits(Number(text))}
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="Retirement Mutual Fund (RMF)"
                onToggle={(isOpen) => setIsRetirementMutualFund(isOpen)}
              >
                <ThemedInputHorizontal
                  title="Current balance RMF"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={currentBalanceRMF.toString()}
                  onChangeText={(text) => setCurrentBalanceRMF(Number(text))}
                />
                <ThemedInputHorizontal
                  title="RMF investment amount"
                  className="w-full"
                  unit="Bath/year"
                  keyboardType="numeric"
                  value={RMFInvestmentAmount.toString()}
                  onChangeText={(text) => setRMFInvestmentAmount(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Rate of return"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  value={rateOfReturn.toString()}
                  onChangeText={(text) => setRateOfReturn(Number(text))}
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="Super Savings Fund (SSF)"
                onToggle={(isOpen) => setIsSuperSavingsFund(isOpen)}
              >
                <ThemedInputHorizontal
                  title="Current balance SSF"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={currentBalanceSSF.toString()}
                  onChangeText={(text) => setCurrentBalanceSSF(Number(text))}
                />
                <ThemedInputHorizontal
                  title="SSF investment amount"
                  className="w-full"
                  unit="Bath/Month"
                  keyboardType="numeric"
                  value={SSFInvestmentAmount.toString()}
                  onChangeText={(text) => setSSFInvestmentAmount(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Rate of return"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  value={rateOfReturn2.toString()}
                  onChangeText={(text) => setRateOfReturn2(Number(text))}
                />
              </CollapsibleSection>
              <CollapsibleSection
                title="Government Pension Fund (GPF)"
                onToggle={(isOpen) => setIsGovernmentPensionFund(isOpen)}
                disabled={isNationalSavingsFund}
              >
                <ThemedInputHorizontal
                  title="Year started working"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  value={yearStartedWorking.toString()}
                  onChangeText={(text) => setYearStartedWorking(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Current year"
                  className="w-full"
                  unit="%/month"
                  keyboardType="numeric"
                  value={currentYear.toString()}
                  onChangeText={(text) => setCurrentYear(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Savings rate"
                  className="w-full"
                  unit="%/month"
                  keyboardType="numeric"
                  value={savingsRate2.toString()}
                  onChangeText={(text) => setSavingsRate2(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Contribution rate"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  value={contributionRate2.toString()}
                  onChangeText={(text) => setContributionRate2(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Rate of return"
                  className="w-full"
                  unit="%/year"
                  keyboardType="numeric"
                  value={rateOfReturn3.toString()}
                  onChangeText={(text) => setRateOfReturn3(Number(text))}
                />
                <ThemedText className="font-bold">
                  Latest amount of money in the fund
                </ThemedText>
                <ThemedInputHorizontal
                  title="Accumulated money"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={accumulatedMoney2.toString()}
                  onChangeText={(text) => setAccumulatedMoney2(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Employee contributions"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={employeeContributions2.toString()}
                  onChangeText={(text) =>
                    setEmployeeContributions2(Number(text))
                  }
                />
                <ThemedInputHorizontal
                  title="Compensation"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={compensation.toString()}
                  onChangeText={(text) => setCompensation(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Initial money (if any)"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={initialMoney.toString()}
                  onChangeText={(text) => setInitialMoney(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Accumulated benefits"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={accumulatedBenefits2.toString()}
                  onChangeText={(text) => setAccumulatedBenefits2(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Contribution benefits"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={contributionBenefits2.toString()}
                  onChangeText={(text) =>
                    setContributionBenefits2(Number(text))
                  }
                />
                <ThemedInputHorizontal
                  title="Compensation benefits"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={compensationBenefits.toString()}
                  onChangeText={(text) => setCompensationBenefits(Number(text))}
                />
                <ThemedInputHorizontal
                  title="Initial benefits (if any)"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={initialBenefits.toString()}
                  onChangeText={(text) => setInitialBenefits(Number(text))}
                />
              </CollapsibleSection>
              <CollapsibleSection title="Life Insurance">
                <ThemedInputHorizontal
                  title="Life insurance fund"
                  className="w-full"
                  unit="Bath"
                  keyboardType="numeric"
                  value={lifeInsuranceFund.toString()}
                  onChangeText={(text) => setLifeInsuranceFund(Number(text))}
                />
              </CollapsibleSection>
            </ThemedView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BUTTON */}
      <ThemedView className="w-full">
        <ThemedView className="w-[80%] flex-row !justify-around py-5">
          <ThemedButton
            mode="normal"
            className="px-14 py-5"
            onPress={() => {
              step === 0 ? router.back() : setStep(step - 1);
            }}
          >
            back
          </ThemedButton>
          <ThemedButton
            mode="confirm"
            className="px-14 py-5"
            onPress={() => setStep(step + 1)}
          >
            next
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
