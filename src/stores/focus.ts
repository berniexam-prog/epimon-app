import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage, storageKeys } from '../storage';

export type FocusSessionStatus = 'active' | 'completed' | 'rested' | 'ended_early';

export interface FocusSession {
  id: string;
  title: string;
  plannedMin: number;
  startedAt: number;
  spentForegroundMs: number;
  leftAt?: number;
  status: FocusSessionStatus;
  focusedSec: number;
  endedAt?: number;
  mood?: 1 | 2 | 3;
}

export interface CustomPlanBlock {
  id: string;
  label: string;
  timeLabel: string;
  duration: number;
  kind: 'plan' | 'focus' | 'rest';
  importance: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
}

interface FocusStore {
  activeSession: FocusSession | null;
  recentSessions: FocusSession[];
  lastCompletedSession: FocusSession | null;
  customBlocks: CustomPlanBlock[];
  startSession: (title: string, plannedMin: number) => FocusSession;
  pauseSession: () => void;
  resumeSession: () => boolean;
  endSession: (status: 'completed' | 'rested' | 'ended_early', focusedSecOverride?: number) => FocusSession | null;
  setMood: (mood: 1 | 2 | 3) => void;
  addCustomBlock: (block: CustomPlanBlock) => void;
  removeCustomBlock: (id: string) => void;
  clear: () => void;
}

export function getElapsedFocusMs(session: FocusSession, at = Date.now()) {
  if (!session) return 0;
  const activeWindow = session.leftAt ? 0 : Math.max(0, at - session.startedAt);
  return session.spentForegroundMs + activeWindow;
}

export const useFocusStore = create<FocusStore>()(
  persist(
    (set, get) => ({
      activeSession: null,
      recentSessions: [],
      lastCompletedSession: null,
      customBlocks: [],
      startSession: (title, plannedMin) => {
        const now = Date.now();
        const session: FocusSession = {
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          plannedMin,
          startedAt: now,
          spentForegroundMs: 0,
          status: 'active',
          focusedSec: 0,
        };

        set({ activeSession: session });
        return session;
      },
      pauseSession: () => {
        const session = get().activeSession;
        if (!session || session.leftAt) return;

        const now = Date.now();
        set({
          activeSession: {
            ...session,
            spentForegroundMs: session.spentForegroundMs + (now - session.startedAt),
            leftAt: now,
          },
        });
      },
      resumeSession: () => {
        const session = get().activeSession;
        if (!session || !session.leftAt) return true;

        const now = Date.now();
        const graceMs = 120 * 1000;

        if (now - session.leftAt > graceMs) {
          const finalSession = {
            ...session,
            status: 'rested' as const,
            endedAt: now,
            focusedSec: Math.round(Math.min(session.plannedMin * 60, getElapsedFocusMs(session, now) / 1000)),
          };

          set({
            activeSession: null,
            recentSessions: [finalSession, ...get().recentSessions],
            lastCompletedSession: finalSession,
          });
          return false;
        }

        set({
          activeSession: {
            ...session,
            startedAt: now,
            leftAt: undefined,
          },
        });
        return true;
      },
      endSession: (status, focusedSecOverride) => {
        const session = get().activeSession;
        if (!session) return null;
        const now = Date.now();
        const focusedSec = Math.round(
          Math.min(
            session.plannedMin * 60,
            ((focusedSecOverride ?? getElapsedFocusMs(session, now)) / 1000)
          )
        );

        const finalSession: FocusSession = {
          ...session,
          status,
          endedAt: now,
          focusedSec,
        };

        set({
          activeSession: null,
          recentSessions: [finalSession, ...get().recentSessions],
          lastCompletedSession: finalSession,
        });
        return finalSession;
      },
      setMood: (mood) => {
        const current = get().lastCompletedSession ?? get().activeSession;
        if (!current) return;

        const activeSessionState = get().activeSession;
        const lastCompletedState = get().lastCompletedSession;
        const next: FocusSession = { ...current, mood };
        const activeSession = activeSessionState && activeSessionState.id === current.id ? next : activeSessionState;
        const lastCompletedSession =
          lastCompletedState && lastCompletedState.id === current.id ? next : lastCompletedState;

        set({
          lastCompletedSession,
          recentSessions: get().recentSessions.map((item) => (item.id === current.id ? next : item)),
          activeSession,
        });
      },
      addCustomBlock: (block) => {
        set({ customBlocks: [...get().customBlocks, block] });
      },
      removeCustomBlock: (id) => {
        set({ customBlocks: get().customBlocks.filter((b) => b.id !== id) });
      },
      clear: () => set({ activeSession: null, recentSessions: [], lastCompletedSession: null, customBlocks: [] }),
    }),
    {
      name: storageKeys.focus,
      storage: createJSONStorage(() => ({
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.remove(key),
      })),
    }
  )
);