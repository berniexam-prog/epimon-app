import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusStore } from '../../stores/focus';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip, Moon, ProgressRing } from '../../ui';

// Available focus duration presets in minutes
const DURATION_PRESETS = [15, 25, 45, 60];

export default function FocusScreen() {
  const startSession = useFocusStore((state) => state.startSession);
  const [presetIndex, setPresetIndex] = useState(1); // Default to index 1 (25 minutes)

  const currentMinutes = DURATION_PRESETS[presetIndex];
  const progressPreview = 0.35; // Visual fill ratio for the preview ring

  const handleStart = () => {
    startSession('Starter focus', currentMinutes);
    router.push('/focus/session');
  };

  const handleToggleBlock = () => {
    // Cycle to the next preset duration
    setPresetIndex((prev) => (prev + 1) % DURATION_PRESETS.length);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Focus</Text>
      <Text style={styles.title}>This block adds {currentMinutes} minutes</Text>

      <Card style={styles.previewCard}>
        <View style={styles.previewRow}>
          <ProgressRing size={180} progress={progressPreview}>
            <Moon size={92} fill={progressPreview} />
          </ProgressRing>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Starter focus</Text>
            <Text style={styles.summaryMeta}>Today • 9:00</Text>
            <Chip label={`${currentMinutes} min block`} active />
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button label={`Start ${currentMinutes} min`} variant="moon" onPress={handleStart} />
        <Button label="Use a different block" variant="secondary" onPress={handleToggleBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.night,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
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
    marginTop: 6,
    marginBottom: 18,
  },
  previewCard: {
    padding: 18,
    marginBottom: 18,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summary: {
    flex: 1,
    gap: 10,
  },
  summaryTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
  },
  summaryMeta: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
  },
  actions: {
    gap: 12,
  },
});