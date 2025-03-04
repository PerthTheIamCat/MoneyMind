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
import { DonutChart } from "@/components/DonutChart";
import { LinearBar } from "@/components/LinearBar";
import { SemiCircleProgress } from "@/components/SemiCircleProgress";

import { useColorScheme, Text, View ,FlatList} from "react-native";
import { useState, useContext } from "react";
import { Image } from "expo-image";
import { useEffect } from "react";

import { UserContext } from "@/hooks/conText/UserContext";
import { router } from "expo-router";
import { enGB, registerTranslation } from "react-native-paper-dates";

// ✅ ลงทะเบียนภาษา `en`
registerTranslation("en", enGB);

interface Transaction {
  id: string;
  logo: any;
  transaction_type: "income" | "expense";
  amount: string;
  category: string;
  description: string;
  date: string;
}

const TransactionItem = ({transaction,theme,}:{transaction: Transaction;theme: string | null;}) => {
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  return (
    <View
      className={`flex-row items-center justify-between ${componentcolor} w-[90%] p-4  rounded-lg mb-2`}
    >
      <Image
        source={transaction.logo}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
      />

      <View className="">
        <ThemedText className={`font-bold text-lg w-32`}>
          {transaction.category}
        </ThemedText>
        <ThemedText className={``}>{transaction.description}</ThemedText>
      </View>

      <Text
        className={`font-bold text-[16px] ${
          transaction.transaction_type === "income"
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {transaction.amount}
      </Text>
      <Entypo
        name="dots-three-vertical"
        size={20}
        color={componentIcon}
        className="ml-2"
      />
    </View>
  );
};

interface Summary {
  id: number;
  user_id: number;
  monthly_savings_goal: number;
  monthly_current_savings: number;
  total_savings_goal: number;
  current_savings: number;
  income: number ;
  expense: number;
}

const mockSummary: Summary = {
  id: 1,
  user_id: 101,
  monthly_savings_goal: 2000,
  monthly_current_savings:1000,
  total_savings_goal: 100000,
  current_savings: 90000,
  income:200000,
  expense:170000,
};

export default function Index() {
  const theme = useColorScheme() || "light";
  const componentColor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  const [checkRetireData, setCheckRetireData] = useState(false);
  const [retire, setRetire] = useState<number | null>(null);
  const [transactioncheack, settransactioncheack] = useState<boolean | null>(true);

  const [AccountData, setAccountData] = useState(false);
  const [retireAmount, setretire] = useState(5000);
  const [retireGoal, setretireGoal] = useState(10000);

  const { username, bank, transaction } = useContext(UserContext);
  let lastDate = "";

  useEffect(() => {
    console.log("mockSummary or transaction changed:", mockSummary, transaction);
  }, [mockSummary, transaction]);
  

  return (
    <ThemedSafeAreaView key={"home"}>
      <ThemedView>
      <ThemedView className={`${componentIcon} flex-row !items-center !justify-between w-full px-4`}>
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

        <ThemedView className="!justify-start mt-5 w-[80%] flex-row">
          <Feather name="circle" size={40} color={`${componentIcon}`} />
          <ThemedText className="text-xl font-bold pl-3 text-start">
            {username ? username : "FirstName LastName"}
          </ThemedText>
        </ThemedView>

        {/* check retire have data */}
        {checkRetireData ? (
          <ThemedView className="mt-3 w-[80%]">
            <ThemedView className={`${componentColor} h-fit p-5 w-full rounded-[20]`}>
              <ThemedText className="font-bold text-xl">
                Your Monthly Save Goal
              </ThemedText>
                <ThemedView className="mt-5 bg-transparent pb-4">
                <SemiCircleProgress
                  savings_goal={mockSummary.monthly_savings_goal}
                  current_savings={mockSummary.monthly_current_savings}
                />


                    
                </ThemedView>
              <ThemedText className="mx-5 text-center font-bold">
              <ThemedText className="h-1/2 text-xl 1/2 align-middle  font-bold">
                  {mockSummary.monthly_current_savings}/{mockSummary.monthly_savings_goal}
              </ThemedText>
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView className="mt-3">
            <ThemedButton
              className={`${componentColor} h-40 w-4/5 rounded-[20]`}
              onPress={() => setCheckRetireData(!retire)}
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

        
        <ThemedView
          className=" my-5 w-[80%]"
          onTouchEnd={() => router.push("/(tabs)/transaction")}
        >
          <ThemedText className="text-xl font-bold text-start w-full">
            Transaction
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView>
      <ThemedScrollView >
      {transaction && transaction.length > 0 ? (
        transaction && transaction.slice(0, 15).map((item, index) => {
          const transaction: Transaction = {
            id: item.id.toString(),
            logo: require("@/assets/logos/LOGO.png"),
            transaction_type: item.transaction_type,
            amount: item.amount.toString(),
            category: item.transaction_type,
            description: item.note,
            date: item.transaction_date,
          };

          const formattedDate = moment(transaction.date).format("DD MMM YYYY");
          const showDateHeader = lastDate !== formattedDate;
          lastDate = formattedDate;

          return (
            <View key={transaction.id} className="w-full items-center ">
              {showDateHeader && (
                <ThemedText className="w-[90%]  text-left font-bold text-1xl py-1">
                  {formattedDate}
                </ThemedText>
              )}
              <TransactionItem transaction={transaction} theme={theme} />
            </View>
          );
        })):(
          <ThemedView className="!items-center w-full ">
            <ThemedText className="text-center font-bold mt-5">
              no record transaction found
            </ThemedText>
          </ThemedView>
        )}
      </ThemedScrollView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
