import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedScrollViewCenter } from "@/components/ThemedScrollViewCenter";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import { useColorScheme } from "react-native";
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


export default function Index() {
  const theme = useColorScheme();
  const componentColor = theme === "dark" ? "!bg-[#8f8f8f]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  const [checkRetireData, setCheckRetireData] = useState(false);
  const [retire, setRetire] = useState<number | null>(null);
  const [transaction, setTransaction] = useState<boolean | null>(true);

  const [checkretireData,setCheckRetireData]=useState(false);
  const [AccountData,setAccountData]=useState(false);
  const [username,setUsername]=useState("USERNAME:)");
  const [retireAmount,setretire]=useState(5000);
  const [retireGoal,setretireGoal]=useState(10000);
    
  const { fullname, bank } = useContext(UserContext);

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
              onPress={() => router.push("/(tabs)/transaction")}
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
                {bank.map((item, index) => (
                  <ThemedCard
                    key={index}
                    mode="large"
                    name={item.account_name}
                    balance={item.balance.toString()}
                    color={item.color_code}
                    className="snap-center"
                  />
                ))}
              </ThemedView>
            </ThemedScrollViewCenter>
          </ThemedView>
        )}
        <ThemedView
          className="ml-4 mt-4 w-[80%] flex-row !justify-between"
          onTouchEnd={() => router.push("/(tabs)/transaction")}
        >
          <ThemedText className="text-xl font-bold text-start">
            Transaction {">"}
          </ThemedText>
          <ThemedText className="text-xl font-bold text-start">
            see all
          </ThemedText>
        </ThemedView>
        {transactions ? (
          <ThemedView className="!justify-start mt-3 gap-5 w-[80%] bg-[#D9D9D9] rounded-xl p-2">
            {transactions.map((transaction) => {
              return (
                <ThemedView
                  key={transaction.id}
                  className="w-full items-center h-16 !justify-start flex-row pl-5 !bg-transparent"
                >
                  {
                    transaction.transaction_type === "income" ? (
                      <ThemedView className="w-16 h-16 bg-green-500 rounded-xl"/>
                    ) : (
                      <ThemedView className="w-16 h-16 bg-red-500 rounded-xl"/>
                    )
                  }
                </ThemedView>
              );
            })}
          </ThemedView>
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
