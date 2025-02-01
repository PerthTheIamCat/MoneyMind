import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function Index() {
  return (
    <ThemedSafeAreaView>

      <ThemedView className="mt-2 mx-5 h-10 bg-[#2f2f2f] justify-between flex-row">
        <ThemedText className="text-#2f2f2f text-lg">HomeVeiw</ThemedText>
        <Ionicons name="notifications-outline" size={24} color="white"/>
      </ThemedView>

      <ThemedView className="ml-4 mt-4 w-1/2 flex-row">
        <Feather name="circle" size={40} color="#f2f2f2" />
        <ThemedText className="text-xl font-bold pl-3">
          Astrex Destineth
        </ThemedText>
      </ThemedView>

      <ThemedView className="mt-3">
        <ThemedView className="w-4/5 h-40 p-8 bg-[#8f8f8f] rounded-[20] justify-center items-start">
          <ThemedText className="text-[#f2f2f2] font-bold">
            Your Monthly Save Goal
          </ThemedText>
          <AntDesign name="filetext1" size={50} color="#f2f2f2" className="m-3"/>
          <ThemedText className="text-[#f2f2f2] text-center font-bold">
            Let’s get started with your first retirement plan!
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView className="ml-4 mt-4 w-1/4 items-start">
        <ThemedText className="text-xl font-bold pl-5">Account</ThemedText>
      </ThemedView>

      <ThemedView className="bg-[#8f8f8f] w-4/5 h-40 p-8 rounded-[20] justify-center items-center">
        <AntDesign name="filetext1" size={50} color="#f2f2f2" />
        <ThemedText className="text-[#f2f2f2] text-center font-bold mt-4">
          Let’s get started with your first Money Account plan!
        </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
