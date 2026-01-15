import { Info, Moon, Trash2, User } from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { spacing, useAppTheme } from '../../src/theme';

export default function ProfileScreen() {
    const { expenses, deleteExpense } = useExpenseStore();
    const { colors, isDark } = useAppTheme();

    const handleReset = () => {
        Alert.alert("Clear Data", "Are you sure? This cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete All",
                style: "destructive",
                onPress: () => expenses.forEach(e => deleteExpense(e.id))
            }
        ]);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                    <User size={48} color={colors.primary} />
                </View>
                <Typography variant="header2" style={{ marginTop: spacing.m }}>User</Typography>
                <Typography variant="caption" color={colors.textSecondary}>user@example.com</Typography>
            </View>

            {/* Settings Section */}
            <Typography variant="label" style={styles.sectionLabel}>SETTINGS</Typography>

            <Card style={styles.section}>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Moon size={20} color={colors.icon} style={{ marginRight: spacing.s }} />
                        <Typography variant="body">Dark Mode</Typography>
                    </View>
                    <Switch value={isDark} disabled trackColor={{ false: colors.muted, true: colors.primary }} />
                </View>
            </Card>

            {/* Data Section */}
            <Typography variant="label" style={styles.sectionLabel}>DATA</Typography>

            <Card style={styles.section}>
                <View style={[styles.row, { paddingVertical: spacing.s }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Trash2 size={20} color={colors.error} style={{ marginRight: spacing.s }} />
                        <Typography variant="body" color={colors.error}>Clear All Data</Typography>
                    </View>
                </View>
                <Button title="Delete All" onPress={handleReset} variant="outline" style={{ marginTop: spacing.s, borderColor: colors.error }} />
            </Card>

            {/* About Section */}
            <Typography variant="label" style={styles.sectionLabel}>ABOUT</Typography>
            <Card style={styles.section}>
                <View style={styles.row}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Info size={20} color={colors.icon} style={{ marginRight: spacing.s }} />
                        <Typography variant="body">App Version</Typography>
                    </View>
                    <Typography variant="caption" color={colors.textSecondary}>1.0.0</Typography>
                </View>
            </Card>

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
        paddingBottom: 120, // Room for tab bar
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionLabel: {
        marginBottom: spacing.s,
        marginTop: spacing.m,
        paddingLeft: spacing.xs,
    },
    section: {
        padding: spacing.m,
        marginBottom: spacing.s,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
