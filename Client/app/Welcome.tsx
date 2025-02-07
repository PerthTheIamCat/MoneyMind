import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext } from "react";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { useWindowDimensions } from "react-native";

export default function Welcome() {
  const auth = useContext(AuthContext);
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 500; // ตรวจสอบว่าจอใหญ่กว่า 600px หรือไม่

  return (
    <ThemedSafeAreaView>
      <ThemedScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 5,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView className="items-center w-full ">
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={{
              width: isLargeScreen ? 400 : width < 380 ? 200 : 250,
              height: isLargeScreen ? 500 : width < 380 ? 300 : 350,
            }}
            contentFit="contain"
            onTouchStart={() => router.replace("/(tabs)")}
          />
          <ThemedView className="!items-start w-full px-6 text-center pl-10">
            <ThemedText
              className="text-5xl mb-10 !text-[#55A630]"
              style={{ fontSize: isLargeScreen ? 56 : width < 380 ? 32 : 46 }}
            >
              MoneyMind
            </ThemedText>
            <ThemedText
              className="text-wrap font-bold !text-[#AACC00]"
              style={{
                fontSize: isLargeScreen ? 30 : width < 380 ? 16: 24,
                maxWidth: isLargeScreen ? 250 : width < 380 ? 160 : 200,
              }}
            >
              Unlock Your Financial Dreams Empowering Your Journey to Wealth and Freedom
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row gap-5 w-full justify-center mt-28 mb-10">
            <ThemedButton
              style={{
                width: isLargeScreen ? 200 : width < 380 ? 140 : 160,
                height: isLargeScreen ? 60 : width < 380 ? 40 : 50,
              }}
              mode="normal"
              onPress={() => router.push("/SignIn")}
            >
              Sign In
            </ThemedButton>
            <ThemedButton
              style={{
                width: isLargeScreen ? 170 : width < 380 ? 140 : 160,
                height: isLargeScreen ? 60 : width < 380 ? 40 : 50,
              }}
              mode="confirm"
              onPress={() => router.push("/SignUp")}
            >
              Sign Up
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </ThemedScrollView>
    </ThemedSafeAreaView>
  );
}
