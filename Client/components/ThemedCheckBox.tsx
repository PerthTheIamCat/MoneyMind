import { Text, useColorScheme } from "react-native";
import { ThemedView } from "./ThemedView";
import CheckBox from "expo-checkbox";
import { ReactNode, useState } from "react";
import * as Localization from "expo-localization";
import { ThemedText } from "./ThemedText";

type ThemedCheckBoxProps = {
  className?: string;
  textClassName?: string;
  onValueChange?: (value: boolean) => void;
  children?: ReactNode;
  color?: string;
  [key: string]: any;
};

export function ThemedCheckBox({ className, color, textClassName, onValueChange, children, ...props }: ThemedCheckBoxProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  const [isChecked, setChecked] = useState<boolean>(false);
  // console.log("theme: ",theme);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";

  return (
    <ThemedView className={`flex-row w-full !justify-start gap-2 ${ className ? ` ${className}` : "" }`}>
      <CheckBox
        color={color}
        style={{
          borderColor: `${theme === "dark" ? "#F2F2F2" : "#2F2F2F"}`,
          borderRadius: 5,

        }}
        
        value={isChecked}
        onValueChange={(value) => {
          setChecked(value);
          props.onValueChange && props.onValueChange(value);
        }}
      />
      <ThemedText className={`text-[10px] ${textClassName || ""}`}>
        {children}
      </ThemedText>
    </ThemedView>
  );
}
