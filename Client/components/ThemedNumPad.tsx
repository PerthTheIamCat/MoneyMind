import React, { useState } from "react";
import { ThemedView } from "./ThemedView";
import { Container, Row, Col } from "react-native-flex-grid";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  useColorScheme,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemedNumPadProps {
  onPress: (value: string) => void;
  onPressBack: () => void;
  onPressBiometric?: () => void; // Should trigger biometric auth, not modify PIN
  haveBiometric?: boolean;
}

export function ThemedNumPad({
  haveBiometric = true,
  onPress,
  onPressBack,
  onPressBiometric,
}: ThemedNumPadProps) {
  const theme = useColorScheme();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  return (
    <ThemedView className="flex justify-center items-center w-full">
      <Container>
        {/* Number Pad Rows */}
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          ["biometric", "0", "backspace"],
        ].map((row, rowIndex) => (
          <Row key={rowIndex} className="mb-10">
            {row.map((value, colIndex) => (
              <Col key={colIndex} className="justify-center items-center">
                {value === "biometric" && haveBiometric ? (
                  <Pressable
                    onPress={() => onPressBiometric && onPressBiometric()}
                  >
                    <FontAwesome5
                      name="fingerprint"
                      size={32}
                      color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
                    />
                  </Pressable>
                ) : value === "backspace" ? (
                  <Pressable onPress={onPressBack}>
                    <FontAwesome5
                      name="backspace"
                      size={32}
                      color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
                    />
                  </Pressable>
                ) : (
                  <TouchableOpacity
                    onPressIn={() => setPressedKey(value)}
                    onPressOut={() => setPressedKey(null)}
                    onPress={() => onPress(value)}
                    style={
                      pressedKey === value
                        ? styles.containerPress
                        : styles.container
                    }
                    disabled={value === "biometric"}
                  >
                    <ThemedText className="text-center text-4xl font-bold">
                      {value === "biometric" ? "" : value}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </Col>
            ))}
          </Row>
        ))}
      </Container>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  containerPress: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },
});
