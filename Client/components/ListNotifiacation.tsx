import { FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

interface NotificationItem{
    mode: string;
    Header: string;
    Description: string;
}

interface ListNotificationProps{
    data: NotificationItem[];
}

export function ListNotification({data=[]}: ListNotificationProps){
    return (
        <ThemedView className="bg-transparent">
            <FlatList
                data={data}
                keyExtractor={(_,index) => index.toString()}
                renderItem={({ item }) => {
                    const bgColor = item.mode === "red" ? "bg-red-400" : 
                                    item.mode==="yellow"? "bg-yellow-400": 
                                    item.mode==="green"? "bg-green-400":
                                    "bg-black-500";
                    
                    return (
                        <ThemedButton className={`mt-2 w-full bg-transparent`}>
                            <ThemedView className={`flex-row rounded-3xl h-24 w-[95%] pl-5 !justify-start ${bgColor}`}>
                                <ThemedView className="bg-white w-16 h-16 rounded-full"/>
                                <ThemedView className={`ml-5  bg-transparent !items-start`}>
                                    <ThemedText className="text-lg font-bold">{item.Header}</ThemedText>
                                    <ThemedText className="text-sm ">{item.Description}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </ThemedButton>
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
