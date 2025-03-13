import { DonutChart } from "@/components/DonutChart";
import { LinearBar } from "@/components/LinearBar";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";

interface Summary {
  id: number;
  user_id: number;
  monthly_savings_goal: number;
  monthly_current_savings: number;
  total_savings_goal: number;
  current_savings: number;
  income: number;
  expense: number;
}

const mockSummary: Summary = {
  id: 1,
  user_id: 101,
  monthly_savings_goal: 4000,
  monthly_current_savings: 2000,
  total_savings_goal: 100000,
  current_savings: 90000,
  income: 200000,
  expense: 170000,
};

export default function MonthSummary() {
  const { retire, transaction } = useContext(UserContext);

  const percentage =
    retire?.[0]?.current_savings && retire?.[0]?.current_savings > 0
      ? (retire?.[0]?.current_savings / retire?.[0]?.total_savings_goal) * 100
      : 0;

  const [Summary, setSummary] = useState();

  const formatPercentage = (percentage: number) => {
    return percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);
  };

  const theme = useColorScheme();
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  return (
    <ThemedSafeAreaView>
      <ThemedView
        className={`items-center flex-col justify-center w-96 my-5 ${componentcolor} mx-auto rounded-lg`}
      >
        <ThemedView
          className={`items-center flex-row bg-transparent justify-between w-80 m-3 px-5 py-3 mx-auto rounded-lg`}
        >
          <ThemedText className="text-3xl">Goal</ThemedText>
          <ThemedText className="text-2xl">
            {retire?.[0].current_savings ?? 0}/
            {retire?.[0].monthly_savings_goal ?? 0}
          </ThemedText>
        </ThemedView>
        <ThemedView className="bg-transparent pb-4">
          <LinearBar
            savings_goal={retire?.[0].monthly_savings_goal ?? 0}
            current_savings={retire?.[0].current_savings ?? 0}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView className="flex-row gap-3 justify-between mx-auto rounded-lg">
        <ThemedView className={`p-5 flex-col ${componentcolor} rounded-lg `}>
          <ThemedText className="text-2xl">Total Income</ThemedText>
          <ThemedText className="text-2xl">
            {transaction
              ?.filter((tx) => tx.transaction_type === "income")
              .reduce((acc, curr) => acc + curr.amount, 0)}
          </ThemedText>
        </ThemedView>
        <ThemedView className={`p-5 flex-col ${componentcolor} rounded-lg `}>
          <ThemedText className="text-2xl">Total Expense</ThemedText>
          <ThemedText className="text-2xl">
            {transaction
              ?.filter((tx) => tx.transaction_type === "expense")
              .reduce((acc, curr) => acc + curr.amount, 0)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <View
        className={`items-center flex-col justify-center w-96 my-5 ${componentcolor} mx-auto rounded-lg`}
      >
        <DonutChart
          savings_goal={retire?.[0].monthly_savings_goal ?? 0}
          current_savings={retire?.[0].current_savings ?? 0}
        />
      </View>
      <View
        className={`items-center flex-col justify-center w-96 my-1 mx-auto rounded-lg`}
      >
        <ThemedText className="text-2xl">
          You Already Saved {formatPercentage(percentage)}%
        </ThemedText>
      </View>
      <View
        className={`items-center flex-col justify-center w-96 my-2 mx-auto rounded-lg`}
      >
        <ThemedText className="text-6xl">
          {retire?.[0].current_savings ?? 0}
        </ThemedText>
      </View>
      <View
        className={`items-center flex-col justify-center w-96 my-1 mx-auto rounded-lg`}
      >
        <ThemedText className="text-2xl">Remaining</ThemedText>
      </View>
      <View
        className={`items-center flex-col justify-center w-96 my-2 mx-auto rounded-lg`}
      >
        <ThemedText className="text-6xl">
          {(retire?.[0]?.total_savings_goal ?? 0) -
            (retire?.[0]?.current_savings ?? 0)}
        </ThemedText>
      </View>
    </ThemedSafeAreaView>
  );
}
