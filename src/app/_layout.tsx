import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Fredoka_600SemiBold, useFonts } from '@expo-google-fonts/fredoka';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { NotificationService } from '../services/notifications';
import { useOnboardingStore } from '../stores/onboarding';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  
  const segments = useSegments();
  const { onboardingCompletedAt, hasHydrated } = useOnboardingStore(
    useShallow((state) => ({
      onboardingCompletedAt: state.onboardingCompletedAt,
      hasHydrated: state.hasHydrated,
    }))
  );

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    NotificationService.configureHandler();
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const isOnboardingRoute = segments[0] === '(onboarding)';
    const isTabsRoute = segments[0] === '(tabs)';

    if (!onboardingCompletedAt && !isOnboardingRoute) {
      router.replace('/(onboarding)/welcome');
      return;
    }

    if (onboardingCompletedAt && !isTabsRoute && segments[0] !== 'focus') {
      router.replace('/');
    }
  }, [hasHydrated, onboardingCompletedAt, segments]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!hasHydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0E1024' },
        }}
      />
    </SafeAreaProvider>
  );
}