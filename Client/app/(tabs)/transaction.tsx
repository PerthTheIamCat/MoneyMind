import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedButton } from "@/components/ThemedButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedCard } from "@/components/ThemedCard";

export default function Index() {
  return (
    <ThemedSafeAreaView>
      <ThemedView className="flex-row items-center justify-between bg-red-500 px-4">
        <Image
          className="ml-[10%]"
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width: 79,
            height: 70,
            marginTop: "2%",
            marginLeft: "5%",
          }}
        />
        <Ionicons
          name="notifications-outline"
          size={32}
          color="black"
          style={{ alignSelf: "center", marginTop: "5%", marginRight: "5%" }}
        />
      </ThemedView>
      <ThemedView className="!items-start pl-[10%] pt-[2%] bg-yellow-700">
        <ThemedText className=" text-[18px]">Connected</ThemedText>
        <ThemedText className="font-bold text-[24px]">Accounts</ThemedText>
      </ThemedView>
      <ThemedView className="bg-blue-400 h-[154px] !items-center flex flex-row ">
        <View className="flex flex-row justify-center items-center rounded-xl -rotate-90  w-[125px] h-[40px] bg-gray-400 -ml-2 active:scale-105">
          <AntDesign name="plus" size={20} color="black" />
          <Text>Add Account</Text>
        </View>
        <ThemedScrollView
          horizontal={true}
          className=" bg-yellow-600 pl-2 rounded-tl-[15px] rounded-bl-[15px] w-5/6 -ml-9"
        >
          <View className="mt-0.5 mb-1 flex-row space-x-1">
            <ThemedCard name="K-Push" balance="฿0.00" color="bg-[#653044]" />
            <ThemedCard name="Wallet" balance="฿0.00" color="bg-[#225566]" />
            <ThemedCard name="Bank" balance="฿0.00" color="bg-[#000000]" />
            <ThemedCard
              name="Credit Card"
              balance="฿0.00"
              color="bg-[#ff0000]"
            />
          </View>
        </ThemedScrollView>
      </ThemedView>
      <ThemedView className="flex-row items-center bg-red-400 justify-between px-4">
        <ThemedText className="text-[20px] pl-[5%] font-bold">
          Transaction
        </ThemedText>
        <View className="font-bold flex flex-row mr-6">
          <Text className="font-bold items-center mt-1 text-[18px]">All</Text>
          <MaterialIcons
            name="arrow-drop-down"
            size={26}
            color="black"
            className="mt-1"
          />
        </View>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
