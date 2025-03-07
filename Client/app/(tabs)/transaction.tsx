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
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router } from "expo-router";
import { ThemedCard } from "@/components/ThemedCard";
import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native";
import { Animated, Easing } from "react-native";
import TransactionItem from "@/components/TransactionItem";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import axios from "axios";
import { ServerContext } from "@/hooks/conText/ServerConText";

export default function TransactionPage() {
  const handleEditTransaction = (transactionId: number) => {
    router.push(`../Edit_Transaction?id=${transactionId}`);
  };
  const { URL } = useContext(ServerContext);
  const { bank, transaction } = useContext(UserContext) ?? {
    bank: [],
    transaction: [],
  };

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  // const handleEditTransaction = (transactionId: number) => {};
  const handleDeleteTransaction = (transactionId: number) => {};
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );

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

  const [activeCardID, setActiveCardID] = useState<number | null>(null); // เก็บเมนูที่เปิดอยู่
  const [selectedCardID, setSelectedCardID] = useState<number | null>(null); // ✅ เก็บค่าการ์ดที่ถูกเลือก

  // ✅ ฟังก์ชันสำหรับเลือกการ์ด (ไม่เกี่ยวกับเมนู)
  const handleSelectCard = (cardID: number) => {
    if (selectedCardID === cardID) {
      console.log(`🔻 Unselecting Card ID: ${cardID}`);
      setSelectedCardID(null); // ✅ ยกเลิกการเลือกถ้ากดซ้ำ
    } else {
      console.log(`✅ Selecting Card ID: ${cardID}`);
      setSelectedCardID(cardID); // ✅ เลือกการ์ดใหม่
    }
  };

  const [activeOptionID, setActiveOptionID] = useState<{
    type: "card" | "transaction";
    id: number;
  } | null>(null);

  const handleToggleOptions = (type: "card" | "transaction", id: number) => {
    if (activeOptionID?.id === id && activeOptionID?.type === type) {
      setActiveOptionID(null); // ✅ ปิดเมนูถ้ากดซ้ำ
    } else {
      setActiveOptionID({ type, id }); // ✅ เปิดเมนูใหม่ และปิดเมนูอื่น
    }
  };
  const [image, setImage] = useState<string | null>(null);

  const uploadImage = async (imageUri: string) => {
    const formData = new FormData();

    const response = await fetch(imageUri);
    const blob = await response.blob();

    formData.append("image", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const uploadResponse = await axios.post(`${URL}/ocr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("OCR Response:", uploadResponse.data);
      if (uploadResponse.data.success) {
        Alert.alert(
          "ผลลัพธ์ OCR",
          JSON.stringify(uploadResponse.data.extractedData, null, 2)
        );
      } else {
        Alert.alert("OCR ไม่สำเร็จ", uploadResponse.data.message);
      }
    } catch (error: any) {
      console.error("Upload Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        `เกิดข้อผิดพลาด: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log("🔻 Closing all menus");
        setActiveOptionID(null);
        setSelectedCardID(null);
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
              color={`${componenticon}`}
              style={{
                alignSelf: "center",
                marginTop: "5%",
                marginRight: "5%",
              }}
            />
          </ThemedView>
          <ThemedView className="!items-start pl-[10%] pt-[2%] bg-[E5E5E5]">
            <ThemedText className=" text-[18px]">Connected</ThemedText>
            <ThemedText className="font-bold text-[24px]">Accounts</ThemedText>
          </ThemedView>
          <ThemedView className="bg-[E5E5E5] h-[154px] !items-center flex flex-row ">
            <Pressable
              className={`flex flex-row justify-center items-center rounded-xl -rotate-90  w-[125px] h-[45px] ${componentcolor} -ml-2 active:scale-105`}
              onPress={() => router.push("/AddAccount")}
            >
              <AntDesign name="plus" size={20} color={`${componenticon}`} />
              <ThemedText className="font-bold">Add Account</ThemedText>
            </Pressable>
            <ThemedScrollView
              horizontal={true}
              keyboardShouldPersistTaps="handled" // ✅ ให้สามารถกดที่อื่นเพื่อปิดเมนู
              className=" bg-[E5E5E5] pl-2 rounded-tl-[15px] rounded-bl-[15px] w-5/6 -ml-9"
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
                      isSelected={selectedCardID === account.id} // ✅ ส่งค่าการ์ดที่เลือก
                      onSelectCard={() => handleSelectCard(account.id)} // ✅ ฟังก์ชันเลือกการ์ด
                    />
                  ))
                ) : (
                  <ThemedView>
                    <ThemedText>emptyaccount</ThemedText>
                  </ThemedView>
                )}
              </View>
            </ThemedScrollView>
          </ThemedView>
          <ThemedView className="flex-row items-center bg-[E5E5E5] justify-between px-4">
            <ThemedText className="text-[20px] pl-[5%] font-bold">
              Transaction
            </ThemedText>
            <View className="font-bold flex flex-row mr-6">
              <ThemedText className="font-bold items-center mt-1 text-[18px]">
                All
              </ThemedText>
              <MaterialIcons
                name="arrow-drop-down"
                size={26}
                color={`${componenticon}`}
                className="mt-1"
              />
            </View>
          </ThemedView>

          <ScrollView
            className="h-[450px] py-2"
            keyboardShouldPersistTaps="handled"
          >
            <ThemedView className="bg-[E5E5E5] !justify-start h-fit py-2 pb-12 ">
              <View className="w-full !items-center">
                {/* {transactions.map((transaction) => {
                const formattedDate = moment(transaction.transaction_date).format("DD MMM YYYY");
                          const showDateHeader = lastDate !== formattedDate;
                          lastDate = formattedDate; */}

                {!transaction || transaction.length === 0 ? (
                  <ThemedText className="text-center items-center !justify-center text-xl mt-20 text-neutral-500 py-4">
                    No transactions available
                  </ThemedText>
                ) : (
                  transaction.slice().map((transaction, index, sortedArray) => {
                    const formattedDate = moment(
                      transaction.transaction_date
                    ).format("DD MMM YYYY");
                    const showDateHeader =
                      index === 0 ||
                      formattedDate !==
                        moment(sortedArray[index - 1].transaction_date).format(
                          "DD MMM YYYY"
                        );
                    return (
                      <View
                        key={transaction.id}
                        className="w-full items-center "
                      >
                        {showDateHeader && (
                          <ThemedText className="w-full pl-10 text-left font-bold text-1xl py-1">
                            {formattedDate}
                          </ThemedText>
                        )}
                        <TransactionItem
                          transaction={transaction}
                          theme={theme}
                          onEdit={() =>
                            handleEditTransaction(transaction.id ?? 0)
                          }
                          onDelete={() =>
                            handleDeleteTransaction(transaction.id ?? 0)
                          }
                          checkpage={"transactions"}
                          isOptionsVisible={
                            activeOptionID?.type === "transaction" &&
                            activeOptionID?.id === transaction.id
                          } // ✅ ตรวจสอบว่าเปิดเมนู TransactionItem อยู่หรือไม่
                          setOptionsVisible={() =>
                            handleToggleOptions("transaction", transaction.id)
                          } // ✅ เปิด/ปิดเมนู
                        />
                      </View>
                    );
                  })
                )}
              </View>
            </ThemedView>
          </ScrollView>
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
                  <ThemedView className=" p-6 rounded-lg w-full ">
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
                            pickImage();
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
              className="!absolute bottom-6 right-6 bg-transparent"
            >
              <View className="!items-center !justify-center bg-[#aacc00] w-16 h-16 rounded-full ">
                <AntDesign name="plus" size={32} color="#ffffff" />
              </View>
            </Pressable>
          )}
        </ThemedSafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
