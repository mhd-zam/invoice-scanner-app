import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuth } from '../src/store/authStore';
import { useAppTheme } from '../src/theme'; // Import hook

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { scheme, colors } = useAppTheme(); // Use hook
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'scanner';

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to login if accessing protected route without auth
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // Redirect to home if already logged in
      router.replace('/(tabs)');
    } else if (!isAuthenticated && segments.length === 0) {
      // Handle initial case
      router.replace('/login');
    }
  }, [isAuthenticated, segments, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }, // Dynamic background
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="scanner/index"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
