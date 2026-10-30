import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Animated,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AppHeader from "../../components/AppHeader";
import { getToken } from "../services/api";

const WEBAPP_URL = "https://nrscholar-frontend.vercel.app";

export default function WebViewScreen() {
  const router = useRouter();
  const { path, title: customTitle } = useLocalSearchParams<{ path: string; title?: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [initialAuthLoading, setInitialAuthLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const webViewRef = useRef<WebView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ── 1. Load User Token for WebView SSO Injection ─────────
  useEffect(() => {
    const loadToken = async () => {
      try {
        const t = await getToken();
        setToken(t);
      } catch (e) {
        console.error("Token load failed", e);
      } finally {
        setInitialAuthLoading(false);
      }
    };
    loadToken();
  }, []);

  const currentUrlRef = useRef<string>("");

  const isAtShadowArenaHub = (currentUrl?: string) => {
    const u = currentUrl || currentUrlRef.current || "";
    return (
      (u.includes("/multiplayer-hub") || u === "/multiplayer-hub") &&
      !u.includes("/multiplayer-room") &&
      !u.includes("/multiplayer-battle")
    );
  };

  // ── 2. Hardware Android Back Button Handler ──────────────
  const handleHardwareBack = useCallback(() => {
    const current = currentUrlRef.current || "";
    const isHub = isAtShadowArenaHub(current);
    const isHome = current.includes("/home") || current.endsWith("/home/") || current.endsWith("/home");

    // If user is on the Shadow Arena Hub (/multiplayer-hub) or on /home, return to native HomeScreen
    if (isHub || isHome) {
      router.back();
      return true; // Consume event
    }

    // If on a sub-screen like /multiplayer-room, go back in webview history to return to /multiplayer-hub
    if (webViewRef.current) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
      webViewRef.current.injectJavaScript("window.history.back(); true;");
      return true; // Consume event
    }

    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }

    return false; // Let React Navigation pop the screen
  }, [canGoBack]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const sub = BackHandler.addEventListener("hardwareBackPress", handleHardwareBack);
      return () => sub.remove();
    }
  }, [handleHardwareBack]);

  // ── 3. Animated Loading Progress Bar ─────────────────────
  const handleLoadProgress = ({ nativeEvent }: { nativeEvent: { progress: number } }) => {
    Animated.timing(progressAnim, {
      toValue: nativeEvent.progress,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      if (nativeEvent.progress >= 1) {
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  // ── 4. Navigation State Change & PostMessage Listener ────
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url) {
      currentUrlRef.current = navState.url;
    }
    // If webview navigates to /home from multiplayer, exit webview and return to native HomeScreen
    if (path && path.includes("multiplayer") && navState.url && (navState.url.includes("/home") || navState.url.endsWith("/home/") || navState.url.endsWith("/home"))) {
      router.back();
      return;
    }
    setCanGoBack(Boolean(navState.canGoBack));
    if (navState.title && !customTitle && !navState.title.includes("vercel.app") && !navState.title.includes("localhost")) {
      setPageTitle(navState.title);
    }
    if (navState.loading) {
      setHasError(false);
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "EXIT_TO_APP") {
        router.back();
        return;
      }
      if (data.type === "SPA_NAVIGATION") {
        currentUrlRef.current = data.url || data.pathname || "";
        if (
          path &&
          path.includes("multiplayer") &&
          (data.pathname === "/home" || data.pathname === "/home/" || (data.url && data.url.includes("/home")))
        ) {
          router.back();
        }
      }
    } catch (e) {
      // ignore non-JSON messages
    }
  };

  const handleHeaderBack = () => {
    const current = currentUrlRef.current || "";
    const isHub = isAtShadowArenaHub(current);
    const isHome = current.includes("/home") || current.endsWith("/home/") || current.endsWith("/home");

    if (isHub || isHome) {
      router.back();
      return;
    }

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript("window.history.back(); true;");
      return;
    }

    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      router.back();
    }
  };

  const handleReload = () => {
    setHasError(false);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  // ── Dynamic Title Resolution ─────────────────────────────
  const displayTitle =
    customTitle ||
    pageTitle ||
    (path?.includes("multiplayer")
      ? "Shadow Arena"
      : path?.includes("evolution")
      ? "Dragon Journey"
      : path?.includes("daily-tip")
      ? "Daily Tip"
      : path?.includes("lessons")
      ? "Parent Lessons"
      : path?.includes("challenges")
      ? "Parent Challenges"
      : path?.includes("achievements")
      ? "Parent Rewards"
      : path?.includes("kids-activity")
      ? "Kids Activity"
      : path?.includes("learning-library")
      ? "Learning Library"
      : "NR Scholar");

  if (initialAuthLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#141779" />
        <Text style={styles.loadingText}>Initializing Session...</Text>
      </View>
    );
  }

  let url = `${WEBAPP_URL}${path || "/home"}`;
  if (token) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}token=${encodeURIComponent(token)}`;
  }

  const injectedJS = `
    (function() {
      ${token ? `try { localStorage.setItem('userToken', '${token}'); window.dispatchEvent(new Event('storage')); } catch(e) {}` : ''}

      function reportNav() {
        try {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'SPA_NAVIGATION',
              url: window.location.href,
              pathname: window.location.pathname
            }));
          }
        } catch(e) {}
      }

      var origPushState = history.pushState;
      history.pushState = function() {
        var ret = origPushState.apply(this, arguments);
        reportNav();
        return ret;
      };

      var origReplaceState = history.replaceState;
      history.replaceState = function() {
        var ret = origReplaceState.apply(this, arguments);
        reportNav();
        return ret;
      };

      window.addEventListener('popstate', reportNav);
      window.addEventListener('hashchange', reportNav);

      setTimeout(reportNav, 100);
      setTimeout(reportNav, 500);
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {/* Standardized Native Header */}
      <AppHeader
        title={displayTitle}
        onBack={handleHeaderBack}
        rightAction={
          <TouchableOpacity
            onPress={handleReload}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.refreshButton}
          >
            <MaterialIcons name="refresh" size={22} color="#141779" />
          </TouchableOpacity>
        }
      />

      {/* Flutter-style Top Linear Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {/* Error Fallback View with Retry */}
      {hasError ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIconCircle}>
            <MaterialIcons name="wifi-off" size={38} color="#ba1a1a" />
          </View>
          <Text style={styles.errorTitle}>Unable to Load Content</Text>
          <Text style={styles.errorSubtitle}>
            {errorMessage || "Please check your internet connection and try again."}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReload} activeOpacity={0.85}>
            <MaterialIcons name="refresh" size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webView}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsInlineMediaPlayback={true}
          onLoadProgress={handleLoadProgress}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent || {};
            setHasError(true);
            setErrorMessage(nativeEvent?.description || "Failed to connect.");
          }}
          renderLoading={() => (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#141779" />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f9fb",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#141779",
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(20, 23, 121, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    height: 3,
    width: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#006a62",
  },
  webView: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f7f9fb",
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fffbfa",
    borderWidth: 1,
    borderColor: "#ba1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#141779",
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#767683",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
    maxWidth: 280,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141779",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
