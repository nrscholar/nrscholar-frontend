import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
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

// ── Info cards data ───────────────────────────────────────────────────────────
const INFO_CARDS = [
  {
    emoji: "⏱️",
    bg: C.secondaryContainer,
    iconColor: C.secondary,
    title: "15 Minutes",
    sub: "Quick & Fun",
    offset: false,
  },
  {
    emoji: "📝",
    bg: C.tertiaryContainer,
    iconColor: C.tertiary,
    title: "10 Questions",
    sub: "Science & Math",
    offset: true,
  },
  {
    emoji: "⭐",
    bg: C.primaryContainer,
    iconColor: C.primary,
    title: "50 XP",
    sub: "Earn Rewards",
    offset: false,
  },
];

export default function WeeklyTestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Quest</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.8}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAKpSAluWywp3vdD2mwMWzOmh1M2-26A0Q1Hd3GWlgSKixYxQz78sPhRMymy2vFlwgX07glcvgPYkGRAhIYNlpdcDEjJBAK5ELpJCuM-8qkswYzIY28VN1yaieXrQ8PtFjqu4nM8EnvsHQorCB8l1TqsH1J4aLniQ5KgYTdJYKkdkXEsRcxSSP2UFgHy2t2BWgmKvOoQqKoXuV_yIRW518Sn1qEO7wKGvfQ5FiWCyRPyOn1qB5mw3E1iS0wPrek4CiBJVwGgxelg",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Glow behind icon */}
          <View style={styles.glow} />

          {/* Icon card */}
          <View style={styles.iconCard}>
            <Text style={styles.iconEmoji}>🧪</Text>
          </View>

          <Text style={styles.heroTitle}>Weekly Test</Text>
          <Text style={styles.heroSub}>
            Show what you've learned this week!
          </Text>
        </View>

        {/* Info Cards Row */}
        <View style={styles.infoRow}>
          {INFO_CARDS.map((card, i) => (
            <View
              key={i}
              style={[
                styles.infoCard,
                card.offset && styles.infoCardOffset,
              ]}
            >
              <View
                style={[styles.infoIconWrap, { backgroundColor: card.bg }]}
              >
                <Text style={styles.infoEmoji}>{card.emoji}</Text>
              </View>
              <Text style={styles.infoTitle}>{card.title}</Text>
              <Text style={styles.infoSub}>{card.sub}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/weekly-test-questions")}
          >
            <Text style={styles.startBtnText}>Start Test  ▶</Text>
          </TouchableOpacity>
          <Text style={styles.ctaHint}>READY WHEN YOU ARE!</Text>
        </View>

        {/* Buddy Quote Card */}
        <View style={styles.buddyCard}>
          <View style={styles.buddyQuoteBubble}>
            <Text style={styles.buddyQuoteText}>
              "You're going to do great today! Just take your time." 🌟
            </Text>
            {/* Bubble tail */}
            <View style={styles.bubbleTail} />
          </View>
          <View style={styles.buddyAvatarWrap}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiR2BgZnP9U1oq6qPpVV5d-S3bN6f7WIWUI8SXKsNlLmtPAgl1G3k508oG90n7IoW7ZyLGz0gKcwmptnTlcO5j3qDspH7m57V92MPAZxJrRbX12Uz2Jtux-vGqQj-APsavBI-NHYm0blBPmnxKk4SIVXQGCgWoiUpUoh2TvCAiAV8924abDM_gN9LAmUeMkYN6TO_H9e299jCpv__KD5iiuokBoj7ylZaa7dLqsBnt76T91tTFDNKo0d0VOP2YzaRgKNbwrauiRQ",
              }}
              style={styles.buddyAvatar}
            />
          </View>
        </View>
      </ScrollView>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    fontSize: 22,
    color: C.primary,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.primary,
  },
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
    alignItems: "center",
    gap: 0,
  },

  // ── Hero ──
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  glow: {
    position: "absolute",
    top: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: C.primaryContainer,
    opacity: 0.3,
  },
  iconCard: {
    width: 100,
    height: 100,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d3cabc" + "26",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 6,
    marginBottom: 24,
    transform: [{ rotate: "-2deg" }],
  },
  iconEmoji: {
    fontSize: 52,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: "900",
    color: C.primary,
    letterSpacing: -1,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 50,
  },
  heroSub: {
    fontSize: 17,
    fontWeight: "500",
    color: C.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 280,
  },

  // ── Info Cards ──
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
    width: "100%",
  },
  infoCard: {
    flex: 1,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d3cabc" + "26",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  infoCardOffset: {
    marginTop: 16,
  },
  infoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  infoEmoji: {
    fontSize: 22,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.onSurface,
    textAlign: "center",
    marginBottom: 4,
  },
  infoSub: {
    fontSize: 12,
    fontWeight: "500",
    color: C.onSurfaceVariant,
    textAlign: "center",
  },

  // ── CTA ──
  ctaWrap: {
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
    gap: 16,
  },
  startBtn: {
    width: "100%",
    backgroundColor: C.primary,
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  startBtnText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  ctaHint: {
    fontSize: 11,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 2,
  },

  // ── Buddy Quote ──
  buddyCard: {
    width: "100%",
    marginBottom: 16,
  },
  buddyQuoteBubble: {
    backgroundColor: C.secondaryContainer + "CC",
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    position: "relative",
  },
  buddyQuoteText: {
    fontSize: 15,
    fontWeight: "500",
    color: C.onSecondaryContainer,
    lineHeight: 22,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -10,
    right: 36,
    width: 20,
    height: 20,
    backgroundColor: C.secondaryContainer + "CC",
    transform: [{ rotate: "45deg" }],
  },
  buddyAvatarWrap: {
    alignSelf: "flex-end",
    marginRight: 24,
  },
  buddyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
