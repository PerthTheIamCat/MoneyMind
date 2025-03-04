import { View } from "react-native";
import React, { useEffect } from "react";
import Svg, { Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

export function LinearBar({
  savings_goal,
  current_savings,
  width = 300,
  height = 25,
}: {
  savings_goal: number;
  current_savings: number;
  width?: number;
  height?: number;
}) {
  const AnimatedRect = Animated.createAnimatedComponent(Rect);
  const progressValue = useSharedValue(0);

  const formatPercentage = (percentage: number) => {
    return percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);
  };

  const percentage = savings_goal > 0 ? (current_savings / savings_goal) * 100 : 0;
  const progressWidth = (percentage / 100) * width;

  useEffect(() => {
    progressValue.value = withTiming(progressWidth, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
  }, [progressWidth]);

  const animatedProps = useAnimatedProps(() => ({
    width: progressValue.value,
    fill: interpolateColor(
      progressValue.value,
      [0, width],
      ["red", "green"]
    ),
  }));

  return (
    <View className="justify-center items-center">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="15"
          fill="lightgray"
          stroke="black"
          strokeWidth="1"
        />
        
        <AnimatedRect
          x="0"
          y="0"
          height={height}
          rx="15"
          animatedProps={animatedProps}
        />
      </Svg>
  
      <ThemedText className="absolute text-lg font-bold">
        {formatPercentage(percentage)}%
      </ThemedText>
    </View>
  );
}
