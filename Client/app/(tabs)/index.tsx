import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedCard } from "@/components/ThemedCard";
import { ThemedScrollView } from "@/components/ThemedScrollView";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import { useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { useState } from "react";

export default function Index() {
  const theme = useColorScheme();
  const componentcolor = theme === "dark" ? "!bg-[#8f8f8f]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  
  const [checkretireData,setCheckRetireData]=useState(false);
  const [AccountData,setAccountData]=useState(false);
  const [username,setUsername]=useState("USERNAME:)");
  const [retireAmount,setretire]=useState(5000);
  const [retireGoal,setretireGoal]=useState(10000);

  return (
    <ThemedSafeAreaView>

      <ThemedView className={"mt-2 mx-5 h-10 justify-between flex-row"}>
        <ThemedText className="text-#2f2f2f text-lg">HomeView</ThemedText>
        <ThemedButton className="bg-transparent">
          <Ionicons name="notifications-outline" size={24} color="white"/>
        </ThemedButton>
      </ThemedView>

      <ThemedView className="ml-5 mt-4 flex-row !justify-start">
        <Feather name="circle" size={40} color={`${componenticon}`} />
        <ThemedText className="text-xl font-bold pl-3">
          {username}
        </ThemedText>
      </ThemedView>

      {/* check retire have data */}
      {!checkretireData ? (
        <ThemedView className="mt-3">
          <ThemedButton className={`${componentcolor} h-40 w-4/5 rounded-[20]`} onPress={() => setCheckRetireData(true)}>
              <ThemedView className="bg-transparent">
                <ThemedText className="font-bold">
                  Your Monthly Save Goal
                </ThemedText>
                <AntDesign name="filetext1" size={50} color={`${componenticon}`} className="m-3"/>
                <ThemedText className="mx-5 text-center font-bold">
                  Let’s get started with your first 
                  retirement plan!
                </ThemedText>
              </ThemedView>
          </ThemedButton>
        </ThemedView>
      ):(
      <ThemedView className="mt-3">
        <ThemedView className={`${componentcolor} h-40 w-4/5 rounded-[20]`}>         
          <ThemedText className="font-bold">
            Your Monthly Save Goal
          </ThemedText>
          <ThemedText className="h-1/2 w-10 align-middle font-bold">{retireAmount}</ThemedText>
          <ThemedText className="mx-5 text-center font-bold">
           Goal {retireGoal}.-
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      )}
      
      <ThemedView className="ml-5 mt-4 flex-row !justify-start">
        <ThemedText className="text-xl font-bold pl-5">Account</ThemedText>
      </ThemedView>


      {!AccountData ? (
      <ThemedView className="mt-3">
        <ThemedButton className={`${componentcolor} w-4/5 h-40 rounded-[20]`} onPress={() => setAccountData(true)}>
          <ThemedView className="bg-transparent">  
            <AntDesign name="filetext1" size={50} color={`${componenticon}`} className="m-3"/>
            <ThemedText className="mx-5 text-center font-bold">
              Let’s get started with your first Money Account plan!
            </ThemedText>
          </ThemedView>
        </ThemedButton>
      </ThemedView>
      ):(
      <ThemedView className="mt-3 ">
        <ThemedScrollView vertical={false}  horizontal={true} className="w-full" showsHorizontalScrollIndicator={false} >  
          <ThemedView className="w-full  flex-row px-20">
              <ThemedCard mode="small" name="Wallet" balance="0.00" color="bg-red-500" className="snap-center"/>
              <ThemedCard mode="small" name="Bank" balance="0.00" color="bg-blue-500" className="snap-center"/>
              <ThemedCard mode="small" name="Credit Card" balance="0.00" color="bg-orange-500" className="snap-center"/>
          </ThemedView>
        </ThemedScrollView>
      </ThemedView>
      )}
      <ThemedView className="ml-5 mt-4 flex-row !justify-start">
        <ThemedText className="text-xl font-bold pl-5">Transaction</ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
