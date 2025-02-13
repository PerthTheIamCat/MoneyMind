import { useState } from "react";
import { useColorScheme } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ListNotification } from "@/components/ListNotifiacation";

export default function Index() {
    const theme = useColorScheme();
    const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";

    const [data, setData] = useState([
        { mode: "red" ,Header: "Topic1", Description: "H3" },
        { mode: "yellow" ,Header: "Topic2", Description: "H4" },
        { mode: "green" ,Header: "Topic3", Description: "H5" },
        { mode: "red" ,Header: "Topic4", Description: "H6" },
        { mode: "red" ,Header: "Topic5", Description: "H6" },
    ]);

    return (
        
        <ThemedView className={`${componentcolor} h-ful justify-center items-start`}>
            <ListNotification data={data} />
        </ThemedView>
    );
}
