import { View, useColorScheme } from "react-native";
import { ReactNode } from "react";

type ThemedViewProps = {
  children?: ReactNode;
  className?: string;
  [key: string]: any;
};

export function ThemedView({ children, className, ...props }: ThemedViewProps) {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  // console.log("theme: ",theme);

  return (
    <View
      className={
        `flex-1 justify-center items-center ${
          theme === "dark" ? "bg-[#2F2F2F]" : "bg-[#F2F2F2]"
        }` + (className ? ` ${className}` : "")
      }
      {...props}
    >
      {children}
    </View>
  );
}
