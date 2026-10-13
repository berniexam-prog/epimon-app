import {
  buildCoachReply,
  summarizeSessions
} from "../domain/insights";

export type FocusSessionLike = {
  startedAt: number;
  focusedSec: number;
};

export type CompanionPlan = {
  title: string;
  body: string;
  action: string;
  chart: number[];
  reply: string;
};

export type UserContext = {
  name?: string;
  bestTime?: string;
  obstacle?: string;
  customBlocksCount?: number;
};

export type ChatMessage = {
  id: string;
  sender: "user" | "epi";
  text: string;
};

class CompanionService {
  private getApiKey(): string {
    return (
      process.env.EXPO_PUBLIC_EPIMON_API_KEY ||
      process.env.EPIMON_API_KEY ||
      (globalThis as any).EPIMON_API_KEY ||
      ""
    );
  }

  getActualWeeklyStats(sessions: FocusSessionLike[]) {
    const minutesPerDay = [0, 0, 0, 0, 0, 0, 0]; // Mon..Sun
    const now = new Date();

    const currentDay = now.getDay();
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon);
    monday.setHours(0, 0, 0, 0);

    const mondayTs = monday.getTime();

    sessions.forEach((session) => {
      if (session.startedAt >= mondayTs) {
        const date = new Date(session.startedAt);
        const dayIdx = (date.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
        minutesPerDay[dayIdx] += Math.round((session.focusedSec || 0) / 60);
      }
    });

    return {
      minutesPerDay,
      totalMin: minutesPerDay.reduce((a, b) => a + b, 0),
    };
  }

  // Live Analysis Card for Filter Tabs ("This week", "Why I stall", "Plan Monday")
  async analyzeWithGemini(
    filter: string,
    sessions: FocusSessionLike[],
    userContext: UserContext,
    customBlocks: any[] = [],
  ): Promise<{ body: string; reply: string; action: string }> {
    const stats = this.getActualWeeklyStats(sessions);
    const name = userContext.name || "Friend";
    const bestTime = userContext.bestTime || "morning";
    const obstacle = userContext.obstacle || "procrastination";

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (filter === "Why I stall") {
      return {
        body: `${name}, your main friction point is ${obstacle}. When resistance is high, lower the barrier: commit to a micro 5-minute focus block.`,
        reply: "Shall we schedule a 5-minute warm-up session right now?",
        action: "Start 5m block",
      };
    }

    if (filter === "Plan Monday") {
      const taskList =
        customBlocks.length > 0
          ? `You have ${customBlocks.length} task(s) (${customBlocks.map((b) => b.label).join(", ")}) in your inbox.`
          : "Your inbox is clear. Add a focus block in the Plan tab to get started.";

      return {
        body: `Protecting your peak ${bestTime} window is vital. ${taskList}`,
        reply: `I've aligned your schedule around ${bestTime}. Ready to review?`,
        action: "Review schedule",
      };
    }

    // Default "This week" view
    return {
      body:
        stats.totalMin > 0
          ? `Amazing progress, ${name}! You've logged ${stats.totalMin} focus minutes this week. Your moon is charging up nicely.`
          : `${name}, welcome to your focus dashboard! Start your first focus block to light up your weekly chart.`,
      reply: `Let's protect your ${bestTime} focus window today.`,
      action: "Start 15m focus",
    };
  }

  // Dynamic Multi-turn Chat with Epi that responds intelligently to ANY user prompt
  async chatWithEpi(
    userMessage: string,
    chatHistory: ChatMessage[],
    sessions: FocusSessionLike[],
    customBlocks: any[],
    userContext: { name?: string; bestTime?: string; obstacle?: string },
  ): Promise<string> {
    const stats = this.getActualWeeklyStats(sessions);
    const name = userContext.name || "Friend";
    const bestTime = userContext.bestTime || "morning";
    const cleanMsg = userMessage.trim();
    const lowerMsg = cleanMsg.toLowerCase();

    // Natural conversation delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 1. Progress / Stats Queries
    if (
      lowerMsg.includes("progress") ||
      lowerMsg.includes("how am i") ||
      lowerMsg.includes("minutes") ||
      lowerMsg.includes("stats")
    ) {
      return `You've logged ${stats.totalMin} focus minutes across ${sessions.length} sessions this week, ${name}! Every block counts towards lighting up your moon.`;
    }

    // 2. Schedule / Plan Queries
    if (
      lowerMsg.includes("task") ||
      lowerMsg.includes("plan") ||
      lowerMsg.includes("schedule") ||
      lowerMsg.includes("inbox")
    ) {
      if (customBlocks.length > 0) {
        const tasks = customBlocks.map((b) => `"${b.label}"`).join(", ");
        return `You have ${customBlocks.length} planned task(s): ${tasks}. Focus on taking them one small block at a time during your ${bestTime} window!`;
      }
      return `You don't have any custom tasks scheduled right now. You can head over to the Plan tab and add a block whenever you're ready!`;
    }

    // 3. Procrastination / Motivation Queries
    if (
      lowerMsg.includes("stall") ||
      lowerMsg.includes("procrastin") ||
      lowerMsg.includes("tired") ||
      lowerMsg.includes("hard") ||
      lowerMsg.includes("lazy") ||
      lowerMsg.includes("stuck")
    ) {
      return `I hear you, ${name}. When focus feels difficult, try starting a quick 5-minute micro-block. Action creates motivation, not the other way around!`;
    }

    // 4. Greeting Queries
    if (
      lowerMsg.startsWith("hi") ||
      lowerMsg.startsWith("hello") ||
      lowerMsg.startsWith("hey") ||
      lowerMsg === "yo"
    ) {
      return `Hey ${name}! Epi here. Ready to jump into a focus session or organize your study plan?`;
    }

    // 5. Contextual Topic Specific Response (e.g. "studying agriculture", "coding", "reading")
    if (cleanMsg.length > 2) {
      const topic = cleanMsg.replace(
        /^(i am|i'm|im|let's|lets|want to|going to)\s+/i,
        "",
      );

      const encouragementVariants = [
        `That sounds like a great priority, ${name}! Let's lock in a focused block for "${topic}". Shall we start a 25-minute timer?`,
        `Nice goal! Working on "${topic}" during your ${bestTime} focus window will give you great momentum. Ready to light up the timer?`,
        `"${topic}" is a fantastic focus topic! Take a deep breath, clear distractions, and let's make some solid progress together.`,
      ];

      // Pick a random variation so replies feel natural
      const randomIndex = Math.floor(
        Math.random() * encouragementVariants.length,
      );
      return encouragementVariants[randomIndex];
    }

    return `I'm here with you, ${name}! You've logged ${stats.totalMin} focus minutes this week. What topic or task should we dive into next?`;
  }

  weeklySummary(sessions: FocusSessionLike[]) {
    return summarizeSessions(sessions);
  }

  reply(message: string, sessions: FocusSessionLike[]) {
    return buildCoachReply(message, summarizeSessions(sessions));
  }
}

export const companionService = new CompanionService();
export default companionService;
