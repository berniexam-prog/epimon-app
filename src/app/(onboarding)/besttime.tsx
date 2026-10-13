import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';

const options = [
  { value: 'morning', label: 'Morning', time: '09:00' },
  { value: 'afternoon', label: 'Afternoon', time: '14:00' },
  { value: 'evening', label: 'Evening', time: '19:00' },
  { value: 'varies', label: 'It changes', time: '10:00' },
] as const;

export default function BestTimeScreen() {
  const { bestTime, setValue } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'besttime' });
  }, []);

  return (
    <ScreenShell title="When are you at your best?" subtitle="Epi will schedule your first block then." progress={66} pose="write">
      <View style={styles.grid}>
        {options.map((option) => {
          const active = bestTime === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                setValue('bestTime', option.value);
                setValue('nudgeTime', option.time);
                logOnboardingEvent('onboarding_answer', { step: 'besttime', value: option.value });
                router.push('/(onboarding)/minutes');
              }}
              style={[styles.tile, active && styles.tileActive]}
            >
              <Text style={[styles.tileText, active && styles.tileTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
  },
  tile: {
    width: '47%',
    minHeight: 100,
    borderRadius: 18,
    backgroundColor: color.den,
    borderWidth: 2,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileActive: {
    borderColor: color.moon,
    backgroundColor: 'rgba(246,235,180,0.08)',
  },
  tileText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
    color: color.mist,
  },
  tileTextActive: {
    color: color.moon,
  },
});
