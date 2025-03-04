import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { useContext } from "react";
import { router } from "expo-router";
import { useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";


import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";

export default function Setting() {
  const auth = useContext(AuthContext);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  // สีขององค์ประกอบใน Dark Mode
  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";
  const logoutColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

  const { username } = useContext(UserContext);

  return (
    <ThemedSafeAreaView>
      {/* Header */}
      <ThemedText className={`text-[24px] font-bold mx-5 pt-[15%] ${textColor}`}>
        Setting
      </ThemedText>

      {/* Profile Account Setting */}
      <View className="mt-5 mb-[15%] mx-4">
        <ThemedButton
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          mode="normal"
          onPress={() => router.push("../AccountSetting")}
        >
          <Feather name="circle" size={30} color={componentIcon} />
          <View className="flex-1 ml-3">
            <ThemedText className={`text-[18px] font-bold mx-2 ${textColor}`}>
              {username ? username : "FirstName LastName"}
            </ThemedText>
            <ThemedText className="text-gray-500 text-[14px] mx-2">
              Profile, account setting
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </ThemedButton>
      </View>

      {/* เมนูตั้งค่า */}
      <View className="mt-5 space-y-3 mx-4">
        {/* Notification Setting path */}
        <ThemedButton
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          mode="normal"
          onPress={() => router.push("../NotificationSetting")}
        >
          <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
            Notification
          </ThemedText>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </ThemedButton>
        
        {/* Change Pin Password path */}
        <ThemedButton
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          mode="normal"
          onPress={() => router.push("/CreatePinPage")}
        >
          <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
            Change Pin
          </ThemedText>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </ThemedButton>
        
        {/* Icon Transaction path */}
        <ThemedButton
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          mode="normal"
          onPress={() => router.push("../IconTransaction")}
        >
          <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
            Icon Transaction
          </ThemedText>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </ThemedButton>
      </View>

      {/* Logout */}
      <View className="mt-10 border-gray-300 pt-[60%] mx-4">
        <ThemedButton
          className={`w-full py-3 rounded-lg ${logoutColor}`}
          mode="cancel"
          textClassName={`text-[18px] font-bold ${textColor}`}
          onPress={() => {
            auth?.logout();
            router.replace("/Welcome");
          }}
        >
          Log Out
        </ThemedButton>
      </View>
    </ThemedSafeAreaView>
  );
}
