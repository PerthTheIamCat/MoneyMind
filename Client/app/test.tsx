import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { usePushNotification } from "@/hooks/auth/NotificationService";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

export default function test() {
  const { expoPushToken, notification } = usePushNotification();

  const data = JSON.stringify(notification, undefined, 2);

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <ThemedText>Token : {expoPushToken?.data ?? ""}</ThemedText>
        <ThemedText>Notification : {data}</ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
