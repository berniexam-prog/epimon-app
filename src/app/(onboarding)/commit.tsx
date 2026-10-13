import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../../features/onboarding/shared';
import { logOnboardingEvent } from '../../lib/analytics';
import { NotificationService } from '../../services/notifications';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Moon, ProgressRing } from '../../ui';

export default function CommitScreen() {
  const { nudgeEnabled, nudgeTime, setValue, complete } = useOnboardingStore();
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    logOnboardingEvent('onboarding_step_viewed', { step: 'commit' });
  }, []);

  useEffect(() => {
    if (!isHolding || holdProgress >= 1) {
      return;
    }

    const timer = setTimeout(() => {
      const next = Math.min(holdProgress + 0.08, 1);
      setHoldProgress(next);
      if (next >= 1) {
        void (async () => {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          if (nudgeEnabled) {
            const granted = await NotificationService.requestPermission();
            if (granted) {
              await NotificationService.scheduleDailyNudge(nudgeTime || '09:00');
            }
          }

          complete();
          logOnboardingEvent('onboarding_completed', { completedAt: Date.now() });
          router.replace('/(onboarding)/trial');
        })();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [holdProgress, isHolding, complete, nudgeEnabled, nudgeTime]);

  const handleCancel = () => {
    setIsHolding(false);
    setHoldProgress(0);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenShell title="Make it a promise" progress={90} pose="cheer">
      <View style={styles.center}>
        <ProgressRing size={220} progress={holdProgress}>
          <Moon size={122} fill={holdProgress > 0 ? 1 : 0.2} />
        </ProgressRing>
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Daily nudge from Epi</Text>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: nudgeEnabled }}
          onPress={() => setValue('nudgeEnabled', !nudgeEnabled)}
          style={[styles.switch, nudgeEnabled && styles.switchOn]}
        >
          <View style={[styles.switchThumb, nudgeEnabled && styles.switchThumbOn]} />
        </Pressable>
      </View>

<Text style={styles.helperText}>Daily nudge at {nudgeTime || '09:00'}.</Text>

      <Pressable
        accessibilityRole="button"
        onPressIn={() => {
          setIsHolding(true);
          setHoldProgress(0.1);
        }}
        onPressOut={handleCancel}
        style={styles.holdButton}
      >
        <Text style={styles.holdText}>Hold to commit</Text>
      </Pressable>
      <Button label="Not now" variant="ghost" onPress={() => router.replace('/(onboarding)/trial')} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleLabel: {
    color: color.text,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.md,
  },
  helperText: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    marginBottom: 18,
  },
  switch: {
    width: 42,
    height: 24,
    borderRadius: 999,
    backgroundColor: color.line,
    padding: 2,
    justifyContent: 'center',
  },
  switchOn: {
    backgroundColor: color.violet,
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: color.text,
    alignSelf: 'flex-start',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  holdButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: color.moon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  holdText: {
    color: color.night,
    fontFamily: fontFamily.heading,
    fontSize: typography.md,
  },
});
