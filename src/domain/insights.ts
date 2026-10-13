export type DaySummary = {
  day: string;
  minutes: number;
};

export type CompanionSnapshot = {
  minutesPerDay: number[];
  bestFocusWindow: string;
  longestStreak: number;
  suggestedMove: string;
};

export function summarizeSessions(
  sessions: { startedAt: number; focusedSec: number }[]
): CompanionSnapshot {
  const totals = new Map<string, number>();
  let bestHour = 9;
  let bestHourCount = -1;
  const hourCounts = new Map<number, number>();

  for (const session of sessions) {
    const date = new Date(session.startedAt);
    const hour = date.getHours();
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);

    const key = date.toISOString().slice(0, 10);
    totals.set(key, (totals.get(key) ?? 0) + session.focusedSec / 60);
  }

  for (const [hour, count] of hourCounts.entries()) {
    if (count > bestHourCount) {
      bestHour = hour;
      bestHourCount = count;
    }
  }

  const minutesPerDay = new Array<number>(7).fill(0);

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });

  for (let index = 0; index < last7Days.length; index += 1) {
    const iso = last7Days[index];
    const dayMinutes = totals.get(iso) ?? 0;
    minutesPerDay[index] = Math.round(dayMinutes);
  }

  const bestFocusWindow = `${String(bestHour).padStart(2, '0')}:00`;
  const longestStreak = Math.max(1, Math.min(9, Math.round((minutesPerDay.reduce((sum, value) => sum + value, 0) / 60) / 3 || 1)));

  return {
    minutesPerDay,
    bestFocusWindow,
    longestStreak,
    suggestedMove: `Move deep work to ${bestFocusWindow}`,
  };
}

export function buildCoachReply(message: string, snapshot: CompanionSnapshot): string {
  const lower = message.toLowerCase();

  if (lower.includes('move') || lower.includes('time')) {
    return `Your best window is ${snapshot.bestFocusWindow}. Keep the hardest task in that slot and shrink the first block to 15 minutes.`;
  }

  if (lower.includes('stall') || lower.includes('delay')) {
    return 'The pattern is usually not a lack of effort. A shorter first block keeps momentum without dragging the whole day behind.';
  }

  return `This week is trending well. Your strongest focus window is ${snapshot.bestFocusWindow}, and your best recovery move is to keep the next block small and real.`;
}

export function buildHomeTip(snapshot: CompanionSnapshot): { title: string; body: string; action: string } {
  if (snapshot.minutesPerDay.every((value) => value === 0)) {
    return {
      title: 'Start with a tiny win',
      body: 'Do a few blocks and I’ll find your patterns.',
      action: 'Keep it small',
    };
  }

  return {
    title: 'Your best focus window is open',
    body: `Your strongest sessions tend to cluster around ${snapshot.bestFocusWindow}. Move the first deep work block there and keep the first target small.`,
    action: 'Move deep work',
  };
}
