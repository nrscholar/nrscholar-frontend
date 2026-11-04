import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showNotificationToast } from "./GlobalNotificationBanner";

/**
 * Top-level root routes where pressing the back button should exit or prompt exit,
 * rather than navigating deeper into historical tabs or returning to the login screen.
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
 * 5. Browser / WebView 'popstate' event for Android back gesture & browser navigation
 *
 * Behavior:
 * - On sub-pages (e.g. /parent/daily-tip, /progress, /parent/lessons): navigates back (navigate(-1)).
 * - On root pages (e.g. /home, /parent/dashboard): prompts with toast on first press, exits on second press within 2s.
 * - Prevents navigating back to the login screen after successful authentication.
 */
export default function MobileBackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPressTime = useRef<number>(0);

  useEffect(() => {
    const currentPath = location.pathname;
    const isRootRoute = ROOT_ROUTES.includes(currentPath);

    // Push a root guard into browser history when on a dashboard root route
    // so physical/browser back button pops the guard state and can be intercepted
    if (isRootRoute && currentPath !== "/login") {
      const currentState = window.history.state || {};
      if (!currentState.nrsRootGuard) {
        window.history.pushState({ ...currentState, nrsRootGuard: true }, "");
      }
    }

    const triggerExitOrToast = (): boolean => {
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
        } else {
          try {
            window.close();
          } catch {}
        }
        return false;
      }

      // First press at root route -> Show notification toast and preserve router history state
      lastBackPressTime.current = now;
      if (isRootRoute && currentPath !== "/login") {
        const currentState = window.history.state || {};
        window.history.pushState({ ...currentState, nrsRootGuard: true }, "");
      }

      showNotificationToast({
        title: "NR Scholar",
        message: "Press back again to exit",
        type: "general"
      });

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

    const handleBackAction = (): boolean => {
      // Check if we have history depth in this session (window.history.state.idx > 0)
      const historyIndex = (window.history.state as any)?.idx ?? 0;
      const hasHistory = historyIndex > 0;

      if (!isRootRoute && hasHistory) {
        // Step back in the React Router stack
        navigate(-1);
        return true; // Event consumed
      }

      return triggerExitOrToast();
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

    // 5. Browser / WebView popstate listener for device gesture & hardware back button
    const onPopState = () => {
      // If a modal or dropdown within the screen is active, let that screen's handler close it
      if ((window as any).__nrs_parent_modal_active) {
        return;
      }

      if (isRootRoute && currentPath !== "/login") {
        triggerExitOrToast();
      }
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      delete (window as any).handleHardwareBackPress;
      document.removeEventListener("backbutton", onBackButton);
      window.removeEventListener("message", onNativeMessage);
      window.removeEventListener("hardwareBackPress", onCustomBack);
      window.removeEventListener("popstate", onPopState);
    };
  }, [location.pathname, navigate]);

  return null;
}
