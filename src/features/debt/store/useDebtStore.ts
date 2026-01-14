import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type DebtType = 'receive' | 'give';

export interface Debt {
    id: string;
    type: DebtType;
    amount: number;
    currency: string;
    title: string;
    personName: string;
    dueDate?: string; // ISO string
    notes?: string;
    isPaid: boolean;
    createdAt: string; // ISO string
}

interface DebtState {
    debts: Debt[];
    addDebt: (debt: Omit<Debt, 'id' | 'createdAt' | 'isPaid'>) => void;
    updateDebt: (id: string, updates: Partial<Debt>) => void;
    deleteDebt: (id: string) => void;
    togglePaidStatus: (id: string) => void;
    getDebtById: (id: string) => Debt | undefined;
}

export const useDebtStore = create<DebtState>()(
    persist(
        (set, get) => ({
            debts: [],
            addDebt: (debt) => {
                const newDebt: Debt = {
                    ...debt,
                    id: randomUUID(),
                    isPaid: false,
                    createdAt: new Date().toISOString(),
                    title: debt.title || (debt.type === 'receive' ? 'Money to Receive' : 'Money to Give'),
                };
                set((state) => ({ debts: [newDebt, ...state.debts] }));
            },
            updateDebt: (id, updates) => {
                set((state) => ({
                    debts: state.debts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
                }));
            },
            deleteDebt: (id) => {
                set((state) => ({
                    debts: state.debts.filter((d) => d.id !== id),
                }));
            },
            togglePaidStatus: (id) => {
                set((state) => ({
                    debts: state.debts.map((d) => (d.id === id ? { ...d, isPaid: !d.isPaid } : d)),
                }));
            },
            getDebtById: (id) => get().debts.find((d) => d.id === id),
        }),
        {
            name: 'debt-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
