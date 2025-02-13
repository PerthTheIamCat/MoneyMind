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
        <ThemedView className="bg-transparent ">
            <FlatList
                data={data}
                keyExtractor={(_,index) => index.toString()}
                renderItem={({ item }) => {
                    const bgColor = item.mode === "red" ? "bg-red-400" : 
                                    item.mode==="yellow"? "bg-yellow-400": 
                                    item.mode==="green"? "bg-green-400":
                                    "bg-black-500";
                    
                    return (
                        <ThemedButton className={`mt-1 ${bgColor} w-full`}>
                          
                            <ThemedView className={`mt-5 rounded-xl h-20 w-4/5 pl-10 !items-start ${bgColor}`}>
                                <ThemedText className="text-lg font-bold">{item.Header}</ThemedText>
                                <ThemedText className="text-sm">{item.Description}</ThemedText>
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
