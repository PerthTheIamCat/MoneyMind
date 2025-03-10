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

interface RetireItemProps {
  retire: SplitPayProps;
  isOpen: boolean;
  onToggle: () => void;
  componentIcon: string;
  onDelete?: (id: number) => void;
}

const RetireItem: React.FC<RetireItemProps> = ({
  retire,
  isOpen,
  onToggle,
  componentIcon,
  onDelete,
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
    <ThemedView className="w-full flex-col !items-start rounded-xl p-5">
      {/* Header */}
      <ThemedView className="w-full flex-row !items-start">
        <ThemedView
          className="w-20 h-20 rounded-xl"
          style={{ backgroundColor: "#80B918" }}
        >
          <Feather name="dollar-sign" size={24} color="#fff" />
        </ThemedView>
        <ThemedView className="gap-2 ml-4 w-[60%] !items-start bg-transparent">
          <View className="w-full h-4 bg-[#D9D9D9] mt-2 rounded-full">
            <View
              className="h-4 rounded-full"
              style={{
                backgroundColor: "#80B918",
                width: `${
                  (retire.remaining_balance / retire.amount_allocated) * 100
                }%`,
              }}
            ></View>
            <ThemedText className="absolute text-xs pl-1 font-bold text-white">
              {Math.round(
                (retire.remaining_balance / retire.amount_allocated) * 100
              )}
              %
            </ThemedText>
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
            <ThemedText className="font-semibold">
              Retirement Details
            </ThemedText>
            <ThemedView className="w-full flex-row justify-between mt-2">
              <ThemedText className="font-bold">Total:</ThemedText>
              <ThemedText className="font-bold">
                {retire.amount_allocated.toFixed(2)}
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-full flex-row justify-between">
              <ThemedText className="font-bold">Saving:</ThemedText>
              <ThemedText className="font-bold">
                {retire.remaining_balance.toFixed(2)}
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-full flex-row justify-between">
              <ThemedText className="font-bold">Remaining:</ThemedText>
              <ThemedText className="font-bold">
                {(retire.amount_allocated - retire.remaining_balance).toFixed(
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
              if (onDelete) {
                onDelete(retire.id);
              }
            }}
          />
        </View>
      </Animated.View>
    </ThemedView>
  );
};

export default RetireItem;
