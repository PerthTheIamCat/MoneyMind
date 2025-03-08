import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import TabBarButton from "./TabbarIcon";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  // Colors based on theme
  const primaryColor = "#2B9348";
  const greyColor = "#737373";
  const darkBackground = "#1c1c1e";
  const lightBackground = "white";
  const darkTabTextColor = "#f2f2f2";
  const lightTabTextColor = "#2f2f2f";

  return (
    <View
      style={[
        styles.tabbar,
        { backgroundColor: isDarkMode ? darkBackground : lightBackground },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={
              route.name as
                | "index"
                | "splitpay"
                | "retire"
                | "me"
                | "transaction"
            }
            color={
              isFocused
                ? primaryColor
                : isDarkMode
                ? darkTabTextColor
                : greyColor
            }
            label={typeof label === "string" ? label : ""}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
