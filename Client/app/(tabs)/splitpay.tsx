import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { router } from "expo-router";
import { Image } from "expo-image";
import { View, Text,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function splitpay() {
  return (
    <ThemedSafeAreaView>

      {/*Header*/}
      <ThemedView className="flex-row items-center justify-between px-4 bg-red-300">
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
      <ThemedView className="flex-row items-center pt-[4%] bg-blue-300">
        <View className="flex flex-row justify-center items-center rounded-full w-[200px] h-[39px] bg-gray-300 ml-2">
          
        </View>
      </ThemedView>
      
      {/* Add Account Box */}
      <ThemedView className="flex-row items-center pt-[20%]">
        <ThemedText> Add Account </ThemedText>
      </ThemedView>

      {/* States proceed transaction */}
      <ThemedView className="flex-row items-center pt-[50%]">
        <ThemedText> Please create an account to proceed with your transaction </ThemedText>
      </ThemedView>

    </ThemedSafeAreaView>
  );
}