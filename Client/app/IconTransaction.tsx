import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Modal, Pressable, ScrollView, TextInput, TouchableWithoutFeedback, View, } from "react-native";
import { useColorScheme } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// ✅ กำหนด Type ของ Transaction
type Transaction = {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function IconTransaction() {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const [isExpenses, setIsExpenses] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // New state for Add Modal
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [editedName, setEditedName] = useState("");
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof Ionicons.glyphMap>("restaurant-outline");
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false); // State สำหรับ modal ยืนยันการลบ

  const [newName, setNewName] = useState(""); // New state for adding transaction
  const [newIcon, setNewIcon] =
    useState<keyof typeof Ionicons.glyphMap>("restaurant-outline");

  const componentcolor = isDarkMode ? "#181818" : "#d8d8d8";

  // ✅ เพิ่ม iconList ที่รองรับ
  const iconList: (keyof typeof Ionicons.glyphMap)[] = [
    "restaurant-outline",
    "fast-food-outline",
    "cafe-outline",
    "beer-outline",
    "wine-outline",
    "nutrition-outline",
    "bus-outline",
    "car-outline",
    "airplane-outline",
    "bicycle-outline",
    "subway-outline",
    "train-outline",
    "home-outline",
    "bed-outline",
    "storefront-outline",
    "construct-outline",
    "cart-outline",
    "pricetag-outline",
    "bag-outline",
    "shirt-outline",
    "cash-outline",
    "wallet-outline",
    "card-outline",
    "pie-chart-outline",
    "stats-chart-outline",
    "trending-up-outline",
    "trending-down-outline",
    "briefcase-outline",
    "gift-outline",
    "people-outline",
    "person-outline",
    "school-outline",
    "receipt-outline",
    "business-outline",
    "musical-notes-outline",
    "tv-outline",
    "game-controller-outline",
    "film-outline",
    "camera-outline",
    "football-outline",
  ];

  // ✅ ใช้ useState เก็บข้อมูลที่แก้ไขแล้ว
  const [expensesData, setExpensesData] = useState<Transaction[]>([
    { id: 1, name: "Rice", icon: "restaurant-outline" },
    { id: 2, name: "Water", icon: "water-outline" },
    { id: 3, name: "Fuel", icon: "flame-outline" },
    { id: 4, name: "Raw Materials", icon: "leaf-outline" },
    { id: 5, name: "Transportation", icon: "bus-outline" },
    { id: 6, name: "Accommodation", icon: "home-outline" },
    { id: 7, name: "Investment", icon: "cash-outline" },
  ]);

  const [incomeData, setIncomeData] = useState<Transaction[]>([
    { id: 1, name: "Salary", icon: "briefcase-outline" },
    { id: 2, name: "Bonus", icon: "gift-outline" },
    { id: 3, name: "Side Income", icon: "trending-up-outline" },
    { id: 4, name: "Interest", icon: "wallet-outline" },
    { id: 5, name: "Dividends", icon: "pie-chart-outline" },
  ]);

  const transactions = isExpenses ? expensesData : incomeData;

  // ✅ เปิด Modal แก้ไข
  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditedName(transaction.name);
    setSelectedIcon(transaction.icon);
    setIsEditModalVisible(true);
  };

  // ✅ บันทึกค่าที่แก้ไข
  const saveEdit = () => {
    if (selectedTransaction) {
      const updatedData = transactions.map((item) =>
        item.id === selectedTransaction.id
          ? { ...item, name: editedName, icon: selectedIcon }
          : item
      );

      if (isExpenses) {
        setExpensesData(updatedData);
      } else {
        setIncomeData(updatedData);
      }
    }
    setIsEditModalVisible(false);
  };

  // ✅ ลบรายการ
  const deleteTransaction = () => {
    if (selectedTransaction) {
      const updatedData = transactions.filter(
        (item) => item.id !== selectedTransaction.id
      );

      if (isExpenses) {
        setExpensesData(updatedData);
      } else {
        setIncomeData(updatedData);
      }
    }
    setIsDeleteConfirmationVisible(false);
    setIsEditModalVisible(false);
  };

  // ✅ เพิ่ม transaction ใหม่
  const addTransaction = () => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      name: newName,
      icon: newIcon,
    };

    if (isExpenses) {
      setExpensesData([...expensesData, newTransaction]);
    } else {
      setIncomeData([...incomeData, newTransaction]);
    }

    setIsAddModalVisible(false);
  };

  return (
    <>
      <ThemedSafeAreaView>
        {/* ปุ่มสลับ Income / Outcome */}
        <ThemedView className="flex-row justify-center p-1 mt-6 mb-4">
          <ThemedView className="flex-row w-[50%] rounded-full bg-gray-300">
            <Pressable
              onPress={() => setIsExpenses(true)}
              className={`px-6 py-2 rounded-lg mx-2 ${
                isExpenses ? "bg-red-500" : "bg-gray-300"
              }`}
            >
              <ThemedText
                className={`font-bold ${
                  isExpenses ? "text-white" : "text-black"
                }`}
              >
                OUTCOME
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setIsExpenses(false)}
              className={`px-6 py-2 rounded-lg mx-2 ${
                !isExpenses ? "bg-red-500" : "bg-gray-300"
              }`}
            >
              <ThemedText
                className={`font-bold ${
                  !isExpenses ? "text-white" : "text-black"
                }`}
              >
                INCOME
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        {/* รายการ Transactions */}
        <View className="mt-1">
          {transactions.map((item) => (
            <View
              key={item.id}
              style={{ backgroundColor: componentcolor }}
              className="flex-row items-center justify-between p-3 rounded-lg border w-[80%] mx-auto mt-2"
            >
              {/* ไอคอน + ชื่อรายการ */}
              <View className="flex-row items-center space-x-3">
                <ThemedText className="ml-3">
                  <Ionicons name={item.icon} size={22} />
                </ThemedText>
                <ThemedText className="text-[16px] ml-3">
                  {item.name}
                </ThemedText>
              </View>

              {/* ปุ่มแก้ไข */}
              <Pressable
                onPress={() => openEditModal(item)}
                className="p-2 rounded-full"
              >
                <ThemedText>
                  <MaterialIcons name="edit" size={18} />
                </ThemedText>
              </Pressable>
            </View>
          ))}
        </View>

        {/* ปุ่มเพิ่มรายการใหม่ */}
        <Pressable
          onPress={() => setIsAddModalVisible(true)}
          className="mt-4 w-[80%] mx-auto p-3 rounded-full items-center"
          style={{ backgroundColor: componentcolor }}
        >
          <Ionicons name="add" size={26} color="white" />
        </Pressable>
      </ThemedSafeAreaView>

      {/* Modal แก้ไขรายการ */}
      <Modal transparent visible={isEditModalVisible} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            setIsEditModalVisible(false);
          }}
        >
          <View className="flex-1 items-center justify-center bg-black/50">
            <View
              className={`w-4/5 p-6 rounded-3xl shadow-lg ${
                isDarkMode ? "bg-[#282828]" : "bg-white"
              }`}
              onStartShouldSetResponder={() => true}
            >
              <ThemedText className="text-xl font-bold">
                Edit Category
              </ThemedText>
              {/* ปุ่มลบที่มุมขวาบน */}
              <Pressable
                onPress={() => {
                  setIsDeleteConfirmationVisible(true);
                  // ต้องเพิ่มฟังก์ชันการลบรายการตามที่คุณต้องการ
                  // เช่น การลบจาก `expensesData` หรือ `incomeData`
                }}
                className="absolute top-4 right-4 p-2"
              >
                <View className="bg-red-500 p-1 px-2 rounded-xl">
                  <ThemedText className="text-white">Delete</ThemedText>
                </View>
              </Pressable>

              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                className="border rounded-lg p-3 mb-4 w-full mt-3"
                placeholderTextColor={isDarkMode ? "#BBB" : "#777"}
                style={{
                  backgroundColor: isDarkMode ? "#222" : "#FFF",
                  color: isDarkMode ? "#FFF" : "#222",
                }}
              />

              <ScrollView horizontal className="flex-row gap-2">
                {iconList.map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    className={`p-3 m-1 rounded-full ${
                      selectedIcon === icon
                        ? isExpenses
                          ? "bg-red-500"
                          : "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <Ionicons
                      name={icon}
                      size={24}
                      color={selectedIcon === icon ? "white" : "black"}
                    />
                  </Pressable>
                ))}
              </ScrollView>

              <View className="flex-row justify-between mt-10 gap-8">
                <ThemedButton
                  className="bg-gray-400 h-11 w-28"
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <ThemedText>Cancel</ThemedText>
                </ThemedButton>
                <ThemedButton
                  className="bg-green-500 h-11 w-28"
                  onPress={saveEdit}
                >
                  <ThemedText>Save</ThemedText>
                </ThemedButton>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal ยืนยันการลบ */}
      <Modal
        transparent
        visible={isDeleteConfirmationVisible}
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => setIsDeleteConfirmationVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50">
            <View
              className={`w-4/5 p-6 rounded-3xl shadow-lg ${
                isDarkMode ? "bg-[#282828]" : "bg-white"
              }`}
              onStartShouldSetResponder={() => true}
            >
              <ThemedText className="text-xl font-bold">
                Confirm Delete
              </ThemedText>

              <ThemedText className="mt-4">
                Are you sure you want to delete this category?
              </ThemedText>

              <View className="flex-row justify-between mt-10 ">
                <ThemedButton
                  className="bg-red-500 h-11 w-28"
                  onPress={deleteTransaction}
                >
                  <ThemedText>Delete</ThemedText>
                </ThemedButton>
                <ThemedButton
                  className="bg-gray-400 h-11 w-28"
                  onPress={() => {
                    setIsEditModalVisible(false);
                    setIsDeleteConfirmationVisible(false);
                  }}
                >
                  <ThemedText>Cancel</ThemedText>
                </ThemedButton>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal สำหรับเพิ่มรายการใหม่ */}
      <Modal transparent visible={isAddModalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsAddModalVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <View
              className={`w-4/5 p-6 rounded-3xl shadow-lg ${
                isDarkMode ? "bg-[#282828]" : "bg-white"
              }`}
              onStartShouldSetResponder={() => true}
            >
              <ThemedText className="text-xl font-bold">
                Add New Transaction
              </ThemedText>

              <TextInput
                value={newName}
                onChangeText={setNewName}
                className="border rounded-lg p-3 mb-4 w-full mt-3"
                placeholderTextColor={isDarkMode ? "#BBB" : "#777"}
                style={{
                  backgroundColor: isDarkMode ? "#222" : "#FFF",
                  color: isDarkMode ? "#FFF" : "#222",
                }}
              />

              <ScrollView horizontal className="flex-row gap-2">
                {iconList.map((icon) => (
                  <Pressable
                    key={icon}
                    onPress={() => setNewIcon(icon)}
                    className={`p-3 m-1 rounded-full ${
                      newIcon === icon
                        ? isExpenses
                          ? "bg-red-500"
                          : "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <Ionicons
                      name={icon}
                      size={24}
                      color={newIcon === icon ? "white" : "black"}
                    />
                  </Pressable>
                ))}
              </ScrollView>

              <View className="flex-row justify-between mt-10 gap-8">
                <ThemedButton
                  className="bg-gray-400 h-11 w-28"
                  onPress={() => setIsAddModalVisible(false)}
                >
                  <ThemedText>Cancel</ThemedText>
                </ThemedButton>
                <ThemedButton
                  className="bg-green-500 h-11 w-28"
                  onPress={addTransaction}
                >
                  <ThemedText>Save</ThemedText>
                </ThemedButton>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
