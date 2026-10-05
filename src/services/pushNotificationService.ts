import { apiFetch } from "../api";

export async function registerPushNotificationToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    let token: string | null = null;

    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        await Notification.requestPermission();
      }
    }

    // Check for native Expo / Capacitor push notification token if running in mobile webview
    if ((window as any).ExpoPushToken) {
      token = (window as any).ExpoPushToken;
    } else if ("Notification" in window && "serviceWorker" in window) {
      if (Notification.permission === "granted") {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-Skv69yViEuiBIa"
          });
          token = JSON.stringify(subscription);
        } catch (e) {}
      }
    }

    if (token) {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        await apiFetch("/api/users/push-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pushToken: token })
        });
      }
    }

    return token;
  } catch (e) {
    console.warn("Push notification registration skipped or not supported:", e);
    return null;
  }
}

export function showInteractiveNotification(
  title: string,
  message: string,
  screen?: string,
  type: string = "general"
) {
  if (typeof window === "undefined") return;

  // 1. Dispatch custom event for top floating Toast Banner in UI
  window.dispatchEvent(
    new CustomEvent("show-notification-toast", {
      detail: { title, message, screen, type }
    })
  );

  // 2. Trigger native OS Desktop Browser Push Notification Popup
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      try {
        const notif = new Notification(title, {
          body: message,
          icon: "/favicon.ico",
          tag: title
        });
        notif.onclick = () => {
          window.focus();
          if (screen) {
            window.location.href = screen;
          }
        };
      } catch (e) {
        console.warn("Desktop notification trigger fallback:", e);
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showInteractiveNotification(title, message, screen, type);
        }
      });
    }
  }
}
