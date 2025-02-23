import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router } from "expo-router";
import { Image } from "expo-image";
import { View, TouchableOpacity, Text, Pressable, ScrollView } from "react-native";
import { useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedCard } from "@/components/ThemedCard";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";
import { Animated, Easing } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";


export default function SplitPay() {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";

  const [selected, setSelected] = useState("budget");
  const [accountCheck, setAccount] = useState(false);
  const [cloudpocketCheck, setCloudPocket] = useState(false);
  const { bank } = useContext(UserContext);
  const [isBudget, setIsBudget] = useState(true);
  

  return (
    <ThemedSafeAreaView>
      <ThemedView >
      <ThemedView className="flex-row !items-center !justify-between w-full px-4">
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={{
              width: 79,
              height: 70,
              marginTop: "2%",
              marginLeft: "5%",
            }}
          />
          <Ionicons
            onPress={() => router.push("/NotificationPage")}
            name="notifications-outline"
            size={32}
            color={`${componentIcon}`}
            style={{
              alignSelf: "center",
              marginTop: "5%",
              marginRight: "5%",
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-full h-10 justify-center bg-transparent p-1 mt-6 mb-4">
        <ThemedView className="flex-row w-72 h-10 rounded-full bg-[#d5d5d5]">
        <Pressable
          onPress={() => setIsBudget(true)}
          className={`w-32 h-full flex items-center justify-center rounded-full ${
            isBudget ? "bg-green-500 w-40" : "bg-transparent w-32"
          }`}
        >
          <ThemedText
            className={`font-bold ${
              isBudget ? "text-white" : isDarkMode ? "text-white" : "text-black"
            }`}
          >
            BUDGET
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setIsBudget(false)}
          className={`w-32 h-full flex items-center justify-center rounded-full ${
            !isBudget ? "bg-green-500 w-40" : "bg-transparent w-32"
          }`}
        >
          <ThemedText
            className={`font-bold ${
              !isBudget ? "text-white" : isDarkMode ? "text-white" : "text-black"
            }`}
          >
            RETIRE
          </ThemedText>
        </Pressable>
      </ThemedView>
      </ThemedView>


      </ThemedView>
      

    </ThemedSafeAreaView>
  );
}
