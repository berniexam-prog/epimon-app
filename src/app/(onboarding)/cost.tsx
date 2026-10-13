import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Moon } from '../../ui';

export default function CostScreen() {
  const { distractionHoursPerDay } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'cost' });
    if (distractionHoursPerDay === 0) {
      router.replace('/(onboarding)/obstacle');
    }
  }, [distractionHoursPerDay]);

  const annualHours = distractionHoursPerDay * 365;
  const days = Math.round(annualHours / 24);

  return (
    <ScreenShell title="At 4 hours a day, you will lose" progress={20} pose="write">
      <View style={styles.center}>
        <Moon size={120} fill={0.1} />
        <Text style={styles.value}>{annualHours.toLocaleString()}</Text>
        <Text style={styles.label}>hours this year.</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{days} days. A degree. A book. The habit you keep delaying.</Text>
        </View>
      </View>
      <Button label="Not this year" variant="moon" onPress={() => router.push('/(onboarding)/obstacle')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  value: {
    fontFamily: fontFamily.heading,
    fontSize: 56,
    color: color.coral,
    marginTop: 12,
  },
  label: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.lg,
    color: color.text,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: color.den,
    borderWidth: 1,
    borderColor: color.line,
    padding: 16,
  },
  cardText: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    color: color.text,
    textAlign: 'center',
  },
});
