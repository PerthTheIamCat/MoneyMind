import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { router } from "expo-router";
import { Pressable } from "react-native";
import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import { useContext } from "react";
import { View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";


export default function IconTransaction() {
  const auth = useContext(AuthContext);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const [outcome, income] = useState(true);
  const [editIcons, setIcons] = useState(true);

  // สีขององค์ประกอบใน Dark Mode
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";
  const logoutColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";
  
  return (
    <ThemedSafeAreaView>
      <ThemedView>
        {/* Heading Scroll */}
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
        {/* Edit Icon */}
        <View className="mt-5 space-y-3 mx-4">
            <ThemedButton
              className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
              mode="normal"
              onPress={() => router.push("../")}
            >
              
              <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
                ข้าว
              </ThemedText>
              <MaterialIcons name="edit" size={22} color="#555" />
            </ThemedButton>
            
            <ThemedButton
              className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
              mode="normal"
              onPress={() => router.push("../")}
            >
              
              <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
                ข้าว
              </ThemedText>
              <MaterialIcons name="edit" size={22} color="#555" />
            </ThemedButton>
            
            <ThemedButton
              className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
              mode="normal"
              onPress={() => router.push("../")}
            >
              
              <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
                ข้าว
              </ThemedText>
              <MaterialIcons name="edit" size={22} color="#555" />
            </ThemedButton>
        </View>
      </ThemedView>
    </ThemedSafeAreaView>
  );
} 