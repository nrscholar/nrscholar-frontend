import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

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
};

export default function ResultsScreen() {
  const router = useRouter();
  const { correct, total } = useLocalSearchParams();
  
  const score = Number(correct) || 0;
  const max = Number(total) || 1;
  const percentage = (score / max) * 100;

  let message = "Good Try!";
  let emoji = "👍";
  if (percentage >= 80) {
    message = "Outstanding!";
    emoji = "🏆";
  } else if (percentage >= 50) {
    message = "Great Job!";
    emoji = "⭐";
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{message}</Text>
        
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>You got</Text>
          <Text style={styles.scoreBig}>{score} / {max}</Text>
          <Text style={styles.scoreText}>questions correct</Text>
          
          <View style={{ flexDirection: "row", gap: 16, marginTop: 20, backgroundColor: "rgba(20, 23, 121, 0.1)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignItems: "center" }}>
            <Text style={{ fontWeight: "700", color: "#141779", fontSize: 13 }}>⚡ +{score * 30} Fuel</Text>
            <Text style={{ fontWeight: "700", color: "#141779", fontSize: 13 }}>|</Text>
            <Text style={{ fontWeight: "700", color: "#141779", fontSize: 13 }}>🪙 +{score * 10} Coins</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.doneBtn} 
          activeOpacity={0.8}
          onPress={() => router.replace("/practice/journey-map")}
        >
          <Text style={styles.doneBtnText}>Return to Journey Map 🚂</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface, justifyContent: "center" },
  container: { padding: 30, alignItems: "center" },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "900", color: C.primary, marginBottom: 40 },
  scoreCard: {
    backgroundColor: C.primaryContainer,
    padding: 40,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
    elevation: 5,
  },
  scoreText: { fontSize: 20, color: C.onSurface, fontWeight: "600" },
  scoreBig: { fontSize: 56, fontWeight: "900", color: C.primary, marginVertical: 10 },
  doneBtn: {
    backgroundColor: C.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 40,
    width: "100%",
    alignItems: "center",
    elevation: 4,
  },
  doneBtnText: { color: "#ffffff", fontSize: 20, fontWeight: "800" }
});
