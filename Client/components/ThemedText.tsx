import { Text, useColorScheme } from "react-native";
import { ReactNode } from "react";

type ThemedTextProps = {
  children: ReactNode;
  className?: string;
  [key: string]: any;
};

export function ThemedText({ children, className, ...props }: ThemedTextProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  // console.log("theme: ",theme);

  return (
    <Text
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
