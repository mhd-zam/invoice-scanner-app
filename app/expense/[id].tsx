import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../src/components/Typography'; // Adjust path
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore'; // Adjust path
import { radius, spacing, useAppTheme } from '../../src/theme'; // Adjust path

const { width } = Dimensions.get('window');

export default function ExpenseDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useAppTheme();
    const expense = useExpenseStore(s => s.getExpenseById(id as string));
    const deleteExpense = useExpenseStore(s => s.deleteExpense);

    if (!expense) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Typography variant="header3">Expense not found</Typography>
            </View>
        );
    }

    const handleDelete = () => {
        deleteExpense(expense.id);
        router.back();
    };

    const imageUrls = expense.imageUrls && expense.imageUrls.length > 0
        ? expense.imageUrls
        // @ts-ignore: Legacy support if migration failed or strictness isn't perfect
        : (expense.imageUrl ? [expense.imageUrl] : []);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen
                options={{
                    title: 'Expense Details',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.text,
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: spacing.m }}>
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color={colors.error || 'red'} />
                        </TouchableOpacity>
                    )
                }}
            />

            <ScrollView contentContainerStyle={styles.container}>
                {/* Image Carousel */}
                {imageUrls.length > 0 ? (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ height: 400, backgroundColor: colors.muted, marginBottom: spacing.l }}
                    >
                        {imageUrls.map((img, index) => (
                            <View key={index} style={styles.imagePage}>
                                <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
                                <View style={styles.pageIndicator}>
                                    <Typography variant="label" color="white">{index + 1}/{imageUrls.length}</Typography>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={[styles.placeholder, { backgroundColor: colors.muted }]}>
                        <Typography variant="body" color={colors.textSecondary}>No image available</Typography>
                    </View>
                )}

                <View style={styles.details}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Typography variant="header2">{expense.merchantName}</Typography>
                            <Typography variant="body" color={colors.textSecondary}>{new Date(expense.date).toLocaleDateString()}</Typography>
                        </View>
                        <Typography variant="header2" color={colors.primary}>₹{expense.totalAmount.toFixed(2)}</Typography>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.row}>
                        <Typography variant="body" color={colors.textSecondary}>Status</Typography>
                        <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                            <Typography variant="label" color={colors.success}>{expense.status.toUpperCase()}</Typography>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.row}>
                        <Typography variant="body" color={colors.textSecondary}>Category</Typography>
                        <Typography variant="bodyBold">{expense.category}</Typography>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <Typography variant="header3" style={{ marginTop: spacing.m, marginBottom: spacing.s }}>Items</Typography>
                    {expense.items && expense.items.length > 0 ? (
                        expense.items.map((item, idx) => (
                            <View key={idx} style={styles.itemRow}>
                                <Typography variant="body">{item.name}</Typography>
                                <Typography variant="bodyBold">₹{item.amount.toFixed(2)}</Typography>
                            </View>
                        ))
                    ) : (
                        <Typography variant="body" color={colors.textSecondary}>No line items detected.</Typography>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: spacing.xl,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePage: {
        width: width,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    pageIndicator: {
        position: 'absolute',
        bottom: spacing.m,
        right: spacing.m,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: radius.m,
    },
    details: {
        paddingHorizontal: spacing.l,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.m,
    },
    divider: {
        height: 1,
        marginVertical: spacing.m,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: spacing.s,
        paddingVertical: 2,
        borderRadius: 4,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.s,
    },
});
