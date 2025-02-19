import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { useEffect, useState, useContext } from "react";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

export default function Retire_form() {
  const [step, setStep] = useState<number>(0);
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [ageToRetire, setAgeToRetire] = useState<number>(0);
  const [ageAfterRetire, setAgeAfterRetire] = useState<number>(0);
  const [currentIncome, setCurrentIncome] = useState<number>(0);
  const [currentExpenses, setCurrentExpenses] = useState<number>(0);
  const [expectedRateFromSaving, setExpectedRateFromSaving] = useState<number>(0);
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(0);
  const [expectedRateFromSaving2, setExpectedRateFromSaving2] = useState<number>(0);

  return (
    <ThemedView className="h-full !justify-start">
      {/* Stage */}
      <ThemedView className="flex-row justify-around w-full py-5">
        <ThemedView className="w-28">
          {step <= 0 ? (
            <Entypo name="circle" size={44} color="#2B9348" />
          ) : (
            <AntDesign name="checkcircle" size={44} color="#2B9348" />
          )}
          <ThemedText className="font-bold">AGE</ThemedText>
        </ThemedView>
        <ThemedView className="w-28">
          {step <= 1 ? (
            <Entypo name="circle" size={44} color="#2B9348" />
          ) : (
            <AntDesign name="checkcircle" size={44} color="#2B9348" />
          )}
          <ThemedText className="font-bold">FINANCE</ThemedText>
        </ThemedView>
        <ThemedView className="w-28">
          {step <= 2 ? (
            <Entypo name="circle" size={44} color="#2B9348" />
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
          backgroundColor: "transparent",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 20}
      >
        <ScrollView
          className="w-full"
          contentContainerStyle={{ alignItems: "center" }}
        >
          {/* Form 1 */}
          {step === 0 && (
            <ThemedView className="w-full px-5">
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput title="Current Age" className="w-full" />
                </ThemedView>
                <ThemedText className="text-2xl font-bold h-full py-safe">
                  years
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput title="Age to Retire" className="w-full" />
                </ThemedView>
                <ThemedText className="text-2xl font-bold h-full py-safe">
                  years
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput title="Age after Retire" className="w-full" />
                </ThemedView>
                <ThemedText className="text-2xl font-bold h-full py-safe">
                  years
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* Form 2 */}
            {step === 1 && (
            <ThemedView className="w-full px-5">
              <ThemedText className="text-3xl font-bold w-[80%]">
              Period Before Retirement
              </ThemedText>
              <ThemedView className="w-[80%] flex-row !justify-between">
              <ThemedView className="w-[60%]">
                <ThemedInput title="Current Income" className="w-full" keyboardType="numeric" />
              </ThemedView>
              <ThemedText className="text-2xl font-bold h-full py-safe">
                Bath/Month
              </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
              <ThemedView className="w-[60%]">
                <ThemedInput title="Current Expenses" className="w-full" keyboardType="numeric" />
              </ThemedView>
              <ThemedText className="text-2xl font-bold h-full py-safe">
                Bath/Month
              </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
              <ThemedView className="w-[60%]">
                <ThemedInput title="Expected rate from saving" className="w-full" keyboardType="numeric" />
              </ThemedView>
              <ThemedText className="text-2xl font-bold h-full py-safe">
                Bath/Month
              </ThemedText>
              </ThemedView>
              <ThemedText className="text-3xl font-bold w-[80%] mt-5">
              Period After Retirement
              </ThemedText>
              <ThemedView className="w-[80%] flex-row !justify-between">
              <ThemedView className="w-[60%]">
                <ThemedInput title="Monthly salary" className="w-full" keyboardType="numeric" />
              </ThemedView>
              <ThemedText className="text-2xl font-bold h-full py-safe">
                %/year
              </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
              <ThemedView className="w-[60%]">
                <ThemedInput title="Inflation rate" className="w-full" keyboardType="numeric" />
              </ThemedView>
              <ThemedText className="text-2xl font-bold h-full py-safe">
                %/year
              </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
              <ThemedView className="w-[60%]">
                <ThemedInput title="Expected rate from saving" className="w-full" keyboardType="numeric" />
              </ThemedView>
              <ThemedText className="text-2xl font-bold h-full py-safe">
                %/year
              </ThemedText>
              </ThemedView>
            </ThemedView>
            )}

          {/* Form 3 */}
          {step === 2 && (
            <ThemedView className="w-full px-5">
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput title="Current Age" className="w-full" />
                </ThemedView>
                <ThemedText className="text-2xl font-bold h-full py-safe">
                  years
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput title="Age to Retire" className="w-full" />
                </ThemedView>
                <ThemedText className="text-2xl font-bold h-full py-safe">
                  years
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-[80%] flex-row !justify-between">
                <ThemedView className="w-[60%]">
                  <ThemedInput title="Age after Retire" className="w-full" />
                </ThemedView>
                <ThemedText className="text-2xl font-bold h-full py-safe">
                  years
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BUTTON */}
      <ThemedView className="absolute top-[80%] w-full">
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
