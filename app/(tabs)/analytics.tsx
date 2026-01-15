import { ScrollView, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useDebtStore } from '../../src/features/debt/store/useDebtStore';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

export default function AnalyticsScreen() {
    const expenses = useExpenseStore(s => s.expenses);
    const debts = useDebtStore(s => s.debts);
    const { colors } = useAppTheme();

    const totalSpend = expenses.reduce((sum, item) => sum + item.totalAmount, 0);

    // Debt Calculations
    const { totalReceive, totalGive } = debts.reduce((acc, debt) => {
        if (!debt.isPaid) {
            if (debt.type === 'receive') acc.totalReceive += debt.amount;
            else acc.totalGive += debt.amount;
        }
        return acc;
    }, { totalReceive: 0, totalGive: 0 });

    // Category Calculations
    const categoryTotals = expenses.reduce((acc, expense) => {
        const cat = expense.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + expense.totalAmount;
        return acc;
    }, {} as Record<string, number>);

    const PIE_COLORS = [
        colors.primary,
        '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#8B5CF6', '#6366F1'
    ];

    const pieData = Object.keys(categoryTotals).map((cat, index) => ({
        value: categoryTotals[cat],
        color: PIE_COLORS[index % PIE_COLORS.length],
        text: cat,
    })).sort((a, b) => b.value - a.value);

    // List data for legend/details
    const listData = Object.keys(categoryTotals).map((cat, index) => ({
        name: cat,
        amount: categoryTotals[cat],
        color: PIE_COLORS[index % PIE_COLORS.length],
    })).sort((a, b) => b.amount - a.amount);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <Typography variant="header2" style={{ marginBottom: spacing.l }}>Analytics</Typography>

            {/* DEBT Analytics */}
            <Card style={[styles.chartCard, { marginBottom: spacing.l }]} variant="elevated">
                <Typography variant="header3" style={{ marginBottom: spacing.m }}>Debt Overview</Typography>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, padding: spacing.s, backgroundColor: colors.success + '15', borderRadius: radius.m, marginRight: spacing.s }}>
                        <Typography variant="label" color={colors.textSecondary}>To Receive</Typography>
                        <Typography variant="header2" color={colors.success}>₹{totalReceive.toFixed(0)}</Typography>
                    </View>
                    <View style={{ flex: 1, padding: spacing.s, backgroundColor: colors.error + '15', borderRadius: radius.m }}>
                        <Typography variant="label" color={colors.textSecondary}>To Pay</Typography>
                        <Typography variant="header2" color={colors.error}>₹{totalGive.toFixed(0)}</Typography>
                    </View>
                </View>
            </Card>

            {/* EXPENSE Pie Chart */}
            <Card style={styles.chartCard} variant="elevated">
                <Typography variant="header3" style={{ marginBottom: spacing.l }}>Spending by Category</Typography>

                {listData.length === 0 ? (
                    <Typography variant="body" color={colors.textSecondary}>No expense data available.</Typography>
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <PieChart
                            data={pieData}
                            donut
                            innerCircleColor={colors.card}
                            radius={100}
                            innerRadius={60}
                            showText={false}
                            centerLabelComponent={() => {
                                return (
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 100, height: 100 }}>
                                        <Typography variant="header3" color={colors.text}>₹{totalSpend.toFixed(0)}</Typography>
                                        <Typography variant="caption" color={colors.textSecondary}>Total</Typography>
                                    </View>
                                );
                            }}
                        />

                        {/* Legend / List */}
                        <View style={{ width: '100%', marginTop: spacing.l }}>
                            {listData.map((item) => (
                                <View key={item.name} style={styles.legendItem}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color, marginRight: spacing.s }} />
                                        <Typography variant="body">{item.name}</Typography>
                                    </View>
                                    <Typography variant="bodyBold">₹{item.amount.toFixed(2)}</Typography>
                                </View>
                            ))}
                        </View>
                    </View>
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
        paddingTop: spacing.xl * 2,
    },
    chartCard: {
        padding: spacing.l,
    },
    legendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.s,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
});
