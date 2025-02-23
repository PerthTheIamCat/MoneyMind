import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedView } from "@/components/ThemedView";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/hooks/conText/UserContext";
import { CreateUserTransaction } from "@/hooks/auth/CreateTransaction";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";
import {
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  useColorScheme,
} from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { router } from "expo-router";
import DropdownComponent from "@/components/Dropdown";
import { ThemedScrollViewCenter } from "@/components/ThemedScrollViewCenter";
import Icon from "react-native-vector-icons/Feather";
import DateTimePickerInput from "@/components/Date_and_Time";
import CustomDateTimePicker from "@/components/Date_and_Time";
import { resultObject } from "@/hooks/auth/GetUserBank";
import { th } from "react-native-paper-dates";
import CustomPaperDatePicker from "@/components/Date_and_Time";
import { GetUserTransaction } from "@/hooks/auth/GetAllTransaction";
import { transform } from "@babel/core";




type ThemedInputProps = {
  className?: string;
  error?: string;
  title?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  [key: string]: any;
};

export default function Index() {
  const { bank,setTransaction,transaction,userID} = useContext(UserContext);
  const theme = useColorScheme();
  const [isIncome, setIsIncome] = useState(true);
  // หมวดหมู่ของ Income และ Expense พร้อมโลโก้
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =useState(false);
  const [Amount, setAmount] = useState(0);
  const [Note, setNote] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("plus");
  
  const auth = useContext(AuthContext);
  const { URL } = useContext(ServerContext);

  const iconList = [
    "dollar-sign",
    "gift",
    "trending-up",
    "briefcase",
    "home",
    "pie-chart",
    "music",
    "percent",
    "shopping-cart",
    "users",
    "bar-chart",
    "more-horizontal",
    "clock",
  ];
  const [incomeCategories, setIncomeCategories] = useState([
    { name: "Salary", icon: "dollar-sign" },
    { name: "Bonus", icon: "gift" },
    { name: "Investment", icon: "trending-up" },
    { name: "Freelance", icon: "briefcase" },
    { name: "Rental Income", icon: "home" },
    { name: "Dividends", icon: "pie-chart" },
    { name: "Royalties", icon: "music" },
    { name: "Interest", icon: "percent" },
    { name: "Selling", icon: "shopping-cart" },
    { name: "Consulting", icon: "users" },
    { name: "Stock Trading", icon: "bar-chart" },
    { name: "Other", icon: "more-horizontal" },
    { name: "Passive Income", icon: "trending-up" },
    { name: "Side Hustle", icon: "briefcase" },
    { name: "Part-time Job", icon: "clock" },
    { name: "add", icon: "plus" },
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    { name: "Food", icon: "coffee" },
    { name: "Transport", icon: "car" },
    { name: "Rent", icon: "home" },
    { name: "Shopping", icon: "shopping-bag" },
    { name: "Entertainment", icon: "film" },
    { name: "Healthcare", icon: "heart" },
    { name: "Education", icon: "book" },
    { name: "Bills", icon: "file-text" },
    { name: "Insurance", icon: "shield" },
    { name: "Subscriptions", icon: "credit-card" },
    { name: "Travel", icon: "airplane" },
    { name: "Fitness", icon: "dumbbell" },
    { name: "Groceries", icon: "shopping-cart" },
    { name: "Other", icon: "more-horizontal" },
    { name: "add", icon: "plus" },
  ]);

  const [categories, setCategories] = useState(incomeCategories);
  
  const [budgetPlan, setBudgetPlan] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ฟังก์ชันเพิ่มหมวดหมู่ โดยให้ปุ่ม `+` คงอยู่ท้ายสุดเสมอ
  const addNewCategory = () => {
    console.log("Add Category Clicked");
    setCategories([
      ...categories.slice(0, -1),
      { name: `New ${categories.length - 1}`, icon: "file-plus" },
      { name: "add", icon: "plus" },
    ]);
  };
  useEffect(() => {
    setCategories(isIncome ? [...incomeCategories] : [...expenseCategories]);
  }, [isIncome, incomeCategories, expenseCategories]);

  // ฟังก์ชันแบ่งหมวดหมู่เป็น 2 แถวเสมอ
  const splitIntoTwoRows = (arr: any[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return [[], []]; // ป้องกัน error ถ้า categories เป็น undefined
    const row1: any[] = [];
    const row2: any[] = [];
    arr.forEach((item, index) => {
      if (index % 2 === 0) {
        row1.push(item);
      } else {
        row2.push(item);
      }
    });
    return [row1, row2]; // ต้อง return array of arrays เสมอ
  };

  const categoryRows = splitIntoTwoRows(categories) ?? [[], []]; // ป้องกัน undefined

  const screenWidth = Dimensions.get("window").width; // ✅ ความกว้างของหน้าจอ
  const cardWidth = 280; // ✅ ความกว้างของ Card
  const cardMargin = 18; // ✅ Margin ระหว่างการ์ด
  const snapToInterval = cardWidth + cardMargin * 2; // ✅ ระยะ snap ให้เป๊ะ

  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedCard, setSelectedCard] = useState<resultObject | null>(null);
  const [cardPositions, setCardPositions] = useState<
    { id: number; x: number }[]
  >([]);

  // ✅ เก็บตำแหน่ง X ของแต่ละ Card
  const storeCardPosition = (id: number, x: number) => {
    setCardPositions((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (!exists) return [...prev, { id, x }];
      return prev;
    });
  };

  // ✅ ตรวจจับ Card ที่อยู่กลางหน้าจอ
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerScreen = scrollX + screenWidth / 2;

    let closestCard: resultObject | null = null as resultObject | null;
    let minDistance = Number.MAX_VALUE;

    cardPositions.forEach((cardPos) => {
      const distance = Math.abs(cardPos.x - centerScreen);
      if (distance < minDistance) {
        minDistance = distance;
        closestCard = bank?.find((item) => item.id === cardPos.id) || null;
      }
    });

    if (closestCard && (closestCard as resultObject).id !== selectedCard?.id) {
      setSelectedCard(closestCard);
      console.log("🎯 Selected Card:", closestCard);
    }
  };

  // ✅ เลื่อน ScrollView ให้การ์ดแรกอยู่กลางตอนเริ่ม
  useEffect(() => {
    if (bank && bank.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        setSelectedCard(bank[0]); // ✅ ตั้งค่า selectedCard เป็นการ์ดแรก
        console.log("🚀 First Card Selected:", bank[0]);
      }, 500);
    }
  }, [bank]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ฟังก์ชันรับค่าและอัปเดต State
  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]); // เก็บแค่ `YYYY-MM-DD`
    console.log("📅 Selected Date:", date.toISOString().split("T")[0]);
  };

  const handleTimeChange = (time: Date) => {
    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setSelectedTime(formattedTime);
    console.log("⏰ Selected Time:", formattedTime);
  };

  // ✅ ฟังก์ชันบันทึกหมวดหมู่ใหม่
  const onSaveCategory = () => {
    if (newCategoryName.trim() === "") return; // ✅ ป้องกันหมวดหมู่ที่เป็นค่าว่าง
  
    const newCategory = { name: newCategoryName, icon: selectedIcon };
    const addCategory = { name: "add", icon: "plus" };
  
    if (isIncome) {
      setIncomeCategories((prev) => {
        const filteredCategories = prev.filter((cat) => cat.name !== "add");
        return [...filteredCategories, newCategory, addCategory]; // ✅ สร้าง array ใหม่เพื่อ trigger render
      });
    } else {
      setExpenseCategories((prev) => {
        const filteredCategories = prev.filter((cat) => cat.name !== "add");
        return [...filteredCategories, newCategory, addCategory]; // ✅ สร้าง array ใหม่เพื่อ trigger render
      });
    }
  
    setNewCategoryName(""); // ✅ รีเซ็ตค่า
    setSelectedIcon("plus"); // ✅ รีเซ็ตไอคอน
  
    setTimeout(() => {
      setIsAddCategoryModalVisible(false); // ✅ ปิด Modal
    }, 0);
  };

        
  const saveTransaction = () => {
    if (!selectedCard) {
      console.log("⚠️ No selectedCard, using default account");
      return;
    }
  
    // console.log("✅ Selected transaction ID:", (transaction?.length || 0) + 1);
    
    const reloadTransaction = () => {
        GetUserTransaction(URL, userID!, auth?.token!).then((res) => {
          if (res) {
            setTransaction(res);
          }
        });
      };

    CreateUserTransaction(URL, {
      id: (transaction?.length || 0) + 1,
      user_id: userID,
      account_id: selectedCard.id,
      split_payment_id : 0,
      transaction_name : selectedIncomeCategory || selectedExpenseCategory,
      amount : Amount,
      transaction_type : isIncome ? "income" : "expense",
      transaction_date : selectedDate,
      note : Note,
      color_code : null,


    }, auth?.token!)
      .then((response) => {
        if (response) {
          setTransaction([
            ...(transaction||[]),
            {
              id: (transaction?.length || 0) + 1,
              user_id: userID!,
              account_id: selectedCard?.id,
              split_payment_id: 0,
              transaction_name: selectedIncomeCategory || selectedExpenseCategory,
              amount: Amount,
              transaction_type: isIncome ? "income" : "expense",
              transaction_date: selectedDate || new Date().toISOString().split("T")[0],
              note: Note,
              color_code: "#FFFFFF",
            },
          ]);
          reloadTransaction();
          router.replace("/(tabs)/transaction");
        } else {
          console.log(response);
        }
      });
  };
  

  return (
    <ThemedView className="w-full !h-full flex-1">
      <ThemedView className="w-full !h-full flex-1">
        <ThemedView className="!items-start pl-10 w-full mt-5">
          <ThemedText className="text-[20px] font-bold mb-2">
            Account
          </ThemedText>
        </ThemedView>

        <ThemedView className="!items-center w-full mb-5 ">
          <ScrollView
            ref={scrollViewRef} // ✅ ให้ ScrollView ใช้ ref
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapToInterval} // ✅ ทำให้ ScrollView หยุดที่แต่ละการ์ด
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16} // ✅ ตรวจจับ scroll อย่างละเอียด
            className="w-full"
          >
            <ThemedView className="w-full px-16">
              <ThemedView className="mt-0.5 mb-1 flex-row space-x-1 gap-5">
                {bank?.map((account: resultObject, index: number) => (
                  <Pressable
                    key={account.id}
                    onLayout={(event) => {
                      const x =
                        event.nativeEvent.layout.x +
                        10 +
                        event.nativeEvent.layout.width / 2;
                      storeCardPosition(account.id, x);
                    }}
                  >
                    <ThemedView>
                      <ThemedCard
                        key={account.id}
                        CardID={account.id}
                        name={account.account_name}
                        color={account.color_code}
                        balance={account.balance.toString()}
                        mode="large"
                        imageIndex={Number(account.icon_id)}
                        className={`!items-center !justify-center bg-[#fefefe] rounded-lg 
                          ${
                            selectedCard?.id === account.id
                              ? "border-4 border-[#03A696]"
                              : "border-0"
                          }
                        `}
                      />
                    </ThemedView>
                  </Pressable>
                ))}
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </ThemedView>

        <ThemedScrollView
          vertical={true}
          horizontal={false}
          className="w-full h-full"
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEventThrottle={16} // ควบคุมอัตราการอัปเดต scroll event
          decelerationRate={0.95} // ทำให้ scroll ช้าลง (ค่าปกติคือ 0.998, ยิ่งต่ำยิ่งช้าลง)
        >
          <ThemedView
            className={`${
              theme === "dark" ? "bg-[#222222]" : "bg-[#ffffff]"
            } mt-2  !justify-start !items-start w-full  rounded-t-[30px] `}
          >
            <ThemedView className="flex-row px-10 w-fit h-12 rounded-sm p-1 mt-5 mb-4 bg-transparent">
              <Pressable
                onPress={() => setIsIncome(true)}
                className={`w-32 h-full flex items-center justify-center rounded-2xl ${
                  isIncome ? "bg-green-500" : "bg-transparent"
                }`}
              >
                <ThemedText
                  className={`font-bold ${
                    isIncome
                      ? "text-white"
                      : theme === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Income
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => setIsIncome(false)}
                className={`w-32 h-full flex items-center justify-center rounded-2xl ${
                  !isIncome ? "bg-red-500" : "bg-transparent"
                }`}
              >
                <ThemedText
                  className={`font-bold ${
                    !isIncome
                      ? "text-white"
                      : theme === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Expense
                </ThemedText>
              </Pressable>
            </ThemedView>

            <ThemedView className="w-full px-10  bg-transparent">
              <ThemedText className="text-xl font-bold w-full !bg-transparent">
                Select Budget Plan
              </ThemedText>

              <ThemedView className="w-full bg-transparent">
                <DropdownComponent />
              </ThemedView>
            </ThemedView>

            <ThemedView className="mt-1 w-full  justify-center !items-start bg-transparent">
              <ThemedText className="font-bold px-10 text-[16px]">
                Category
              </ThemedText>

              {/* Scroll แนวนอน แต่แบ่ง 2 แถว */}
              <ThemedScrollView
                horizontal
                className="h-[90px] w-full mt-3 py-2 bg-transparent"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "column",
                  rowGap: 4, // ลดช่องว่างระหว่างแถว
                  alignItems: "center", // จัดให้แถว 1 และ 2 เริ่มใกล้กันมากขึ้น
                }}
              >
                {/* 2 แถวแน่นอน */}
                {categoryRows.map((row, rowIndex) => (
                  <ThemedView
                    key={rowIndex}
                    className="flex-row mr-4 ml-10 mb-2 gap-4 bg-transparent"
                  >
                    {row.map((category, index) => (
                      <Pressable
                      key={`${category.name}-${index}`}
                      onPress={() => {
                        if (category.name === "add") {
                          setIsAddCategoryModalVisible(true);
                        } else {
                          if (isIncome) {
                            setSelectedIncomeCategory(category.name);
                          } else {
                            setSelectedExpenseCategory(category.name);
                          }
                        }
                      }}
                      className={`px-4 py-2 rounded-lg flex-shrink-0 flex-row items-center gap-4
                        ${
                          category.name === "add"
                            ? `${
                                theme === "dark"
                                  ? "bg-[#141212]"
                                  : "bg-[#D9D9D9]"
                              } w-28 h-10 flex items-center justify-center`
                            : category.name === (isIncome ? selectedIncomeCategory : selectedExpenseCategory)
                            ? isIncome
                              ? "bg-green-700 text-white" // ✅ สีเข้มขึ้นเมื่อถูกเลือก (Income)
                              : "bg-red-700 text-white" // ✅ สีเข้มขึ้นเมื่อถูกเลือก (Expense)
                            : theme === "dark"
                            ? "bg-[#141212] text-white"
                            : "bg-[#D9D9D9] text-black"
                        }`}
                      style={{
                        flexBasis: "auto",
                        minWidth: 90,
                        paddingHorizontal: 12,
                      }}
                    >
                      {category.name === "add" ? (
                        <Icon name={category.icon} size={24} color={theme === "dark" ? "white" : "black"} />
                      ) : (
                        <>
                          <Icon
                            name={category.icon}
                            size={18}
                            color={
                              category.name === (isIncome ? selectedIncomeCategory : selectedExpenseCategory)
                                ? "white"
                                : theme === "dark"
                                ? "white"
                                : "black"
                            }
                          />
                          <ThemedText
                            className={`font-bold ${
                              category.name === (isIncome ? selectedIncomeCategory : selectedExpenseCategory)
                                ? "text-white"
                                : theme === "dark"
                                ? "text-white"
                                : "black"
                            }`}
                          >
                            {category.name}
                          </ThemedText>
                        </>
                      )}
                    </Pressable>
                    
                    ))}
                  </ThemedView>
                ))}
              </ThemedScrollView>
            </ThemedView>

            <ThemedView className="flex-row w-full mt-5 mb-5 justify-start !items-start bg-transparent gap-10">
              <ThemedView className="bg-transparent">
                <CustomPaperDatePicker
                  title="Date"
                  mode="date"
                  onConfirm={setSelectedDate}
                />
              </ThemedView>
              <ThemedView className="bg-transparent">
                <CustomPaperDatePicker
                  title="Time"
                  mode="time"
                  onConfirm={setSelectedTime}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="w-full px-10 mt-5 justify-center !items-start bg-transparent">
              <ThemedText
                className="font-bold text-[16px] mb-2"
                style={{ color: theme === "dark" ? "#FFF" : "#333" }}
              >
                Amount
              </ThemedText>
              <ThemedView className="w-full flex-row">
                <TextInput
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: theme === "dark" ? "#121212" : "#D9D9D9",
                    color: theme === "dark" ? "#FFF" : "#2F2F2F",
                    borderRadius: 12,
                    padding: 10,
                  }}
                  onChangeText={(text) => setAmount(parseInt(text))}
                  placeholderTextColor={theme === "dark" ? "#888" : "#555"} // ✅ รองรับ Dark Mode
                  className="w-full"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="w-full px-10 mt-5 mb-10 justify-center !items-start bg-transparent">
              <ThemedText
                className="font-bold text-[16px] mb-7"
                style={{ color: theme === "dark" ? "#FFF" : "#333" }}
              >
                Note
              </ThemedText>
              <ThemedView className="w-full h-20 flex-row">
                <TextInput
                  placeholder="Enter Note"
                  keyboardType="default"
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={(text) => setNote(text)}
                  style={{
                    backgroundColor: theme === "dark" ? "#121212" : "#D9D9D9",
                    color: theme === "dark" ? "#FFF" : "#2F2F2F",
                    borderRadius: 12,
                    padding: 10,
                    minHeight: 100, // ✅ เพิ่มความสูงของ Input
                  }}
                  placeholderTextColor={theme === "dark" ? "#888" : "#555"}
                  className="w-full"
                />
              </ThemedView>
              <ThemedView className="w-full mt-10 mb-32 bg-transparent">
                <ThemedButton
                  className=" px-10 w-56 h-12 bg-green-500"
                  
                  onPress={async() => {
                    saveTransaction()

                  }}
                >
                  Add Transaction
                </ThemedButton>
              </ThemedView>
            </ThemedView>

          </ThemedView>
        </ThemedScrollView>
      </ThemedView>
      <Modal
  key={isAddCategoryModalVisible ? "visible" : "hidden"}
  transparent
  visible={isAddCategoryModalVisible}
  animationType={Platform.OS === "ios" ? "none" : "fade"}
  onRequestClose={() => setIsAddCategoryModalVisible(false)}
