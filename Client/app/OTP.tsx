import React, { useState, useContext } from "react";
import { Text } from "react-native";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ServerContext } from "@/hooks/auth/ServerConText";

export default function OTP() {
  const { email } = useContext(ServerContext);
  const [otp, setOtp] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedText className="text-2xl font-bold pt-10">
          Verify Your Email
        </ThemedText>
        <ThemedView className="h-28 w-[80%] !bg-[#D9D9D9] rounded-xl mt-5">
          {isSending ? (
            <ThemedView className="flex flex-row bg-transparent">
              <ThemedText className="text-lg !text-[#2F2F2F]">
                Status :
              </ThemedText>
              <Text className="bg-[#ffa33e] p-2 rounded-xl transition-all animate-pulse">Sending...</Text>
            </ThemedView>
          ) : (
            <ThemedView className="flex flex-row bg-transparent">
              <ThemedText className="text-lg !text-[#2F2F2F]">
                Status :
              </ThemedText>
              <Text className="bg-[#aacc00] p-2 rounded-xl transition-all">Success</Text>
            </ThemedView>
          )}
          <ThemedText className="text-lg !text-[#2F2F2F]">{email}</ThemedText>
        </ThemedView>
        <ThemedView className="w-[80%] h-60 mt-5 border-2 border-[#D9D9D9] rounded-xl">
          <ThemedText className="text-lg font-bold mt-5">
            Enter the OTP
          </ThemedText>
          <ThemedInput
            title=""
            placeholder="Enter the OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            className="w-[80%] h-10 mt-5 border-2 border-[#D9D9D9] rounded-xl"
          />
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
