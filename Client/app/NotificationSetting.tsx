import React, { useContext, useState } from 'react';
import { View, Switch, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NotificationsPostHandler } from '@/hooks/auth/NotificationSettingHandler';
import { ServerContext } from '@/hooks/conText/ServerConText';
import { UserContext } from '@/hooks/conText/UserContext';


const NotificationSettings = () => {
  const theme = useColorScheme();
  const { URL } = useContext(ServerContext);
  const [settings, setSettings] = useState({
    spendingAlert: true,
    savingGoalAlert: true,
    monthlySummary: true,
    debtPayment: true,
    sound: true,
    shaking: true,
    moneyOveruse: true,
  });

  const { userID } = useContext(UserContext);

  type SettingKeys = 'spendingAlert' | 'savingGoalAlert' | 'monthlySummary' | 'debtPayment' | 'sound' | 'shaking' | 'moneyOveruse';

  const toggleSetting = async (key: SettingKeys) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, [key]: !prevSettings[key] };
      return updatedSettings;
    });
  
    try {
      const response = await NotificationsPostHandler(URL, {
        user_id: userID! , // Replace this with the actual user ID
        settingList: Object.values(settings),
      });
  
      if (!response.success) {
        console.error("Failed to update settings:", response.result);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };
  

  console.log("NotificationSettings component rendered");
  console.log("Current settings:", settings);

  return (
    <ThemedSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* General Notifications Section */}
        <ThemedView style={theme === "dark" ? styles.sectionDark : styles.section}>
          <ThemedText style={[styles.sectionTitle, theme === "dark" && styles.sectionTitleDark]}>
            General Notifications
          </ThemedText>
          {[
            { label: "Money Overuse", key: "moneyOveruse" },
            { label: "Spending Alert", key: "spendingAlert" },
            { label: "Saving Goal Alert", key: "savingGoalAlert" },
            { label: "Monthly Summary", key: "monthlySummary" },
            { label: "Debt Payment Reminder", key: "debtPayment" },
          ].map(({ label, key }) => (
            <ThemedView key={key} style={styles.row}>
              <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
                {label}
              </ThemedText>
              <Switch
                value={settings[key as SettingKeys]}
                trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
                onValueChange={() => toggleSetting(key as SettingKeys)}
                thumbColor={settings[key as SettingKeys] ? "#aacc00" : "#f1f1f1"} 
              />
            </ThemedView>
          ))}
        </ThemedView>

        {/* Advanced Settings Section */}
        <ThemedView style={theme === "dark" ? styles.sectionDark : styles.section}>
          <ThemedText style={[styles.sectionTitle, theme === "dark" && styles.sectionTitleDark]}>
            Advanced Settings
          </ThemedText>
          {[
            { label: "Sound Notification", key: "sound" },
            { label: "Vibration / Shaking", key: "shaking" },
          ].map(({ label, key }) => (
            <ThemedView key={key} style={styles.row}>
              <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
                {label}
              </ThemedText>
              <Switch
                value={settings[key as SettingKeys]}
                trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
                onValueChange={() => toggleSetting(key as SettingKeys)}
                thumbColor={settings[key as SettingKeys] ? "#aacc00" : "#f1f1f1"} 
              />          
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionDark: {
    marginBottom: 30,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#1e1e1e',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    textAlign: 'left',
    color: '#000',
  },
  sectionTitleDark: {
    color: '#FFF',
    borderColor: '#555',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginVertical: 8,
    width: 320,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 16,
    textAlign: 'left',
    color: '#000000',
  },
  labelDark: {
    color: '#FFF',
  },
});

export default NotificationSettings;
