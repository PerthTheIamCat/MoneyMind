import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Pressable, View, useColorScheme, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconTransaction() {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const [isOutcome, setIsOutcome] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const cardColor = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const borderColor = isDarkMode ? "border-gray-600" : "border-gray-300";
  const buttonColor = "bg-gray-300";

  const outcomeData = [
    { id: 1, name: "ข้าว", icon: "restaurant-outline" },
    { id: 2, name: "น้ำ", icon: "water-outline" },
    { id: 3, name: "น้ำมัน", icon: "flame-outline" },
    { id: 4, name: "วัตถุดิบ", icon: "leaf-outline" },
    { id: 5, name: "ค่าเดินทาง", icon: "bus-outline" },
    { id: 6, name: "ที่พัก", icon: "home-outline" },
    { id: 7, name: "ลงทุน", icon: "cash-outline" },
  ];
  const incomeData = [
    { id: 1, name: "เงินเดือน", icon: "briefcase-outline" },
    { id: 2, name: "โบนัส", icon: "gift-outline" },
    { id: 3, name: "รายได้เสริม", icon: "trending-up-outline" },
    { id: 4, name: "ดอกเบี้ย", icon: "wallet-outline" },
    { id: 5, name: "เงินปันผล", icon: "pie-chart-outline" },
  ];

  const transactions = isOutcome ? outcomeData : incomeData;

  return (
    <ThemedSafeAreaView className={`flex-1 ${bgColor} px-6 pt-6`}>
      <ThemedView className="flex-row w-full h-10 justify-center bg-transparent p-1 mt-6 mb-4">
        <ThemedView className="flex-row w-64 h-10 rounded-full bg-[#d5d5d5]">
          <Pressable
            onPress={() => setIsOutcome(true)}
            className={`w-1/2 h-full flex items-center justify-center rounded-full ${
              isOutcome ? "bg-red-400" : "bg-transparent"
            }`}
          >
            <ThemedText className={`font-bold ${isOutcome ? "text-white" : textColor}`}>
              OUTCOME
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setIsOutcome(false)}
            className={`w-1/2 h-full flex items-center justify-center rounded-full ${
              !isOutcome ? "bg-red-400" : "bg-transparent"
            }`}
          >
            <ThemedText className={`font-bold ${!isOutcome ? "text-white" : textColor}`}>
              INCOME
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <View className="mt-1">
        {transactions.map((item) => (
          <View
            key={item.id}
            className={`flex-row items-center justify-between p-3 rounded-lg border ${cardColor} ${borderColor} w-[80%] mx-auto mt-2`}
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name={item.icon} size={22} color="#555" />
              <ThemedText className={`text-[16px] ${textColor}`}>{item.name}</ThemedText>
            </View>

            <Pressable className="p-2 rounded-full">
              <MaterialIcons name="edit" size={18} color="#555" />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable onPress={() => setModalVisible(true)} className="mt-5 items-center">
        <View className={`w-[80%] h-12 ${buttonColor} rounded-lg flex items-center justify-center shadow-lg mx-auto`}>
          <Ionicons name="add" size={26} color="white" />
        </View>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-80 bg-white p-5 rounded-lg shadow-lg">
            <ThemedText className="text-lg font-bold mb-4 text-center">เพิ่มรายการใหม่</ThemedText>
            <Pressable onPress={() => setModalVisible(false)} className="mt-4 p-3 bg-red-400 rounded-lg">
              <ThemedText className="text-white text-center">ปิด</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedSafeAreaView>
  );
}
