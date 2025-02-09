import { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import * as Localization from "expo-localization";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";


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
  onEdit,
  onDelete,
}: ThemedCardProps) {
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const selectedImage = images[imageIndex] || images[0];


  return (
    <ThemedView
      className={`!rounded-2xl !flex-row !justify-start !items-start mr-3 ${
        mode === "small" ? "w-[125px] h-[125px]" : "w-[280px] h-[180px] mx-[8px]"
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
            width : 75,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false);
              onEdit?.();
            }}
          >
            <ThemedText className="text-[16px] text-blue-600 mb-2">Edit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false);
            }}
          >
            <ThemedText className="text-[16px] text-red-600">Delete</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute top-16 left-4 bg-transparent">
          <ThemedText className="text-[16px] !text-[#f2f2f2] font-bold">{name}</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView className="absolute top-8 left-24 bg-transparent">
          <ThemedText className="text-[24px] !text-[#f2f2f2] font-bold">{name}</ThemedText>
        </ThemedView>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute bottom-4 right-4 bg-transparent">
          <ThemedText className="text-[18px] !text-[#f2f2f2] font-semibold">{balance}</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView className="absolute bottom-4 right-4 bg-transparent">
          <ThemedText className="text-[26px] !text-[#f2f2f2] font-semibold">{balance}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}
