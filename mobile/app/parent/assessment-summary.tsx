import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { authApi } from "../services/api";

const { width } = Dimensions.get("window");

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryFixed: "#57fae9",
  secondaryFixedDim: "#2addcd",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  tertiaryContainer: "#471ba5",
  tertiaryFixed: "#e8ddff",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  surface: "#f7f9fb",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
  background: "#f7f9fb",
  onPrimary: "#ffffff",
};

export default function ParentDailyAssessment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success) {
          setUser(res.data?.user || res.data);
        }
      } catch (err) {
        console.error("Failed to load user in assessment-summary", err);
      }
    };
    loadUser();
  }, []);

  const masteryProgress = 92;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (masteryProgress / 100) * circumference;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Aesthetic Decoration */}
      <View style={[styles.blurBlob, styles.blobTop]} />
      <View style={[styles.blurBlob, styles.blobBottom]} />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Assessment</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/profile")}>
          <MaterialIcons name="account-circle" size={24} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Today's Summary Card */}
        <View style={[styles.glassCard, styles.mainCard]}>
          <View style={styles.cardBgBlob} />
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.dateLabel}>TODAY, MAY 18</Text>
              <Text style={styles.cardHeroTitle}>{user?.childName || "Explorer"}'s Journey</Text>
            </View>
            <View style={styles.rocketIconWrap}>
              <MaterialIcons name="rocket-launch" size={24} color={C.primary} />
            </View>
          </View>

          <View style={styles.statsRow}>
            {/* Progress Orbit */}
            <View style={styles.orbitContainer}>
              <View style={styles.orbitInnerBg}>
                <Text style={styles.orbitPercent}>{masteryProgress}%</Text>
                <Text style={styles.orbitLabel}>MASTERY</Text>
              </View>
              <Svg width="112" height="112" viewBox="0 0 112 112" style={{ position: 'absolute', transform: [{ rotate: "-90deg" }] }}>
                <Circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke={C.secondary}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <View style={styles.statsCol}>
              <View style={styles.statItem}>
                <MaterialIcons name="auto-stories" size={20} color={C.secondary} />
                <View>
                  <Text style={styles.statMiniLabel}>TOPIC</Text>
                  <Text style={styles.statValue}>Solar System</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="stars" size={20} color={C.tertiaryContainer} />
                <View>
                  <Text style={styles.statMiniLabel}>STARS EARNED</Text>
                  <Text style={styles.statValue}>240</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Key Insights */}
          <View style={styles.insightsSection}>
            <View style={styles.insightsHeader}>
              <MaterialIcons name="psychology" size={18} color={C.primary} />
              <Text style={styles.insightsTitle}>Key Insights</Text>
            </View>
            <View style={styles.insightBoxes}>
              <View style={[styles.insightBox, styles.insightPositive]}>
                <MaterialIcons name="check-circle" size={20} color={C.secondary} />
                <Text style={styles.insightText}>
                  <Text style={{ fontWeight: '700' }}>Strongest in:</Text> Gravity
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.insightBox, styles.insightNegative]}
                activeOpacity={0.8}
                onPress={() => router.push('/parent/early-warning')}
              >
                <MaterialIcons name="error" size={20} color={C.error} />
                <Text style={styles.insightText}>
                  <Text style={{ fontWeight: '700' }}>Needs practice:</Text> Planet Sizes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8} onPress={() => router.push('/parent/assessment-history')}>
          <Text style={styles.ctaText}>View Assessment History</Text>
          <MaterialIcons name="chevron-right" size={24} color={C.onPrimary} />
        </TouchableOpacity>

        {/* Suggestion Card (Bento Style) */}
        <View style={styles.bentoGrid}>
          <View style={[styles.glassCard, styles.bentoCard]}>
            <View style={[styles.bentoIcon, { backgroundColor: C.tertiaryFixed }]}>
              <MaterialIcons name="menu-book" size={20} color={C.tertiaryContainer} />
            </View>
            <View style={styles.bentoTextWrap}>
              <Text style={styles.bentoLabel}>NEXT LESSON</Text>
              <Text style={styles.bentoValue}>Black Holes</Text>
            </View>
          </View>
          <View style={[styles.glassCard, styles.bentoCard]}>
            <View style={[styles.bentoIcon, { backgroundColor: 'rgba(87, 250, 233, 0.3)' }]}>
              <MaterialIcons name="forum" size={20} color={C.secondary} />
            </View>
            <View style={styles.bentoTextWrap}>
              <Text style={styles.bentoLabel}>ASK LEO</Text>
              <Text style={styles.bentoValue}>"What is a Star?"</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* BottomNavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/dashboard')}>
          <MaterialIcons name="home" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="insights" size={24} color={C.secondary} />
          <Text style={[styles.navText, { color: C.secondary, fontWeight: '700' }]}>Insights</Text>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/report')}>
          <MaterialIcons name="analytics" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/settings')}>
          <MaterialIcons name="settings" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  blurBlob: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.5,
  },
  blobTop: {
    top: 80,
    left: -40,
    backgroundColor: 'rgba(20, 23, 121, 0.05)',
  },
  blobBottom: {
    bottom: 100,
    right: -40,
    backgroundColor: 'rgba(0, 106, 98, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(247, 249, 251, 0.8)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 50,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
  },
  mainCard: {
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBgBlob: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(87, 250, 233, 0.1)',
    borderRadius: 64,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.secondary,
    fontFamily: 'Quicksand',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardHeroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  rocketIconWrap: {
    backgroundColor: 'rgba(20, 23, 121, 0.05)',
    padding: 8,
    borderRadius: 9999,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 32,
  },
  orbitContainer: {
    width: 112,
    height: 112,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitInnerBg: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: C.white,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orbitPercent: {
    fontSize: 30,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  orbitLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  statsCol: {
    flex: 1,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statMiniLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.outline,
    fontFamily: 'Quicksand',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '500',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(199, 197, 212, 0.3)',
    marginBottom: 24,
  },
  insightsSection: {},
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  insightBoxes: {
    gap: 12,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  insightPositive: {
    backgroundColor: 'rgba(87, 250, 233, 0.2)',
    borderColor: 'rgba(87, 250, 233, 0.3)',
  },
  insightNegative: {
    backgroundColor: 'rgba(255, 218, 214, 0.4)',
    borderColor: 'rgba(255, 218, 214, 0.6)',
  },
  insightText: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  ctaBtn: {
    width: '100%',
    backgroundColor: C.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 24,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onPrimary,
    fontFamily: 'Quicksand',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  bentoCard: {
    flex: 1,
    padding: 16,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  bentoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  bentoTextWrap: {
    marginTop: 12,
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.outlineVariant,
    fontFamily: 'Quicksand',
    marginBottom: 2,
  },
  bentoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(247, 249, 251, 0.8)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    width: 60,
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
    marginTop: 4,
  },
  activeDot: {
    position: 'absolute',
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.secondary,
  },
});
