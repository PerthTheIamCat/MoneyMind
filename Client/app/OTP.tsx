import React, { useState, useContext, useEffect } from "react";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { SendOTPHandler } from "@/hooks/auth/SendOTPHandler";
import { SignUpHandler } from "@/hooks/auth/SignUpHandler";

export default function OTP() {
  const { email, URL, password, passwordConfirmation, username } =
    useContext(ServerContext);
  const [otp, setOtp] = useState<string>("");
  const [isSending, setIsSending] = useState<
    "success" | "sending" | "fail" | null
  >("success");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendTimeout, setResendTimeout] = useState<number | null>(null);

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

    setIsVerifying(true);
    SignUpHandler(URL, {
      email: email!,
      username: username!,
      password: password!,
      password2: passwordConfirmation!,
      name: username!,
      otp: otp,
    }).then((response) => {
      if (response.success) {
        setIsVerifying(false);
        clearTimeout(timeout);
        router.replace("/(tabs)");
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
      <ThemedView>
        <ThemedText className="text-2xl font-bold pt-10">
          Verify Your Email
        </ThemedText>
        <ThemedView className="h-28 w-[80%] !bg-[#D9D9D9] rounded-xl mt-5">
          {isSending === "sending" ? (
            <ThemedView className="flex flex-row bg-transparent">
              <ThemedText className="text-lg !text-[#2F2F2F]">
                Status :
              </ThemedText>
              <ThemedText
                key="SendingOTP"
                className="bg-[#ffa33e] p-2 rounded-xl transition-all animate-pulse !text-[#2F2F2F]"
              >
                Sending...
              </ThemedText>
            </ThemedView>
          ) : isSending === "success" ? (
            <ThemedView className="flex flex-row bg-transparent">
              <ThemedText className="text-lg !text-[#2F2F2F]">
                Status :
              </ThemedText>
              <ThemedText
                key="SendingOTPSuccess"
                className="bg-[#2B9348] p-2 rounded-xl !text-[#F2F2F2]"
              >
                success
              </ThemedText>
            </ThemedView>
          ) : isSending === "fail" ? (
            <ThemedView className="flex flex-row bg-transparent">
              <ThemedText className="text-lg !text-[#2F2F2F]">
                Status :
              </ThemedText>
              <ThemedText
                key="SendingOTPFail"
                className="bg-[#C93540] p-2 rounded-xl !text-[#F2F2F2]"
              >
                Failed
              </ThemedText>
            </ThemedView>
          ) : null}
          <ThemedText className="text-lg !text-[#2F2F2F]">{email}</ThemedText>
        </ThemedView>
        <ThemedButton
          mode={(resendTimeout ?? 0) > 0 ? "normal" : "confirm"}
          className="mt-5 w-[80%] h-14"
          onPress={() => {
            resendOTPHandler();
            setTimer();
          }}
          isLoading={isSending === "sending"}
          disabled={(resendTimeout ?? 0) > 0}
        >
          Resend OTP{" "}
          {resendTimeout && resendTimeout > 0
            ? `in ${resendTimeout} seconds`
            : ""}
        </ThemedButton>
        <ThemedView className="w-[80%] h-60 mt-5 border-2 border-[#D9D9D9] rounded-xl">
          <ThemedText className="text-lg font-bold mt-5">
            Enter the OTP
          </ThemedText>
          <ThemedInput
            placeholder="Enter the OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            className="w-[80%] h-10 mt-5 border-2 border-[#D9D9D9] rounded-xl"
          />
        </ThemedView>
        <ThemedView className="w-[80%] h-60 mt-5 flex-row gap-5">
          <ThemedButton
            className="mt-5 w-[50%] h-14"
            onPress={() => router.back()}
          >
            back
          </ThemedButton>
          <ThemedButton
            mode="confirm"
            className="mt-5 w-[50%] h-14"
            onPress={VerifyHandler}
          >
            Verify
          </ThemedButton>
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
