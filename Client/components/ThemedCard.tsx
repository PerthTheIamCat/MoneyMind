import { useState, useEffect } from "react";
import { Image, TouchableOpacity, View, Modal, Button } from "react-native";
import * as Localization from "expo-localization";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { TouchableWithoutFeedback } from "react-native";

const images = [
  require("../assets/logos/LOGO.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon1.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon2.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon3.png"),
];

type ThemedCardProps = {
  name: string;
  balance: string;
  color?: string;
  mode?: "small" | "large";
  imageIndex?: number;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ThemedCard({
  name,
  balance,
  color,
  mode = "small",
  imageIndex = 0,
  className,
  onDelete,
}: ThemedCardProps) {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCountdownActive, setCountdownActive] = useState(false);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const selectedImage = images[imageIndex] || images[0];


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0) {
      setCountdownActive(false);
    }
    return () => clearInterval(timer);
  }, [isCountdownActive, countdown]);

  const handleDelete = () => {
    setDeleteModalVisible(true);
    setCountdown(5);
    setCountdownActive(true);
  };

  const confirmDelete = async () => {
    if (onDelete) {
      await onDelete(); // เรียกใช้งานฟังก์ชันลบข้อมูลจาก Props
    }
    setDeleteModalVisible(false); // ปิด Modal หลังจากลบข้อมูลสำเร็จ
  };

  return (
    <ThemedView
      className={`!rounded-2xl !flex-row !justify-start !items-start mr-3 ${
        mode === "small"
          ? "w-[125px] h-[125px]"
          : "w-[280px] h-[180px] mx-[8px]"
      } ${className}`}
      style={{
        backgroundColor: color || "#f2f2f2",
      }}
    >
      <Image
        source={selectedImage}
        className={`!rounded-full absolute top-4 left-4 ${
          mode === "small" ? "w-10 h-10" : "w-16 h-16"
        }`}
      />

      {mode === "small" && (
        <TouchableOpacity
          onPress={() => setOptionsVisible(!isOptionsVisible)}
          className="absolute top-4 right-4 p-2 rounded-md"
        >
          <FontAwesome name="pencil" size={16} color="#f2f2f2" />
        </TouchableOpacity>
      )}

      {isOptionsVisible && (
        <TouchableOpacity
          onPress={() => setOptionsVisible(false)}
          activeOpacity={1}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
          }}
        />
      )}

      {isOptionsVisible && (
        <ThemedView
          className="absolute z-10 rounded-lg shadow-lg"
          style={{
            top: 40,
            right: 4,
            width: 75,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false);
            }}
          >
            <ThemedText className="text-[16px] text-blue-600 mb-2">
              Edit
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false);
              handleDelete();
            }}
          >
            <ThemedText className="text-[16px] text-red-600">Delete</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute top-16 left-4 bg-transparent">
          <ThemedText className="text-[16px] !text-[#f2f2f2] font-bold">
            {name}
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView className="absolute top-8 left-24 bg-transparent">
          <ThemedText className="text-[24px] !text-[#f2f2f2] font-bold">
            {name}
          </ThemedText>
        </ThemedView>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute bottom-4 right-4 bg-transparent">
          <ThemedText className="text-[18px] !text-[#f2f2f2] font-semibold">
            {balance}
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView className="absolute bottom-4 right-4 bg-transparent">
          <ThemedText className="text-[26px] !text-[#f2f2f2] font-semibold">
            {balance}
          </ThemedText>
        </ThemedView>
      )}

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
      <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <ThemedView
            className="w-96 h-64 p-4 bg-white rounded-2xl"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <ThemedText className="text-xl font-bold mb-4">
              Are you sure you want to delete?
            </ThemedText>
            <ThemedText className="text-lg mb-4">
              You can cancel or confirm the action.
            </ThemedText>
            <ThemedView className="flex-row bg-transparent mt-14">
              <ThemedButton
                className="w-32 h-12 mr-6"
                title={countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`}
                onPress={confirmDelete}
                disabled={countdown > 0}
                mode={countdown === 0 ? "confirm" : "normal"}
              >
                {countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`}
              </ThemedButton>
              <ThemedButton
                className="w-32 h-12"
                title="Cancel"
                onPress={() => setDeleteModalVisible(false)}
                mode="cancel"
              >
                Cancel
              </ThemedButton>
            </ThemedView>
          </ThemedView>
          </TouchableWithoutFeedback>
        </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
}
