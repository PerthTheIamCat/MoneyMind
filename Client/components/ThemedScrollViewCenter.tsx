import { ScrollView, View, Dimensions, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";

type ThemedScrollViewProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8 + 8; // ขนาดของแต่ละ item
const SPACING = (width - ITEM_WIDTH) / 2; // เว้นระยะให้ item อยู่ตรงกลาง

export function ThemedScrollViewCenter({ children, className, ...props }: ThemedScrollViewProps) {
  const theme = useColorScheme();

  return (
    <ScrollView
      horizontal
      pagingEnabled
      snapToInterval={ITEM_WIDTH} // ใช้ snapToInterval กับ ITEM_WIDTH
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: SPACING }}
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
