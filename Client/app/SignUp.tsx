import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
} from "react-native";
import { useColorScheme } from "react-native";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedCheckBox } from "@/components/ThemedCheckBox";
import { router } from "expo-router";

export default function Index() {
  const theme = useColorScheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorPasswordConfirmation, setErrorPasswordConfirmation] =
    useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const validateInputs = () => {
    let valid = true;
    setErrorUsername("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorPasswordConfirmation("");

    if (username.trim().length === 0) {
      setErrorUsername("Please fill in all fields");
      valid = false;
    } else if (username.trim().length < 3) {
      setErrorUsername("Username must be at least 3 characters");
      valid = false;
    }
    if (email.trim().length === 0) {
      setErrorEmail("Please fill in all fields");
      valid = false;
    } else if (!email.includes("@")) {
      setErrorEmail("Invalid email address");
      valid = false;
    }

    if (password.trim().length === 0) {
      setErrorPassword("Please fill in all fields");
      valid = false;
    } else if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
      valid = false;
    }

    if (passwordConfirmation.trim().length === 0) {
      setErrorPasswordConfirmation("Please fill in all fields");
      valid = false;
    } else if (passwordConfirmation !== password) {
      return valid;
    }
  };

  const handleSignUp = () => {
    if (!validateInputs()) {
      return;
    }
    router.push("/SignUp");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#2F2F2F]" : "bg-[#F2F2F2]"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView>
            <Image
              source={require("@/assets/logos/LOGO.png")}
              style={{
                width: 150,
                height: 150,
                marginTop: 70,
              }}
            />
            <ThemedView className="w-96 mt-5 px-5 gap-2">
              <ThemedText className="text-2xl font-bold w-full text-start">
                Sign Up
              </ThemedText>

              <ThemedView className="w-full">
                <ThemedText className="text-xl font-bold w-full">
                  Username
                </ThemedText>
                <TextInput
                  autoComplete="username"
                  className="h-10 bg-[#D9D9D9] text-[#2F2F2F] rounded-xl p-2 w-full"
                  onChangeText={setUsername}
                />
                {errorUsername ? (
                  <ThemedText className="text-red-500 w-full">
                    {errorUsername}
                  </ThemedText>
                ) : null}
              </ThemedView>

              <ThemedView className="w-full ">
                <ThemedText className="text-xl font-bold w-full">
                  Email
                </ThemedText>
                <TextInput
                  autoComplete="email"
                  className="h-10 bg-[#D9D9D9] text-[#2F2F2F] rounded-xl p-2 w-full"
                  onChangeText={setEmail}
                />
                {errorEmail ? (
                  <ThemedText className="text-red-500 w-full">
                    {errorEmail}
                  </ThemedText>
                ) : null}
              </ThemedView>

              <ThemedView className="w-full">
                <ThemedText className="text-xl  font-bold w-full">
                  Password
                </ThemedText>
                <ThemedView className="flex-row h-10 items-center !bg-[#D9D9D9] rounded-xl p-2">
                  <TextInput
                    autoComplete="password"
                    className="flex-1 h-10 py-1 text-[#2F2F2F]"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                  />
                  <Entypo
                    className="px-2"
                    name={showPassword ? "eye-with-line" : "eye"}
                    size={20}
                    color="black"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                </ThemedView>
                {errorPassword && (
                  <ThemedText className="text-red-500 w-full">
                    {errorPassword}
                  </ThemedText>
                )}
              </ThemedView>

              <ThemedView className="w-full">
                <ThemedText className="text-xl font-bold w-full">
                  Confirm Password
                </ThemedText>
                <ThemedView className="flex-row h-10 items-center !bg-[#D9D9D9] rounded-xl p-2">
                  <TextInput
                    autoComplete="password"
                    className="flex-1 h-10 py-1 text-[#2F2F2F]"
                    secureTextEntry={!showPassword}
                    onChangeText={setPasswordConfirmation}
                  />
                  <Entypo
                    className="px-2"
                    name={showPassword ? "eye-with-line" : "eye"}
                    size={20}
                    color="black"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                </ThemedView>
                {errorPasswordConfirmation && (
                  <ThemedText className="text-red-500 w-full">
                    {errorPasswordConfirmation}
                  </ThemedText>
                )}
              </ThemedView>
              <ThemedView className="w-full flex-row justify-between items-center mt-4">
                <ThemedCheckBox />
                <ThemedText className="text-16px  ml-3">Iagree our</ThemedText>
                <ThemedText className="text-16px  w-full ml-3 underline">
                  term of service
                </ThemedText>
              </ThemedView>
              <ThemedView className="w-full flex-row justify-between items-center">
                <ThemedCheckBox />
                <ThemedText className="text-16px w-full ml-3">
                  receive notification on email
                </ThemedText>
              </ThemedView>
              <ThemedButton
                mode="confirm"
                onPress={handleSignUp}  
                className=" w-[80%] h-14  mt-14"
              >
                Sign Up
              </ThemedButton>
              <ThemedButton
                mode="normal"
                onPress={() => router.push("/SignIn")}
                className="w-[80%] h-14"
              >
                Sign In
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
