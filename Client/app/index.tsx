import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/hooks/conText/AuthContext";

export default function Index() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      if (!auth?.authLoading && !auth?.token) {
        router.replace("/Welcome");
      } else if (!auth?.authLoading && auth?.token && auth?.isPinSet) {
        router.replace("/PinPage");
      } else if (!auth?.authLoading && auth?.token && auth?.pin === null) {
        router.replace("/CreatePinPage");
      }
    }, 1000);
  }, [auth?.authLoading, auth?.token, auth?.isPinSet]);
  return (
    <ThemedView className="flex-1 h-full">
      <ThemedView className="animate-pulse z-10 bg-transparent">
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width: 100,
            height: 100,
          }}
          contentFit="contain"
          onTouchStart={() => router.replace("/(tabs)")}
        />
      </ThemedView>
      <ThemedView className="absolute w-[200px] h-[200px] border-t-4 border-l-4 rounded-full p-5 border-[#2B9348] animate-spin-ease z-0"></ThemedView>
    </ThemedView>
  );
}
