import React, { useContext, useState } from 'react';
import { View, Switch, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NotificationsPostHandler } from '@/hooks/auth/NotificationSettingHandler';
import { ServerContext } from '@/hooks/conText/ServerConText';
import { UserContext } from '@/hooks/conText/UserContext';
import { AuthContext } from '@/hooks/conText/AuthContext';

interface SettingsState {
  spending_alert: boolean;
  saving_goal_alert: boolean;
  monthly_summary: boolean;
  debt_payment: boolean;
  sound_notification: boolean;
  vibration_shaking: boolean;
  money_overuse: boolean;
}

type SettingKeys = keyof Omit<SettingsState, 'timestamp'>; // Exclude timestamp from toggleable keys

const NotificationSettings = () => {
  const theme = useColorScheme();
  const { URL } = useContext(ServerContext);
  const [settings, setSettings] = useState<SettingsState>({
    spending_alert: true,
    saving_goal_alert: true,
    monthly_summary: true,
    debt_payment: true,
    sound_notification: true,
    vibration_shaking: true,
    money_overuse: true,
  });

  const  auth  = useContext(AuthContext);

  const { userID } = useContext(UserContext);
  const toggleSetting = async (key: SettingKeys) => {
    // Create new updated state
    const newSettings = {
      ...settings,
      [key]: !settings[key], // Toggle the specific setting
      timestamp: Date.now(),
    };
  
    // Update state optimistically
    setSettings(newSettings);
  
    // Convert settings to match backend keys
    const settingKeys: { [key in SettingKeys]: string } = {
      spending_alert: "spending alert",
      saving_goal_alert: "saving goal alert",
      monthly_summary: "monthly summary",
      debt_payment: "debt payment reminder",
      sound_notification: "sound notification",
      vibration_shaking: "vibration shaking",
      money_overuse: "money overuse",
    };
  
    // Map newSettings to backend format
    const updatedSettingList = (Object.keys(settingKeys) as SettingKeys[]).map(
      (settingKey) => newSettings[settingKey]  // ✅ Use new state
    );
  
    try {
      const response = await NotificationsPostHandler(URL, {
        user_id: userID!,
        settingList: updatedSettingList,
        update : Date.now().toString()
      }, auth?.token!);
  
      if (!response.success) {
        console.error("Failed to update settings:", response.result);
  
        // Revert toggle if API fails
        setSettings((prevSettings) => ({
          ...prevSettings,
          [key]: !prevSettings[key],
          timestamp: Date.now(),
        }));
      }
    } catch (error) {
      console.error("Error updating settings:", error);
  
      // Revert toggle on error
      setSettings((prevSettings) => ({
        ...prevSettings,
        [key]: !prevSettings[key],
        timestamp: Date.now(),
      }));
    }
  };
  
  
  console.log('NotificationSettings component rendered');
  console.log('Current settings:', settings);

  return (
    <ThemedSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* General Notifications Section */}
        <ThemedView style={theme === 'dark' ? styles.sectionDark : styles.section}>
          <ThemedText style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
            General Notifications
          </ThemedText>
          {[
            { label: 'Money Overuse', key: 'moneyOveruse' as SettingKeys },
            { label: 'Spending Alert', key: 'spendingAlert' as SettingKeys },
            { label: 'Saving Goal Alert', key: 'savingGoalAlert' as SettingKeys },
            { label: 'Monthly Summary', key: 'monthlySummary' as SettingKeys },
            { label: 'Debt Payment Reminder', key: 'debtPayment' as SettingKeys },
          ].map(({ label, key }) => (
            <ThemedView key={key} style={styles.row}>
              <ThemedText style={[styles.label, theme === 'dark' && styles.labelDark]}>
                {label}
              </ThemedText>
              <Switch
                value={settings[key]}
                trackColor={{
                  false: '#767577',
                  true: theme === 'dark' ? '#2B9348' : '#81b0ff',
                }}
                onValueChange={() => toggleSetting(key)}
                thumbColor={settings[key] ? '#aacc00' : '#f1f1f1'}
              />
            </ThemedView>
          ))}
        </ThemedView>

        {/* Advanced Settings Section */}
        <ThemedView style={theme === 'dark' ? styles.sectionDark : styles.section}>
          <ThemedText style={[styles.sectionTitle, theme === 'dark' && styles.sectionTitleDark]}>
            Advanced Settings
          </ThemedText>
          {[
            { label: 'Sound Notification', key: 'sound' as SettingKeys },
            { label: 'Vibration / Shaking', key: 'shaking' as SettingKeys },
          ].map(({ label, key }) => (
            <ThemedView key={key} style={styles.row}>
              <ThemedText style={[styles.label, theme === 'dark' && styles.labelDark]}>
                {label}
              </ThemedText>
              <Switch
                value={settings[key]}
                trackColor={{
                  false: '#767577',
                  true: theme === 'dark' ? '#2B9348' : '#81b0ff',
                }}
                onValueChange={() => toggleSetting(key)}
                thumbColor={settings[key] ? '#aacc00' : '#f1f1f1'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    width: 320,
    backgroundColor: 'transparent',
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
