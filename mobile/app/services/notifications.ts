/**
 * notifications.ts
 * Central in-app notification system for NR Scholar.
 *
 * Provides:
 *  - In-app notification store (saved to AsyncStorage)
 *  - Push notification scheduling via expo-notifications
 *  - Role-aware delivery: parent vs child notifications
 */

// import * as Notifications from "expo-notifications"; // Temporarily disabled for Expo Go SDK 53+ compatibility
import { Platform } from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotifRole = "parent" | "child" | "both";

export interface AppNotification {
  id: string;
  role: NotifRole;
  title: string;
  body: string;
  emoji: string;
  timestamp: number;
  read: boolean;
  category: "test" | "control" | "subscription" | "exam" | "streak" | "system";
}

// ── In-Memory Store ───────────────────────────────────────────────────────────
// We keep everything in memory for simplicity, persisting to AsyncStorage optionally.

const STORE_KEY = "nrscholar_notifications";
let _listeners: Array<() => void> = [];
let _notifications: AppNotification[] = [];

// Try to load from localStorage on web / memory on native
const load = () => {
  try {
    if (Platform.OS === "web") {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) _notifications = JSON.parse(raw);
    }
  } catch {}
};

const save = () => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(STORE_KEY, JSON.stringify(_notifications));
    }
  } catch {}
};

load();

// ── Public API ────────────────────────────────────────────────────────────────

/** Subscribe to notification store changes. Returns an unsubscribe function. */
export const subscribeToNotifications = (cb: () => void) => {
  _listeners.push(cb);
  return () => {
    _listeners = _listeners.filter((l) => l !== cb);
  };
};

const _emit = () => {
  save();
  _listeners.forEach((l) => l());
};

/** Return all notifications for a given role */
export const getNotifications = (role: "parent" | "child"): AppNotification[] => {
  return _notifications.filter(
    (n) => n.role === role || n.role === "both"
  ).sort((a, b) => b.timestamp - a.timestamp);
};

/** Return unread count for a role */
export const getUnreadCount = (role: "parent" | "child"): number => {
  return getNotifications(role).filter((n) => !n.read).length;
};

/** Mark all as read for a role */
export const markAllRead = (role: "parent" | "child") => {
  _notifications = _notifications.map((n) => {
    if (n.role === role || n.role === "both") return { ...n, read: true };
    return n;
  });
  _emit();
};

/** Mark a single notification as read */
export const markRead = (id: string) => {
  _notifications = _notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  _emit();
};

/** Clear all for role */
export const clearAll = (role: "parent" | "child") => {
  _notifications = _notifications.filter(
    (n) => n.role !== role && n.role !== "both"
  );
  _emit();
};

/** Push a new notification */
export const pushNotification = async (
  notif: Omit<AppNotification, "id" | "timestamp" | "read">
) => {
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    read: false,
  };

  _notifications = [newNotif, ..._notifications].slice(0, 100); // keep latest 100
  _emit();

  // Also trigger a local push notification (works on device, no-op on web quietly)
  try {
    if (Platform.OS !== "web") {
      await schedulePushNotification(notif.title, notif.body);
    }
  } catch {}

  return newNotif;
};

// ── Pre-built notification triggers ───────────────────────────────────────────

/** Child cleared a test chapter */
export const notifyTestCleared = async (childName: string, chapter: string, score: number) => {
  // Parent notification
  await pushNotification({
    role: "parent",
    title: "🎉 Test Completed!",
    body: `${childName} scored ${score}% in ${chapter}. Great progress!`,
    emoji: "🎉",
    category: "test",
  });
  // Child notification
  await pushNotification({
    role: "child",
    title: score >= 70 ? "🏆 Excellent Work!" : "📝 Test Done!",
    body: score >= 70
      ? `You scored ${score}% in ${chapter}. Keep it up!`
      : `You scored ${score}% in ${chapter}. Practice more to improve!`,
    emoji: score >= 70 ? "🏆" : "📝",
    category: "test",
  });
};

/** Parent disabled reels */
export const notifyReelsDisabled = async () => {
  await pushNotification({
    role: "child",
    title: "🔒 Reels Restricted",
    body: "Your parent has restricted access to Educational Reels.",
    emoji: "🔒",
    category: "control",
  });
  await pushNotification({
    role: "parent",
    title: "🔒 Reels Disabled",
    body: "You restricted access to Educational Reels for your child.",
    emoji: "🔒",
    category: "control",
  });
};

