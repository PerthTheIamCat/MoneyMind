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
              width: width < 400 ? 200 : 300,
              height: width < 400 ? 300 : 400,
              marginTop: width < 400 ? 0 : 20,
            }}
            contentFit="contain"
            onTouchStart={() => router.replace("/(tabs)")}
          />
          <ThemedView className="!items-start w-full px-6 text-center pl-10">
            <ThemedText
              className="text-5xl mb-10 !text-[#55A630]"
              style={{ fontSize: width < 400 ? 36 : 48 }}
            >
              MoneyMind
            </ThemedText>
            <ThemedText
              className="text-wrap font-bold !text-[#AACC00]"
              style={{
                fontSize: width < 400 ? 19 : 24,
                maxWidth: width < 400 ? 180 : 200,
              }}
            >
              Unlock Your Financial Dreams Empowering Your Journey to Wealth and
              Freedom
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row gap-5 w-full justify-center mt-28 mb-10">
            <ThemedButton
              style={{
                width: width < 400 ? 150 : 180,
                height: width < 400 ? 45 : 55,
              }}
              mode="normal"
              onPress={() => router.push("/SignIn")}
            >
              Sign In
            </ThemedButton>
            <ThemedButton
              style={{
                width: width < 400 ? 150 : 180,
                height: width < 400 ? 45 : 55,
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
