import React, { useState, useEffect } from "react";
import {
  Pressable,
  Modal,
  StyleSheet,
  useColorScheme,
  Platform,
} from "react-native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Text,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import Icon from "react-native-vector-icons/Feather";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";

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
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ✅ แก้ปัญหา Modal ไม่ขึ้นใน iOS
  const showError = (message: string) => {
    requestAnimationFrame(() => {
      setErrorMsg(message);
      setIsModalVisible(true);
    });
  };

  // ✅ ใช้ useEffect เพื่อให้เลือกวันใหม่ได้
  useEffect(() => {
    if (!dateVisible && !timeVisible) {
      setTimeout(() => {
        setDateVisible(false);
        setTimeVisible(false);
      }, 100);
    }
  }, [dateVisible, timeVisible]);

  const handleConfirmDate = (params: { date: CalendarDate }) => {
    if (params.date) {
      const selectedDate = new Date(params.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
  
      if (selectedDate > today) {
        showError("You cannot select a future date! 💔 Please choose today or a past date.");
        return;
      }
  
      setTimeout(() => {
        // ✅ ใช้ `toLocaleString` เพื่อให้ชื่อเดือนเป็นแบบย่อ (Jan, Feb, Mar, ...)
        const monthAbbr = selectedDate.toLocaleString("en-US", { month: "short" });
  
        // ✅ ฟอร์แมตวันที่เป็น DD/Mon/YYYY
        const formattedDate = `${selectedDate.getDate().toString().padStart(2, "0")}/${monthAbbr}/${selectedDate.getFullYear()}`;
  
        setDate(selectedDate);
        onConfirm(formattedDate);
        setDateVisible(false);
      }, 0);
    }
  };
  
  const handleConfirmTime = (params: { hours: number; minutes: number }) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setHours(params.hours);
      updatedDate.setMinutes(params.minutes);

      const now = new Date();

      const isSameDay =
        updatedDate.getFullYear() === now.getFullYear() &&
        updatedDate.getMonth() === now.getMonth() &&
        updatedDate.getDate() === now.getDate();

      if (isSameDay && updatedDate > now) {
        showError("You cannot select a future time today! ⏳ Please choose a past or current time.");
        return;
      }

      setTimeout(() => {
        setDate(updatedDate);
        const formattedTime = updatedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        onConfirm(formattedTime);
        setTimeVisible(false); // ✅ ปิด Modal
      }, 0);
    }
  };

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
              fontSize: 16,
            },
          ]}
        >
          {title}
        </ThemedText>

        <Pressable
          className={mode === "date" ? "w-56" : "w-36"}
          onPress={() =>
            mode === "date" ? setDateVisible(true) : setTimeVisible(true)
          }
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? "#222" : "#d5d5d5",
              borderColor: isDarkMode ? "#555" : "#ccc",
              minWidth: mode === "date" ? 185 : 130,
              paddingHorizontal: mode === "date" ? 15 : 10,
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

        {/* ✅ แก้ปัญหา Modal ไม่ขึ้นใน iOS */}
        <Modal
          key={isModalVisible ? "visible" : "hidden"}
          visible={isModalVisible}
          transparent
          animationType={Platform.OS === "ios" ? "none" : "slide"} // ✅ ปรับให้ iOS ไม่ใช้ animation
          onRequestClose={() => setIsModalVisible(false)}
        >
          <ThemedView className="rounded-2xl" style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
              <Text style={styles.modalText}>{errorMsg}</Text>
              <ThemedButton
                onPress={() => setIsModalVisible(false)}
                className="w-28 h-8 !rounded-lg"
                mode="normal"
              >
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
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: 300,
  },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 15 },
});

export default CustomPaperDatePicker;
