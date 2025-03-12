import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { useContext } from "react";
import { router } from "expo-router";
import { ScrollView, Pressable, useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StyleSheet, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";

export default function Setting() {
  const auth = useContext(AuthContext);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-[#181818]" : "bg-[#d8d8d8]";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";

  const { username } = useContext(UserContext);

  return (
    <ThemedSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Header - Aligned to the Left */}
        <View style={styles.headerContainer}>
          <ThemedText className={`text-[24px] font-bold ${textColor}`}>
            Settings
          </ThemedText>
        </View>

        {/* Profile Account Setting */}
        <View style={styles.profileLabel}>
          <Pressable
            className={`flex-row items-center px-4 py-3 rounded-lg ${componentColor}`}
            onPress={() => router.push("/Account_Detail")}
          >
            <Feather
              name="user"
              size={30}
              color={componentIcon}
              style={styles.iconPadding}
            />
            <View style={styles.flexGrow}>
              <ThemedText className={`text-[18px] font-bold ${textColor}`}>
                {username ? username : "FirstName LastName"}
              </ThemedText>
              <ThemedText className="text-gray-500 text-[14px]">
                Profile, account settings
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={24} color={componentIcon} />
          </Pressable>
        </View>

        {/* Settings Options */}
        <View style={styles.settingContainer}>
          {[
            { label: "Notification", path: "../NotificationSetting" },
            { label: "Change Pin", path: "../PinRecovery" },
            { label: "Icon Transaction", path: "../IconTransaction" },
          ].map((item, index) => (
            <Pressable
              key={index}
              className={`flex-row items-center px-4 mt-1 py-3 rounded-lg ${componentColor}`}
              onPress={() => router.push(item.path)}
            >
              <ThemedText
                className={`flex-1 text-[18px] font-bold ${textColor}`}
              >
                {item.label}
              </ThemedText>
              <Feather name="chevron-right" size={24} color={componentIcon} />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.buttonContainer}>
          <ThemedButton
            className={`w-full py-3 rounded-lg absolute bottom-[10%] bg-red-500`}
            mode="cancel"
            textClassName={`text-[18px] font-bold ${textColor}`}
            onPress={() => {
              auth?.logout();
              router.replace("/Welcome");
            }}
          >
            <ThemedText className="text-[18px] font-bold">Logout</ThemedText>
          </ThemedButton>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    alignItems: "center",
    paddingBottom: hp("5%"),
  },
  headerContainer: {
    alignSelf: "flex-start",
    marginLeft: wp("9%"),
    marginTop: hp("5%"),
    marginBottom: hp("2%"),
  },
  profileLabel: {
    width: wp("90%"),

    borderRadius: 12,
    padding: 12,
    marginVertical: hp("1%"),
  },
  settingContainer: {
    width: wp("90%"),

    borderRadius: 12,
    padding: 12,
    marginVertical: hp("1%"),
  },
  buttonContainer: {
    width: wp("90%"),
    marginTop: hp("35%"),
  },
  iconPadding: {
    paddingHorizontal: wp("2%"),
  },
  flexGrow: {
    flex: 1,
  },
});
