import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusStore } from "../../stores/focus";
import { useOnboardingStore } from "../../stores/onboarding";
import { color, fontFamily, typography } from "../../theme";
import { Button, Card, Chip, Moon, ProgressBar } from "../../ui";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { name, dailyGoalMinutes } = useOnboardingStore();
  const { startSession, customBlocks, removeCustomBlock, recentSessions } =
    useFocusStore();

  // Highlight today's exact current day of the week
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const greeting = name ? `Good morning, ${name}` : "Good morning";
  const targetMinutes = dailyGoalMinutes || 15;

  // Calculate dynamic current active day count (Day 1, Day 2, Day 3, ...)
  const activeDayCount = useMemo(() => {
    if (recentSessions.length === 0) return 1;

    // Extract unique calendar days from session timestamps
    const uniqueDays = new Set(
      recentSessions
        .filter((s) => s.endedAt)
        .map((s) => {
          const date = new Date(s.endedAt!);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }),
    );

    // If no sessions ended yet, default to Day 1
    return Math.max(1, uniqueDays.size + (uniqueDays.size === 0 ? 1 : 0));
  }, [recentSessions]);

  // Calculate actual total seconds focused today across all completed sessions
  const todayFocusedMinutes = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayTimestamp = startOfToday.getTime();

    const todaySec = recentSessions
      .filter((s) => s.endedAt && s.endedAt >= todayTimestamp)
      .reduce((sum, s) => sum + (s.focusedSec || 0), 0);

    return Math.round(todaySec / 60);
  }, [recentSessions]);

  // Calculate dynamic moon charge ratio (0.0 to 1.0)
  const moonFill = Math.min(
    1,
    Math.max(0, todayFocusedMinutes / targetMinutes),
  );
  const remainingMinutes = Math.max(0, targetMinutes - todayFocusedMinutes);

  const handleStartSession = () => {
    startSession("Starter focus", targetMinutes);
    router.push("/focus/session");
  };

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
        <Text style={styles.title}>{greeting}</Text>
        <Chip label={`Day ${activeDayCount}`} active />
      </View>

      <Card style={styles.heroCard}>
        <View style={styles.moonRow}>
          <Moon size={104} fill={moonFill} />
          <View style={styles.moonMeta}>
            <Text style={styles.moonLabel}>
              Moon is {Math.round(moonFill * 100)}% lit
            </Text>
            <Text style={styles.moonHint}>
              {remainingMinutes > 0
                ? `${remainingMinutes} of ${targetMinutes} minutes left for today`
                : "Daily focus goal accomplished!"}
            </Text>
            <ProgressBar value={moonFill} />
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>This week</Text>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, index) => {
          const isSelected = selectedDay === index;
          const isToday = todayIndex === index;
          return (
            <TouchableOpacity
              key={day}
              activeOpacity={0.8}
              onPress={() => setSelectedDay(index)}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellActive,
                isToday && !isSelected && styles.dayCellToday,
              ]}
            >
              <Moon
                size={28}
                fill={isSelected ? Math.max(0.2, moonFill) : 0.05}
              />
              <Text
                style={[styles.dayLabel, isSelected && styles.dayLabelActive]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Next up</Text>
      <Card style={styles.planCard}>
        <Text style={styles.planTitle}>Starter focus</Text>
        <Text style={styles.planMeta}>
          Next session • {targetMinutes} min • Today
        </Text>
        <Button
          label="Start focus block"
          variant="moon"
          fullWidth={false}
          style={styles.startButton}
          onPress={handleStartSession}
        />
      </Card>

      {/* Synchronized Custom Plan Tasks from Plan Section */}
      {customBlocks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Your Schedule Tasks</Text>
          {customBlocks.map((task) => (
            <Card key={task.id} style={styles.customTaskCard}>
              <View style={styles.taskHeaderRow}>
                <Text style={styles.taskTitle}>{task.label}</Text>
                <TouchableOpacity onPress={() => removeCustomBlock(task.id)}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.taskTime}>{task.timeLabel}</Text>
              <View style={styles.badgeRow}>
                <Chip
                  label={`Importance: ${task.importance}`}
                  active={task.importance === "High"}
                />
                <Chip label={`Effort: ${task.difficulty}`} />
              </View>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.night },
  contentContainer: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    gap: 16,
  },
  title: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
    flex: 1,
  },
  heroCard: { padding: 20, marginBottom: 18 },
  moonRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  moonMeta: { flex: 1, gap: 10 },
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
    marginTop: 6,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayCell: {
    width: 42,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: color.den,
  },
  dayCellActive: {
    backgroundColor: "rgba(246,235,180,0.1)",
    borderWidth: 1,
    borderColor: color.moon,
  },
  dayCellToday: { borderWidth: 1, borderColor: color.line },
  dayLabel: {
    marginTop: 6,
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.xs,
  },
  dayLabelActive: { color: color.moon, fontFamily: fontFamily.bodyBold },
  planCard: { padding: 18, marginBottom: 12 },
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
  startButton: { alignSelf: "flex-start" },
  customTaskCard: { padding: 16, marginBottom: 12 },
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  taskTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.md,
  },
  taskTime: {
    color: color.moon,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.xs,
    marginBottom: 10,
  },
  badgeRow: { flexDirection: "row", gap: 8 },
  removeText: {
    color: color.mist,
    fontSize: typography.md,
    paddingHorizontal: 4,
  },
});
