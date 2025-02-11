import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { router } from "expo-router";
import { Image } from "expo-image";
import { View, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SplitPay2() {
    const theme = useColorScheme();
    const isDarkMode = theme === "dark";
  
    // สีขององค์ประกอบใน Dark Mode
    const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
    const selectedColor = isDarkMode ? "bg-green-500" : "bg-green-600";
    const unselectedColor = isDarkMode ? "bg-gray-500" : "bg-gray-300";
    const textColor = isDarkMode ? "text-white" : "text-black";
    const componentColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
    const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";
  
    const [selected, setSelected] = useState("budget");
  
    return (
      <ThemedSafeAreaView>
  
        {/* Header */}
        <ThemedView className="flex-row items-center justify-between px-4">
          <Image
            className="ml-[10%]"
            source={require("@/assets/logos/LOGO.png")}
            style={{ width: 79, height: 70, marginTop: "2%", marginLeft: "5%" }}
          />
          <Ionicons
            onPress={() => router.push("/Add_Transaction")}
            name="notifications-outline"
            size={32}
            color={isDarkMode ? "white" : "black"}
            style={{ alignSelf: "center", marginTop: "5%", marginRight: "5%" }}
          />
        </ThemedView>
  
        {/* Decision Menu */}
        <ThemedView className="flex-row items-center pt-[4%] justify-center">
          <View className={`flex-row ${bgColor} rounded-full w-[220px] h-[40px]`}>
            {/* Budget Button */}
            <TouchableOpacity
              onPress={() => setSelected("budget")}
              className={`flex-1 justify-center items-center rounded-full ${
                selected === "budget" ? selectedColor : unselectedColor
              }`}
            >
              <ThemedText className={`font-bold ${selected === "budget" ? "text-white" : textColor}`}>
                BUDGET
              </ThemedText>
            </TouchableOpacity>
  
            {/* Retire Button */}
            <TouchableOpacity
              onPress={() => setSelected("retire")}
              className={`flex-1 justify-center items-center rounded-full ${
                selected === "retire" ? selectedColor : unselectedColor
              }`}
            >
              <ThemedText className={`font-bold ${selected === "retire" ? "text-white" : textColor}`}>
                retire
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
  
        {/*  */}
        <ThemedView>
          
        </ThemedView>
  
        {/* States proceed transaction */}
        <ThemedView>
          <ThemedView className="flex-row items-center pt-[10%]">
            <ThemedView className={`justify-center items-center rounded-[10vw] w-[300px] h-[200px] ${componentColor} ml-2`}>
              <AntDesign name="filetext1" size={70} color={`${componentIcon}`} className="m-3"/>
              <ThemedText className={`mx-5 text-center font-bold ${textColor}`}>
                Please create an account
                to proceed with your transaction.
              </ThemedText>
              <ThemedView className="w-[200px] h-[100px] rounded-[5vw] flex justify-center items-center">
                <AntDesign name="plus" size={25} color={`${componentIcon}`} />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
  
      </ThemedSafeAreaView>
    );
  }