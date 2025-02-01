import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { Image } from "expo-image";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedButton } from "@/components/ThemedButton";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Index() {
  return (
    <ThemedSafeAreaView>
      <ThemedView className="flex-row items-center justify-between bg-red-500 px-4">
        <Image className="ml-[10%]"
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width:79 ,
            height:70 ,
            marginTop: "10%",
            marginLeft: "5%"
          }}
        />
        <Ionicons name="notifications-outline" size={32} color="black" style={{ alignSelf: "center", marginTop: "10%"}}/>
      </ThemedView>
      <ThemedView className="!items-start pl-[10%] pt-[2%] bg-yellow-700">
          <ThemedText className=" text-[18px]">Connected</ThemedText>
          <ThemedText className="font-bold text-[24px]">Accounts</ThemedText>
      </ThemedView>
      <ThemedView className="bg-blue-400 h-[150px] !items-start ">
          <ThemedButton className="w-[150px] h-[40px] ml-[-25px] transform rotate-[-90]" textClassName="text-center h-full" > <AntDesign name="plus" size={24} color="black" className="absolute left-40"/>Add Account</ThemedButton>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
