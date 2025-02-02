import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PropsWithChildren, ReactNode } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

type Props = PropsWithChildren<{
  isVisible?: boolean;
  children?: ReactNode;
  onClose: () => void;
}>;

export function ThemedModal({ isVisible, children, onClose }: Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <ThemedView>
        <ThemedText>
          This is a modal with some text and a close button.
        </ThemedText>
      </ThemedView>
    </Modal>
  );
}