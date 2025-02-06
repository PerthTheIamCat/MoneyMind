import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function TabLayout() {
  // const { theme } = useTheme();
  const theme = useColorScheme();
  // console.log("theme: ",theme);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme === "dark" ? "#AACC00" : "#007F5F",
        tabBarInactiveTintColor: theme === "dark" ? "#F2F2F2" : "#2F2F2F",
        animation: "none",
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#2F2F2F" : "#F2F2F2",
          borderTopColor: theme === "dark" ? "#F2F2F2" : "#2F2F2F",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="splitpay" options={{ title: "SplitPay",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ), }} />
      <Tabs.Screen name="transaction" options={{ title: "Transaction",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),}} />
      <Tabs.Screen name="retire" options={{ title: "Retire",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ), }} />
      <Tabs.Screen name="me" options={{ title: "Me",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ), }} />
    </Tabs>
  );
}
