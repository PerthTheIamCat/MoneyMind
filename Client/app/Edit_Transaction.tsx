import { ThemedCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedView } from "@/components/ThemedView";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  TextInput,
  useColorScheme,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { router, useLocalSearchParams } from "expo-router";
import DropdownComponent from "@/components/Dropdown";
import Icon from "react-native-vector-icons/Feather";
import { GetUserBank, resultObject } from "@/hooks/auth/GetUserBank";

import {
  GetUserTransaction,
  EditIDTransaction,
} from "@/hooks/auth/GetAllTransaction";
import AddCategory from "@/components/AddCategory"; // ✅ นำเข้าไฟล์ที่แยกไว้

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
  const { transactionId } = useLocalSearchParams();
  console.log(transactionId);
  const { bank, setTransaction, setBank, transaction, userID } =
    useContext(UserContext);
  const theme = useColorScheme();
  const [isIncome, setIsIncome] = useState(true);
  // หมวดหมู่ของ Income และ Expense พร้อมโลโก้
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState("");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("");
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [Amount, setAmount] = useState(0);
  const [Note, setNote] = useState("");
  const [newCategoryName, setNewCategoryNameState] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("plus");
  const [openTime, setOpenTime] = useState(false);
  const today = new Date();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const showTimePicker = () => setOpenTime(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const hideTimePicker = () => setOpenTime(false);

  const handleDateConfirm = (date: Date) => {
    console.log("A date has been picked: ", date.toLocaleString("th-TH"));
    const localDate = new Date(date.getTime());
    setSelectedDate(localDate);
    hideDatePicker();
  };
  const handleTimeConfirm = (date: Date) => {
    console.log("A date has been picked: ", date.toLocaleString("th-TH"));
    const localTime = new Date(date.getTime());
    setSelectedTime(localTime);
    hideTimePicker();
  };

  const auth = useContext(AuthContext);
  const { URL } = useContext(ServerContext);

  const incomeIconList = [
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
  ];

  const expenseIconList = [
    "coffee",
    "home",
    "shopping-bag",
    "film",
    "heart",
    "book",
    "file-text",
    "shield",
    "credit-card",
    "shopping-cart",
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

  const reloadTransaction = () => {
    GetUserTransaction(URL, Number(userID), auth?.token!).then((res) => {
      if (res.success) {
        setTransaction(res.result);
      }
    });
    GetUserBank(URL, userID!, auth?.token!).then((res) => {
      if (res.success) {
        setBank(res.result);
      }
    });
  };

  const [categories, setCategories] = useState(incomeCategories);
  const [budgetPlan, setBudgetPlan] = useState<number | null>(null);

  useEffect(() => {
    if (isIncome) {
      setCategories((prev) =>
        prev !== incomeCategories ? [...incomeCategories] : prev
      );
    } else {
      setCategories((prev) =>
        prev !== expenseCategories ? [...expenseCategories] : prev
      );
    }}, [isIncome, incomeCategories, expenseCategories]);

  useEffect(() => {
    if (!transaction || !transactionId) return;
    const TransactionEdit = transaction.find(
      (item) => item.id === Number(transactionId)
    );
    if (TransactionEdit) {
      const ISincome = TransactionEdit.transaction_type === "income";
      setIsIncome(ISincome);
      if (ISincome) {
        setSelectedIncomeCategory(TransactionEdit.transaction_name);
        setCategories(incomeCategories);
      } else {
        setSelectedExpenseCategory(TransactionEdit.transaction_name);
        setCategories(expenseCategories);
      }

      // setBudgetPlan(TransactionEdit);
      if (TransactionEdit.transaction_date) {
        const timestamp = Date.parse(TransactionEdit.transaction_date);
        if (!isNaN(timestamp)) {
          setSelectedDate(new Date(timestamp));
          setSelectedTime(new Date(timestamp));
        }
      }
      setBudgetPlan(TransactionEdit.split_payment_id);
      setAmount(TransactionEdit.amount);
      setNote(TransactionEdit.note);
    }

    console.log(TransactionEdit?.transaction_type);
    console.log(selectedDate);
    console.log(selectedTime);
    console.log(Amount);
    console.log(Note);

    if (
      bank &&
      bank.length > 0 &&
      scrollViewRef.current &&
      TransactionEdit?.account_id
    ) {
      const targetIndex = bank.findIndex(
        (account) => account.id === TransactionEdit?.account_id
      );

      if (targetIndex !== -1) {
        setTimeout(() => {
          const cardWidth = 280 + 36;
          const scrollPosition = targetIndex * cardWidth;
          scrollViewRef.current?.scrollTo({
            x: scrollPosition,
            animated: true,
          });
          setSelectedCard(bank[targetIndex]); // ✅ ตั้งค่า selectedCard เป็นการ์ดแรก
          console.log("🚀 First Card Selected:", bank[targetIndex]);
        }, 500);
      }
    }

  }, [transaction, bank]);

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

  const categoryRows = splitIntoTwoRows(categories); // ป้องกัน undefined
  const screenWidth = Dimensions.get("window").width; // ✅ ความกว้างของหน้าจอ
  const cardWidth = 280; // ✅ ความกว้างของ Card
  const cardMargin = 18; // ✅ Margin ระหว่างการ์ด
  const snapToInterval = cardWidth + cardMargin * 2; // ✅ ระยะ snap ให้เป๊ะ

  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedCard, setSelectedCard] = useState<resultObject | null>(null);
  const [cardPositions, setCardPositions] = useState<{ id: number; x: number }[]>([]);

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

  // ✅ เก็บวันที่และเวลาที่เลือกไว้ใน State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const updateTransaction = async () => {
    console.log(userID!);
    console.log(selectedCard?.id);
    console.log(isIncome ? selectedIncomeCategory : selectedExpenseCategory);
    console.log(Amount);
    console.log(isIncome ? "income" : "expense");
    console.log(selectedDate.toISOString().split("T")[0] +" " +selectedTime.toLocaleTimeString("en-GB", {hour: "2-digit",minute: "2-digit",}));
    console.log(Note);
    if (!selectedCard) {
      console.log("⚠️ No selectedCard, using default account");
      return;
    }
    try {
      const updatedTransaction = {
        user_id: userID!,
        account_id: selectedCard?.id,
        split_payment_id: budgetPlan,
        transaction_name: isIncome ? selectedIncomeCategory: selectedExpenseCategory,
        amount: Amount,
        transaction_type: isIncome ? "income" : "expense",
        transaction_date:
        selectedDate.toISOString().split("T")[0] +" " +selectedTime.toLocaleTimeString("en-GB", {hour: "2-digit",minute: "2-digit",}),
        note: Note,
        color_code: "#FFFFFF",
      };

      console.log("🔄 Updating account with data:", updatedTransaction);
      const response = await EditIDTransaction(
        URL,Number(transactionId),
        {
          user_id: userID!,
          account_id: selectedCard?.id,
          split_payment_id: budgetPlan,
          transaction_name: isIncome ? selectedIncomeCategory : selectedExpenseCategory,
          amount: Amount,
          transaction_type: isIncome ? "income" : "expense",
          transaction_date: selectedDate.toISOString().split("T")[0] + " " + selectedTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", }),
          note: Note,
          color_code: "#FFFFFF",
        },
        auth?.token!
      );

      if (response.success) {
        console.log("✅ Successfully updated bank data:", response.result);
        setTransaction(response.result); // อัปเดต state ทันที

        // ✅ โหลดข้อมูลบัญชีใหม่หลังจากอัปเดต
        await reloadTransaction();

        router.replace("/(tabs)/transaction"); // กลับไปหน้าธุรกรรม
      }
    } catch (error) {
      console.error("❌ Error updating account:", error);
    }
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
            className="w-full">
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
                    }}>
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
                        isOptionsVisible={false}
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
          <ThemedView className={`${ theme === "dark" ? "bg-[#1f1f1f]" : "bg-[#ffffff]" } mt-2  !justify-start !items-start w-full  rounded-t-[30px] `}>
            <ThemedView className="w-full bg-transparent">
              <ThemedView className="flex-row px-10 w-fit h-12 rounded-sm p-1 mt-5 mb-4 bg-transparent">
                <Pressable
                  onPress={() => setIsIncome(true)}
                  className={`w-32 h-full flex items-center justify-center rounded-2xl ${
                    isIncome ? "bg-green-500" : "bg-transparent"
                  }`}>
                  <ThemedText
                    className={`font-bold ${
                      isIncome
                        ? "text-white"
                        : theme === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}>
                    Income
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => setIsIncome(false)}
                  className={`w-32 h-full flex items-center justify-center rounded-2xl ${
                    !isIncome ? "bg-red-500" : "bg-transparent"
                  }`}>
                  <ThemedText
                    className={`font-bold ${
                      !isIncome
                        ? "text-white"
                        : theme === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}>
                    Expense
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>

            <ThemedView className="w-full px-10  bg-transparent">
              <ThemedText className="text-xl font-bold w-full !bg-transparent">
                Select Budget Plan
              </ThemedText>
              <ThemedView className="w-full bg-transparent">
                <DropdownComponent
                  account_id={selectedCard?.id!}
                  onChange={(id) => setBudgetPlan(id)}
                />
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
                }}>
                {categoryRows.map((row, rowIndex) => (
                  <ThemedView
                    key={rowIndex}
                    className="flex-row mr-4 ml-10 mb-2 gap-4 bg-transparent">
                    {row.map((category, index) => (
                      <Pressable
                        key={`${category.name}-${index}`}
                        onPress={() => {
                          console.log(category.name);
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
                              theme === "dark" ? "bg-[#141212]" : "bg-[#D9D9D9]"
                            } w-28 h-10 flex items-center justify-center`
                          : category.name ===
                            (isIncome
                              ? selectedIncomeCategory
                              : selectedExpenseCategory)
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
                        }}>
                        {category.name === "add" ? (
                          <Icon
                            name={category.icon}
                            size={24}
                            color={theme === "dark" ? "white" : "black"}
                          />
                        ) : (
                          <>
                            <Icon
                              name={category.icon}
                              size={18}
                              color={
                                category.name ===
                                (isIncome
                                  ? selectedIncomeCategory
                                  : selectedExpenseCategory)
                                  ? "white"
                                  : theme === "dark"
                                  ? "white"
                                  : "black"
                              }
                            />
                            <ThemedText
                              className={`font-bold ${
                                category.name ===
                                (isIncome
                                  ? selectedIncomeCategory
                                  : selectedExpenseCategory)
                                  ? "text-white"
                                  : theme === "dark"
                                  ? "text-white"
                                  : "black"
                              }`}>
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

            <ThemedView className="flex-row w-full px-8 mt-5 mb-5 !justify-around bg-transparent">
              <ThemedView className="w-40 bg-transparent">
                <ThemedInput
                  className="w-full"
                  title="date"
                  error=""
                  value={`${selectedDate.toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    timeZone: "Asia/Bangkok",
                  })}`}
                  onPress={showDatePicker}
                />
              </ThemedView>
              <ThemedView className="w-40 bg-transparent">
                <ThemedInput
                  className="w-full"
                  title="time"
                  error=""
                  value={`${selectedTime.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Bangkok",
                  })}`}
                  onPress={showTimePicker}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="w-full px-10 mt-5 justify-center !items-start bg-transparent">
              <ThemedText
                className="font-bold text-[16px] mb-2"
                style={{ color: theme === "dark" ? "#FFF" : "#333" }}>
                Amount
              </ThemedText>
              <ThemedView className="w-full flex-row">
                <TextInput
                  placeholder={"Enter Amount"}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: theme === "dark" ? "#121212" : "#D9D9D9",
                    color: theme === "dark" ? "#FFF" : "#2F2F2F",
                    borderRadius: 12,
                    padding: 10,
                  }}
                  onChangeText={(text) => setAmount(parseInt(text))}
                  value={Amount.toString()}
                  placeholderTextColor={theme === "dark" ? "#888" : "#555"} // ✅ รองรับ Dark Mode
                  className="w-full"
                />
              </ThemedView>
            </ThemedView>

            <ThemedView className="w-full px-10 mt-5 mb-10 justify-center !items-start bg-transparent">
              <ThemedText
                className="font-bold text-[16px] mb-7"
                style={{ color: theme === "dark" ? "#FFF" : "#333" }}>
                Note
              </ThemedText>
              <ThemedView className="w-full h-20 flex-row">
                <TextInput
                  placeholder="Enter Note"
                  keyboardType="default"
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={(text) => setNote(text)}
                  value={Note ?? ""}
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
                  onPress={async () => {
                    updateTransaction();
                  }}>
                  Update Transaction
                </ThemedButton>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedScrollView>
      </ThemedView>

      {isAddCategoryModalVisible && (
        <AddCategory
          isIncome={isIncome}
          newCategoryName={newCategoryName}
          setNewCategoryNameState={setNewCategoryNameState}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          iconList={isIncome ? incomeIconList : expenseIconList}
          setIsAddCategoryModalVisible={setIsAddCategoryModalVisible}
          setIncomeCategories={setIncomeCategories} // ✅ ส่งไปให้ AddCategory อัปเดตหมวดหมู่
          setExpenseCategories={setExpenseCategories} // ✅ ส่งไปให้ AddCategory อัปเดตหมวดหมู่
        />
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        is24Hour={true}
        date={selectedDate}
        maximumDate={today}
        timeZoneName="Asia/Bangkok"
        locale="th-TH"
      />

      {/* Time Picker (เลือกเวลาเกิด) - จำกัดไม่ให้เลือกเวลานาคตของวันนี้ */}
      <DateTimePickerModal
        isVisible={openTime}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
        is24Hour={true}
        date={selectedDate}
        maximumDate={today}
        timeZoneName="Asia/Bangkok"
        locale="th-TH"
      />
    </ThemedView>
  );
}
