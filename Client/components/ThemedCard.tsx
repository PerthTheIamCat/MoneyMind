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
  className?: string;
  onEdit?: () => void;
};

export function ThemedCard({
  name,
  balance,
  color,
  mode = "small",
  className,
  onEdit,
}: ThemedCardProps) {
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  return (
        <ThemedView
            className={` !rounded-2xl  !flex-row !justify-start  !items-start mr-3 ${
              mode === "small" ? "w-[125px] h-[125px]" : "w-[240px] h-[200px]"
            } ${color} ${className}`}
        >
        <Image

        source={require("@/assets/logos/LOGO.png")}
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
