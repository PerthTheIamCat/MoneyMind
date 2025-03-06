import React from "react";
import { ThemedView } from "./ThemedView";

export default function BudgetSkeleton() {
  return (
    <ThemedView
      key={"skeletonBudget"}
      className=" bg-transparent transition-all animate-pulse-ease flex flex-row !items-start pt-10"
    >
      <ThemedView className="w-20 h-20 rounded-xl bg-gray-500" />
      <ThemedView className="gap-2 ml-4 w-[50%] !items-start bg-transparent">
        <ThemedView className="w-24 h-5 rounded-xl bg-gray-500" />
        <ThemedView className="w-[80%] h-5 rounded-xl bg-gray-500" />
        <ThemedView className="w-24 h-5 rounded-xl bg-gray-500" />
      </ThemedView>
    </ThemedView>
  );
}
