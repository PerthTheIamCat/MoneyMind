import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { useState } from "react";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedCheckBox } from "@/components/ThemedCheckBox";
import { router } from "expo-router";

export default function Index() {
  const theme = useColorScheme();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<string>("awdawdadw");
  const [errorEmail, setErrorEmail] = useState<string>("awdawd");
  const [errorPassword, setErrorPassword] = useState<string>("awdawd");
  const [errorPasswordConfirmation, setErrorPasswordConfirmation] =
    useState<string>("awdawd");

  return (
    <ThemedSafeAreaView>
      <ThemedView >
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width: 150,
            height: 150,
            marginTop: 20,
          }}
        />
        <ThemedView className="w-96 mt-5 px-5 gap-5">
          <ThemedInput
            autoComplete="username"
            title="Username"
            error="adawdaw"
            className="w-full"
          />
          <ThemedInput
            autoComplete="email"
            title="Email"
            error="adawdaw"
            className="w-full"
          />
          <ThemedInput
            autoComplete="password"
            title="Password"
            error="adawdaw"
            className="w-full"
          />
          <ThemedInput
            autoComplete="password"
            title="Confirm Password"
            error="adawdaw"
            className="w-full"
          />
          <ThemedCheckBox color="#2B9348">
            accecept terms and conditions
          </ThemedCheckBox>
          <ThemedCheckBox color="#2B9348">
            receive notification on email
          </ThemedCheckBox>
        </ThemedView>
        <ThemedView className="mt-7 w-full">
          <ThemedButton mode="confirm" className="w-[60%]  h-14">
            Sign Up
          </ThemedButton>
          <ThemedButton mode="normal" onPress={() => router.push("/SignIn")} className="w-[60%] mt-5 h-14">
            Sign In
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
