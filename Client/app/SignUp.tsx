import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
export default function Index() {
  return (
    <ThemedView >
      <ThemedText>SignUp SCREEN</ThemedText>
      <Link href={"/(tabs)"}>Sign Up</Link>
    </ThemedView>
  );
}
