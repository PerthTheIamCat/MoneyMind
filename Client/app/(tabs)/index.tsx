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

import { useColorScheme,Text,View, } from "react-native";
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

const TransactionItem = ({ transaction, theme }: { transaction: Transaction, theme: string | null }) => {
  const componentcolor = theme === "dark" ? "!bg-[#282828]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  return (
    <View className={`flex-row items-center justify-center w-10/12 ${componentcolor} w-full p-4 rounded-lg mb-2 shadow-md`}>
      <Image
        source={transaction.logo}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
      />

      <View className="flex-1">
        <ThemedText className={`font-bold text-lg `}>
          {transaction.category}
        </ThemedText>
        <ThemedText className={``}>
          {transaction.description}
        </ThemedText>
      </View>

      <Text className={`font-bold text-[16px] ${transaction.transaction_type === "income" ? "text-green-500" : "text-red-500"}`}>
        {transaction.amount}
      </Text>
      <Entypo name="dots-three-vertical" size={20} color={componenticon} className="ml-2" />
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
  
  const [AccountData,setAccountData]=useState(false);
  const [username,setUsername]=useState("USERNAME:)");
  const [retireAmount,setretire]=useState(5000);
  const [retireGoal,setretireGoal]=useState(10000);
  
  const { fullname, bank } = useContext(UserContext);
  let lastDate = "";
  
  const transactions: Transaction[] = [
    {
      id: "1",
      logo: require("@/assets/logos/LOGO.png"),
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
    {
      id: "4",
      logo: require("@/assets/logos/LOGO.png"),
      transaction_type: "income",
      amount: "+฿20,000.00",
      category: "Salary",
      description: "Monthly paycheck",
      date: "26/12/67",
    },
    {
      id: "5",
      logo: require("@/assets/logos/LOGO.png"),
      transaction_type: "income",
      amount: "+฿20,000.00",
      category: "Salary",
      description: "Monthly paycheck",
      date: "26/12/67",
    }
  ];

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedView
          className={"mt-2 mx-5 h-10 w-[80%] !justify-between flex-row"}
        >
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={{ width: 50, height: 50, marginLeft: 15 }}
          />
          <ThemedButton className="bg-transparent">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </ThemedButton>
        </ThemedView>

        <ThemedView className="!justify-start mt-5 w-[80%] flex-row">
          <Feather name="circle" size={40} color={`${componentIcon}`} />
          <ThemedText className="text-xl font-bold pl-3 text-start">
            {fullname ? fullname : "FirstName LastName"}
          </ThemedText>
        </ThemedView>

        {/* check retire have data */}
        {!checkRetireData ? (
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
        ) : (
          <ThemedView className="mt-3">
            <ThemedView className={`${componentColor} h-40 w-4/5 rounded-[20]`}>
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
        )}

        <ThemedView className="ml-4 mt-4 w-[80%]">
          <ThemedText className="text-xl font-bold text-start w-full">
            Account
          </ThemedText>
        </ThemedView>

        {!bank ? (
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
        ) : (
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
                // image={account.icon_id}
                className="!items-center !justify-center w-32 h-32 bg-[#fefefe] rounded-lg"
              />
            ))}
              </ThemedView>
            </ThemedScrollViewCenter>
          </ThemedView>
        )}
        </ThemedView>
        <ThemedView
          className="ml-4 mt-4 w-[80%] flex-row !justify-between"
          onTouchEnd={() => router.push("/(tabs)/transaction")}
          >
          <ThemedText className="text-xl font-bold text-start">
            Transaction
          </ThemedText>
        </ThemedView>
        
        {transactioncheack ? (
          <ThemedView className="!items-center w-full">
            <ThemedScrollView className=" h-80">
              <ThemedView className="gap-5 w-full rounded-xl">
                {transactions.map((transaction) => {
                  return (
                    <ThemedView className="bg-[E5E5E5] !justify-start h-full py-2 pb-12">
                      <ThemedView className="w-full !items-center">
                        {transactions.map((transaction) => {
                          const showDateHeader = transaction.date !== lastDate;
                          lastDate = transaction.date;
                          return (
                            <ThemedView key={transaction.id} className="w-full !items-start ">
                              {showDateHeader && (
                                <ThemedText className="w-full font-bold text-1xl py-1">
                                  {transaction.date}
                                </ThemedText>
                              )}
                              <TransactionItem transaction={transaction} theme={theme}/>
                            </ThemedView>
                          );
                        })}
                      </ThemedView>
                    </ThemedView>
                  );
                })}
              </ThemedView>
            </ThemedScrollView>
          </ThemedView>
          
        ) : (
          <ThemedView className="!items-center w-full ">
            <ThemedText className="text-center font-bold mt-5">
              no record transaction found
            </ThemedText>
          </ThemedView>
        )}
    </ThemedSafeAreaView>
  );
}
