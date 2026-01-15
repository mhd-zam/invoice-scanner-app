import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (email: string) => Promise<void>;
    signOut: () => Promise<void>;
    hydrate: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            hydrate: async () => {
                // Optional: Perform token validation here if we had one
            },
            signIn: async (email: string) => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                set({
                    user: { id: '1', name: 'User', email },
                    isAuthenticated: true,
                    isLoading: false,
                });
            },
            signOut: async () => {
                set({ isLoading: true });
                await new Promise((resolve) => setTimeout(resolve, 500));
                set({ user: null, isAuthenticated: false, isLoading: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
