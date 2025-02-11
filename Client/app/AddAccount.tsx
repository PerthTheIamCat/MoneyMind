import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { useColorScheme, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { TouchableOpacity, Text } from 'react-native';

const CircleSize = 40;
const CircleRingSize = 2;
const AccountIconSize = [
  { source: require('../assets/images/Add_Account_page_image/AccountIcon1.png') },
  { source: require('../assets/images/Add_Account_page_image/AccountIcon2.png') },
  { source: require('../assets/images/Add_Account_page_image/AccountIcon3.png') }
];
const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

const styles = StyleSheet.create({
    container: {
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
    },
    group: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 24,
    },
    /** Placeholder */
    placeholder: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      height: 400,
      marginTop: 0,
      padding: 24,
      backgroundColor: 'transparent',
    },
    placeholderInset: {
      borderWidth: 4,
      borderColor: '#e5e7eb',
      borderStyle: 'dashed',
      borderRadius: 9,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    sheetHeader: {
      borderBottomWidth: 1,
      borderBottomColor: '#efefef',
      paddingHorizontal: 24,
      paddingVertical: 14,
    },
    sheetHeaderTitle: {
      fontSize: 20,
      fontWeight: '600',
    },
    sheetBody: {
      padding: 24,
    },
    /** Profile */
    profile: {
      alignSelf: 'center',
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    profileText: {
      fontSize: 34,
      fontWeight: '600',
      color: 'white',
    },
    /** Circle */
    circle: {
      width: CircleSize + CircleRingSize * 4,
      height: CircleSize + CircleRingSize * 4,
      borderRadius: 9999,
      backgroundColor: '#f1f1f1',
      borderWidth: CircleRingSize,
      borderColor: 'transparent',
      marginRight: 8,
      marginBottom: 12,
    },
    circleInside: {
      width: CircleSize,
      height: CircleSize,
      borderRadius: 9999,
      position: 'absolute',
      top: CircleRingSize,
      left: CircleRingSize,
    },
    /** Button */
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      padding: 14,
      borderWidth: 1,
      borderColor: '#000',
      backgroundColor: '#000',
      marginBottom: 12,
    },
    btnText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    square: {
        width: 101,
        height: 101,
        backgroundColor: 'trasparent',
        borderRadius: 20,
        borderWidth: 5,
        borderColor: 'trasparent',
    },
  });

export default function Index() {
    const theme = useColorScheme();

    const [AccountName, setAccountName] = useState("");
    const [errorAccountName, setErrorAccountName] = useState("");
    const [AccountBalance, setAccountBalance] = useState("");
    const [errorAccountBalance, setErrorAccountBalance] = useState("");


    const [value, setValue] = useState<number | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<number | null>(null);

    const validateInputs = () => {
        let valid = true;
        setErrorAccountName("");
        setErrorAccountBalance("");

        // Check if AccountName and AccountBalance are empty
        if (AccountName.trim().length === 0) {
            setErrorAccountName
            valid = false;
        }

        if (AccountBalance.trim().length === 0) {
            valid = false;
        }
        return valid;
    };
    return (
        <ThemedSafeAreaView>
            <ThemedView >
                <ThemedView className="w-96 mt-5 px-5 gap-5">
                    <ThemedInput
                        title="Account Name"
                        error="Please fill in all fields"
                        className="w-full"
                    />
                    <ThemedScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 5 ,paddingRight: 5 ,paddingTop: 5 ,paddingBottom: 0 }} showsHorizontalScrollIndicator={false}>
                        <ThemedView className="flex-row gap-10">
                            <View style={styles.group}>
                            {AccountIconSize.map((item, index) => {
                            const isActive = selectedIcon === index;
                            return (
                                <View key={item.source}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setSelectedIcon(index);
                                    }}>
                                    <ThemedView
                                         style={[
                                            styles.square, 
                                            { borderColor: isActive ? '#AACC00' : 'transparent' }
                                         ]} 
                                        >
                                        <Image source={item.source} style={{ width: 100,  height: 100,transform: [{ translateY: 3 }] , margin: 10}} />
                                    </ThemedView>
                                </TouchableWithoutFeedback>
                                </View>
                            );
                            })}
                            </View>
                        </ThemedView>
                    </ThemedScrollView>
                    <ThemedInput
                        title="Account Balance"
                        error="Please fill in all fields"
                        className="w-full"
                    />
                    <ThemedText className="text-center font-bold w-full" style={{ fontSize: 20 }}>
                        Select a color for the account
                    </ThemedText>
                    <ThemedScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                        <ThemedView className="flex-row gap-10">
                            <View style={styles.group}>
                            {colors.map((item, index) => {
                            const isActive = value === index;
                            return (
                                <View key={item}>
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        setValue(index);
                                    }}>
                                    <ThemedView
                                    style={[
                                        styles.circle,isActive && { borderColor: item },
                                    ]}>
                                    <View
                                        style={[styles.circleInside, { backgroundColor: item }]}
                                    />
                                    </ThemedView>
                                </TouchableWithoutFeedback>
                                </View>
                            );
                            })}
                        </View>
                        </ThemedView>
                    </ThemedScrollView>
                        <ThemedButton className="w-40 h-14" mode="confirm" onPress={() => router.push("/splitpay")}>
                            Add Account
                        </ThemedButton>
                    </ThemedView>
                </ThemedView>
            </ThemedSafeAreaView>
    );
}