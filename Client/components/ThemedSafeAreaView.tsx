import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useColorScheme,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { ReactNode, useEffect, useState } from "react";

export type ThemedSafeAreaViewProps = {
  children?: ReactNode;
  color?: string;
};

export function ThemedSafeAreaView({
  children,
  color,
}: ThemedSafeAreaViewProps) {
  const theme = useColorScheme();
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: color
            ? color
            : theme === "dark"
            ? "#2F2F2F"
            : "#F2F2F2",
        }}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: color
              ? color
              : theme === "dark"
              ? "#2F2F2F"
              : "#F2F2F2",
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: color
                ? color
                : theme === "dark"
                ? "#2F2F2F"
                : "#F2F2F2",
            }}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
