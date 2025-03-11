import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";

import { SignInHandler } from "@/hooks/auth/SignInHandler";
import { NotificationsPostHandler } from "@/hooks/auth/NotificationsHandler";

import { Image } from "expo-image";

import { router } from "expo-router";

import { useState, useContext, useEffect } from "react";
import { TouchableOpacity } from "react-native";

import { ServerContext } from "@/hooks/conText/ServerConText";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { UserContext } from "@/hooks/conText/UserContext";
import * as Device from "expo-device";

export default function Index() {
  const [usernameEmail, setUsernameEmail] = useState<string>("");
  const [isSendNotificationSuccess, setIsSendNotificationSuccess] =
    useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [errorUsernameEmail, setErrorUsernameEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  const { userID } = useContext(UserContext);

  const handleSignIn = async () => {
    console.log("Sign In:", usernameEmail, password);
    setErrorUsernameEmail("");
    setErrorPassword("");
    setIsLoading(false);
    setIsLoginSuccess(false);
    setIsSendNotificationSuccess(false);

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

      const timeout = setTimeout(() => {
        setIsLoading(false);
        alert(
          "Sign in request timed out. Please try again. Cant connect to server"
        );
      }, 5000);
      await SignInHandler(URL, {
        input: usernameEmail,
        password: password,
      }).then(async (response) => {
        if (response.success) {
          await auth?.setToken(response.accessToken);
          setIsLoginSuccess(true);
        } else {
          alert(response.message);
        }
        clearTimeout(timeout);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("An error occurred while signing in. Please try again.");
    }
  };

  useEffect(() => {
    async function sendNotification() {
      const deviceNumber = await Device.getDeviceTypeAsync();
      const deviceTypes: { [key: number]: string } = {
        1: "Phone",
        2: "Tablet",
        3: "Desktop",
      };
      const deviceName = deviceTypes[deviceNumber] || "Unknown";
      await NotificationsPostHandler(
        URL,
        {
          user_id: userID!,
          notification_type: "security",
          message: "Sign In with new device: " + deviceName,
          color_type: "yellow",
        },
        auth?.token!
      ).then((res) => {
        if (res.success) {
          setIsSendNotificationSuccess(true);
          setIsSending(false);
          console.log("Notification Post Response:", res.result);
        } else {
          console.log("Notification Post Error:", res);
          setIsSending(false);
        }
      });
    }
    if (isLoginSuccess && !isSending && !isSendNotificationSuccess) {
      sendNotification();
      setIsSending(true);
    }
    if (isSendNotificationSuccess && isLoginSuccess && auth?.isPinSet) {
      router.push("/(tabs)");
      console.log("Token is ", auth?.token);
    } else if (
      isSendNotificationSuccess &&
      isLoginSuccess &&
      auth?.token &&
      !auth?.isPinSet
    ) {
      router.push("/CreatePinPage");
    }
  }, [
    auth?.token,
    userID,
    isLoginSuccess,
    isSendNotificationSuccess,
    isSending,
  ]);

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
