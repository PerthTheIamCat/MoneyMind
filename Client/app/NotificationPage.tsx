import { ThemedView } from "@/components/ThemedView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { FlatList } from "react-native";

export default function Index(){
    const [data, setData] = useState([
        { Headers: "Hello_WORLD", Discription: "H2" },
        { Headers: "Hello_WORLD", Discription: "H3" },
        { Headers: "Hello_WORLD", Discription: "H4" },
        { Headers: "Hello_WORLD", Discription: "H5" },
        { Headers: "Hello_WORLD", Discription: "H6" },
        { Headers: "Hello_WORLD", Discription: "H6" },
    ]);

    return(
        <ThemedView className=" bg-red-500 h-full justify-start items-start ">
            <FlatList className="w-6/12"
                data={data}
                renderItem={({ item }) => (
                    <ThemedView className="mt-4 bg-white ">
                        <ThemedText className="text-lg font-bold">{item.Headers}</ThemedText>
                        <ThemedText className="text-sm">{item.Discription}</ThemedText>
                    </ThemedView>
                )}
                keyExtractor={(item)=>item.Headers}
                ListEmptyComponent={<ThemedText style={{alignSelf:"center", fontSize:15, marginTop:20}}> Empty List</ThemedText>}
            />
            
        </ThemedView>
    )
}