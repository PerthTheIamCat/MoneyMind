import { TextInput, KeyboardTypeOptions, TextInputProps } from "react-native";
import { useState } from "react";
import * as Localization from "expo-localization";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { FontAwesome } from "@expo/vector-icons"; 
import { Image } from "react-native";
import { ThemedScrollView } from "./ThemedScrollView";

type ThemedCardProps = {
    name: string;
    balance: string;
    color?: string;
    mode?: "small" | "large";
    className?: string;
};

export function ThemedCard({
    name,
    balance,
    color = "bg-red-500",
    mode = "small",
    className,
}: ThemedCardProps) {
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  return (
      <ThemedScrollView vertical = {false} horizontal = {true}>
        <ThemedView
            className={` !rounded-lg !p-5 flex-row justify-start gap-5 items-start px-10 bg-blue-500 ${
              mode === "small" ? "w-[170px] h-[170px]" : "w-[240px] h-[200px]"
            } ${color} ${className}`}
        >
        <Image
        source={require("@/assets/logos/LOGO.png")}
        className="w-8 h-8 rounded-full absolute top-2 left-2"
        />
          
        </ThemedView>
      
      </ThemedScrollView>
   

  );
}
