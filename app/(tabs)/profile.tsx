import { LinearGradient } from 'expo-linear-gradient';
import { Bell, ChevronRight, HelpCircle, Info, LogOut, Moon, Shield, Trash2, User } from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { useExpenseStore } from '../../src/features/expenses/store/useExpenseStore';
import { palette, radius, spacing, useAppTheme } from '../../src/theme';

import { useAuth } from '../../src/store/authStore';

export default function ProfileScreen() {
    const { expenses, deleteExpense } = useExpenseStore();
    const { colors, isDark } = useAppTheme();
    const { signOut, user } = useAuth();

    const handleReset = () => {
        Alert.alert("Clear All Data", "This will permanently delete all your expenses and cannot be undone.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete All",
                style: "destructive",
                onPress: () => expenses.forEach(e => deleteExpense(e.id))
            }
        ]);
    };

    const handleLogout = () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log Out",
                style: "destructive",
                onPress: signOut
            }
        ]);
    };

    const SettingsRow = ({
        icon: Icon,
        iconColor,
        label,
        value,
        onPress,
        showChevron = false,
        rightElement
    }: {
        icon: any;
        iconColor?: string;
        label: string;
        value?: string;
        onPress?: () => void;
        showChevron?: boolean;
        rightElement?: React.ReactNode;
    }) => (
        <TouchableOpacity
            style={styles.settingsRow}
            onPress={onPress}
            disabled={!onPress && !rightElement}
            activeOpacity={onPress ? 0.6 : 1}
        >
            <View style={[styles.iconBox, { backgroundColor: (iconColor || colors.primary) + '15' }]}>
                <Icon size={20} color={iconColor || colors.primary} />
            </View>
            <View style={styles.rowContent}>
                <Typography variant="body">{label}</Typography>
                {value && (
                    <Typography variant="caption" color={colors.textSecondary}>{value}</Typography>
                )}
            </View>
            {rightElement}
            {showChevron && <ChevronRight size={20} color={colors.textSecondary} />}
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={true}
            bounces={true}
            alwaysBounceVertical={true}
        >
            {/* Gradient Profile Header */}
            <LinearGradient
                colors={[colors.primary, palette.primary[800]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={40} color={colors.primary} />
                    </View>
                    <View style={styles.onlineIndicator} />
                </View>
                <Typography variant="header2" color="white" style={{ marginTop: spacing.m }}>
                    {user?.name || 'User'}
                </Typography>
                <Typography variant="body" color="rgba(255,255,255,0.7)">
                    {user?.email || 'user@example.com'}
                </Typography>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Typography variant="header2" color="white">{expenses.length}</Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.6)">Expenses</Typography>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                    <View style={styles.statItem}>
                        <Typography variant="header2" color="white">
                            ₹{expenses.reduce((sum, e) => sum + e.totalAmount, 0).toFixed(0)}
                        </Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.6)">Total Spent</Typography>
                    </View>
                </View>
            </LinearGradient>

            {/* Preferences */}
            <Typography variant="label" style={styles.sectionLabel}>PREFERENCES</Typography>
            <Card style={styles.settingsCard}>
                <SettingsRow
                    icon={Moon}
                    iconColor={palette.primary[500]}
                    label="Dark Mode"
                    rightElement={
                        <Switch
                            value={isDark}
                            disabled
                            trackColor={{ false: colors.muted, true: colors.primary }}
                            thumbColor={colors.white}
                        />
                    }
                />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <SettingsRow
                    icon={Bell}
                    iconColor={palette.warning}
                    label="Notifications"
                    value="Enabled"
                    showChevron
                />
            </Card>

            {/* Security & Privacy */}
            <Typography variant="label" style={styles.sectionLabel}>SECURITY & PRIVACY</Typography>
            <Card style={styles.settingsCard}>
                <SettingsRow
                    icon={Shield}
                    iconColor={palette.success}
                    label="Privacy Settings"
                    showChevron
                />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <SettingsRow
                    icon={Trash2}
                    iconColor={palette.error}
                    label="Clear All Data"
                    onPress={handleReset}
                    showChevron
                />
            </Card>

            {/* Support */}
            <Typography variant="label" style={styles.sectionLabel}>SUPPORT</Typography>
            <Card style={styles.settingsCard}>
                <SettingsRow
                    icon={HelpCircle}
                    iconColor={colors.primary}
                    label="Help & FAQ"
                    showChevron
                />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <SettingsRow
                    icon={Info}
                    iconColor={colors.textSecondary}
                    label="App Version"
                    value="1.0.0"
                />
            </Card>

            {/* Logout Button */}
            <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: palette.error + '10', borderColor: palette.error + '30' }]}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <LogOut size={20} color={palette.error} />
                <Typography variant="bodyBold" color={palette.error} style={{ marginLeft: spacing.s }}>
                    Log Out
                </Typography>
            </TouchableOpacity>

            <Typography variant="caption" color={colors.textSecondary} style={styles.footer}>
                Made with ❤️ for tracking expenses
            </Typography>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 120,
    },
    headerGradient: {
        paddingTop: spacing.xl * 2.5,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        borderBottomLeftRadius: radius.xl,
        borderBottomRightRadius: radius.xl,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: 'white',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.l,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: radius.l,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.xl,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: 40,
        marginHorizontal: spacing.l,
    },
    sectionLabel: {
        marginBottom: spacing.s,
        marginTop: spacing.l,
        paddingHorizontal: spacing.l,
    },
    settingsCard: {
        marginHorizontal: spacing.l,
        padding: 0,
        overflow: 'hidden',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: radius.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    rowContent: {
        flex: 1,
    },
    divider: {
        height: 1,
        marginLeft: spacing.m + 40 + spacing.m,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacing.l,
        marginTop: spacing.xl,
        paddingVertical: spacing.m,
        borderRadius: radius.l,
        borderWidth: 1,
    },
    footer: {
        textAlign: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.m,
    },
});
