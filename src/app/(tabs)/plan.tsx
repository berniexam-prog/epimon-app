import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip, Timeline } from '../../ui';

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const { dailyGoalMinutes } = useOnboardingStore();
  const targetMinutes = dailyGoalMinutes || 15;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Plan</Text>
        <Chip label="Week" active />
      </View>

      <View style={styles.dateRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <View
            key={day}
            style={[styles.dateCell, index === 0 && styles.dateCellActive]}
          >
            <Text style={[styles.dateDay, index === 0 && styles.dateDayActive]}>
              {day}
            </Text>
            <Text
              style={[styles.dateNumber, index === 0 && styles.dateNumberActive]}
            >
              {index + 1}
            </Text>
          </View>
        ))}
      </View>

      <Card style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Today</Text>
        <Timeline
          blocks={[
            {
              id: 'a',
              label: 'Pick one thing',
              start: 9,
              duration: 10,
              kind: 'plan',
              timeLabel: '9:00',
            },
            {
              id: 'b',
              label: 'Starter focus',
              start: 9,
              duration: targetMinutes,
              kind: 'focus',
              glow: targetMinutes,
              timeLabel: '9:10',
            },
            {
              id: 'c',
              label: 'Walk with Epi',
              start: 9,
              duration: 10,
              kind: 'rest',
              timeLabel: `9:${10 + targetMinutes}`,
            },
          ]}
        />
      </Card>

      <View style={styles.footerRow}>
        <Button label="Inbox" variant="secondary" fullWidth={false} />
        <Button label="Plan with Epi" variant="moon" fullWidth={false} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  dateCell: {
    width: 42,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: color.den,
  },
  dateCellActive: {
    backgroundColor: 'rgba(246,235,180,0.08)',
    borderWidth: 1,
    borderColor: color.moon,
  },
  dateDay: {
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.xs,
  },
  dateDayActive: {
    color: color.moon,
  },
  dateNumber: {
    color: color.text,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.sm,
    marginTop: 6,
  },
  dateNumberActive: {
    color: color.moon,
  },
  timelineCard: {
    padding: 18,
    marginBottom: 18,
  },
  timelineTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
});