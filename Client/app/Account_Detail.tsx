import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useContext, useState, useEffect } from "react";
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
import { ThemedButton } from "@/components/ThemedButton";
import { UserContext } from "@/hooks/conText/UserContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from "@expo/vector-icons/Entypo";

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
  const { URL } = useContext(ServerContext);
  const [Devices, setDevices] = useState(mockAccount.device);
  const [bioText, setBioText] = useState(mockAccount.note);
  const [showConfirmAll, setShowConfirmAll] = useState(false);

  const [showConfirmDeleteAccount,setShowConfirmDeleteAccount] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [username, setUsername] = useState(mockAccount.user_name);
  const [displayUsername, setDisplayUsername] = useState(mockAccount.user_name);
  const [modalVisible_Username, setModalVisible_Username] = useState(false);

  const [full_name, setFull_name] = useState(mockAccount.full_name);
  const [displayfull_name, setDisplayfull_name] = useState(
    mockAccount.full_name
  );
  const [modalVisible_Fullname, setModalVisible_Fullname] = useState(false);

  const [displaybirth_day, setDisplaybirth_day] = useState<Date>(new Date(mockAccount.birth_day));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalVisible_Birth_day, setModalVisible_Birth_day] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(mockAccount.birth_day));

  // ใช้ tempDate เก็บค่าชั่วคราวขณะเลือกวันเกิด
  const [tempDate, setTempDate] = useState<Date>(new Date(mockAccount.birth_day));

  const theme = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  // const [email, setEmail] = useState<string>("");
  const { email } = useContext(UserContext);
  const [isSending, setIsSending] = useState<
    "success" | "sending" | "fail" | null
  >(null);

  const [gender, setGender] = useState<"male" | "female" | null>(
    mockAccount.gender
  );

  const handleSignOutAll = () => 
    setShowConfirmAll(true);{
;
  };

  const handleDeleteAccount = () => {
    console.log("User deleted account");
    setIsloading(true);
    setIsDeleted(true); // ✅ แสดงข้อความ "ทำการลบบัญชีนี้แล้ว"

    setTimeout(() => {
      setIsloading(false)
    }, 2000);

    // ✅ หลังจาก 2 วินาที ให้นำทางไปหน้า "HomeScreen"
    setTimeout(() => {
      setShowConfirmDeleteAccount(false);
      // router.push("/Welcome"); // 🔹 แทนที่ Route ปัจจุบัน
    }, 5000);
  };

  const confirmSignOutAll = () => {
    setDevices([]);
    console.log("All devices have been signed out.");
    setShowConfirmAll(false);
};

  const handleSignOut = (deviceId: number) => {
    setDevices(Devices.filter((device) => device.device_id !== deviceId)); // ใช้ `devices` ที่มาจาก useState
    console.log(`Signing out from device ID: ${deviceId}`);
  };

  const showDatePicker = () => {
    setTempDate(selectedDate); // กำหนด tempDate ให้เท่ากับค่าที่ใช้อยู่
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date: Date) => {
    console.log("เลือกวันเกิด: ", date.toLocaleString("th-TH"));
    setTempDate(date); // กำหนด tempDate เป็นค่าที่เลือกใหม่
    hideDatePicker();
  };

  const sendEmail = email ?? "";
  const handleSendOTP = () => {
    setIsSending("sending");
    SendOTPHandler(URL, { email: sendEmail })
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

  useEffect(() => {
    if (modalVisible_Username) {
      setUsername(displayUsername);
    }
  }, [modalVisible_Username]);

  useEffect(() => {
    if (modalVisible_Fullname) {
      setFull_name(displayfull_name);
    }
  }, [modalVisible_Fullname]);

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
              {displayUsername}
            </ThemedText>
            <Pressable
              onPress={() => setModalVisible_Username(true)}
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
              {displayfull_name}{" "}
            </ThemedText>
            <Pressable
              onPress={() => setModalVisible_Fullname(true)}
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
          <ThemedText className="text-xl font-bold pl-3">
        {selectedDate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
      </ThemedText>
            <Pressable
              onPress={() => setModalVisible_Birth_day(true)}
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
                color: theme === "dark" ? "#888" : "#444",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme === "dark" ? "#2F2F2F" : "#0f0f0f",
                padding: 7,
                minHeight: 60,
                maxsssHeight: 100,
              }}
              placeholderTextColor={theme === "dark" ? "#888" : "#444"}
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
              {email}{" "}
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
              onPress={() => {
                handleSendOTP();
              }}
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

        <Pressable className="!items-center mb-10" onPress={() => setShowConfirmDeleteAccount(true)}>
          <ThemedView className="!justify-center !items-center flex pt-2 mt-5 rounded-2xl border-2 w-96">
            <ThemedText className="text-3xl">Delete Account</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedSafeAreaView>

      {/* ปุ่ม save */}
      <Pressable
        onPress={() => setIsEditing(!isEditing)}
        className="absolute top-3 right-3 bg-amber-500 px-4 py-2 rounded-lg shadow-lg"
      >
        <Text className="text-white font-bold">
          {isEditing ? "Save" : "Edit"}
        </Text>
      </Pressable>

      {showConfirmAll && (
        <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => setShowConfirmAll(false)} 
            style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <ThemedView activeOpacity={1} style={{
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
            }}>
                <ThemedText className="text-xl font-bold mb-2">Confirm Sign Out All</ThemedText>
                <ThemedText>Are you sure you want to sign out from all devices?</ThemedText>

                <ThemedView className="bg-transparent pt-3" style={{ flexDirection: "row", marginTop: 10,justifyContent: "space-between",gap:32 }}>
                  <TouchableOpacity className="p-3 w-24 bg-red-500 !items-center rounded-xl" onPress={confirmSignOutAll}>
                        <ThemedText className="text-white ">Confirm</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-3 bg-gray-400 w-24 !items-center rounded-xl" onPress={() => setShowConfirmAll(false)}>
                        <ThemedText className="text-white ">Cancel</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
    )}

