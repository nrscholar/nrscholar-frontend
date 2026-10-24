import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Top-level root routes where pressing the back button should exit or prompt exit,
 * rather than navigating deeper into historical tabs.
 */
const ROOT_ROUTES = [
  "/home",
  "/login",
  "/parent/dashboard",
  "/parent/gate"
];

/**
 * MobileBackHandler
 *
 * Intercepts physical/gesture back button presses from:
 * 1. Android WebView JavascriptInterface (window.handleHardwareBackPress)
 * 2. Capacitor / Cordova 'backbutton' document event
 * 3. React Native WebView postMessage ('HARDWARE_BACK_PRESS')
 * 4. Custom window 'hardwareBackPress' event
 *
 * Behavior:
 * - On sub-pages (e.g. /parent/daily-tip, /progress, /parent/lessons): navigates back (navigate(-1)).
 * - On root pages (e.g. /home, /parent/dashboard): prompts with toast on first press, exits on second press within 2s.
 */
export default function MobileBackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPressTime = useRef<number>(0);

  useEffect(() => {
    const handleBackAction = (): boolean => {
      const currentPath = location.pathname;
      const isRootRoute = ROOT_ROUTES.includes(currentPath);

      // Check if we have history depth in this session (window.history.state.idx > 0)
      const historyIndex = (window.history.state as any)?.idx ?? 0;
      const hasHistory = historyIndex > 0;

      if (!isRootRoute && hasHistory) {
        // Step back in the React Router stack
        navigate(-1);
        return true; // Event consumed
      }

      // Root route reached: Implement double-tap to exit
      const now = Date.now();
      if (now - lastBackPressTime.current < 2000) {
        // Second press within 2 seconds -> Exit app
        const win = window as any;
        if (win.AndroidBridge?.exitApp) {
          win.AndroidBridge.exitApp();
        } else if (win.ReactNativeWebView?.postMessage) {
          win.ReactNativeWebView.postMessage(JSON.stringify({ type: "EXIT_APP" }));
        } else if (win.Capacitor?.Plugins?.App?.exitApp) {
          win.Capacitor.Plugins.App.exitApp();
        }
        return false;
      }

      // First press at root route -> Show notification toast
      lastBackPressTime.current = now;
      const win = window as any;
      if (win.AndroidBridge?.showToast) {
        win.AndroidBridge.showToast("Press back again to exit");
      } else if (win.ReactNativeWebView?.postMessage) {
        win.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "SHOW_TOAST", message: "Press back again to exit" })
        );
      }
      return true; // Event consumed (waits for second press)
    };

    // 1. Direct JS invoker for Android WebView
    (window as any).handleHardwareBackPress = handleBackAction;

    // 2. Capacitor / Cordova event
    const onBackButton = (e: Event) => {
      e.preventDefault();
      handleBackAction();
    };
    document.addEventListener("backbutton", onBackButton);

    // 3. React Native postMessage bridge listener
    const onNativeMessage = (event: MessageEvent) => {
      try {
        const payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (payload?.type === "HARDWARE_BACK_PRESS") {
          handleBackAction();
        }
      } catch {}
    };
    window.addEventListener("message", onNativeMessage);

    // 4. Custom event listener
    const onCustomBack = () => handleBackAction();
    window.addEventListener("hardwareBackPress", onCustomBack);

    return () => {
      delete (window as any).handleHardwareBackPress;
      document.removeEventListener("backbutton", onBackButton);
      window.removeEventListener("message", onNativeMessage);
      window.removeEventListener("hardwareBackPress", onCustomBack);
    };
  }, [location.pathname, navigate]);

  return null;
}
