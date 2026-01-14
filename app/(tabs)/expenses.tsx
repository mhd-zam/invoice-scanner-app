import { useRouter } from 'expo-router';
import { Search, ShoppingBag } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

export default function ExpensesScreen() {
    const router = useRouter(); // Add router hook
    const expenses = useExpenseStore(s => s.expenses);
    const [searchQuery, setSearchQuery] = useState('');
    const { colors } = useAppTheme();

    const filteredExpenses = expenses.filter(e =>
        e.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.totalAmount.toString().includes(searchQuery)
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Typography variant="header2">Expenses</Typography>
            </View>

            <View style={styles.searchContainer}>
                <Search color={colors.textSecondary} size={20} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.border,
                        color: colors.text
                    }]}
                    placeholder="Search merchant or amount"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={colors.textSecondary}
                />
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push(`/expense/${item.id}`)} activeOpacity={0.7}>
                        <Card style={styles.expenseItem} variant="elevated">
                            <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                                <ShoppingBag size={24} color={colors.text} strokeWidth={1.5} />
                            </View>
                            <View style={styles.infoContainer}>
                                <Typography variant="bodyBold" numberOfLines={1}>{item.merchantName}</Typography>
                                <Typography variant="caption" color={colors.textSecondary}>
                                    {new Date(item.date).toLocaleDateString()} • {item.category}
                                </Typography>
                            </View>
                            <Typography variant="bodyBold" style={{ color: colors.text }}>
                                ₹{item.totalAmount.toFixed(2)}
                            </Typography>
                        </Card>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Typography variant="body" color={colors.textSecondary}>No expenses found.</Typography>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.xl * 2,
    },
    header: {
        paddingHorizontal: spacing.l,
        marginBottom: spacing.m,
    },
    searchContainer: {
        marginHorizontal: spacing.l,
        marginBottom: spacing.m,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: spacing.m,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        height: 48,
        borderRadius: radius.l,
        paddingLeft: spacing.xl * 1.5,
        paddingRight: spacing.m,
        fontSize: 16,
        borderWidth: 1,
    },
    listContent: {
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.xl,
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
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
});
