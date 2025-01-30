import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <ThemedView className="!justify-start h-full max-h-full overflow-y-auto">
      <Image
        source={require("@/assets/logos/LOGO.png")}
        style={{
          width: "100%",
          height: "50%",
          maxHeight: 300,
          marginTop: "20%",
        }}
        contentFit="contain"
      />
      <ThemedView className="!items-start pl-10 w-full font-bold">
        <ThemedText className="text-5xl my-10 !text-[#55A630]">
          MoneyMind
        </ThemedText>
        <ThemedText className="max-w-[60%] text-3xl text-wrap font-bold !text-[#AACC00]">
          Unlock Your Financial Dreams Empowering Your Journey to Wealth and
          Freedom
        </ThemedText>
      </ThemedView>
      <ThemedView className="flex-row gap-5 h-fit absolute bottom-10 w-full">
        <ThemedButton className="w-[45%] h-14" mode="normal" onPress={() => router.push("/SignIn")}>
          Sign In
        </ThemedButton>
        <ThemedButton className="w-[40%] h-14" mode="confirm" onPress={() => router.push("/SignUp")}>
          Sign Up
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}
