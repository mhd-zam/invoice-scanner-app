import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { radius, spacing, useAppTheme } from '../../src/theme'; // Use hook

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme(); // Dynamic colors
  const expenses = useExpenseStore(s => s.expenses);
  const recentExpenses = expenses.slice(0, 5);
  const totalSpend = expenses.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]} // Dynamic bg
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Typography variant="header1">Hello,</Typography>
        <Typography variant="header2" color={colors.textSecondary}>Ready to scan?</Typography>
      </View>

      <LinearGradient
        colors={[colors.primary, '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryGradient}
      >
        <View style={styles.summaryHeader}>
          <Typography variant="label" color="rgba(255,255,255,0.8)">Total Spend (This Month)</Typography>
          <View style={styles.trendIcon}>
            <TrendingUp color="white" size={16} />
          </View>
        </View>
        <Typography variant="header1" color="white" style={{ marginTop: spacing.s }}>
          ₹{totalSpend.toFixed(2)}
        </Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.6)" style={{ marginTop: spacing.xs }}>
          +12% from last month
        </Typography>
      </LinearGradient>

      {/* Persistent Scan Action */}
      <Button
        title="Scan New Receipt"
        variant="primary"
        onPress={() => router.push('/scanner')}
        style={{ marginBottom: spacing.xl }}
        icon={<TrendingUp color="white" size={20} />} // Reusing icon for visual flair or could be Camera
      />

      <View style={styles.sectionHeader}>
        <Typography variant="header3">Recent Activity</Typography>
        <Button
          title="See All"
          variant="ghost"
          size="small"
          onPress={() => router.push('/(tabs)/expenses')}
        />
      </View>

      {recentExpenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            No receipts scanned yet. Start by scanning one above!
          </Typography>
        </View>
      ) : (
        recentExpenses.map((expense) => (
          <TouchableOpacity key={expense.id} onPress={() => router.push(`/expense/${expense.id}`)} activeOpacity={0.7}>
            <Card style={styles.expenseItem} variant="flat">
              <View style={styles.expenseLeft}>
                <View style={[styles.iconPlaceholder, { backgroundColor: colors.muted }]}>
                  <Typography variant="header3">{expense.merchantName.charAt(0)}</Typography>
                </View>
                <View>
                  <Typography variant="bodyBold">{expense.merchantName}</Typography>
                  <Typography variant="caption">{new Date(expense.date).toLocaleDateString()}</Typography>
                </View>
              </View>
              <Typography variant="bodyBold">₹{expense.totalAmount.toFixed(2)}</Typography>
            </Card>
          </TouchableOpacity>
        ))
      )}
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
  header: {
    marginBottom: spacing.l,
  },
  summaryGradient: {
    marginBottom: spacing.xl,
    padding: spacing.l,
    borderRadius: radius.l,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  trendIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
    paddingVertical: spacing.m,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
});
