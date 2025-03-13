import { ScrollView, View, Dimensions, StyleSheet, useWindowDimensions } from "react-native";
import { useColorScheme } from "react-native";

type ThemedScrollViewProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};


export function ThemedScrollViewCenter({ children, className, ...props }: ThemedScrollViewProps) {
  const theme = useColorScheme();
  const { width } = useWindowDimensions(); // ใช้ useWindowDimensions เพื่อให้รับค่าขนาดหน้าจอที่อัพเดทได้

  // กำหนดขนาด ITEM_WIDTH แบบ responsive
  const ITEM_WIDTH = width > 600 ? width * 0.37 : width * 0.73; // ถ้าหน้าจอกว้างกว่า 600px (แท็บเล็ตหรืออุปกรณ์ที่ใหญ่กว่า) ให้ขนาดเล็กลง

  const SPACING = (width - ITEM_WIDTH) / 2; // เว้นระยะให้ item อยู่ตรงกลาง

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
