import React from "react";
import { ThemedView } from "./ThemedView";
import { Container, Row, Col } from "react-native-flex-grid";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemedNumPadProps {
  onPress: (value: string) => void;
  onPressBack: () => void;
  onPressBiometric?: () => void;
  haveBiometric?: boolean;
  [key: string]: any;
}

export function ThemedNumPad({
  haveBiometric = true,
  onPress,
  onPressBack,
  onPressBiometric,
  ...props
}: ThemedNumPadProps) {
  const theme = useColorScheme();
  const textClassName =
    "text-center text-4xl font-bold " +
    (theme === "dark" ? "text-[#F2F2F2]" : "text-[#2F2F2F]");
  const rowClassName = "py-[5%]";
  const colClassName = "items-center";
  const pressableClassName = "active:scale-150";

  return (
    <ThemedView className="flex flex-wrap flex-row justify-center">
      <Container>
        <Row className={rowClassName}>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("1")}
            >
              <ThemedText className={textClassName}>1</ThemedText>
            </Pressable>
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("2")}
            >
              <ThemedText className={textClassName}>2</ThemedText>
            </Pressable>
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("3")}
            >
              <ThemedText className={textClassName}>3</ThemedText>
            </Pressable>
          </Col>
        </Row>
        <Row className={rowClassName}>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("4")}
            >
              <ThemedText className={textClassName}>4</ThemedText>
            </Pressable>
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("5")}
            >
              <ThemedText className={textClassName}>5</ThemedText>
            </Pressable>
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("6")}
            >
              <ThemedText className={textClassName}>6</ThemedText>
            </Pressable>
          </Col>
        </Row>
        <Row className={rowClassName}>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("7")}
            >
              <ThemedText className={textClassName}>7</ThemedText>
            </Pressable>
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("8")}
            >
              <ThemedText className={textClassName}>8</ThemedText>
            </Pressable>
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("9")}
            >
              <ThemedText className={textClassName}>9</ThemedText>
            </Pressable>
          </Col>
        </Row>
        <Row className={rowClassName}>
          <Col className="items-center">
            {haveBiometric && (
              <Pressable
                className={pressableClassName}
                onPress={onPressBiometric}
              >
                <FontAwesome5
                  name="fingerprint"
                  size={32}
                  color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
                />
              </Pressable>
            )}
          </Col>
          <Col>
            <Pressable
              className={pressableClassName}
              onPress={() => onPress("0")}
            >
              <ThemedText className={textClassName}>0</ThemedText>
            </Pressable>
          </Col>
          <Col className="items-center">
            <Pressable className={pressableClassName} onPress={onPressBack}>
              <FontAwesome5
                name="backspace"
                size={32}
                color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
              />
            </Pressable>
          </Col>
        </Row>
      </Container>
    </ThemedView>
  );
}
