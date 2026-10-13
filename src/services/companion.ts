import { buildCoachReply, buildHomeTip, summarizeSessions } from '../domain/insights';

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

export const companionService = {
  buildPlan(sessions: FocusSessionLike[]): CompanionPlan {
    const snapshot = summarizeSessions(sessions);
    const tip = buildHomeTip(snapshot);
    const reply = buildCoachReply('week summary', snapshot);

    return {
      title: tip.title,
      body: tip.body,
      action: tip.action,
      chart: snapshot.minutesPerDay,
      reply,
    };
  },

  homeTip(sessions: FocusSessionLike[]) {
    return buildHomeTip(summarizeSessions(sessions));
  },

  weeklySummary(sessions: FocusSessionLike[]) {
    return summarizeSessions(sessions);
  },

  reply(message: string, sessions: FocusSessionLike[]) {
    return buildCoachReply(message, summarizeSessions(sessions));
  },
};

export default companionService;
