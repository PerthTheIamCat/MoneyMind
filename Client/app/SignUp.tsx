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
            <ThemedView className="w-96 mt-5 px-5 gap-5">
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

              <ThemedView className="w-full">
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
                <ThemedText className="text-xl font-bold w-full">
                  Password
                </ThemedText>
                <ThemedView className="flex-row items-center bg-[#D9D9D9] rounded-xl p-2">
                  <TextInput
                    autoComplete="password"
                    className="flex-1 text-[#2F2F2F]"
                    secureTextEntry
                    onChangeText={setPassword}
                  />
                  <Entypo className="px-2" name="eye" size={24} color="black" />
                </ThemedView>
                {errorPassword ? (
                  <ThemedText className="text-red-500 w-full">
                    {errorPassword}
                  </ThemedText>
                ) : null}
              </ThemedView>

              <ThemedView className="w-full">
                <ThemedText className="text-xl font-bold w-full">
                  Confirm Password
                </ThemedText>
                <ThemedView className="flex-row items-center bg-[#D9D9D9] rounded-xl p-2">
                  <TextInput
                    autoComplete="password"
                    className="flex-1 text-[#2F2F2F]"
                    secureTextEntry
                    onChangeText={setPasswordConfirmation}
                  />
                  <Entypo className="px-2" name="eye" size={24} color="black" />
                </ThemedView>
                {errorPasswordConfirmation ? (
                  <ThemedText className="text-red-500 w-full">
                    {errorPasswordConfirmation}
                  </ThemedText>
                ) : null}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
