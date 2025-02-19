import { useState, useEffect, useContext } from "react";
import { Image, TouchableOpacity, View, Modal, Button, Pressable } from "react-native";
import * as Localization from "expo-localization";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import { DeleteUserBank, GetUserBank } from "@/hooks/auth/GetUserBank";
import { response } from "express";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { UserContext } from "@/hooks/conText/UserContext";


const formatBalance = (balance: string): string => {
  const num = parseFloat(balance);
  if (isNaN(num)) return balance; // ถ้าไม่ใช่ตัวเลข ให้คืนค่าเดิม

  // ฟังก์ชันสำหรับตัดเลขให้เหลือทศนิยมสองตำแหน่งโดยไม่ปัดเศษ
  const truncateTwoDecimal = (value: number) => Math.floor(value * 100) / 100;

  if (num >= 1_000_000_000) {
    return `${truncateTwoDecimal(num / 1_000_000_000).toFixed(2)} B฿`;
  } else if (num >= 1_000_000) {
    return `${truncateTwoDecimal(num / 1_000_000).toFixed(2)} M฿`;
  } else {
    return `${truncateTwoDecimal(num).toFixed(2)} ฿`;
  }
};

const images = [
  require("../assets/images/Add_Account_page_image/AccountIcon1.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon2.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon3.png"),
];

type ThemedCardProps = {
  CardID: number;
  icon_id?: number;
  name: string;
  balance: string;
  color?: string;
  mode?: "small" | "large";
  imageIndex?: number;
  className?: string;
  index?: number;
  onEdit?: () => void;
  onDelete?: (id: number) => void;
};

export function ThemedCard({
  CardID,
  name,
  balance,
  color,
  mode = "small",
  imageIndex = 0,
  className,
  onEdit,
  index,
  onDelete,
}: ThemedCardProps) {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCountdownActive, setCountdownActive] = useState(false);
  type BankAccount = {
    id: number;
    user_id: number;
    account_name: string;
    balance: number;
    color_code: string;
    icon_id: string;
  };
  
  
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  const {userID , bank} = useContext(UserContext);
  

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const selectedImage = images[imageIndex];

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
    setDeleteModalVisible(false);
  
    try {
      console.log("🔍 Attempting to delete account ID:", CardID);
  
      const deleteRes = await DeleteUserBank(URL, CardID, auth?.token!);
  
      if (deleteRes.success) {
        console.log("✅ Deleted successfully");

      } else {
        console.error("❌ Failed to delete account:", deleteRes.message);
      }
    } catch (error) {
      console.error("❌ Error deleting bank:", error);
    }
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
        source={images[imageIndex]}
        className={`!rounded-full absolute top-4 left-4 ${
          mode === "small" ? "w-10 h-10" : "w-16 h-16"
        }`}
      />

      {mode === "small" && (
        <Pressable
          onPress={() => setOptionsVisible(!isOptionsVisible)}
          className="absolute top-4 right-4 p-2 rounded-md"
        >
          <FontAwesome name="pencil" size={16} color="#f2f2f2" />
        </Pressable>
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
          <Pressable
            className="w-full !justify-center !items-center "
            onPress={() => {
              setOptionsVisible(false);
              router.push({ pathname: "/Edit_Account", params: { CardID } });
            }}
          >
            <ThemedText className="text-center text-[16px] text-blue-600 w-full mb-2">
              Edit
            </ThemedText>
          </Pressable>
          <Pressable
            className="w-full justify-center items-center"
            onPress={() => {
              setOptionsVisible(false);
              handleDelete();
            }}
          >
            <ThemedText className="text-center text-[16px] text-red-600">Delete</ThemedText>
          </Pressable>
        </ThemedView>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute top-16 ml-4 items-start bg-transparent w-[85%]">
          <ThemedText
            className="ml-4 text-[16px] !text-[#f2f2f2] w-full font-bold"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ textAlign: "left" }}
          >
            {name.trim()}
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView className="absolute top-8 left-24 bg-transparent">
          <ThemedText
            className="text-[24px] !text-[#f2f2f2] font-bold w-full"
            numberOfLines={2} 
            ellipsizeMode="tail"
            style={{ textAlign: "left" }} 
          >
            {name.trim()}
          </ThemedText>
        </ThemedView>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute bottom-4 right-4 bg-transparent">
          <ThemedText className="text-[18px] !text-[#f2f2f2] font-semibold">
            {formatBalance(balance)}
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView className="absolute bottom-4 right-4 bg-transparent">
          <ThemedText className="text-[26px] !text-[#f2f2f2] font-semibold">
            {formatBalance(balance)}
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
                className="w-96 h-64 p-4 rounded-2xl"
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
                    title={
                      countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`
                    }
                    onPress={confirmDelete}
                    disabled={countdown > 0}
                    mode={countdown === 0 ? "cancel" : "normal"}
                  >
                    {countdown === 0 ? "Confirm" : `Confirm (${countdown}s)`}
                  </ThemedButton>
                  <ThemedButton
                    className="w-32 h-12"
                    title="Cancel"
                    onPress={() => setDeleteModalVisible(false)}
                    mode="normal"
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
function setBank(newBank: import("@/hooks/auth/GetUserBank").resultObject[]) {
  throw new Error("Function not implemented.");
}

