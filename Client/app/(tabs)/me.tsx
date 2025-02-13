import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { useContext } from "react";
import { router } from "expo-router";

export default function Index() {
  const auth = useContext(AuthContext);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedText>Edit app/me.tsx to edit this screen.</ThemedText>
        <ThemedText> This is me page </ThemedText>
        <ThemedButton
          className="w-96 h-96"
          mode="cancel"
          textClassName="text-8xl"
          onPress={() => {
            auth?.logout();
            router.replace("/Welcome");
          }}
        >
          Logout
        </ThemedButton>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
