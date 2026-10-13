import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusStore } from '../../stores/focus';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip, Moon, ProgressRing } from '../../ui';

export default function FocusScreen() {
  const insets = useSafeAreaInsets();
  const startSession = useFocusStore((state) => state.startSession);
  const { dailyGoalMinutes } = useOnboardingStore();
  
  const defaultMinutes = dailyGoalMinutes || 15;
  const [selectedDuration, setSelectedDuration] = useState(defaultMinutes);

  const handleStart = () => {
    startSession('Starter focus', selectedDuration);
    router.push('/focus/session');
  };

  const handleDifferentBlock = () => {
    const nextDuration = selectedDuration === 15 ? 30 : selectedDuration === 30 ? 60 : 15;
    setSelectedDuration(nextDuration);
    Alert.alert('Block Updated', `Switched target focus duration to ${nextDuration} minutes.`);
  };

  const progressValue = selectedDuration / 60;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>Focus</Text>
      <Text style={styles.title}>This block adds {selectedDuration} minutes</Text>

      <Card style={styles.previewCard}>
        <View style={styles.previewRow}>
          <ProgressRing size={180} progress={progressValue}>
            <Moon size={92} fill={progressValue} />
          </ProgressRing>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Starter focus</Text>
            <Text style={styles.summaryMeta}>Today • 9:00 AM</Text>
            <Chip label="Strict mode" active />
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          label={`Start ${selectedDuration} min`}
          variant="moon"
          onPress={handleStart}
        />
        <Button
          label="Switch duration preset"
          variant="secondary"
          onPress={handleDifferentBlock}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.night,
  },
  contentContainer: {
    paddingHorizontal: 20,
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