import React, { ReactNode, useState, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  UIManager,
  View,
  TouchableOpacity,
  useColorScheme,
  Text,
} from "react-native";
import * as Localization from "expo-localization";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Entypo from "@expo/vector-icons/Entypo";

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
};

// สำหรับ Android เปิด experimental API ของ LayoutAnimation ถ้าจำเป็น
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
    if (isOpen) {
      // Animate ปิด (slide up) แล้ว set state หลังจบ animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false, // animate height ต้องใช้ false
      }).start(() => {
        setIsOpen(false);
      });
    } else {
      // set state true แล้ว animate เปิด (slide down)
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  // กำหนดค่า interpolate สำหรับ height ของ content
  // (ปรับ outputRange ให้เหมาะกับความสูงของเนื้อหาที่ต้องการแสดง)
  const heightInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <View style={{ marginVertical: 8 }} {...props}>
      <ThemedText className="text-[#2B9348] text-xl font-bold text-center">
        Social Security Fund
      </ThemedText>
      <ThemedView className=" flex-row !justify-between">
        <ThemedView
          key={"interest1"}
          className="w-full flex flex-row justify-around"
        >
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
        <View>{children}</View>
      </Animated.View>
    </View>
  );
};
