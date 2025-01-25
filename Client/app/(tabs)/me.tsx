import { Text, View } from "react-native";

export default function Me() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text className="bg-red-500"> me </Text>
    </View>
  );
}