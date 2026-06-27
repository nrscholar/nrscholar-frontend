import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Color tokens ──────────────────────────────────────────────────────────────
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

const SCREEN_W = Dimensions.get("window").width;
const OPTION_LABELS = ["A", "B", "C", "D"];

// ── Question bank ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  { subject: "MATH",    text: "What is 12 + 4?",          options: ["14", "16", "18", "15"], correct: 1 },
  { subject: "MATH",    text: "What is 25 − 9?",           options: ["14", "18", "16", "15"], correct: 2 },
  { subject: "SCIENCE", text: "Plants make food by?",      options: ["Breathing", "Photosynthesis", "Digestion", "Eating"], correct: 1 },
  { subject: "MATH",    text: "What is 6 × 7?",            options: ["36", "48", "42", "40"], correct: 2 },
  { subject: "ENGLISH", text: "Opposite of 'happy' is?",   options: ["Joyful", "Sad", "Bright", "Angry"], correct: 1 },
  { subject: "SCIENCE", text: "The Sun is a?",             options: ["Planet", "Moon", "Star", "Comet"], correct: 2 },
  { subject: "MATH",    text: "What is 81 ÷ 9?",           options: ["7", "8", "9", "10"], correct: 2 },
  { subject: "ENGLISH", text: "A word that names a thing is?", options: ["Verb", "Noun", "Adjective", "Pronoun"], correct: 1 },
  { subject: "SCIENCE", text: "Water boils at?",           options: ["50°C", "80°C", "100°C", "120°C"], correct: 2 },
  { subject: "MATH",    text: "What is 14 + 28?",          options: ["40", "42", "44", "38"], correct: 1 },
];

const TIPS = [
  "Try adding 10 first, then add the rest!",
  "Count backwards from the bigger number.",
  "Think about what you learned in class!",
  "Multiply by breaking it into smaller parts.",
  "Remember the root word — it gives you a clue!",
  "Look at the sky on a clear night for a hint 🌟",
  "Divide step by step — no rush!",
  "Nouns are names of people, places or things.",
  "Think about water when you cook at home 🍳",
  "Round to the nearest 10 to make it easier!",
];

// ── Subject badge color ────────────────────────────────────────────────────────
const subjectColor = (s: string) => {
  if (s === "MATH") return { bg: C.secondary, text: "#ffffff" };
  if (s === "SCIENCE") return { bg: C.tertiary, text: "#fff" };
  return { bg: C.primary, text: "#ffffff" };
};

