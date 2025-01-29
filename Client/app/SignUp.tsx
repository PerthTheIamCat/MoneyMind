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
          Sign Up
        </ThemedText>
        <ThemedInput
          title="Username"
          autoComplete="username"
          keyboardType="default"
        />
        <ThemedInput
          title="Email"
          autoComplete="email"
          keyboardType="email-address"
        />
        <ThemedInput
          title="Password"
          autoComplete="password"
          keyboardType="visible-password"
        />
        <ThemedInput
          title="Confirm Password"
          autoComplete="password"
          keyboardType="visible-password"
        />
        <ThemedText className="text-[12px] sm:text-[16px] max-w-[80%] font-bold mb-8 ">
          Sagree our term of service
        </ThemedText>
        <ThemedText className="text-[12px] sm:text-[16px] max-w-[80%] font-bold ">
          receive notification on email
        </ThemedText>
      </ThemedView>
      <ThemedView className="flex-col w-full max-h-[10%] gap-4 mb-10">
        <ThemedButton mode="normal" onPress={() => router.push("/SignIn")}>
          Sign In
        </ThemedButton>
        <ThemedButton mode="confirm" onPress={() => router.push("/SignUp")}>
          Sign Up
        </ThemedButton>
      </ThemedView>
    </ThemedView>
  );
}
