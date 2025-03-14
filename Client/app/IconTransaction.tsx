import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useColorScheme } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getCategory } from "@/hooks/auth/CategoryHandler";
import { useContext } from "react";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { deleteCategory } from "@/hooks/auth/CategoryHandler";

// กำหนด Type ของ Transaction
type Transaction = {
  id: number;
  icon_name: string;
  icon_id: keyof typeof Ionicons.glyphMap;
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

  const { URL } = useContext(ServerContext);
  const { userID } = useContext(UserContext);
  const auth = useContext(AuthContext);
  const componentColor = isDarkMode ? "bg-[#181818]" : "bg-[#d8d8d8]";

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
    { id: 1, icon_name: "Rice", icon_id: "restaurant-outline" },
    { id: 2, icon_name: "Water", icon_id: "water-outline" },
    { id: 3, icon_name: "Fuel", icon_id: "flame-outline" },
    { id: 4, icon_name: "Raw Materials", icon_id: "leaf-outline" },
    { id: 5, icon_name: "Transportation", icon_id: "bus-outline" },
    { id: 6, icon_name: "Accommodation", icon_id: "home-outline" },
    { id: 7, icon_name: "Investment", icon_id: "cash-outline" },
  ]);

  const [incomeData, setIncomeData] = useState<Transaction[]>([
    { id: 1, icon_name: "Salary", icon_id: "briefcase-outline" },
    { id: 2, icon_name: "Bonus", icon_id: "gift-outline" },
    { id: 3, icon_name: "Side Income", icon_id: "trending-up-outline" },
    { id: 4, icon_name: "Interest", icon_id: "wallet-outline" },
    { id: 5, icon_name: "Dividends", icon_id: "pie-chart-outline" },
  ]);

  const transactions = isExpenses ? expensesData : incomeData;

  // ✅ เปิด Modal แก้ไข
  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditedName(transaction.icon_name);
    setSelectedIcon(transaction.icon_id);
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
      console.log("delete id:", selectedTransaction.id);
      deleteCategory(URL, selectedTransaction.id, userID!, auth?.token!).then(
        (response) => {
          if (response.success) {
            console.log("Category deleted successfully");
          } else {
            console.log("Failed to delete category");
          }
        }
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
    if (!newName || !newIcon) {
      alert("Please fill in all fields");
      return;
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      icon_name: newName,
      icon_id: newIcon,
    };

    if (isExpenses) {
      setExpensesData([...expensesData, newTransaction]);
    } else {
      setIncomeData([...incomeData, newTransaction]);
    }

    setIsAddModalVisible(false);
  };

  useEffect(() => {
    getCategory(URL, userID!, auth?.token!).then((response) => {
      if (response && response.success) {
        const categories = Array.isArray(response.result)
          ? response.result
          : [response.result];
        setIncomeData((prevIncomeData) => [
          ...prevIncomeData,
          ...categories.filter((cat) => cat.category_type === "income"),
        ]);
        setExpensesData((prevExpensesData) => [
          ...prevExpensesData,
          ...categories.filter((cat) => cat.category_type === "expense"),
        ]);

        console.log("Category get successfully");
        console.log(response.result);
        console.log("income :", incomeData);
        console.log("expense :", expensesData);
      } else {
        console.log("Failed to add category");
      }
    });
  }, [URL, userID, auth?.token]);

  useEffect(() => {
    console.log("income :", incomeData);
    console.log("expense :", expensesData);
  }, [incomeData, expensesData]);

  return (
    <>
      <ThemedSafeAreaView>
        {/* ปุ่มสลับ Income / Outcome */}
        <View className="flex-row w-full justify-center p-3">
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
              EXPENSES
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setIsExpenses(false)}
            className={`px-6 py-2 rounded-lg mx-2 ${
              !isExpenses ? "bg-green-500" : "bg-gray-300"
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
        </View>

        {/* รายการ Transactions */}
        <View className="mt-1">
          {transactions.map((item) => (
            <View
              key={item.id}
              style={{ backgroundColor: componentcolor }}
              className={`flex-row items-center justify-between p-2 rounded-lg w-[80%] mx-auto mt-2 ${componentColor}`}
            >
              {/* ไอคอน + ชื่อรายการ */}
              <View className="flex-row items-center space-x-3">
                <ThemedText className="ml-3 font-bold">
                  <Ionicons name={item.icon_id} size={24} />
                </ThemedText>
                <ThemedText className="text-[16px] font-bold ml-3">
                  {item.icon_name}
                </ThemedText>
              </View>

              {/* ปุ่มแก้ไข */}
              <Pressable
                onPress={() => openEditModal(item)}
                className="p-2 px-3 "
              >
                <ThemedText>
                  <MaterialIcons name="edit" size={22} />
                </ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
        {/* ปุ่มเพิ่มรายการใหม่ */}
        <Pressable
          onPress={() => setIsAddModalVisible(true)}
          className="mt-4 w-[80%] mx-auto p-3 rounded-full"
          style={{ backgroundColor: componentcolor }}
        >
          <ThemedText className="text-center font-bold">
            Add New Category
          </ThemedText>
        </Pressable>
      </ThemedSafeAreaView>

      {/* Modal แก้ไขรายการ */}
      {isEditModalVisible && (
        <TouchableWithoutFeedback
          onPress={() => {
            setIsEditModalVisible(false);
          }}
        >
          <View className="flex-1 items-center justify-center bg-black/50"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}>
            <View
              className={`w-4/5 p-6 rounded-3xl shadow-lg mb-36 ${
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
      )}

      {/* Modal ยืนยันการลบ */}
      {isDeleteConfirmationVisible && (
  <TouchableWithoutFeedback
    onPress={() => setIsDeleteConfirmationVisible(false)} // ปิด modal เมื่อคลิกที่พื้นหลัง
  >
    <View
      className="flex-1 items-center justify-center bg-black/50"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
        <View
          className={`w-4/5 p-6 rounded-3xl shadow-lg mb-36 ${
            isDarkMode ? "bg-[#282828]" : "bg-white"
          }`}
          onStartShouldSetResponder={() => true} // ป้องกันการคลิกที่ View ภายใน
        >
          <ThemedText className="text-xl font-bold">Confirm Delete</ThemedText>
          <ThemedText className="mt-4">
            Are you sure you want to delete this category?
          </ThemedText>

          <View className="flex-row justify-between mt-10">
            <ThemedButton
              className="bg-red-500 h-11 w-28"
              onPress={deleteTransaction} // ฟังก์ชันที่ใช้ลบรายการ
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
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
)}

      {/* Modal สำหรับเพิ่มรายการใหม่ */}
      {isAddModalVisible && (
  <TouchableWithoutFeedback
    onPress={() => setIsAddModalVisible(false)} // ปิด modal เมื่อคลิกที่พื้นหลัง
  >
    <View
      className="flex-1 items-center justify-center bg-black/50"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
        <View
          className={`w-4/5 p-6 rounded-3xl shadow-lg mb-36 ${
            isDarkMode ? "bg-[#282828]" : "bg-white"
          }`}
          onStartShouldSetResponder={() => true} // ป้องกันการคลิกที่ View ภายใน
        >
          <ThemedText className="text-xl font-bold">Add New Transaction</ThemedText>

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
              onPress={() => setIsAddModalVisible(false)} // ปิด Modal เมื่อกด Cancel
            >
              <ThemedText>Cancel</ThemedText>
            </ThemedButton>
            <ThemedButton
              className="bg-green-500 h-11 w-28"
              onPress={addTransaction} // บันทึกการเพิ่มรายการ
            >
              <ThemedText>Save</ThemedText>
            </ThemedButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
)}
    </>
  );
}
