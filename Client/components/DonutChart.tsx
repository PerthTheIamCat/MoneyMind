import { View, Text } from "react-native";
import React from "react";
import { Circle, G, Svg } from "react-native-svg";

export function DonutChart({
  savings_goal,
  current_savings,
}: {
  savings_goal: number;
  current_savings: number;
}) {
  const percentage =
    savings_goal > 0 ? (current_savings / savings_goal) * 100 : 0;

  const CIRCUMFERANCE = 700;
  const R = CIRCUMFERANCE / (2 * Math.PI);
  const STROKE_WIDTH = 30;
  const HALF_CIRCLE = R + STROKE_WIDTH;
  const DIAMETER = HALF_CIRCLE * 2;
  const offset = CIRCUMFERANCE * (1 - percentage / 100);

  return (
    <View>
      <Svg
        width={DIAMETER}
        height={DIAMETER}
        viewBox={`0 0 ${DIAMETER} ${DIAMETER}`}
      >
        <G>
          <Circle
            fill="transparent"
            stroke="lightgray"
            r={R}
            cx="50%"
            cy="50%"
            strokeWidth={STROKE_WIDTH}
          />
          <Circle
            fill="transparent"
            stroke="green"
            r={R}
            cx="50%"
            cy="50%"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERANCE}
            strokeDashoffset={offset}
          />
        </G>
      </Svg>
    </View>
  );
}
