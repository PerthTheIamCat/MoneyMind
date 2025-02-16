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

import { useColorScheme, Text, View ,FlatList} from "react-native";
import { useState, useContext } from "react";
import { Image } from "expo-image";

import { UserContext } from "@/hooks/conText/UserContext";
import { router } from "expo-router";

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

  const { fullname, bank, transaction } = useContext(UserContext);
  let lastDate = "";

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
            {fullname ? fullname : "FirstName LastName"}
          </ThemedText>
        </ThemedView>

        {/* check retire have data */}
        {checkRetireData ? (
          <ThemedView className="mt-3 w-[80%]">
            <ThemedView className={`${componentColor} h-40 w-full rounded-[20]`}>
              <ThemedText className="font-bold">
                Your Monthly Save Goal
              </ThemedText>
              <ThemedText className="h-1/2 w-10 align-middle font-bold">
                {retire}
              </ThemedText>
              <ThemedText className="mx-5 text-center font-bold">
                Goal 9.0k
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
              <ThemedView className="w-full  flex-row ">
                {bank?.map((account) => (
                  <ThemedCard
                    name={account.account_name}
                    color={account.color_code}
                    balance={account.balance.toString()}
                    mode="large"
                    onEdit={() => {}}
                    key={account.id}
                    className="!items-center !justify-center w-32 h-32 bg-[#fefefe] rounded-lg"
                  />
                ))}
              </ThemedView>
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

      <ThemedView className="max-h-56">
        
      {transaction ? (
        <FlatList
          data={transaction}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
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
        }}
      />
      ) : (
        <ThemedView className="!items-center w-full ">
          <ThemedText className="text-center font-bold mt-5">
            no record transaction found
          </ThemedText>
        </ThemedView>
      )}
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
