import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import { View } from "react-native";

export default function Index() {
  return(
    <ThemedView>

      <View className=" absolute top-0  bg-#f2f2f2 w-full h-10 mt-10 justify-between flex-row items-start ">
          <ThemedText className="text-#2f2f2f text-lx pl-5 ">HomeVeiw</ThemedText>
          <Ionicons name="notifications-outline" size={24} color="white" className="pr-5" />
      </View>

      <View className="w-full justify-start ml-16 h-14 items-start flex-row"> 
        <Feather name="circle" size={40} color="#f2f2f2" />
        <ThemedText className="text-xl font-bold pl-3 pt-2">Astrex Destineth</ThemedText>
      </View>

      <View className="bg-[#8f8f8f] w-4/5 h-40 p-8 rounded-[20] justify-center items-center ">
          <ThemedText className="text-[#f2f2f2] font-bold">Your Monthly Save Goal</ThemedText>
          <AntDesign name="filetext1" size={50} color="#f2f2f2" className="m-3"/>
          <ThemedText className="text-[#f2f2f2] text-center font-bold">
            Let’s get started with your 
            first retirement plan!
          </ThemedText>
      </View>

      <View className="w-full h-12 ml-10 mt-8 justify-center items-start"> 
        <ThemedText className="text-xl font-bold pl-5">Account</ThemedText>
      </View>

      <View className="bg-[#8f8f8f] w-4/5 h-40 p-8 rounded-[20] justify-center items-center">
          <AntDesign name="filetext1" size={50} color="#f2f2f2" />
          <ThemedText className="text-[#f2f2f2] text-center font-bold mt-4">
            Let’s get started with your 
            first Money Account plan!
          </ThemedText>
      </View>

    </ThemedView>
  );
}
