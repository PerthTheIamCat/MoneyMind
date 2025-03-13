import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedCheckBox } from "@/components/ThemedCheckBox";
import { useColorScheme } from "react-native";
import { useContext, useState } from "react";
import { TermsContext } from "@/hooks/conText/TermsConText";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { router } from "expo-router";
import { Image } from "expo-image";
import { SendOTPHandler } from "@/hooks/auth/SendOTPHandler";
import { CreateUserBank } from "@/hooks/auth/CreateUserBank";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  // Use the useColorScheme hook to get the current color scheme
  const theme = useColorScheme();

  const [isSending, setIsSending] = useState<boolean>(false);

  // Create state variables for error messages
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorPasswordConfirmation, setErrorPasswordConfirmation] =
    useState<string>("");

  // Use the useContext hook to get the setIsAccepted function from the TermsContext
  const {
    URL,
    setUsername,
    setEmail,
    setPassword,
    setPasswordConfirmation,
    setOtp,
    username,
    email,
    password,
    passwordConfirmation,
  } = useContext(ServerContext);
  const { isAccepted, setIsAccepted } = useContext(TermsContext);
  const [isCheckedNotification, setIsCheckedNotification] =
    useState<boolean>(false);
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleSignUp = () => {
    try {
      if (username === "") {
        setErrorUsername("Username is required");
        return;
      } else {
        setErrorUsername("");
      }
      const emailValue = email?.trim() || "";
      if (emailValue === "") {
        setErrorEmail("Email is required");
        return;
      }if (!emailPattern.test(emailValue)) {
        setErrorEmail("Please enter a valid email address (@)");
        return;
      } else {
        setErrorEmail("");
      }
      if (password === "") {
        setErrorPassword("Password is required");
        return;
      } else {
        setErrorPassword("");
      }
      if (passwordConfirmation === "") {
        setErrorPasswordConfirmation("Password Confirmation is required");
        return;
      } else {
        setErrorPasswordConfirmation("");
      }
      if (password !== passwordConfirmation) {
        setErrorPasswordConfirmation(
          "Password and Password Confirmation do not match"
        );
        return;
      } else {
        setErrorPasswordConfirmation("");
      }
      if (!isAccepted) {
        router.push("/terms_and_con");
        return;
      }
      if (password && password.length < 8) {
        setErrorPassword("Password must longer than 8 characters!");
        return;
      }
      setIsSending(true);
      const timeoutId = setTimeout(() => {
        setIsSending(false);
        alert("Sign Up is taking too long. Please try again later.");
      }, 5000);
      SendOTPHandler(URL, { email: email! }).then((response) => {
        if (response.success) {
          clearTimeout(timeoutId);
          setIsSending(false);
          setOtp(response.message);
          router.push("/OTP");
        } else {
          clearTimeout(timeoutId);
          setIsSending(false);
          console.error(response.message);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedSafeAreaView >
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
          <ThemedText className="text-2xl font-bold w-full">Sign Up</ThemedText>
          <ThemedInput
            value={username}
            autoComplete="username"
            title="Username"
            error={errorUsername}
            className="w-full"
            onChangeText={(text) => setUsername(text)}
          />
          <ThemedInput
            value={email}
            autoComplete="email"
            title="Email"
            error={errorEmail}
            className="w-full"
            onChangeText={(text) => setEmail(text)}
          />
          <ThemedInput
            autoComplete="password"
            title="Password"
            error={errorPassword}
            className="w-full"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          <ThemedInput
            autoComplete="password"
            title="Confirm Password"
            error={errorPasswordConfirmation}
            className="w-full"
            onChangeText={(text) => setPasswordConfirmation(text)}
            secureTextEntry={true}
          />
          <ThemedCheckBox
            color="#2B9348"
            textClassName="!text-[12px]"
            onValueChange={(value) =>
              value ? router.push("/terms_and_con") : setIsAccepted(value)
            }
            value={isAccepted}
          >
            Accept Terms And Conditions
          </ThemedCheckBox>
          <ThemedCheckBox
            color="#2B9348"
            textClassName="!text-[12px]"
            value={isCheckedNotification}
            onValueChange={(value) => setIsCheckedNotification(value)}
          >
            Receive Notification On Email
          </ThemedCheckBox>
        </ThemedView>
        <ThemedView className="mt-7 w-full">
          <ThemedButton
            mode="confirm"
            className="w-[60%] h-14"
            onPress={handleSignUp}
            isLoading={isSending}
          >
            Sign Up
          </ThemedButton>
          <ThemedButton
            mode="normal"
            onPress={() => router.push("/SignIn")}
            className="w-[60%] mt-5 h-14 mb-5"
          >
            Sign In
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
