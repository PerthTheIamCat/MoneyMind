import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import Icon from "react-native-vector-icons/Feather";
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

interface CustomPaperDatePickerProps {
  title: string;
  mode: "date" | "time";
}

const CustomPaperDatePicker: React.FC<CustomPaperDatePickerProps> = ({ title, mode }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

  const handleConfirmDate = (params: { date: CalendarDate }) => {
    if (params.date) {
      setDate(new Date(params.date));
    }
    setDateVisible(false);
  };

  const handleConfirmTime = (params: { hours: number; minutes: number }) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setHours(params.hours);
      updatedDate.setMinutes(params.minutes);
      setDate(updatedDate);
    }
    setTimeVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity onPress={() => (mode === "date" ? setDateVisible(true) : setTimeVisible(true))} style={styles.inputContainer}>
        <Icon name={mode === "date" ? "calendar" : "clock"} size={20} color="#555" style={styles.icon} />
        <Text style={styles.input}>
          {mode === "date"
            ? date ? date.toLocaleDateString("en-GB") : "Select Date"
            : date ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "Select Time"}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={dateVisible}
        onDismiss={() => setDateVisible(false)}
        date={date}
        onConfirm={(params) => handleConfirmDate(params)}
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={timeVisible}
        onDismiss={() => setTimeVisible(false)}
        onConfirm={handleConfirmTime}
        hours={date?.getHours() ?? 12}
        minutes={date?.getMinutes() ?? 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  input: { fontSize: 16, fontWeight: "bold", color: "#333", flex: 1, marginLeft: 8 },
  icon: { marginLeft: 5 },
});

export default CustomPaperDatePicker;
