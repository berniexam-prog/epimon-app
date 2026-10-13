import { router } from "expo-router";
import { useState } from "react";
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

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { name, dailyGoalMinutes } = useOnboardingStore();
  const { startSession, customBlocks, removeCustomBlock } = useFocusStore();

  const [selectedDay, setSelectedDay] = useState(3); // Thursday default

  const greeting = name ? `Good morning, ${name}` : "Good morning";
  const targetMinutes = dailyGoalMinutes || 15;
  const moonFill = 0.0;

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
        <View>
          <Text style={styles.kicker}>Home</Text>
          <Text style={styles.title}>{greeting}</Text>
        </View>
        <Chip label="Day 1" active />
      </View>

      <Card style={styles.heroCard}>
        <View style={styles.moonRow}>
          <Moon size={104} fill={moonFill} />
          <View style={styles.moonMeta}>
            <Text style={styles.moonLabel}>
              Moon is {Math.round(moonFill * 100)}% lit
            </Text>
            <Text style={styles.moonHint}>
              {targetMinutes} minutes planned for today
            </Text>
            <ProgressBar value={moonFill} />
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>This week</Text>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, index) => {
          const isSelected = selectedDay === index;
          return (
            <TouchableOpacity
              key={day}
              activeOpacity={0.8}
              onPress={() => setSelectedDay(index)}
              style={[styles.dayCell, isSelected && styles.dayCellActive]}
            >
              <Moon size={28} fill={isSelected ? 0.3 : 0.05} />
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
          9:00 AM • {targetMinutes} min • Today
        </Text>
        <Button
          label="Start first block"
          variant="moon"
          fullWidth={false}
          style={styles.startButton}
          onPress={handleStartSession}
        />
      </Card>

      {/* Synchronized Custom Inbox Tasks from Plan Section */}
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
    marginBottom: 18,
  },
  kicker: {
    color: color.mist,
    fontFamily: fontFamily.bodyMedium,
    fontSize: typography.sm,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.xxl,
    marginTop: 4,
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
