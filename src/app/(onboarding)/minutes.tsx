import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Moon } from '../../ui';

const options = [
  { value: 5, label: '5 min', fill: 0.2 },
  { value: 15, label: '15 min', fill: 0.35 },
  { value: 30, label: '30 min', fill: 0.6 },
  { value: 60, label: '60+ min', fill: 1 },
] as const;

export default function MinutesScreen() {
  const { dailyGoalMinutes, setValue } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'minutes' });
  }, []);

  return (
    <ScreenShell title="How many minutes a day?" subtitle="This is the line for a full moon." progress={78} pose="write">
      <View style={styles.list}>
        {options.map((option) => {
          const active = dailyGoalMinutes === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                setValue('dailyGoalMinutes', option.value);
                logOnboardingEvent('onboarding_answer', { step: 'minutes', value: option.value });
                router.push('/(onboarding)/trajectory');
              }}
              style={[styles.option, active && styles.optionActive]}
            >
              <Moon size={32} fill={option.fill} />
              <View style={styles.optionTextWrap}>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
              </View>
              {option.value === 15 ? <Text style={styles.badge}>Recommended</Text> : null}
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.footer}>Small enough to do on a bad day.</Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 16,
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.den,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: color.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  optionActive: {
    borderColor: color.moon,
    backgroundColor: 'rgba(246,235,180,0.08)',
  },
  optionTextWrap: {
    flex: 1,
  },
  optionText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
    color: color.text,
  },
  optionTextActive: {
    color: color.moon,
  },
  badge: {
    backgroundColor: color.moon,
    color: color.night,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: fontFamily.bodyBold,
    fontSize: 10,
  },
  footer: {
    marginTop: 18,
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    fontStyle: 'italic',
  },
});
