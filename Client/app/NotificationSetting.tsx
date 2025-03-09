import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Switch,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
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

interface SettingsState {
  money_overuse: boolean;
  spending_alert: boolean;
  saving_goal_alert: boolean;
  monthly_summary: boolean;
  debt_payment_reminder: boolean;
  sound_notification: boolean;
  vibration_shaking: boolean;
}

// ✅ Default settings (used if no saved data exists)
const defaultSettings: SettingsState = {
  money_overuse: false,
  spending_alert: false,
  saving_goal_alert: false,
  monthly_summary: false,
  debt_payment_reminder: false,
  sound_notification: false,
  vibration_shaking: false,
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

        console.log("Fetching settings from API...");
        const response = await getNotificationSettings(URL, userID, auth.token);

        if (response?.success && response.result) {
          // ✅ Ensure response.result has all required fields
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

          setSettings(extractedSettings); // ✅ Now TypeScript is happy!
          await AsyncStorage.setItem(
            "notification_settings",
            JSON.stringify(extractedSettings)
          );
        } else {
          console.warn("API failed, trying local storage...");
          const savedSettings = await AsyncStorage.getItem(
            "notification_settings"
          );
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        Alert.alert("Error", "Failed to load settings.");
      }
    }
    loadSettings();
  }, []);

  const toggleSetting = async (key: keyof SettingsState) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: !settings[key], // ✅ Toggle `true ↔ false`
      };
      setSettings(updatedSettings); // ✅ Update state

      // ✅ Save locally
      await AsyncStorage.setItem(
        "notification_settings",
        JSON.stringify(updatedSettings)
      );

      // ✅ Prepare API payload
      const requestBody = {
        settingList: updatedSettings,
        update: new Date().toISOString(),
      };

      // ✅ Save to database
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
  };

  return (
    <ThemedSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* General Notifications Section */}
        <ThemedView
          style={theme === "dark" ? styles.sectionDark : styles.section}
        >
          <ThemedText
            style={[
              styles.sectionTitle,
              theme === "dark" && styles.sectionTitleDark,
            ]}
          >
            General Notifications
          </ThemedText>

          {Object.entries(settings).map(([key, value]) => (
            <ThemedView key={key} style={styles.row}>
              <ThemedText
                style={[styles.label, theme === "dark" && styles.labelDark]}
              >
                {key.replace(/_/g, " ")}
              </ThemedText>
              <Switch
                value={value} // ✅ Using boolean directly
                onValueChange={() => toggleSetting(key as keyof SettingsState)}
                trackColor={{
                  false: "#767577",
                  true: theme === "dark" ? "#2B9348" : "#81b0ff",
                }}
                thumbColor={value ? "#aacc00" : "#f1f1f1"}
              />
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionDark: {
    marginBottom: 30,
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#1e1e1e",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 5,
    textAlign: "left",
    color: "#000",
  },
  sectionTitleDark: {
    color: "#FFF",
    borderColor: "#555",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    width: 320,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 16,
    textAlign: "left",
    color: "#000000",
  },
  labelDark: {
    color: "#FFF",
  },
});

export default NotificationSettings;
