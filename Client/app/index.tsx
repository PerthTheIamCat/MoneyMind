import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <ThemedView className="!justify-start">
      <Image
        source={require("@/assets/logos/LOGO.png")}
        style={{
          width: "80%",
          height: "50%",
          maxHeight: 400,
          marginTop: "15%",
        }}
        contentFit="contain"
      />
      <ThemedView className="!justify-start !items-start w-full ml-[20%]">
        <ThemedText className="text-[#55A630] text-[48px]">
          MoneyMind
        </ThemedText>
        <ThemedText className="text-[#AACC00] text-[32px] text-wrap max-w-[250px]">
          Unlock Your Financial Dreams Empowering Your Journey to Wealth and
          Freedom
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
