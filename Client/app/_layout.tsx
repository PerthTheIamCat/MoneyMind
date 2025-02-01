import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Localization from "expo-localization";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TermsProvider } from "@/hooks/auth/TermsConText";
import { ServerProvider } from "@/hooks/auth/ServerConText";
import "@/global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    Prompt: require("@/assets/fonts/Prompt-Regular.ttf"),
    NotoSansThai: require("@/assets/fonts/NotoSansThai-VariableFont_wdth,wght.ttf"),
  });
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;

  const fontFamily = currentLanguage === "th" ? "NotoSansThai" : "Prompt";

  const theme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ServerProvider>
      <TermsProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme === "dark" ? "#2F2F2F" : "#F2F2F2",
            },
            headerTintColor: theme === "dark" ? "#F2F2F2" : "#2F2F2F",
            headerTitleStyle: {
              fontFamily,
            },
            animation: "slide_from_right",
            headerBackTitle: "back",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" options={{ headerShown: false }} />
          <Stack.Screen
            name="terms_and_con"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerTitle: "Terms and Conditions",
            }}
          />
          <Stack.Screen name="OTP" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </TermsProvider>
    </ServerProvider>
  );
}
