import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../src/components/Typography';
import { DebtForm } from '../../src/features/debt/components/DebtForm';
import { Debt } from '../../src/features/debt/store/useDebtStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

export default function AddDebtScreen() {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const router = useRouter();

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
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.m,
                paddingVertical: spacing.s,
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        padding: spacing.xs,
                        marginRight: spacing.s,
                        borderRadius: radius.s,
                        backgroundColor: colors.card,
                    }}
                >
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Typography variant="header2">
                    {isEditing ? 'Edit Debt' : 'Add Debt'}
                </Typography>
            </View>

            <DebtForm initialValues={initialValues} isEditing={isEditing} />
        </View>
    );
}
