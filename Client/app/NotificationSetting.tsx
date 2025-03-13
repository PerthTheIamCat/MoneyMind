import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/hooks/auth/NotificationSettingHandler";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ThemedScrollView } from "@/components/ThemedScrollView";

interface SettingsState {
  money_overuse: boolean;
  spending_alert: boolean;
  saving_goal_alert: boolean;
  monthly_summary: boolean;
  debt_payment_reminder: boolean;
  sound_notification: boolean;
  vibration_shaking: boolean;
}

// ✅ Default settings
const defaultSettings: SettingsState = {
  money_overuse: false,
  spending_alert: false,
  saving_goal_alert: false,
  monthly_summary: false,
  debt_payment_reminder: false,
  sound_notification: false,
  vibration_shaking: false,
};

// 🎛 **Custom Switch Component**
const CustomSwitch = ({
  value,
  onToggle,
}: {
  value: boolean;
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[styles.switchToggle, value ? styles.switchOn : styles.switchOff]}
    >
      <View
        style={[
          styles.switchHandle,
          value ? styles.switchHandleOn : styles.switchHandleOff,
        ]}
      />
    </TouchableOpacity>
  );
};

const NotificationSettings = () => {
  const theme = useColorScheme();
  const { URL } = useContext(ServerContext);
  const { userID } = useContext(UserContext);
  const auth = useContext(AuthContext);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        if (!userID || !auth?.token) {
          console.error("Missing userID or token!");
          return;
        }

        console.log("📡 Fetching settings from API...");
        const response = await getNotificationSettings(URL, userID, auth.token);

        if (response?.success && response.result) {
          const extractedSettings: SettingsState = {
            money_overuse: response.result.money_overuse ?? false,
            spending_alert: response.result.spending_alert ?? false,
            saving_goal_alert: response.result.saving_goal_alert ?? false,
            monthly_summary: response.result.monthly_summary ?? false,
            debt_payment_reminder:
              response.result.debt_payment_reminder ?? false,
            sound_notification: response.result.sound_notification ?? false,
            vibration_shaking: response.result.vibration_shaking ?? false,
          };

          setSettings(extractedSettings);
          await AsyncStorage.setItem(
            "notification_settings",
            JSON.stringify(extractedSettings)
          );
        } else {
          console.warn("⚠️ API failed, trying local storage...");
          const savedSettings = await AsyncStorage.getItem(
            "notification_settings"
          );
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }
      } catch (error) {
        console.error("❌ Error loading settings:", error);
        Alert.alert("Error", "Failed to load settings.");
      }
    }
    loadSettings();
  }, []);

  const toggleSetting = useCallback(
    async (key: keyof SettingsState) => {
      try {
        const updatedSettings = {
          ...settings,
          [key]: !settings[key],
        };
        setSettings(updatedSettings);

        await AsyncStorage.setItem(
          "notification_settings",
          JSON.stringify(updatedSettings)
        );

        const requestBody = {
          settingList: updatedSettings,
          update: new Date().toISOString(),
        };

        console.log("📡 Saving to database:", requestBody);
        const response = await updateNotificationSettings(
          URL,
          userID!,
          requestBody,
          auth?.token!
        );

        if (!response.success) {
          console.error(
            "❌ Failed to save settings to database:",
            response.result
          );
          Alert.alert("Error", "Failed to save settings to server.");
        }
      } catch (error) {
        console.error("❌ Error saving settings:", error);
        Alert.alert("Error", "Failed to update settings.");
      }
    },
    [settings, URL, userID, auth?.token]
  ); // Add dependencies to avoid re-creating the function unnecessarily

  return (
    <ThemedSafeAreaView>
      <ThemedScrollView className="px-5">
        {/* 🎯 General Notifications Section */}
        <ThemedView
          style={theme === "dark" ? styles.sectionDark : styles.section}
        >
          <ThemedText className="fontWegth-bold text-2xl text-left">
            General Notifications
          </ThemedText>
          {[
            "money_overuse",
            "spending_alert",
            "saving_goal_alert",
            "monthly_summary",
            "debt_payment_reminder",
          ].map((key) => (
            <ThemedView key={key} style={styles.settingRow}>
              <ThemedText className="text-xl">
                {key.replace(/_/g, " ")}
              </ThemedText>
              <CustomSwitch
                value={settings[key as keyof SettingsState]}
                onToggle={() => toggleSetting(key as keyof SettingsState)}
              />
            </ThemedView>
          ))}
        </ThemedView>

        {/* 🎯 Advanced Settings Section */}
        <ThemedView
          style={theme === "dark" ? styles.sectionDark : styles.section}
        >
          <ThemedText className="fontWegth-bold text-2xl text-left">
            Advanced Settings
          </ThemedText>
          {["sound_notification", "vibration_shaking"].map((key) => (
            <ThemedView key={key} style={styles.settingRow}>
              <ThemedText className="text-xl">
                {" "}
                {key.replace(/_/g, " ")}
              </ThemedText>
              <CustomSwitch
                value={settings[key as keyof SettingsState]}
                onToggle={() => toggleSetting(key as keyof SettingsState)}
              />
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedScrollView>
    </ThemedSafeAreaView>
  );
};

// 🎨 **Improved UI Styling**
const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B9348",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionDark: {
    backgroundColor: "#181818",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "transparent",
    width: 300,
    height: 80,
  },
  settingLabel: {
    fontSize: 16,
    color: "white",
  },

  // 🎛 **Custom Switch Styling**
  switchToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    padding: 3,
  },
  switchOn: {
    backgroundColor: "#2B9348",
    alignItems: "flex-end",
  },
  switchOff: {
    backgroundColor: "#ccc",
    alignItems: "flex-start",
  },
  switchHandle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
});

export default NotificationSettings;
