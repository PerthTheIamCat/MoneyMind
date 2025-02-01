import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { useState } from "react";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedCheckBox } from "@/components/ThemedCheckBox";
import { ThemedText } from "@/components/ThemedText";
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
        <ThemedView className="w-[80%] mt-5 px-5 gap-5">
          <ThemedInput
            autoComplete="username"
            title="Username"
            error="adawdaw"
            className="w-full"
          />
          <ThemedInput
            autoComplete="password"
            title="Password"
            error="adawdaw"
            className="w-full "
          />
        
        </ThemedView>
        <ThemedView className=" w-full  mt-[65%]">
          <ThemedButton mode="confirm" className="w-[60%] mt-5 h-14 ">
            Sign In
          </ThemedButton>
          <ThemedButton mode="normal" onPress={() => router.push("/SignUp")} className="w-[60%] mt-5 h-14">
            Sign Up
          </ThemedButton>
          <ThemedText className="mt-3 mb-5">
            Forgot Password?
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
