import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useContext, useState } from "react";
import { Pressable } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import { TextInput } from "react-native-paper";
import { useColorScheme } from "react-native";
import ExpandableDeviceCard from "@/components/Expandable_Card";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Modal } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { ThemedInput } from "@/components/ThemedInput";
import { router } from "expo-router";
import { SendOTPHandler } from "@/hooks/auth/SendOTPHandler";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { Alert } from "react-native";

interface Device {
  device_id: number;
  deviceType: string;
  location: string;
  ipAddress: string;
  lastSeen: string;
}

interface Account {
  user_name: string;
  full_name: string;
  birth_day: string;
  gender: "female" | "male" | null;
  note: string;
  email: string;
  password: string;
  device: Device[];
}

const mockAccount: Account = {
  user_name: "PS",
  full_name: "Pawarit",
  birth_day: "2022-01-01",
  gender: null,
  note: "Bankai",
  email: "PS@gmail.com",
  password: "123456789",
  device: [
    {
      device_id: 1,
      deviceType: "iPhone 13 Pro",
      location: "Bangkok, Thailand",
      ipAddress: "192.168.1.10",
      lastSeen: "10 minutes ago",
    },
    {
      device_id: 2,
      deviceType: "MacBook Pro M2",
      location: "Chiang Mai, Thailand",
      ipAddress: "192.168.1.20",
      lastSeen: "3 hours ago",
    },
    {
      device_id: 3,
      deviceType: "iPad Air 5",
      location: "Pattaya, Thailand",
      ipAddress: "192.168.1.30",
      lastSeen: "1 day ago",
    },
    {
      device_id: 4,
      deviceType: "Samsung Galaxy S22 Ultra",
      location: "Phuket, Thailand",
      ipAddress: "192.168.1.40",
      lastSeen: "2 weeks ago",
    },
  ],
};

