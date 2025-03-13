import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
import { ThemedButton } from "@/components/ThemedButton";

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
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [editedName, setEditedName] = useState("");
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof Ionicons.glyphMap>("restaurant-outline");

  const componentcolor = isDarkMode ? "#181818" : "#d8d8d8";

  // ✅ เพิ่ม iconList ที่รองรับ
  const iconList: (keyof typeof Ionicons.glyphMap)[] = [
    "restaurant-outline",  // ร้านอาหาร
  "fast-food-outline",   // อาหารจานด่วน
  "cafe-outline",        // คาเฟ่
  "beer-outline",        // เครื่องดื่มแอลกอฮอล์
  "wine-outline",        // ไวน์
  "nutrition-outline",   // อาหารสุขภาพ

  // 🚗 หมวดเดินทาง & ค่าพาหนะ
  "bus-outline",         // รถโดยสาร
  "car-outline",         // รถยนต์
  "airplane-outline",    // ตั๋วเครื่องบิน
  "bicycle-outline",     // จักรยาน
  "subway-outline",      // รถไฟฟ้าใต้ดิน
  "train-outline",       // รถไฟ

  // 🏠 หมวดค่าที่พัก & ค่าครองชีพ
  "home-outline",        // ค่าที่พัก
  "bed-outline",         // โรงแรม
  "storefront-outline",  // ค่าของใช้ในบ้าน
  "construct-outline",   // ซ่อมแซมบ้าน

  // 🛍️ หมวดช้อปปิ้ง & การใช้จ่าย
  "cart-outline",        // ซื้อของ
  "pricetag-outline",    // ส่วนลด
  "bag-outline",         // กระเป๋าช้อปปิ้ง
  "shirt-outline",       // เสื้อผ้า

  // 💰 หมวดการเงิน & การลงทุน
  "cash-outline",        // เงินสด
  "wallet-outline",      // กระเป๋าเงิน
  "card-outline",        // บัตรเครดิต
  "pie-chart-outline",   // เงินปันผล
  "stats-chart-outline", // สถิติการเงิน
  "trending-up-outline", // การลงทุน
  "trending-down-outline", // การขาดทุน

  // 🏢 หมวดรายได้ & งาน
  "briefcase-outline",   // งานหลัก
  "gift-outline",        // โบนัส
  "people-outline",      // งานกลุ่ม
  "person-outline",      // งานฟรีแลนซ์
  "school-outline",      // ค่าเรียน / อบรม
  "receipt-outline",     // ใบเสร็จรับเงิน
  "business-outline",    // ธุรกิจส่วนตัว

  // 🎉 หมวดกิจกรรม & ความบันเทิง
  "musical-notes-outline", // ค่าตั๋วคอนเสิร์ต
  "tv-outline",          // ค่า Netflix / Streaming
  "game-controller-outline", // ค่าเกม
  "film-outline",        // ค่าตั๋วหนัง
  "camera-outline",      // ค่าอุปกรณ์ถ่ายภาพ
  "football-outline",    // ค่าสมัครฟิตเนส / กีฬา
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

  const transactions = isExpenses ? expensesData : expensesData;

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
              className={`font-bold ${isExpenses ? "text-white" : "text-black"}`}
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
      </ThemedSafeAreaView>

      {/* Modal แก้ไขรายการ */}
      <Modal transparent visible={isEditModalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsEditModalVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <View
              className={`w-4/5 p-6 rounded-3xl shadow-lg ${
                isDarkMode ? "bg-[#282828]" : "bg-white"
              }`}
              onStartShouldSetResponder={() => true}
            >
              <ThemedText className="text-xl font-bold">
                Edit Transaction
              </ThemedText>

              <TextInput
                value={editedName}
                onChangeText={setEditedName}
                className="border rounded-lg p-3 mb-4 w-full mt-3"
                placeholderTextColor={isDarkMode ? "#BBB" : "#777"}
                style={{ backgroundColor: isDarkMode ? "#222" : "#FFF",
                  color: isDarkMode ? "#FFF" : "#222",
                 }}
              />

              {/* ✅ แสดงรายการไอคอนให้เลือก */}
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
    </>
  );
}
