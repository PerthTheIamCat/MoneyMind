import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedScrollViewCenter } from "@/components/ThemedScrollViewCenter";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import moment from "moment";
import { SemiCircleProgress } from "@/components/SemiCircleProgress";
import TransactionItem from "@/components/TransactionItem";
import { StyleSheet } from "react-native";
import { useColorScheme, Text, View, FlatList } from "react-native";
import { useState, useContext } from "react";
import { Image } from "expo-image";
import { useEffect } from "react";

import { UserContext } from "@/hooks/conText/UserContext";
import { router } from "expo-router";

interface Summary {
  id: number;
  user_id: number;
  monthly_savings_goal: number;
  monthly_current_savings: number;
  total_savings_goal: number;
  current_savings: number;
  income: number;
  expense: number;
}

const mockSummary: Summary = {
  id: 1,
  user_id: 101,
  monthly_savings_goal: 2000,
  monthly_current_savings: 1000,
  total_savings_goal: 100000,
  current_savings: 90000,
  income: 200000,
  expense: 170000,
};

export default function Index() {
  const theme = useColorScheme() || "light";
  const componentColor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  const [transactioncheack, settransactioncheack] = useState<boolean | null>(
    true
  );

  const [AccountData, setAccountData] = useState(false);
  const [retireAmount, setretire] = useState(5000);
  const [retireGoal, setretireGoal] = useState(10000);

  const { username, bank, transaction, retire, notification, profile_URL } =
    useContext(UserContext);
  let lastDate = "";

  useEffect(() => {
    console.log(
      "mockSummary or transaction changed:",
      mockSummary,
      transaction
    );
  }, [mockSummary, transaction]);

  return (
    <ThemedSafeAreaView key={"home"}>
      <ThemedView key={"home"}>
        <ThemedView
          className={`${componentIcon} flex-row !items-center !justify-between w-full px-4`}
        >
          <Image
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
            color={`${componentIcon}`}
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

        <ThemedView className="!justify-start mt-5 w-[80%] flex-row">
          <View className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
            {profile_URL ? (
              <Image
                source={{ uri: profile_URL }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <Feather
                name="user"
                size={30}
                color={componentIcon}
                style={style.iconPadding}
              />
            )}
          </View>

          <ThemedText className="text-2xl font-bold pl-3 text-start">
            {username ? username : "FirstName LastName"}
          </ThemedText>
        </ThemedView>

        {/* check retire have data */}
        {retire ? (
          <ThemedView className="mt-3 w-[80%]">
            <ThemedView
              className={`${componentColor} h-fit p-5 w-full rounded-[20]`}
            >
              <ThemedText className="font-bold text-xl">
                Your Monthly Save Goal
              </ThemedText>
              <ThemedView className="mt-5 bg-transparent pb-4">
                <SemiCircleProgress
                  savings_goal={retire[0].monthly_savings_goal}
                  current_savings={retire[0].current_savings}
                />
              </ThemedView>
              <ThemedText className="mx-5 text-center font-bold">
                <ThemedText className="h-1/2 text-xl 1/2 align-middle  font-bold">
                  {retire[0].current_savings.toLocaleString("en-EN", {
                    maximumFractionDigits: 0,
                  })}
                  /
                  {retire[0].monthly_savings_goal.toLocaleString("en-EN", {
                    maximumFractionDigits: 0,
                  })}
                </ThemedText>
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView className="mt-3">
            <ThemedButton
              className={`${componentColor} h-40 w-4/5 rounded-[20]`}
              onPress={() => router.push("/(tabs)/retire")}
            >
              <ThemedView className="bg-transparent">
                <ThemedText className="font-bold">
                  Your Monthly Save Goal
                </ThemedText>
                <AntDesign
                  name="filetext1"
                  size={50}
                  color={`${componentIcon}`}
                  className="m-3"
                />
                <ThemedText className="mx-5 text-center font-bold">
                  Let’s get started with your first retirement plan!
                </ThemedText>
              </ThemedView>
            </ThemedButton>
          </ThemedView>
        )}

        <ThemedView className=" my-4 w-[80%]">
          <ThemedText className="text-xl font-bold text-start w-full">
            Account
          </ThemedText>
        </ThemedView>

        {bank ? (
          <ThemedView className="!items-center w-full ">
            <ThemedScrollViewCenter
              vertical={false}
              horizontal={true}
              className="w-full"
            >
              <View className="mt-0.5 mb-1 flex-row space-x-1">
                {bank
                  ?.slice() // ป้องกันไม่ให้เปลี่ยนค่า `bank` ดั้งเดิม
                  .sort((a, b) => a.id - b.id) // เรียงจาก id น้อยไปมาก
                  .map((account, index) => (
                    <ThemedCard
                      CardID={account.id}
                      name={account.account_name}
                      color={account.color_code}
                      balance={account.balance.toString()}
                      mode="large"
                      imageIndex={Number(account.icon_id)}
                      key={account.id}
                      className="!items-center !justify-center w-32 h-32 bg-[#fefefe] rounded-lg"
                    />
                  ))}
              </View>
            </ThemedScrollViewCenter>
          </ThemedView>
        ) : (
          <ThemedView className="mt-3">
            <ThemedButton
              className={`${componentColor} w-4/5 h-40 rounded-[20]`}
              onPress={() => router.push("/AddAccount")}
            >
              <ThemedView className="bg-transparent">
                <AntDesign
                  name="filetext1"
                  size={50}
                  color={`${componentIcon}`}
                  className="m-3"
                />
                <ThemedText className="mx-5 text-center font-bold">
                  Let’s get started with your first Money Account plan!
                </ThemedText>
              </ThemedView>
            </ThemedButton>
          </ThemedView>
        )}

        <ThemedView className=" my-5 w-[80%]">
          <ThemedText className="text-xl font-bold text-start w-full">
            Transaction
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView className="mb-32">
        <ThemedScrollView className="w-full bg-transparent">
          {!transaction || transaction.length === 0 ? (
            <ThemedText className="text-center items-center !justify-center text-xl mt-20 text-neutral-500 py-4">
              No transactions available
            </ThemedText>
          ) : (
            transaction.slice().map((transaction, index, sortedArray) => {
              const formattedDate = moment(transaction.transaction_date).format(
                "DD MMM YYYY"
              );
              const showDateHeader =
                index === 0 ||
                formattedDate !==
                  moment(sortedArray[index - 1].transaction_date).format(
                    "DD MMM YYYY"
                  );
              return (
                <View key={transaction.id} className=" items-center">
                  {showDateHeader && (
                    <ThemedText className="w-[85%] text-left font-bold text-sm py-2">
                      {formattedDate}
                    </ThemedText>
                  )}
                  <ThemedView
                    onTouchEnd={() => router.push("/(tabs)/transaction")}
                  >
                    <TransactionItem
                      transaction={transaction}
                      theme={theme}
                      checkpage={"Home"}
                    />
                  </ThemedView>
                </View>
              );
            })
          )}
        </ThemedScrollView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const style = StyleSheet.create({
  iconPadding: {
    paddingHorizontal: 10,
  },
});
