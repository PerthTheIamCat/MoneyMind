import React from "react";
import {
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

interface AddCategoryProps {
  isIncome: boolean;
  newCategoryName: string;
  setNewCategoryNameState: (name: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  iconList: string[];
  setIsAddCategoryModalVisible: (visible: boolean) => void;
  setIncomeCategories: React.Dispatch<
    React.SetStateAction<{ name: string; icon: string }[]>
  >; // ✅ เพิ่ม
  setExpenseCategories: React.Dispatch<
    React.SetStateAction<{ name: string; icon: string }[]>
  >; // ✅ เพิ่ม
}

const AddCategory: React.FC<AddCategoryProps> = ({
  isIncome,
  newCategoryName,
  setNewCategoryNameState,
  selectedIcon,
  setSelectedIcon,
  iconList,
  setIsAddCategoryModalVisible,
  setIncomeCategories,
  setExpenseCategories,
}) => {
  const theme = useColorScheme();

  // ✅ ฟังก์ชันบันทึกหมวดหมู่
  const onSaveCategory = () => {
    if (newCategoryName.trim() === "") return; // ✅ ป้องกันการเพิ่มหมวดหมู่ที่ว่างเปล่า

    const newCategory = { name: newCategoryName, icon: selectedIcon };

    if (isIncome) {
      setIncomeCategories((prev) => {
        const filteredCategories = prev.filter((cat) => cat.name !== "add");
        return [
          ...filteredCategories,
          newCategory,
          { name: "add", icon: "plus" },
        ];
      });
    } else {
      setExpenseCategories((prev) => {
        const filteredCategories = prev.filter((cat) => cat.name !== "add");
        return [
          ...filteredCategories,
          newCategory,
          { name: "add", icon: "plus" },
        ];
      });
    }

    // ✅ รีเซ็ตค่าเมื่อกด Save
    setNewCategoryNameState("");
    setSelectedIcon("plus");

    // ✅ ปิด Modal
    setIsAddCategoryModalVisible(false);
  };

  return (
    <Modal transparent visible={true} animationType="fade">
      {/* ✅ คลิกพื้นหลังแล้วปิด Modal และรีเซ็ตค่า */}
      <TouchableWithoutFeedback
        onPress={() => {
          setNewCategoryNameState(""); // ✅ รีเซ็ตค่าชื่อหมวดหมู่
          setSelectedIcon("plus"); // ✅ รีเซ็ตค่าไอคอน
          setIsAddCategoryModalVisible(false); // ✅ ปิด Modal
        }}
      >
        <ThemedView className="flex-1 items-center justify-center bg-black/50">
          <ThemedView className={`w-4/5 p-6 rounded-3xl shadow-lg ${theme === "dark" ? "bg-[#282828]" : "bg-white"}`}>
            <ThemedText className="text-xl font-bold">
              Add New Category
            </ThemedText>

            {/* ✅ อินพุตสำหรับชื่อหมวดหมู่ */}
            <TextInput
              placeholder="Enter category name"
              value={newCategoryName}
              onChangeText={setNewCategoryNameState}
              className={`border ${
                theme === "dark"
                  ? "border-gray-600 text-white"
                  : "border-gray-300"
              } rounded-lg p-3 mb-4 w-full`}
              placeholderTextColor={theme === "dark" ? "#BBB" : "#777"}
              style={{
                backgroundColor: theme === "dark" ? "#222" : "#FFF",
              }}
            />

            <ThemedText className="text-lg font-semibold mb-2">
              Select Icon
            </ThemedText>
            <ScrollView horizontal className="flex-row gap-2">
              {iconList.map((icon) => (
                <Pressable
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  className={`p-3 m-1 rounded-full ${
                    selectedIcon === icon
                      ? isIncome
                        ? "bg-green-500" // ✅ Income เป็นสีเขียว
                        : "bg-red-500" // ✅ Expense เป็นสีแดง
                      : "bg-gray-200"
                  }`}
                >
                  <Icon
                    name={icon}
                    size={24}
                    color={selectedIcon === icon ? "white" : "black"}
                  />
                </Pressable>
              ))}
            </ScrollView>

            <ThemedView className="flex-row justify-between mt-10 gap-8 bg-transparent">
              <ThemedButton
                className="bg-gray-400 h-11 w-28"
                onPress={() => {
                  setNewCategoryNameState(""); // ✅ รีเซ็ตค่าชื่อหมวดหมู่
                  setSelectedIcon("plus"); // ✅ รีเซ็ตค่าไอคอน
                  setIsAddCategoryModalVisible(false); // ✅ ปิด Modal
                }}
              >
                <ThemedText>Cancel</ThemedText>
              </ThemedButton>
              <ThemedButton
                className="bg-green-500 h-11 w-28"
                onPress={onSaveCategory}
              >
                <ThemedText>Save</ThemedText>
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddCategory;
