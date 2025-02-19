import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedView } from "@/components/ThemedView";
import React, { useContext, useState } from "react";
import { UserContext } from "@/hooks/conText/UserContext";
import { Pressable, TextInput, useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { router } from "expo-router";
import DropdownComponent from "@/components/Dropdown";
import { ThemedScrollViewCenter } from "@/components/ThemedScrollViewCenter";

type ThemedInputProps = {
  className?: string;
  error?: string;
  title?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  [key: string]: any;
};
export default function Index() {
  const theme = useColorScheme();
  const { bank } = useContext(UserContext);
  const [isIncome, setIsIncome] = useState(true);
  const incomeCategories = ["Salary", "Bonus", "Investment", "Freelance"];
  const expenseCategories = ["Food", "Transport", "Rent", "Shopping"];
  const categories = isIncome ? incomeCategories : expenseCategories;
  const [budgetPlan, setBudgetPlan] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const budgetOptions = ["Plan A", "Plan B", "Plan C"];

  return (
    <ThemedSafeAreaView>
      <ThemedView className="w-full !h-full flex-1">
        <ThemedView className="!items-start pl-10 w-full mt-5">
          <ThemedText className="text-[20px] font-bold mb-2">
            Account
          </ThemedText>
        </ThemedView>

        <ThemedView className="!items-center w-full ">
          <ThemedScrollViewCenter
            vertical={false}
            horizontal={true}
            className="w-full"
          >
            <ThemedView className="w-full  flex-row ">
              {bank?.map((account) => (
                <ThemedCard
                  key={account.id}
                  name={account.account_name}
                  color={account.color_code}
                  balance={account.balance.toString()}
                  mode="large"
                  onEdit={() => {}}
                  CardID={account.id}
                  // image={account.icon_id}
                  className="!items-center !justify-center w-32 h-32 bg-[#fefefe] rounded-lg"
                />
              ))}
            </ThemedView>
          </ThemedScrollViewCenter>
        </ThemedView>

        <ThemedScrollView
          vertical={true}
          horizontal={false}
          className="w-full h-full"
        >
          <ThemedView
            className={`${
              theme === "dark" ? "bg-[#000000]" : "bg-[#ffffff]"
            } mt-2 px-10 !justify-start !items-start w-full  rounded-t-[30px] `}
          >
            <ThemedView className="flex-row w-fit h-12 rounded-sm p-1 mt-5 mb-4 bg-transparent">
              <Pressable
                onPress={() => setIsIncome(true)} // เปลี่ยนเป็น Income ถ้ายังไม่ใช่
                className={`w-32 h-full flex items-center justify-center rounded-2xl ${
                  isIncome ? "bg-green-500" : "bg-transparent"
                }`}
              >
                <ThemedText
                  className={`font-bold ${
                    isIncome ? "text-white" : "text-black"
                  }`}
                >
                  Income
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => setIsIncome(false)} // เปลี่ยนเป็น Expense ถ้ายังไม่ใช่
                className={`w-32 h-full flex items-center justify-center rounded-2xl ${
                  !isIncome ? "bg-red-500" : "bg-transparent"
                }`}
              >
                <ThemedText
                  className={`font-bold ${
                    !isIncome ? "text-white" : "text-black"
                  }`}
                >
                  Expense
                </ThemedText>
              </Pressable>
            </ThemedView>

            <ThemedView className="w-full  bg-transparent">
              <ThemedText className="text-xl font-bold w-full !bg-transparent">
                Select Budget Plan
              </ThemedText>

              <ThemedView className="w-full bg-transparent">
                <DropdownComponent />
              </ThemedView>
            </ThemedView>

            <ThemedView className="mt-1 w-full justify-center !items-start bg-transparent">
              <ThemedText className="font-bold text-[16px]">
                Category
              </ThemedText>

              <ThemedScrollView
                vertical={false}
                horizontal={true}
                className="bg-transparent"
              >
                <ThemedView className="h-11 w-full flex-row !items-end bg-transparent gap-2">
                  {categories.map((category, index) => (
                    <ThemedButton
                      key={index}
                      className={`w-[90px] h-10 !rounded-lg ${
                        isIncome ? "bg-green-500" : "bg-red-500"
                      }`}
                      mode={isIncome ? "cancel" : "confirm"}
                    >
                      {category}
                    </ThemedButton>
                  ))}
                </ThemedView>
              </ThemedScrollView>
            </ThemedView>

            <ThemedView className="w-full justify-center !items-start bg-transparent">
              <ThemedInput
                title="Enter Amount"
                placeholder={"Enter Amont"}
                className="font-bold text-[16px] w-full"
              />
            </ThemedView>

            <ThemedView className="w-full flex-row !justify-between !items-start bg-transparent">
              <ThemedView className="w-2/5">
                <ThemedInput
                  title={"Date"}
                  placeholder={"02/02/2024"}
                  className="font-bold text-[16px] w-full"
                />
              </ThemedView>
              <ThemedView className="ml-2 w-2/5">
                <ThemedInput
                  title="Time"
                  placeholder={"00:00 PM"}
                  className="font-bold text-[16px] w-full"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="w-full justify-center !items-start bg-transparent">
              <ThemedInput
                title="Note"
                placeholder={"Enter Note"}
                className="font-bold text-[16px] w-full"
              />
            </ThemedView>
            <ThemedView
          className={`${ 
            theme === "dark" ? "bg-[#000000]" : "bg-[#ffffff]"
          }  px-10 w-full bg-transparent`}
        >
          <ThemedButton
            className="mt-3 px-10 w-full  h-12 bg-green-500"
            onPress={() => router.push("/(tabs)/transaction")}
          >
            Add Transaction
          </ThemedButton>
        </ThemedView>
          </ThemedView>
        </ThemedScrollView>


      </ThemedView>
    </ThemedSafeAreaView>
  );
}
