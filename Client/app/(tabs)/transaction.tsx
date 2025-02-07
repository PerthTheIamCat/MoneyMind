import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedButton } from "@/components/ThemedButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, FlatList } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { router } from "expo-router";
import { ThemedCard } from "@/components/ThemedCard";
import Entypo from '@expo/vector-icons/Entypo';

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
    logo: require("@/assets/logos/LOGO.png"), // เปลี่ยนเป็นโลโก้ที่ต้องการ
    transaction_type: "expense",
    amount: "-฿250.00",
    category: "Food & Drinks",
    description: "Lunch at McDonald's",
    date: "25/12/67",
  },
  {
    id: "2",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "expense",
    amount: "-฿1,200.00",
    category: "Shopping",
    description: "Bought new shoes",
    date: "25/12/67",
  },
  {
    id: "3",
    logo: require("@/assets/logos/LOGO.png"),
    transaction_type: "income",
    amount: "+฿20,000.00",
    category: "Salary",
    description: "Monthly paycheck",
    date: "26/12/67",
  },
];

const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
  <View className="flex-row items-center justify-center w-10/12 bg-white p-4 rounded-lg mb-2 shadow-md">
    <Image
      source={transaction.logo}
      style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
    />

    <View className="flex-1">
      <Text className="font-bold text-lg">{transaction.category}</Text>
      <Text className="text-gray-500">{transaction.description}</Text>
    </View>

    <Text
      className={`font-bold ${
        transaction.transaction_type === "income"
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {transaction.amount}
    </Text>
    <Entypo name="dots-three-vertical" size={20} color="black" className="ml-2"/>
  </View>
);

export default function Index() {
  let lastDate = "";

  return (
    <ThemedSafeAreaView>
      <ThemedView className="flex-row items-center justify-between bg-red-500 px-4">
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
          onPress={() => router.push("/Add_Transaction")}
          name="notifications-outline"
          size={32}
          color="black"
          style={{ alignSelf: "center", marginTop: "5%", marginRight: "5%" }}
        />
      </ThemedView>
      <ThemedView className="!items-start pl-[10%] pt-[2%] bg-yellow-700">
        <ThemedText className=" text-[18px]">Connected</ThemedText>
        <ThemedText className="font-bold text-[24px]">Accounts</ThemedText>
      </ThemedView>
      <ThemedView className="bg-blue-400 h-[154px] !items-center flex flex-row ">
        <View className="flex flex-row justify-center items-center rounded-xl -rotate-90  w-[125px] h-[45px] bg-gray-400 -ml-2 active:scale-105">
          <AntDesign name="plus" size={20} color="black" />
          <Text className="font-bold">Add Account</Text>
        </View>
        <ThemedScrollView
          horizontal={true}
          className=" bg-yellow-600 pl-2 rounded-tl-[15px] rounded-bl-[15px] w-5/6 -ml-9"
        >
          <View className="mt-0.5 mb-1 flex-row space-x-1">
            <ThemedCard
              name="K-Push"
              balance="฿0.00"
              className="bg-[#fd0061]"
            />
            <ThemedCard
              name="Wallet"
              balance="฿0.00"
              className="bg-[#0000ff]"
            />
            <ThemedCard name="Bank" balance="฿0.00" className="bg-[#00ff00]" />
            <ThemedCard
              name="Credit Card"
              balance="฿0.00"
              className="bg-[#ff0000]"
            />
          </View>
        </ThemedScrollView>
      </ThemedView>
      <ThemedView className="flex-row items-center bg-red-400 justify-between px-4">
        <ThemedText className="text-[20px] pl-[5%] font-bold">
          Transaction
        </ThemedText>
        <View className="font-bold flex flex-row mr-6">
          <Text className="font-bold items-center mt-1 text-[18px]">All</Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={26}
            color="black"
            className="mt-1"
          />
        </View>
      </ThemedView>

      <ThemedView className="bg-green-500 !justify-start h-full py-2">
        <View className="w-full !items-center">
          {transactions.map((transaction) => {
            const showDateHeader = transaction.date !== lastDate;
            lastDate = transaction.date;
            return (
              <View key={transaction.id} className="w-full items-center">
                {showDateHeader && (
                  <Text className="w-full pl-10 text-left font-bold text-1xl py-1">
                    {transaction.date}
                  </Text>
                )}
                <TransactionItem transaction={transaction} />
              </View>
            );
          })}
        </View>
      </ThemedView>

      <ThemedView className="absolute !justify-end !items-end w-full mt-[170%] bg-slate-500">
        <View className="items-center justify-center bg-[#aacc00] w-16 h-16 rounded-full mr-6">
          <AntDesign name="plus" size={32} color="#ffffff" />
        </View>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
