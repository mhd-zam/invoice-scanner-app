
export const palette = {
  // Neutral - Slate/Inter Grays
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  // Accent - Vibrant Violet (Kuick Bank Style)
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED', // Main Brand Color
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Common base colors independent of theme
const common = {
  primary: palette.primary[600],
  primaryForeground: palette.white,
  success: palette.success,
  error: palette.error,
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
  neutral: palette.neutral, // expose if needed
};

export const lightColors = {
  ...common,
  background: palette.neutral[50],
  card: palette.white,
  text: palette.neutral[900],
  textSecondary: palette.neutral[500],
  border: palette.neutral[200],
  muted: palette.neutral[100],
  icon: palette.neutral[600],
  shadow: palette.black,
  inputBackground: palette.white,
};

export const darkColors = {
  ...common,
  background: palette.neutral[950],
  card: palette.neutral[900],
  text: palette.neutral[50],
  textSecondary: palette.neutral[400],
  border: palette.neutral[800],
  muted: palette.neutral[800],
  icon: palette.neutral[400],
  shadow: palette.black, // Shadows on dark mode are tricky, usually less visible
  inputBackground: palette.neutral[900],
};

// Keep 'colors' export for backward compat if any, but mostly for type inference
export type ThemeColors = typeof lightColors;
export const colors = lightColors; // Default to light

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  full: 9999,
};
