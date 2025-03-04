import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useContext } from "react";
import { Alert, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ServerContext } from "@/hooks/conText/ServerConText";
import { ChangePasswordHandler } from "@/hooks/auth/ChangePasswordHandler";
import { UserContext } from "@/hooks/conText/UserContext";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { useSearchParams } from "expo-router/build/hooks";


export default function PasswordRecovery() {
  const { URL } = useContext(ServerContext);
  const { userID } = useContext(UserContext);
  const auth = useContext(AuthContext);
  const parseEmail = useSearchParams().get("email");
  const parseOtp = useSearchParams().get("otp");
  
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    // Validation
    if (!password) {
      setErrorPassword("Enter a new password");
      return;
    } else {
      setErrorPassword("");
    }

    if(password.length < 8){
      setErrorPassword("Password must longer than 8 characters!")
    } 

    if (!confirmPassword) {
      setErrorConfirmPassword("Confirm your password");
      return;
    } else {
      setErrorConfirmPassword("");
    }

    if (password !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match");
      return;
    }

    if (!parseEmail || !parseOtp) {
      Alert.alert("Error", "Invalid email or OTP. Please try again.");
      return;
    }

    setIsLoading(true);

    // Call API
    try {
      const response = await ChangePasswordHandler(URL, { password: password }, parseOtp!, parseEmail!);

      if (response.success) {
        Alert.alert("Success", "Password reset successfully!");
        router.replace("/SignIn");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView className="mt-10">
        <Image
            source={require("@/assets/logos/LOGO.png")}
            style={{
              width: 150,
              height: 150,
              marginTop: 20,
            }}
          />
      </ThemedView>
      <ThemedView className="items-center mt-10">
        <ThemedText className="text-3xl font-bold">Reset Password</ThemedText>
      </ThemedView>

      <ThemedView className="w-[85%] mt-10 px-5 gap-5 self-center">
        <ThemedInput
          value={password}
          title="New Password"
          error={errorPassword}
          secureTextEntry
          className="w-full"
          onChangeText={setPassword}
        />

        <ThemedInput
          value={confirmPassword}
          title="Confirm New Password"
          error={errorConfirmPassword}
          secureTextEntry
          className="w-full"
          onChangeText={setConfirmPassword}
        />

        <ThemedButton
          mode="confirm"
          className="w-full mt-5 h-14"
          onPress={handleConfirm}
          isLoading={isLoading}
        >
          Confirm
        </ThemedButton>

        <TouchableOpacity onPress={() => router.replace("/SignIn")}>
          <ThemedText className="mt-3 text-center underline">
            Back to Sign In
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}
