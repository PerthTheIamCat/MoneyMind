import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { router } from "expo-router";
import { Image } from "expo-image";
import { View,} from "react-native";
import { useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";


export default function splitpay() {
  const theme = useColorScheme();
  const componentcolor = theme === "dark" ? "!bg-[#8f8f8f]" : "!bg-[#d8d8d8]";
  const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  return (
    <ThemedSafeAreaView>

      {/*Header*/}
      <ThemedView className="flex-row items-center justify-between px-4">
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
          onPress={() => router.push("/Add_Transaction")}
          name="notifications-outline"
          size={32}
          color="black"
          style={{ alignSelf: "center", marginTop: "5%", marginRight: "5%" }}
        />
      </ThemedView>

      {/* Decision Menu */}
      <ThemedView className="flex-row items-center pt-[4%]">
        <View className="flex flex-row justify-center items-center rounded-full w-[200px] h-[39px] bg-gray-200 ml-2">
          
        </View>
      </ThemedView>
      
      {/* Add Account Box */}
      <ThemedView>
        <ThemedView className="flex flex-row justify-center items-center pt-[10%] ml-2">
          <ThemedButton className={`${componentcolor}`} onPress={() => {() => router.push("/AddAccount")}}>
            <ThemedView className="w-[200px] h-[100px] bg-gray-300 rounded-[5vw]">
              <AntDesign name="plus" size={25} color={`${componenticon}`} className="m-3 justify-center items-center"/>
              <ThemedText className="mx-5 text-center font-bold">
                Add Account
              </ThemedText>
            </ThemedView>
          </ThemedButton>
        </ThemedView>
      </ThemedView>

      {/* States proceed transaction */}
      <ThemedView>
        <ThemedView className="flex-row items-center pt-[10%] bg-transparent">
            <ThemedView className="justify-center items-center rounded-[10vw] w-[300px] h-[200px] bg-gray-300 ml-2">
              <AntDesign name="filetext1" size={70} color={`${componenticon}`} className="m-3"/>
              <ThemedText className="mx-5 text-center font-bold">
                Please create an account
                to proceed with your transaction.
              </ThemedText>
            </ThemedView>
        </ThemedView>
      </ThemedView>

    </ThemedSafeAreaView>
  );
}