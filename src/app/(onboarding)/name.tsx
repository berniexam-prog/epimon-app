import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button } from '../../ui';

export default function NameScreen() {
  const { name, setValue } = useOnboardingStore();
  const [value, setLocalValue] = useState(name);

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'name' });
  }, []);

  const continueEnabled = value.trim().length > 0;

  return (
    <ScreenShell title="What should Epi call you?" progress={8} pose="write">
      <View style={styles.fieldWrap}>
        <TextInput
          accessibilityLabel="Name input"
          placeholder="Your name"
          value={value}
          maxLength={24}
          onChangeText={(next) => {
            const trimmed = next.slice(0, 24);
            setLocalValue(trimmed);
            setValue('name', trimmed);
            logOnboardingEvent('onboarding_answer', { step: 'name', value: trimmed.length > 0 ? 'filled' : 'empty' });
          }}
          style={styles.input}
          placeholderTextColor={color.mist}
          autoFocus
        />
      </View>

      <Button
        label="Continue"
        variant="moon"
        disabled={!continueEnabled}
        onPress={() => router.push('/(onboarding)/about')}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    marginTop: 18,
    marginBottom: 24,
  },
  input: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: color.moon,
    backgroundColor: color.den,
    color: color.text,
    paddingHorizontal: 18,
    fontFamily: fontFamily.heading,
    fontSize: typography.xl,
    textAlign: 'center',
  },
});