{showConfirmDeleteAccount && (
  <Pressable 
    onPress={() => setShowConfirmDeleteAccount(false)} 
    style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Pressable onPress={(e) => e.stopPropagation()}>
      <ThemedView className="p-5 rounded-2xl items-center shadow-lg w-96">
        {/*  ถ้ายังไม่กดยืนยัน แสดง Modal ปกติ */}
        {!isDeleted ? (
          <>
            <ThemedText className="text-xl font-bold mb-2">Confirm Account Deletion</ThemedText>
            <ThemedText className="w-96 text-center">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </ThemedText>

            {/* ปุ่มกด Confirm & Cancel */}
            <ThemedView className="bg-transparent pt-3 flex-row justify-between gap-8">
              <TouchableOpacity 
                className="p-3 w-24 bg-red-500 items-center rounded-xl"  
                onPress={handleDeleteAccount}
              >
                <ThemedText className="text-white">Confirm</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                className="p-3 bg-gray-400 w-24 items-center rounded-xl" 
                onPress={() => setShowConfirmDeleteAccount(false)}
              >
                <ThemedText className="text-white">Cancel</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </>
        ) : (
          <ThemedView>
          <ThemedText className="text-xl font-bold mb-2">Account Deleted Successfully</ThemedText>
            <ThemedText className="w-96 text-center">
            The account has been successfully deleted.
            </ThemedText>
            <ThemedView className="mt-3">
            {isLoading  ? (
              <AntDesign
                key={"loading1"}
                name="loading2"
                size={44}
                color="#CEB036"
                className="animate-spin-ease"
              />
            )
           : (
            <AntDesign name="checkcircle" size={44} color="#2B9348" />
          )}
          </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </Pressable>
  </Pressable>
)}

      {modalVisible_Username && (
        <TouchableWithoutFeedback
          onPress={() => setModalVisible_Username(false)}
        >
          <ThemedView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <ThemedView
                style={{
                  width: 300,
                  padding: 20,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <ThemedText
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  What do you want to change your username to?
                </ThemedText>
                <ThemedInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter new username"
                  style={{
                    flex: 1,
                    backgroundColor: theme === "dark" ? "#121212" : "#f2f2f2",
                    color: theme === "dark" ? "#888" : "#444",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme === "dark" ? "#2F2F2F" : "#0f0f0f",
                    padding: 7,
                    minHeight: 60,
                    maxsssHeight: 100,
                    fontSize: 16,
                    marginBottom: 20,
                  }}
                  placeholderTextColor={theme === "dark" ? "#888" : "#444"}
                />

                {/* ปุ่มกด */}
                <ThemedView style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => setModalVisible_Username(false)}
                  >
                    <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "green",
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setDisplayUsername(username);
                      setModalVisible_Username(false);
                      // ดำเนินการลบที่นี่
                    }}
                  >
                    <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                      Confirm
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </TouchableWithoutFeedback>
      )}

      {modalVisible_Fullname && (
        <TouchableWithoutFeedback
          onPress={() => setModalVisible_Fullname(false)}
        >
          <ThemedView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <ThemedView
                style={{
                  width: 300,
                  padding: 20,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <ThemedText
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  What do you want to change your Full Name to?
                </ThemedText>
                <ThemedInput
                  value={full_name}
                  onChangeText={setFull_name}
                  placeholder="Enter new username"
                  style={{
                    flex: 1,
                    backgroundColor: theme === "dark" ? "#121212" : "#f2f2f2",
                    color: theme === "dark" ? "#888" : "#444",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme === "dark" ? "#2F2F2F" : "#0f0f0f",
                    padding: 7,
                    minHeight: 60,
                    maxsssHeight: 100,
                    fontSize: 16,
                    marginBottom: 20,
                  }}
                  placeholderTextColor={theme === "dark" ? "#888" : "#444"}
                />

                {/* ปุ่มกด */}
                <ThemedView style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => setModalVisible_Fullname(false)}
                  >
                    <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                      Cancel
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "green",
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setDisplayfull_name(full_name);
                      setModalVisible_Fullname(false);
                      // ดำเนินการลบที่นี่
                    }}
                  >
                    <ThemedText style={{ color: "white", fontWeight: "bold" }}>
                      Confirm
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </TouchableWithoutFeedback>
      )}

      {modalVisible_Birth_day && (
        <Pressable
          className="absolute top-0 left-0 w-full h-full bg-black/50 justify-center items-center"
          onPress={() => setModalVisible_Birth_day(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-white p-5 rounded-2xl w-80 items-center">
              <Text className="text-lg font-bold mb-3">Select Birth Date</Text>

              {/* DatePicker */}
              <View className="flex items-center mt-5">
      {/* Date Picker Modal */}
      <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                is24Hour={true}
                date={tempDate} // ใช้ tempDate แทน birth_day
                maximumDate={new Date()} // ป้องกันเลือกวันในอนาคต
                locale="th-TH"
              />

      {/* ปุ่มกดเปิด Date Picker */}
      <ThemedView className="w-40 bg-transparent">
        <Pressable onPress={showDatePicker}>
          <ThemedInput
            className="w-full"
            error=""
            value={tempDate.toLocaleDateString("th-TH", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
            editable={false} // ป้องกันการแก้ไขเอง
          />
        </Pressable>
      </ThemedView>
    </View>
            
              {/* ปุ่มกด */}
              <View className="flex-row gap-4 mt-5">
                <Pressable
                  className="bg-red-500 p-2 rounded-lg"
                  onPress={() => setModalVisible_Birth_day(false)}
                >
                  <Text className="text-white font-bold">Cancel</Text>
                </Pressable>

                <Pressable
                  className="bg-green-500 p-2 rounded-lg"
                  onPress={() => {
                    setSelectedDate(tempDate); 
                    setDisplaybirth_day(tempDate);
                    setModalVisible_Birth_day(false);
                  }}
                >
                  <Text className="text-white font-bold">Confirm</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      )}
    </>
  );
}
