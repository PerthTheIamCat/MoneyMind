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
import { SignUpHandler } from "@/hooks/auth/SignUpHandler";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {

  // Use the useColorScheme hook to get the current color scheme
  const theme = useColorScheme();
  
  // Use the useState hook to create state variables
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
 
  // Create state variables for error messages
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorPasswordConfirmation, setErrorPasswordConfirmation] = useState<string>("");

  // Use the useContext hook to get the setIsAccepted function from the TermsContext
  const { URL , setUsername, setEmail, username, email } = useContext(ServerContext);
  const { isAccepted, setIsAccepted } = useContext(TermsContext);
  const [isCheckedNotification, setIsCheckedNotification] = useState<boolean>(false);

  const handleSignUp = () => {
    try {
      if (username === "") {
        setErrorUsername("Username is required");
        return;
      } else {
        setErrorUsername("");
      }
      if (email === "") {
        setErrorEmail("Email is required");
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
        setErrorPasswordConfirmation("Password and Password Confirmation do not match");
        return;
      } else {
        setErrorPasswordConfirmation("");
      }
      if (!isAccepted) {
        router.push("/terms_and_con");
        return;
      }
      SignUpHandler(URL,{ username: username!, email: email!, password:password!, password2: passwordConfirmation!}).then((response) => {
        if (response.success) {
          console.log(response);
          router.replace("/(tabs)");
        } else {
          console.error(response);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

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
            Sign Up
          </ThemedText>
          <ThemedInput
            autoComplete="username"
            title="Username"
            error={errorUsername}
            className="w-full"
            onChangeText={(text) => setUsername(text)}
          />
          <ThemedInput
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
          <ThemedButton mode="confirm" className="w-[60%] h-14" onPress={handleSignUp}>
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
