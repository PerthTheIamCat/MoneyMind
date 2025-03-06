import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Image,
  View,
  useColorScheme,
  Animated,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedCard } from "@/components/ThemedCard";
import BudgetSkeleton from "@/components/BudgetSkeleton";
import { ThemedInput } from "@/components/ThemedInput";

import { addSplitpay, getSplitpay } from "@/hooks/auth/SplitpayHandler";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { resultObject } from "@/hooks/auth/GetUserBank";

import Slider from "@react-native-community/slider";
import { get } from "http";

interface SplitPayProps {
  user_id: number;
  account_id: number;
  split_name: string;
  amount_allocated: number;
  remaining_balance: number;
  color_code: string;
  icon_id: number;
}

const colors = [
  "#BE81FF",
  "#00AAFF",
  "#000DFF",
  "#12DA00",
  "#F0EA45",
  "#FFC300",
  "#DD2929",
];

const icons: { [key: number]: JSX.Element } = {
  1: <MaterialCommunityIcons name="food-fork-drink" size={24} color="black" />,
  2: <MaterialCommunityIcons name="shopping" size={24} color="black" />,
  3: <MaterialCommunityIcons name="car" size={24} color="black" />,
  4: <MaterialCommunityIcons name="home" size={24} color="black" />,
  5: <MaterialCommunityIcons name="medical-bag" size={24} color="black" />,
  6: <MaterialCommunityIcons name="school" size={24} color="black" />,
  7: <MaterialCommunityIcons name="movie" size={24} color="black" />,
};

