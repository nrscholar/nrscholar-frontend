import React from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
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

// ── Skills data ────────────────────────────────────────────────────────────────
const SKILLS = [
  {
    icon: "➕",
    label: "Quick Addition",
    xp: "+15 XP",
    xpColor: C.tertiary,
    progress: 0.8,
    progressColor: C.tertiary,
    iconBg: "#e8ddff",
  },
  {
    icon: "🔢",
    label: "Number Logic",
    xp: "+10 XP",
    xpColor: C.secondary,
    progress: 0.45,
    progressColor: C.secondary,
    iconBg: C.secondaryFixed,
  },
];

// ── Score message ──────────────────────────────────────────────────────────────
const getScoreMessage = (score: number, total: number) => {
  const pct = score / total;
  if (pct === 1) return { title: "Perfect Score! 🏆", sub: "You're an absolute star!" };
  if (pct >= 0.8) return { title: "Great improvement!", sub: "You're becoming a real scholar!" };
  if (pct >= 0.6) return { title: "Good effort! 💪", sub: "Keep practising every day!" };
  return { title: "Nice try! 🌱", sub: "Every attempt makes you stronger!" };
};

const getBuddyMessage = (score: number, total: number) => {
  const pct = score / total;
  if (pct === 1) return `"Wow, a perfect 10! You're unstoppable! Let's try an even harder challenge next week!"`;
  if (pct >= 0.8) return `"Whoa! That's ${score} out of ${total}! Your skills are growing like a beanstalk. Ready for more?"`;
  if (pct >= 0.6) return `"You got ${score} right! With a little more practice, you'll be at the top. Keep going!"`;
  return `"You scored ${score} this time. Don't worry — every great scholar starts somewhere. Try again!"`;
};

