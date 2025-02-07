import React, { useEffect, useState, useContext, useRef } from "react";
import { Alert, StyleSheet, TextInput, useColorScheme } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";


const OTP_LENGTH = 6;

export default function PinRecovery() {
  const theme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const auth = useContext(AuthContext);

  const OTPInput: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputRefs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
      if (/^\d$/.test(text)) {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input
        if (index < OTP_LENGTH - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      } else if (text === "") {
        // Handle backspace
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    };

    return (
      <ThemedView style={styles.container}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref!)}
            style={[
              styles.otpInput,
              { borderColor: otp[index] !== "" || focusedIndex === index ? "#4CAF50" : "grey" },
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
        ))}
      </ThemedView>
    );
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
          <ThemedText style={styles.greetings}>
            Email Verification
          </ThemedText>
          <ThemedText style={styles.explain} className="justify-center">
            OTP will send into your email address please go check your email to proceed.
          </ThemedText>
        </ThemedView>
        <ThemedView className="w-[80%] mt-5 px-5 gap-5">
          <OTPInput />
        </ThemedView>
        <ThemedView className="flex-row mt-5 w-[80%] h-10">
          <ThemedButton
            className="w-[90%] h-10 mt-10"
            mode="confirm"
            onPress={() => router.push("/")}
          >
            Verify OTP
          </ThemedButton>
        </ThemedView>
        <ThemedView className="mt-10 flex-row gap-32">
            <ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <ThemedText style={[styles.edit]}>Edit email address?</ThemedText>
                </TouchableOpacity>
            </ThemedText>
            <ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <ThemedText style={[styles.resend]}>Resend</ThemedText>
                </TouchableOpacity>
            </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  greetings: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  explain: {
    fontSize: 14,
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  edit: {
    textDecorationLine: "underline",
    textAlign: "left",
    fontSize : 13
  },
  resend: {
    textDecorationLine: "underline",
    textAlign : "right",
    fontSize : 13 ,
    color : "#4CAF50"
  }
});

