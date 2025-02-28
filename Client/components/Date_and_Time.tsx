import React, { useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
} from "react-native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Text,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import Icon from "react-native-vector-icons/Feather";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface CustomPaperDatePickerProps {
  title: string;
  mode: "date" | "time";
  onConfirm: (value: string) => void;
}

const CustomPaperDatePicker: React.FC<CustomPaperDatePickerProps> = ({
  title,
  mode,
  onConfirm,
}) => {
  const isDarkMode = useColorScheme() === "dark";
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [visible, setVisible] = useState(false);

  const showError = useCallback(() => {
    Alert.alert(
      "Invalid Selection",
      "⚠️ You cannot select a future date/time!",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }, []);

  const handleConfirmDate = useCallback(
    (params: { date: Date | undefined }) => {
      if (params.date) {
        const selectedDate = new Date(params.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() > today.getTime()) {
          showError();
          return;
        }

        const formattedDate = selectedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        setDate(selectedDate);
        onConfirm(formattedDate);
        setVisible(false);
      }
    },
    [showError, onConfirm]
  );

  const handleConfirmTime = useCallback(
    (params: { hours: number; minutes: number }) => {
      if (date) {
        const updatedDate = new Date(date);
        updatedDate.setHours(params.hours);
        updatedDate.setMinutes(params.minutes);

        const now = new Date();

        if (updatedDate.getTime() > now.getTime()) {
          setVisible(false);
          showError();
          return;
        }

        const formattedTime = updatedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setDate(updatedDate);
        onConfirm(formattedTime);
        setVisible(false);
      }
    },
    [date, showError, onConfirm]
  );

  return (
    <PaperProvider theme={theme}>
      <ThemedView style={styles.container} className="bg-transparent">
        <ThemedText style={[styles.label, { color: isDarkMode ? "#FFF" : "#333" }]}> {title} </ThemedText>

        <Pressable
          className={mode === "date" ? "w-56" : "w-36"}
          onPress={() => setVisible(true)}
          style={[ styles.inputContainer, { backgroundColor: isDarkMode ? "#222" : "#d5d5d5", borderColor: isDarkMode ? "#555" : "#ccc", }, ]}
        >
          <Icon name={mode === "date" ? "calendar" : "clock"} size={20} color={isDarkMode ? "#FFF" : "#555"} style={styles.icon} />
          <Text style={[styles.input, { color: isDarkMode ? "#FFF" : "#333" }]}> {mode === "date" ? date?.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", }) ?? "Select Date" : date?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, }) ?? "Select Time"} </Text>
        </Pressable>

        {mode === "date" ? (
          <DatePickerModal
            locale="en-GB"
            mode="single"
            visible={visible}
            onDismiss={() => setVisible(false)}
            date={date}
            onConfirm={handleConfirmDate}
            validRange={{
              endDate: (() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return today;
              })(),
            }}
          />
        ) : (
          <TimePickerModal
            locale="en-GB"
            visible={visible}
            onDismiss={() => setVisible(false)}
            onConfirm={handleConfirmTime}
            hours={date?.getHours() ?? new Date().getHours()} 
            minutes={date?.getMinutes() ?? new Date().getMinutes()}
          />
        )}
      </ThemedView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  inputContainer: { borderWidth: 1, borderRadius: 8, padding: 10, flexDirection: "row", alignItems: "center" },
  input: { fontSize: 16, fontWeight: "bold", flex: 1, marginLeft: 8 },
  icon: { marginLeft: 5 },
});

export default CustomPaperDatePicker;
