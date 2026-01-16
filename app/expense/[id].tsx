import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, ChevronLeft, Package, Receipt, ShoppingBag, Tag, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { palette, radius, spacing, useAppTheme } from '../../src/theme';

const { width, height } = Dimensions.get('window');

export default function ExpenseDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();
    const expense = useExpenseStore(s => s.getExpenseById(id as string));
    const deleteExpense = useExpenseStore(s => s.deleteExpense);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    if (!expense) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top }]}>
                <Receipt size={64} color={colors.textSecondary} strokeWidth={1} />
                <Typography variant="header3" style={{ marginTop: spacing.m }}>Expense not found</Typography>
                <TouchableOpacity
                    style={[styles.goBackButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.back()}
                >
                    <Typography variant="bodyBold" color="white">Go Back</Typography>
                </TouchableOpacity>
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
        // @ts-ignore: Legacy support
        : (expense.imageUrl ? [expense.imageUrl] : []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header with gradient overlay on image */}
            <View style={styles.imageSection}>
                {imageUrls.length > 0 ? (
                    <>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={styles.imageCarousel}
                        >
                            {imageUrls.map((img, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.imagePage}
                                    onPress={() => setSelectedImageIndex(index)}
                                    activeOpacity={0.95}
                                >
                                    <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Gradient overlay for header */}
                        <LinearGradient
                            colors={['rgba(0,0,0,0.5)', 'transparent']}
                            style={styles.headerGradient}
                        />

                        {/* Page indicator */}
                        {imageUrls.length > 1 && (
                            <View style={styles.pageIndicator}>
                                {imageUrls.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            { backgroundColor: index === 0 ? 'white' : 'rgba(255,255,255,0.5)' }
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                ) : (
                    <View style={[styles.noImagePlaceholder, { backgroundColor: colors.muted }]}>
                        <Receipt size={64} color={colors.textSecondary} strokeWidth={1} />
                        <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.m }}>
                            No receipt image
                        </Typography>
                    </View>
                )}

                {/* Fixed Header Buttons */}
                <View style={[styles.headerButtons, { top: insets.top + spacing.s }]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.headerBtn}
                    >
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDelete}
                        style={[styles.headerBtn, { backgroundColor: 'rgba(239,68,68,0.8)' }]}
                    >
                        <Trash2 size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content Card */}
            <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Amount & Merchant */}
                    <View style={styles.mainInfo}>
                        <View style={styles.amountRow}>
                            <Typography variant="display" style={[styles.amount, { color: colors.text }]}>
                                ₹{expense.totalAmount.toLocaleString('en-IN')}
                            </Typography>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: expense.status === 'verified' ? colors.success + '20' : colors.warning + '20' }
                            ]}>
                                <Typography
                                    variant="label"
                                    color={expense.status === 'verified' ? colors.success : colors.warning}
                                >
                                    {expense.status?.toUpperCase() || 'PENDING'}
                                </Typography>
                            </View>
                        </View>
                        <Typography variant="header3" style={{ marginTop: spacing.xs }}>
                            {expense.merchantName}
                        </Typography>
                    </View>

                    {/* Info Cards */}
                    <View style={styles.infoGrid}>
                        <Card style={[styles.infoCard, { flex: 1 }]}>
                            <View style={[styles.infoIcon, { backgroundColor: colors.primary + '15' }]}>
                                <Calendar size={18} color={colors.primary} />
                            </View>
                            <Typography variant="caption" color={colors.textSecondary}>Date</Typography>
                            <Typography variant="bodyBold" style={{ marginTop: 2 }}>
                                {formatDate(expense.date)}
                            </Typography>
                        </Card>

                        <Card style={[styles.infoCard, { flex: 1 }]}>
                            <View style={[styles.infoIcon, { backgroundColor: palette.primary[100] }]}>
                                <Tag size={18} color={colors.primary} />
                            </View>
                            <Typography variant="caption" color={colors.textSecondary}>Category</Typography>
                            <Typography variant="bodyBold" style={{ marginTop: 2 }}>
                                {expense.category || 'Uncategorized'}
                            </Typography>
                        </Card>
                    </View>

                    {/* Items Section */}
                    <View style={styles.itemsSection}>
                        <View style={styles.sectionHeader}>
                            <Package size={18} color={colors.text} />
                            <Typography variant="header3" style={{ marginLeft: spacing.s }}>
                                Items
                            </Typography>
                            <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 'auto' }}>
                                {expense.items?.length || 0} items
                            </Typography>
                        </View>

                        <Card style={styles.itemsCard}>
                            {expense.items && expense.items.length > 0 ? (
                                expense.items.map((item, idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            styles.itemRow,
                                            idx !== expense.items!.length - 1 && {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border
                                            }
                                        ]}
                                    >
                                        <View style={[styles.itemDot, { backgroundColor: colors.primary }]} />
                                        <Typography variant="body" style={{ flex: 1 }} numberOfLines={2}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="bodyBold" color={colors.text}>
                                            ₹{item.amount.toFixed(0)}
                                        </Typography>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.noItems}>
                                    <ShoppingBag size={32} color={colors.textSecondary} strokeWidth={1} />
                                    <Typography variant="body" color={colors.textSecondary} style={{ marginTop: spacing.s }}>
                                        No items detected
                                    </Typography>
                                </View>
                            )}
                        </Card>
                    </View>
                </ScrollView>
            </View>

            {/* Fullscreen Image Preview Modal */}
            <Modal
                visible={selectedImageIndex !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImageIndex(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={[styles.modalCloseButton, { top: insets.top + spacing.m }]}
                        onPress={() => setSelectedImageIndex(null)}
                    >
                        <X size={24} color="white" />
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

                    <View style={[styles.modalPageIndicator, { bottom: insets.bottom + spacing.xl }]}>
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
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    goBackButton: {
        marginTop: spacing.l,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.m,
        borderRadius: radius.full,
    },
    imageSection: {
        height: height * 0.35,
        position: 'relative',
    },
    imageCarousel: {
        flex: 1,
    },
    imagePage: {
        width: width,
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    noImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtons: {
        position: 'absolute',
        left: spacing.m,
        right: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageIndicator: {
        position: 'absolute',
        bottom: spacing.m,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    contentCard: {
        flex: 1,
        marginTop: -24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: spacing.l,
        paddingBottom: 100,
    },
    mainInfo: {
        marginBottom: spacing.l,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    amount: {
        fontSize: 36,
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: spacing.m,
        marginBottom: spacing.l,
    },
    infoCard: {
        padding: spacing.m,
    },
    infoIcon: {
        width: 36,
        height: 36,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    itemsSection: {
        marginTop: spacing.s,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    itemsCard: {
        padding: 0,
        overflow: 'hidden',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
    },
    itemDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.m,
    },
    noItems: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        right: spacing.m,
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.l,
    },
});
