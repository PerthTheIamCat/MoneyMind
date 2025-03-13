import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { View, Text, Pressable, Modal } from "react-native";
import { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { UserTransaction } from "@/hooks/auth/GetAllTransaction";
import { TouchableWithoutFeedback } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface TransactionItemProps {
  transaction: UserTransaction;
  theme?: "light" | "dark";
  onEdit?: () => void;
  onDelete?: (transaction_id: number) => void;
  checkpage?: string;
  isOptionsVisible?: boolean; // ✅ เพิ่มตัวแปรนี้
  setOptionsVisible?: () => void; // ✅ เพิ่มตัวแปรนี้
}
export default function TransactionItem({
  transaction,
  theme,
  onEdit,
  onDelete,
  checkpage,
  isOptionsVisible,
  setOptionsVisible,
}: TransactionItemProps) {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isDeleteModalVisible && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isDeleteModalVisible, countdown]);

  const handleDelete = () => {
    setShowDropdown(false);
    // setShowOverlay(true);
    setDeleteModalVisible(true);
    setCountdown(5);
  };

  const confirmDelete = () => {
    // setShowOverlay(false);
    setDeleteModalVisible(false);
    onDelete?.(transaction.id); // เรียก function ที่ส่งมา
  };

  return (
    <>
      <View
        className={`flex-row items-center justify-center w-[85%] ${componentcolor} p-4 rounded-lg mb-2 shadow-md`}
      >
        <Ionicons
          name={transaction.icon_id}
          size={24}
          color={componenticon}
          className="mx-3"
        />
        <View className="flex-1">
          <ThemedText className="font-bold text-lg">
            {transaction.transaction_name}
          </ThemedText>
          <ThemedText>{transaction.note}</ThemedText>
        </View>
        <View className="justify-end items-end">
          <Text
            className={`font-bold text-[16px] ${
              transaction.transaction_type === "income"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {transaction.amount}
          </Text>
          <ThemedText>
            {new Date(transaction.transaction_date)
              .toLocaleString("th-TH")
              .slice(9, 15)}
          </ThemedText>
        </View>
        {checkpage === "transactions" ? (
          <Pressable
            onPress={() => {
              console.log("🔹 Toggle menu for transaction", transaction.id);
              setOptionsVisible?.(); // ✅ ใช้เปิด/ปิดเมนู
            }}
          >
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={componenticon}
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        ) : (
          <View className="ml-3"></View>
        )}

        {isOptionsVisible && (
          <TouchableWithoutFeedback onPress={() => setOptionsVisible?.()}>
            <View
              style={{ position: "absolute", top: 18, right: 30, zIndex: 100 }}
            >
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <ThemedView className="flex-row border border-gray-300 shadow-md rounded-lg w-fit z-50">
                  <Pressable
                    onPress={() => {
                      console.log("✏️ Editing transaction", transaction.id);
                      onEdit?.();
                      setOptionsVisible?.();
                    }}
                    className="p-2 border-b border-gray-200"
                  >
                    <Text className="text-green-500">Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      console.log("🗑️ Deleting transaction", transaction.id);
                      handleDelete();
                      setOptionsVisible?.();
                    }}
                    className="p-2"
                  >
                    <Text className="text-red-600">Delete</Text>
                  </Pressable>
                </ThemedView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
          <ThemedView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <ThemedView
                className="w-96 h-64 p-4 rounded-2xl"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <ThemedText className="text-xl font-bold mb-4">
                  Are you sure you want to delete?
                </ThemedText>
                <ThemedText className="text-lg mb-4">
                  You can cancel or confirm the action.
                </ThemedText>
                <ThemedView className="flex-row bg-transparent mt-14">
                  <ThemedButton
                    className="w-32 h-12 mr-6"
                    title={
                      countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`
                    }
                    onPress={confirmDelete}
                    disabled={countdown > 0}
                    mode={countdown === 0 ? "cancel" : "normal"}
                  >
                    {countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`}
                  </ThemedButton>
                  <ThemedButton
                    className="w-32 h-12"
                    title="Cancel"
                    onPress={() => setDeleteModalVisible(false)}
                    mode="normal"
                  >
                    Cancel
                  </ThemedButton>
                </ThemedView>
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
