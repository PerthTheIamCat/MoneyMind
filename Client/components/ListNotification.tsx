import { FlatList,TouchableOpacity,PanResponder,Animated } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {MaterialIcons} from "@expo/vector-icons"

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

    return (
        <ThemedView className="bg-transparent flex-col bg-teal !items-center ">
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const bgColor = item.mode ==="red" ? "bg-red-400" : 
                                    item.mode==="yellow"? "bg-yellow-400": 
                                    item.mode==="green"? "bg-green-400":
                                    "bg-black-500";
                    
                    return (
                        
                        <ThemedView  className={`mt-2 bg-transparent`}> 
                            <TouchableOpacity className={`bg-transparent`} >
                                <ThemedView  className={`flex-row w-[65%] p-3 !justify-between h-fit rounded-3xl  ${bgColor}`}> 
                                    <ThemedView className="bg-white w-16 h-16 rounded-full"/> {/* image icon */}
                                    <ThemedView className={`ml-5  bg-transparent w-full !items-start`}>
                                        <ThemedText className="text-lg font-bold text-[#181818]">{item.Header}</ThemedText>
                                        <ThemedText className="text-sm text-[#181818]">{item.Description}</ThemedText>
                                    </ThemedView>
                                
                                    <TouchableOpacity onPress={() => onDelete(item.id)} className="ml-auto ">
                                        <MaterialIcons name="delete" size={30} color={"#333333"} />
                                    </TouchableOpacity>
                                </ThemedView>
                            </TouchableOpacity>
                        </ThemedView>
                    );
                }}
                ListEmptyComponent={
                    <ThemedText style={{ alignSelf: "center", fontSize: 15, marginTop: 20 }}>
                        Empty List
                    </ThemedText>
                }
            />
        </ThemedView>
    );
}