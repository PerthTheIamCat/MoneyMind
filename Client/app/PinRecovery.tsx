import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useContext } from "react";
import { Alert, StyleSheet, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ThemedNumPad } from "@/components/ThemedNumPad";
import { Image } from "expo-image";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";


export default function PinRecovery() {
    const [OTP,setOTP] = useState<number[]>([]);
    const theme = useColorScheme();
    const opt = Array(6).fill(0);
    const [email, setEmail] = useState<string>("");
    const auth = useContext(AuthContext);
    const [password, setPassword] = useState<string>("");


    
    return (
        <ThemedSafeAreaView>
            <ThemedView className="!justify-start !items-start w-full px-5 mt-5">
                <Ionicons name="arrow-back-outline" size={32} color="black" onPress={() => router.back()} />
            </ThemedView>
            <ThemedView className="my-5">
                <Image
                    source={require("@/assets/logos/LOGO.png")}
                    style={{
                        width: 200,
                        height: 200,
                        marginTop: 40   ,
                    }}

                />
                <ThemedView className="flex-column mt-5 w-[75%]">
                    <ThemedText style = {[styles.greetings]}>
                        Email Verification
                    </ThemedText>
                    <ThemedText style = {styles.explain} className="justify-center">
                        OTP will send into your email address please go check your email to proceed.
                    </ThemedText>

                </ThemedView>
                <ThemedView className="w-[80%] mt-5 px-5 gap-5">
                    <ThemedInput 
                        className="w-full"
                        value = {email}
                        onChangeText = {setEmail}
                        title="Enter your email"
                        placeholder="example@money.com"
                        >
                    </ThemedInput>
                </ThemedView>
                
                <ThemedView className="flex-row mt-5 w-[80%]">
                    <ThemedButton 
                        className="w-[90%] h-15"
                        mode="confirm"
                        onPress={() => router.push("/PinRecovery2")}
                    >
                        Send OTP
                    </ThemedButton>
                </ThemedView>
            </ThemedView>
        </ThemedSafeAreaView>
    )
}
const styles = StyleSheet.create(
    {
        greetings: {
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 10,
            marginTop:10,
            alignSelf: "center",
          },
        explain: {
            fontSize : 14,
            textAlign: "center",
        }
    }
)