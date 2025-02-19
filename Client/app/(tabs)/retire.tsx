import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/hooks/conText/UserContext";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useColorScheme } from "react-native";



export default function Index() {
  const theme = useColorScheme();
  const { retire } = useContext(UserContext);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        {retire && <ThemedView></ThemedView>}
        <ThemedView className="flex-row !justify-between w-full px-4">
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={{ width: 79, height: 70, marginTop: "2%", marginLeft: "5%" }}
          />
          <Ionicons
            onPress={() => router.push("/Add_Transaction")}
            name="notifications-outline"
            size={32}
            color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
            style={{ alignSelf: "center", marginTop: "5%", marginRight: "5%" }}
          />
        </ThemedView>
        <ThemedView className="w-[80%] pt-5">
          <ThemedText className="text-4xl font-bold w-full">Retire</ThemedText>
          <ThemedView className="pt-[40%] pb-10">
            <ThemedText className="text-lg">You haven't filled information</ThemedText>
            <ThemedText className="text-lg">To be taken into Calculate to plan for retirement</ThemedText>
          </ThemedView>
          <ThemedButton mode="confirm" className="px-14 py-3" textClassName="text-2xl" onPress={() => router.push("/Retire_form")}>PLAN</ThemedButton>
        </ThemedView>

      </ThemedView>
    </ThemedSafeAreaView>
  );
}
