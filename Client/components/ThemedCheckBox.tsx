import { Text, useColorScheme } from "react-native";
import { ThemedView } from "./ThemedView";
import CheckBox from "expo-checkbox";
import { ReactNode, useState } from "react";
import * as Localization from "expo-localization";

type ThemedCheckBoxProps = {
  children: ReactNode;
  className?: string;
  onValueChange?: (value: boolean) => void;
  [key: string]: any;
};

export function ThemedCheckBox({
  children,
  className,
  ...props
}: ThemedCheckBoxProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  const [isChecked, setChecked] = useState<boolean>(false);
  // console.log("theme: ",theme);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";

  return (
    <CheckBox
      color={"#2B9348"}
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
  );
}
