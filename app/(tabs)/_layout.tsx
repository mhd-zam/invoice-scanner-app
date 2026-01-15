import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import { Banknote, Home, PieChart, Plus, Receipt } from 'lucide-react-native';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { spacing, useAppTheme } from '../../src/theme'; // Use hook

export default function TabLayout() {
  const router = useRouter();
  const { colors } = useAppTheme(); // Get dynamic colors


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          position: 'absolute',
          bottom: spacing.l,
          left: spacing.l, // Uniform spacing (24)
          right: spacing.l,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#121212',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 16,
          paddingBottom: Platform.OS === 'ios' ? 8 : 10,
          paddingTop: 8,
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
              {...(props as any)}
              delayLongPress={props.delayLongPress ?? undefined}
              disabled={props.disabled === null ? undefined : props.disabled}
              onBlur={props.onBlur ?? undefined}
              onFocus={props.onFocus ?? undefined}
              onLongPress={props.onLongPress ?? undefined}
              onPressIn={props.onPressIn ?? undefined}
              onPressOut={props.onPressOut ?? undefined}
              activeOpacity={0.8}
              onPress={() => router.push('/scanner')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debt"
        options={{
          title: 'Debts',
          tabBarIcon: ({ color }) => <Banknote size={24} color={color} strokeWidth={1.5} />,
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
        name="profile"
        options={{
          href: null, // Hide from tab bar
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
