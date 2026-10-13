import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatMessage, companionService } from "../../services/companion";
import { useFocusStore } from "../../stores/focus";
import { useOnboardingStore } from "../../stores/onboarding";
import { color, fontFamily, typography } from "../../theme";
import { Button, Card, Chip, Moon } from "../../ui";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { recentSessions, customBlocks } = useFocusStore();
  const { name, bestTime, obstacle } = useOnboardingStore();

  const [activeFilter, setActiveFilter] = useState("This week");
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState({
    body: "Analyzing your focus patterns...",
    reply: "Ready to optimize your schedule?",
    action: "Start block",
  });

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "epi",
      text: `Hi ${name || "there"}! I'm Epi. Ask me anything about your focus progress!`,
    },
  ]);

  const sessions = useMemo(
    () =>
      recentSessions.map((session) => ({
        startedAt: session.startedAt,
        focusedSec: session.focusedSec,
      })),
    [recentSessions],
  );

  // Compute ACTUAL real-time weekly focus minutes per day
  const actualStats = useMemo(
    () => companionService.getActualWeeklyStats(sessions),
    [sessions],
  );

  // Current day index (Mon = 0 ... Sun = 6)
  const todayIndex = (new Date().getDay() + 6) % 7;

  // Build real graph bars matching actual calendar days
  const bars = useMemo(() => {
    const maxMinutes = Math.max(1, ...actualStats.minutesPerDay);
    return actualStats.minutesPerDay.map((mins, idx) => ({
      label: DAY_NAMES[idx],
      minutes: mins,
      heightPercent: Math.max((mins / maxMinutes) * 100, mins > 0 ? 18 : 8),
      isToday: idx === todayIndex,
    }));
  }, [actualStats.minutesPerDay, todayIndex]);

  // Fetch AI Insights from Gemini
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    companionService
      .analyzeWithGemini(
        activeFilter,
        sessions,
        {
          name,
          bestTime,
          obstacle,
          customBlocksCount: customBlocks.length,
        },
        customBlocks,
      ) // <-- pass customBlocks here
      .then((res) => {
        if (isMounted) {
          setAiAnalysis(res);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilter, sessions, name, bestTime, obstacle, customBlocks]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage.trim(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsSending(true);

    const epiReplyText = await companionService.chatWithEpi(
      userMsg.text,
      chatHistory,
      sessions,
      customBlocks,
      { name, bestTime, obstacle },
    );

    setChatHistory((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: "epi",
        text: epiReplyText,
      },
    ]);
    setIsSending(false);
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
          <Text style={styles.kicker}>Insights</Text>
          <Text style={styles.title}>Your coach</Text>
        </View>
        <TouchableOpacity
          style={styles.chatFab}
          onPress={() => setIsChatOpen(true)}
        >
          <Text style={styles.chatFabText}>💬 Chat Epi</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      <View style={styles.chipRow}>
        {["This week", "Why I stall", "Plan Monday"].map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            onPress={() => setActiveFilter(option)}
          >
            <Chip
              label={option}
              active={activeFilter === option}
              trailing={
                option === "This week" ? (
                  <Text style={styles.miniPill}>{actualStats.totalMin}m</Text>
                ) : undefined
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Gemini AI Coach Card */}
      <Card style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Epi says</Text>
          {isLoading && <ActivityIndicator size="small" color={color.moon} />}
        </View>
        <Text style={styles.cardText}>{aiAnalysis.body}</Text>
        <View style={styles.actionGroup}>
          <Button
            label={aiAnalysis.action}
            fullWidth={false}
            variant="moon"
            onPress={() => setIsChatOpen(true)}
          />
        </View>
      </Card>

      {/* Dialogue Dialogue */}
      <Card style={styles.chatCard}>
        <View style={styles.bubbleEpi}>
          <Text style={styles.bubbleText}>{aiAnalysis.reply}</Text>
        </View>
        <View style={styles.bubbleUser}>
          <Text style={styles.bubbleTextUser}>
            I&apos;m protecting my best window around {bestTime || "morning"}.
          </Text>
        </View>
      </Card>

      {/* REAL WEEKLY GRAPH BASED ON ACTUAL COMPLETED SESSIONS */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeaderRow}>
          <Text style={styles.sectionLabel}>Actual Week Progress</Text>
          <Text style={styles.totalStatText}>
            {actualStats.totalMin} total min
          </Text>
        </View>

        <View style={styles.chartRow}>
          {bars.map((bar) => (
            <View key={bar.label} style={styles.barGroup}>
              <Text style={styles.barValText}>
                {bar.minutes > 0 ? `${bar.minutes}m` : ""}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${bar.heightPercent}%`,
                      backgroundColor: bar.isToday
                        ? color.moon
                        : bar.minutes > 0
                          ? color.violet
                          : color.den,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.barLabel, bar.isToday && styles.barLabelToday]}
              >
                {bar.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.cardTextSmall}>
          {name ? `${name},` : "You"} logged {actualStats.totalMin} focus
          minutes this week across {sessions.length} sessions.
        </Text>
      </Card>

      {/* Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isChatOpen}
        onRequestClose={() => setIsChatOpen(false)}
      >
        <View style={styles.chatModalOverlay}>
          <View
            style={[
              styles.chatModalContent,
              {
                paddingTop: insets.top + 10,
                paddingBottom: insets.bottom + 10,
              },
            ]}
          >
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderTitleRow}>
                <Moon size={28} fill={1} />
                <Text style={styles.chatHeaderTitle}>Chat with Epi</Text>
              </View>
              <TouchableOpacity onPress={() => setIsChatOpen(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.chatMessagesContainer}
              showsVerticalScrollIndicator={false}
            >
              {chatHistory.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.sender === "user"
                      ? styles.userBubble
                      : styles.epiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.chatText,
                      msg.sender === "user" ? styles.userText : styles.epiText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              ))}
              {isSending && (
                <View style={[styles.chatBubble, styles.epiBubble]}>
                  <ActivityIndicator size="small" color={color.moon} />
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask Epi about your progress..."
                placeholderTextColor={color.mist}
                value={inputMessage}
                onChangeText={setInputMessage}
                onSubmitEditing={handleSendMessage}
              />
              <Button
                label="Send"
                variant="moon"
                fullWidth={false}
                onPress={handleSendMessage}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.night },
  contentContainer: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  chatFab: {
    backgroundColor: color.den,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.moon,
  },
  chatFabText: {
    color: color.moon,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.sm,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  miniPill: {
    color: color.text,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.xs,
  },
  card: { padding: 18, marginBottom: 16 },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatCard: { padding: 16, marginBottom: 16 },
  chartCard: { padding: 18, marginBottom: 20 },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalStatText: {
    color: color.moon,
    fontFamily: fontFamily.bodyBold,
    fontSize: typography.sm,
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
    marginTop: 14,
  },
  actionGroup: { marginTop: 12, alignItems: "flex-start" },
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
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 130,
  },
  barGroup: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  barValText: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: 10,
    marginBottom: 4,
  },
  barTrack: {
    width: 18,
    height: 90,
    borderRadius: 10,
    backgroundColor: color.den,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: "100%", borderRadius: 10, minHeight: 8 },
  barLabel: {
    color: color.mist,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.xs,
    marginTop: 8,
  },
  barLabelToday: { color: color.moon, fontFamily: fontFamily.bodyBold },
  chatModalOverlay: { flex: 1, backgroundColor: color.night },
  chatModalContent: { flex: 1, paddingHorizontal: 18 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: color.line,
  },
  chatHeaderTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  chatHeaderTitle: {
    color: color.text,
    fontFamily: fontFamily.heading,
    fontSize: typography.lg,
  },
  closeBtn: { color: color.mist, fontSize: typography.xl, padding: 6 },
  chatMessagesContainer: { flex: 1, marginVertical: 12 },
  chatBubble: {
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "82%",
  },
  epiBubble: {
    backgroundColor: color.den,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: color.line,
  },
  userBubble: { backgroundColor: color.moon, alignSelf: "flex-end" },
  chatText: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
    lineHeight: 20,
  },
  epiText: { color: color.text },
  userText: { color: color.night, fontFamily: fontFamily.bodyBold },
  chatInputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingTop: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: color.den,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: color.text,
    fontFamily: fontFamily.bodyRegular,
    fontSize: typography.md,
  },
});
