import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { companionService } from '../../services/companion';
import { useFocusStore } from '../../stores/focus';
import { useOnboardingStore } from '../../stores/onboarding';
import { color, fontFamily, typography } from '../../theme';
import { Button, Card, Chip } from '../../ui';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { recentSessions } = useFocusStore();
  const { name, bestTime, obstacle } = useOnboardingStore();
  
  const [activeFilter, setActiveFilter] = useState('This week');

  const sessions = useMemo(
    () =>
      recentSessions.map((session) => ({
        startedAt: session.startedAt,
        focusedSec: session.focusedSec,
      })),
    [recentSessions]
  );

  const plan = useMemo(() => companionService.buildPlan(sessions), [sessions]);
  const summary = useMemo(() => companionService.weeklySummary(sessions), [sessions]);

  const bars = useMemo(() => {
    const maxValue = Math.max(1, ...summary.minutesPerDay);
    return summary.minutesPerDay.map((value, index) => ({
      label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index],
      value,
      height: Math.max((value / maxValue) * 100, value > 0 ? 16 : 8),
    }));
  }, [summary.minutesPerDay]);

  const [coachMessage, setCoachMessage] = useState(plan.reply);

  // Dynamic filter handler for production readiness
  const handleFilterSelect = (option: string) => {
    setActiveFilter(option);
    if (option === 'Why I stall') {
      setCoachMessage(`Epi notes: Your main obstacle is ${obstacle || 'procrastination'}. Let's shrink your first block down to 5 minutes to bypass resistance.`);
    } else if (option === 'Plan Monday') {
      setCoachMessage(`Epi notes: Monday is locked in for your ${bestTime || 'morning'} window. Keep your phone out of reach.`);
    } else {
      setCoachMessage(plan.reply);
    }
  };

  const updateCoachFromAction = (action: string) => {
    const nextMessage = companionService.reply(action, sessions);
    setCoachMessage(nextMessage);
  };

  const totalWeeklyMinutes = summary.minutesPerDay.reduce((sum, item) => sum + item, 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>Insights</Text>
      <Text style={styles.title}>Your coach</Text>

      <View style={styles.chipRow}>
        {['This week', 'Why I stall', 'Plan Monday'].map((option) => (
          <TouchableOpacity key={option} activeOpacity={0.8} onPress={() => handleFilterSelect(option)}>
            <Chip
              label={option}
              active={activeFilter === option}
              trailing={
                option === 'This week' ? (
                  <Text style={styles.miniPill}>{totalWeeklyMinutes}m</Text>
                ) : undefined
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Epi says</Text>
        <Text style={styles.cardText}>
          {activeFilter === 'Why I stall'
            ? 'Action is the cure to anxiety. When you delay, your brain magnifies the task.'
            : activeFilter === 'Plan Monday'
            ? 'Your week is structured around micro-wins. Consistency beats intensity every single time.'
            : plan.body}
        </Text>
        <View style={styles.actionGroup}>
          <Button
            label={plan.action}
            fullWidth={false}
            variant="moon"
            style={styles.actionButton}
            onPress={() => updateCoachFromAction(plan.action)}
          />
        </View>
      </Card>

      <Card style={styles.chatCard}>
        <View style={styles.bubbleEpi}>
          <Text style={styles.bubbleText}>{coachMessage}</Text>
        </View>
        <View style={styles.bubbleUser}>
          <Text style={styles.bubbleTextUser}>
            I&apos;m trying to protect my best window around {bestTime || 'morning'}.
          </Text>
        </View>
      </Card>

      <Card style={styles.chartCard}>
        <Text style={styles.sectionLabel}>This week</Text>
        <View style={styles.chartRow}>
          {bars.map((bar, index) => (
            <View key={`${bar.label}-${index}`} style={styles.barGroup}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${bar.height}%`,
                      backgroundColor:
                        bar.value >= Math.max(...summary.minutesPerDay) * 0.7 && bar.value > 0
                          ? color.moon
                          : color.violet,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{bar.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.cardTextSmall}>
          {name ? `${name},` : 'You'} are strongest around {summary.bestFocusWindow}. Keep the first block at that time.
        </Text>
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  miniPill: {
    color: color.text,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.xs,
  },
  card: {
    padding: 18,
    marginBottom: 16,
  },
  chatCard: {
    padding: 16,
    marginBottom: 16,
  },
  chartCard: {
    padding: 16,
  },
  cardTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
    marginBottom: 8,
  },
  cardText: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    lineHeight: 24,
  },
  cardTextSmall: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.sm,
    lineHeight: 20,
    marginTop: 12,
  },
  actionGroup: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  actionButton: {
    maxWidth: 220,
  },
  bubbleEpi: {
    backgroundColor: color.dusk,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: color.line,
  },
  bubbleUser: {
    backgroundColor: color.violet,
    borderRadius: 18,
    padding: 14,
    marginLeft: 32,
  },
  bubbleText: {
    color: color.text,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: color.night,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    lineHeight: 22,
  },
  sectionLabel: {
    color: color.text,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.md,
    marginBottom: 12,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 128,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 18,
    height: 90,
    borderRadius: 10,
    backgroundColor: color.den,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 10,
    minHeight: 8,
  },
  barLabel: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.xs,
    marginTop: 8,
  },
});