export default function SplitPay() {
  const theme = useColorScheme();

  const [name_error, setNameError] = useState<string>("");
  const [limit_error, setLimitError] = useState<string>("");

  const [page, setPage] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [Budgets, setBudgets] = useState<SplitPayProps[] | null>(null);
  const [selectColor, setSelectColor] = useState<string>("");
  const [selectIcon, setSelectIcon] = useState<number>(0);
  const [limitValue, setLimitValue] = useState<number>(100);
  const [inputLimitValue, setInputLimitValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { bank, userID } = useContext(UserContext);
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);

  const animation = useRef(new Animated.Value(0)).current;
  const componentColor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
  const screenWidth = Dimensions.get("window").width; // ✅ ความกว้างของหน้าจอ
  const cardWidth = 280; // ✅ ความกว้างของ Card
  const cardMargin = 18; // ✅ Margin ระหว่างการ์ด
  const snapToInterval = cardWidth + cardMargin * 2; // ✅ ระยะ snap ให้เป๊ะ

  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedCard, setSelectedCard] = useState<resultObject | null>(null);
  const [cardPositions, setCardPositions] = useState<
    { id: number; x: number }[]
  >([]);

  useEffect(() => {
    // Animate the value to the new page value with a duration of 150ms
    Animated.timing(animation, {
      toValue: page,
      duration: 75,
      useNativeDriver: false,
    }).start();
  }, [page]);

  // Interpolate the animated value to a percentage for the "left" style property
  const left = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  // ✅ เก็บตำแหน่ง X ของแต่ละ Card
  const storeCardPosition = (id: number, x: number) => {
    setCardPositions((prev) => {
      const exists = prev.some((item) => item.id === id);
      if (!exists) return [...prev, { id, x }];
      return prev;
    });
  };

  // ✅ ตรวจจับ Card ที่อยู่กลางหน้าจอ
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerScreen = scrollX + screenWidth / 2;

    let closestCard: resultObject | null = null as resultObject | null;
    let minDistance = Number.MAX_VALUE;

    cardPositions.forEach((cardPos) => {
      const distance = Math.abs(cardPos.x - centerScreen);
      if (distance < minDistance) {
        minDistance = distance;
        closestCard = bank?.find((item) => item.id === cardPos.id) || null;
      }
    });

    if (closestCard && (closestCard as resultObject).id !== selectedCard?.id) {
      setSelectedCard(closestCard);
      setIsLoading(true);
      getSplitpay(URL, (closestCard as resultObject).id, auth?.token!).then(
        (res) => {
          if (res.success) {
            console.log("🚀 Splitpay Fetched:", res);
            setBudgets(res.result);
          }
          setIsLoading(false);
        }
      );
      console.log("🎯 Selected Card:", closestCard);
    }
  };

  // ✅ เลื่อน ScrollView ให้การ์ดแรกอยู่กลางตอนเริ่ม
  useEffect(() => {
    if (bank && bank.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        setSelectedCard(bank[0]); // ✅ ตั้งค่า selectedCard เป็นการ์ดแรก
        console.log("🚀 First Card Selected:", bank[0]);
      }, 500);
    }
  }, [bank]);

  const modalHeight = Dimensions.get("window").height;
  const modalAnimation = useRef(new Animated.Value(-modalHeight)).current;

  useEffect(() => {
    Animated.timing(modalAnimation, {
      toValue: modalVisible ? 0 : -modalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [modalVisible]);

  const saveHandler = () => {
    if (selectedCard) {
      const data: SplitPayProps = {
        user_id: userID!,
        account_id: selectedCard.id,
        split_name: "Test",
        amount_allocated: limitValue,
        remaining_balance: limitValue,
        color_code: selectColor,
        icon_id: selectIcon,
      };
      addSplitpay(URL, data, auth?.token!).then((res) => {
        if (res.success) {
          console.log("🚀 Splitpay Added:", res);
        }
        getSplitpay(URL, selectedCard.id, auth?.token!).then((res) => {
          if (res.success) {
            console.log("🚀 Splitpay Fetched:", res);
            setBudgets(res.result);
          } else {
            setBudgets(null);
          }
        });
      });
    }
  };

  return (
    <>
      <ThemedSafeAreaView>
        <ThemedView>
          <ThemedView className="flex-row !justify-between w-full px-4">
            <Image
              source={require("@/assets/logos/LOGO.png")}
              style={{
                width: 79,
                height: 70,
                marginTop: "2%",
                marginLeft: "5%",
              }}
            />
            <Ionicons
              onPress={() => router.push("/Add_Transaction")}
              name="notifications-outline"
              size={32}
              color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
              style={{
                alignSelf: "center",
                marginTop: "5%",
                marginRight: "5%",
              }}
            />
          </ThemedView>
          <ThemedView className="w-[50%] pt-5">
            <ThemedView
              key={"splitpayPage"}
              className="flex flex-row w-full h-10 rounded-full relative !bg-[#D9D9D9]"
            >
              <Animated.View
                style={{
                  position: "absolute",
                  left,
                  width: "50%",
                  height: "100%",
                  backgroundColor: "#2B9348",
                  borderRadius: 50,
                }}
              />
              <ThemedText
                className={`text-center font-bold w-[50%] ${
                  page === 0 ? "text-[#F2F2F2]" : ""
                }`}
                onPress={() => setPage(0)}
              >
                Budget
              </ThemedText>
              <ThemedText
                className={`text-center font-bold w-[50%] ${
                  page === 1 ? "text-[#F2F2F2]" : ""
                }`}
                onPress={() => setPage(1)}
              >
                Retire
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="w-full">
            <ThemedView className=" my-4 w-[80%]">
              <ThemedText className="text-xl font-bold text-start w-full">
                Account
              </ThemedText>
            </ThemedView>

            {bank ? (
              <ThemedView className="!items-center w-full ">
                <ThemedView className="!items-center w-full mb-5 ">
                  <ScrollView
                    ref={scrollViewRef} // ✅ ให้ ScrollView ใช้ ref
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={snapToInterval} // ✅ ทำให้ ScrollView หยุดที่แต่ละการ์ด
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16} // ✅ ตรวจจับ scroll อย่างละเอียด
                    className="w-full"
                  >
                    <ThemedView className="w-full px-16">
                      <ThemedView className="mt-0.5 mb-1 flex-row space-x-1 gap-5">
                        {bank?.map((account: resultObject, index: number) => (
                          <Pressable
                            key={account.id}
                            onLayout={(event) => {
                              const x =
                                event.nativeEvent.layout.x +
                                10 +
                                event.nativeEvent.layout.width / 2;
                              storeCardPosition(account.id, x);
                            }}
                          >
                            <ThemedView>
                              <ThemedCard
                                key={account.id}
                                CardID={account.id}
                                name={account.account_name}
                                color={account.color_code}
                                balance={account.balance.toString()}
                                mode="large"
                                imageIndex={Number(account.icon_id)}
                                className={`!items-center !justify-center bg-[#fefefe] rounded-lg 
                                          ${
                                            selectedCard?.id === account.id
                                              ? "border-4 border-[#03A696]"
                                              : "border-0"
                                          }
                                        `}
                              />
                            </ThemedView>
                          </Pressable>
                        ))}
                      </ThemedView>
                    </ThemedView>
                  </ScrollView>
                </ThemedView>
              </ThemedView>
            ) : (
              <ThemedView className="mt-3">
                <ThemedButton
                  className={`${componentColor} w-4/5 h-40 rounded-[20]`}
                  onPress={() => router.push("/AddAccount")}
                >
                  <ThemedView className="bg-transparent">
                    <AntDesign
                      name="filetext1"
                      size={50}
                      color={`${componentIcon}`}
                      className="m-3"
                    />
                    <ThemedText className="mx-5 text-center font-bold">
                      Let’s get started with your first Money Account plan!
                    </ThemedText>
                  </ThemedView>
                </ThemedButton>
              </ThemedView>
            )}
          </ThemedView>
          {bank ? (
            <ThemedView className="w-[80%] min-h-72 h-96 ">
              <ThemedText className="w-full font-bold text-xl">
                Monthly Budgets
              </ThemedText>
              <ThemedView
                className={`w-full h-full ${componentColor} rounded-[20px]`}
              >
                {isLoading ? (
                  <View className="w-full h-full">
                    <BudgetSkeleton />
                    <BudgetSkeleton />
                    <BudgetSkeleton />
                  </View>
                ) : Budgets ? (
                  <ThemedView className="w-full h-full mt-5 !bg-transparent !justify-start">
                    {Budgets.map((budget, index) => (
                      <ThemedView
                        key={index}
                        className="w-[90%] flex-row !items-start rounded-xl p-5"
                      >
                        <ThemedView
                          className="w-20 h-20 rounded-xl"
                          style={{ backgroundColor: budget.color_code }}
                        >
                          {React.cloneElement(icons[budget.icon_id], {
                            size: 24,
                            style: { marginVertical: 5 },
                          })}
                        </ThemedView>
                        <ThemedView className="gap-2 ml-4 w-[60%] !items-start bg-transparent">
                          <ThemedView className="w-24 h-5 rounded-xl bg-gray-500" />
                          <ThemedView className="w-[80%] h-5 rounded-xl bg-gray-500" />
                          <ThemedView className="w-24 h-5 rounded-xl bg-gray-500" />
                        </ThemedView>
                      </ThemedView>
                    ))}
                  </ThemedView>
                ) : (
                  <ThemedView className="w-full mt-3 !bg-transparent">
                    <ThemedButton
                      className={`${componentColor} h-40 rounded-[20] bg-transparent`}
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      <ThemedView className="bg-transparent">
                        <AntDesign
                          name="filetext1"
                          size={50}
                          color={`${componentIcon}`}
                          className="m-3"
                        />
                        <ThemedText className=" text-center font-bold">
                          Let’s get started with your first budget plan!
                        </ThemedText>
                        <AntDesign
                          name="pluscircleo"
                          size={50}
                          color={`${componentIcon}`}
                          className="m-3"
                        />
                      </ThemedView>
                    </ThemedButton>
                  </ThemedView>
                )}
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedView className="w-full mt-10">
              <ThemedButton
                className={`${componentColor} h-96 rounded-[20px]`}
                onPress={() => router.push("/AddAccount")}
              >
                <ThemedView className="bg-transparent">
                  <AntDesign
                    name="filetext1"
                    size={50}
                    color={`${componentIcon}`}
                    className="m-3"
                  />
                  <ThemedText className="mx-5 text-center font-bold">
                    Please create an account to proceed with your SplitPay.
                  </ThemedText>
                </ThemedView>
              </ThemedButton>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedSafeAreaView>
      <Animated.View
        style={{
          position: "absolute",
          bottom: modalAnimation,
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          zIndex: 10,
          backgroundColor: "transparent",
        }}
      >
        <ThemedView
          className="h-[40%] w-full bg-transparent"
          onTouchEnd={() => setModalVisible(false)}
        />
        <ThemedView className="h-[60%] w-full border-t-4 border-l-4 border-r-4 border-black/30 rounded-t-3xl">
          <ThemedView
            className="w-40 h-40 rounded-2xl"
            style={{ backgroundColor: selectColor ? selectColor : "#D9D9D9" }}
          >
            {selectIcon > 0 && (
              <ThemedView className="bg-transparent">
                {React.cloneElement(icons[selectIcon], {
                  size: 48,
                  style: { marginVertical: 10 },
                })}
              </ThemedView>
            )}
          </ThemedView>
          <ThemedView className="flex flex-row">
            {colors.map((color, index) => (
              <ThemedView
                key={index}
                className="w-8 h-8 rounded-full m-2"
                style={{
                  backgroundColor: color,
                  borderWidth: selectColor === color ? 3 : 0,
                  borderColor: selectColor === color ? "#000" : "",
                }}
                onTouchEnd={() => setSelectColor(color)}
              />
            ))}
          </ThemedView>
          <ThemedView className="flex flex-row">
            {Object.entries(icons).map(([key, icon]) => (
              <ThemedView
                key={key}
                className="w-8 h-8 rounded-full m-2 items-center justify-center"
                onTouchEnd={() => {
                  setSelectIcon(Number(key));
                }}
                style={{
                  backgroundColor: selectIcon === Number(key) ? "#D9D9D9" : "",
                }}
              >
                {icon}
              </ThemedView>
            ))}
          </ThemedView>
          <ThemedView className="w-[80%]">
            <ThemedInput title="Budget Name" className="w-full" error="" />
            <ThemedView className="mb-4 w-full">
              <ThemedInput
                title="Limit"
                className="w-full"
                error=""
                value={inputLimitValue}
                onChangeText={(text) => {
                  const numValue = Number(text);
                  if (
                    selectedCard?.balance &&
                    numValue > selectedCard.balance
                  ) {
                    setInputLimitValue(selectedCard.balance.toString());
                  } else {
                    setInputLimitValue(text);
                  }
                }}
                onEndEditing={() => {
                  const numValue = Number(inputLimitValue);
                  if (
                    selectedCard?.balance &&
                    numValue > selectedCard.balance
                  ) {
                    setLimitValue(selectedCard.balance);
                    setInputLimitValue(selectedCard.balance.toString());
                  } else {
                    setLimitValue(numValue);
                  }
                }}
              />
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={100}
                maximumValue={selectedCard?.balance}
                step={100}
                value={inputLimitValue ? Number(inputLimitValue) : 100}
                onValueChange={(value) => setLimitValue(value)}
                onSlidingComplete={(value) =>
                  setInputLimitValue(value.toString())
                }
                minimumTrackTintColor="#2B9348"
                maximumTrackTintColor="#D9D9D9"
                thumbTintColor="#2B9348"
              />
              <ThemedView className="flex-row justify-between w-full">
                <ThemedText className="text-xs">100</ThemedText>
                <ThemedText>{limitValue}</ThemedText>
                <ThemedText className="text-xs">
                  {selectedCard?.balance}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedButton
            mode="confirm"
            onPress={() => {
              setModalVisible(false);
              saveHandler();
            }}
            className="w-1/4 h-10"
          >
            save
          </ThemedButton>
        </ThemedView>
      </Animated.View>
    </>
  );
}
