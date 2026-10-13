import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { color, fontFamily, typography } from '../../theme';
import { Button } from '../../ui';

export default function WelcomeScreen() {
  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'welcome' });
  }, []);

  return (
    <ScreenShell title="Meet Epi." subtitle="Your focus coach. Light a moon every day and build a streak that lasts." progress={8} pose="wave">
      <View style={styles.body}>
        <Text style={styles.caption}>Takes about 60 seconds</Text>
        <Button label="Build my plan" variant="moon" onPress={() => router.push('/(onboarding)/name')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  caption: {
    textAlign: 'center',
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    color: color.mist,
    marginTop: 8,
  },
});
