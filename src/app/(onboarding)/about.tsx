import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button } from '../../ui';

const ageOptions = ['13-17', '18-24', '25-34', '35+'] as const;
const hourOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function AboutScreen() {
  const { ageBracket, distractionHoursPerDay, setValue } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'about' });
  }, []);

  return (
    <ScreenShell title="A little about you" progress={16} pose="write">
      <View style={styles.section}>
        <Text style={styles.label}>Your age</Text>
        <View style={styles.segmented}>
          {ageOptions.map((option) => {
            const active = ageBracket === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  setValue('ageBracket', option);
                  logOnboardingEvent('onboarding_answer', { step: 'about_age', value: option });
                }}
                style={[styles.segmentOption, active && styles.segmentOptionActive]}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Hours lost to distraction a day?</Text>
        <View style={styles.sliderTrack}>
          {hourOptions.map((hour) => {
            const active = distractionHoursPerDay === hour;
            return (
              <Pressable
                key={hour}
                onPress={() => {
                  setValue('distractionHoursPerDay', hour);
                  logOnboardingEvent('onboarding_answer', { step: 'about_hours', value: hour });
                }}
                style={[styles.sliderDot, active && styles.sliderDotActive]}
              />
            );
          })}
        </View>
        <View style={styles.sliderReadout}>
          <Text style={styles.muted}>0</Text>
          <Text style={styles.valueText}>about {distractionHoursPerDay} hrs</Text>
          <Text style={styles.muted}>8+</Text>
        </View>
      </View>

      <Button label="Continue" variant="moon" onPress={() => router.push('/(onboarding)/cost')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    marginBottom: 12,
  },
  label: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
    color: color.text,
    marginBottom: 12,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentOption: {
    flexBasis: '48%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.line,
    backgroundColor: color.den,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOptionActive: {
    borderColor: color.moon,
    backgroundColor: 'rgba(246,235,180,0.08)',
  },
  segmentText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
    color: color.mist,
  },
  segmentTextActive: {
    color: color.moon,
  },
  sliderTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    marginTop: 10,
  },
  sliderDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: color.line,
    borderWidth: 2,
    borderColor: color.night,
  },
  sliderDotActive: {
    backgroundColor: color.moon,
    borderColor: color.moon,
  },
  sliderReadout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  muted: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    color: color.mist,
  },
  valueText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.md,
    color: color.coral,
  },
});
