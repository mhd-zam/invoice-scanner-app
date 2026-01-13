import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
    header1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
        color: colors.text,
        letterSpacing: -0.5,
    } as TextStyle,
    header2: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
        color: colors.text,
        letterSpacing: -0.3,
    } as TextStyle,
    header3: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        color: colors.text,
    } as TextStyle,
    body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.text,
    } as TextStyle,
    bodyBold: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.text,
    } as TextStyle,
    caption: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.textSecondary,
    } as TextStyle,
    label: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    } as TextStyle,
};
