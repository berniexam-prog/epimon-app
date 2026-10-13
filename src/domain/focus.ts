export const STREAK_THRESHOLD = 1;
export const DAILY_GOAL_DEFAULT = 15;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function moonFill(focusedMinutes: number, dailyGoalMinutes: number) {
  if (!dailyGoalMinutes || dailyGoalMinutes <= 0) return 0;
  return clamp(focusedMinutes / dailyGoalMinutes, 0, 1);
}

export function getMoonPhase(fill: number) {
  const phases = [0, 0.25, 0.5, 0.75, 1] as const;
  return phases.reduce((closest, candidate) => {
    return Math.abs(candidate - fill) < Math.abs(closest - fill) ? candidate : closest;
  }, phases[0]);
}

export function dayKey(date = new Date()) {
  const local = new Date(date);
  if (local.getHours() < 4) {
    local.setDate(local.getDate() - 1);
  }

  const year = local.getFullYear();
  const month = String(local.getMonth() + 1).padStart(2, '0');
  const day = String(local.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function previousDayKey(date = new Date()) {
  const next = new Date(date);
  next.setDate(next.getDate() - 1);
  return dayKey(next);
}

export function calculateStreak(
  entries: Array<{ dayKey: string; focusedMinutes: number; dailyGoalMinutes: number }>,
  asOf = new Date()
) {
  const countedDays = new Map<string, boolean>();

  for (const entry of entries) {
    countedDays.set(
      entry.dayKey,
      moonFill(entry.focusedMinutes, entry.dailyGoalMinutes) >= STREAK_THRESHOLD
    );
  }

  const latestDay = dayKey(asOf);
  const startDay = countedDays.get(latestDay) ? latestDay : previousDayKey(asOf);

  if (!countedDays.get(startDay)) {
    return 0;
  }

  let streak = 0;
  let cursor = startDay;

  for (let index = 0; index < 365; index += 1) {
    if (countedDays.get(cursor)) {
      streak += 1;
      const next = new Date(`${cursor}T12:00:00`);
      next.setDate(next.getDate() - 1);
      cursor = dayKey(next);
      continue;
    }

    break;
  }

  return streak;
}
