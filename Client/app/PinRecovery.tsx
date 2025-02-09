import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useContext } from "react";
import { Alert, StyleSheet, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { Image } from "expo-image";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { SendOTPHandler } from "@/hooks/auth/SendOTPHandler";

export default function PinRecovery() {
  const [OTP, setOTP] = useState<number[]>([]);
  const theme = useColorScheme();
  const opt = Array(6).fill(0);
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState<"success" | "sending" | "fail" | null>(null);

  

  const handleSendOTP = () => {
    setIsSending("sending");
    SendOTPHandler(URL, { email })
      .then((response) => {
        if (response.success) {
          setIsSending("success");
          Alert.alert("Success", "OTP sent to your email address.");
          router.push("/PinRecovery2");
        } else {
          setIsSending("fail");
          Alert.alert("Error", "Failed to send OTP. Please try again.");
          console.error(response.message);
        }
      })
      .catch((error) => {
        setIsSending("fail");
        Alert.alert("Error", "Failed to send OTP. Please try again.");
        console.error(error);
      });
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView className="!justify-start !items-start w-full px-5 mt-5">
        <Ionicons name="arrow-back-outline" size={32} color="black" onPress={() => router.back()} />
      </ThemedView>
      <ThemedView className="my-5">
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width: 200,
            height: 200,
            marginTop: 40,
          }}
        />
        <ThemedView className="flex-column mt-5 w-[75%]">
          <ThemedText style={theme === "dark" ? styles.greetingsDark : styles.greeetingsLight}>
            Email Verification
          </ThemedText>
          <ThemedText style={theme === "dark" ? styles.explainDark : styles.explainLight} className="justify-center">
            OTP will be sent to your email address. Please check your email to proceed.
          </ThemedText>
        </ThemedView>
        <ThemedView className="w-[80%] mt-5 px-5 gap-5">
          <ThemedInput
            className="w-full"
            title="Enter your email"
            placeholder="example@money.com"
            value={email}
            onChangeText={setEmail}
          />
        </ThemedView>
        <ThemedView className="flex-row mt-5 w-[80%]">
          <ThemedButton
            className="w-[90%] h-10"
            mode="confirm"
            onPress={() => {
              handleSendOTP();
              router.push("/PinRecovery2");
            }}
            isLoading={isSending === "sending"}
            disabled={isSending === "sending"}
          >
            Send OTP
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  greetingsDark: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "center",
    color: "white",
  },
  explainDark: {
    fontSize: 14,
    textAlign: "center",
    color: "white",
  },
  greeetingsLight: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "center",
    color: "black",
  },
  explainLight: {
    fontSize: 14,
    textAlign: "center",
    color: "black",
  },
});