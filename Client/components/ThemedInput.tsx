import { TextInput, KeyboardTypeOptions, TextInputProps } from "react-native";
import { useState } from "react";
import * as Localization from "expo-localization";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Entypo from "@expo/vector-icons/Entypo";

type ThemedInputProps = {
  className?: string;
  error?: string;
  title: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  [key: string]: any;
};

export function ThemedInput({
  error,
  keyboardType,
  title,
  className,
  autoComplete,
  secureTextEntry = true,
  onChangeText,
  ...props
}: ThemedInputProps) {
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(secureTextEntry);

  return (
    <ThemedView className="w-full">
      <ThemedText className="text-xl font-bold w-full">{title}</ThemedText>
      <ThemedView className="w-full flex-row">
        <TextInput
          keyboardType={keyboardType}
          secureTextEntry={isPasswordVisible}
          autoComplete={autoComplete}
          onChangeText={onChangeText}
          className={`h-10 bg-[#D9D9D9] text-[#2F2F2F] rounded-xl p-2 ${className}`}
          {...props}
        />
        {autoComplete === "password" ? (
          isPasswordVisible ? (
            <Entypo onPress={()=>setIsPasswordVisible(!isPasswordVisible)} className="px-2 absolute right-2" name="eye" size={24} color="black" />
          ) : (
            <Entypo onPress={()=>setIsPasswordVisible(!isPasswordVisible)} className="px-2 absolute right-2" name="eye-with-line" size={24} color="black" />
          )
        ) : null}
      </ThemedView>
      {error ? (
        <ThemedText className="text-red-500 w-full">{error}</ThemedText>
      ) : null}
    </ThemedView>
  );
}
