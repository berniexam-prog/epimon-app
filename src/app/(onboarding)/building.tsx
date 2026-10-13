import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { color, fontFamily, typography } from '../../theme';
import { ProgressBar } from '../../ui';

const tasks = [
  'Reading your pattern',
  'Matching your method',
  'Setting your 15-minute moon',
  'Mapping day 30',
];

export default function BuildingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'building' });
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= tasks.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    const navTimer = setTimeout(() => {
      router.replace('/(onboarding)/plan-preview');
    }, 3200);

    return () => {
      clearInterval(timer);
      clearTimeout(navTimer);
    };
  }, []);

  const progress = (currentStep + 1) / tasks.length;

  return (
    <ScreenShell title="Epi is building your plan" progress={90} pose="build">
      <View style={styles.list}>
        {tasks.map((task, index) => {
          const active = index <= currentStep;
          return (
            <View key={task} style={styles.row}>
              <Text style={[styles.bullet, active && styles.bulletActive]}>{active ? '✓' : '•'}</Text>
              <Text style={[styles.text, !active && styles.textMuted]}>{task}</Text>
            </View>
          );
        })}
      </View>
      <ProgressBar value={progress} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 18,
    marginBottom: 22,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 18,
    textAlign: 'center',
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.md,
    color: color.mist,
  },
  bulletActive: {
    color: color.mint,
  },
  text: {
    color: color.text,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
  },
  textMuted: {
    color: color.mist,
  },
});
