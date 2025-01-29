import { Text, useColorScheme } from "react-native";
import { ReactNode } from "react";
import * as Localization from 'expo-localization';

type ThemedTextProps = {
  children: ReactNode;
  className?: string;
  [key: string]: any;
};

export function ThemedText({ children, className, ...props }: ThemedTextProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  // console.log("theme: ",theme);

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === 'th' ? 'NotoSansThai' : 'Prompt';

  return (
    <Text
      // style={{ fontFamily }}
      className={
        `${theme === "dark" ? "text-[#F2F2F2]" : "text-[#2F2F2F]"}` +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      {children}
    </Text>
  );
}
