import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Plus, Users, Wallet } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { DebtItem } from '../../src/features/debt/components/DebtItem';
import { useDebtStore } from '../../src/features/debt/store/useDebtStore';
import { palette, radius, spacing, useAppTheme } from '../../src/theme';

const FILTERS = ['All', 'To Receive', 'To Pay', 'Paid'];

export default function DebtScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors } = useAppTheme();
    const debts = useDebtStore((s) => s.debts);
    const [selectedFilter, setSelectedFilter] = useState('All');

    const { totalReceive, totalGive, paidCount, pendingCount } = useMemo(() => {
        return debts.reduce(
            (acc, debt) => {
                if (debt.isPaid) {
                    acc.paidCount++;
                } else {
                    acc.pendingCount++;
                    if (debt.type === 'receive') acc.totalReceive += debt.amount;
                    else acc.totalGive += debt.amount;
                }
                return acc;
            },
            { totalReceive: 0, totalGive: 0, paidCount: 0, pendingCount: 0 }
        );
    }, [debts]);

    const netBalance = totalReceive - totalGive;

    const filteredDebts = useMemo(() => {
        switch (selectedFilter) {
            case 'To Receive':
                return debts.filter(d => d.type === 'receive' && !d.isPaid);
            case 'To Pay':
                return debts.filter(d => d.type === 'give' && !d.isPaid);
            case 'Paid':
                return debts.filter(d => d.isPaid);
            default:
                return debts;
        }
    }, [debts, selectedFilter]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.m }]}>
                <View>
                    <Typography variant="header1">Debt Log</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                        {pendingCount} pending • {paidCount} settled
                    </Typography>
                </View>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/debt/add')}
                >
                    <Plus color="white" size={22} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredDebts}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        {/* Summary Card */}
                        <LinearGradient
                            colors={[colors.primary, palette.primary[800]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.summaryCard}
                        >
                            <View style={styles.summaryHeader}>
                                <View style={styles.summaryBadge}>
                                    <Wallet size={14} color="white" />
                                    <Typography variant="caption" color="white" style={{ marginLeft: 4 }}>
                                        Net Balance
                                    </Typography>
                                </View>
                            </View>

                            <View style={styles.netBalanceRow}>
                                <Typography
                                    variant="display"
                                    color="white"
                                    style={styles.netAmount}
                                >
                                    {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString('en-IN')}
                                </Typography>
                                <View style={[
                                    styles.netIndicator,
                                    { backgroundColor: netBalance >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }
                                ]}>
                                    <Typography variant="caption" color="white">
                                        {netBalance >= 0 ? 'You\'re owed' : 'You owe'}
                                    </Typography>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Quick Stats */}
                        <View style={styles.statsRow}>
                            <TouchableOpacity
                                style={[styles.statCard, { backgroundColor: colors.success + '12' }]}
                                onPress={() => setSelectedFilter('To Receive')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
                                    <ArrowDownLeft size={18} color={colors.success} />
                                </View>
                                <View style={styles.statContent}>
                                    <Typography variant="caption" color={colors.textSecondary}>To Receive</Typography>
                                    <Typography variant="header3" color={colors.success}>
                                        ₹{totalReceive.toLocaleString('en-IN')}
                                    </Typography>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.statCard, { backgroundColor: colors.error + '12' }]}
                                onPress={() => setSelectedFilter('To Pay')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.statIcon, { backgroundColor: colors.error + '20' }]}>
                                    <ArrowUpRight size={18} color={colors.error} />
                                </View>
                                <View style={styles.statContent}>
                                    <Typography variant="caption" color={colors.textSecondary}>To Pay</Typography>
                                    <Typography variant="header3" color={colors.error}>
                                        ₹{totalGive.toLocaleString('en-IN')}
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Filter Tabs */}
                        <View style={styles.filterContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={FILTERS}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            {
                                                backgroundColor: selectedFilter === item ? colors.primary : colors.card,
                                                borderColor: selectedFilter === item ? colors.primary : colors.border,
                                            }
                                        ]}
                                        onPress={() => setSelectedFilter(item)}
                                    >
                                        <Typography
                                            variant="label"
                                            color={selectedFilter === item ? 'white' : colors.text}
                                        >
                                            {item}
                                        </Typography>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.filterList}
                            />
                        </View>

                        {/* Section Header */}
                        <View style={styles.sectionHeader}>
                            <Typography variant="header3">Transactions</Typography>
                            <Typography variant="caption" color={colors.textSecondary}>
                                {filteredDebts.length} records
                            </Typography>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <DebtItem
                        debt={item}
                        onPress={() => router.push({
                            pathname: '/debt/add',
                            params: { ...item, isEditing: 'true' } as any
                        })}
                    />
                )}
                ListEmptyComponent={
                    <Card style={styles.emptyState}>
                        <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '15' }]}>
                            <Users size={32} color={colors.primary} />
                        </View>
                        <Typography variant="header3" style={{ marginTop: spacing.m }}>
                            {selectedFilter === 'All' ? 'No debts yet' : `No ${selectedFilter.toLowerCase()} debts`}
                        </Typography>
                        <Typography
                            variant="body"
                            color={colors.textSecondary}
                            style={{ textAlign: 'center', marginTop: spacing.xs }}
                        >
                            {selectedFilter === 'All'
                                ? 'Track money you lend or borrow'
                                : 'All clear in this category!'}
                        </Typography>
                        {selectedFilter === 'All' && (
                            <TouchableOpacity
                                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                                onPress={() => router.push('/debt/add')}
                            >
                                <Plus size={18} color="white" />
                                <Typography variant="bodyBold" color="white" style={{ marginLeft: spacing.xs }}>
                                    Add Record
                                </Typography>
                            </TouchableOpacity>
                        )}
                    </Card>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.m,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    listContent: {
        paddingHorizontal: spacing.l,
        paddingBottom: 120,
    },
    summaryCard: {
        padding: spacing.l,
        borderRadius: radius.xl,
        marginBottom: spacing.m,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    summaryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    netBalanceRow: {
        marginTop: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    netAmount: {
        fontSize: 36,
        lineHeight: 44,
        fontWeight: '700',
    },
    netIndicator: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.m,
        marginBottom: spacing.l,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: radius.l,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.s,
    },
    statContent: {
        flex: 1,
    },
    filterContainer: {
        marginBottom: spacing.m,
    },
    filterList: {
        gap: spacing.s,
    },
    filterChip: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.full,
        borderWidth: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
        marginTop: spacing.m,
    },
    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        borderRadius: radius.full,
        marginTop: spacing.l,
    },
});
