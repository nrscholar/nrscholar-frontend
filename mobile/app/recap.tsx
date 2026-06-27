import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { practiceApi } from "./services/api";

const C = {
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onTertiary: "#ffffff",
  onSecondary: "#ffffff",
  onPrimary: "#ffffff",
  secondaryFixed: "#cce8e4",
  secondaryShadow: "#006a62",
  primaryFixed: "#e0e0ff",
  primaryShadow: "#141779",
  surfaceContainerHigh: "#f5f5f5",
  surfaceContainerHighest: "#e6e6e6",

  primary: "#141779",
  primaryContainer: "#e0e0ff",
  primaryFixedDim: "#c2e8ff",
  onPrimaryContainer: "#0a0c45",
  surface: "#f4efff",
  surfaceContainerLow: "#ffffff",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  secondary: "#006a62",
  secondaryContainer: "#d0f0ed",
  onSecondaryContainer: "#003733",
  tertiary: "#30007f",
  tertiaryContainer: "#e8ddff",
  onTertiaryContainer: "#1d0052",
  outline: "#827656",
  yellow50: "#f4efff",
  yellow100: "#e0e0ff",
  yellow200: "#c2e8ff",
  yellow900: "#141779",
  wrongBg: "#ffdad6",
  wrongText: "#93000a",
  correctBg: "#d0f0ed",
  correctText: "#003733",
};

export default function RecapScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await practiceApi.getDashboardStats();
      if (res.success) setStats(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const wrongs = stats?.wrongTracker || [];

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Needs Recap</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 40 }} />
        ) : wrongs.length === 0 ? (
          <Text style={styles.emptyText}>You're all caught up! No wrong answers to recap! 🌟</Text>
        ) : (
          <View>
            <Text style={styles.headerPara}>
              Here are the {wrongs.length} questions you recently answered incorrectly. Review them below!
            </Text>
            {wrongs.map((wrong: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.qActual}>{wrong.questionText || "Question Text"}</Text>
                
                <View style={[styles.pill, { backgroundColor: C.wrongBg }]}>
                  <Text style={[styles.pillText, { color: C.wrongText }]}>
                    Your Answer: {wrong.userAnswer || "Unknown"}
                  </Text>
                </View>

                <View style={[styles.pill, { backgroundColor: C.correctBg }]}>
                  <Text style={[styles.pillText, { color: C.correctText }]}>
                     Correct Answer: {wrong.correctAnswer}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: C.surface,
    paddingTop: 45,
    paddingBottom: 15,
    elevation: 3,
  },
  backBtn: { paddingRight: 15 },
  backIcon: { fontSize: 28, color: C.primary, fontWeight: "600" },
  topBarTitle: { fontSize: 22, fontWeight: "800", color: C.onSurface },
  scroll: { padding: 20 },
  headerPara: { fontSize: 16, color: C.onSurface, fontWeight: "500", marginBottom: 20 },
  emptyText: { textAlign: "center", marginTop: 40, color: C.onSurface, fontSize: 18, fontWeight: "700" },
  card: {
    backgroundColor: C.surfaceContainerLow,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  qText: { fontSize: 12, fontWeight: "700", color: C.onSurface, opacity: 0.6, marginBottom: 4 },
  qActual: { fontSize: 18, fontWeight: "800", color: C.onSurface, marginBottom: 16 },
  pill: { padding: 12, borderRadius: 8, marginBottom: 8 },
  pillText: { fontSize: 15, fontWeight: "700" }
});
