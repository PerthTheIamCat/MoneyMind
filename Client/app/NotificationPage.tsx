import { useState, useContext, useEffect } from "react";
import {
  Animated,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import {
  NotificationsDeleteHandler,
  NotificationsPutHandler,
} from "@/hooks/auth/NotificationsHandler";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

type UserNotification = {
  id: number;
  user_id: number;
  notification_type: "security" | "monthly_summary";
  message: string;
  is_read: boolean;
  created_at: string;
  color_type: "green" | "yellow" | "red";
};

export default function Index() {
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  const { notification, setNotification } = useContext(UserContext);

  const theme = useColorScheme();
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";

  const [data, setData] = useState<UserNotification[]>([]);

  useEffect(() => {
    if (notification) {
      setData(notification);
    }
  }, [notification]);

  const deleteNotification = (id: number) => {
    console.log(id);
    NotificationsDeleteHandler(URL, id, auth?.token!).then((response) => {
      console.log("API Response:", response);
      if (response.success) {
        console.log(response.result);
        handleDelete(id);
      }
    });
  };

  const RouterPath = (id: number, notification_type: string) => {
    console.log(id);
    readHandler(id);
    if (notification_type == "monthly_summary") {
      router.push("/Month_Summary");
    } else if (notification_type == "security") {
      router.push("/PinRecovery");
    }
  };

  const checknotification_type = (notification_type: string) => {
    switch (notification_type) {
      case "monthly_summary":
        return "areachart";
      case "security":
        return "lock1";
      default:
        return "info"; // ไอคอนเริ่มต้น
    }
  };

  const [animatedValues] = useState<{
    [key: number]: { opacity: Animated.Value; translateX: Animated.Value };
  }>({});

  data.forEach((item) => {
    if (!animatedValues[item.id]) {
      animatedValues[item.id] = {
        opacity: new Animated.Value(1),
        translateX: new Animated.Value(0),
      };
    }
  });

  const handleDelete = (id: number) => {
    Animated.parallel([
      Animated.timing(animatedValues[id].opacity, {
        toValue: 0,
        duration: 300, // fade out ใน 300ms
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[id].translateX, {
        toValue: -200, // slide ออกไปทางซ้าย
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setData((prevData) => prevData.filter((item) => item.id !== id));
      // Pass the filtered array directly instead of a callback function
      const filteredNotifications =
        notification?.filter((item) => item.id !== id) || [];
      setNotification(filteredNotifications);
    });
  };

  const readHandler = (id: number) => {
    const newData = data.map((item) => {
      return {
        ...item,
        is_read: item.id === id ? true : item.is_read || false,
        created_at: item.created_at || new Date().toISOString(),
      };
    });

    // Find the specific notification to update
    const notificationToUpdate = newData.find((item) => item.id === id);

    if (notificationToUpdate) {
      NotificationsPutHandler(
        URL,
        id,
        {
          is_read: true,
        },
        auth?.token!
      ).then((response) => {
        console.log("Notification Update", response);
        if (response.success) {
          console.log(response.result);
        } else {
          console.log(response);
        }
      });
    }

    setData(newData);
    setNotification(newData);
  };

  const renderItem = ({ item }: { item: UserNotification }) => {
    const bgColor = item.is_read
      ? "bg-gray-400"
      : item.color_type === "red"
      ? "bg-red-400"
      : item.color_type === "yellow"
      ? "bg-yellow-400"
      : item.color_type === "green"
      ? "bg-green-400"
      : "bg-black-500";
    return (
      <Animated.View
        key={"animate3"}
        style={{
          opacity: animatedValues[item.id].opacity,
          transform: [{ translateX: animatedValues[item.id].translateX }],
        }}
      >
        <ThemedView className={`mt-2 bg-transparent `}>
          <Pressable
            className={`bg-transparent w-[90%]`}
            onPress={() => RouterPath(item.id, item.notification_type)}
          >
            <ThemedView
              className={`flex-row  p-3 pl-12 h-fit rounded-3xl  ${bgColor}`}
            >
              <ThemedView className="${bgColor} w-16 h-16 rounded-full">
                <AntDesign
                  name={checknotification_type(item.notification_type)}
                  size={30}
                  color={theme === "dark" ? "white" : "black"}
                  className="m-3"
                />
              </ThemedView>

              <ThemedView
                className={`pl-3 px-16 bg-transparent w-full !items-start`}
              >
                <ThemedText className="text-lg font-bold !text-[#181818]">
                  {item.notification_type}
                </ThemedText>
                <ThemedText className="text-sm !text-[#181818]">
                  {item.message}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
        </ThemedView>
      </Animated.View>
    );
  };

  const renderHiddenItem = ({ item }: { item: UserNotification }) => (
    <Animated.View
      key={"animate2"}
      style={{
        opacity: animatedValues[item.id].opacity,
        transform: [{ translateX: animatedValues[item.id].translateX }],
      }}
      className="absolute right-6 top-0 bottom-0 bg-transparent w-[85%] mt-2 pr-8 !items-end"
    >
      <TouchableOpacity
        onPress={() => deleteNotification(item.id)}
        className="h-full absolute w-full bg-red-600  pr-8 !items-end justify-center rounded-3xl"
      >
        <MaterialIcons name="delete" size={30} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView key={"animate1"} className={`${componentcolor}`}>
      <ThemedView className="bg-transparent items-center ">
        <SwipeListView
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75} // Swipe left distance
          disableRightSwipe
        />
      </ThemedView>
    </ThemedView>
  );
}
