import { ThemedCard } from "@/components/ThemedCard";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedView } from "@/components/ThemedView";

import { useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
export default function Index() {

  const theme = useColorScheme();
  return (
    <ThemedSafeAreaView >
      <ThemedView className="!items-start pl-10 w-full mt-5">
        <ThemedText className="text-[20px] font-bold mb-6">Account</ThemedText>
      </ThemedView>
      <ThemedView className="!items-start pl-10 w-full ">
        <ThemedScrollView vertical = {false} horizontal = {true}>
        <ThemedCard name="Wallet" balance="฿0.00" color="bg-[#F9A826]" />
        <ThemedCard name="Bank" balance="฿0.00" color="bg-[#2B9348]" />
        <ThemedCard name="Credit Card" balance="฿0.00" color="bg-[#C93540]" />
        </ThemedScrollView>
      </ThemedView>


      

      <ThemedView className={`${theme==="dark" ?"bg-[#000000]" : "bg-[#ffffff]"} mt-3 px-10 !justify-start w-full h-full rounded-t-[30px]`}>
        <ThemedView className="mt-8 w-full flex-row justify-between bg-transparent">
          <ThemedButton className="w-[140px] h-8 bg-green-500">Income</ThemedButton>
          <ThemedButton className="w-[140px] h-8 bg-red-400">Expense</ThemedButton>
        </ThemedView>

        <ThemedView className="mt-3 w-full justify-center !items-start bg-transparent">
          <ThemedText className="font-bold text-[16px]">Category</ThemedText>  

          <ThemedScrollView vertical={false} horizontal={true} className="bg-transparent">
            <ThemedView className="h-11 w-full flex-row !items-center bg-transparent">
              <ThemedButton className="w-[140px] h-8 bg-green-500">Income</ThemedButton>
              <ThemedButton className="w-[140px] h-8 bg-green-500">Income</ThemedButton>
              <ThemedButton className="w-[140px] h-8 bg-green-500">Income</ThemedButton>
              <ThemedButton className="w-[140px] h-8 bg-green-500">Income</ThemedButton>
            </ThemedView>
          </ThemedScrollView>

          <ThemedText className="mt-3 font-bold text-[16px]">Enter Amount</ThemedText>  

        </ThemedView>

      </ThemedView>

    </ThemedSafeAreaView>

  );
  
}
