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
  Keyboard,
} from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedCard } from "@/components/ThemedCard";
import BudgetSkeleton from "@/components/BudgetSkeleton";
import { ThemedInput } from "@/components/ThemedInput";
import BudgetItem from "@/components/BudgetItem";
import RetireItem from "@/components/RetireSplitpayItem";

import {
  addSplitpay,
  getSplitpay,
  updateSplitpay,
  deleteSplitpay,
} from "@/hooks/auth/SplitpayHandler";

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { resultObject } from "@/hooks/auth/GetUserBank";

import Slider from "@react-native-community/slider";
import { KeyboardAvoidingView, Platform } from "react-native";

interface SplitPayProps {
  id: number;
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

export default function SplitPay() {
  const theme = useColorScheme();

  const [budget_name, setBudgetName] = useState<string>("");
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
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editID, setEditID] = useState<number>(0);
  const [isBudgetOpenIndex, setIsBudgetOpenIndex] = useState<
    { index: number; isOpen: boolean }[]
  >([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [timer, setTimer] = useState<number>(5);

  const { bank, userID, retire, notification } = useContext(UserContext);
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);

  const animation = useRef(new Animated.Value(0)).current;
  const componentColor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
  const componentIcon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
  const screenWidth = Dimensions.get("window").width; // ✅ ความกว้างของหน้าจอ
  const cardWidth = 280; // ✅ ความกว้างของ Card
  const cardMargin = 18; // ✅ Margin ระหว่างการ์ด
  const snapToInterval = cardWidth + cardMargin * 2; // ✅ ระยะ snap ให้เป๊ะ

  const icons: { [key: number]: JSX.Element } = {
    1: (
      <MaterialCommunityIcons
        name="food-fork-drink"
        size={24}
        color={componentIcon}
      />
    ),
    2: (
      <MaterialCommunityIcons name="shopping" size={24} color={componentIcon} />
    ),
    3: <MaterialCommunityIcons name="car" size={24} color={componentIcon} />,
    4: <MaterialCommunityIcons name="home" size={24} color={componentIcon} />,
    5: (
      <MaterialCommunityIcons
        name="medical-bag"
        size={24}
        color={componentIcon}
      />
    ),
    6: <MaterialCommunityIcons name="school" size={24} color={componentIcon} />,
    7: <MaterialCommunityIcons name="movie" size={24} color={componentIcon} />,
  };
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
          } else {
            setBudgets(null);
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
        if (page === 0) {
          scrollViewRef.current?.scrollTo({ x: 0, animated: true });
          setSelectedCard(bank[1]); // ✅ ตั้งค่า selectedCard เป็นการ์ดแรก
          console.log("🚀 First Card Selected:", bank[1]);
          setIsLoading(true);
          getSplitpay(URL, bank[1].id, auth?.token!).then((res) => {
            if (res.success) {
              console.log("🚀 Splitpay Fetched:", res);
              setBudgets(res.result);
            } else {
              setBudgets(null);
            }
            setIsLoading(false);
          });
        } else {
          scrollViewRef.current?.scrollTo({ x: screenWidth, animated: true });
          setSelectedCard(bank[0]); // ✅ ตั้งค่า selectedCard เป็นการ์ดแรก
          console.log("🚀 First Card Selected:", bank[0]);
          setIsLoading(true);
          getSplitpay(URL, bank[0].id, auth?.token!).then((res) => {
            if (res.success) {
              console.log("🚀 Splitpay Fetched:", res);
              setBudgets(res.result);
            } else {
              setBudgets(null);
            }
            setIsLoading(false);
          });
        }
      }, 500);
    }
  }, [bank, page]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const modalHeight = Dimensions.get("window").height;
  const modalAnimation = useRef(new Animated.Value(-modalHeight)).current;
  const delectModalAnimation = useRef(new Animated.Value(-modalHeight)).current;

  useEffect(() => {
    Animated.timing(modalAnimation, {
      toValue: modalVisible ? 100 : -modalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [modalVisible]);

  useEffect(() => {
    Animated.timing(delectModalAnimation, {
      toValue: isDeleteConfirmOpen ? 0 : -modalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDeleteConfirmOpen]);

  const saveHandler = () => {
    if (!budget_name) {
      setNameError("Please enter a budget name");
      return;
    } else {
      setNameError("");
    }
    if (!limitValue) {
      setLimitError("Please enter a budget limit");
      return;
    } else {
      setLimitError("");
    }

    if (selectedCard) {
      const data: SplitPayProps = {
        id: editID,
        user_id: userID!,
        account_id: selectedCard.id,
        split_name: budget_name,
        amount_allocated: limitValue,
        remaining_balance: limitValue,
        color_code: selectColor,
        icon_id: selectIcon,
      };
      if (isEdit) {
        setIsLoading(true);
        updateSplitpay(URL, data.id, data, auth?.token!).then((res) => {
          if (res.success) {
            console.log("🚀 Splitpay Updated:", res);
            setModalVisible(false);
            setIsEdit(false);
          } else {
            console.log("🚀 Splitpay Error:", res);
            alert(res.message);
          }
          getSplitpay(URL, selectedCard.id, auth?.token!).then((res) => {
            if (res.success) {
              console.log("🚀 Splitpay Fetched:", res);
              setBudgets(res.result);
              setIsLoading(false);
            } else {
              setBudgets(null);
              setIsLoading(false);
            }
          });
        });
      } else {
        setIsLoading(true);
        addSplitpay(URL, data, auth?.token!).then((res) => {
          if (res.success) {
            setIsLoading(false);
            console.log("🚀 Splitpay Added:", res);
            setModalVisible(false);
          } else {
            setIsLoading(false);
            alert(res.message);
            console.log("🚀 Splitpay Error:", res);
          }
          getSplitpay(URL, selectedCard.id, auth?.token!).then((res) => {
            if (res.success) {
              console.log("🚀 Splitpay Fetched:", res);
              setBudgets(res.result);
              setIsLoading(false);
            } else {
              setBudgets(null);
              setIsLoading(false);
            }
          });
        });
      }
    }
  };
  const DeleteHandler = () => {
    setIsLoading(true);
    deleteSplitpay(URL, editID, auth?.token!).then((res) => {
      if (res.success) {
        console.log("🚀 Splitpay Deleted:", res);
        setIsDeleteConfirmOpen(false);
        getSplitpay(URL, selectedCard!.id, auth?.token!).then((res) => {
          if (res.success) {
            console.log("🚀 Splitpay Fetched:", res);
            setBudgets(res.result);
          } else {
            setBudgets(null);
          }
        });
        setIsDeleteConfirmOpen(false);
        setIsLoading(false);
      } else {
        console.log("🚀 Splitpay Error:", res);
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <ThemedSafeAreaView>
        <ThemedView className="">
          <ThemedView className="flex-row !justify-between w-full px-4">
            <Image
              source={require("@/assets/logos/LOGO.png")}
              style={{
                width: 50,
                height: 50,
                marginTop: "2%",
                marginLeft: "5%",
              }}
            />
            <Ionicons
              onPress={() => router.push("/NotificationPage")}
              name="notifications-outline"
              size={32}
              color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
              style={{
                alignSelf: "center",
                marginTop: "5%",
                marginRight: "5%",
              }}
            />
            {notification?.find((noti) => !noti.is_read) && (
              <View className="w-3 h-3 bg-red-500 absolute rounded-full right-10 animate-pulse" />
            )}
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

            {(
              bank?.filter(
                (account: resultObject) => account.account_name !== "Retirement"
              ) || []
            ).length > 0 && page === 0 ? (
              <ThemedView className="!items-center w-full ">
                <ThemedView className="!items-center w-full mb-5 ">
                  <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={snapToInterval}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    className="w-full"
                  >
                    <ThemedView className="w-full px-16">
                      <ThemedView className="mt-0.5 mb-1 flex-row space-x-1 gap-5">
                        {bank
                          ?.filter(
                            (account: resultObject) =>
                              account.account_name !== "Retirement"
                          )
                          .map((account: resultObject, index: number) => (
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
            ) : (bank?.filter(
                (account: resultObject) => account.account_name === "Retirement"
              ).length ?? 0) > 0 && page === 1 ? (
              <ThemedView className="!items-center w-full ">
                <ThemedView className="!items-center w-full mb-5 ">
                  <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={snapToInterval}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    className="w-full"
                  >
                    <ThemedView className="w-full px-16">
                      <ThemedView className="mt-0.5 mb-1 flex-row space-x-1 gap-5">
                        {bank
                          ?.filter(
                            (account: resultObject) =>
                              account.account_name === "Retirement"
                          )
                          .map((account: resultObject, index: number) => (
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
              <ThemedView className="mt-3 w-full px-5 mb-5">
                <ThemedButton
                  className={`${componentColor} w-[80%] h-40 rounded-[20]`}
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
            <ThemedView className="w-[80%] min-h-72 h-[400px] mt-5">
              <ThemedText className="w-full font-bold text-xl">
                Monthly Budgets
              </ThemedText>
              <ThemedView
                className={`w-full h-full ${componentColor} rounded-xl`}
              >
                <ScrollView>
                  {isLoading ? (
                    <View className="w-full h-full">
                      <BudgetSkeleton />
                      <BudgetSkeleton />
                      <BudgetSkeleton />
                    </View>
                  ) : (Budgets?.filter(
                      (budget: SplitPayProps) =>
                        budget.split_name !== "Retirement"
                    ).length ?? 0) > 0 && page === 0 ? (
                    <ThemedView className="w-full h-full mt-5 px-5 !bg-transparent !justify-start gap-3 pb-28">
                      {Budgets?.map((budget, index) => {
                        const isOpen =
                          isBudgetOpenIndex.find((item) => item.index === index)
                            ?.isOpen || false;
                        return (
                          <BudgetItem
                            onDelete={(id: number) => {
                              setEditID(id);
                              setIsDeleteConfirmOpen(true);
                              setTimer(5);
                              const thisTimer = setInterval(() => {
                                setTimer((prevTimer) => {
                                  if (prevTimer <= 1) {
                                    clearInterval(thisTimer);
                                    return 0;
                                  } else {
                                    console.log("Timer:", prevTimer - 1);
                                    return prevTimer - 1;
                                  }
                                });
                              }, 1000);
                            }}
                            onEdit={(budget: SplitPayProps) => {
                              setIsEdit(true);
                              setEditID(budget.id);
                              setBudgetName(budget.split_name);
                              setLimitValue(budget.amount_allocated);
                              setInputLimitValue(
                                budget.amount_allocated.toString()
                              );
                              setSelectColor(budget.color_code);
                              setSelectIcon(budget.icon_id);
                              setModalVisible(true);
                            }}
                            key={index}
                            budget={budget}
                            isOpen={isOpen}
                            onToggle={() =>
                              setIsBudgetOpenIndex((prev) => {
                                const newState = [...prev];
                                const existingItemIndex = newState.findIndex(
                                  (item) => item.index === index
                                );
                                if (existingItemIndex >= 0) {
                                  newState[existingItemIndex].isOpen =
                                    !newState[existingItemIndex].isOpen;
                                } else {
                                  newState.push({ index: index, isOpen: true });
                                }
                                return newState;
                              })
                            }
                            componentIcon={componentIcon}
                            icons={icons}
                          />
                        );
                      })}
                    </ThemedView>
                  ) : !Budgets && page === 0 ? (
                    <ThemedView className="w-full mt-10 bg-transparent">
                      <ThemedButton
                        className={`${componentColor} h-96 rounded-[20px]`}
                        onPress={() => setModalVisible(true)}
                      >
                        <ThemedView className="bg-transparent">
                          <AntDesign
                            name="filetext1"
                            size={50}
                            color={`${componentIcon}`}
                            className="m-3"
                          />
                          <ThemedText className="mx-5 text-center font-bold">
                            Let's start you budget plan!
                          </ThemedText>
                        </ThemedView>
                      </ThemedButton>
                    </ThemedView>
                  ) : Budgets && retire && page === 1 ? (
                    <ThemedView className="w-full h-full mt-5 px-5 !bg-transparent !justify-start gap-3">
                      {Budgets.filter(
                        (budget) => budget.split_name === "Retirement"
                      ).map((budget, index) => {
                        const isOpen =
                          isBudgetOpenIndex.find((item) => item.index === index)
                            ?.isOpen || false;
                        return (
                          <RetireItem
                            retire={budget}
                            onDelete={(id: number) => {
                              setEditID(id);
                              setIsDeleteConfirmOpen(true);
                              setTimer(5);
                              const thisTimer = setInterval(() => {
                                setTimer((prevTimer) => {
                                  if (prevTimer <= 1) {
                                    clearInterval(thisTimer);
                                    return 0;
                                  } else {
                                    console.log("Timer:", prevTimer - 1);
                                    return prevTimer - 1;
                                  }
                                });
                              }, 1000);
                            }}
                            key={index}
                            isOpen={isOpen}
                            onToggle={() =>
                              setIsBudgetOpenIndex(
                                (
                                  prev: { index: number; isOpen: boolean }[]
                                ) => {
                                  const newState = [...prev];
                                  const existingItemIndex = newState.findIndex(
                                    (item) => item.index === index
                                  );
                                  if (existingItemIndex >= 0) {
                                    newState[existingItemIndex].isOpen =
                                      !newState[existingItemIndex].isOpen;
                                  } else {
                                    newState.push({
                                      index: index,
                                      isOpen: true,
                                    });
                                  }
                                  return newState;
                                }
                              )
                            }
                            componentIcon={componentIcon}
                          />
                        );
                      })}
                    </ThemedView>
                  ) : (
                    <ThemedView className="w-full mt-10 bg-transparent">
                      <ThemedButton
                        className={`${componentColor} h-96 rounded-[20px]`}
                        onPress={() => router.push("/(tabs)/retire")}
                      >
                        <ThemedView className="bg-transparent">
                          <AntDesign
                            name="filetext1"
                            size={50}
                            color={`${componentIcon}`}
                            className="m-3"
                          />
                          <ThemedText className="mx-5 text-center font-bold">
                            Let's start you retirement plan!
                          </ThemedText>
                        </ThemedView>
                      </ThemedButton>
                    </ThemedView>
                  )}
                </ScrollView>
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedView className="w-[80%] mt-10">
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
          className={`${
            isKeyboardVisible ? "h-[20%]" : "h-[40%]"
          } w-full bg-transparent`}
          onTouchEnd={() => {
            setModalVisible(false);
            setIsEdit(false);
          }}
        />
        <ThemedView
          className={`${
            isKeyboardVisible ? "h-[80%] pb-52" : "h-[60%]"
          } w-full border-t-4 border-l-4 border-r-4 border-black/30 rounded-t-3xl `}
        >
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
                  backgroundColor:
                    selectIcon === Number(key) ? "#D9D9D9" : "transparent",
                }}
              >
                {icon}
              </ThemedView>
            ))}
          </ThemedView>
          <ThemedView className="w-[80%]">
            <ThemedInput
              title="Budget Name"
              className="w-full"
              error={name_error}
              onChangeText={setBudgetName}
              value={budget_name}
            />
            <ThemedView className="mb-4 w-full">
              <ThemedInput
                title="Limit"
                className="w-full"
                error={limit_error}
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
                minimumValue={0}
                maximumValue={
                  (selectedCard?.balance ?? 0) -
                  (Budgets
                    ? Budgets.reduce(
                        (acc, budget) => acc + budget.remaining_balance,
                        0
                      )
                    : 0)
                }
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
                  {(selectedCard?.balance ?? 0) -
                    (Budgets
                      ? Budgets.reduce(
                          (acc, budget) => acc + budget.remaining_balance,
                          0
                        )
                      : 0)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedButton
            mode="confirm"
            onPress={() => {
              saveHandler();
            }}
            className="w-1/4 h-10"
            isLoading={isLoading}
          >
            save
          </ThemedButton>
        </ThemedView>
      </Animated.View>
      {page === 0 &&
        (bank?.filter((account) => account.account_name !== "Retirement") ?? [])
          .length > 0 && (
          <ThemedView
            className="w-16 h-16 !bg-[#AACC00] absolute right-6 bottom-36 rounded-full"
            onTouchEnd={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={40} color="white" />
          </ThemedView>
        )}
      <Animated.View
        style={{
          position: "absolute",
          bottom: delectModalAnimation,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          backgroundColor: "transparent",
        }}
      >
        <ThemedView
          className="w-full h-[30%] bg-transparent"
          onTouchEnd={() => setIsDeleteConfirmOpen(false)}
        />
        <ThemedView
          className={`w-[80%] h-[40%] border-8 border-black/30 rounded-2xl`}
        >
          <View className="bg-[#EA303E] rounded-full">
            <Ionicons name="alert-outline" size={50} color="white" />
          </View>
          <ThemedText className="text-4xl font-bold pb-10">
            Delete Alert
          </ThemedText>
          <ThemedText className="w-[80%] text-lg text-center">
            The data will be permanently removed with no recovery option.
            Confirm deletion?
          </ThemedText>
          <ThemedView className="flex flex-row !justify-around w-full pt-5">
            <ThemedButton
              mode="cancel"
              className="w-[40%] h-16"
              onPress={() => {
                DeleteHandler();
              }}
              isLoading={timer !== 0}
            >
              Delete {timer === 0 ? "" : `(${timer})`}
            </ThemedButton>
            <ThemedButton
              className="w-[40%] h-16"
              onPress={() => {
                setIsDeleteConfirmOpen(false);
              }}
            >
              Cancel
            </ThemedButton>
          </ThemedView>
        </ThemedView>
        <ThemedView
          className="w-full h-[30%] bg-transparent"
          onTouchEnd={() => setIsDeleteConfirmOpen(false)}
        />
      </Animated.View>
    </>
  );
}
