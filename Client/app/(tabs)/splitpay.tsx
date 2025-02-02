import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';

export default function Index() {
  return (
    <ThemedSafeAreaView>
      <ThemedView >
        <ThemedText>Edit app/splitpay.tsx to edit this screen.</ThemedText>
        <ThemedText> This is splitpay page </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}