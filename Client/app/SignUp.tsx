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
import axios from "axios";
import {
  CheckEmailExistHandler,
  CheckUsernameExistHandler,
} from "@/hooks/auth/CheckUserExist";

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

  const handleSignUp = async () => {
    try {
      // Ensure username is provided
      if (!username!.trim()) {
        setErrorUsername("Username is required");
        return;
      } else {
        setErrorUsername("");
        console.log(username);
        console.log("email is", email);
      }

      // Ensure email is provided
      //const emailValue = email?.trim(); // Trim the email to remove any leading/trailing spaces
      console.log("email is", email); // Log the value to verify it's being trimmed correctly
      if (!email!.trim()) {
        //console.log("email is", emailValue);
        setErrorEmail("Email is required");
        return;
      } else {
        console.log("email pass");
        setErrorEmail("");
      }
      console.log("email after Trim:", email); // Log to verify email value after trim
      console.log(email);
      // Ensure email format is valid
      if (!emailPattern.test(email!.trim())) {
        setErrorEmail("Please enter a valid email address (@)");
        return;
      } else {
        setErrorEmail("");
      }

      // Check if the username already exists
      await axios
        .post(`${URL}/auth/checkusername`, { username: username })
        .then((res) => {
          if (res.data.success) {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
          return;
        });

      // Check if the email already exists
      await axios
        .post(`${URL}/auth/checkemail`, { email: email })
        .then((res) => {
          if (res.data.success) {
            console.log(res);
          }
        })
        .catch((err) => {
          console.log(err);
          return;
        });

      // Ensure password is provided
      if (!password!.trim()) {
        setErrorPassword("Password is required");
        return;
      } else {
        setErrorPassword("");
      }

      // Ensure password confirmation is provided
      if (!passwordConfirmation!.trim()) {
        setErrorPasswordConfirmation("Password Confirmation is required");
        return;
      } else {
        setErrorPasswordConfirmation("");
      }

      // Ensure passwords match
      if (password !== passwordConfirmation) {
        setErrorPasswordConfirmation(
          "Password and Password Confirmation do not match"
        );
        return;
      } else {
        setErrorPasswordConfirmation("");
      }

      // Ensure terms are accepted
      if (!isAccepted) {
        router.push("/terms_and_con");
        return;
      }

      // Ensure password meets minimum length
      if (password && password.length < 8) {
        setErrorPassword("Password must be longer than 8 characters!");
        return;
      }

      // Start sending OTP after all validation passes
      setIsSending(true);
      const timeoutId = setTimeout(() => {
        setIsSending(false);
        alert("Sign Up is taking too long. Please try again later.");
      }, 5000);

      // Send OTP to the user's email
      const otpResponse = await SendOTPHandler(URL, { email: email! });
      if (otpResponse.success) {
        clearTimeout(timeoutId);
        setIsSending(false);
        setOtp(otpResponse.message);
        router.push("/OTP"); // Proceed to OTP page
      } else {
        clearTimeout(timeoutId);
        setIsSending(false);
        console.error(otpResponse.message);
      }
    } catch (error) {
      console.error(error);
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
          <ThemedText className="text-2xl font-bold w-full">Sign Up</ThemedText>

          {/* Username Input */}
          <ThemedInput
            value={username}
            autoComplete="username"
            title="Username"
            error={errorUsername}
            className="w-full"
            onChangeText={(text) => setUsername(text)}
          />

          {/* Email Input */}
          <ThemedInput
            value={email}
            autoComplete="email"
            title="Email"
            error={errorEmail}
            className="w-full"
            onChangeText={(text) => setEmail(text)}
          />

          {/* Password Input */}
          <ThemedInput
            autoComplete="password"
            title="Password"
            error={errorPassword}
            className="w-full"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />

          {/* Confirm Password Input */}
          <ThemedInput
            autoComplete="password"
            title="Confirm Password"
            error={errorPasswordConfirmation}
            className="w-full"
            onChangeText={(text) => setPasswordConfirmation(text)}
            secureTextEntry={true}
          />

          {/* Terms and Conditions CheckBox */}
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

          {/* Notification CheckBox */}
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
          {/* Sign Up Button */}
          <ThemedButton
            mode="confirm"
            className="w-[60%] h-14"
            onPress={handleSignUp}
            isLoading={isSending}
          >
            Sign Up
          </ThemedButton>

          {/* Sign In Button */}
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
