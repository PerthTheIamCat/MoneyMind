import React, { useContext } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { TermsContext } from "@/hooks/auth/TermsConText"; 
import { router } from "expo-router";

export default function terms_and_con() {
  const { setIsAccepted } = useContext(TermsContext);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedText>TEST I WELL GET YOUR INFORMATION!!!</ThemedText>
        <ThemedButton onPress={() => {setIsAccepted(true);router.back()}} className="mt-4 w-[80%] h-10" mode="confirm">
          Accept All
        </ThemedButton>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
