import React, { ReactNode, useState, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  UIManager,
  View,
  useColorScheme,
} from "react-native";
import * as Localization from "expo-localization";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Entypo from "@expo/vector-icons/Entypo";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onToggle?: (isOpen: boolean) => void;
  [key: string]: any;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  className,
  disabled,
  onToggle,

  ...props
}) => {
  const theme = useColorScheme();
  const textColor = theme === "dark" ? "#F2F2F2" : "#2F2F2F";
  const bgColor = theme === "dark" ? "#2F2F2F" : "#F2F2F2";

  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;
  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";

  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleSection = () => {
    if (disabled) return;

    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        setIsOpen(false);
        onToggle && onToggle(false);
      });
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        onToggle && onToggle(true);
      });
    }
  };

  const childrenCount = React.Children.count(children) + 1;
  const maxHeight = childrenCount * 65;
  const heightInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
  });

  return (
    <View style={{ marginVertical: 8, opacity: disabled ? 0.5 : 1 }} {...props}>
      <ThemedText className="!text-[#2B9348] text-xl font-bold text-center">
        {title}
      </ThemedText>
      <ThemedView className="flex-row !justify-between">
        <ThemedView key={title} className="w-full flex flex-row justify-around">
          <View className={`bg-[${textColor}] w-[40%] h-1`} />
          <View className={`rounded-full bg-[${textColor}]`}>
            {!isOpen ? (
              <Entypo
                name="plus"
                size={44}
                color={bgColor}
                onPress={toggleSection}
              />
            ) : (
              <Entypo
                name="minus"
                size={44}
                color={bgColor}
                onPress={toggleSection}
              />
            )}
          </View>
          <View className={`bg-[${textColor}] w-[40%] h-1`} />
        </ThemedView>
      </ThemedView>
      <Animated.View style={{ height: heightInterpolate, overflow: "hidden" }}>
        <View className="min-h-10">{children}</View>
      </Animated.View>
    </View>
  );
};
