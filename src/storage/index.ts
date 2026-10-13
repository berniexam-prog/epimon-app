import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

function createFallbackStorage(): StorageLike {
  return {
    getString: (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key) ?? undefined;
      }
      return undefined;
    },
    set: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    remove: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    },
  };
}

let storageInstance: StorageLike;

if (Platform.OS === 'web') {
  storageInstance = createFallbackStorage();
} else {
  try {
    storageInstance = createMMKV({
      id: 'epimon-storage',
    });
  } catch {
    storageInstance = createFallbackStorage();
  }
}

export const storage = storageInstance;

export const storageKeys = {
  onboarding: 'epimon.onboarding.v1',
  focus: 'epimon.focus.v1',
};