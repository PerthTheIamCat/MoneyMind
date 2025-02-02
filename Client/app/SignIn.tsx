import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SignInHandler } from "@/hooks/auth/SignInHandler";
import { Image } from "expo-image";
import { useState, useContext } from "react";
import { router } from "expo-router";
import { ServerContext } from "@/hooks/conText/ServerConText";

export default function Index() {
  const [usernameEmail, setUsernameEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorUsernameEmail, setErrorUsernameEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const { URL } = useContext(ServerContext);

  const handleSignIn = () => {
    try {
      if (usernameEmail === "") {
        setErrorUsernameEmail("Username/Email is required");
        return;
      } else {
        setErrorUsernameEmail("");
      }
      if (password === "") {
        setErrorPassword("Password is required");
        return;
      } else {
        setErrorPassword("");
      }
      SignInHandler(URL, { input: usernameEmail, password: password }).then((response) => {
        console.log(response);
        if (response.success) {
          router.push("/(tabs)");
        } else {
          setErrorUsernameEmail(response.message);
        }
      });
      
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width: 150,
            height: 150,
            marginTop: 20,
          }}
        />
        <ThemedView className="w-[80%] mt-5 px-5 gap-5">
          <ThemedText className="text-2xl font-bold w-full">
              Sign In
          </ThemedText>
          <ThemedInput
            autoComplete="username"
            title="Username/Email"
            error={errorUsernameEmail}
            className="w-full"
            onChangeText={setUsernameEmail}
          />
          <ThemedInput
            autoComplete="password"
            title="Password"
            error={errorPassword}
            className="w-full "
            onChangeText={setPassword}
          />
        </ThemedView>
        <ThemedView className=" w-full  mt-[65%]">
          <ThemedButton mode="confirm" className="w-[60%] mt-5 h-14 " onPress={handleSignIn}>
            Sign In
          </ThemedButton>
          <ThemedButton
            mode="normal"
            onPress={() => router.push("/SignUp")}
            className="w-[60%] mt-5 h-14"
          >
            Sign Up
          </ThemedButton>
          <ThemedText className="mt-3 mb-5">Forgot Password?</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
