import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Moon } from '../../ui';

export default function TrialScreen() {
  const complete = useOnboardingStore((state) => state.complete);

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'trial' });
  }, []);

  const handleStartTrial = async () => {
    logOnboardingEvent('onboarding_completed', { step: 'trial' });
    
    // 1. Mark onboarding as complete in the store and persist to storage
    complete();
    
    // 2. Redirect to the main index tab
    router.replace('/(tabs)');
  };

  return (
    <ScreenShell title="Ready for a 7-day trial?" subtitle="A tiny orbit to test the habit before the full plan." progress={100} pose="cheer">
      <View style={styles.card}>
        <Moon size={64} fill={1} />
        <Text style={styles.title}>7-day focus run</Text>
        <Text style={styles.text}>One decision, one block, one refund-safe trial.</Text>
      </View>
      <Button label="Start my trial" variant="moon" onPress={handleStartTrial} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.den,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.line,
    padding: 18,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    color: color.text,
    marginTop: 12,
  },
  text: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    color: color.mist,
    textAlign: 'center',
    marginTop: 8,
  },
});