export default function WeeklyTestResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const score = Number(params.score ?? 8);
  const total = Number(params.total ?? 10);
  const starsEarned = Math.round((score / total) * 50);
  const msg = getScoreMessage(score, total);
  const buddyMsg = getBuddyMessage(score, total);

  const skillBarWidth = SCREEN_W - 48 - 80 - 32; // screen - px - icon - gap

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Quest</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.8}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbMGIP1JI2ES3lYlVp4vXmvghuvTPOk7bddbFh6hjZ3k7q0zytf93j0LON0VAT4hn24LGgLq3oyDEhIDaEecT43AcjtvopMCW1WGUBMNsgJgZeAirgFrx5UbhN8UCcqjYkYInJMwnrl7ineg2tPQas-QEadIAzndqR79gKwmzKCoMp2FuMREXQaws-7Sw3rnrx7Wavk1KBCTNm2aWdltBEtx3PFXIiyC-fT7nzzRW9-8r0AggIFYPxE-3jNeHFIsAQPkeim7oFvw" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Celebration ── */}
        <View style={styles.heroSection}>
          {/* Background glow blobs */}
          <View style={styles.glowRight} />
          <View style={styles.glowLeft} />

          {/* Star image card */}
          <View style={styles.starCardWrap}>
            <View style={styles.starCard}>
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyUvebv2BdvNRiuk9vxbhiA77xkXBAyqSvwsKAAoxwbT-gqMrPXi73brPL5k6cPw_7mv2oty2chuipoFdgHSiXYFEGNyEu2_NRmQlwi90ury6qcxq9biyOky6-LwYC-9Ma_6TdWG4z6llSm67s3jKHqL7KHjxaOR0T4Euhw7xkCK2vzL2eD5_SjEZFSSY5qhahz7XVATTQXbi3ut_RdWV2PRzXe-c6adNP8eqJ4RiigQYMG0Nn3KV99T0mcERtlbew55Eeu5O-oA" }}
                style={styles.starImage}
              />
            </View>
            {/* Floaters */}
            <Text style={styles.floaterTR}>✨</Text>
            <Text style={styles.floaterML}>🎉</Text>
          </View>

          {/* Headline */}
          <Text style={styles.heroTitle}>{msg.title}</Text>
          <Text style={styles.heroSub}>{msg.sub}</Text>

          {/* Score & Stars Bento Row */}
          <View style={styles.bentoRow}>
            {/* Score Card */}
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardLabel}>YOUR SCORE</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.scoreTotal}>/ {total}</Text>
              </View>
            </View>

            {/* Stars Card */}
            <View style={[styles.starsCard, { transform: [{ rotate: "-2deg" }] }]}>
              <Text style={styles.starsCardLabel}>STARS EARNED</Text>
              <View style={styles.starsRow}>
                <Text style={styles.starsValue}>{starsEarned}</Text>
                <Text style={styles.starEmoji}>⭐</Text>
              </View>
            </View>
          </View>

          {/* Buddy Feedback Bubble */}
          <View style={styles.buddyBubble}>
            <View style={styles.buddyBubbleContent}>
              <View style={styles.buddyIconWrap}>
                <Text style={styles.buddyIcon}>🤖</Text>
              </View>
              <View style={styles.buddyTextWrap}>
                <Text style={styles.buddyName}>Professor Paws says:</Text>
                <Text style={styles.buddyText}>{buddyMsg}</Text>
              </View>
            </View>
            {/* Bubble tail */}
            <View style={styles.bubbleTail} />
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.retryBtn}
              activeOpacity={0.85}
              onPress={() => router.replace("/weekly-test-questions")}
            >
              <Text style={styles.retryBtnText}>🔄  Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              activeOpacity={0.85}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.homeBtnText}>🏠  Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Skills Levelled Up ── */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillsTitle}>Skills Levelled Up</Text>

          <View style={styles.skillsList}>
            {SKILLS.map((skill, i) => (
              <View key={i} style={styles.skillCard}>
                <View style={[styles.skillIconWrap, { backgroundColor: skill.iconBg }]}>
                  <Text style={styles.skillIcon}>{skill.icon}</Text>
                </View>
                <View style={styles.skillInfo}>
                  <View style={styles.skillTopRow}>
                    <Text style={styles.skillLabel}>{skill.label}</Text>
                    <Text style={[styles.skillXp, { color: skill.xpColor }]}>{skill.xp}</Text>
                  </View>
                  <View style={styles.skillTrack}>
                    <View
                      style={[
                        styles.skillFill,
                        {
                          backgroundColor: skill.progressColor,
                          width: skillBarWidth * skill.progress,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 22, color: C.primary, fontWeight: "700" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: C.primary },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.primaryFixed,
    backgroundColor: C.primaryContainer,
  },

  // ── Scroll ──
  scroll: {
    paddingTop: 8,
  },

  // ── Hero ──
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  glowRight: {
    position: "absolute",
    top: -40,
    right: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: C.primaryContainer,
    opacity: 0.3,
  },
  glowLeft: {
    position: "absolute",
    top: 160,
    left: -80,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: C.secondaryContainer,
    opacity: 0.4,
  },

  // Star card
  starCardWrap: {
    marginBottom: 24,
    position: "relative",
  },
  starCard: {
    width: 160,
    height: 160,
    backgroundColor: C.tertiaryContainer,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "3deg" }],
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.07,
    shadowRadius: 30,
    elevation: 6,
  },
  starImage: {
    width: 110,
    height: 110,
    transform: [{ rotate: "-3deg" }],
  },
  floaterTR: {
    position: "absolute",
    top: -12,
    right: -12,
    fontSize: 32,
  },
  floaterML: {
    position: "absolute",
    top: "50%",
    left: -24,
    fontSize: 26,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: C.primary,
    letterSpacing: -0.8,
    textAlign: "center",
    lineHeight: 44,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 17,
    fontWeight: "500",
    color: C.secondary,
    textAlign: "center",
    marginBottom: 28,
  },

  // Bento row
  bentoRow: {
    flexDirection: "row",
    gap: 14,
    width: "100%",
    marginBottom: 28,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#d3cabc" + "33",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
  },
  scoreCardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: "900",
    color: C.primary,
    lineHeight: 72,
  },
  scoreTotal: {
    fontSize: 28,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 8,
  },
  starsCard: {
    flex: 1,
    backgroundColor: C.primaryContainer,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: C.primary + "33",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
  },
  starsCardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.onPrimaryContainer,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starsValue: {
    fontSize: 64,
    fontWeight: "900",
    color: C.onPrimaryContainer,
    lineHeight: 72,
  },
  starEmoji: {
    fontSize: 40,
  },

  // Buddy bubble
  buddyBubble: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
    marginBottom: 28,
    position: "relative",
  },
  buddyBubbleContent: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  buddyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.secondaryFixed,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  buddyIcon: { fontSize: 22 },
  buddyTextWrap: { flex: 1 },
  buddyName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 4,
  },
  buddyText: {
    fontSize: 14,
    fontWeight: "400",
    color: C.onSurfaceVariant,
    lineHeight: 22,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -10,
    left: 36,
    width: 20,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },

  // CTA row
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    paddingBottom: 32,
  },
  retryBtn: {
    flex: 1,
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
  retryBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  homeBtn: {
    flex: 1,
    backgroundColor: C.secondary,
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: "center",
    shadowColor: C.secondaryShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  homeBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  // ── Skills Section ──
  skillsSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skillsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.onSurface,
    marginBottom: 20,
  },
  skillsList: { gap: 14 },
  skillCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  skillIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  skillIcon: { fontSize: 22 },
  skillInfo: { flex: 1, gap: 8 },
  skillTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: C.onSurface,
  },
  skillXp: {
    fontSize: 13,
    fontWeight: "700",
  },
  skillTrack: {
    height: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    overflow: "hidden",
  },
  skillFill: {
    height: "100%",
    borderRadius: 6,
  },
});
