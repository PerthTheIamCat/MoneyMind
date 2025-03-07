import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useEffect, useState, useContext } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedNumPad } from "@/components/ThemedNumPad";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { UserContext } from "@/hooks/conText/UserContext";
import axios from "axios";

export default function CreatePinPage() {
  const auth = useContext(AuthContext);
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [code, setCode] = useState<number[]>([]);
  const theme = useColorScheme();
  const codeLength = Array(6).fill(0);
  const { URL } = useContext(ServerContext);
  const { userID } = useContext(UserContext);

  // Function to handle biometric authentication
  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert("Biometric authentication is not available on this device.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to set your PIN",
      fallbackLabel: "Use your PIN instead",
    });

    if (result.success) {
      Alert.alert("Biometric authentication successful!");
      router.replace("/(tabs)"); // Redirect after authentication
    } else {
      Alert.alert("Authentication failed. Try again.");
    }
  };

  const handleSetPin = () => {
    if (confirmPin === pin) {
      axios
        .post(
          `${URL}/auth/createpin`,
          { user_id: userID!, pin: pin },
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            router.replace("/(tabs)");
          } else {
            setPin("");
            setConfirmPin("");
            setCode([]);
            Alert.alert("Error setting PIN");
          }
        });
    } else {
      setPin("");
      setConfirmPin("");
      setCode([]);
      Alert.alert("PIN does not match");
    }
  };

  const handlePress = (value: string) => {
    if (code.length < 6) {
      setCode((prevCode) => [...prevCode, parseInt(value)]);
    }
  };

  const handlePressBack = () => {
    if (code.length > 0) {
      setCode(code.slice(0, code.length - 1));
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      if (pin === "") {
        setPin(code.join(""));
        setCode([]);
      } else {
        setConfirmPin(code.join(""));
        setCode([]);
      }
    }
  }, [code]);

  useEffect(() => {
    if (confirmPin !== "" && pin !== "" && confirmPin === pin) {
      handleSetPin();
    }
  }, [confirmPin, pin]);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        {pin !== "" ? (
          <ThemedView className="!justify-start !items-start w-full px-5 mt-5">
            <Ionicons
              name="arrow-back-outline"
              size={32}
              color={theme === "dark" ? "#F2F2F2" : "#2F2F2F"}
              onPress={() => {
                setPin("");
                setConfirmPin("");
              }}
            />
          </ThemedView>
        ) : (
          <ThemedView className="!justify-start !items-start w-full px-5 mt-5">
            <Ionicons name="arrow-back-outline" size={32} color="transparent" />
          </ThemedView>
        )}
        <ThemedView className="flex-1 justify-center h-full mb-10">
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={styles.logo}
          />
        </ThemedView>
        <ThemedText style={styles.greetings}>
          {pin === "" ? "Create your PIN code" : "Enter your PIN again"}
        </ThemedText>
        <ThemedView style={styles.codeView}>
          {codeLength.map((_, index) => (
            <ThemedView
              key={index}
              style={[
                styles.codeEmpty,
                code[index] !== undefined ? styles.codeEntered : null,
              ]}
            />
          ))}
        </ThemedView>
        <ThemedView
          style={styles.numbersView}
          className="flex-row justify-center gap-5 my-5"
        >
          <ThemedText
            style={[styles.underline, styles.forgot]}
            onPress={() => router.replace("/PinPage")}
          >
            Forgot PIN?
          </ThemedText>
        </ThemedView>
        <ThemedNumPad
          haveBiometric={false} // Ensure biometric is available
          onPress={handlePress}
          onPressBack={handlePressBack}
          onPressBiometric={handleBiometricAuth} // Assign biometric function
        />
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  greetings: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  codeView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginVertical: 50,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#AACC00",
  },
  codeEntered: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#AACC00",
  },
  numbersView: {
    marginHorizontal: 80,
    gap: 60,
  },
  number: {
    fontSize: 32,
    fontWeight: "bold",
  },
  forgot: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
  italic: { fontStyle: "italic" },
  underline: { textDecorationLine: "underline" },
  roundButton1: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#f1f1f1",
  },
});
