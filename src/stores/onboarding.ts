import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage, storageKeys } from '../storage';

export type AgeBracket = '13-17' | '18-24' | '25-34' | '35+';
export type Obstacle = 'procrastination' | 'focus' | 'burnout' | 'discipline';
export type DelayFrequency = 'daily' | 'few_week' | 'occasional' | 'rare';
export type Identity = 'in_control' | 'consistent' | 'reliable' | 'calm';
export type BestTime = 'morning' | 'afternoon' | 'evening' | 'varies';

export type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'about'
  | 'cost'
  | 'obstacle'
  | 'frequency'
  | 'method'
  | 'identity'
  | 'besttime'
  | 'minutes'
  | 'trajectory'
  | 'building'
  | 'plan-preview'
  | 'commit'
  | 'trial';

export interface OnboardingProfile {
  name: string;
  ageBracket?: AgeBracket;
  distractionHoursPerDay: number;
  obstacle: Obstacle;
  delayFrequency: DelayFrequency;
  identity: Identity;
  bestTime: BestTime;
  dailyGoalMinutes: 5 | 15 | 30 | 60;
  nudgeEnabled: boolean;
  nudgeTime: string;
  onboardingCompletedAt?: number;
  createdAt: number;
}

interface OnboardingState extends OnboardingProfile {
  hasHydrated: boolean;
  setValue: <K extends keyof OnboardingProfile>(key: K, value: OnboardingProfile[K]) => void;
  setMany: (values: Partial<OnboardingProfile>) => void;
  complete: () => void;
  reset: () => void;
}

const defaultState: OnboardingProfile = {
  name: '',
  ageBracket: undefined,
  distractionHoursPerDay: 4,
  obstacle: 'procrastination',
  delayFrequency: 'few_week',
  identity: 'consistent',
  bestTime: 'morning',
  dailyGoalMinutes: 15,
  nudgeEnabled: true,
  nudgeTime: '09:00',
  createdAt: Date.now(),
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...defaultState,
      hasHydrated: false,
      setValue: (key, value) => set((state) => ({ ...state, [key]: value })),
      setMany: (values) => set((state) => ({ ...state, ...values })),
      complete: () =>
        set((state) => ({
          ...state,
          onboardingCompletedAt: Date.now(),
          createdAt: state.createdAt || Date.now(),
        })),
      reset: () => set({ ...defaultState, hasHydrated: true }),
    }),
    {
      name: storageKeys.onboarding,
      storage: createJSONStorage(() => ({
        getItem: async (key) => {
          const value = storage.getString(key);
          return value ?? null;
        },
        setItem: async (key, value) => {
          storage.set(key, value);
        },
        removeItem: async (key) => {
          storage.remove(key);
        },
      })),
      onRehydrateStorage: () => () => {
        const state = useOnboardingStore.getState();
        useOnboardingStore.setState({ hasHydrated: true, createdAt: state.createdAt || Date.now() });
      },
    }
  )
);

export const onboardingDefaults = defaultState;