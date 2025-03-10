import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext,useEffect,useRef } from "react";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { useWindowDimensions,  Animated,useAnimatedValue } from "react-native";
import { View } from "react-native";

export default function Welcome() {
  const auth = useContext(AuthContext);
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width > 500; // ตรวจสอบว่าจอใหญ่กว่า 600px หรือไม่
  
  const fadeAnim = useAnimatedValue(0);

  const translateY = useRef(new Animated.Value(200)).current;
  const translateX = useRef(new Animated.Value(200)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const ab = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
      
    }).start();

    Animated.timing(translateY, {
      toValue: 0, // ขยับไปตำแหน่งเริ่มต้น (0)
      duration: 2000,
      useNativeDriver: true,
    }).start();
  
    Animated.timing(translateX, {
      toValue: 0, // ขยับไปตำแหน่งเริ่มต้น (0)
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3, // ค่ามากขึ้น = ลดแรงเด้ง ทำให้ขึ้นช้าลง
      tension: 10, // ค่าน้อยลง = ชะลอการขยายให้ smooth ขึ้น
      delay: 1000, 
      useNativeDriver: true,
    }).start();
    
    Animated.timing(ab, {
      toValue: 100,
      duration: 1000, // ค่ามากขึ้น = ลดแรงเด้ง ทำให้ขึ้นช้าลง 
      delay: 1500, 
      useNativeDriver: true,
    }).start();

  
  }, []);


  return (
      <ThemedScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 5,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View className="bg-green-700 w-10  h-10 absolute top-44 rounded-full" style={{transform: [{ scale: ab }] }} >
          
        </Animated.View>
        <ThemedView className="items-center w-full  bg-transparent">
          <Animated.View style={{ opacity: fadeAnim ,transform: [{ scale: scaleAnim }] }}>
            <Image
              source={require("@/assets/logos/LOGO.png")}
              style={{
                width: isLargeScreen ? 400 : width < 380 ? 200 : 250,
                height: isLargeScreen ? 500 : width < 380 ? 300 : 350,
              }}
              contentFit="contain"
              />
          </Animated.View>
          <ThemedView className="!items-start w-full px-6 text-center pl-10 bg-transparent">
            <ThemedText
              className="text-5xl mb-10 !text-[#fff]"
              style={{ fontSize: isLargeScreen ? 56 : width < 380 ? 32 : 46 }}
            >
              MoneyMind
            </ThemedText>
            <ThemedText
              className="text-wrap font-bold !text-[#fff]"
              style={{
                fontSize: isLargeScreen ? 30 : width < 380 ? 16: 24,
                maxWidth: isLargeScreen ? 250 : width < 380 ? 160 : 200,
              }}
            >
              Unlock Your Financial Dreams Empowering Your Journey to Wealth and Freedom
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row gap-5 w-full justify-center mt-28 mb-10 bg-transparent">
            <ThemedButton
              style={{
                width: isLargeScreen ? 200 : width < 380 ? 140 : 160,
                height: isLargeScreen ? 60 : width < 380 ? 40 : 50,
              }}
              mode="normal"
              onPress={() => router.push("/SignIn")}
            >
              Sign In
            </ThemedButton>
            <ThemedButton
              style={{
                width: isLargeScreen ? 170 : width < 380 ? 140 : 160,
                height: isLargeScreen ? 60 : width < 380 ? 40 : 50,
              }}
              mode="confirm"
              onPress={() => router.push("/SignUp")}
            >
              Sign Up
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </ThemedScrollView>
  );
}
