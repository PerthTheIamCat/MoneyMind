import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { SemiCircleProgress } from "@/components/SemiCircleProgress";

import { UserContext } from "@/hooks/conText/UserContext";

import { useEffect, useState, useContext } from "react";
import { useColorScheme, View } from "react-native";

import { Image } from "expo-image";
import { router } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
  const theme = useColorScheme();
  const { retire, notification } = useContext(UserContext);

  return (
    <ThemedSafeAreaView>
      <ThemedView className="w-full">
        {retire ? (
          <ThemedView className="w-full">
            <ThemedView className="flex-row !justify-between w-full px-4">
              <Image
                source={require("@/assets/logos/LOGO.png")}
                style={{
                  width: 50,
                  height: 50,
                  marginTop: "2%",
                  marginLeft: "5%",
                }}
              />
              <Ionicons
                onPress={() => router.push("/NotificationPage")}
                name="notifications-outline"
                size={32}
                color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
                style={{
                  alignSelf: "center",
                  marginTop: "5%",
                  marginRight: "5%",
                }}
              />
              {notification?.find((noti) => !noti.is_read) && (
                <View className="w-3 h-3 bg-red-500 absolute rounded-full right-10 animate-pulse" />
              )}
            </ThemedView>
            <ThemedView className="w-[80%] pt-5 !items-start">
              <ThemedText className="text-3xl font-bold">Retire</ThemedText>
            </ThemedView>
            <ThemedView>
              <ThemedText>You will need a total of money</ThemedText>
            </ThemedView>
            <ThemedView className="flex-row gap-5 !items-end py-5">
              <ThemedText className="text-5xl font-bold">
                {retire[0].netShortfallAtRetirement.toLocaleString("en-EN", {
                  maximumFractionDigits: 0,
                })}
              </ThemedText>
              <ThemedText className="pb-1 text-xl font-bold">Baht</ThemedText>
            </ThemedView>
            <ThemedView className="">
              <SemiCircleProgress
                strokeWidth={40}
                radius={150}
                savings_goal={retire?.[0].total_savings_goal}
                current_savings={retire?.[0].current_savings}
              />
            </ThemedView>
            <ThemedText>
              {retire?.[0].current_savings.toLocaleString("en-EN", {
                maximumFractionDigits: 0,
              })}
            </ThemedText>
            <ThemedView className="w-[70%] flex-row gap-5 !justify-start py-5">
              <View className="w-5 h-5 bg-green-700 rounded-md" />
              <ThemedText>Money already saved</ThemedText>
            </ThemedView>
            <ThemedView className="w-[70%] flex-row gap-5 !justify-start pb-5">
              <View className="w-5 h-5 bg-gray-300 rounded-md" />
              <ThemedText>Remaining money</ThemedText>
            </ThemedView>
            <ThemedView className="w-[80%] gap-5">
              <ThemedView className="flex-row w-full !justify-between !items-start">
                <ThemedText className="max-w-[60%]">
                  Already saved money
                </ThemedText>
                <ThemedText className="font-bold ">
                  {retire[0].current_savings.toLocaleString("en-EN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  Baht
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row w-full !justify-between !items-start">
                <ThemedText className="max-w-[60%]">
                  Money you need for retirement
                </ThemedText>
                <ThemedText className="font-bold ">
                  {retire[0].netShortfallAtRetirement.toLocaleString("en-EN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  Baht
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row w-full !justify-between !items-start">
                <ThemedText className="max-w-[60%]">Still need</ThemedText>
                <ThemedText className="font-bold ">
                  {(
                    retire[0].total_savings_goal - retire?.[0].current_savings
                  ).toLocaleString("en-EN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  Baht
                </ThemedText>
              </ThemedView>
              <ThemedView className="flex-row w-full !justify-between !items-start">
                <ThemedText className="max-w-[60%]">
                  Must save to retire according to plan per month
                </ThemedText>
                <ThemedText className="font-bold">
                  {retire[0].monthly_savings_goal.toLocaleString("en-EN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  Baht
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className="w-[80%] pt-5 flex-row !justify-around">
              <ThemedButton
                className="w-40 h-10 bg-yellow-500"
                onPress={() => router.push("/Retire_form")}
              >
                Calculate Again
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView>
            <ThemedView className="flex-row !justify-between w-full px-4">
              <Image
                source={require("@/assets/logos/LOGO.png")}
                style={{
                  width: 50,
                  height: 50,
                  marginTop: "2%",
                  marginLeft: "5%",
                }}
              />
              <Ionicons
                onPress={() => router.push("/NotificationPage")}
                name="notifications-outline"
                size={32}
                color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
                style={{
                  alignSelf: "center",
                  marginTop: "5%",
                  marginRight: "5%",
                }}
              />
              {notification?.find((noti) => !noti.is_read) && (
                <View className="w-3 h-3 bg-red-500 absolute rounded-full right-10 animate-pulse" />
              )}
            </ThemedView>
            <ThemedView className="w-[80%] pt-5">
              <ThemedText className="text-4xl font-bold w-full">
                Retire
              </ThemedText>
              <ThemedView className="pt-[40%] pb-10">
                <ThemedText className="text-lg">
                  You haven't filled information
                </ThemedText>
                <ThemedText className="text-lg">
                  To be taken into Calculate to plan for retirement
                </ThemedText>
              </ThemedView>
              <ThemedButton
                mode="confirm"
                className="px-14 py-3"
                textClassName="text-2xl"
                onPress={() => router.push("/Retire_form")}
              >
                PLAN
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
