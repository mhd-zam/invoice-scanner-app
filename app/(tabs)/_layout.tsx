import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import { Home, PieChart, Plus, Receipt, Settings } from 'lucide-react-native';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../src/theme'; // Use hook

export default function TabLayout() {
  const router = useRouter();
  const { colors } = useAppTheme(); // Get dynamic colors

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.shadow,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 16,
          backgroundColor: colors.card,
          height: Platform.OS === 'ios' ? 88 : 70, // Taller premium tab bar
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          position: 'absolute', // Floating effect if desired, but sticking to bottom is safer for safe-area
        },
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Receipt size={24} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="scan_placeholder"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <LinearGradient
              colors={[colors.primary, '#4F46E5']} // Gradient for scan button
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === 'ios' ? 24 : 40,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Plus size={32} color="white" strokeWidth={2} />
            </LinearGradient>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              activeOpacity={0.8}
              onPress={() => router.push('/scanner')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}
