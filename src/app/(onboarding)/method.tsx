import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { color, fontFamily, typography } from '../../theme';
import { Button } from '../../ui';

const steps = [
  { icon: '1', title: 'Find your reason' },
  { icon: '2', title: '5-second start' },
  { icon: '3', title: 'Protected focus' },
  { icon: '4', title: 'Fast recovery' },
];

export default function MethodScreen() {
  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'method' });
  }, []);

  return (
    <ScreenShell title="The method behind Epi" progress={42} pose="wave">
      <View style={styles.stepList}>
        {steps.map((step) => (
          <View key={step.icon} style={styles.step}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{step.icon}</Text></View>
            <Text style={styles.stepText}>{step.title}</Text>
          </View>
        ))}
      </View>
      <Button label="Let us do this" variant="moon" onPress={() => router.push('/(onboarding)/identity')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  stepList: {
    marginTop: 14,
    marginBottom: 20,
    gap: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.den,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(246,235,180,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepBadgeText: {
    fontFamily: fontFamily.bodyBold,
    color: color.moon,
    fontSize: typography.sm,
  },
  stepText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
    color: color.text,
  },
});
