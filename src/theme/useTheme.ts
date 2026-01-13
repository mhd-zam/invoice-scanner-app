import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from './colors';

export function useAppTheme() {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    const colors: ThemeColors = isDark ? darkColors : lightColors;

    return {
        colors,
        isDark,
        scheme,
    };
}
