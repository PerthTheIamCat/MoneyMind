import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Loading() {
    return (
        <ThemedView className="flex-1 !justify-center !items-center">
            <ThemedText className="text-2xl">Loading...</ThemedText>
        </ThemedView>
    )
}