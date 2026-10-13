import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { OptionRow } from '../../ui';

const options = [
  { value: 'daily', label: 'Daily' },
  { value: 'few_week', label: 'A few times a week' },
  { value: 'occasional', label: 'Occasionally' },
  { value: 'rare', label: 'Rarely' },
] as const;

export default function FrequencyScreen() {
  const { delayFrequency, setValue } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'frequency' });
  }, []);

  const handleSelect = (value: (typeof options)[number]['value']) => {
    setValue('delayFrequency', value);
    logOnboardingEvent('onboarding_answer', { step: 'frequency', value });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => router.push('/(onboarding)/method'), 250);
  };

  return (
    <ScreenShell title="How often do you delay?" progress={42} pose="write">
      {options.map((option) => (
        <OptionRow key={option.value} label={option.label} selected={delayFrequency === option.value} onPress={() => handleSelect(option.value)} />
      ))}
    </ScreenShell>
  );
}

