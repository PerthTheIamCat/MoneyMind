import React, { useState, useCallback, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Text as RNText,
  Pressable,
  Modal,
} from "react-native";
import {
  Text,
  Snackbar,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import Icon from "react-native-vector-icons/Feather";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";

import { Alert } from "react-native";

registerTranslation("en-GB", enGB);

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
  // const isDarkModes = useColorScheme() === "dark"; // Removed duplicate variable
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
  

  const [isModalVisible, setIsModalVisible] = useState(false);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [errorTitle, setErrorTitle] = useState<string | null>(null);

// Function to show the modal with a specific error message
const showError = (message: string) => {
  setErrorMsg(message);
  setIsModalVisible(true);
};

// Function to hide the modal
const hideErrorModal = () => {
  setIsModalVisible(false);
  setErrorMsg(null);
  setErrorTitle(null);
};

const handleConfirmDate = useCallback(
  (params: { date: CalendarDate }) => {
    if (params.date) {
      const selectedDate = new Date(params.date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        showError(
          "You cannot select a future date! 💔 Please choose today or a past date."
        );
        return;
      }

      setDate(selectedDate);
      onConfirm(selectedDate.toISOString().split("T")[0]);
    }
    setDateVisible(false);
  },
  [onConfirm]
);

const handleConfirmTime = useCallback(
  (params: { hours: number; minutes: number }) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setHours(params.hours);
      updatedDate.setMinutes(params.minutes);

      const now = new Date();

      // Check if selected time is today
      const isSameDay =
        updatedDate.getFullYear() === now.getFullYear() &&
        updatedDate.getMonth() === now.getMonth() &&
        updatedDate.getDate() === now.getDate();

      // Prevent selecting future time on the same day
      if (isSameDay && updatedDate > now) {
        showError(
          "You cannot select a future time today! ⏳ Please choose a past or current time."
        );
        return;
      }

      setDate(updatedDate);

      const formattedTime = updatedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      onConfirm(formattedTime);
    }
    setTimeVisible(false);
  },
  [date, onConfirm]
);

  useEffect(() => {
    if (date) {
      console.log("📅 Updated Date:", date.toISOString().split("T")[0]);
      console.log(
        "⏰ Updated Time:",
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
  }, [date]);

  return (
    <PaperProvider theme={theme}>
      <ThemedView style={styles.container} className="bg-transparent">
        <ThemedText
          style={[
            styles.label,
            {
              color: isDarkMode ? "#FFF" : "#333",
              textAlign: "left",
              alignSelf: "flex-start",
              fontSize: 16, // ✅ ขนาดตัวอักษรใหญ่ขึ้น
            },
          ]}
        >
          {title}
        </ThemedText>

        <Pressable
          className={mode === "date" ? "w-56" : "w-36"} // ✅ Date กว้างกว่า Time
          onPress={() =>
            mode === "date" ? setDateVisible(true) : setTimeVisible(true)
          }
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? "#222" : "#d5d5d5",
              borderColor: isDarkMode ? "#555" : "#ccc",
              minWidth: mode === "date" ? 185 : 130, // ✅ Date = 220px, Time = 140px
              paddingHorizontal: mode === "date" ? 15 : 10, // ✅ Date มี padding เยอะกว่า
            },
          ]}
        >
          <Icon
            name={mode === "date" ? "calendar" : "clock"}
            size={20}
            color={isDarkMode ? "#FFF" : "#555"}
            style={styles.icon}
          />
          <Text
            className="w-full"
            style={[styles.input, { color: isDarkMode ? "#FFF" : "#333" }]}
          >
            {mode === "date"
              ? date?.toISOString().split("T")[0] ?? "Select Date"
              : date
              ? date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Select Time"}
          </Text>
        </Pressable>

        <DatePickerModal
          locale="en-GB"
          mode="single"
          visible={dateVisible}
          onDismiss={() => setDateVisible(false)}
          date={date}
          onConfirm={handleConfirmDate}
        />

        <TimePickerModal
          locale="en-GB"
          visible={timeVisible}
          onDismiss={() => setTimeVisible(false)}
          onConfirm={handleConfirmTime}
          hours={date?.getHours() ?? 12}
          minutes={date?.getMinutes() ?? 0}
        />

<Modal
  visible={isModalVisible}
  transparent
  animationType="fade"
  onRequestClose={hideErrorModal}
>
  <ThemedView className="rounded-2xl" style={styles.modalOverlay}>
    <ThemedView style={styles.modalContent}>
      <Text style={styles.modalText}>{errorMsg}</Text>
      <ThemedButton onPress={hideErrorModal} className="w-28 h-8 !rounded-lg" mode="normal">
        OK
      </ThemedButton>
    </ThemedView>
  </ThemedView>
</Modal>

      </ThemedView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  inputContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { fontSize: 16, fontWeight: "bold", flex: 1, marginLeft: 8 },
  icon: { marginLeft: 5 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", 
  },
  modalContent: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    width: 300,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomPaperDatePicker;
