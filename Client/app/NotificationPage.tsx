import { useState } from "react";
import { useColorScheme } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ListNotification } from "@/components/ListNotification";

export default function Index() {
    const theme = useColorScheme();
    const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";

    const [data, setData] = useState([
        { id: 1 ,mode: "red" ,Header: "Monthly Summary", Description: "You didn't save enough money last month try to be better next month." },
        { id: 2 ,mode: "green" ,Header: "Monthly Summary", Description: "You save enough money last month keep it up in next month." },
        { id: 3 ,mode: "red" ,Header: "Nearly out of money", Description: "Your funds are running low. Spend wisely before it all slips away." },
        { id: 4 ,mode: "red" ,Header: "Out of money", Description: "Your funds are depleted. NOw is th time to rely on practice and careful planning to start anew.  " },
        { id: 5 ,mode: "yellow" ,Header: "New device logged in", Description: "New device logged in on 11/01/2025 11:10 . If this not you please go to setting and change your password" },
        { id: 6 ,mode: "yellow" ,Header: "Password changed", Description: "Password change successfully." },
    ]);

    const deleteNotification=(id:number)=>{
        setData((prevData)=>prevData.filter((item)=>item.id !== id));
    };
    
    return(
        <ThemedView className={`${componentcolor}`}>
            <ListNotification data={data} onDelete={deleteNotification} />
        </ThemedView>
    );
}
