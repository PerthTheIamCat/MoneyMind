import {
  TextInput,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import { useState } from "react";
import * as Localization from "expo-localization";

type ThemedInputProps = {
  className?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  [key: string]: any;
};

export function ThemedInput({
  error,
  keyboardType,
  className,
  autoComplete,
  secureTextEntry = false,
  onChangeText,
  ...props
}: ThemedInputProps) {

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TextInput
      keyboardType={keyboardType}
      secureTextEntry={isPasswordVisible}
      // style={{ fontFamily }}
      autoComplete={autoComplete}
      onChangeText={onChangeText}
      className={
        `h-10 bg-[#D9D9D9] text-[#2F2F2F] rounded-xl p-2` +
        (className ? ` ${className}` : "")
      }
      {...props}
    />
  );
}
