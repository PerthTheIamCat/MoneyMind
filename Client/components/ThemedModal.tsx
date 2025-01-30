import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function ThemedModal({ isVisible, children, onClose }: Props) {
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