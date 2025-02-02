import { ScrollView } from "react-native";
import { useColorScheme } from "react-native";

type ThemedScrollViewProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

export function ThemedScrollView({ children, className, ...props }: ThemedScrollViewProps) {
  const theme = useColorScheme();

  return (
    <ScrollView
      className={
        `flex ${
          theme === "dark" ? "bg-[#2F2F2F]" : "bg-[#F2F2F2]"
        }` + (className ? ` ${className}` : "")
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}