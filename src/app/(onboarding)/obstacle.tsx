import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { OptionRow } from '../../ui';

const options = [
  { value: 'procrastination', label: 'Putting things off' },
  { value: 'focus', label: 'Losing focus' },
  { value: 'burnout', label: 'Burnout' },
  { value: 'discipline', label: 'No discipline' },
] as const;

export default function ObstacleScreen() {
  const { obstacle, setValue } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'obstacle' });
  }, []);

  const handleSelect = (value: (typeof options)[number]['value']) => {
    setValue('obstacle', value);
    logOnboardingEvent('onboarding_answer', { step: 'obstacle', value });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => router.push('/(onboarding)/frequency'), 250);
  };

  return (
    <ScreenShell title="What gets in your way?" progress={30} pose="write">
      {options.map((option) => (
        <OptionRow
          key={option.value}
          label={option.label}
          selected={obstacle === option.value}
          onPress={() => handleSelect(option.value)}
        />
      ))}
    </ScreenShell>
  );
}
