import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

export default function AnalyticsScreen() {
    const expenses = useExpenseStore(s => s.expenses);
    const { colors } = useAppTheme();

    const totalSpend = expenses.reduce((sum, item) => sum + item.totalAmount, 0);

    // Mock category data with checks
    // Dynamic category aggregation
    const categoryTotals = expenses.reduce((acc, expense) => {
        const cat = expense.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + expense.totalAmount;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.keys(categoryTotals).map(cat => ({
        name: cat,
        amount: categoryTotals[cat]
    })).sort((a, b) => b.amount - a.amount); // Sort by highest spend

    const maxAmount = data.length > 0 ? Math.max(...data.map(d => d.amount)) : 1;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <Typography variant="header2" style={{ marginBottom: spacing.l }}>Analytics</Typography>

            <Card style={styles.chartCard} variant="elevated">
                <Typography variant="header3" style={{ marginBottom: spacing.m }}>Spending by Category</Typography>

                {data.length === 0 ? (
                    <Typography variant="body" color={colors.textSecondary}>No data to display.</Typography>
                ) : (
                    data.map((item) => (
                        <View key={item.name} style={styles.barContainer}>
                            <View style={styles.barLabel}>
                                <Typography variant="bodyBold" style={{ marginBottom: 4 }}>{item.name}</Typography>
                                <Typography variant="bodyBold" color={colors.primary}>₹{item.amount.toFixed(2)}</Typography>
                            </View>
                            <View style={[styles.track, { backgroundColor: colors.muted }]}>
                                <View style={[styles.bar, { width: `${(item.amount / maxAmount) * 100}%`, backgroundColor: colors.primary }]} />
                            </View>
                        </View>
                    ))
                )}
            </Card>

            <Card style={{ marginTop: spacing.l, padding: spacing.l }} variant="elevated">
                <Typography variant="header3" style={{ marginBottom: spacing.xs }}>Total Spend</Typography>
                <Typography variant="display" color={colors.primary}>₹{totalSpend.toFixed(2)}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>Across all categories</Typography>
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
    barContainer: {
        marginBottom: spacing.m,
    },
    barLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    track: {
        height: 8,
        borderRadius: radius.s,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: radius.s,
    },
});
