import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { radius, spacing, useAppTheme } from '../../src/theme';

const { width } = Dimensions.get('window');

export default function ExpenseDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const expense = useExpenseStore(s => s.getExpenseById(id as string));
    const deleteExpense = useExpenseStore(s => s.deleteExpense);

    if (!expense) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top }]}>
                <Typography variant="header3">Expense not found</Typography>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    deleteExpense(expense.id);
                    router.back();
                }
            }
        ]);
    };

    const imageUrls = expense.imageUrls && expense.imageUrls.length > 0
        ? expense.imageUrls
        // @ts-ignore: Legacy support if migration failed or strictness isn't perfect
        : (expense.imageUrl ? [expense.imageUrl] : []);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.s, backgroundColor: colors.background }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.headerButton, { backgroundColor: colors.card }]}
                >
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Typography variant="header3">Expense Details</Typography>
                <TouchableOpacity
                    onPress={handleDelete}
                    style={[styles.headerButton, { backgroundColor: colors.error + '15' }]}
                >
                    <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
            </View>

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
                            <TouchableOpacity
                                key={index}
                                style={styles.imagePage}
                                onPress={() => setSelectedImageIndex(index)}
                                activeOpacity={0.9}
                            >
                                <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
                                <View style={styles.pageIndicator}>
                                    <Typography variant="label" color="white">{index + 1}/{imageUrls.length}</Typography>
                                </View>
                                <View style={styles.tapHint}>
                                    <Typography variant="caption" color="white">Tap to preview</Typography>
                                </View>
                            </TouchableOpacity>
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

            {/* Fullscreen Image Preview Modal */}
            <Modal
                visible={selectedImageIndex !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImageIndex(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setSelectedImageIndex(null)}
                    >
                        <X size={28} color="white" />
                    </TouchableOpacity>

                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentOffset={{ x: (selectedImageIndex || 0) * width, y: 0 }}
                    >
                        {imageUrls.map((img, index) => (
                            <View key={index} style={styles.modalImageContainer}>
                                <Image
                                    source={{ uri: img }}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.modalPageIndicator}>
                        <Typography variant="body" color="white">
                            {(selectedImageIndex || 0) + 1} / {imageUrls.length}
                        </Typography>
                    </View>
                </View>
            </Modal>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.m,
        paddingBottom: spacing.s,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: radius.m,
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
    tapHint: {
        position: 'absolute',
        bottom: spacing.m,
        left: spacing.m,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: radius.s,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalImageContainer: {
        width: width,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: width,
        height: '80%',
    },
    modalPageIndicator: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.l,
    },
});
