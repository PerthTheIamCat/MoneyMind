import { TextInput, KeyboardTypeOptions, TextInputProps } from "react-native";
import { useState } from "react";
import * as Localization from "expo-localization";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Entypo from "@expo/vector-icons/Entypo";

type ThemedInputProps = {
  className?: string;
  error?: string;
  title?: string;
  unit?: string;
  value?: string;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  [key: string]: any;
};

export function ThemedInputHorizontal({
  error,
  keyboardType,
  title,
  unit,
  className,
  autoComplete,
  placeholder,
  editable = true,
  secureTextEntry = false,
  value,
  onChangeText,
  ...props
}: ThemedInputProps) {
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  const [isPasswordVisible, setIsPasswordVisible] =
    useState<boolean>(secureTextEntry);

  return (
    <ThemedView className={`!justify-start !items-start ${className} w-full`}>
      <ThemedView className="!justify-between  flex-row bg-transparent w-full">
        {title ? (
          <ThemedText className="text-sm font-bold bg-transparent min-w-[130px]">
            {title}
          </ThemedText>
        ) : null}
        <ThemedView className="bg-transparent mt-5">
          <TextInput
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={isPasswordVisible}
            autoComplete={autoComplete}
            onChangeText={onChangeText}
            editable={editable}
            value={value}
            className={`h-10 bg-[#D9D9D9] text-[#2F2F2F] rounded-xl w-40 px-2`}
            {...props}
          />
          <ThemedText className="text-red-500 w-full">{error}</ThemedText>
        </ThemedView>
        <ThemedText className="text-sm font-bold bg-transparent min-w-[75px]">
          {unit}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
