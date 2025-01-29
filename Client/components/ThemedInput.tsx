import {
  TextInput,
  useColorScheme,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ReactNode, useState } from "react";
import * as Localization from "expo-localization";
import Entypo from "@expo/vector-icons/Entypo";

type ThemedTextProps = {
  className?: string;
  title: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  [key: string]: any;
};

export function ThemedInput({
  title,
  error,
  keyboardType,
  className,
  autoComplete,
  secureTextEntry = false,
  onChangeText,
  ...props
}: ThemedTextProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  // console.log("theme: ",theme);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <ThemedView className= {`!justify-start !items-start w-full ${error?"max-h-[95px]":"max-h-20"} mb-5  ` }>
      <ThemedText className="self-start pb-4">{title}</ThemedText>
      <ThemedView className="!justify-start rounded-xl w-[80%] max-h-10 !bg-[#D9D9D9] flex-row ">
        <TextInput
          keyboardType={keyboardType}
          secureTextEntry={isPasswordVisible}
          // style={{ fontFamily }}
          autoComplete={autoComplete}
          onChangeText={onChangeText}
          className={
            `w-[90%] h-10 bg-[#D9D9D9] text-[#2F2F2F] rounded-xl p-2` +
            (className ? ` ${className}` : "")
          }
          {...props}
        />
        {isPasswordVisible && autoComplete === "password" ? (
          <Entypo
            name="eye"
            size={24}
            color="#2F2F2F"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        ) : !isPasswordVisible && autoComplete === "password" ? (
          <Entypo
            name="eye-with-line"
            size={24}
            color="#2F2F2F"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        ) : null}
      </ThemedView>
      {error && (
        <ThemedText className="self-start pl-[2%] pt-4 text-[#FF0000] ">
          {error}
        </ThemedText>
      )}
    </ThemedView>
  );
}
