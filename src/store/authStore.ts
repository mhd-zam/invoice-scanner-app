import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    email: string | undefined;
    name: string | null;
    avatarUrl: string | null;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signInWithIdToken: (provider: 'google' | 'apple', token: string) => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            // Generic method to exchange ID token for Supabase session
            signInWithIdToken: async (provider: 'google' | 'apple', token: string) => {
                set({ isLoading: true });
                try {
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider,
                        token,
                    });

                    if (error) throw error;

                    if (data.session) {
                        const { user } = data.session;
                        set({
                            user: {
                                id: user.id,
                                email: user.email,
                                name: user.user_metadata?.full_name || user.email?.split('@')[0],
                                avatarUrl: user.user_metadata?.avatar_url,
                            },
                            isAuthenticated: true,
                        });
                    }
                } catch (error: any) {
                    console.error(`${provider} Sign-In Error:`, error);
                    alert(`${provider} Sign-In failed: ` + error.message);
                } finally {
                    set({ isLoading: false });
                }
            },

            signInWithApple: async () => {
                set({ isLoading: true });
                try {
                    const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                    });

                    if (credential.identityToken) {
                        const { data, error } = await supabase.auth.signInWithIdToken({
                            provider: 'apple',
                            token: credential.identityToken,
                        });

                        if (error) throw error;

                        if (data.session) {
                            const { user } = data.session;
                            set({
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    name: user.user_metadata?.full_name || (credential.fullName?.givenName ? `${credential.fullName.givenName} ${credential.fullName.familyName}` : user.email?.split('@')[0]),
                                    avatarUrl: user.user_metadata?.avatar_url,
                                },
                                isAuthenticated: true,
                            });
                        }
                    }
                } catch (error: any) {
                    if (error.code === 'ERR_REQUEST_CANCELED') {
                        // handle that the user canceled the sign-in flow
                        console.log('User cancelled apple sign in');
                    } else {
                        // handle other errors
                        console.error('Apple Sign-In Error:', error);
                        alert('Apple Sign-In failed: ' + error.message);
                    }
                } finally {
                    set({ isLoading: false });
                }
            },

            signOut: async () => {
                set({ isLoading: true });
                try {
                    await supabase.auth.signOut();
                    set({ user: null, isAuthenticated: false });
                } catch (error) {
                    console.error('Sign Out Error:', error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        useAuth.setState({
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                avatarUrl: session.user.user_metadata?.avatar_url,
            },
            isAuthenticated: true,
        });
    } else if (event === 'SIGNED_OUT') {
        useAuth.setState({
            user: null,
            isAuthenticated: false,
        });
    }
});
