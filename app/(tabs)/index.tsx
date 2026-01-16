import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, CreditCard, PieChart, Plus, Receipt, ShoppingBag, TrendingUp } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useDebtStore } from '../../src/features/debt/store/useDebtStore';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { palette, radius, spacing, useAppTheme } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const expenses = useExpenseStore(s => s.expenses);
  const debts = useDebtStore(s => s.debts);

  const recentExpenses = expenses.slice(0, 4);
  const totalSpend = expenses.reduce((sum, item) => sum + item.totalAmount, 0);

  // Calculate debt totals
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

  const netBalance = totalReceive - totalGive;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
      case 'restaurant':
        return <ShoppingBag size={20} color={colors.text} strokeWidth={1.5} />;
      default:
        return <Receipt size={20} color={colors.text} strokeWidth={1.5} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top + spacing.m, backgroundColor: colors.background }]}>
        <View>
          <Typography variant="body" color={colors.textSecondary} style={{ marginBottom: 2 }}>
            Welcome back 👋
          </Typography>
          <Typography variant="header1">Dashboard</Typography>
        </View>
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Typography variant="bodyBold" color={colors.primary}>M</Typography>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Spending Card */}
        <LinearGradient
          colors={[colors.primary, palette.primary[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardHeader}>
            <View style={styles.cardBadge}>
              <TrendingUp size={14} color="white" />
              <Typography variant="caption" color="white" style={{ marginLeft: 4 }}>This Month</Typography>
            </View>
          </View>

          <View style={styles.mainCardContent}>
            <Typography variant="body" color="rgba(255,255,255,0.7)">
              Total Spending
            </Typography>
            <Typography variant="display" color="white" style={styles.mainAmount}>
              ₹{totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </Typography>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.cardActionBtn} onPress={() => router.push('/scanner')}>
              <Plus size={18} color={colors.primary} />
              <Typography variant="bodyBold" color={colors.primary} style={{ marginLeft: 6 }}>Add Bill</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardActionBtn, styles.cardActionBtnSecondary]}
              onPress={() => router.push('/(tabs)/analytics')}
            >
              <PieChart size={18} color="white" />
              <Typography variant="bodyBold" color="white" style={{ marginLeft: 6 }}>Analytics</Typography>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Debt/Credit Summary */}
        <View style={styles.debtSection}>
          <TouchableOpacity
            style={[styles.debtCard, { backgroundColor: colors.success + '12' }]}
            onPress={() => router.push('/(tabs)/debt')}
            activeOpacity={0.7}
          >
            <View style={[styles.debtIconBox, { backgroundColor: colors.success + '20' }]}>
              <ArrowDownLeft size={20} color={colors.success} />
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
              To Receive
            </Typography>
            <Typography variant="header3" color={colors.success} style={{ marginTop: 2 }}>
              ₹{totalReceive.toLocaleString('en-IN')}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.debtCard, { backgroundColor: colors.error + '12' }]}
            onPress={() => router.push('/(tabs)/debt')}
            activeOpacity={0.7}
          >
            <View style={[styles.debtIconBox, { backgroundColor: colors.error + '20' }]}>
              <ArrowUpRight size={20} color={colors.error} />
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
              To Pay
            </Typography>
            <Typography variant="header3" color={colors.error} style={{ marginTop: 2 }}>
              ₹{totalGive.toLocaleString('en-IN')}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Net Balance Indicator */}
        {(totalReceive > 0 || totalGive > 0) && (
          <Card style={[styles.netBalanceCard, { borderLeftColor: netBalance >= 0 ? colors.success : colors.error }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CreditCard size={20} color={netBalance >= 0 ? colors.success : colors.error} />
              <Typography variant="body" color={colors.textSecondary} style={{ marginLeft: spacing.s }}>
                Net Balance
              </Typography>
            </View>
            <Typography variant="header3" color={netBalance >= 0 ? colors.success : colors.error}>
              {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString('en-IN')}
            </Typography>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: colors.card }]}
            onPress={() => router.push('/debt/add')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <Plus size={20} color={colors.primary} />
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              Add Debt
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/expenses')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: palette.primary[100] }]}>
              <Receipt size={20} color={colors.primary} />
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              All Bills
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionItem, { backgroundColor: colors.card }]}
            onPress={() => router.push('/(tabs)/analytics')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: palette.primary[100] }]}>
              <PieChart size={20} color={colors.primary} />
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
              Reports
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Typography variant="header3">Recent Transactions</Typography>
          <Button
            title="See All"
            variant="ghost"
            size="small"
            onPress={() => router.push('/(tabs)/expenses')}
          />
        </View>

        {recentExpenses.length === 0 ? (
          <Card style={styles.emptyState}>
            <Receipt size={48} color={colors.textSecondary} strokeWidth={1} />
            <Typography variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.m }}>
              No transactions yet
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.xs }}>
              Tap "Add Bill" to scan your first receipt
            </Typography>
          </Card>
        ) : (
          <Card style={styles.transactionsList}>
            {recentExpenses.map((expense, index) => (
              <TouchableOpacity
                key={expense.id}
                onPress={() => router.push(`/expense/${expense.id}`)}
                activeOpacity={0.7}
                style={[
                  styles.transactionItem,
                  index !== recentExpenses.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
              >
                <View style={[styles.transactionIcon, { backgroundColor: colors.muted }]}>
                  {getCategoryIcon(expense.category)}
                </View>

                <View style={styles.transactionInfo}>
                  <Typography variant="bodyBold" numberOfLines={1}>{expense.merchantName}</Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {expense.category}
                  </Typography>
                </View>

                <Typography variant="bodyBold" color={colors.error}>
                  -₹{expense.totalAmount.toFixed(0)}
                </Typography>
              </TouchableOpacity>
            ))}
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.l,
    paddingTop: 0,
    paddingBottom: 120,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    marginBottom: spacing.l,
    padding: spacing.l,
    borderRadius: radius.xl,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  mainCardContent: {
    marginVertical: spacing.m,
  },
  mainAmount: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  cardActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActionBtnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  debtSection: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.m,
  },
  debtCard: {
    flex: 1,
    padding: spacing.m,
    borderRadius: radius.l,
  },
  debtIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  netBalanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    marginBottom: spacing.l,
    borderLeftWidth: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.m,
    marginBottom: spacing.xl,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.m,
    borderRadius: radius.l,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  transactionsList: {
    padding: 0,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  transactionInfo: {
    flex: 1,
  },
});
