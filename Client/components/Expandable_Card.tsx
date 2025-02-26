import React, { useState } from "react";
import { MotiView } from "moti";
import { View, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useColorScheme } from "react-native";

interface DeviceProps {
    deviceDetails: {
        deviceType: string;
        location: string;
        ipAddress: string;
        lastSeen: string;
    };
    onSignOut: () => void;
}

const ExpandableDeviceCard: React.FC<DeviceProps> = ({ deviceDetails, onSignOut }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };
      const theme = useColorScheme();
      const componentcolor = theme === "dark" ? "!bg-[#181818]" : "!bg-[#d8d8d8]";

    return (
        <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 300 }}
                style={{
                    backgroundColor: componentcolor,
                    padding: 15,
                    borderRadius: 10,
                    width: 350,
                    minHeight: 50,
                    borderColor: "#000000",
                    borderWidth: 1,
                    position: "relative", // ให้เป็นจุดอ้างอิงสำหรับตำแหน่งของ Sign Out
                }}
            >
                {/* Header - Device Type + Location + Toggle Button */}
                <ThemedView className="bg-transparent" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <ThemedText >{deviceDetails.deviceType}</ThemedText>
                        <ThemedText >{deviceDetails.location}</ThemedText>
                    </View>

                    <TouchableOpacity
                        onPress={onSignOut}
                        style={{
                            position: "absolute",
                            right: 10, // ชิดขวา
                            top: "50%", // ตรงกลาง
                            transform: [{ translateY: -12 }], // ปรับสมดุลแนวตั้ง
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            backgroundColor: "red",
                            borderRadius: 5,
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 14 }}>Sign Out</Text>
                    </TouchableOpacity>

                    {/* <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="white" /> */}
                </ThemedView>

                {/* Expanded Content */}
                {isExpanded && (
                    <ThemedView className="!justify-start !items-start bg-transparent">
                        <Text>
                            <ThemedText>IP Address:</ThemedText> {deviceDetails.ipAddress}
                        </Text>
                        <Text>
                            <ThemedText>Last Seen:</ThemedText> {deviceDetails.lastSeen}
                        </Text>
                    </ThemedView>
                )}
            </MotiView>
        </TouchableOpacity>
    );
};

export default ExpandableDeviceCard;
