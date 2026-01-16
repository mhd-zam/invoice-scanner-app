import { useRouter } from 'expo-router';
import { Calendar, Filter, Receipt, Search, ShoppingBag, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

const CATEGORIES = ['All', 'Food', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Other'];

export default function ExpensesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const expenses = useExpenseStore(s => s.expenses);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { colors } = useAppTheme();

    // Calculate totals
    const totalAmount = useMemo(() =>
        expenses.reduce((sum, e) => sum + e.totalAmount, 0),
        [expenses]
    );

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            const matchesSearch = e.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.totalAmount.toString().includes(searchQuery);
            const matchesCategory = selectedCategory === 'All' ||
                e.category?.toLowerCase() === selectedCategory.toLowerCase();
            return matchesSearch && matchesCategory;
        });
    }, [expenses, searchQuery, selectedCategory]);

    // Group expenses by date
    const groupedExpenses = useMemo(() => {
        const groups: { [key: string]: typeof expenses } = {};
        filteredExpenses.forEach(expense => {
            const date = new Date(expense.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            if (!groups[date]) groups[date] = [];
            groups[date].push(expense);
        });
        return Object.entries(groups).map(([date, items]) => ({ date, items }));
    }, [filteredExpenses]);

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

    const renderExpenseItem = ({ item }: { item: typeof expenses[0] }) => (
        <TouchableOpacity
            onPress={() => router.push(`/expense/${item.id}`)}
            activeOpacity={0.7}
            style={styles.expenseItemWrapper}
        >
            <View style={[styles.expenseItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.muted }]}>
                    {getCategoryIcon(item.category)}
                </View>
                <View style={styles.infoContainer}>
                    <Typography variant="bodyBold" numberOfLines={1}>{item.merchantName}</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                        {item.category || 'Uncategorized'}
                    </Typography>
                </View>
                <View style={styles.amountContainer}>
                    <Typography variant="bodyBold" color={colors.error}>
                        -₹{item.totalAmount.toFixed(0)}
                    </Typography>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = (date: string) => (
        <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Calendar size={14} color={colors.textSecondary} />
            <Typography variant="label" color={colors.textSecondary} style={{ marginLeft: spacing.xs }}>
                {date}
            </Typography>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Typography variant="header1">Expenses</Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                        {expenses.length} transactions • ₹{totalAmount.toLocaleString('en-IN')} total
                    </Typography>
                </View>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.muted }]}>
                    <Filter size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchInputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search color={colors.textSecondary} size={20} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={colors.textSecondary}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Filter */}
            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={CATEGORIES}
                    keyExtractor={item => item}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                {
                                    backgroundColor: selectedCategory === item ? colors.primary : colors.card,
                                    borderColor: selectedCategory === item ? colors.primary : colors.border,
                                }
                            ]}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Typography
                                variant="label"
                                color={selectedCategory === item ? 'white' : colors.text}
                            >
                                {item}
                            </Typography>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Expenses List */}
            <FlatList
                data={groupedExpenses}
                keyExtractor={item => item.date}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: group }) => (
                    <View>
                        {renderSectionHeader(group.date)}
                        <Card style={styles.dateGroupCard}>
                            {group.items.map((expense, index) => (
                                <View key={expense.id}>
                                    {renderExpenseItem({ item: expense })}
                                    {index < group.items.length - 1 && (
                                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                    )}
                                </View>
                            ))}
                        </Card>
                    </View>
                )}
                ListEmptyComponent={
                    <Card style={styles.emptyState}>
                        <Receipt size={48} color={colors.textSecondary} strokeWidth={1} />
                        <Typography variant="header3" style={{ marginTop: spacing.m }}>
                            No expenses found
                        </Typography>
                        <Typography variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.xs }}>
                            {searchQuery ? 'Try a different search term' : 'Add your first expense to get started'}
                        </Typography>
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
        paddingTop: spacing.l,
        paddingBottom: spacing.m,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: spacing.l,
        marginBottom: spacing.m,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderRadius: radius.l,
        paddingHorizontal: spacing.m,
        borderWidth: 1,
        gap: spacing.s,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    categoryContainer: {
        marginBottom: spacing.m,
    },
    categoryList: {
        paddingHorizontal: spacing.l,
        gap: spacing.s,
    },
    categoryChip: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.full,
        borderWidth: 1,
    },
    listContent: {
        paddingHorizontal: spacing.l,
        paddingBottom: 120,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.s,
        marginTop: spacing.s,
    },
    dateGroupCard: {
        padding: 0,
        overflow: 'hidden',
        marginBottom: spacing.m,
    },
    expenseItemWrapper: {
        // wrapper for touch
    },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    infoContainer: {
        flex: 1,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    divider: {
        height: 1,
        marginLeft: spacing.m + 44 + spacing.m,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
});
