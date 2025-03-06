import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Pressable } from "react-native";
import { useColorScheme } from "react-native";
import { ThemedCard } from "@/components/ThemedCard";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";
import { Animated, Easing } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconTransaction() {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const [editIcons, setIcons] = useState(true);


  // สีขององค์ประกอบใน Dark Mode
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const selectedColor = isDarkMode ? "bg-green-500" : "bg-green-600";
  const unselectedColor = isDarkMode ? "bg-gray-500" : "bg-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";

  return (
    <ThemedSafeAreaView>
      {/* Heading Scroll */}
      <ThemedView>
        <ThemedView className="flex-row w-full h-10 justify-center bg-transparent p-1 mt-6 mb-4">
          <ThemedView className="flex-row w-72 h-10 rounded-full bg-[#d5d5d5]">
            <Pressable
              onPress={() => setIcons(true)}
              className={`w-32 h-full flex items-center justify-center rounded-full ${
              editIcons ? "bg-red-400 w-40" : "bg-transparent w-32"
            }`}
            >
              <ThemedText
                className={`font-bold ${
                  editIcons ? "text-white" : isDarkMode ? "text-white" : "text-black"
                }`}
              >
              OUTCOME
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setIcons(false)}
              className={`w-32 h-full flex items-center justify-center rounded-full ${
                !editIcons ? "bg-red-400 w-40" : "bg-transparent w-32"
              }`}
            >
              <ThemedText
                className={`font-bold ${
                  !editIcons ? "text-white" : isDarkMode ? "text-white" : "text-black"
                }`}
              >
              INCOME
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        <ThemedView>
          
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
  );
} 