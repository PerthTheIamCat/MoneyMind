import { FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

interface NotificationItem{
    Header: string;
    Description: string;
}

interface ListNotificationProps{
    data: NotificationItem[];
}

export function ListNotification({data=[]}: ListNotificationProps){
    return (
        <ThemedView>
            <FlatList
                data={data}
                keyExtractor={(_,index) => index.toString()}
                renderItem={({ item }) => (
                    <ThemedButton className="mt-1  bg-red-200">
                        
                        <ThemedView className="rounded-xl h-20 w-4/5 !items-start bg-transparent">
                            <ThemedText className="text-lg font-bold">{item.Header}</ThemedText>
                            <ThemedText className="text-sm">{item.Description}</ThemedText>
                        </ThemedView>
                    </ThemedButton>
                )}
                ListEmptyComponent={
                    <ThemedText style={{ alignSelf: "center", fontSize: 15, marginTop: 20 }}>
                        Empty List
                    </ThemedText>
                }
            />
        </ThemedView>
    );
}