export default function WeeklyTestQuestionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const total = QUESTIONS.length;
  const q = QUESTIONS[currentQ];
  const tip = TIPS[currentQ];
  const progress = ((currentQ) / total) * 100;
  const sc = subjectColor(q.subject);

  const isCorrect = selected === q.correct;

  const handleConfirm = () => {
    if (selected === null) return;
    if (!confirmed) {
      setConfirmed(true);
      if (isCorrect) setScore((s) => s + 1);
    } else {
      // Move to next
      if (currentQ < total - 1) {
        setCurrentQ((p) => p + 1);
        setSelected(null);
        setConfirmed(false);
      } else {
        // Go to results (step 3)
        router.replace({
          pathname: "/weekly-test-results",
          params: { score: score + (isCorrect ? 1 : 0), total },
        });
      }
    }
  };

  const getOptionStyle = (idx: number) => {
    if (!confirmed) {
      return [
        styles.optionBtn,
        selected === idx && styles.optionSelected,
      ];
    }
    if (idx === q.correct) return [styles.optionBtn, styles.optionCorrect];
    if (idx === selected) return [styles.optionBtn, styles.optionWrong];
    return [styles.optionBtn, styles.optionDimmed];
  };

  const getLabelStyle = (idx: number) => {
    if (!confirmed) return styles.optionLabelDefault;
    if (idx === q.correct) return styles.optionLabelCorrect;
    if (idx === selected) return styles.optionLabelWrong;
    return styles.optionLabelDefault;
  };

  const getValueStyle = (idx: number) => {
    if (!confirmed) return [styles.optionValue, selected === idx && { color: C.primary }];
    if (idx === q.correct) return [styles.optionValue, { color: C.onTertiaryContainer }];
    if (idx === selected) return [styles.optionValue, { color: C.error }];
    return [styles.optionValue, { opacity: 0.4 }];
  };

  const btnLabel = !confirmed
    ? "CONFIRM ANSWER"
    : currentQ < total - 1
    ? "NEXT QUESTION →"
    : "SEE RESULTS 🏆";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Quest</Text>
        <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.8}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB54TLvVhHhiNKXVvuMyYb9hU1tLu3dVcVge7w_oBlMeQRREVTcRFzbvfglC_nLM6Jg0xuSX6ZmilztrbMo5IwZe3V8P8yYpaMdU1Pa50Vfet05pVyvsRGNeXF3pFKsYrpf18J8e-ZWVNiA8IF088KPWKnYhxA0a_cLGhdPgbwqUUPx4rq2oXTqRxs6f-rrdrTd3VL5xkPyM6SfJf9NMzEAtX1Y1eRDJEsGLUbv6KcoHXhgu_0IvxZLOiQEfJX1lKRRe7HU3SsNXQ" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Progress ── */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              Question {currentQ + 1}{" "}
              <Text style={styles.progressTotal}>/ {total}</Text>
            </Text>
            <View style={styles.keepGoingBadge}>
              <Text style={styles.keepGoingText}>KEEP GOING!</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressPadding}>
              <View
                style={[
                  styles.progressFill,
                  { width: ((progress + 10) / 100) * (SCREEN_W - 48 - 12) },
                ]}
              />
            </View>
          </View>
        </View>

        {/* ── Question Card ── */}
        <View style={styles.questionCard}>
          {/* Subject badge — rotated overlay */}
          <View style={styles.subjectBadgeWrap}>
            <View style={[styles.subjectBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.subjectBadgeText, { color: sc.text }]}>
                {q.subject}
              </Text>
            </View>
          </View>

          {/* Question content */}
          <View style={styles.questionContent}>
            <Text style={styles.challengeLabel}>CHALLENGE</Text>
            <Text style={styles.questionText}>{q.text}</Text>
          </View>

          {/* Decorative watermark */}
          <Text style={styles.decorWatermark}>🔢</Text>
        </View>

        {/* ── Options Grid ── */}
        <View style={styles.optionsGrid}>
          {q.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(idx)}
              activeOpacity={0.8}
              onPress={() => !confirmed && setSelected(idx)}
            >
              {/* Letter badge */}
              <View style={[styles.optionLabel, getLabelStyle(idx)]}>
                <Text style={styles.optionLabelText}>{OPTION_LABELS[idx]}</Text>
              </View>
              <Text style={getValueStyle(idx)}>{opt}</Text>
              {/* Correct tick */}
              {confirmed && idx === q.correct && (
                <Text style={styles.optionTick}>✓</Text>
              )}
              {/* Wrong cross */}
              {confirmed && idx === selected && idx !== q.correct && (
                <Text style={styles.optionCross}>✗</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Pro Tip Bubble ── */}
        <View style={styles.tipRow}>
          <View style={styles.tipIconWrap}>
            <Text style={styles.tipIcon}>💡</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>PRO TIP</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Fixed Confirm Button ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.confirmBtn, selected === null && !confirmed && styles.confirmBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleConfirm}
          disabled={selected === null && !confirmed}
        >
          <Text style={styles.confirmBtnText}>{btnLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.surface,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: C.primary, fontWeight: "700" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: C.primary },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.primaryContainer,
    backgroundColor: C.primaryContainer,
  },

  // ── Scroll ──
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },

  // ── Progress ──
  progressSection: { marginBottom: 24 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  progressLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
  },
  progressTotal: {
    fontSize: 17,
    fontWeight: "500",
    color: C.outline,
  },
  keepGoingBadge: {
    backgroundColor: C.tertiaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  keepGoingText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.onTertiaryContainer,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 24,
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
    overflow: "hidden",
  },
  progressPadding: {
    flex: 1,
    padding: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.tertiary,
    borderRadius: 8,
  },

  // ── Question Card ──
  questionCard: {
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    overflow: "visible",
    borderWidth: 1,
    borderColor: "#d3cabc" + "26",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
    position: "relative",
  },
  subjectBadgeWrap: {
    position: "absolute",
    top: -14,
    left: 12,
    transform: [{ rotate: "-5deg" }],
    zIndex: 10,
  },
  subjectBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  subjectBadgeText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  questionContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  challengeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.onSurfaceVariant,
    letterSpacing: 3,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "900",
    color: C.onSurface,
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  decorWatermark: {
    position: "absolute",
    bottom: -8,
    right: 8,
    fontSize: 72,
    opacity: 0.08,
  },

  // ── Options Grid ──
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 28,
  },
  optionBtn: {
    width: "46%",
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    position: "relative",
  },
  optionSelected: {
    borderColor: C.primaryFixedDim,
    backgroundColor: C.primaryContainer + "66",
  },
  optionCorrect: {
    borderColor: C.tertiary,
    backgroundColor: C.tertiaryContainer,
  },
  optionWrong: {
    borderColor: C.error,
    backgroundColor: C.errorContainer,
  },
  optionDimmed: {
    opacity: 0.45,
  },

  // Option letter badge
  optionLabel: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabelDefault: {},
  optionLabelCorrect: { backgroundColor: C.tertiary },
  optionLabelWrong: { backgroundColor: C.error },
  optionLabelText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.outline,
  },

  optionValue: {
    fontSize: 20,
    fontWeight: "900",
    color: C.onSurface,
    marginTop: 8,
  },

  optionTick: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 18,
    color: C.tertiary,
    fontWeight: "900",
  },
  optionCross: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 18,
    color: C.error,
    fontWeight: "900",
  },

  // ── Pro Tip ──
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 8,
  },
  tipIconWrap: {
    width: 44,
    height: 44,
    backgroundColor: C.secondaryContainer,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipIcon: { fontSize: 20 },
  tipContent: { flex: 1 },
  tipLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.secondary,
    letterSpacing: 1,
    marginBottom: 3,
  },
  tipText: {
    fontSize: 14,
    fontWeight: "500",
    color: C.onSurfaceVariant,
    lineHeight: 20,
  },

  // ── Bottom Bar ──
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: "transparent",
  },
  confirmBtn: {
    backgroundColor: C.primary,
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  confirmBtnDisabled: {
    opacity: 0.45,
  },
  confirmBtnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
