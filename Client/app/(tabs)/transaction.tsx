import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router } from "expo-router";
import { ThemedCard } from "@/components/ThemedCard";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native";
import { Animated, Easing } from "react-native";
import TransactionItem from "@/components/TransactionItem";
import Dropdownfiller from "@/components/Dropdownfiller";
import { ServerContext } from "@/hooks/conText/ServerConText";
import moment from "moment";
import { colorKeys } from "moti";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { DeleteUserTransaction } from "@/hooks/auth/DeleteTransaction";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import { ThemedButton } from "@/components/ThemedButton";
import { getCategory } from "@/hooks/auth/CategoryHandler";

export default function TransactionPage() {
  const handleEditTransaction = (transactionId: number) => {
    router.push({
      pathname: "../Edit_Transaction",
      params: { transactionId },
    });
  };

  const { bank, transaction, notification, setTransaction, userID } =
    useContext(UserContext) ?? {
      bank: [],
      transaction: [],
    };
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const handleDeleteTransaction = (transaction_id: number) => {
    DeleteUserTransaction(URL, transaction_id, auth?.token!).then((res) => {
      if (res.success) {
        console.log("Transaction deleted");
        setTransaction?.(
          transaction ? transaction.filter((t) => t.id !== transaction_id) : []
        );
      } else {
        Alert.alert("Error", res.message);
      }
    });
  };
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [filltermode, setFilltermode] = useState("All");
  const [fillterType, setCateFillerType] = useState("income");
  const [CateFillerName, setCateFillerName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isExpenses, setIsExpenses] = useState(true);
  const [dropdownSelection, setDropdownSelection] = useState("All");
  const backgroundColor =
    useColorScheme() === "dark" ? "bg-[#242424]" : "bg-[#d8d8d8]";

  const theme = useColorScheme() || "light";
  const componentcolor = theme === "dark" ? "!bg-[#242424]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
  console.log(bank);
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (isOverlayVisible) {
      // เมื่อ overlay เปิด, เลื่อนขึ้น
      Animated.timing(slideAnim, {
        toValue: 0, // เลื่อนขึ้นมา
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [isOverlayVisible]);

  const data = [
    { value: "1", label: "All" },
    { value: "2", label: "Category" },
    { value: "3", label: "Income" },
    { value: "4", label: "Expense" },
  ];

  const [activeCardID, setActiveCardID] = useState<number | null>(null); // เก็บเมนูที่เปิดอยู่
  const [selectedCardID, setSelectedCardID] = useState<number | null>(null); //  เก็บค่าการ์ดที่ถูกเลือก

  //  ฟังก์ชันสำหรับเลือกการ์ด (ไม่เกี่ยวกับเมนู)
  const handleSelectCard = (cardID: number) => {
    if (selectedCardID === cardID) {
      console.log(`🔻 Unselecting Card ID: ${cardID}`);
      setSelectedCardID(null); //  ยกเลิกการเลือกถ้ากดซ้ำ
    } else {
      console.log(`✅ Selecting Card ID: ${cardID}`);
      setSelectedCardID(cardID); //  เลือกการ์ดใหม่
    }
  };

  const [activeOptionID, setActiveOptionID] = useState<{
    type: "card" | "transaction";
    id: number;
  } | null>(null);

  const handleToggleOptions = (type: "card" | "transaction", id: number) => {
    if (activeOptionID?.id === id && activeOptionID?.type === type) {
      setActiveOptionID(null); //  ปิดเมนูถ้ากดซ้ำ
    } else {
      setActiveOptionID({ type, id }); //  เปิดเมนูใหม่ และปิดเมนูอื่น
    }
  };

  interface extractedData {
    bankOrShop: any;
    date: Date | undefined;
    time: Date | undefined;
    referenceNo: any;
    totalAmount: string;
    vat: string;
  }

  interface OcrSuccessResponse {
    message: "OCR success";
    success: true;
    imagePath: string;
    extractedData: extractedData;
    savedFiles: {
      rawTextPath: string;
      cleanedTextPath: string;
      extractedDataPath: string;
    };
  }
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 📸 📂 ฟังก์ชันเปิดเมนูให้เลือกถ่ายรูป หรือ เลือกจากแกลเลอรี
  const selectImageOption = () => {
    Alert.alert("อัปโหลดรูปภาพ", "เลือกวิธีอัปโหลดรูปภาพ", [
      { text: "📸 ถ่ายรูป", onPress: openCamera },
      { text: "🖼️ เลือกจากแกลเลอรี", onPress: pickImage },
      { text: "❌ ยกเลิก", style: "cancel" },
    ]);
  };

  // 📸 ฟังก์ชันเปิดกล้อง
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("ต้องการสิทธิ์", "กรุณาให้สิทธิ์เข้าถึงกล้อง");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  // 📂 ฟังก์ชันเลือกภาพจากแกลเลอรี
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("ต้องการสิทธิ์", "กรุณาให้สิทธิ์เข้าถึงแกลเลอรี");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  //  ฟังก์ชันอัปโหลดภาพไปยัง `ocr.js`
  const uploadImage = async (imageUri: string, retryCount = 1) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "receipt.jpg",
      type: "image/jpeg",
    } as any);

    try {
      let response = await axios.post<OcrSuccessResponse>(
        `${URL}/ocr`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const progress = Math.round((progressEvent.loaded * 100) / total);
            console.log(`Upload progress: ${progress}%`);
          },
        }
      );

      console.log("📜 OCR Result:", response.data);

      if (response.data.success) {
        Alert.alert(
          "OCR สำเร็จ",
          `ข้อมูลที่อ่านได้: ${JSON.stringify(response.data.extractedData)}`
        );
        router.push(
          `/Add_Transaction?extractedData=${encodeURIComponent(
            JSON.stringify(response.data.extractedData)
          )}`
        );
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);

      if (retryCount > 0) {
        console.log("🔄 Retrying...");
        return uploadImage(imageUri, retryCount - 1);
      } else {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัปโหลดรูปได้");
      }
    } finally {
      setLoading(false);
    }
  };
  type Transaction = {
    id: number;
    icon_name: string;
    icon_id: keyof typeof Ionicons.glyphMap;
  };

  return (
    <ThemedView className="w-full h-full">
      <TouchableWithoutFeedback
        onPress={() => {
          setActiveOptionID(null);
        }}
        accessible={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ThemedSafeAreaView>
            <ThemedView
              className={`${componenticon} flex-row items-center justify-between px-4`}
            >
              <Image
                className="ml-[10%]"
                source={require("@/assets/logos/LOGO.png")}
                style={{
                  width: 50,
                  height: 50,
                  marginTop: "2%",
                  marginLeft: "5%",
                }}
              />
              <Ionicons
                onPress={() => router.push("/NotificationPage")}
                name="notifications-outline"
                size={32}
                color={`${componenticon}`}
                style={{
                  alignSelf: "center",
                  marginTop: "5%",
                  marginRight: "5%",
                }}
              />
              {notification?.find((noti) => !noti.is_read) && (
                <View className="w-3 h-3 bg-red-500 absolute rounded-full right-10 animate-pulse" />
              )}
            </ThemedView>
            <ThemedView className="!items-start pt-[2%] pl-[8%] bg-transparent">
              <ThemedText className=" text-[18px]">Connected</ThemedText>
              <ThemedText className="font-bold text-[24px]">
                Accounts
              </ThemedText>
            </ThemedView>
            <ThemedView className="flex-row ">
              <Pressable
                className={`flex flex-row justify-center items-center rounded-xl -rotate-90  w-[125px] h-[45px] ${componentcolor} -ml-2 active:scale-105`}
                onPress={() => router.push("/AddAccount")}
              >
                <AntDesign name="plus" size={20} color={`${componenticon}`} />
                <ThemedText className="font-bold">Add Account</ThemedText>
              </Pressable>
              <ThemedScrollView
                horizontal={true}
                keyboardShouldPersistTaps="handled" // ให้สามารถกดที่อื่นเพื่อปิดเมนู
                onStartShouldSetResponder={() => true} // บังคับให้ ScrollView ตอบสนองการสัมผัส
                className=" bg-[E5E5E5] pl-2 rounded-tl-[15px] rounded-bl-[15px] w-5/6 -ml-9 "
              >
                <View className="mt-0.5 mb-1 flex-row space-x-1">
                  {bank && bank.length > 0 ? (
                    bank.map((account) => (
                      <ThemedCard
                        key={account.id}
                        CardID={account.id}
                        name={account.account_name}
                        color={account.color_code}
                        balance={account.balance.toString()}
                        mode="small"
                        imageIndex={Number(account.icon_id)}
                        isOptionsVisible={
                          activeOptionID?.type === "card" &&
                          activeOptionID?.id === account.id
                        }
                        setOptionsVisible={() =>
                          handleToggleOptions("card", account.id)
                        }
                        isSelected={selectedCardID === account.id} //  ส่งค่าการ์ดที่เลือก
                        onSelectCard={() => handleSelectCard(account.id)} // ฟังก์ชันเลือกการ์ด
                      />
                    ))
                  ) : (
                    <ThemedView className="min-h-40"></ThemedView>
                  )}
                </View>
              </ThemedScrollView>
            </ThemedView>
            <ThemedView className="flex-row items-center bg-[E5E5E5] justify-between pt-1 px-4">
              <ThemedText className="text-[20px] w-[68%] pl-[5%] font-bold">
                Transaction
              </ThemedText>

              <Dropdownfiller
                data={data}
                onChange={(item) => {
                  console.log(item.label); // ตรวจสอบค่าเมื่อเลือก
                  setFilltermode(item.label);
                  setDropdownSelection(item.label); // เปลี่ยนชื่อจาก filltermode เป็น dropdownSelection
                  if (item.label === "Category") {
                    setShowModal(true); // แสดง modal เมื่อเลือก "Category"
                  }
                }}
              />
            </ThemedView>

            {/* <ScrollView
            className="max-h-screen-safe "
            // keyboardShouldPersistTaps="away" //  ให้สามารถกดที่อื่นเพื่อปิดเมนู
            onStartShouldSetResponder={() => true} //  บังคับให้ ScrollView รับการสัมผัส
            nestedScrollEnabled={false}
          > */}
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveOptionID(null);
              }}
              accessible={false}
            >
              <ThemedView className=" !justify-start h-fit py-2 pb-36">
                <View className="w-full !items-center">
                  <ScrollView
                    className="w-full"
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{
                      height: "100%", // กำหนดความสูงเต็มกรอบ
                      overflowY: "scroll", // เพิ่มการเลื่อนในแนวตั้ง
                    }}
                    onStartShouldSetResponder={() => true} //ให้ ScrollView รับการสัมผัส
                    nestedScrollEnabled={true} // เลื่อนภายในได้
                    keyboardShouldPersistTaps="handled" // เลื่อนโดยไม่กระทบกับการสัมผัส
                  >
                    {(() => {
                      let filteredTransactions =
                        selectedCardID !== null
                          ? transaction?.filter(
                              (t) => t.account_id === selectedCardID
                            )
                          : transaction;

                      if (
                        !filteredTransactions ||
                        filteredTransactions.length === 0
                      ) {
                        return (
                          <ThemedText className="text-center items-center !justify-center text-xl mt-20 text-neutral-500 py-4">
                            No transactions available
                          </ThemedText>
                        );
                      } else if (filltermode === "Income") {
                        filteredTransactions = filteredTransactions?.filter(
                          (t) => t.transaction_type === "income"
                        );
                      } else if (filltermode === "Expense") {
                        filteredTransactions = filteredTransactions?.filter(
                          (t) => t.transaction_type === "expense"
                        );
                      } else if (filltermode === "Category") {
                        filteredTransactions = filteredTransactions?.filter(
                          (t) =>
                            t.transaction_name === CateFillerName &&
                            t.transaction_type === fillterType
                        );
                      } else {
                        filteredTransactions = filteredTransactions?.filter(
                          (t) => t.transaction_type
                        );
                      }
                      return filteredTransactions.map(
                        (transaction, index, sortedArray) => {
                          const formattedDate = moment(
                            transaction.transaction_date
                          ).format("DD MMM YYYY");
                          const showDateHeader =
                            index === 0 ||
                            formattedDate !==
                              moment(
                                sortedArray[index - 1].transaction_date
                              ).format("DD MMM YYYY");

                          return (
                            <View
                              key={transaction.id}
                              className="w-full items-center"
                            >
                              {showDateHeader && (
                                <ThemedText className="w-[85%] text-left font-bold text-1xl py-2">
                                  {formattedDate}
                                </ThemedText>
                              )}
                              <TransactionItem
                                transaction={transaction}
                                theme={theme}
                                onEdit={() =>
                                  handleEditTransaction(transaction.id ?? 0)
                                }
                                onDelete={(transaction_id: number) =>
                                  handleDeleteTransaction(transaction_id)
                                }
                                checkpage={"transactions"}
                                isOptionsVisible={
                                  activeOptionID?.type === "transaction" &&
                                  activeOptionID?.id === transaction.id
                                } // ✅ ตรวจสอบว่าเปิดเมนู TransactionItem อยู่หรือไม่
                                setOptionsVisible={() =>
                                  handleToggleOptions(
                                    "transaction",
                                    transaction.id
                                  )
                                } // เปิด/ปิดเมนู
                              />
                            </View>
                          );
                        }
                      );
                    })()}
                  </ScrollView>
                </View>
              </ThemedView>
            </TouchableWithoutFeedback>
            {/* </ScrollView> */}
            {loading && (
              <View className="absolute inset-0 flex items-center justify-center bg-transparent">
                <ThemedView className="bg-white dark:bg-gray-800 p-4 rounded-lg items-center">
                  <ThemedText className="font-bold mb-2">
                    Uploading Image...
                  </ThemedText>
                  <ActivityIndicator size="large" color="#AACC00" />
                </ThemedView>
              </View>
            )}
          </ThemedSafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {showModal && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowModal(false)} // ปิด modal เมื่อคลิกที่พื้นหลัง
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // พื้นหลังเบลอ
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <ThemedView
              activeOpacity={1}
              style={{
                padding: 20,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <ThemedText className="text-xl font-bold mb-2">
                Select the desired category
              </ThemedText>
              <View className="flex-row items-center justify-center p-3">
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
              {/* แสดงรายการตามประเภท (Income หรือ Expense) */}
              <ThemedView>
                {/* กรองข้อมูล transaction โดยเลือกประเภทที่ตรงกับ isExpenses */}
                {transaction
                  ?.filter(
                    (t) =>
                      t.transaction_type === (isExpenses ? "expense" : "income")
                  )
                  .filter(
                    // กรองให้แสดงรายการที่ไม่ซ้ำ (ใช้ Set เพื่อไม่ให้ซ้ำ)
                    (value, index, self) =>
                      index ===
                      self.findIndex(
                        (t) => t.transaction_name === value.transaction_name
                      )
                  )
                  .map((transaction) => (
                    <Pressable
                      key={transaction.id}
                      className={`flex-row items-center justify-between p-2 rounded-lg w-[80%] mx-auto mt-2 ${backgroundColor}`}
                      onPress={() => {
                        setCateFillerName(transaction.transaction_name);
                        setCateFillerType(transaction.transaction_type);
                        console.log(
                          "Transaction Name:",
                          transaction.transaction_name
                        ); // log transaction_name
                        console.log(
                          "Transaction Type:",
                          transaction.transaction_type
                        ); // log transaction_type
                        setShowModal(false);
                      }}
                    >
                      {/* ไอคอน + ชื่อรายการ */}
                      <View className="flex-row items-center space-x-3">
                        <ThemedText className="pl-3">
                          <Ionicons name={transaction.icon_id} size={24} />
                        </ThemedText>
                        <ThemedText className="text-[16px] font-bold w-full ml-3">
                          {transaction.transaction_name}
                        </ThemedText>
                      </View>
                    </Pressable>
                  ))}
              </ThemedView>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => setShowModal(false)} // ปิด modal เมื่อกดปุ่ม "Close"
                  style={{
                    marginRight: 15,
                    padding: 10,
                    backgroundColor: "red",
                    borderRadius: 8,
                  }}
                >
                  <ThemedText className="text-white font-bold">
                    Close
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      )}

      {isOverlayVisible && (
        <TouchableWithoutFeedback
          onPress={() => {
            // เริ่มอนิเมชันเลื่อนลง
            Animated.timing(slideAnim, {
              toValue: 300, // เลื่อนลง
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start(() => {
              // เมื่ออนิเมชันเลื่อนลงเสร็จแล้ว
              setIsOverlayVisible(false);
              setIsButtonVisible(true);
            });
          }}
        >
          <View className="absolute inset-0 bg-[#00000055] flex items-center justify-end pb-1">
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }], // ใช้ slideAnim เพื่อเลื่อนขึ้น
                width: "100%",
              }}
              className="p-6 rounded-lg"
            >
              <ThemedView className="mb-24 p-6 rounded-lg w-full ">
                <ThemedText className="text-3xl font-bold ">
                  Insert Type
                </ThemedText>
                <View className="flex flex-row gap-6 mt-2 rounded-lg">
                  <View
                    className={`${componentcolor} px-5 p-1 rounded-lg mx-2`}
                  >
                    <Pressable
                      onPress={() => {
                        router.push("/Add_Transaction");
                        setIsOverlayVisible(false);
                        setIsButtonVisible(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="notebook"
                        size={54}
                        color="black"
                        className="bg-[#AACC00] m-2 mr-11 rounded-lg"
                      />
                      <ThemedText className="font-bold">
                        Add By Yourself
                      </ThemedText>
                    </Pressable>
                  </View>
                  <View
                    className={`${componentcolor} px-5 p-1 rounded-lg mx-2`}
                  >
                    <Pressable
                      onPress={() => {
                        setIsOverlayVisible(false);
                        setIsButtonVisible(true);
                        selectImageOption();
                      }}
                    >
                      <Ionicons
                        name="camera-sharp"
                        size={54}
                        color="black"
                        className="bg-[#AACC00] w-fit m-2 mr-11 rounded-lg"
                      />
                      <ThemedText className="font-bold">
                        Add By Camera
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </ThemedView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {isButtonVisible && (
        <Pressable
          onPress={() => {
            setIsOverlayVisible(true);
            setIsButtonVisible(false);
          }}
          className="!absolute bottom-[12%] right-4 bg-transparent mb-5"
        >
          <View className="!items-center !justify-center bg-[#aacc00] w-16 h-16  rounded-full ">
            <AntDesign name="plus" size={32} color="#ffffff" />
          </View>
        </Pressable>
      )}
    </ThemedView>
  );
}
