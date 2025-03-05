import { useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";

import { Animated, TouchableHighlight, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { NotificationsGetHandler,NotificationsDeleteHandler } from "@/hooks/auth/NotificationsHandler";

interface NotificationItem {
  id: number;
  user_id: number;
  notification_type: string;
  message: string;
  color_type: string;
}


export default function Index() {
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);
  const { userID } = useContext(UserContext);

  const theme = useColorScheme();
  const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";

  const [data, setData] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (userID) {
      NotificationsGetHandler(URL, userID, auth?.token!)
        .then((response) => {
          console.log("API Response:", response); // ดูข้อมูลทั้งหมดที่ตอบกลับมาจาก API
          if (response.result && response.result.length > 0) {
            console.log(response.result);
            setData(response.result);
          }else{
            setData([]);
          }
        })
        .catch((error) =>{
          console.error("Failed to fetch notifications:", error);
          setData([]);
        });
    }
  }, [userID]);

  const deleteNotification = (id: number) => {
    console.log(id)
    NotificationsDeleteHandler(URL,id,auth?.token!)
    .then((response)=>{
      console.log("API Response:", response);
      if(response.success){
        console.log(response.result);
        handleDelete(id);
      }
    })
  };

  const [animatedValues] = useState<{
    [key: number]: { opacity: Animated.Value; translateX: Animated.Value };
  }>({});

  data.forEach((item) => {
    if (!animatedValues[item.id]) {
      animatedValues[item.id] = {
        opacity: new Animated.Value(1), // เริ่มจาก opacity = 1
        translateX: new Animated.Value(0), // เริ่มจากตำแหน่งเดิม (X = 0)
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
    ]).start(()=>{
      setData((prevData) => prevData.filter((item) => item.id !== id));
    })
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const bgColor =
      item.color_type === "red"
        ? "bg-red-400"
        : item.color_type === "yellow"
        ? "bg-yellow-400"
        : item.color_type === "green"
        ? "bg-green-400"
        : "bg-black-500";
    return (
      <Animated.View
        key={"animatenoti3"}
        style={{
          opacity: animatedValues[item.id].opacity,
          transform: [{ translateX: animatedValues[item.id].translateX }],
        }}
      >
        <ThemedView className={`mt-2 bg-transparent `}>
          <TouchableHighlight className={`bg-transparent w-[90%]`}>
            <ThemedView
              className={`flex-row  p-3 pl-12 h-fit rounded-3xl  ${bgColor}`}
            >
              <ThemedView className="bg-white w-16 h-16 rounded-full" />
              <ThemedView
                className={`pl-3 px-16 bg-transparent w-full !items-start`}
              >
                <ThemedText className="text-lg font-bold text-[#181818]">
                  {item.notification_type}
                </ThemedText>
                <ThemedText className="text-sm text-[#181818]">
                  {item.message}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </TouchableHighlight>
        </ThemedView>
      </Animated.View>
    );
  };

  const renderHiddenItem = ({ item }: { item: NotificationItem }) => (
    <Animated.View
      key={"animatenoti2"}
      style={{
        opacity: animatedValues[item.id].opacity,
        transform: [{ translateX: animatedValues[item.id].translateX }],
      }}
      className="absolute right-6 top-0 bottom-0 h-fit bg-transparent w-[85%] mt-2 pr-8 !items-end"
    >
      <TouchableOpacity
        onPress={() => deleteNotification(item.id)}
        className="h-full max-h-[76px] absolute w-full bg-red-600  pr-8 !items-end justify-center rounded-3xl"
      >
        <MaterialIcons name="delete" size={30} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView key={"animenoti"} className={`${componentcolor}`}>
      <ThemedView className="bg-transparent items-center ">
        <SwipeListView
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75} // Swipe left distance
          disableRightSwipe
          ListEmptyComponent={
            <ThemedView className="bg-transparent mt-5">
              <ThemedText className="text-3xl !text-[#181818]">
                No Notification now
              </ThemedText>
            </ThemedView>
          }
        />
      </ThemedView>
    </ThemedView>
  );
}
