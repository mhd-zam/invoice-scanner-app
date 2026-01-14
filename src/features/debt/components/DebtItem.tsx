import { Check, Trash2, Undo2 } from 'lucide-react-native';
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
    const color = isReceive ? colors.success : colors.error;

    // Render a paid state visually different
    const opacity = debt.isPaid ? 0.5 : 1;

    return (
        <Card style={[styles.container, { opacity }]} variant="flat">
            <TouchableOpacity style={styles.content} onPress={onPress}>
                <View style={styles.left}>
                    <View style={[styles.indicator, { backgroundColor: color + '20' }]}>
                        {/* 20 is simple hex opacity */}
                        <Typography variant="caption" color={color} style={{ fontWeight: 'bold' }}>
                            {isReceive ? 'GET' : 'PAY'}
                        </Typography>
                    </View>
                    <View>
                        <Typography variant="bodyBold" style={debt.isPaid && styles.strikethrough}>
                            {debt.title}
                        </Typography>
                        <Typography variant="caption" color={colors.textSecondary}>
                            {debt.personName} • {debt.dueDate || 'No Date'}
                        </Typography>
                    </View>
                </View>

                <View style={styles.right}>
                    <Typography variant="bodyBold" color={color}>
                        {isReceive ? '+' : '-'}₹{debt.amount.toFixed(2)}
                    </Typography>
                </View>
            </TouchableOpacity>

            {/* Actions - could be swipeable, but buttons are clearer for now */}
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => togglePaidStatus(debt.id)}
                >
                    {debt.isPaid ? (
                        <Undo2 size={16} color={colors.textSecondary} />
                    ) : (
                        <Check size={16} color={colors.success} />
                    )}
                    <Typography
                        variant="caption"
                        color={debt.isPaid ? colors.textSecondary : colors.success}
                        style={{ marginLeft: 4 }}
                    >
                        {debt.isPaid ? 'Undo' : 'Mark Paid'}
                    </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteDebt(debt.id)}
                >
                    <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
        padding: 0, // Override card padding to handle internal easier
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.m,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    right: {
        alignItems: 'flex-end',
        marginLeft: spacing.s,
    },
    indicator: {
        paddingHorizontal: spacing.s,
        paddingVertical: 2,
        borderRadius: radius.s,
        marginRight: spacing.m,
        minWidth: 40,
        alignItems: 'center',
    },
    strikethrough: {
        textDecorationLine: 'line-through',
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        justifyContent: 'flex-end',
    },
    actionButton: {
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
