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

export default function General() {
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
        
    </ThemedSafeAreaView>
  );
} 