/** Parent enabled reels */
export const notifyReelsEnabled = async () => {
  await pushNotification({
    role: "child",
    title: "🎬 Reels Unlocked!",
    body: "Your parent has enabled Educational Reels. Go explore!",
    emoji: "🎬",
    category: "control",
  });
  await pushNotification({
    role: "parent",
    title: "🎬 Reels Enabled",
    body: "You enabled Educational Reels for your child.",
    emoji: "🎬",
    category: "control",
  });
};

/** Parent disabled AI chat */
export const notifyChatDisabled = async () => {
  await pushNotification({
    role: "child",
    title: "🔒 AI Chat Restricted",
    body: "Your parent has restricted access to AI Class Teacher.",
    emoji: "🔒",
    category: "control",
  });
  await pushNotification({
    role: "parent",
    title: "🔒 AI Chat Disabled",
    body: "You restricted access to AI Class Teacher for your child.",
    emoji: "🔒",
    category: "control",
  });
};

/** Parent enabled AI chat */
export const notifyChatEnabled = async () => {
  await pushNotification({
    role: "child",
    title: "🤖 AI Chat Unlocked!",
    body: "Your parent has enabled the AI Class Teacher. Go ask your questions!",
    emoji: "🤖",
    category: "control",
  });
  await pushNotification({
    role: "parent",
    title: "🤖 AI Chat Enabled",
    body: "You enabled the AI Class Teacher for your child.",
    emoji: "🤖",
    category: "control",
  });
};

/** Screen time updated */
export const notifyScreenTimeChanged = async (hours: number) => {
  await pushNotification({
    role: "child",
    title: "⏱️ Screen Time Updated",
    body: `Your daily app limit is now set to ${hours} hour${hours > 1 ? "s" : ""} by your parent.`,
    emoji: "⏱️",
    category: "control",
  });
  await pushNotification({
    role: "parent",
    title: "✅ Screen Time Saved",
    body: `Daily screen time has been set to ${hours} hour${hours > 1 ? "s" : ""}.`,
    emoji: "✅",
    category: "control",
  });
};

/** Screen time limit reached */
export const notifyScreenTimeExpired = async () => {
  await pushNotification({
    role: "child",
    title: "⏰ Time's Up!",
    body: "You've reached your daily screen time limit. Great learning today! See you tomorrow! 👋",
    emoji: "⏰",
    category: "control",
  });
  await pushNotification({
    role: "parent",
    title: "✅ Daily Limit Reached",
    body: "Your child has used their full daily screen time. The app will close shortly.",
    emoji: "✅",
    category: "control",
  });
};

/** Subscription activated */
export const notifySubscriptionActivated = async (planName: string) => {
  await pushNotification({
    role: "parent",
    title: "🎊 Plan Activated!",
    body: `Your ${planName} plan is now active. Enjoy all premium features!`,
    emoji: "🎊",
    category: "subscription",
  });
};

/** Streak milestone */
export const notifyStreakMilestone = async (days: number) => {
  await pushNotification({
    role: "child",
    title: `🔥 ${days}-Day Streak!`,
    body: `Amazing! You've studied for ${days} days in a row. You're on fire!`,
    emoji: "🔥",
    category: "streak",
  });
  await pushNotification({
    role: "parent",
    title: `🔥 ${days}-Day Learning Streak!`,
    body: `Your child has been studying consistently for ${days} days in a row!`,
    emoji: "🔥",
    category: "streak",
  });
};

/** Ticket Submitted */
export const notifyTicketCreated = async (subject: string) => {
  await pushNotification({
    role: "parent",
    title: "📨 Ticket Submitted",
    body: `We have received your request: "${subject}". We will reply shortly.`,
    emoji: "📨",
    category: "system",
  });
};

// ── Expo Push Setup ───────────────────────────────────────────────────────────
// Temporarily stubbed out to prevent Expo Go crashes on SDK 53+

export const registerForPushNotifications = async (): Promise<string | null> => {
  console.log("Push notifications are disabled in Expo Go. Use a development build.");
  return null;
};

const schedulePushNotification = async (title: string, body: string) => {
  console.log("Local push notification triggered (mocked):", title, body);
};
