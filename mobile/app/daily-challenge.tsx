import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { apiRequest } from "./services/api";

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
  surface: "#f4efff",
  surfaceContainerLow: "#ffffff",
  onSurface: "#191c1e",
};

export default function DailyChallenge() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/challenge/today", { auth: true }).then((r) => {
      if (r.success) setData(r.data);
      else setData({ title: "Solve 5 Math Questions", desc: "Keep up your streak!", xpReward: 50, bonusStars: 5 });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={C.primary} /></View>;
  }

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10, marginRight: 10 }}>
          <Text style={{ fontSize: 24, color: C.primary, fontWeight: '800' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Daily Challenge</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.desc}>{data.desc || data.description}</Text>
        <View style={styles.rewardRow}>
          <Text style={styles.reward}>⭐ {data.bonusStars} Stars</Text>
          <Text style={styles.reward}>✨ {data.xpReward} XP</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => {
        alert("Challenge Started! Good luck!");
        router.back();
      }}>
        <Text style={styles.btnText}>Start Activity 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: C.surface, justifyContent: "center", alignItems: "center" },
  root: { flex: 1, backgroundColor: C.surface, padding: 20, paddingTop: 50 },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  header: { fontSize: 26, fontWeight: "800", color: C.primary },
  card: { backgroundColor: C.surfaceContainerLow, padding: 24, borderRadius: 20, alignItems: "center", elevation: 3 },
  title: { fontSize: 22, fontWeight: "800", color: C.primary, textAlign: "center", marginBottom: 10 },
  desc: { fontSize: 16, color: "#464652", textAlign: "center", marginBottom: 20 },
  rewardRow: { flexDirection: "row", gap: 20 },
  reward: { fontSize: 16, fontWeight: "700", color: "#006a62" },
  btn: { backgroundColor: C.primary, padding: 16, borderRadius: 30, alignItems: "center", marginTop: 40 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" }
});
