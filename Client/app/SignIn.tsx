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

  const [showPassword, setShowPassword] = useState(false); // เพิ่มสถานะสำหรับการเปิด/ปิดการแสดงรหัสผ่าน

  const validateInputs = () => {
    let valid = true;
    setErrorUsername("");
    setErrorPassword("");

    // Check if username and password are empty
    if (username.trim().length === 0) {
      setErrorUsername("Please fill in all fields");
      valid = false;
    } else if (username.trim().length < 3) {
      setErrorUsername("Username must be at least 3 characters");
      valid = false;
    }

    if (password.trim().length === 0) {
      setErrorPassword("Please fill in all fields");
      valid = false;
    } else if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
      valid = false;
    }
    return valid;
  };

  const handleSignIn = () => {
    if (!validateInputs()) {
      return;
    }
    router.push("/SignIn");
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
              style={{ width: 150, height: 150, marginTop: 70 }}
            />
            <ThemedView className="w-96 mt-5 px-5 gap-5">
              <ThemedText className="text-2xl font-bold w-full text-start">
                Sign Up
              </ThemedText>

              <ThemedView className="w-full">
                <ThemedText className="text-xl font-bold w-full">
                  Username
                </ThemedText>
                <TextInput
                  className="h-10 bg-[#D9D9D9] rounded-xl p-2 w-full"
                  onChangeText={setUsername}
                />
                {errorUsername && (
                  <ThemedText className="text-red-500 w-full">
                    {errorUsername}
                  </ThemedText>
                )}
              </ThemedView>

              <ThemedView className="w-full">
                <ThemedText className="text-xl font-bold w-full">
                  Password
                </ThemedText>
                <ThemedView className="flex-row h-10 bg-[#D9D9D9] rounded-xl p-2 w-full">
                  <TextInput
                    className="flex-1 h-10 py-1"
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

              <ThemedButton
                mode="confirm"
                onPress={() => {
                  router.push("/SignIn");
                  handleSignIn();
                }}
                className="mt-56 w-[300px]"
              >
                Sign In
              </ThemedButton>
              <ThemedButton
                mode="normal"
                onPress={() => router.push("/SignUp")}
                className=" w-[300px]"
              >
                Sign Up
              </ThemedButton>
              <ThemedText className="text-center text-[#969393] w-full mt-0">
                Forgot Password?
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
