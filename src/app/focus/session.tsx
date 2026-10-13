import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { getElapsedFocusMs, useFocusStore } from '../../stores/focus';
import { color, fontFamily, typography } from '../../theme';
import { Button, Moon, ProgressRing } from '../../ui';

export default function FocusSessionScreen() {
  const activeSession = useFocusStore((state) => state.activeSession);
  const pauseSession = useFocusStore((state) => state.pauseSession);
  const resumeSession = useFocusStore((state) => state.resumeSession);
  const endSession = useFocusStore((state) => state.endSession);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentNow = now ?? 0;
  const elapsedMs = useMemo(
    () => (activeSession ? getElapsedFocusMs(activeSession, currentNow) : 0),
    [activeSession, currentNow]
  );
  const totalMs = (activeSession?.plannedMin ?? 25) * 60 * 1000;
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const remainingSec = Math.ceil(remainingMs / 1000);
  const progress = Math.min(1, elapsedMs / totalMs);

  useEffect(() => {
    if (!activeSession) return;
    if (remainingSec <= 0) {
      endSession('completed');
      router.replace('/focus/complete');
    }
  }, [activeSession, endSession, remainingSec]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        pauseSession();
        return;
      }

      if (nextState === 'active') {
        const resumed = resumeSession();
        if (!resumed) {
          router.replace('/focus/complete');
        }
      }
    });

    return () => listener.remove();
  }, [pauseSession, resumeSession]);

  if (!activeSession) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>No active session</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Focus</Text>
      <Text style={styles.title}>{activeSession.title}</Text>

      <View style={styles.ringWrap}>
        <ProgressRing size={240} progress={progress}>
          <Moon size={120} fill={progress} />
        </ProgressRing>
      </View>

      <Text style={styles.time}>{Math.max(0, remainingSec)}s</Text>
      <Text style={styles.helper}>{activeSession.leftAt ? 'Clouds are covering the moon.' : 'Moon charging • stay in the foreground.'}</Text>

      <View style={styles.actions}>
        <Button
          label={activeSession.leftAt ? 'Resume' : 'Pause'}
          variant="secondary"
          onPress={() => {
            if (activeSession.leftAt) {
              const resumed = resumeSession();
              if (!resumed) {
                router.replace('/focus/complete');
              }
              return;
            }
            pauseSession();
          }}
        />
        <Button
          label="End early"
          variant="ghost"
          onPress={() => {
            endSession('ended_early');
            router.replace('/focus/complete');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.night,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },
  ringWrap: {
    marginBottom: 18,
  },
  time: {
    color: color.moon,
    fontFamily: fontFamily.heading,
    fontSize: typography.display,
    lineHeight: 64,
  },
  helper: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    marginTop: 20,
    gap: 12,
  },
});
