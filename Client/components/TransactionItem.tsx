import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { View, Text, Pressable, Modal } from "react-native";
import { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { UserTransaction } from "@/hooks/auth/GetAllTransaction";
import { router } from "expo-router";
import { TouchableWithoutFeedback } from "react-native";

interface TransactionItemProps {
  transaction: UserTransaction;
  theme: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TransactionItem({ transaction, theme, onEdit, onDelete }: TransactionItemProps) {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  // const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  // useEffect(() => {
  //   let timer: ReturnType<typeof setInterval>;
  //   if (showOverlay && countdown > 0) {
  //     timer = setInterval(() => {
  //       setCountdown((prev) => prev - 1);
  //     }, 1000);
  //   } else if (countdown === 0) {
  //     handleConfirmDelete();
  //   }
  //   return () => clearInterval(timer);
  // }, [showOverlay, countdown]);

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
    onDelete(); // เรียก function ที่ส่งมา
  };

  // const handleCancel = () => {
  //   setShowOverlay(false);
  // };

  return (
    <>
      <View className={`flex-row items-center justify-center w-10/12 ${componentcolor} p-4 rounded-lg mb-2 shadow-md`}>
        <Image source={require("@/assets/logos/LOGO.png")} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }} />
        <View className="flex-1">
          <ThemedText className="font-bold text-lg">{transaction.transaction_name}</ThemedText>
          <ThemedText>{transaction.note}</ThemedText>
        </View>
        <Text className={`font-bold text-[16px] ${transaction.transaction_type === "income" ? "text-green-500" : "text-red-500"}`}>
          {transaction.amount}
        </Text>
        <Pressable onPress={() => setShowDropdown(!showDropdown)}>
          <Entypo name="dots-three-vertical" size={20} color={componenticon} style={{ marginLeft: 8 }} />
        </Pressable>

        {showDropdown && (
          <ThemedView className="absolute top-10 right-2 flex-row border border-gray-300 shadow-md rounded-lg w-fit z-50">
            <Pressable onPress={ () => {onEdit(); setShowDropdown(false); }} className="p-2 border-b border-gray-200">
              <Text className="text-green-500">Edit</Text>
            </Pressable>
            <Pressable onPress={handleDelete} className="p-2">
              <Text className="text-red-600">Delete</Text>
            </Pressable>
          </ThemedView>
        )}
      </View>

      {/* {showOverlay && (
        <Modal>
        <Pressable className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
          <ThemedView className="p-6 rounded-lg w-80 shadow-md text-center h-52">
            <ThemedText className="text-lg font-bold mb-4">Confirm Deletion</ThemedText>
            <ThemedText className="mb-4">Are you sure you want to delete this transaction?</ThemedText>
            <View className="flex-row justify-between gap-5">
              <Pressable onPress={handleCancel} className="bg-gray-300 px-4 py-2 rounded-lg">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirmDelete} className="bg-red-500 px-4 py-2 rounded-lg">
                <Text className="text-white">Confirm ({countdown}s)</Text>
              </Pressable>
            </View>
          </ThemedView>
        </Pressable>
        </Modal>
      )} */}

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
                    title={countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`}
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