import { View } from "react-native";
import React, { useEffect } from "react";
import Svg, { Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

export function LinearBar({
  savings_goal,
  current_savings,
  width = 300, // กำหนดความกว้างของ Progress Bar
  height = 25, // กำหนดความสูงของ Progress Bar
}: {
  savings_goal: number;
  current_savings: number;
  width?: number;
  height?: number;
}) {
  const AnimatedRect = Animated.createAnimatedComponent(Rect);
  const progressValue = useSharedValue(0);

  const percentage = savings_goal > 0 ? (current_savings / savings_goal) * 100 : 0;
  const progressWidth = (percentage / 100) * width; // คำนวณความยาวของ Progress Bar

  // อัปเดต Animation เมื่อค่า percentage เปลี่ยน
  useEffect(() => {
    progressValue.value = withTiming(progressWidth, {
      duration: 1000, // ความเร็ว Animation (1 วินาที)
      easing: Easing.out(Easing.ease), // ทำให้ลื่นขึ้น
    });
  }, [progressWidth]);

  // ใช้ Animated Props เพื่ออัปเดตความกว้างของ Progress Bar
  const animatedProps = useAnimatedProps(() => ({
    width: progressValue.value,
  }));

  return (
    <View className="justify-center items-center">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background Progress Bar + Border */}
        <Rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="15"
          fill="lightgray"
          stroke="black"  // ขอบดำ
          strokeWidth="1" // ความหนาของขอบ
        />
        
        {/* Animated Progress */}
        <AnimatedRect
          x="0"
          y="0"
          height={height}
          rx="15"
          fill="green"
          animatedProps={animatedProps}
        />
      </Svg>
  
      {/* แสดงเปอร์เซ็นต์ตรงกลาง */}
      <ThemedText className="absolute text-lg font-bold">
        {String(Math.round(percentage))}%
      </ThemedText>
    </View>
  );
}