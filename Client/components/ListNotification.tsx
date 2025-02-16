import { Animated,TouchableHighlight,TouchableOpacity} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {MaterialIcons} from "@expo/vector-icons"
import {SwipeListView} from "react-native-swipe-list-view"
import React, { useRef } from "react";

interface NotificationItem{
    id: number;
    mode: string;
    Header: string;
    Description: string;
}

interface ListNotificationProps{
    data: NotificationItem[];
    onDelete: (id:number) => void;
}

export function ListNotification({data=[], onDelete}: ListNotificationProps){
    const renderItem = ({ item }: { item: NotificationItem }) => {
        const bgColor = item.mode ==="red" ? "bg-red-400" : 
                                    item.mode==="yellow"? "bg-yellow-400": 
                                    item.mode==="green"? "bg-green-400":
                                    "bg-black-500";
                                    

        return (
            <ThemedView  className={`mt-2 bg-transparent `}> 
                <TouchableHighlight className={`bg-transparent w-[90%]`} >
                    <ThemedView  className={`flex-row  p-3 pl-12 h-fit rounded-3xl  ${bgColor}`}> 
                        <ThemedView className="bg-white w-16 h-16 rounded-full"/> {/* image icon */}
                        <ThemedView className={`pl-3 px-16 bg-transparent w-full !items-start`}>
                            <ThemedText className="text-lg font-bold text-[#181818]">{item.Header}</ThemedText>
                            <ThemedText className="text-sm text-[#181818]">{item.Description}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </TouchableHighlight>
            </ThemedView>
        );
    };

    const renderHiddenItem = ({ item }: { item: NotificationItem }) => (
        <ThemedView className="absolute right-6 top-0 bottom-0 h-fit bg-red-600 w-[85%] mt-2 pr-8 !items-end justify-center rounded-3xl">
            <TouchableOpacity onPress={() => {onDelete(item.id)}}>
                <MaterialIcons name="delete" size={30} color="white" />
            </TouchableOpacity>
        </ThemedView>
    );



     return (
        <ThemedView className="bg-transparent items-center ">
            <SwipeListView
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-75} // Swipe left distance
                disableRightSwipe
                ListEmptyComponent={
                    <ThemedText style={{ alignSelf: "center", fontSize: 15, marginTop: 20 }}>
                        Empty List
                    </ThemedText>
                }
            />
        </ThemedView>
    );
}