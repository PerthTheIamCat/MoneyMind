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
import { enGB, registerTranslation } from "react-native-paper-dates";

// ✅ ลงทะเบียนภาษา `en`
registerTranslation("en", enGB);

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
  
        // 🔹 Log ค่า Raw Date ที่ได้จาก DatePicker
        console.log("📅 Raw Selected Date (UTC):", selectedDate.toISOString());
  
        // 🔹 ตรวจสอบ timezone offset ของเครื่อง
        const timezoneOffset = selectedDate.getTimezoneOffset();
        console.log("⏳ Timezone Offset:", timezoneOffset, "minutes");
  
        // 🔹 ปรับเวลาให้ตรงกับ Local Time โดยหักลบ timezone offset ออก
        const adjustedDate = new Date(
          selectedDate.getTime() - timezoneOffset * 60000
        );
  
        // 🔹 แปลงวันที่เป็นรูปแบบที่ต้องการ
        const formattedDate = adjustedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  
        console.log("📅 Adjusted Date (Local Time):", formattedDate);
  
        setDate(adjustedDate);
        onConfirm(formattedDate);
        setVisible(false);
      }
    },
    [onConfirm]
  );
  
  const handleConfirmTime = useCallback(
    (params: { hours?: number; minutes?: number }) => {
      const now = new Date();
  
      // 🔹 ถ้ายังไม่มีค่า date ให้ใช้วันปัจจุบัน
      const updatedDate = date ? new Date(date) : new Date();
  
      // 🔹 ถ้าไม่มีค่าที่เลือกจาก TimePicker ให้ใช้เวลาปัจจุบัน
      updatedDate.setHours(params.hours ?? now.getHours());
      updatedDate.setMinutes(params.minutes ?? now.getMinutes());
      updatedDate.setSeconds(0);
      updatedDate.setMilliseconds(0);
  
      // 🔹 Log ค่า Raw Time ที่เลือก
      console.log("⏰ Raw Selected Time (Before Adjust):", updatedDate.toISOString());
  
      // 🔹 ตรวจสอบ timezone offset ของเครื่อง
      const timezoneOffset = updatedDate.getTimezoneOffset();
      console.log("⏳ Timezone Offset:", timezoneOffset, "minutes");
  
      // 🔹 ปรับเวลาให้ตรงกับ Local Time โดยลบ timezone offset ออก
      const adjustedTime = new Date(updatedDate.getTime() - timezoneOffset * 60000);
  
      // 🔹 แปลงเวลาเป็นรูปแบบที่ต้องการ
      const formattedTime = adjustedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
  
      console.log("⏰ Adjusted Time (Local Time):", formattedTime);
  
      setDate(adjustedTime);
      onConfirm(formattedTime);
      setVisible(false);
    },
    [date, onConfirm]
  );
  

  return (
    <PaperProvider theme={theme}>
      <ThemedView style={styles.container} className="bg-transparent">
        <ThemedText
          style={[styles.label, { color: isDarkMode ? "#FFF" : "#333" }]}
        >
          {" "}
          {title}{" "}
        </ThemedText>

        <Pressable
          className={mode === "date" ? "w-56" : "w-44"  }
          onPress={() => setVisible(true)}
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
            {" "}
            {mode === "date"
              ? date?.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) ?? "Select Date"
              : date?.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }) ?? "Select Time"}{" "}
          </Text>
        </Pressable>

        {mode === "date" ? (
          <DatePickerModal
            locale="en"
            mode="single"
            visible={visible}
            onDismiss={() => setVisible(false)}
            date={date}
            onConfirm={(params) => {
              console.log(params.date?.toISOString().split("T  ")[0]); // ✅ แสดงเฉพาะวันที่ที่เลือก
              handleConfirmDate(params);
            }}
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
            locale="en"
            visible={visible}
            onDismiss={() => setVisible(false)}
            onConfirm={(params) => {
              console.log(`${params.hours}:${params.minutes}`); // ✅ แสดงเฉพาะเวลา เช่น "10:30"
              handleConfirmTime(params);
            }}
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
