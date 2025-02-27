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
    onSignOutAll?: () => void;
}

const ExpandableDeviceCard: React.FC<DeviceProps> = ({ deviceDetails, onSignOut}) => {
    const [isExpanded, setIsExpanded] = useState(false);

      const theme = useColorScheme();
      const componentcolor = theme === "dark" ? "#181818" : "#d8d8d8";

    return (
        <TouchableOpacity onPress={() => setIsExpanded((prev) => !prev)} activeOpacity={1}>
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
                <ThemedView className="bg-transparent py-2" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <ThemedText className="font-bold text-xl">{deviceDetails.deviceType}</ThemedText>
                        <ThemedText className="font-bold">{deviceDetails.location}</ThemedText>
                    </View>

                    <TouchableOpacity
                        onPress={onSignOut}
                        style={{
                            position: "absolute",
                            right: 0, // ชิดขวา
                            top: "50%", // ตรงกลาง
                            transform: [{ translateY: -12 }], // ปรับสมดุลแนวตั้ง
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            // backgroundColor: "red",
                            borderRadius: 5,
                        }}
                    >
                        <ThemedText className="text-lg font-bold">Sign Out</ThemedText>
                    </TouchableOpacity>

                    {/* <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="white" /> */}
                </ThemedView>

                {/* Expanded Content */}
                {isExpanded && (
                    <ThemedView className="!justify-start !items-start"
                    style={{ backgroundColor: componentcolor }}>
                        <ThemedText>
                            <ThemedText className="font-bold">IP Address:</ThemedText> {deviceDetails.ipAddress}
                        </ThemedText>
                        <ThemedText>
                            <ThemedText className="font-bold">Last Seen:</ThemedText> {deviceDetails.lastSeen}
                        </ThemedText>
                    </ThemedView>
                )}

            </MotiView>
        </TouchableOpacity>
    );
};

export default ExpandableDeviceCard;
