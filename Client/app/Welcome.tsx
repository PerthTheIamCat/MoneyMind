import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useContext,useEffect,useRef } from "react";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { useWindowDimensions,  Animated,useAnimatedValue } from "react-native";

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync()


export default function Welcome() {

  const [fontsLoaded] = useFonts({
    "PlusJakartaSans": require("../assets/fonts/PlusJakartaSans-Italic.ttf"),
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Poppins": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "PlusJakartaSans-wght": require("../assets/fonts/PlusJakartaSans-wght.ttf"),
  });

  const auth = useContext(AuthContext);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 500; // ตรวจสอบว่าจอใหญ่กว่า 600px หรืrrอไม่
  
  const fadeAnim = useAnimatedValue(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounding = useRef(new Animated.Value(0)).current;
  const trany= useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 2000, 
      useNativeDriver: true,
      
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3, // ค่ามากขึ้น = ลดแรงเด้ง ทำให้ขึ้นช้าลง
      tension: 10, // ค่าน้อยลง = ชะลอการขยายให้ smooth ขึ้น
      delay: 1000, 
      useNativeDriver: true,
    }).start();
    
    Animated.timing(bounding, {
      toValue: 6,
      duration: 1000, // ค่ามากขึ้น = ลดแรงเด้ง ทำให้ขึ้นช้าลง 
      delay: 1500, 
      useNativeDriver: true,
    }).start();

    Animated.timing(trany, {
      toValue: 0,
      delay: 2000, 
      useNativeDriver: true,
    }).start();
  }, []);

  const bounding1 = bounding;
  const bounding2 = bounding.interpolate({
    inputRange: [0,3], // เริ่มช้ากว่า
    outputRange: [0,5], // ค้างไว้ที่ 0 ก่อน แล้วค่อยโตขึ้น
    extrapolate: "clamp",
  });
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
        <Animated.View className="bg-green-200 w-96  h-96 absolute top-[10%] rounded-full" style={{transform: [{ scale: bounding2 }] }} >
        </Animated.View>
        <Animated.View className="bg-green-700  w-96  h-96  absolute top-[10%] rounded-full" style={{transform: [{ scale: bounding1 }] }} >
        </Animated.View>
        {/* <Animated.View className="bg-slate-200  w-[100%]  h-[60%]  absolute bottom-0 rounded-t-[10%]" style={{transform:[{translateY:trany}]}} >
        </Animated.View> */}
          
        <ThemedView className="items-center w-full  absolute top-[5%] bg-transparent">
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image
              source={require("@/assets/logos/LOGO.png")}
              style={{
                width: isLargeScreen ? 400 : width < 380 ? 200 : 250,
                height: isLargeScreen ? 500 : width < 380 ? 300 : 350,
              }}
              contentFit="contain" 
              />
          </Animated.View>
        </ThemedView>

          <ThemedView className="!items-start w-full px-6 absolute top-[45%] text-center pl-10 bg-transparent">
            <Animated.View style={{opacity:fadeAnim }}>
              <ThemedText
                className="mb-5  !text-[#fff]"
                style={{ fontSize: isLargeScreen ? 56 : width < 380 ? 35 : 42 ,
                  fontFamily: 'Poppins' ,
                }}
              >
                MONEYMIND
              </ThemedText>
              <ThemedText
                className="!text-[#fff]"
                style={{
                  fontSize: isLargeScreen ? 30 : width < 380 ? 22: 24,
                  maxWidth: isLargeScreen ? 250 : width < 380 ? 250 : 300,
                  fontFamily: 'PlusJakartaSans-wght',
                }}
                >
                UNLOCK Your Financial Dreams Empowering Your Journey to Wealth and Freedom
              </ThemedText>
            </Animated.View>
          </ThemedView>

          <Animated.View style={{opacity:fadeAnim }}  className="flex-row gap-5 w-full absolute bottom-[5%] justify-center  mt-28 mb-10 bg-transparent">
            <ThemedButton
              style={{
                width: isLargeScreen ? 200 : width < 380 ? 140 : 160,
                height: isLargeScreen ? 60 : width < 380 ? 40 : 50,
                fontFamily: 'PlusJakartaSans-wght',
                backgroundColor: '#000000',
              }}
              onPress={() => router.push("/SignIn")}
              >
              <ThemedText style={{ color: "#FFF", fontFamily: "Poppins" }}>
                  Sign In
              </ThemedText>
            </ThemedButton>
              <ThemedButton
                style={{
                  width: isLargeScreen ? 200 : width < 380 ? 140 : 160,
                  height: isLargeScreen ? 60 : width < 380 ? 40 : 50,
                  backgroundColor: '#16db65',
                }}
                colorbutton="#1111"
                onPress={() => router.push("/SignUp")}
                >
                <ThemedText style={{ color: "#000", fontFamily: "Poppins" }}>
                  Sign Up
                </ThemedText>
              </ThemedButton>
          </Animated.View>
      </ThemedScrollView>
  );
}