export default function Account_Detail() {
  const {URL} = useContext(ServerContext);
  const [Devices, setDevices] = useState(mockAccount.device);
  const [bioText, setBioText] = useState("");
  const theme = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const [account, setAccount] = useState<Account>(mockAccount);
  const [email, setEmail] = useState<string>("");
  const [isSending, setIsSending] = useState<"success" | "sending" | "fail" | null>(null);

  const [gender, setGender] = useState<"male" | "female" | null>(
    mockAccount.gender
  );

  const handleEditPress = (field: keyof Account) => {
    if (isEditing) {
      setModalVisible(true);
      setEditField(field);
      setTempValue(String(account[field]));
    }
  };

  const handleSave = () => {
    setAccount({ ...account, [editField]: tempValue });
    setModalVisible(false);
  };

  const getTextColor = () => {
    return theme === "dark" ? "#FFF" : "#2F2F2F"; // สีข้อความเปลี่ยนตามธีม
  };

  const getPlaceholderColor = () => {
    return theme === "dark" ? "#888" : "#fff"; // สีของ placeholder เปลี่ยนตามธีม
  };

  const handleSignOutAll = () => {
    setDevices([]);
    console.log("All devices have been signed out.");
  };

  const handleSignOut = (deviceId: number) => {
    setDevices(Devices.filter((device) => device.device_id !== deviceId)); // ใช้ `devices` ที่มาจาก useState
    console.log(`Signing out from device ID: ${deviceId}`);
  };

  const handleSendOTP = () => {
      setIsSending("sending");
      SendOTPHandler(URL, { email })
        .then((response) => {
          if (response.success) {
            setIsSending("success");
            Alert.alert("Success", "OTP sent to your email address.");
            router.push({
              pathname: "/OTPpasswordVerify",
              params: { email },
            });
          } else {
            setIsSending("fail");
            Alert.alert("Error", "Failed to send OTP. Please try again.");
            console.error(response.message);
          }
        })
        .catch((error) => {
          setIsSending("fail");
          Alert.alert("Error", "Failed to send OTP. Please try again.");
          console.error(error);
        });
    };

  return (
    <>
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
        <ThemedView className="justify-start !items-start pl-8 pt-2 ">
          <ThemedText className=" text-2xl font-bold ">Username</ThemedText>

          <ThemedView className="flex-row justify-between items-center w-full pr-8">
            <ThemedText className=" text-xl font-bold pl-3 ">
              {mockAccount.user_name}{" "}
            </ThemedText>
            <Pressable
              onPress={() => handleEditPress("user_name")}
              disabled={!isEditing}
            >
              <ThemedText style={{ opacity: isEditing ? 1 : 0.5 }}>
                <FontAwesome6 name="edit" size={24} />
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        <ThemedView className="justify-start !items-start pl-8 pt-2">
          <ThemedText className=" text-2xl font-bold ">Full Name</ThemedText>
          <ThemedView className="flex-row justify-between items-center w-full pr-8">
            <ThemedText className=" text-xl font-bold pl-3 ">
              {mockAccount.full_name}{" "}
            </ThemedText>
            <Pressable
              onPress={() => handleEditPress("full_name")}
              disabled={!isEditing}
            >
              <ThemedText style={{ opacity: isEditing ? 1 : 0.5 }}>
                <FontAwesome6 name="edit" size={24} />
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>

        <ThemedView className="justify-start !items-start pl-8 pt-2">
          <ThemedText className=" text-2xl font-bold ">
            Date of Birth
          </ThemedText>
          <ThemedView className="flex-row justify-between items-center w-full pr-8">
            <ThemedText className=" text-xl font-bold pl-3">
              {mockAccount.birth_day}
            </ThemedText>
            <Pressable
              onPress={() => handleEditPress("birth_day")}
              disabled={!isEditing}
            >
              <ThemedText style={{ opacity: isEditing ? 1 : 0.5 }}>
                <FontAwesome6 name="edit" size={24} />
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        <ThemedView className="justify-start !items-start pl-8 pt-2">
          <ThemedText className=" text-2xl font-bold ">Gender</ThemedText>
          <ThemedView className="flex flex-row items-center ml-3 mt-2 border rounded-lg overflow-hidden w-96">
            <Pressable
              className={`flex-1 p-2 flex items-center border justify-center transition ${
                gender === "male" ? "bg-blue-500 " : "bg-gray-100"
              }`}
              onPress={() => isEditing && setGender("male")}
            >
              <Foundation name="male-symbol" size={24} color="black" />
            </Pressable>
            <Pressable
              className={`flex-1 p-2 flex items-center border justify-center transition ${
                gender === "female" ? "bg-pink-500 " : "bg-gray-100"
              }`}
              onPress={() => isEditing && setGender("female")}
            >
              <Foundation name="female-symbol" size={24} color="black" />
            </Pressable>
          </ThemedView>
        </ThemedView>
        <ThemedView className="justify-start !items-start pl-8 pt-2 flex-col gap-2">
          <ThemedText className=" text-2xl font-bold ">Bio</ThemedText>
          <ThemedView className="w-96 flex-row pl-0 mt-0 ml-3 rounded-3xl bg-transparent">
            <ThemedInput
              placeholder="About me..."
              keyboardType="default"
              multiline={true}
              textAlignVertical="top"
              style={{
                flex: 1,
                backgroundColor: theme === "dark" ? "#121212" : "#f2f2f2",
                color: getTextColor(),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#2F2F2F" : "#ffffff",
                padding: 3,
                minHeight: 60,
                maxsssHeight: 100,
              }}
              placeholderTextColor={getPlaceholderColor()}
              value={bioText} // ค่าข้อความที่พิมพ์
              onChangeText={(newText) => setBioText(newText)}
              editable={isEditing}
            />
          </ThemedView>
        </ThemedView>
        <ThemedView className="!items-start pl-8 pt-2">
          <ThemedText className="text-3xl font-bold">Account</ThemedText>
        </ThemedView>
        <ThemedView className="justify-start !items-start pl-8 pt-2">
          <ThemedText className=" text-2xl font-bold ">Email</ThemedText>

          <ThemedView className="flex-row justify-between items-center w-full pr-8">
            <ThemedText className=" text-xl font-bold pl-3 ">
              {mockAccount.email}{" "}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView className="justify-start !items-start pl-8 pt-2">
          <ThemedText className=" text-2xl font-bold ">Password</ThemedText>

          <ThemedView className="flex-row justify-between items-center w-full pr-8">
            <ThemedText className=" text-xl font-bold pl-3">
              {"*".repeat(mockAccount.password.length)}
            </ThemedText>
            <Pressable
              onPress={() => {handleSendOTP} }
              disabled={!isEditing}
            >
              <ThemedText style={{ opacity: isEditing ? 1 : 0.5 }}>
                <FontAwesome6 name="edit" size={24} />
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        <ThemedView className="justify-start !items-start pl-8 pt-2">
          <ThemedText className=" text-2xl font-bold ">
            Device Management
          </ThemedText>
          <ThemedView className=" text-xl font-bold pl-3 mt-2 flex-col gap-2">
            {mockAccount.device.map((device) => (
              <ExpandableDeviceCard
                key={device.device_id}
                deviceDetails={device}
                onSignOut={() => handleSignOut(device.device_id)}
                onSignOutAll={handleSignOutAll}
              />
            ))}
            {mockAccount.device.length > 0 && (
              <TouchableOpacity
                onPress={handleSignOutAll}
                style={{
                  alignSelf: "flex-end",
                  marginRight: 10,
                  marginTop: 0,
                  paddingVertical: 0,
                  paddingHorizontal: 5,
                  // backgroundColor: "red",
                  borderRadius: 5,
                }}
              >
                <ThemedText className="text-xl font-bold">
                  Sign Out All
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>

        <Pressable className="!items-center mb-10">
          <ThemedView className="!justify-center !items-center flex pt-2 mt-5 rounded-2xl border-2 w-96">
            <ThemedText className="text-3xl">Delete Account</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedSafeAreaView>

      <Pressable
        onPress={() => setIsEditing(!isEditing)}
        className="absolute top-3 right-3 bg-amber-500 px-4 py-2 rounded-lg shadow-lg"
      >
        <Text className="text-white font-bold">
          {isEditing ? "Save" : "Edit"}
        </Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <ThemedView
              className="w-96 h-64 p-4 rounded-2xl"
              style={{
                backgroundColor: "red",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", top: 50, left: 50 }}
              >
                Edit {editField.replace("_", " ")}
              </Text>
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  width: "100%",
                  marginVertical: 10,
                  padding: 5,
                }}
                value={tempValue}
                onChangeText={setTempValue}
              />
              <Pressable onPress={handleSave} style={{ marginTop: 10 }}>
                <Text style={{ color: "blue", fontWeight: "bold" }}>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 10 }}
              >
                <Text style={{ color: "red" }}>Cancel</Text>
              </Pressable>
            </ThemedView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
