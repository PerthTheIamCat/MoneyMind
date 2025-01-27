import { TouchableOpacity, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import { ReactNode } from "react";
import * as Localization from "expo-localization";

type ThemedTextProps = {
  mode?: "normal" | "cancel" | "confirm";
  children: ReactNode;
  className?: string;
  [key: string]: any;
};

export function ThemedButton({
  mode = "normal",
  children,
  className,
  ...props
}: ThemedTextProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  // console.log("theme: ",theme);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";

  return (
    <TouchableOpacity
      // style={{ fontFamily }}
      className={
        ` ${
          mode === "normal"
            ? "bg-[#B1A7A6]"
            : mode === "cancel"
            ? "bg-[#C93540]"
            : mode === "confirm"
            ? "bg-[#2B9348]"
            : ""
        }` +
        ` min-w-[150px] max-w-[200px] w-[25%] p-5 rounded-[25px]` +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      <ThemedText
        className={`text-center font-bold ${mode === "normal" ? "!text-[#2F2F2F]" : " "}`}
      >
        {children}
      </ThemedText>
    </TouchableOpacity>
  );
}
