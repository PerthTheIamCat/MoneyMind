import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { router } from "expo-router";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function splitpay() {
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
      <ThemedView >
        <ThemedText>  </ThemedText>
        <ThemedText>  </ThemedText>
      </ThemedView>
      
      {/* Add Account Box */}
      <ThemedView >
        <ThemedText>  </ThemedText>
        <ThemedText>  </ThemedText>
      </ThemedView>

      {/* States proceed transaction */}
      <ThemedView >
        <ThemedText>  </ThemedText>
        <ThemedText>  </ThemedText>
      </ThemedView>

    </ThemedSafeAreaView>
  );
}