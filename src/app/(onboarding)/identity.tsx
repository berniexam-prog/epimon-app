import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { OptionRow } from '../../ui';

const options = [
  { value: 'in_control', label: 'In control' },
  { value: 'consistent', label: 'Consistent' },
  { value: 'reliable', label: 'Reliable' },
  { value: 'calm', label: 'Calm' },
] as const;

export default function IdentityScreen() {
  const { identity, setValue } = useOnboardingStore();

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'identity' });
  }, []);

  const handleSelect = (value: (typeof options)[number]['value']) => {
    setValue('identity', value);
    logOnboardingEvent('onboarding_answer', { step: 'identity', value });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => router.push('/(onboarding)/besttime'), 250);
  };

  return (
    <ScreenShell title="Who do you want to be in 30 days?" progress={54} pose="write">
      {options.map((option) => (
        <OptionRow key={option.value} label={option.label} selected={identity === option.value} onPress={() => handleSelect(option.value)} />
      ))}
    </ScreenShell>
  );
}
