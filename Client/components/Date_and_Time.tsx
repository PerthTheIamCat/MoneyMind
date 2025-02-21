import React, { useState, useCallback, useEffect } from "react";
import { TouchableOpacity, StyleSheet, useColorScheme, Text as RNText } from "react-native";
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

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  const handleConfirmDate = useCallback(
    (params: { date: CalendarDate }) => {
      if (params.date) {
        const selectedDate = new Date(params.date);
        const today = new Date();

        if (selectedDate > today) {
          setErrorMsg("You cannot select a future date.");
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

        if (
          updatedDate > now &&
          updatedDate.toDateString() === now.toDateString()
        ) {
          setErrorMsg("You cannot select a future time today.");
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
            },
          ]}
        >
          {title}
        </ThemedText>

        <TouchableOpacity
          onPress={() =>
            mode === "date" ? setDateVisible(true) : setTimeVisible(true)
          }
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? "#222" : "#d5d5d5",
              borderColor: isDarkMode ? "#555" : "#ccc",
            },
          ]}
        >
          <Icon
            name={mode === "date" ? "calendar" : "clock"}
            size={20}
            color={isDarkMode ? "#FFF" : "#555"}
            style={styles.icon}
          />
          <Text style={[styles.input, { color: isDarkMode ? "#FFF" : "#333" }]}> 
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
        </TouchableOpacity>

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

        <Snackbar
          visible={!!errorMsg}
          onDismiss={() => setErrorMsg("")}
          duration={3000}
          action={{
            label: "OK",
            onPress: () => setErrorMsg(""),
          }}
        >
          <Text>{errorMsg}</Text>
        </Snackbar>
      </ThemedView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { fontSize: 16, fontWeight: "bold", flex: 1, marginLeft: 8 },
  icon: { marginLeft: 5 },
});

export default CustomPaperDatePicker;
