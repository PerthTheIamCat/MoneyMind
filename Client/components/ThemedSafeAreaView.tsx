import { KeyboardAvoidingView, ScrollView, Platform, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { ReactNode } from 'react';

export type ThemedSafeAreaViewProps = {
    children?: ReactNode;
}

export function ThemedSafeAreaView({ children } : ThemedSafeAreaViewProps) {
    const theme = useColorScheme();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#2F2F2F' : '#F2F2F2' }}>
                <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#2F2F2F' : '#F2F2F2' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#2F2F2F' : '#F2F2F2' }}>
                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}