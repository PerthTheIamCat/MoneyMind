import { ThemedView } from "@/components/ThemedView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { FlatList } from "react-native";
import { useColorScheme } from "react-native";

export default function Index(){
    const theme = useColorScheme();
    const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";
    const componenticon = theme === "dark" ? "#f2f2f2" : "#2f2f2f";
  
    const [data, setData] = useState([
        { Headers: "Hello_WORLD", Discription: "H2" },
        { Headers: "Hello_WORLD1", Discription: "H3" },
        { Headers: "Hello_WORLD2", Discription: "H4" },
        { Headers: "Hello_WORLD3", Discription: "H5" },
        { Headers: "Hello_WORLD4", Discription: "H6" },
        { Headers: "Hello_WORLD5", Discription: "H6" },
    ]);

    return(
        <ThemedView className={`${componentcolor} h-full justify-start items-start `}>
            <FlatList className="w-5/6"
                data={data}
                renderItem={({ item }) => (
                    <ThemedView className="mt-5 rounded-xl h-20">
                        <ThemedText className="text-lg font-bold !justify-start">{item.Headers}</ThemedText>
                        <ThemedText className="text-sm">{item.Discription}</ThemedText>
                    </ThemedView>
                )}
                keyExtractor={(item)=>item.Headers}
                ListEmptyComponent={<ThemedText style={{alignSelf:"center", fontSize:15, marginTop:20}}> Empty List</ThemedText>}
            />
            
        </ThemedView>
    )
}