import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DebtForm } from '../../src/features/debt/components/DebtForm';
import { Debt } from '../../src/features/debt/store/useDebtStore';
import { spacing, useAppTheme } from '../../src/theme';

export default function AddDebtScreen() {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    const isEditing = params.isEditing === 'true';
    const initialValues: Partial<Debt> = {
        id: params.id as string,
        type: params.type as 'receive' | 'give',
        amount: params.amount ? parseFloat(params.amount as string) : undefined,
        title: params.title as string,
        personName: params.personName as string,
        dueDate: params.dueDate as string,
        notes: params.notes as string,
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + spacing.m }}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <DebtForm initialValues={initialValues} isEditing={isEditing} />
        </View>
    );
}
