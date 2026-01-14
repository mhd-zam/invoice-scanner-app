import { ArrowDown, ArrowUp, CheckCircle, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from '../../../components/Card';
import { Typography } from '../../../components/Typography';
import { radius, spacing, useAppTheme } from '../../../theme';
import { Debt, useDebtStore } from '../store/useDebtStore';

interface DebtItemProps {
    debt: Debt;
    onPress: () => void;
}

export const DebtItem = ({ debt, onPress }: DebtItemProps) => {
    const { colors } = useAppTheme();
    const togglePaidStatus = useDebtStore((s) => s.togglePaidStatus);
    const deleteDebt = useDebtStore((s) => s.deleteDebt);

    const isReceive = debt.type === 'receive';
    // Visual colors: Receive = Green, Give = Orange/Red (using theme errors/warnings)
    // Inspiration uses mostly discrete branding colors, we'll stick to our semantic colors
    const themeColor = isReceive ? colors.success : colors.error;

    return (
        <Card style={styles.container} variant="elevated">
            <TouchableOpacity style={styles.mainTouchable} onPress={onPress} activeOpacity={0.7}>
                {/* Left Icon Area */}
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    {isReceive ? (
                        <ArrowDown size={24} color={colors.text} strokeWidth={1.5} />
                    ) : (
                        <ArrowUp size={24} color={colors.text} strokeWidth={1.5} />
                    )}
                </View>

                {/* Middle Info Area */}
                <View style={styles.infoContainer}>
                    <Typography variant="bodyBold" numberOfLines={1} style={styles.title}>
                        {debt.title}
                    </Typography>

                    <Typography variant="caption" color={colors.textSecondary} numberOfLines={1} style={styles.subtitle}>
                        {isReceive ? 'From: ' : 'To: '}{debt.personName}
                    </Typography>

                    {debt.dueDate && (
                        <View style={styles.metaRow}>
                            <Typography variant="caption" color={colors.textSecondary} style={{ fontSize: 11 }}>
                                {debt.dueDate} • One Time
                            </Typography>
                        </View>
                    )}
                </View>

                {/* Right Amount & Status Area */}
                <View style={styles.rightContainer}>
                    <Typography variant="bodyBold" style={{ color: themeColor, fontSize: 16 }}>
                        {isReceive ? '+' : '-'}₹{debt.amount.toFixed(2)}
                    </Typography>

                    {/* Status Pill - Touchable for quick toggle */}
                    <TouchableOpacity
                        style={styles.statusPill}
                        onPress={(e) => {
                            e.stopPropagation();
                            togglePaidStatus(debt.id);
                        }}
                    >
                        {debt.isPaid ? (
                            <>
                                <CheckCircle size={12} color={colors.success} style={{ marginRight: 4 }} />
                                <Typography variant="caption" color={colors.success} style={{ fontWeight: '600' }}>
                                    Paid
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Clock size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                                <Typography variant="caption" color={colors.textSecondary} style={{ fontWeight: '600' }}>
                                    Pending
                                </Typography>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {/* Subtle Delete Button Absolute Positioned or integrated? 
                Let's put it on top right absolute for access without crowding */}
            {/* Alternatively, user can open Detail to delete. 
                 But for quick cleanup, let's keep a small trash icon somewhere.
                 Actually, the inspiration is super clean. Let's hide delete in the "Edit" screen (onPress) 
                 OR add a long-press context. 
                 For now, let's stick to the inspiration which usually relies on "Edit" for destructive. 
                 BUT, to be safe, I'll add a small delete button in the top right corner if needed. 
                 Let's stick to a cleaner approach: No visible delete button on the card. 
                 User taps to edit/delete.
            */}
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
        padding: spacing.m,
        borderRadius: radius.l,
    },
    mainTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
        // Optional: slight shadow or border for the icon box to pop like a logo
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    infoContainer: {
        flex: 1,
        marginRight: spacing.s,
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
    },
    subtitle: {
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.s,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.full,
        backgroundColor: 'rgba(0,0,0,0.03)', // Subtle background
    }
});
