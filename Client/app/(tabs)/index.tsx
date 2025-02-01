import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

import { useColorScheme } from "react-native";
import { View } from "react-native";

const theme = useColorScheme();
const componentcolor = theme === "dark" ? "!bg-[#8f8f8f]" : "!bg-[#d8d8d8]";
const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";


export default function Index() {
  return(
    <ThemedView>

      <ThemedView className={"mt-2 mx-5 h-10 justify-between flex-row"}>
        <ThemedText className="text-#2f2f2f text-lg">HomeView</ThemedText>
        <ThemedButton className="bg-transparent">
          <Ionicons name="notifications-outline" size={24} color="white"/>
        </ThemedButton>
      </ThemedView>


      <ThemedView className="ml-4 mt-4 w-1/2 flex-row">
        <Feather name="circle" size={40} color={`${componenticon}`} />
        <ThemedText className="text-xl font-bold pl-3">
          Astrex Destineth
        </ThemedText>
      </ThemedView>

       <ThemedView className="mt-3">
          <ThemedButton className={`${componentcolor} h-40 w-4/5 rounded-[20]`}>
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
