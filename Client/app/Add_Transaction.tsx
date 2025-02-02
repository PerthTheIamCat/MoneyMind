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


      

      <ThemedView className={`${theme==="dark" ?"bg-[#000000]" : "bg-[#ffffff]"} mt-3 w-full h-full rounded-t-[30px]`}>
        <ThemedView className="px-14 w-full flex-row justify-between bg-transparent">
          <ThemedButton className="w-[120px] h-8 bg-green-500">TEXT</ThemedButton>
          <ThemedButton className="w-[120px] h-8 bg-red-400">Exprenx</ThemedButton>
        </ThemedView>
      </ThemedView>

    </ThemedSafeAreaView>

  );
  
}
