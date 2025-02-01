import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';

export default function Index() {
  return (
    <ThemedSafeAreaView>
      <ThemedView >
        <ThemedText>Edit app/Transaction.tsx to edit this screen.</ThemedText>
        <ThemedText> This is Transaction page </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
