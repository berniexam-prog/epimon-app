import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const EPIMON_NOTIFICATION_CHANNEL = 'epimon-reminders';

function isNotificationsAvailable() {
  return Boolean(
    Notifications &&
      typeof Notifications.setNotificationHandler === 'function' &&
      typeof Notifications.scheduleNotificationAsync === 'function'
  );
}

export function configureNotificationHandler() {
  if (!isNotificationsAvailable()) {
    return false;
  }

  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function ensureNotificationChannel() {
  if (Platform.OS !== 'android' || !isNotificationsAvailable()) {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(EPIMON_NOTIFICATION_CHANNEL, {
      name: 'Epimon reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      showBadge: true,
    });
  } catch {
    // Ignore notification setup failures in unsupported environments.
  }
}

export async function requestNotificationPermission() {
  if (!isNotificationsAvailable()) {
    return false;
  }

  try {
    await ensureNotificationChannel();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const response = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = response.status;
    }

    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyNudge(time: string) {
  if (!isNotificationsAvailable()) {
    return null;
  }

  const [hour, minute] = (time || '09:00').split(':').map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  try {
    await ensureNotificationChannel();

    return Notifications.scheduleNotificationAsync({
      content: {
        title: 'Epi is checking in',
        body: 'A tiny focus block is still a win.',
        data: { type: 'daily_nudge' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: EPIMON_NOTIFICATION_CHANNEL,
      },
    });
  } catch {
    return null;
  }
}

export async function scheduleSessionGraceReminder(delayMs = 90_000) {
  if (!isNotificationsAvailable()) {
    return null;
  }

  try {
    await ensureNotificationChannel();

    return Notifications.scheduleNotificationAsync({
      content: {
        title: 'Epi is waiting',
        body: 'Come back to keep your moon glowing.',
        data: { type: 'session_grace_reminder' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(delayMs / 1000)),
        channelId: EPIMON_NOTIFICATION_CHANNEL,
      },
    });
  } catch {
    return null;
  }
}

export async function scheduleBlockStartReminder(startAt: Date, title: string) {
  if (!isNotificationsAvailable()) {
    return null;
  }

  try {
    const secondsUntil = Math.max(0, Math.round((startAt.getTime() - Date.now()) / 1000) - 300);
    if (secondsUntil <= 0) {
      return null;
    }

    await ensureNotificationChannel();

    return Notifications.scheduleNotificationAsync({
      content: {
        title: 'Focus block starting soon',
        body: `${title} starts in 5 minutes.`,
        data: { type: 'block_start_soon' },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil,
        channelId: EPIMON_NOTIFICATION_CHANNEL,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelScheduledNotifications() {
  if (!isNotificationsAvailable()) {
    return null;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch {
    return null;
  }
}

export const NotificationService = {
  configureHandler: configureNotificationHandler,
  ensureChannel: ensureNotificationChannel,
  requestPermission: requestNotificationPermission,
  scheduleDailyNudge,
  scheduleSessionGraceReminder,
  scheduleBlockStartReminder,
  cancelScheduledNotifications,
};

export default NotificationService;
