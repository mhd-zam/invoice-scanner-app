import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Mail } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/store/authStore';
import { spacing, useAppTheme } from '../src/theme';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();
    const { signInWithIdToken, signInWithApple, isAuthenticated, isLoading } = useAuth();

    // IMPORTANT: Replace 'your-expo-username' with your actual Expo username
    // You can find it in your Expo account settings or by running `npx expo whoami`
    // If you don't have one, you'll need to create one to use the Auth Proxy.
    const redirectUri = 'https://auth.expo.io/@mhd_zam/invoice-scanner-app';

    console.log("DEBUG: Using Redirect URI:", redirectUri);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        redirectUri,
    });

    const [isAppleAuthAvailable, setIsAppleAuthAvailable] = React.useState(false);

    useEffect(() => {
        AppleAuthentication.isAvailableAsync().then(setIsAppleAuthAvailable);
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            if (id_token) {
                signInWithIdToken('google', id_token);
            } else {
                Alert.alert('Error', 'No ID token found in Google response.');
            }
        }
    }, [response, signInWithIdToken]);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)/debt'); // Assuming debt is the home/dashboard
        }
    }, [isAuthenticated, router]);

    const handleEmailSignIn = () => {
        Alert.alert("Not Implemented", "Email sign-in is not yet implemented with Supabase.");
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Background Gradient */}
            <View style={styles.gradientContainer}>
                <LinearGradient
                    colors={[colors.primary, 'transparent']}
                    locations={[0, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradient}
                />
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Header / Logo */}
                    <View style={styles.header}>
                        <View style={styles.logoIcon}>
                            <View style={[styles.logoSquare, { backgroundColor: colors.primary }]} />
                            <View style={[styles.logoSquare, { backgroundColor: colors.primary, opacity: 0.7 }]} />
                            <View style={[styles.logoSquare, { backgroundColor: colors.primary, opacity: 0.4 }]} />
                        </View>
                        <Text style={[styles.logoText, { color: colors.text }]}>Invoice Scanner</Text>
                    </View>

                    {/* Main Text */}
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Scanning Made{'\n'}
                            Simple, Fast,{'\n'}
                            and Always{'\n'}
                            Organized
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Digitize your invoices instantly, track expenses, and manage your finances with ease.
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                            onPress={handleEmailSignIn}
                            disabled={isLoading}
                        >
                            <Mail size={20} color="white" style={styles.icon} />
                            <Text style={styles.primaryButtonText}>{isLoading ? 'Signing in...' : 'Sign in with Email'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                            onPress={() => promptAsync()}
                            disabled={isLoading || !request}
                        >
                            <Ionicons name="logo-google" size={20} color={colors.text} style={styles.icon} />
                            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Sign in with Google</Text>
                        </TouchableOpacity>

                        {isAppleAuthAvailable && (
                            <TouchableOpacity
                                style={[styles.button, styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                                onPress={signInWithApple}
                                disabled={isLoading}
                            >
                                <Ionicons name="logo-apple" size={20} color={colors.text} style={styles.icon} />
                                <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Sign in with Apple</Text>
                            </TouchableOpacity>
                        )}

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                            <TouchableOpacity>
                                <Text style={[styles.linkText, { color: colors.primary }]}>Create account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '65%', // Covers more of the screen for a longer fade
    },
    gradient: {
        flex: 1,
        opacity: 0.2, // Subtle, soft wash
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.l,
        justifyContent: 'space-between',
        paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.m,
    },
    logoIcon: {
        width: 24,
        height: 24,
        marginRight: spacing.s,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSquare: {
        width: 8,
        height: 8,
        borderRadius: 2,
    },
    logoText: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 4,
    },
    textContainer: {
        marginTop: spacing.xl * 2,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        lineHeight: 48,
        letterSpacing: -0.5,
        marginBottom: spacing.l,
    },
    subtitle: {
        fontSize: 17,
        lineHeight: 24,
        paddingRight: spacing.xl,
    },
    actions: {
        gap: spacing.m,
        marginBottom: spacing.xl,
    },
    button: {
        height: 56,
        borderRadius: 28, // Fully rounded
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    icon: {
        marginRight: spacing.s,
    },
    primaryButton: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        borderWidth: 1,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.s,
    },
    footerText: {
        fontSize: 14,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
