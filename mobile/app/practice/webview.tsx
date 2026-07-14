import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getToken } from "../services/api";

const WEBAPP_URL = "https://nrscholar-frontend.vercel.app";

export default function WebViewScreen() {
  const router = useRouter();
  const { path } = useLocalSearchParams<{ path: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const t = await getToken();
      setToken(t);
      setLoading(false);
    };
    loadToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#141779" />
      </View>
    );
  }

  const url = `${WEBAPP_URL}${path || "/home"}`;

  // Inject token into localStorage before page contents load so user is auto-authorized
  const injectedJS = token
    ? `
      (function() {
        localStorage.setItem('userToken', '${token}');
        window.dispatchEvent(new Event('storage'));
      })();
      true;
    `
    : "";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#141779" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {path?.includes("multiplayer") ? "Shadow Arena" : 
           path?.includes("evolution") ? "Dragon Journey" : 
           path?.includes("daily-tip") ? "Daily Tip" :
           path?.includes("lessons") ? "Parent Lessons" :
           path?.includes("challenges") ? "Parent Challenges" :
           path?.includes("achievements") ? "Parent Rewards" :
           path?.includes("kids-activity") ? "Kids Activity" :
           "NR Scholar"}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
      />
    </SafeAreaView>
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
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eceef0",
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#141779",
  },
});
