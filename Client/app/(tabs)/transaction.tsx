import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, Pressable, ScrollView } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router } from "expo-router";
import { ThemedCard } from "@/components/ThemedCard";
import Entypo from "@expo/vector-icons/Entypo";
import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native";
import { Animated, Easing } from "react-native";
import { UserTransaction } from "@/hooks/auth/GetAllTransaction";
import { Col } from "react-native-flex-grid";

const transactions: UserTransaction[] = [
  {
    id: 1,
    user_id: 1,
    account_id: 1,
    split_payment_id: null,
    transaction_type: "expense",
    amount: 250.00,
    color_code : "#FF0000",
    transaction_date: "2022-01-01",
    transaction_name: "Food",
    note: "Lunch",
  },
  
];

const TransactionItem = ({
  transaction,
  theme,
}: {
  transaction: UserTransaction;
  theme: string | null;
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOverlay && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleConfirmDelete();
    }
    return () => clearInterval(timer);
  }, [showOverlay, countdown]);

  const handleEdit = () => {
    setShowDropdown(false);
    router.push("../Edit_Transaction");
  };

  const handleDelete = () => {
    setShowDropdown(false);
    setShowOverlay(true);
    setCountdown(5);
  };

  const handleConfirmDelete = () => {
    setShowOverlay(false);
  };

  const handleCancel = () => {
    setShowOverlay(false);
  };

  return (
    <>
      <View className={`flex-row items-center justify-center w-10/12 ${componentcolor} p-4 rounded-lg mb-2 shadow-md`}>
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
        />
        <View className="flex-1">
          <ThemedText className={`font-bold text-lg `}>{transaction.transaction_name}</ThemedText>
          <ThemedText>{transaction.note}</ThemedText>
        </View>
        <Text className={`font-bold text-[16px] ${transaction.transaction_type === "income" ? "text-green-500" : "text-red-500"}`}>
          {transaction.amount}
        </Text>
        <Pressable onPress={() => setShowDropdown(!showDropdown)}>
          <Entypo name="dots-three-vertical" size={20} color={componenticon} className="ml-2" />
        </Pressable>

        {showDropdown && (
          <ThemedView className="absolute top-10 right-2 flex-row border border-gray-300 shadow-md rounded-lg w-fit z-50">
            <Pressable onPress={handleEdit} className="p-2 border-b border-gray-200">
              <Text className="text-green-500">Edit</Text>
            </Pressable>
            <Pressable onPress={handleDelete} className="p-2">
              <Text className="text-red-600">Delete</Text>
            </Pressable>
          </ThemedView>
        )}
      </View>

      {showOverlay && (
        <View className="absolute inset-0 flex items-center justify-center z-50">
          <ThemedView className=" p-6 rounded-lg w-80 shadow-md text-center h-52">
            <ThemedText className="text-lg font-bold mb-4">Confirm Deletion</ThemedText>
            <ThemedText className="mb-4">Are you sure you want to delete this transaction?</ThemedText>
            <View className="flex-row justify-between gap-5">
              <Pressable onPress={handleCancel} className="bg-gray-300 px-4 py-2 rounded-lg">
                <Text>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleConfirmDelete} className="bg-red-500 px-4 py-2 rounded-lg">
                <Text className="text-white">Confirm ({countdown}s)</Text>
              </Pressable>
            </View>
          </ThemedView>
        </View>
      )}
    </>
  );
};


export default function Index() {
  const { bank, transaction } = useContext(UserContext);
  let lastDate = "";
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

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

  return (
    <>
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
            className=" bg-[E5E5E5] pl-2 rounded-tl-[15px] rounded-bl-[15px] w-5/6 -ml-9"
          >
            <View className="mt-0.5 mb-1 flex-row space-x-1">
              {bank?.map((account) => (
                <ThemedCard
                  name={account.account_name}
                  color={account.color_code}
                  balance={account.balance.toString()}
                  mode="small"
                  onEdit={() => {}}
                  key={account.id}
                  // image={account.icon_id}
                  className="!items-center !justify-center w-32 h-32 bg-[#fefefe] rounded-lg"
                />
              ))}
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
        <ScrollView className="h-[450px] py-2">
          <ThemedView className="bg-[E5E5E5] !justify-start h-fit py-2 pb-12 ">
            <View className="w-full !items-center">
              {transaction?.map((transaction) => {
                const showDateHeader = transaction.transaction_date !== lastDate;
                lastDate = transaction.transaction_date || "";
                return (
                  <View key={transaction.id} className="w-full items-center ">
                    {showDateHeader && (
                      <ThemedText className="w-full pl-10 text-left font-bold text-1xl py-1">
                        {transaction.transaction_date}
                      </ThemedText>
                    )}
                    <TransactionItem transaction={transaction} theme={theme} />
                  </View>
                );
              })}
            </View>
          </ThemedView>
        </ScrollView>
      </ThemedSafeAreaView>

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
                    <MaterialCommunityIcons
                      name="notebook"
                      size={54}
                      color="black"
                      className="bg-[#AACC00] m-2 mr-11 rounded-lg"
                    />
                    <ThemedText className="font-bold">
                      Add By Yourself
                    </ThemedText>
                  </View>
                  <View
                    className={`${componentcolor} px-5 p-1 rounded-lg mx-2`}
                  >
                    <Ionicons
                      name="camera-sharp"
                      size={54}
                      color="black"
                      className="bg-[#AACC00] w-fit m-2 mr-11 rounded-lg"
                    />
                    <ThemedText className="font-bold">Add By Camera</ThemedText>
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
    </>
  );
}
