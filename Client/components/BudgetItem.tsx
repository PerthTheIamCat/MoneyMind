// BudgetItem.tsx
import React, { useState, useRef, useEffect } from "react";
import { Animated, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

interface SplitPayProps {
  id: number;
  user_id: number;
  account_id: number;
  split_name: string;
  amount_allocated: number;
  remaining_balance: number;
  color_code: string;
  icon_id: number;
}

interface BudgetItemProps {
  budget: SplitPayProps;
  isOpen: boolean;
  onToggle: () => void;
  componentIcon: string;
  icons: { [key: number]: JSX.Element };
  onEdit: (budget: SplitPayProps) => void;
  onDelete: (id: number) => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({
  budget,
  isOpen,
  onToggle,
  componentIcon,
  onEdit,
  onDelete,
  icons,
}) => {
  const [contentHeight, setContentHeight] = useState(120);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? contentHeight : 0,
      duration: 300,
      useNativeDriver: false, // height is a layout property
    }).start();
  }, [isOpen, contentHeight]);

  return (
    <ThemedView className="w-[90%] flex-col !items-start rounded-xl p-5">
      {/* Header */}
      <ThemedView className="w-full flex-row !items-start">
        <ThemedView
          className="w-20 h-20 rounded-xl"
          style={{ backgroundColor: budget.color_code }}
        >
          {React.cloneElement(icons[budget.icon_id], {
            size: 24,
            style: { marginVertical: 5 },
          })}
        </ThemedView>
        <ThemedView className="gap-2 ml-4 w-[60%] !items-start bg-transparent">
          <ThemedView className="w-full flex flex-row justify-between">
            <ThemedText className="text-xl font-bold pt-2">
              {budget.split_name}
            </ThemedText>
            <Feather
              name="edit-3"
              size={24}
              color={componentIcon}
              onPress={() => {
                onEdit(budget);
              }}
            />
          </ThemedView>
          <View className="w-full h-4 bg-[#D9D9D9] mt-2 rounded-full">
            <View
              className="h-4 rounded-full"
              style={{
                backgroundColor: budget.color_code,
                width: `${
                  (budget.remaining_balance / budget.amount_allocated) * 100
                }%`,
              }}
            >
              <ThemedText className="text-xs pl-1 font-bold text-white">
                {Math.round(
                  (budget.remaining_balance / budget.amount_allocated) * 100
                )}
                %
              </ThemedText>
            </View>
          </View>
          <ThemedView className="!items-end w-full">
            <AntDesign
              name={isOpen ? "up" : "down"}
              size={24}
              color={componentIcon}
              onPress={onToggle}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Animated Details */}
      <Animated.View
        style={{
          height: animatedHeight,
          overflow: "hidden",
          width: "100%",
          marginTop: isOpen ? 10 : 0,
        }}
      >
        <View>
          <ThemedView className="w-full bg-transparent pb-2 !items-start">
            <ThemedText className="font-semibold">Budget Details</ThemedText>
            <ThemedView className="w-full flex-row justify-between mt-2">
              <ThemedText className="font-bold">Allocated:</ThemedText>
              <ThemedText className="font-bold">
                {budget.amount_allocated.toFixed(2)}
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-full flex-row justify-between">
              <ThemedText className="font-bold">Remaining:</ThemedText>
              <ThemedText className="font-bold">
                {budget.remaining_balance.toFixed(2)}
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-full flex-row justify-between">
              <ThemedText className="font-bold">Spent:</ThemedText>
              <ThemedText className="font-bold">
                {(budget.amount_allocated - budget.remaining_balance).toFixed(
                  2
                )}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </View>
        <View className="w-full items-end">
          <Entypo
            name="circle-with-minus"
            size={24}
            color={"#C93540"}
            onPress={() => {
              onDelete(budget.id);
            }}
          />
        </View>
      </Animated.View>
    </ThemedView>
  );
};

export default BudgetItem;
