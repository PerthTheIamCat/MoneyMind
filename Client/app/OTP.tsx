import React, { useState, useContext, useEffect, useRef } from "react";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { SendOTPHandler } from "@/hooks/auth/SendOTPHandler";
import { SignUpHandler } from "@/hooks/auth/SignUpHandler";
import { TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { UserContext } from "@/hooks/conText/UserContext";
import axios from "axios";
import { GetUserBank } from "@/hooks/auth/GetUserBank";

const OTP_LENGTH = 6;

export default function OTP() {
  const { email, URL, password, passwordConfirmation, username } =
    useContext(ServerContext);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isSending, setIsSending] = useState<
    "success" | "sending" | "fail" | null
  >("success");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendTimeout, setResendTimeout] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const auth = useContext(AuthContext);
  const { setBank } = useContext(UserContext);

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
        console.log(response.message);
      }
    });
  };

  const VerifyHandler = () => {
    const timeout = setTimeout(() => {
      setIsVerifying(false);
      alert("Failed to verify OTP please try again later");
    }, 5000);

    setIsVerifying(true);
    SignUpHandler(URL, {
      email: email!,
      username: username!,
      password: password!,
      password2: passwordConfirmation!,
      name: username!,
      otp: otp.join(""),
    }).then(async (response) => {
      if (response.success) {
        setIsVerifying(false);
        auth?.setToken(response.accessToken);
        clearTimeout(timeout);
        console.log("User created");
        const user_id = await auth?.decodeToken(response.accessToken).UserID;
        try {
          console.log("Sending request to create bank account", {
            user_id: user_id!,
          });

          const result = await axios.post(
            `${URL}/bankaccounts/retirement`,
            {
              user_id: user_id!,
            },
            {
              headers: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            }
          );

          console.log("Response received:", result.data);

          if (result.data.success) {
            console.log("Bank account created");
            await GetUserBank(URL, user_id!, response.accessToken).then(
              (response) => {
                if (response.success) {
                  setBank(response.result);
                  console.log("get bank success:", response.result);
                } else {
                  console.log("get bank failed:", response.message);
                }
              }
            );
            router.push("/CreatePinPage");
          } else {
            console.log("API returned an error:", result.data);
            alert(result.data.message);
          }
        } catch (error) {
          console.log("Error in axios.post:", error);
          alert("An error occurred while creating the bank account.");
        }
      } else {
        setIsVerifying(false);
        clearTimeout(timeout);
        alert(response.message);
        console.log(response.message);
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
          <ThemedText style={styles.greetings}>Email Verification</ThemedText>
          <ThemedText style={styles.explain} className="justify-center">
            OTP will be sent to your email address. Please check your email to
            proceed.
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
                  {
                    borderBottomColor:
                      focusedIndex === index || otp[index] !== ""
                        ? "#4CAF50"
                        : "grey",
                  },
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
        <ThemedView className="mt-10 flex-row gap-24">
          <ThemedText>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={[styles.edit]}>Edit email address?</ThemedText>
            </TouchableOpacity>
          </ThemedText>
          <ThemedText>
            <TouchableOpacity
              onPress={resendOTPHandler}
              disabled={(resendTimeout ?? 0) > 0}
            >
              <ThemedText style={[styles.resend]}>
                Resend OTP{" "}
                {(resendTimeout ?? 0) > 0 ? `in ${resendTimeout} seconds` : ""}
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
