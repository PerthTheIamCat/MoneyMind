import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from "@/components/Tabbar"

const _layout = () => {
  return (
    <Tabs
        tabBar={props=> <TabBar {...props} />}
        screenOptions={
           {
            headerShown: false,
            tabBarShowLabel: false,
           }
        }
    >
        <Tabs.Screen
            name="index"
            options={{
                title: "Home"
            }}
        />
        <Tabs.Screen
            name="splitpay"
            options={{
                title: "SplitPay"
            }}
        />
        <Tabs.Screen
            name="transaction"
            options={{
                title: "transaction"
            }}
        />
        <Tabs.Screen
            name="retire"
            options={{
                title: "Retire"
            }}
        />
           <Tabs.Screen
            name="me"
            options={{
                title: "Me"
            }}
        />
    </Tabs>
  )
}

export default _layout