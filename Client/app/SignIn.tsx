import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ThemedInput } from "@/components/ThemedInput";
export default function Index() {
  return (
    <ThemedView className="!justify-start">
      <Image
        source={require("@/assets/logos/LOGO.png")}
        style={{
          width: "100%",
          height: "20%",
          maxHeight: 150,
          marginTop: "25%",
        }}
        contentFit="contain"
      />
      <ThemedView className="!justify-start !items-start mt-[7%] w-full pl-24">
        <ThemedText className="text-[28px] sm:text-[34px] max-w-[80%] font-bold mb-8 ">
          Sign In
        </ThemedText>
        <ThemedInput
          title="Username"
          autoComplete="username"
          keyboardType="default"
        />
        <ThemedInput
          title="Password"
          autoComplete="password"
          keyboardType="visible-password"
        />
      </ThemedView>
      <ThemedView className="flex-col w-full max-h-[10%] gap-4 mb-10 ">
        <ThemedButton mode="confirm" onPress={() => router.push("/SignIn" )} className="max-w-[250px] w-[50%] ">
          Sign In
        </ThemedButton>
        <ThemedButton mode="normal" onPress={() => router.push("/SignUp")} className="max-w-[250px] w-[50%] ">
          Sign Up
        </ThemedButton>
        <ThemedText className="text-[#969393] text-[14px] sm:text-[18px] max-w-[80%] font-bold mb-20  ">
          Forgot Password?
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
