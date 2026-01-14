import { useRouter } from 'expo-router';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Typography } from '../../../components/Typography';
import { radius, spacing, useAppTheme } from '../../../theme';
import { Debt, useDebtStore } from '../store/useDebtStore';

interface DebtFormProps {
    initialValues?: Partial<Debt>;
    isEditing?: boolean;
}

export const DebtForm = ({ initialValues, isEditing = false }: DebtFormProps) => {
    const router = useRouter();
    const { colors } = useAppTheme();
    const addDebt = useDebtStore((s) => s.addDebt);
    const updateDebt = useDebtStore((s) => s.updateDebt);

    const [type, setType] = useState<'receive' | 'give'>(initialValues?.type || 'receive');
    const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
    const [title, setTitle] = useState(initialValues?.title || '');
    const [personName, setPersonName] = useState(initialValues?.personName || '');
    const [dueDate, setDueDate] = useState(initialValues?.dueDate || '');
    const [notes, setNotes] = useState(initialValues?.notes || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!amount || !personName) return; // Basic validation

        const debtData = {
            type,
            amount: parseFloat(amount),
            currency: 'INR', // Default to INR per previous context (User wants Rupee)
            title,
            personName,
            dueDate,
            notes,
        };

        if (isEditing && initialValues?.id) {
            updateDebt(initialValues.id, debtData);
        } else {
            addDebt(debtData);
        }
        router.back();
    };

    const isReceive = type === 'receive';
    const themeColor = isReceive ? colors.success : colors.error;

    return (
        <ScrollView contentContainerStyle={styles.content}>
            {/* Scenario Selector */}
            <View style={[styles.selectorContainer, { backgroundColor: colors.muted }]}>
                <TouchableOpacity
                    style={[
                        styles.selectorOption,
                        isReceive && { backgroundColor: colors.card, shadowColor: colors.shadow, elevation: 2 },
                    ]}
                    onPress={() => setType('receive')}
                    activeOpacity={0.8}
                >
                    <ArrowDown size={20} color={isReceive ? colors.success : colors.textSecondary} />
                    <Typography
                        variant="bodyBold"
                        color={isReceive ? colors.success : colors.textSecondary}
                        style={{ marginLeft: spacing.s }}
                    >
                        To Receive
                    </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.selectorOption,
                        !isReceive && { backgroundColor: colors.card, shadowColor: colors.shadow, elevation: 2 },
                    ]}
                    onPress={() => setType('give')}
                    activeOpacity={0.8}
                >
                    <ArrowUp size={20} color={!isReceive ? colors.error : colors.textSecondary} />
                    <Typography
                        variant="bodyBold"
                        color={!isReceive ? colors.error : colors.textSecondary}
                        style={{ marginLeft: spacing.s }}
                    >
                        To Give
                    </Typography>
                </TouchableOpacity>
            </View>

            <Typography variant="header2" style={{ textAlign: 'center', marginVertical: spacing.l }}>
                {isReceive ? "Money you'll get back" : "Money you need to pay"}
            </Typography>

            <Input
                label="Title (Optional)"
                placeholder={isReceive ? "e.g. Loan to Rahul" : "e.g. Borrowed for Rent"}
                value={title}
                onChangeText={setTitle}
            />

            <Input
                label="Amount"
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={{ color: themeColor, fontWeight: 'bold' }} // Visual differentiation
            />

            <Input
                label="Person Name"
                placeholder="Who is this associated with?"
                value={personName}
                onChangeText={setPersonName}
            />

            {/* Simplified Date Input for now, could use a DatePicker */}
            <Input
                label="Due Date (Optional)"
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
            />

            <Input
                label="Notes (Optional)"
                placeholder="Add any additional details..."
                value={notes}
                onChangeText={setNotes}
                multiline
                style={{ height: 80, textAlignVertical: 'top', paddingTop: spacing.s }}
            />

            <Button
                title={isEditing ? "Save Changes" : "Save Debt"}
                onPress={handleSubmit}
                variant="primary"
                style={{ marginTop: spacing.l, backgroundColor: themeColor }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
        paddingBottom: spacing.xxl,
    },
    selectorContainer: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: radius.l,
        marginBottom: spacing.m,
    },
    selectorOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.m,
        borderRadius: radius.m - 2,
    },
});
