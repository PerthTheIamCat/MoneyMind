import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <ThemedView className="!justify-start">
      <Image source={require('@/assets/logos/LOGO.png')} style={{ width: '80%', height:400, marginTop: 100 }} contentFit="contain"/>
      <ThemedText>WELCOME SCREEN</ThemedText>
      <Link href={"/SignUp"}>Sign Up</Link>
    </ThemedView>
  );
}