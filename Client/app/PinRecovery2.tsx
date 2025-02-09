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
import { SignUpHandler } from "@/hooks/auth/SignUpHandler";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { SendOTPHandler } from "@/hooks/auth/SendOTPHandler";
import { VerifyOTPHandler } from "@/hooks/auth/VerifyOTP";

const OTP_LENGTH = 6;

export default function PinRecovery() {
  const theme = useColorScheme();
  const { email, URL, password, passwordConfirmation, username } = useContext(ServerContext);
  const auth = useContext(AuthContext);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>([]);
  const [resendTimeout, setResendTimeout] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<"success" | "sending" | "fail" | null>("success");

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
    console.log(otp);
  };

  const resendOTPHandler = () => {
    setIsSending("sending");
    const timeout = setTimeout(() => {
      setIsSending("fail");
      alert("Failed to send OTP please try again later");
    }, 5000);
    SendOTPHandler(URL, { email: email! }).then((response) => {
      if (response.success) {
        clearTimeout(timeout);
        setIsSending("success");
      } else {
        clearTimeout(timeout);
        setIsSending("fail");
        alert("Failed to send OTP please try again later");
        console.error(response.message);
      }
    });
  };

  const VerifyHandler = () => {
    const timeout = setTimeout(() => {
      setIsVerifying(false);
      alert("Failed to verify OTP please try again later");
    }, 5000);
    console.log("otp:",otp.join(""));
    setIsVerifying(true);
    VerifyOTPHandler(URL, {
      email: email!,
      otp: otp.join(""),
    }).then((response) => {
      if (response.success) {
        console.log(response);
        setIsVerifying(false);
        clearTimeout(timeout);
        router.replace("/CreatePinPage");
      } else {
        setIsVerifying(false);
        clearTimeout(timeout);
        alert(response.message);
        console.error(response.message);
      }
    });
  };

  const setTimer = () => {
    setResendTimeout(60);
    const timer = setInterval(() => {
      setResendTimeout((prev) => (prev !== null ? prev - 1 : 0));
      if (resendTimeout === 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  useEffect(() => {
    if (resendTimeout === null) {
      setTimer();
    }
  }, []);

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
          <ThemedView style={styles.container}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref!)}
                style={[
                  styles.otpInput,
                  { borderBottomColor: focusedIndex === index || otp[index] !== "" ? "#4CAF50" : "grey" },
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
        </ThemedView>
        <ThemedView className="flex-row mt-5 w-[80%] h-10">
          <ThemedButton
            className="w-[90%] h-10 mt-10"
            mode="confirm"
            onPress={VerifyHandler}
            isLoading={isVerifying}
          >
            Verify OTP
          </ThemedButton>
        </ThemedView>
        <ThemedView className="mt-10 flex-row gap-10">
          <ThemedText>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={[styles.edit]}>Edit email address?</ThemedText>
            </TouchableOpacity>
          </ThemedText>
          <ThemedText>
            <TouchableOpacity onPress={resendOTPHandler} disabled={(resendTimeout ?? 0) > 0}>
              <ThemedText style={[styles.resend]}>
                Resend OTP {(resendTimeout ?? 0) > 0 ? `in ${resendTimeout} seconds` : ""}
              </ThemedText>
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
    fontSize: 13,
  },
  resend: {
    textDecorationLine: "underline",
    textAlign: "right",
    fontSize: 13,
    color: "#4CAF50",
  },
});

