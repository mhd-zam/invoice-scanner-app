import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'; // Import StyleProp
import { radius, spacing, useAppTheme } from '../theme';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>; // Fix type to allow both object and array styles
    variant?: 'elevated' | 'flat' | 'outlined';
}

export function Card({ children, style, variant = 'elevated' }: CardProps) {
    const { colors } = useAppTheme();

    const getStyle = (): ViewStyle => {
        switch (variant) {
            case 'elevated':
                return {
                    ...styles.base,
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 12,
                    elevation: 2,
                };
            case 'flat':
                return {
                    ...styles.base,
                    backgroundColor: colors.muted, // Flat usually means "on surface"
                };
            case 'outlined':
                return {
                    ...styles.base,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: 'transparent',
                };
            default:
                return { ...styles.base, backgroundColor: colors.card };
        }
    };

    return <View style={[getStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
    base: {
        padding: spacing.m,
        borderRadius: radius.l,
    },
});
