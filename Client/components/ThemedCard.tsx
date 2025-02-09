import { TextInput, KeyboardTypeOptions, TextInputProps } from "react-native";
import { useState } from "react";
import * as Localization from "expo-localization";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "react-native";
import { ThemedScrollView } from "./ThemedScrollView";
import { TouchableOpacity } from "react-native";

type ThemedCardProps = {
  name: string;
  balance: string;
  color?: string;
  mode?: "small" | "large";
  imageIndex?: number;
  className?: string;
  onEdit?: () => void;
};

const images = [
  require("../assets/logos/LOGO.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon1.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon2.png"),
  require("../assets/images/Add_Account_page_image/AccountIcon3.png"),
];

export function ThemedCard({
  name,
  balance,
  color,
  mode = "small",
  imageIndex = 0,
  className,
  onEdit,
}: ThemedCardProps) {
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  const selectedImage = images[imageIndex] || images[0];
  // console.log(color);
  return (
    <ThemedView
      className={` !rounded-2xl  !flex-row !justify-start  !items-start mr-3 ${
        mode === "small"
          ? "w-[125px] h-[125px]"
          : "w-[280px] h-[180px] mx-[8px] "
      } ${className}`}
      style={{
        backgroundColor: color || "#f2f2f2",
      }}
    >
      <Image
        source={selectedImage}
        className={` !rounded-full absolute top-4 left-4 ${
          mode === "small" ? "w-10 h-10" : "w-16 h-16"
        }
          contentFit="contain"
          `}
      />

      {mode === "small" && (
        <TouchableOpacity
          onPress={onEdit}
          className="absolute top-4 right-4 p-2 rounded-md"
        >
          <FontAwesome name="pencil" size={16} color="#f2f2f2" />
        </TouchableOpacity>
      )}

      {mode === "small" ? (
        <ThemedView className="absolute top-16 left-4 bg-transparent">
          <ThemedText className=" text-[16px] !text-[#f2f2f2] font-bold">
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

      {/* Balance แยกตำแหน่งตาม mode */}
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
    </ThemedView>
  );
}
