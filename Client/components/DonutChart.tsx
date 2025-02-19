import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Circle, G, Svg } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

export function DonutChart({
  savings_goal,
  current_savings,
}: {
  savings_goal: number;
  current_savings: number;
}) {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const progressValue = useSharedValue(0);

  const percentage =
    savings_goal > 0 ? (current_savings / savings_goal) * 100 : 0;

  const CIRCUMFERANCE = 700;
  const R = CIRCUMFERANCE / (2 * Math.PI);
  const STROKE_WIDTH = 30;
  const HALF_CIRCLE = R + STROKE_WIDTH;
  const DIAMETER = HALF_CIRCLE * 2;
  const offset = CIRCUMFERANCE * (1 - percentage / 100);

  // อัปเดต Animation เมื่อค่า percentage เปลี่ยน
  useEffect(() => {
    progressValue.value = withTiming(offset, {
      duration: 1000, // ความเร็ว Animation (1 วินาที)
      easing: Easing.out(Easing.ease), // ทำให้ลื่นขึ้น
    });
  }, [offset]);

  // ใช้ Animated Props เพื่ออัปเดต strokeDashoffset
  const animationProps = useAnimatedProps(() => ({
    strokeDashoffset: progressValue.value,
  }));

  return (
    <View className="justify-center items-center">
      <Svg
        width={DIAMETER}
        height={DIAMETER}
        viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}
      >
        <G>
          <AnimatedCircle
            fill="transparent"
            stroke="lightgray"
            r={R}
            cx="50%"
            cy="50%"
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedCircle
            animatedProps={animationProps}
            fill="transparent"
            stroke="green"
            r={R}
            cx="50%"
            cy="50%"
            strokeWidth={STROKE_WIDTH}
            //strokeLinecap="round"
            strokeDasharray={CIRCUMFERANCE}
          />
        </G>
      </Svg>
      <ThemedText className=" absolute text-6xl font-bold" >
      {percentage}%
      </ThemedText>
    </View>
  );
}