>
  <ThemedView
    className={`flex-1 items-center justify-center ${
      theme === "dark" ? "bg-black/80" : "bg-black/50"
    }`}
  >
    <ThemedView
      className={`w-4/5 p-6 rounded-3xl shadow-lg ${
        theme === "dark" ? "bg-[#2F2F2F]" : "bg-white"
      }`}
    >
      <ThemedText
        className={`text-xl font-bold mb-3 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Add New Category
      </ThemedText>

      {/* Input ชื่อหมวดหมู่ */}
      <ThemedText
        className={`text-lg font-semibold mb-2 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Category Name
      </ThemedText>
      <TextInput
        placeholder="Enter category name"
        value={newCategoryName}
        onChangeText={setNewCategoryName}
        className={`border ${
          theme === "dark" ? "border-gray-600 text-white" : "border-gray-300"
        } rounded-lg p-3 mb-4 w-full`}
        placeholderTextColor={theme === "dark" ? "#BBB" : "#777"}
        style={{
          backgroundColor: theme === "dark" ? "#222" : "#FFF",
        }}
      />

      {/* เลือกไอคอน */}
      <ThemedText
        className={`text-lg font-semibold mb-2 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Select Icon
      </ThemedText>
      <ScrollView
        horizontal
        className="flex-row gap-2"
        showsHorizontalScrollIndicator={false}
      >
        {iconList.map((icon) => (
          <Pressable
            key={icon}
            onPress={() => setSelectedIcon(icon)}
            className={`p-3 m-1 rounded-full ${
              selectedIcon === icon
                ? "bg-green-500"
                : theme === "dark"
                ? "bg-gray-400"
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

      {/* ปุ่ม Save & Cancel */}
      <ThemedView className="flex-row justify-between mt-10 gap-8 bg-transparent">
        <ThemedButton
          className="bg-gray-400 h-11 w-28"
          onPress={() => setIsAddCategoryModalVisible(false)}
        >
          <ThemedText>Cancel</ThemedText>
        </ThemedButton>

        <ThemedButton
          className="bg-green-500 h-11 w-28"
          onPress={onSaveCategory} // ✅ เรียกฟังก์ชันเพิ่มหมวดหมู่
        >
          <ThemedText>Save</ThemedText>
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  </ThemedView>
</Modal>


    </ThemedView>
  );
}
