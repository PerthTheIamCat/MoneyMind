import { View } from "react-native";
import React, { useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

export function SemiCircleProgress({
  savings_goal,
  current_savings,
  radius = 100, // รัศมี
  strokeWidth = 15, // ความหนาของเส้นโค้ง
  color = "green", // สีของ Progress
  backgroundColor = "lightgray", // สีพื้นหลังของ Progress
}: {
  savings_goal: number;
  current_savings: number;
  radius?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}) {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const progressValue = useSharedValue(0);

  const percentage = (current_savings / savings_goal) >= 1 ? 100 : (savings_goal > 0 ? (current_savings / savings_goal) * 100 : 0);
  const circumference = Math.PI * radius; // เส้นรอบวงของครึ่งวงกลม
  

  useEffect(() => {
    // Only animate if percentage is less than 100
    if (percentage < 100) {
      progressValue.value = withTiming((percentage / 100) * circumference, {
        duration: 1000,
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Set progress to 100% without animation when it reaches 100
      progressValue.value = (percentage / 100) * circumference;
    }
  }, [percentage]);
  
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progressValue.value,
  }));

  return (
    <View className="justify-center items-center">
      <Svg width={radius * 2} height={radius} viewBox={`0 0 ${radius * 2} ${radius}`}>
        {/* พื้นหลัง Progress */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          transform={`rotate(180, ${radius}, ${radius})`} // หมุน 180 องศาให้เริ่มจากซ้าย
        />

        {/* Animated Progress */}
        <AnimatedCircle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(170, ${radius}, ${radius})`} // หมุน 180 องศาให้เริ่มจากซ้าย
        />
      </Svg>

      {/* เปอร์เซ็นต์ตรงกลาง */}
      <ThemedText className="absolute text-lg font-bold">
        {String(Math.round(percentage))}%
      </ThemedText>
    </View>
  );
}
