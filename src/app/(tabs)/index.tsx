import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip, Moon, ProgressBar } from '../../ui';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { name, dailyGoalMinutes } = useOnboardingStore();

  const greeting = name ? `Good morning, ${name}` : 'Good morning';
  const moonFill = 0.72;
  const minutesLeft = Math.round((1 - moonFill) * (dailyGoalMinutes || 15));

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
        <View>
          <Text style={styles.kicker}>Home</Text>
          <Text style={styles.title}>{greeting}</Text>
        </View>
        <Chip label="12 day streak" active />
      </View>

      <Card style={styles.heroCard}>
        <View style={styles.moonRow}>
          <Moon size={104} fill={moonFill} />
          <View style={styles.moonMeta}>
            <Text style={styles.moonLabel}>
              Moon is {Math.round(moonFill * 100)}% lit
            </Text>
            <Text style={styles.moonHint}>
              {minutesLeft} of {dailyGoalMinutes || 15} minutes left for today
            </Text>
            <ProgressBar value={moonFill} />
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>This week</Text>
      <View style={styles.weekRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <View
            key={day}
            style={[styles.dayCell, index === 3 && styles.dayCellActive]}
          >
            <Moon size={28} fill={index === 3 ? 1 : index < 3 ? 0.5 : 0.15} />
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Next up</Text>
      <Card style={styles.planCard}>
        <Text style={styles.planTitle}>Starter focus</Text>
        <Text style={styles.planMeta}>9:00 • {dailyGoalMinutes || 15} min • Today</Text>
        <Button
          label="Start"
          variant="moon"
          fullWidth={false}
          style={styles.startButton}
        />
      </Card>
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
    marginTop: 4,
  },
  heroCard: {
    padding: 20,
    marginBottom: 18,
  },
  moonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  moonMeta: {
    flex: 1,
    gap: 10,
  },
  moonLabel: {
    color: color.text,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.lg,
  },
  moonHint: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
  },
  sectionTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCell: {
    width: 42,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: color.den,
  },
  dayCellActive: {
    backgroundColor: 'rgba(246,235,180,0.1)',
    borderWidth: 1,
    borderColor: color.moon,
  },
  dayLabel: {
    marginTop: 6,
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.xs,
  },
  planCard: {
    padding: 18,
  },
  planTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    marginBottom: 6,
  },
  planMeta: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    marginBottom: 12,
  },
  startButton: {
    alignSelf: 'flex-start',
  },
});