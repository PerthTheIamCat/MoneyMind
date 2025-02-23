import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { useContext } from "react";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { View, TouchableOpacity, Text, Pressable, ScrollView } from "react-native";
import { useColorScheme } from "react-native";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedCard } from "@/components/ThemedCard";
import { UserContext } from "@/hooks/conText/UserContext";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

export default function Setting() {
  const auth = useContext(AuthContext);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  // สีขององค์ประกอบใน Dark Mode
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const selectedColor = isDarkMode ? "bg-green-500" : "bg-green-600";
  const unselectedColor = isDarkMode ? "bg-gray-500" : "bg-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";

  return (
    <ThemedSafeAreaView>

      {/* Header */}
      <ThemedText className={`mx-5 text-[24px] font-bold pt-[10%] ${textColor}`}>
        Setting
      </ThemedText>

      {/* Profile Account Setting */}


      {/* Notification */}


      {/* Change Pin */}


      {/* Icon Transaction */}


      {/* Logout */}
      <ThemedView>
        <ThemedButton
          className="w-[330] h-[42] bg-slate-300 rounded-md "
          mode="cancel"
          textClassName="text-[20px] font-bold"
          onPress={() => {
            auth?.logout();
            router.replace("/Welcome");
          }}
        >
          Logout
        </ThemedButton>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
