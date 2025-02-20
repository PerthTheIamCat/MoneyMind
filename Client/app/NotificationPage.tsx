import { useState, useContext,useEffect } from "react";
import { useColorScheme } from "react-native";

import { Animated, TouchableHighlight, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { NotificationsGetHandler } from "@/hooks/auth/NotificationsHandler";


interface NotificationItem {
    id: number;
    mode: string;
    Header: string;
    Description: string;
}

interface ListNotificationProps {
    data: NotificationItem[];
    onDelete: (id: number) => void;
}

export default function Index() {
    const { URL } = useContext(ServerContext);
    const auth = useContext(AuthContext);
    const { userID,notification} = useContext(UserContext);
    
    const theme = useColorScheme();
    const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
    
    
    const [data, setData] = useState([
        {
        id: 1,
        mode: "red",
        Header: "Monthly Summary",
        Description:
            "You didn't save enough money last month try to be better next month.",
        },
        {
        id: 2,
        mode: "green",
        Header: "Monthly Summary",
        Description: "You save enough money last month keep it up in next month.",
        },
        {
        id: 3,
        mode: "red",
        Header: "Nearly out of money",
        Description:
            "Your funds are running low. Spend wisely before it all slips away.",
        },
        {
        id: 4,
        mode: "red",
        Header: "Out of money",
        Description:
            "Your funds are depleted. NOw is th time to rely on practice and careful planning to start anew.  ",
        },
        {
        id: 5,
        mode: "yellow",
        Header: "New device logged in",
        Description:
            "New device logged in on 11/01/2025 11:10 . If this not you please go to setting and change your password",
        },
        {
        id: 6,
        mode: "yellow",
        Header: "Password changed",
        Description: "Password change successfully.",
        },
    ]);

    
    useEffect(() => {
        if (userID) {
            NotificationsGetHandler(URL, userID).then((response) => {
                if (response) {
                    
                }
            });
        }
    }, [userID]);

    const deleteNotification = (id: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        
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
        ]).start(() => {
        deleteNotification(id); // ลบออกจากลิสต์หลังจากแอนิเมชันจบ
        });
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const bgColor =
        item.mode === "red"
            ? "bg-red-400"
            : item.mode === "yellow"
            ? "bg-yellow-400"
            : item.mode === "green"
            ? "bg-green-400"
            : "bg-black-500";
        return (
        <Animated.View
            style={{
            opacity: animatedValues[item.id].opacity,
            transform: [{ translateX: animatedValues[item.id].translateX }],
            }}>
            <ThemedView className={`mt-2 bg-transparent `}>
            <TouchableHighlight className={`bg-transparent w-[90%]`}>
            <ThemedView  className={`flex-row  p-3 pl-12 h-fit rounded-3xl  ${bgColor}`}> 
                    <ThemedView className="bg-white w-16 h-16 rounded-full"/>
                        <ThemedView className={`pl-3 px-16 bg-transparent w-full !items-start`}>
                        <ThemedText className="text-lg font-bold text-[#181818]">{item.Header}</ThemedText>
                        <ThemedText className="text-sm text-[#181818]">{item.Description}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </TouchableHighlight>
            </ThemedView>
        </Animated.View>
        );
    };

    const renderHiddenItem = ({ item }: { item: NotificationItem }) => (
        <Animated.View
        style={{
            opacity: animatedValues[item.id].opacity,
            transform: [{ translateX: animatedValues[item.id].translateX }],
        }}
        className="absolute right-6 top-0 bottom-0 h-fit bg-transparent w-[85%] mt-2 pr-8 !items-end">
        <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className=" absolute h-full w-full bg-red-600  pr-8 !items-end justify-center rounded-3xl">
            <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
        </Animated.View>
    );

    return (
        <ThemedView className={`${componentcolor}`}>
        <ThemedView className="bg-transparent items-center ">
            <SwipeListView
            data={notification}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75} // Swipe left distance
            disableRightSwipe
            ListEmptyComponent={
                <ThemedView className="bg-transparent mt-5">
                <ThemedText className="text-3xl !text-[#181818]">No Notification now</ThemedText>
                </ThemedView>
            }
            />
        </ThemedView>
        </ThemedView>
    );
}
