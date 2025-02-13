import { useState } from "react";
import { useColorScheme } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ListNotification } from "@/components/ListNotifiacation";

export default function Index() {
    const theme = useColorScheme();
    const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";

    const [data, setData] = useState([
        { Header: "Topic1", Description: "H3" },
        { Header: "Topic2", Description: "H4" },
        { Header: "Topic3", Description: "H5" },
        { Header: "Topic4", Description: "H6" },
        { Header: "Topic5", Description: "H6" },
    ]);

    return (
        
        <ThemedView className={`${componentcolor} h-full justify-center items-start`}>
            <ListNotification data={data} />
        </ThemedView>
    );
}
