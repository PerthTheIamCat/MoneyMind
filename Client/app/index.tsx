import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function Index() {
  return (
    <ThemedView >
      <ThemedText>WELCOME SCREEN</ThemedText>
      <Link href={"/SignUp"}>Sign Up</Link>
    </ThemedView>
  );
}
