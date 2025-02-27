import React, { useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  Animated,
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
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // ✅ ฟังก์ชันแสดง error โดยใช้ Overlay
  const showError = useCallback((message: string) => {
    setErrorMsg(message);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setErrorMsg(null);
      });
    }, 3000);
  }, []);

  // ✅ ป้องกันการเลือกวันที่อนาคต
  const handleConfirmDate = useCallback(
    (params: { date: CalendarDate }) => {
      if (params.date) {
        const selectedDate = new Date(params.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
          showError("⚠️ You cannot select a future date!");
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

// ✅ ป้องกันการเลือกเวลาที่เกินเวลาปัจจุบัน
const [isErrorVisible, setIsErrorVisible] = useState(false); // ✅ ควบคุมการแสดงปุ่ม OK

// ✅ ป้องกันการเลือกเวลาที่เกินเวลาปัจจุบัน
const handleConfirmTime = useCallback(
  (params: { hours: number; minutes: number }) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setHours(params.hours);
      updatedDate.setMinutes(params.minutes);

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      const isSameDay =
        updatedDate.getFullYear() === now.getFullYear() &&
        updatedDate.getMonth() === now.getMonth() &&
        updatedDate.getDate() === now.getDate();

      if (isSameDay) {
        if (
          params.hours > currentHours || 
          (params.hours === currentHours && params.minutes > currentMinutes)
        ) {
          setVisible(false); // ✅ ปิด TimePickerModal
          showError("⚠️ You cannot select a future time today!");
          return;
        }
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
        <ThemedText
          style={[styles.label, { color: isDarkMode ? "#FFF" : "#333" }]}
        >
          {title}
        </ThemedText>

        <Pressable
          className={mode === "date" ? "w-56" : "w-36"}
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
                }) ?? "Select Time"}
          </Text>
        </Pressable>

        {mode === "date" ? (
          <DatePickerModal
            locale="en-GB"
            mode="single"
            visible={visible}
            onDismiss={() => setVisible(false)}
            date={date}
            onConfirm={handleConfirmDate}
            validRange={{ endDate: new Date() }} // ✅ จำกัดให้เลือกได้แค่วันนี้หรือน้อยกว่า
          />
        ) : (
          <TimePickerModal
            locale="en-GB"
            visible={visible}
            onDismiss={() => setVisible(false)}
            onConfirm={handleConfirmTime}
            hours={date?.getHours() ?? currentHours} // ✅ ตั้งค่าเริ่มต้นให้เป็นเวลาปัจจุบัน
            minutes={date?.getMinutes() ?? currentMinutes}
          />
        )}

        {/* ✅ Overlay แสดงข้อความแจ้งเตือน */}
        {isErrorVisible && (
          <View style={styles.overlay}>
            <View style={styles.overlayContent}>
              <Text style={styles.overlayText}>⚠️ You cannot select a future time today!</Text>
              <Pressable onPress={() => setIsErrorVisible(false)} style={styles.okButton}>
                <Text style={styles.okButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
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
    alignItems: "center" 
  },
  input: { fontSize: 16, fontWeight: "bold", flex: 1, marginLeft: 8 },
  icon: { marginLeft: 5 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ พื้นหลังโปร่งแสง
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 250,
  },
  overlayText: { color: "#000", fontSize: 16, textAlign: "center", marginBottom: 10 },
  okButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
export default CustomPaperDatePicker;