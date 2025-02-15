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

  // สีขององค์ประกอบใน Dark Mode
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const selectedColor = isDarkMode ? "bg-green-500" : "bg-green-600";
  const unselectedColor = isDarkMode ? "bg-gray-500" : "bg-gray-300";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-gray-700" : "bg-gray-300";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";

  const [selected, setSelected] = useState("budget");
  const [accountCheck, setAccount] = useState(false);
  const [statesCheck, setStates] = useState(false);
  const { bank } = useContext(UserContext);

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

      {/* check Splitpay Information have Added */}
      {!accountCheck ? (
        <ThemedView>
          <ThemedView className="flex flex-row justify-center items-center pt-[10%] ml-2 bg-transparent">
            <ThemedButton className={`w-[200px] h-[100px] rounded-[5vw] flex justify-center items-center ${componentColor}`}
            onPress={() => router.push("/AddAccount")}
            >
              <ThemedView className={`w-[200px] h-[100px] rounded-[5vw] flex justify-center items-center ${bgColor}`}>
                <AntDesign name="plus" size={25} color={`${componentIcon}`} />
                <ThemedText className={`mx-5 text-center font-bold ${textColor}`}>
                  Add Account
                </ThemedText>
              </ThemedView>
            </ThemedButton>
          </ThemedView>
          <ThemedView className="flex-row items-center pt-[10%]">
            <ThemedView className={`justify-center items-center rounded-[10vw] w-[300px] h-[200px] ${componentColor} ml-2`}>
              <AntDesign name="filetext1" size={70} color={`${componentIcon}`} className="m-3"/>
              <ThemedText className={`mx-5 text-center font-bold ${textColor}`}>
                Please create an account
                to proceed with your transaction.
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView>
          <ThemedView className="flex flex-row justify-center items-center pt-[10%] ml-2 bg-transparent">
            
          </ThemedView>
          <ThemedView className="flex-row items-center pt-[10%]">
            <ThemedView className={`justify-center items-center rounded-[10vw] w-[300px] h-[200px] ${componentColor} ml-2`}>
              <AntDesign name="filetext1" size={70} color={`${componentIcon}`} className="m-3"/>
              <ThemedText className={`mx-5 text-center font-bold ${textColor}`}>
                Please create an account
                to proceed with your transaction.
              </ThemedText>
              <ThemedButton className={`w-[200px] h-[100px] rounded-[5vw] flex justify-center items-center ${componentColor}`}
                onPress={() => router.push("/AddAccount")}
              >
                <ThemedView className={`w-[200px] h-[100px] rounded-[5vw] flex justify-center items-center ${bgColor}`}>
                  <AntDesign name="plus" size={25} color={`${componentIcon}`} />
                </ThemedView>
              </ThemedButton>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        // <View className="mt-0.5 mb-1 flex-row space-x-1">
        //   {bank?.map((account) => (
        //     <ThemedCard
        //       name={account.account_name}
        //       color={account.color_code}
        //       balance={account.balance.toString()}
        //       mode="small"
        //       onEdit={() => {}}
        //       key={account.id}
        //       // image={account.icon_id}
        //       className="!items-center !justify-center w-32 h-32 bg-[#fefefe] rounded-lg"
        //       />
        //   ))}
        // </View>
      )}

    </ThemedSafeAreaView>
  );
}
