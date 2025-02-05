import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import PINCode from '@haskkor/react-native-pincode'
import {hasUserSetPinCode} from '@haskkor/react-native-pincode'
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import { router, useRouter } from "expo-router";
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedButton } from '@/components/ThemedButton';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import * as LocalAuthentication from 'expo-local-authentication';
import { title } from 'process';

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        marginTop: 20,
    },
    greetings: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    codeView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginVertical: 50,
    },
    codeEmpty: { 
        width: 20,
        height: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#AACC00',
    },
    codeEntered: { 
        width: 20,
        height: 20,
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
    forgot: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center'

    },
    italic: {fontStyle: 'italic'},
    underline: {textDecorationLine: 'underline'},
    roundButton1: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 50,
        backgroundColor: '#f1f1f1',
      },
});


export default function index(){
    
    const[code,setCode] = useState<number[]>([]);
    const route = useRouter();
    const theme = useColorScheme();
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [pressed, setPressed] = useState(false);
    const codeLength = Array(6).fill(0);
    const codeCheck = Array(6)

    const showAlert = () => Alert.alert(
        "You are now logged in",
        "",
        [
            {
                text: "OK",
                onPress: () => router.replace('/(tabs)'),
                style: 'cancel',
            },
            {
                text: "Proceed",
                onPress: () => console.log('Proceed')
            },
        ]
    );

    useEffect(() => {
        if (code.length === 6) {
            setCode([]);
            Alert.alert('PIN does not match');
        }
    }, [code]);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    const handleBiometric = async () => {
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

        if (!isBiometricAvailable) {
            return Alert.alert('Biometric Authentication Unavailable', 'Your device does not support biometrics.', [{ text: 'OK' }]);
        }

        const biometricRecords = await LocalAuthentication.isEnrolledAsync();
        if (!biometricRecords) {
            return Alert.alert('Biometric Authentication Unavailable', 'No biometric records found. Please set up biometrics in your device settings.', [{ text: 'OK' }]);
        }

        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to continue',
            cancelLabel: 'Cancel',
        });

        if (biometricAuth.success) {
            console.log('Biometric Authentication Success');
            showAlert();
        } else {
            Alert.alert('Authentication Failed', 'Try again or use PIN.', [{ text: 'OK' }]);
        }
    };

    return (
        <ThemedSafeAreaView>
            <ThemedView className='flex-1 justify-center h-full mb-10'>
                <Image source={require('../assets/logos/LOGO.png')} style={styles.logo} />
            </ThemedView>
            <ThemedText style={styles.greetings}>Enter your PIN code</ThemedText>
            <ThemedView style={styles.codeView}>
                {codeLength.map((_, index) => (
                    <ThemedView 
                    key={index} 
                    style={[
                        styles.codeEmpty, 
                        code[index] ? styles.codeEntered : null
                    ]}
                    />
                ))}
            </ThemedView>
                    <ThemedView style={styles.numbersView} className='flex-row justify-center gap-5 my-10'>
                        <ThemedText style={[styles.underline,styles.forgot]}>Forgot PIN?</ThemedText>
                    </ThemedView>
                      
                    <ThemedView style={styles.numbersView} className='flex-row alignItems-center my-7 justify-center'>
                        <TouchableOpacity style = {[styles.roundButton1]}  onPress={ () => setCode([...code,1])}>
                            <ThemedText style = {[styles.number]}>1</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,1])}>
                            <ThemedText style = {styles.number}>2</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,1])}>
                            <ThemedText style = {styles.number}>3</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedView style={styles.numbersView} className='flex-row alignItems-center mb-7 justify-center'>
                        <TouchableOpacity style = {styles.roundButton1}  onPress={ () => setCode([...code,1])}>
                            <ThemedText style = {[styles.number]}>4</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,1])}>
                            <ThemedText style = {styles.number}>5</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,1])}>
                            <ThemedText style = {styles.number}>6</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedView style={styles.numbersView} className='flex-row alignItems-center mb-7 justify-center'>
                        <TouchableOpacity style = {styles.roundButton1}  onPress={ () => setCode([...code,1])}>
                            <ThemedText style = {[styles.number]}>7</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,1])}>
                            <ThemedText style = {styles.number}>8</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,1])}>
                            <ThemedText style = {styles.number}>9</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedView style={styles.numbersView} className='flex-row justify-center alignItems-center '>
                        //ตัวอ่านลายนิ้วมือ
                        <TouchableOpacity style = {styles.roundButton1} onPress={handleBiometric}> 
                            <FontAwesome5 name="fingerprint" size={32} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode([...code,-1])}>
                            <ThemedText style={styles.number}>0</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.roundButton1} onPress={() => setCode(code => code.slice(0,-1))}>
                            <Feather name="delete" size={32} color="black" />
                        </TouchableOpacity>
                    </ThemedView>
            
                <ThemedView>
            </ThemedView>
        </ThemedSafeAreaView>
    );
}