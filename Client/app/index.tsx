import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <ThemedView className="!justify-start">
      <Image
        source={require("@/assets/logos/LOGO.png")}
        style={{
          width: "100%",
          height: "30%",
          maxHeight: 400,
          marginTop: "25%",
        }}
        contentFit="contain"
      />
      <ThemedView className="!justify-start mt-[10%]">
        <ThemedText className="text-[#55A630] text-[40px] sm:text-[48px] max-w-[80%]">
          MoneyMind
        </ThemedText>
        <ThemedText className="text-[#AACC00] text-[24px] sm:text-[32px] text-wrap max-w-[80%]">
          Unlock Your Financial Dreams Empowering Your Journey to Wealth and
          Freedom
        </ThemedText>
      </ThemedView>
      <ThemedView className="flex-row w-full max-h-[10%] gap-10 mb-10 !items-start">
        <ThemedButton mode="normal">Sign In</ThemedButton>
        <ThemedButton mode="confirm">Sign Up</ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}
