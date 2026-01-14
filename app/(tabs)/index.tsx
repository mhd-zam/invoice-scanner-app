import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { PieChart, Plus, ShoppingBag } from 'lucide-react-native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { palette, radius, spacing, useAppTheme } from '../../src/theme'; // Use hook

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme(); // Dynamic colors
  const expenses = useExpenseStore(s => s.expenses);
  const recentExpenses = expenses.slice(0, 5);
  const totalSpend = expenses.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Typography variant="header2" color={colors.textSecondary} style={{ marginBottom: 4 }}>Hi There,</Typography>
          <Typography variant="header1">Daily Tracker</Typography>
        </View>
        <TouchableOpacity style={[styles.profileButton, { backgroundColor: colors.muted }]}>
          {/* Placeholder for Profile - could be an image or initial */}
          <Typography variant="bodyBold" color={colors.primary}>M</Typography>
        </TouchableOpacity>
      </View>

      {/* Main Balance Card - Kuick Style */}
      <LinearGradient
        colors={[colors.primary, palette.primary[800]]} // Deeper violet gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryGradient}
      >
        <View>
          <Typography variant="body" color="rgba(255,255,255,0.7)" style={{ marginBottom: spacing.xs }}>
            Current Spend
          </Typography>
          <Typography variant="display" color="white" style={{ fontSize: 36, lineHeight: 44 }}>
            ₹{totalSpend.toFixed(2)}
          </Typography>
        </View>

        <View style={styles.cardActions}>
          {/* Quick Actions inside Card */}
          <TouchableOpacity style={styles.cardActionBtn} onPress={() => router.push('/scanner')}>
            <Plus size={20} color={colors.primary} />
            <Typography variant="bodyBold" color={colors.primary} style={{ marginLeft: 8 }}>Add Bill</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cardActionBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => router.push('/(tabs)/analytics')}>
            <PieChart size={20} color="white" />
            <Typography variant="bodyBold" color="white" style={{ marginLeft: 8 }}>Analysis</Typography>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Transactions Section */}
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
        <View style={styles.emptyState}>
          <Typography variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            No receipts yet. Tap "Add Bill" to start!
          </Typography>
        </View>
      ) : (
        recentExpenses.map((expense) => (
          <TouchableOpacity key={expense.id} onPress={() => router.push(`/expense/${expense.id}`)} activeOpacity={0.7}>
            <Card style={styles.expenseItem} variant="elevated">
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                {/* Determine icon based on category logic later, for now generic */}
                <ShoppingBag size={24} color={colors.text} strokeWidth={1.5} />
              </View>

              <View style={styles.infoContainer}>
                <Typography variant="bodyBold" numberOfLines={1}>{expense.merchantName}</Typography>
                <Typography variant="caption" color={colors.textSecondary}>{new Date(expense.date).toLocaleDateString()} • {expense.category}</Typography>
              </View>

              <Typography variant="bodyBold" style={{ color: colors.text }}>
                -₹{expense.totalAmount.toFixed(2)}
              </Typography>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    marginTop: spacing.s,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryGradient: {
    marginBottom: spacing.xl,
    padding: spacing.l,
    borderRadius: radius.xl, // More rounded like inspiration
    height: 200, // Taller card
    justifyContent: 'space-between',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
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
    alignItems: 'center',
    marginBottom: spacing.m,
    padding: spacing.m,
    borderRadius: radius.l,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  infoContainer: {
    flex: 1,
  },
});
