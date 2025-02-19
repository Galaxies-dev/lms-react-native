import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, LogBox, useColorScheme } from 'react-native';
import 'react-native-reanimated';
import '@/global.css';

import { StrapiProvider } from '../providers/StrapiProvider';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@/utils/cache';
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}
LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys']);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
    },
  },
});

export const unstable_settings = {
  initialRouteName: 'index',
};

const InitialLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  useReactQueryDevTools(queryClient);

  useEffect(() => {
    if (loaded && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoaded]);

  useEffect(() => {
    if (!loaded) return;

    const inAuthGroup = segments[1] === '(authenticated)';

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(app)/(authenticated)/(tabs)');
    }
  }, [isLoaded, isSignedIn, loaded]);

  if (!isLoaded || !loaded) {
    return <ActivityIndicator />;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ClerkLoaded>
          <QueryClientProvider client={queryClient}>
            <StrapiProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <InitialLayout />
              </ThemeProvider>
            </StrapiProvider>
          </QueryClientProvider>
        </ClerkLoaded>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
};

export default RootLayout;
