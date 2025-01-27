import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Localization from 'expo-localization';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '@/global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'SpaceMono': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'Prompt': require('@/assets/fonts/Prompt-Regular.ttf'),
    'NotoSansThai': require('@/assets/fonts/NotoSansThai-VariableFont_wdth,wght.ttf'),
  });
  const locales = Localization.getLocales();
  const currentLanguage = locales[0]?.languageCode;

  const fontFamily = currentLanguage === 'th' ? 'NotoSansThai' : 'Prompt';

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="SignUp"/>
        <Stack.Screen name="SignIn"/>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
