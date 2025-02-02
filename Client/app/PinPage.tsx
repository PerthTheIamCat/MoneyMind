import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PINCode from '@haskkor/react-native-pincode'
import {hasUserSetPinCode} from '@haskkor/react-native-pincode'
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from 'react-native';
import { router, useRouter } from "expo-router";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        marginTop: 20,
    },
    greetings: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        alignSelf: 'center',
    },
    codeView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginVertical: 100,
    },
    codeEmpty: { 
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#AACC00',
    },
    codeEnterd: { 
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#AACC00',
    },
    numbersView: {
        marginHorizontal: 80,
        gap: 60,
    },
    number: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    bold: {fontWeight: 'bold'},
    italic: {fontStyle: 'italic'},
    underline: {textDecorationLine: 'underline'},
});


export default function index(){
    const[code,setCode] = useState<number[]>([]);
    const router = useRouter();
    const codeLength = Array(6).fill(0);
    useEffect(() => {
        if(code.length === 6){
            //TODO: Check if the code is correct
        }
    }, [code]);
    return (
        <ThemedSafeAreaView>
            <ThemedView className='flex-1 justify-center h-full mb-10'>
                <Image source={require('../assets/logos/LOGO.png')} style={styles.logo} />
            </ThemedView>
            <ThemedView>
                <ThemedText className="font-bold">Enter your PIN code</ThemedText>
            </ThemedView>
            <ThemedView style={styles.codeView} className='gap-5'>
                {codeLength.map((_, index) => (
                    <ThemedView key={index} style={[styles.codeEmpty,
                    {   
                        backgroundColor: code[index] ? '#AACC00' : 'transparent',
                    }
                ]}/>
                ))}
            </ThemedView>
            <ThemedView style={styles.numbersView} className='flex-row justify-center gap-5'>
                <ThemedText style={[styles.underline,styles.bold]}>Forgot PIN?</ThemedText>
            </ThemedView>
        </ThemedSafeAreaView>
    );
}

