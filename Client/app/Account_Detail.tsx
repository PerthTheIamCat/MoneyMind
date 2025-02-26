import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import { TextInput } from "react-native-paper";
import { useColorScheme } from "react-native";
import ExpandableDeviceCard from "@/components/Expandable_Card";

interface Account {
  user_name: string;
  full_name: string;
  birth_day: string;
  gender: "female" | "male" | null;
  note: string;
  email: string;
  password: string;
  device_id : number;
  deviceType: string;
  location: string;
  ipAddress: string;
  lastSeen: string;
}

const mockAccount: Account = {
  user_name: "PS",
  full_name: "Pawarit",
  birth_day: "2022-01-01",
  gender: null,
  note: "Bankai",
  email: "PS@gmail.com",
  password: "123456789",
  device_id : 1,
  deviceType: "MacBook Pro",
  location: "Bangkok, Thailand",
  ipAddress: "192.168.1.100",
  lastSeen: "2024-02-26 14:30",
};

export default function Account_Detail() {
      const theme = useColorScheme();
  const [gender, setGender] = useState<"male" | "female" | null>(
    mockAccount.gender
  );

  const handleSignOut = (deviceId: number) => {
    console.log(`Signing out from device ID: ${deviceId}`);
};
  
  return (
    <ThemedSafeAreaView>
      <ThemedView className="justify-start !items-start pl-8 pt-3">
        <ThemedText className=" text-3xl font-bold ">Profile</ThemedText>
      </ThemedView>
      <ThemedView className="items-center justify-center">
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={{
            width: 100,
            height: 100,
            margin: "2%",
            borderRadius: 999,
            backgroundColor: "#123561",
          }}
        />
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Username</ThemedText>
        <ThemedText className=" text-xl font-bold pl-3">
          {mockAccount.user_name}
        </ThemedText>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Full Name</ThemedText>
        <ThemedText className=" text-xl font-bold pl-3">
          {mockAccount.full_name}
        </ThemedText>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Date of Birth</ThemedText>
        <ThemedText className=" text-xl font-bold pl-3">
          {mockAccount.birth_day}
        </ThemedText>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Gender</ThemedText>
        <ThemedView className="flex flex-row items-center ml-3 mt-2 border rounded-lg overflow-hidden w-96">
          <Pressable
            className={`flex-1 p-2 flex items-center border justify-center transition ${
              gender === "male" ? "bg-blue-500 " : "bg-gray-100"
            }`}
            onPress={() => setGender("male")}
          >
            <Foundation name="male-symbol" size={24} color="black" />
          </Pressable>
          <Pressable
            className={`flex-1 p-2 flex items-center border justify-center transition ${
              gender === "female" ? "bg-pink-500 " : "bg-gray-100"
            }`}
            onPress={() => setGender("female")}
          >
            <Foundation name="female-symbol" size={24} color="black" />
          </Pressable>
        </ThemedView>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2 flex-col gap-2">
        <ThemedText className=" text-2xl font-bold ">Bio</ThemedText>
        <ThemedView className="w-96 flex-row pl-0 mt-0 ml-3 rounded-3xl bg-transparent">
          <TextInput
            placeholder= {mockAccount.note}
            keyboardType="default"
            multiline={true}
            textAlignVertical="top"
            style={{
              flex: 1,
              backgroundColor: theme === "dark" ? "#121212" : "#f2f2f2",
              color: theme === "dark" ? "#FFF" : "#2F2F2F",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme === "dark" ? "#2F2F2F" : "#000000",
              padding: 3,
              minHeight: 40,
              maxHeight: 100,
            }}
            placeholderTextColor={theme === "dark" ? "#888" : "#555"}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView className="!items-start pl-8 pt-2">
        <ThemedText className="text-3xl font-bold">Account</ThemedText>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Email</ThemedText>
        <ThemedText className=" text-xl font-bold pl-3">
          {mockAccount.email}
        </ThemedText>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Password</ThemedText>
        <ThemedText className=" text-xl font-bold pl-3">
        {"*".repeat(mockAccount.password.length)}
        </ThemedText>
      </ThemedView>
      <ThemedView className="justify-start !items-start pl-8 pt-2">
        <ThemedText className=" text-2xl font-bold ">Device Management</ThemedText>
        <ThemedText className=" text-xl font-bold pl-3">
        <ExpandableDeviceCard
            key={mockAccount.device_id}
            deviceDetails={mockAccount}
            onSignOut={() => handleSignOut(mockAccount.device_id)}
          />  
        </ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
