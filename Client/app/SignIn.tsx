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
import { AuthContext } from "@/hooks/conText/AuthContext";
import { TouchableOpacity } from "react-native";
import { getPinFromDatabase } from "@/hooks/auth/GetPin";
import { UserContext } from "@/hooks/conText/UserContext";

export default function Index() {
  const [usernameEmail, setUsernameEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorUsernameEmail, setErrorUsernameEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  const { userID } = useContext(UserContext);

  const handleSignIn = async () => {
    console.log("Sign In:", usernameEmail, password);

    try {
      if (usernameEmail.trim() === "") {
        setErrorUsernameEmail("Username/Email is required");
        return;
      }

      if (password.trim() === "") {
        setErrorPassword("Password is required");
        return;
      }

      setIsLoading(true);

      await SignInHandler(URL, {
        input: usernameEmail,
        password: password,
      }).then(async (response) => {
        if (response.success) {
          await auth?.setToken(response.accessToken);
          if (await auth?.isPinSet) {
            router.push("/(tabs)");
          } else {
            router.push("/CreatePinPage");
          }
        }
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("An error occurred while signing in. Please try again.");
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
          <ThemedText className="text-2xl font-bold w-full">Sign In</ThemedText>
          <ThemedInput
            value={usernameEmail}
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
            secureTextEntry={true}
            className="w-full "
            onChangeText={setPassword}
          />
        </ThemedView>
        <ThemedView className=" w-full  mt-[65%]">
          <ThemedButton
            mode="confirm"
            className="w-[60%] mt-5 h-14 "
            onPress={handleSignIn}
            isLoading={isLoading}
          >
            Sign In
          </ThemedButton>
          <ThemedButton
            mode="normal"
            onPress={() => router.push("/SignUp")}
            className="w-[60%] mt-5 h-14"
          >
            Sign Up
          </ThemedButton>
          <TouchableOpacity onPress={() => router.replace("/OTPpasswordSend")}>
            <ThemedText className="mt-3 mb-5 underline">
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
