import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { spacing, useAppTheme } from '../../src/theme';

export default function SettingsScreen() {
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
            <Typography variant="header2" style={{ marginBottom: spacing.l }}>Settings</Typography>

            <Card style={styles.section}>
                <View style={styles.row}>
                    <Typography variant="body">Dark Mode (System Default)</Typography>
                    <Switch value={isDark} disabled trackColor={{ false: colors.muted, true: colors.primary }} />
                </View>
            </Card>

            <Card style={styles.section}>
                <Typography variant="header3" style={{ marginBottom: spacing.m }}>Data Management</Typography>
                <Button title="Clear All Data" onPress={handleReset} variant="outline" />
            </Card>

            <Typography variant="caption" style={{ textAlign: 'center', marginTop: spacing.xl }}>
                Scanly v1.0.0
            </Typography>
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
    section: {
        padding: spacing.l,
        marginBottom: spacing.m,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
