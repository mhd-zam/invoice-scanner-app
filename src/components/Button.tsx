import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { radius, spacing, useAppTheme } from '../theme';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
    icon,
}: ButtonProps) {
    const { colors } = useAppTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.muted;
        switch (variant) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.neutral[100]; // Ideally this should be dynamic too, maybe colors.surfaceHighlight?
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textSecondary;
        switch (variant) {
            case 'primary': return colors.primaryForeground;
            case 'secondary': return colors.text;
            case 'outline': return colors.primary;
            case 'ghost': return colors.textSecondary;
            default: return colors.primaryForeground;
        }
    };

    const getBorder = (): ViewStyle | undefined => {
        if (variant === 'outline') {
            return { borderWidth: 1, borderColor: disabled ? colors.muted : colors.primary };
        }
        return undefined;
    };

    const containerStyle = [
        styles.container,
        { backgroundColor: getBackgroundColor() },
        getBorder(),
        size === 'small' && styles.small,
        size === 'large' && styles.large,
        disabled && styles.disabled,
        style,
    ];

    return (
        <TouchableOpacity
            style={containerStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && <View style={{ marginRight: spacing.s }}>{icon}</View>}
                    <Typography
                        variant="bodyBold"
                        color={getTextColor()}
                        style={size === 'small' ? { fontSize: 14 } : undefined}
                    >
                        {title}
                    </Typography>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: radius.l,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.l,
    },
    small: {
        height: 36,
        paddingHorizontal: spacing.m,
    },
    large: {
        height: 56,
        paddingHorizontal: spacing.xl,
    },
    disabled: {
        opacity: 0.7,
    },
});
