import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDownLeft, ArrowUpRight, BarChart3, PieChartIcon, TrendingDown, TrendingUp, Wallet } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useDebtStore } from '../../src/features/debt/store/useDebtStore';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { palette, radius, spacing, useAppTheme } from '../../src/theme';

const TIME_FILTERS = ['This Week', 'This Month', 'All Time'];

export default function AnalyticsScreen() {
    const insets = useSafeAreaInsets();
    const expenses = useExpenseStore(s => s.expenses);
    const debts = useDebtStore(s => s.debts);
    const { colors } = useAppTheme();
    const [selectedTime, setSelectedTime] = useState('This Month');

    const totalSpend = expenses.reduce((sum, item) => sum + item.totalAmount, 0);
    const avgTransaction = expenses.length > 0 ? totalSpend / expenses.length : 0;

    // Debt Calculations
    const { totalReceive, totalGive } = useMemo(() => debts.reduce((acc, debt) => {
        if (!debt.isPaid) {
            if (debt.type === 'receive') acc.totalReceive += debt.amount;
            else acc.totalGive += debt.amount;
        }
        return acc;
    }, { totalReceive: 0, totalGive: 0 }), [debts]);

    const netBalance = totalReceive - totalGive;

    // Category Calculations
    const categoryTotals = useMemo(() => expenses.reduce((acc, expense) => {
        const cat = expense.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + expense.totalAmount;
        return acc;
    }, {} as Record<string, number>), [expenses]);

    const PIE_COLORS = [
        colors.primary,
        '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#8B5CF6', '#6366F1'
    ];

    const pieData = Object.keys(categoryTotals).map((cat, index) => ({
        value: categoryTotals[cat],
        color: PIE_COLORS[index % PIE_COLORS.length],
        text: cat,
    })).sort((a, b) => b.value - a.value);

    const listData = Object.keys(categoryTotals).map((cat, index) => ({
        name: cat,
        amount: categoryTotals[cat],
        percentage: ((categoryTotals[cat] / totalSpend) * 100).toFixed(1),
        color: PIE_COLORS[index % PIE_COLORS.length],
    })).sort((a, b) => b.amount - a.amount);

    // Top category
    const topCategory = listData.length > 0 ? listData[0] : null;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.l }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Typography variant="header1">Analytics</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                        Your financial overview
                    </Typography>
                </View>
                <View style={[styles.headerIcon, { backgroundColor: colors.primary + '15' }]}>
                    <BarChart3 size={22} color={colors.primary} />
                </View>
            </View>

            {/* Time Filter */}
            <View style={styles.timeFilter}>
                {TIME_FILTERS.map(filter => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.timeChip,
                            {
                                backgroundColor: selectedTime === filter ? colors.primary : colors.card,
                                borderColor: selectedTime === filter ? colors.primary : colors.border,
                            }
                        ]}
                        onPress={() => setSelectedTime(filter)}
                    >
                        <Typography
                            variant="label"
                            color={selectedTime === filter ? 'white' : colors.text}
                        >
                            {filter}
                        </Typography>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Total Spending Card */}
            <LinearGradient
                colors={[colors.primary, palette.primary[800]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCard}
            >
                <View style={styles.mainCardHeader}>
                    <View style={styles.cardBadge}>
                        <TrendingUp size={14} color="white" />
                        <Typography variant="caption" color="white" style={{ marginLeft: 4 }}>
                            Total Spending
                        </Typography>
                    </View>
                </View>
                <Typography variant="display" color="white" style={styles.mainAmount}>
                    ₹{totalSpend.toLocaleString('en-IN')}
                </Typography>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Transactions</Typography>
                        <Typography variant="bodyBold" color="white">{expenses.length}</Typography>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                    <View style={styles.statItem}>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Avg. Transaction</Typography>
                        <Typography variant="bodyBold" color="white">₹{avgTransaction.toFixed(0)}</Typography>
                    </View>
                </View>
            </LinearGradient>

            {/* Debt Overview */}
            <Typography variant="header3" style={styles.sectionTitle}>Debt Overview</Typography>

            <View style={styles.debtCards}>
                <Card style={[styles.debtCard, { borderLeftColor: colors.success, borderLeftWidth: 3 }]}>
                    <View style={[styles.debtIcon, { backgroundColor: colors.success + '15' }]}>
                        <ArrowDownLeft size={18} color={colors.success} />
                    </View>
                    <View style={styles.debtInfo}>
                        <Typography variant="caption" color={colors.textSecondary}>To Receive</Typography>
                        <Typography variant="header3" color={colors.success}>
                            ₹{totalReceive.toLocaleString('en-IN')}
                        </Typography>
                    </View>
                </Card>

                <Card style={[styles.debtCard, { borderLeftColor: colors.error, borderLeftWidth: 3 }]}>
                    <View style={[styles.debtIcon, { backgroundColor: colors.error + '15' }]}>
                        <ArrowUpRight size={18} color={colors.error} />
                    </View>
                    <View style={styles.debtInfo}>
                        <Typography variant="caption" color={colors.textSecondary}>To Pay</Typography>
                        <Typography variant="header3" color={colors.error}>
                            ₹{totalGive.toLocaleString('en-IN')}
                        </Typography>
                    </View>
                </Card>
            </View>

            {/* Net Balance */}
            <Card style={styles.netBalanceCard}>
                <View style={styles.netBalanceLeft}>
                    <Wallet size={20} color={netBalance >= 0 ? colors.success : colors.error} />
                    <Typography variant="body" style={{ marginLeft: spacing.s }}>Net Balance</Typography>
                </View>
                <View style={styles.netBalanceRight}>
                    <Typography variant="header3" color={netBalance >= 0 ? colors.success : colors.error}>
                        {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString('en-IN')}
                    </Typography>
                    {netBalance >= 0 ? (
                        <TrendingUp size={16} color={colors.success} style={{ marginLeft: spacing.xs }} />
                    ) : (
                        <TrendingDown size={16} color={colors.error} style={{ marginLeft: spacing.xs }} />
                    )}
                </View>
            </Card>

            {/* Category Breakdown */}
            <Typography variant="header3" style={styles.sectionTitle}>Spending by Category</Typography>

            <Card style={styles.chartCard}>
                {listData.length === 0 ? (
                    <View style={styles.emptyChart}>
                        <PieChartIcon size={48} color={colors.textSecondary} strokeWidth={1} />
                        <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.m }}>
                            No expense data yet
                        </Typography>
                    </View>
                ) : (
                    <>
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={pieData}
                                donut
                                innerCircleColor={colors.card}
                                radius={90}
                                innerRadius={55}
                                showText={false}
                                centerLabelComponent={() => (
                                    <View style={styles.chartCenter}>
                                        <Typography variant="header2" color={colors.text}>
                                            ₹{totalSpend.toLocaleString('en-IN', { notation: 'compact' })}
                                        </Typography>
                                        <Typography variant="caption" color={colors.textSecondary}>Total</Typography>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Top Category Highlight */}
                        {topCategory && (
                            <View style={[styles.topCategory, { backgroundColor: topCategory.color + '15' }]}>
                                <View style={[styles.topCategoryDot, { backgroundColor: topCategory.color }]} />
                                <View style={{ flex: 1 }}>
                                    <Typography variant="caption" color={colors.textSecondary}>
                                        Top Category
                                    </Typography>
                                    <Typography variant="bodyBold">{topCategory.name}</Typography>
                                </View>
                                <Typography variant="header3" color={topCategory.color}>
                                    {topCategory.percentage}%
                                </Typography>
                            </View>
                        )}

                        {/* Legend */}
                        <View style={styles.legend}>
                            {listData.map((item, index) => (
                                <View
                                    key={item.name}
                                    style={[
                                        styles.legendItem,
                                        index < listData.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                                    ]}
                                >
                                    <View style={styles.legendLeft}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Typography variant="body">{item.name}</Typography>
                                    </View>
                                    <View style={styles.legendRight}>
                                        <Typography variant="bodyBold">₹{item.amount.toFixed(0)}</Typography>
                                        <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: spacing.s }}>
                                            {item.percentage}%
                                        </Typography>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.l,
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeFilter: {
        flexDirection: 'row',
        gap: spacing.s,
        marginBottom: spacing.l,
    },
    timeChip: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.full,
        borderWidth: 1,
    },
    mainCard: {
        padding: spacing.l,
        borderRadius: radius.xl,
        marginBottom: spacing.l,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    mainCardHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    cardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    mainAmount: {
        fontSize: 42,
        lineHeight: 50,
        fontWeight: '700',
        marginTop: spacing.s,
        marginBottom: spacing.m,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 30,
        marginHorizontal: spacing.m,
    },
    sectionTitle: {
        marginBottom: spacing.m,
        marginTop: spacing.s,
    },
    debtCards: {
        flexDirection: 'row',
        gap: spacing.m,
        marginBottom: spacing.m,
    },
    debtCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
    },
    debtIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.s,
    },
    debtInfo: {
        flex: 1,
    },
    netBalanceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
        marginBottom: spacing.l,
    },
    netBalanceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    netBalanceRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartCard: {
        padding: spacing.l,
        marginBottom: spacing.xl,
    },
    emptyChart: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    chartCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 90,
    },
    topCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: radius.m,
        marginBottom: spacing.m,
    },
    topCategoryDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: spacing.m,
    },
    legend: {
        marginTop: spacing.s,
    },
    legendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.m,
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: spacing.s,
    },
    legendRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
