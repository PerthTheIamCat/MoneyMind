import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router } from "expo-router";
import { ThemedCard } from "@/components/ThemedCard";
import Entypo from "@expo/vector-icons/Entypo";

import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";

interface Transaction {
  id: string;
  logo: any;
  transaction_type: "income" | "expense";
  amount: string;
  category: string;
  description: string;
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "1",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "expense",
    amount: "250.00",
    category: "Food & Drinks",
    description: "Lunch at McDonald's",
    date: "25/12/67",
  },
  {
    id: "2",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "expense",
    amount: "1,200.00",
    category: "Shopping",
    description: "Bought new shoes",
    date: "25/12/67",
  },
  {
    id: "3",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
  {
    id: "4",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
  {
    id: "5",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
  {
    id: "6",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
  {
    id: "7",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
  {
    id: "8",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
];

const TransactionItem = ({
  transaction,
  theme,
}: {
  transaction: Transaction;
  theme: string | null;
}) => {
  const componentcolor = theme === "dark" ? "!bg-[#282828]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  return (
    <View
      className={`flex-row items-center justify-center w-10/12 ${componentcolor} p-4 rounded-lg mb-2 shadow-md`}
    >
      <Image
        source={transaction.logo}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
      />

      <View className="flex-1">
        <ThemedText className={`font-bold text-lg `}>
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
        color={componenticon}
        className="ml-2"
      />
    </View>
  );
};

export default function Index() {
  const { bank } = useContext(UserContext);
  let lastDate = "";

  const theme = useColorScheme();
  const componentcolor = theme === "dark" ? "!bg-[#242424]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
  console.log(bank);
  return (
    <>
      <ThemedSafeAreaView>
        <ThemedScrollView>
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
          <ThemedView className="bg-[E5E5E5] !justify-start h-full py-2 pb-12">
            <View className="w-full !items-center">
              {transactions.map((transaction) => {
                const showDateHeader = transaction.date !== lastDate;
                lastDate = transaction.date;
                return (
                  <View key={transaction.id} className="w-full items-center ">
                    {showDateHeader && (
                      <ThemedText className="w-full pl-10 text-left font-bold text-1xl py-1">
                        {transaction.date}
                      </ThemedText>
                    )}
                    <TransactionItem transaction={transaction} theme={theme} />
                  </View>
                );
              })}
            </View>
          </ThemedView>
        </ThemedScrollView>
      </ThemedSafeAreaView>
      <View className="!absolute bottom-6 right-6 bg-transparent">
        <View className="!items-center !justify-center bg-[#aacc00] w-16 h-16 rounded-full ">
          <AntDesign name="plus" size={32} color="#ffffff" />
        </View>
      </View>
    </>
  );
}
