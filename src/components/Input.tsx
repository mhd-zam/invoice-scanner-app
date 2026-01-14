import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { radius, spacing, useAppTheme } from '../theme';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
    label?: string;
    containerStyle?: ViewStyle;
    error?: string;
}

export const Input = ({ label, containerStyle, error, style, ...props }: InputProps) => {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Typography variant="label" color={colors.textSecondary} style={styles.label}>
                    {label}
                </Typography>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.inputBackground || colors.card, // Fallback
                        borderColor: error ? colors.error : colors.border,
                        color: colors.text,
                    },
                    style,
                ]}
                placeholderTextColor={colors.textSecondary}
                {...props}
            />
            {error && (
                <Typography variant="caption" color={colors.error} style={styles.error}>
                    {error}
                </Typography>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
    },
    label: {
        marginBottom: spacing.s,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: radius.m,
        paddingHorizontal: spacing.m,
        fontSize: 16,
    },
    error: {
        marginTop: spacing.xs,
    },
});
