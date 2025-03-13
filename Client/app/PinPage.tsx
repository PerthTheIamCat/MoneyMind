import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useEffect, useState, useContext } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedNumPad } from "@/components/ThemedNumPad";
import { UserContext } from "@/hooks/conText/UserContext";
import { ServerContext } from "@/hooks/conText/ServerConText";

export default function PinPage() {
  const auth = useContext(AuthContext);
  const [pin, setPin] = useState<string>("");
  const [code, setCode] = useState<number[]>([]);
  const theme = useColorScheme();
  const codeLength = Array(6).fill(0);
  const { userID } = useContext(UserContext);
  const { URL } = useContext(ServerContext);

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

  const handleVerifyPin = async () => {
    await auth?.verifyPin(userID!, code.join("")).then((res) => {
      if (res) {
        router.push("/(tabs)");
      } else {
        setCode([]);
        alert("Invalid PIN");
      }
    });
  };

  const handlePressBiometric = async () => {
    if (auth?.canUseBiometrics) {
      auth?.useAuthenticationWithBiometrics().then((res) => {
        if (res) {
          router.push("/(tabs)");
        } else {
          alert("Biometric verification failed");
        }
      });
    }
  };
  useEffect(() => {
    if (auth?.canUseBiometrics) {
      auth?.useAuthenticationWithBiometrics().then((res) => {
        if (res) {
          router.push("/(tabs)");
        }
      });
    }
  }, [auth?.canUseBiometrics]);

  useEffect(() => {
    if (code.length === 6) {
      handleVerifyPin();
    }
  }, [code]);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedView className="!justify-start !items-start w-full px-5 mt-5">
          <Ionicons name="arrow-back-outline" size={32} color="transparent" />
        </ThemedView>
        <ThemedView className="flex-1 justify-center h-full mb-10">
          <Image
            source={require("@/assets/logos/LOGO.png")}
            style={styles.logo}
          />
        </ThemedView>
        <ThemedText style={styles.greetings}>
          Enter your PIN to continue
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
            onPress={() => router.push("/PinRecovery")}
          >
            Forgot PIN?
          </ThemedText>
        </ThemedView>
        <ThemedNumPad
          onPress={handlePress}
          onPressBack={handlePressBack}
          onPressBiometric={handlePressBiometric}
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
