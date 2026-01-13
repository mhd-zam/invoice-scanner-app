import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography, useAppTheme } from '../theme';

interface TypographyProps extends TextProps {
    variant?: keyof typeof typography;
    color?: string;
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
}

export function Typography({
    variant = 'body',
    color,
    align = 'left',
    style,
    children,
    ...props
}: TypographyProps) {
    const { colors } = useAppTheme();

    // Default color logic: if 'color' is provided use it, otherwise use theme 'text' color
    // However, `typography[variant]` might have a color hardcoded in `theme/typography.ts`.
    // Let's inspect `typography`... it has `color: colors.text` which is the static import.
    // We should override it here.

    const defaultColor = variant === 'caption' || variant === 'label' ? colors.textSecondary : colors.text;

    const textStyle = [
        typography[variant],
        { color: defaultColor },
        // ^ override static color from typography definition with dynamic theme color
        color && { color },
        { textAlign: align },
        style,
    ];

    return (
        <Text style={textStyle} {...props}>
            {children}
        </Text>
    );
}
