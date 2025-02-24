import React, { useState } from 'react';
import { View, Switch, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const NotificationSettings = () => {
  const [spendingAlert, setSpendingAlert] = useState(false);
  const [savingGoalAlert, setSavingGoalAlert] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState(false);
  const [debtPayment, setDebtPayment] = useState(false);
  const [sound, setSound] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [moneyOveruse, setMoneyOveruse] = useState(false);
  const theme = useColorScheme();

  return (
    <ThemedSafeAreaView >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <ThemedText style={[styles.headerText, theme === "dark" && styles.headerTextDark]} className='text-4xl font-bold'>
          Notification Settings
        </ThemedText> */}
        {/* General Notifications (includes Budget Alerts) */}
        <ThemedView style={theme === "dark" ? styles.sectionDark : styles.section}>
          <ThemedText style={[styles.sectionTitle, theme === "dark" && styles.sectionTitleDark]}>
            General Notifications
          </ThemedText>
          <ThemedView style={styles.row} className = "gap-40" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Money Overuse
            </ThemedText>
            <Switch
              value={moneyOveruse}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setMoneyOveruse(value)}
              thumbColor={moneyOveruse ? "" : "#f1f1f1"}
            />
          </ThemedView>
          <ThemedView style={styles.row} className = "gap-40" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Spending Alert
            </ThemedText>
            <Switch
              value={spendingAlert}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setSpendingAlert(value)}
              thumbColor={spendingAlert ? "#aacc00" : "#f1f1f1"}
            />
          </ThemedView>
          <ThemedView style={styles.row} className = "gap-36" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Saving Goal Alert
            </ThemedText>
            <Switch
              value={savingGoalAlert}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setSavingGoalAlert(value)}
              thumbColor={savingGoalAlert ? "#aacc00" : "#f1f1f1"}
            />
          </ThemedView>
          <ThemedView style={styles.row} className = "gap-32" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Monthly Summary
            </ThemedText>
            <Switch
              value={monthlySummary}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setMonthlySummary(value)}
              thumbColor={monthlySummary ? "#aacc00" : "#f1f1f1"}
            />
          </ThemedView>
          <ThemedView style={styles.row} className = "gap-20" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Debt Payment Reminder
            </ThemedText>
            <Switch
              value={debtPayment}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setDebtPayment(value)}
              thumbColor={debtPayment ? "#aacc00" : "#f1f1f1"}
            />
          </ThemedView>
        </ThemedView>
        {/* Advanced Settings */}
        <ThemedView style={theme === "dark" ? styles.sectionDark : styles.section}>
          <ThemedText style={[styles.sectionTitle, theme === "dark" && styles.sectionTitleDark]}>
            Advanced Settings
          </ThemedText>
          <ThemedView style={styles.row} className = "gap-24" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Sound Notification
            </ThemedText>
            <Switch
              value={sound}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setSound(value)}
              thumbColor={sound ? "#aacc00" : "#f1f1f1"}
            />
          </ThemedView>
          <ThemedView style={styles.row} className = "gap-24" >
            <ThemedText style={[styles.label, theme === "dark" && styles.labelDark]}>
              Vibration / Shaking
            </ThemedText>
            <Switch
              value={shaking}
              trackColor={{ false: "#767577", true: theme === "dark" ? "#2B9348" : "#81b0ff" }}
              onValueChange={value => setShaking(value)}
              thumbColor={shaking ? "#aacc00" : "#f1f1f1"}
            />
          </ThemedView>
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
  safeAreaDark: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginVertical: 20,
    textAlign: 'left',
    color: '#000',
  },
  headerTextDark: {
    color: '#FFF',
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
  row:  {
    flexDirection: "row" ,
    justifyContent: "space-between", // Positions the switch to the right
    alignItems: 'center',
    marginVertical: 8,
    width : 320,
    backgroundColor :"transparent",
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
