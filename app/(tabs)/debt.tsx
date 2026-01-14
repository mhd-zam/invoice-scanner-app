import { useRouter } from 'expo-router';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Typography } from '../../src/components/Typography';
import { DebtItem } from '../../src/features/debt/components/DebtItem';
import { useDebtStore } from '../../src/features/debt/store/useDebtStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

export default function DebtScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors } = useAppTheme();
    const debts = useDebtStore((s) => s.debts);

    const { totalReceive, totalGive } = useMemo(() => {
        return debts.reduce(
            (acc, debt) => {
                if (!debt.isPaid) {
                    if (debt.type === 'receive') acc.totalReceive += debt.amount;
                    else acc.totalGive += debt.amount;
                }
                return acc;
            },
            { totalReceive: 0, totalGive: 0 }
        );
    }, [debts]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
                <View style={styles.header}>
                    <Typography variant="header1">Debt Log</Typography>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: colors.primary }]}
                        onPress={() => router.push('/debt/add')}
                    >
                        <Plus color="white" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={[styles.summaryCard, { backgroundColor: colors.success + '15' }]}>
                        <View style={styles.summaryLabel}>
                            <ArrowDown size={16} color={colors.success} />
                            <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                                To Receive
                            </Typography>
                        </View>
                        <Typography variant="header2" color={colors.success}>
                            ₹{totalReceive.toFixed(2)}
                        </Typography>
                    </View>

                    <View style={styles.gap} />

                    <View style={[styles.summaryCard, { backgroundColor: colors.error + '15' }]}>
                        <View style={styles.summaryLabel}>
                            <ArrowUp size={16} color={colors.error} />
                            <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                                To Pay
                            </Typography>
                        </View>
                        <Typography variant="header2" color={colors.error}>
                            ₹{totalGive.toFixed(2)}
                        </Typography>
                    </View>
                </View>

                <Typography variant="header3" style={{ marginVertical: spacing.m }}>
                    Transactions
                </Typography>

                {debts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Typography variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
                            No debts recorded.
                        </Typography>
                        <Button
                            title="Add a record"
                            variant="ghost"
                            onPress={() => router.push('/debt/add')}
                            style={{ marginTop: spacing.m }}
                        />
                    </View>
                ) : (
                    debts.map((debt) => (
                        <DebtItem
                            key={debt.id}
                            debt={debt}
                            onPress={() => router.push({ pathname: '/debt/add', params: { ...debt, isEditing: 'true' } as any })}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.l,
        // paddingTop: spacing.xl * 2, // Replaced with inline style for dynamic inset
        paddingBottom: 100, // Space for tab bar
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryContainer: {
        flexDirection: 'row',
        marginBottom: spacing.l,
    },
    summaryCard: {
        flex: 1,
        padding: spacing.m,
        borderRadius: radius.m,
        alignItems: 'flex-start',
    },
    summaryLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    gap: {
        width: spacing.m,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
});
