import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import React, { useContext, useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  Alert,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { UpdateUserDetailHandler } from "@/hooks/auth/PutUserDetail";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedInput } from "@/components/ThemedInput";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function Account_Detail() {
  const { URL } = useContext(ServerContext);
  const {
    fullname,
    username,
    userID,
    email,
    bio,
    gender,
    birthdate,
    setFullname,
    setUsername,
    setBirthdate,
    setGender,
    setEmail,
    setBio,
  } = useContext(UserContext);

  const [bioText, setBioText] = useState(bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedFullname, setEditedFullname] = useState(fullname);
  const [editedEmail, setEditedEmail] = useState(email);
  const [selectedDate, setSelectedDate] = useState<Date>(
    birthdate ? new Date(birthdate) : new Date()
  );
  const [isEditingDate, setIsEditingDate] = useState(false);

  const themed = useColorScheme();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (birthdate) {
      setSelectedDate(new Date(birthdate));
    }
  }, [birthdate]);

  const saveChanges = async () => {
    if (!userID) return;
    setIsLoading(true);

    const updatedUserDetails = {
      user_name: editedUsername || "",
      name: editedFullname || "",
      email: editedEmail || "",
      birth_date: selectedDate.toISOString().split("T")[0],
      gender: gender || "",
      bio: bioText,
    };
    console.log("Updated User Details:", updatedUserDetails);

    try {
      const response = await UpdateUserDetailHandler(
        URL,
        auth?.token!,
        userID,
        updatedUserDetails
      );
      if (response.success) {
        setUsername(updatedUserDetails.user_name);
        setFullname(updatedUserDetails.name);
        setBirthdate(updatedUserDetails.birth_date);
        setEmail(updatedUserDetails.email);
        setBio(updatedUserDetails.bio);

        Alert.alert("Success", "User details updated successfully.");
      } else {
        Alert.alert("Error", "Failed to update user details.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView className="justify-start !items-start pl-8 pt-3">
        <ThemedText className=" text-3xl font-bold ">Profile</ThemedText>
      </ThemedView>

      <ThemedView className="items-center justify-center">
        <Image
          source={require("@/assets/logos/LOGO.png")}
          style={styles.profileImage}
        />
      </ThemedView>

      <ThemedView
        style={themed === "dark" ? styles.sectionDark : styles.section}
      >
        {/* Username */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Username</ThemedText>
          {isEditing ? (
            <ThemedInput
              value={editedUsername}
              onChangeText={setEditedUsername}
              style={styles.inputField}
            />
          ) : (
            <ThemedText style={styles.value}>{username}</ThemedText>
          )}
        </View>

        {/* Full Name */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          {isEditing ? (
            <ThemedInput
              value={editedFullname}
              onChangeText={setEditedFullname}
              style={styles.inputField}
            />
          ) : (
            <ThemedText style={styles.value}>{fullname}</ThemedText>
          )}
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          {isEditing ? (
            <ThemedInput
              value={editedEmail}
              onChangeText={setEditedEmail}
              keyboardType="email-address"
              style={styles.inputField}
            />
          ) : (
            <ThemedText style={styles.value}>
              {email || "No Email Available"}
            </ThemedText>
          )}
        </View>

        {/* Date of Birth - Replaced with CustomDateTimePicker */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Date of Birth</ThemedText>
          {isEditing ? (
            <ThemedView>
              <Pressable
                onPress={() => setIsEditingDate(true)}
                style={styles.label}
              >
                <ThemedText>
                  {selectedDate.toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            <ThemedText style={styles.value}>
              {selectedDate.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </ThemedText>
          )}
        </View>

        {/* Bio */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Bio</ThemedText>
          <ThemedInput
            placeholder="About me..."
            value={bioText}
            onChangeText={setBioText}
            editable={isEditing}
            style={[
              styles.inputField,
              { backgroundColor: isEditing ? "#bdbdbd" : "#fff" },
            ]}
          />
        </View>
      </ThemedView>

      {/* Edit / Save Button */}
      <Pressable
        onPress={isEditing ? saveChanges : () => setIsEditing(true)}
        className="absolute top-3 right-3 bg-amber-500 px-4 py-2 rounded-lg shadow-lg"
      >
        <Text className="text-white font-bold">
          {isEditing ? "Save" : "Edit"}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isEditingDate}
        mode="date"
        onConfirm={(date) => {
          setSelectedDate(date);
          setIsEditingDate(false);
        }}
        onCancel={() => setIsEditingDate(false)}
        is24Hour={true}
        date={selectedDate}
        maximumDate={new Date()}
        timeZoneName="Asia/Bangkok"
        locale="th-TH"
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: "center",
    width: "90%",
  },
  sectionDark: {
    backgroundColor: "#181818",
    borderRadius: 15,
    padding: 20,
    marginTop: hp("5%"),
    marginBottom: 20,
    marginHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    margin: "2%",
    borderRadius: 999,
    backgroundColor: "#123561",
  },
  fieldContainer: {
    marginBottom: 10,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    width: wp("80%"),
    color: "#2e7d32",
  },
  value: {
    fontSize: 18,
    marginTop: 2,
  },
  inputField: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#bdbdbd",
    padding: 7,
    minHeight: 50,
  },
});
