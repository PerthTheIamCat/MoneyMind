import {
  useState,
  useEffect,
  useRef,
  SetStateAction,
  useCallback,
} from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedCard } from "@/components/ThemedCard";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";
import { Animated, Easing } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedScrollViewCenter } from "@/components/ThemedScrollViewCenter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { resultObject } from "@/hooks/auth/GetUserBank";

const { height } = Dimensions.get("window"); // ใช้สำหรับกำหนด borderRadius

export default function SplitPay() {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const componentColor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  const [selected, setSelected] = useState("budget");
  const [accountCheck, setAccount] = useState(false);
  const [cloudpocketCheck, setCloudPocket] = useState(false);
  const { bank } = useContext(UserContext);
  const [BudgetID, setBudgetID] = useState({ id: "" });
  const [isBudget, setIsBudget] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const slideAnim = useRef(new Animated.Value(300)).current;

  const [selectedCard, setSelectedCard] = useState<resultObject | null>(null);
  const [budgetName, setBudgetName] = useState("");
  const limitRef = useRef(0);
  const budgetLimitRef = useRef(0);
  const sliderValueRef = useRef(0); // ✅ ใช้ `useRef` เพื่อกันการ re-render
  const [sliderValue, setSliderValue] = useState(0); // ✅ ใช้เพื่อทำให้ UI อัปเดต

  const [selectedColor, setSelectedColor] = useState("");
  const isEditing = useRef(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // 📌 อัปเดต budgetLimit ตาม limit ทุกครั้งที่เปลี่ยนค่า
  const [limit, setLimit] = useState(0); // ✅ ใช้ State คุมค่า
  const [budgetLimit, setBudgetLimit] = useState(0);
  const isDragging = useRef(false); // ✅ ใช้ตรวจสอบว่ากำลังลากอยู่หรือไม่
  const [inputValue, setInputValue] = useState(""); // ✅ ใช้สำหรับ UI เท่านั้น

  const [dummyState, setDummyState] = useState(false); // ✅ ใช้ trigger UI update เมื่อจำเป็น

  const updateUI = () => setDummyState((prev) => !prev); // ✅ Trigger UI update เมื่อค่ามีการเปลี่ยนแปลง
  
 // ✅ เมื่อพิมพ์ใน TextInput → อัปเดตค่า Budget และ Slider (แต่ไม่ trigger `re-render`)
const handleAmountChange = useCallback((text: string) => {
  let newAmount = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
  if (selectedCard) {
    newAmount = Math.min(newAmount, selectedCard.balance);
  }
  budgetLimitRef.current = newAmount;
  sliderValueRef.current = selectedCard && selectedCard.balance > 0 ? (newAmount / selectedCard.balance) * 100 : 0;

  setInputValue(newAmount.toFixed(0)); // ✅ อัปเดต UI เท่านั้น
  updateUI(); // ✅ Trigger UI update
}, [selectedCard]);

// ✅ เมื่อเลื่อน Slider → อัปเดตค่า Budget (แต่ไม่ trigger `re-render`)
const handleSliderChange = useCallback((value: number) => {
  sliderValueRef.current = value;
  if (selectedCard) {
    budgetLimitRef.current = (selectedCard.balance * value) / 100;
    setInputValue(budgetLimitRef.current.toFixed(0)); // ✅ อัปเดต UI เท่านั้น
    updateUI(); // ✅ Trigger UI update
  }
}, [selectedCard]);

// ✅ รีเซ็ตค่าทุกครั้งที่เปลี่ยนบัญชี
useEffect(() => {
  if (selectedCard) {
    sliderValueRef.current = 0;
    budgetLimitRef.current = (selectedCard.balance * 50) / 100;
    setInputValue(budgetLimitRef.current.toFixed(2));
    updateUI(); // ✅ Trigger UI update
  }
}, [selectedCard]);

// ✅ หยุดลากแล้วค่อยอัปเดตค่า Budget (ลด re-render)
const handleSliderComplete = useCallback((value: number) => {
  isDragging.current = false;
  if (selectedCard) {
    const calculatedAmount = (selectedCard.balance * value) / 100;
    budgetLimitRef.current = calculatedAmount;
  }
}, [selectedCard]);


useEffect(() => {
  setSliderValue(sliderValueRef.current);
  setBudgetLimit(budgetLimitRef.current);
}, [sliderValueRef.current, budgetLimitRef.current]); // ✅ ตรวจจับการเปลี่ยนแปลง

  const colors = [
    "#F94144",
    "#F3722C",
    "#F8961E",
    "#F9844A",
    "#F9C74F",
    "#90BE6D",
    "#43AA8B",
    "#4D908E",
    "#577590",
    "#277DA1",
  ];
  const icons = [
    "restaurant",
    "flight",
    "home",
    "directions-car",
    "add-circle-outline",
  ];

  const toggleOverlay = (visible: boolean) => {
    console.log("toggleOverlay:", visible);

    if (visible) {
      setIsOverlayVisible(true); // เปิด Overlay ก่อนเริ่ม Animation
      Animated.timing(slideAnim, {
        toValue: 0, // เลื่อนขึ้นเมื่อเปิด
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height, // เลื่อนลงเมื่อปิด
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        setIsOverlayVisible(false); // ปิด Overlay หลังจาก Animation จบ
        slideAnim.setValue(height); // รีเซ็ตค่าเริ่มต้น
      });
    }
  };

  const screenWidth = Dimensions.get("window").width; // ✅ ความกว้างของหน้าจอ
  const cardWidth = 280; // ✅ ความกว้างของ Card
  const cardMargin = 18; // ✅ Margin ระหว่างการ์ด
  const snapToInterval = cardWidth + cardMargin * 2; // ✅ ระยะ snap ให้เป๊ะ

  const scrollViewRef = useRef<ScrollView>(null);

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

  return (
    <ThemedView>
      <ThemedView className="flex-col w-full h-full justify-center items-center">
        <ThemedView className=" flex-row !items-center !justify-between w-full px-4">
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={{
              width: 79,
              height: 70,
              marginTop: "2%",
              marginLeft: "5%",
            }}
          />
          <Ionicons
            onPress={() => router.push("/NotificationPage")}
            name="notifications-outline"
            size={32}
            color={`${componentIcon}`}
            style={{
              alignSelf: "center",
              marginTop: "5%",
              marginRight: "5%",
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-full h-10 justify-center bg-transparent p-1 mt-14 ">
          <ThemedView className="flex-row w-72 h-10 rounded-full bg-[#d5d5d5] dark:bg-[#383838] justify-center items-center">
            <Pressable
              onPress={() => setIsBudget(true)}
              className={`w-32 h-full flex items-center justify-center rounded-full ${
                isBudget ? "bg-green-500 w-[160px]" : "bg-transparent w-[120px]"
              }`}
            >
              <ThemedText
                className={`font-bold ${
                  isBudget
                    ? "text-white"
                    : isDarkMode
                    ? "text-white"
                    : "text-black"
                }`}
              >
                BUDGET
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setIsBudget(false)}
              className={`w-32 h-full flex items-center justify-center rounded-full ${
                !isBudget
                  ? "bg-green-500 w-[160px]"
                  : "bg-transparent w-[120px]"
              }`}
            >
              <ThemedText
                className={`font-bold ${
                  !isBudget
                    ? "text-white"
                    : isDarkMode
                    ? "text-white"
                    : "text-black"
                }`}
              >
                RETIRE
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        {bank && bank.length > 0 ? (
  <ThemedView className="flex-col w-full h-fit bg-transparent mt-10">
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={snapToInterval}
      decelerationRate="fast"
      onScroll={handleScroll}
      scrollEventThrottle={16}
      className="w-full"
    >
      <ThemedView className="w-full px-16">
        <ThemedView className="mt-0.5 mb-1 flex-row space-x-1 gap-5">
          {bank?.map((account: resultObject) => (
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

    {/* Header Monthly Budgets */}
    <ThemedView className="my-5 w-[80%] mt-10">
      <ThemedText className="text-xl font-bold text-start w-full">
        Monthly Budgets
      </ThemedText>
    </ThemedView>

    {/* ถ้ามี Budget แสดงข้อมูล Budget, ถ้าไม่มีให้แสดงปุ่มสร้าง Budget */}
    {BudgetID && BudgetID.id ? (
      <ThemedText>Budget exists</ThemedText>
    ) : (
      <ThemedView className="flex-row items-center justify-center bg-transparent p-1 mt-5 mb-4">
        <ThemedView className="w-[80%] h-fit">
          <Pressable
            className={`justify-center items-center rounded-3xl w-[370px] h-[320px] ${componentColor} ml-2`}
            onPress={() => {
              console.log("✅ Pressable clicked, opening overlay");
              toggleOverlay(true);
            }}
          >
            <AntDesign name="filetext1" size={70} color={componentIcon} className="m-3" />
            <ThemedView className="bg-transparent w-56 h-18">
              <ThemedText className="text-[#484848] dark:text-white mx-5 text-center font-bold">
                Let’s get started with your first budget plan!
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-12 h-12 mt-5 bg-transparent border-2 border-[#484848] dark:border-white rounded-full flex items-center justify-center">
              <Ionicons name="add" size={24} color={componentIcon} />
            </ThemedView>
          </Pressable>
        </ThemedView>
      </ThemedView>
    )}
  </ThemedView>
) : (
  // ไม่มีบัญชี แสดงปุ่มให้เพิ่มบัญชี
  <ThemedView className="flex-col justify-center items-center bg-transparent p-1 mt-10 mb-4">
    <Pressable
      className={`${componentColor} flex-col w-[280px] h-[180px] rounded-2xl justify-center items-center p-4`}
      onPress={() => router.push("/AddAccount")}
    >
      <ThemedView className="w-12 h-12 bg-[#949494] dark:bg-[#383838] rounded-full flex items-center justify-center">
        <Ionicons name="add" size={24} color="white" />
      </ThemedView>
      <ThemedText className="text-[#484848] dark:text-white text-center text-[18px] font-bold mt-5">
        Add Account
      </ThemedText>
    </Pressable>
    <ThemedView className="flex-row items-center pt-[10%]">
      <ThemedView className={`justify-center items-center rounded-[10%] w-[340px] h-[220px] ${componentColor} ml-2`}>
        <AntDesign name="filetext1" size={70} color={componentIcon} className="m-3" />
        <ThemedText className="text-[#484848] dark:text-white mx-5 text-center font-bold">
          Please create an account to proceed with your transaction.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  </ThemedView>
)}
      </ThemedView>
      {isOverlayVisible && (
        <TouchableWithoutFeedback onPress={() => toggleOverlay(false)}>
          <View className=" absolute inset-0 bg-[#00000055] flex-1 items-center justify-end ">
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                width: "100%",
                height: 480,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}
              className="p-6 bg-[#f2f2f2] dark:bg-[#222222] shadow-lg"
            >
              {/* ✅ Container หลักที่ห่อเนื้อหาทั้งหมด */}
              <View
                className="h-full w-full"
                onStartShouldSetResponder={() => true}
              >
                <View className="flex items-center">
                  {/* ✅ รูปโปรไฟล์ Budget */}
                  <View
                    className="w-28 h-28 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      backgroundColor:
                        selectedColor || (isDarkMode ? "#2D3748" : "#D3D3D3"),
                    }}
                  >
                    {selectedIcon ? (
                      <MaterialIcons
                        name={selectedIcon as any}
                        size={42}
                        color="white"
                      />
                    ) : (
                      <Ionicons
                        name="person-outline"
                        size={32}
                        color={isDarkMode ? "white" : "gray"}
                      />
                    )}
                  </View>

                  {/* ✅ เลือกสี */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="w-full"
                  >
                    <View className="flex-row gap-x-4 px-4">
                      {colors.map((color, index) => (
                        <Pressable
                          key={index}
                          onPress={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color
                              ? isDarkMode
                                ? "border-white"
                                : "border-black"
                              : "border-gray-500 dark:border-gray-700"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </View>
                  </ScrollView>

                  {/* ✅ เลือกไอคอน */}
                  <View className="flex-row space-x-3 mt-2">
                    {icons.map((icon, index) => (
                      <Pressable
                        key={index}
                        onPress={() => setSelectedIcon(icon)}
                        className="p-2"
                      >
                        <MaterialIcons
                          name={icon as any}
                          size={32}
                          color={
                            selectedIcon === icon
                              ? isDarkMode
                                ? "white"
                                : "black"
                              : "gray"
                          }
                        />
                      </Pressable>
                    ))}
                  </View>

                  {/* ✅ Budget Name */}
                  <View className="w-full mt-4">
                    <ThemedText className="font-bold text-lg text-gray-900 dark:text-white">
                      Budget Name
                    </ThemedText>
                    <ThemedView className="w-full flex-row bg-transparent">
                      <TextInput
                        placeholder="Enter Budget Name"
                        keyboardType="default"
                        style={{
                          backgroundColor: isDarkMode ? "#121212" : "#D9D9D9",
                          color: isDarkMode ? "#FFF" : "#2F2F2F",
                          borderRadius: 12,
                          padding: 10,
                        }}
                        onChangeText={setBudgetName}
                        placeholderTextColor={isDarkMode ? "#888" : "#555"} // ✅ รองรับ Dark Mode
                        className="w-full"
                      />
                    </ThemedView>
                  </View>

                  <View className="w-full mt-4">
  {/* Label "Limits" และช่องกรอกจำนวนเงินอยู่แถวเดียวกัน */}
  <View className="flex-row items-center  mb-2">
    <View className="flex-row items-center  mb-2">
      <Text className="font-bold text-lg text-gray-900 dark:text-white">
        Limits
      </Text>
      <View className="flex-row items-center mb-2">
        <View className="w-44 h-10 pb-3 ml-36 bg-gray-200 dark:bg-gray-800 rounded-lg">
          <TextInput
            value={inputValue} // ✅ ใช้ State ที่เราสร้างขึ้น
            onChangeText={handleAmountChange} // ✅ อัปเดตค่าทันที
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#AAA"
            className="text-right text-gray-900 dark:text-white text-lg p-2"
            style={{ height: 38 }}
          />
        </View>
      </View>
    </View>
    <Text className="text-gray-600 dark:text-gray-300 text-sm text-start ml-3">
      THB
    </Text>
  </View>

  {/* ✅ Slider (ต่อจาก Limits) */}
  <Slider
    value={sliderValueRef.current} // ✅ ใช้ `useRef` ให้ค่าเปลี่ยนแบบเรียลไทม์
    onValueChange={handleSliderChange} // ✅ เมื่อเลื่อน Slider, ค่า TextInput เปลี่ยนตาม
    onSlidingComplete={handleSliderComplete} // ✅ อัปเดต State เมื่อปล่อยนิ้ว
    minimumValue={0}
    maximumValue={100}
    step={1}
    thumbTintColor="#1E88E5" // ✅ เปลี่ยนสี Thumb เป็นน้ำเงิน
    minimumTrackTintColor="#1E88E5" // ✅ เปลี่ยนสีเส้นที่แสดง progress
    maximumTrackTintColor="#d3d3d3" // ✅ สีเส้นหลัง Thumb
    style={{
      height: 20,
      width: "55%",
      marginStart: 10,
      alignSelf: "center",
      marginHorizontal: 10,
      transform: [{ scaleY: 2 }, { scaleX: 2 }],
    }}
  />

  {/* ✅ แสดงค่าที่อัปเดตจาก useRef */}
  <Text className="text-gray-600 dark:text-gray-300 text-sm text-start mt-2">
    {sliderValueRef.current.toFixed(0)}% ({budgetLimitRef.current.toFixed(2)} THB)
  </Text>
</View>



                  {/* ✅ ปุ่ม Save (เหลืออันเดียว) */}
                  <Pressable
                    onPress={() => toggleOverlay(false)}
                    className="p-3 bg-gray-400 dark:bg-gray-700 rounded-lg mt-4 w-full"
                  >
                    <Text className="text-center font-bold text-white">
                      Save
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </ThemedView>
  );
}
