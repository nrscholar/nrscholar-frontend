import React, { useEffect, useRef } from "react";
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
import Svg, { Path } from "react-native-svg";
import { authApi } from "../services/api";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  primaryContainer: "#2d328f",
  onPrimaryContainer: "#9ba1ff",
  onPrimary: "#ffffff",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  surface: "#f7f9fb",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  white: "#ffffff",
  background: "#f7f9fb",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
};

export default function EarlyWarningSystem() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = React.useState<any>(null);
  
  // Pulse animation for the red dot
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Dash offset for the chart
  const pathAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success) {
          setUser(res.data?.user || res.data);
        }
      } catch (err) {
        console.error("Failed to load user in early-warning", err);
      }
    };
    loadUser();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    Animated.timing(pathAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [pulseAnim, pathAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Early Warning System</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/profile")}>
          <MaterialIcons name="account-circle" size={24} color={C.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero: AI Insights Summary */}
        <View style={styles.heroCard}>
          <View style={styles.heroBlob} />
          <View style={styles.heroIconWrap}>
            <MaterialIcons name="psychology" size={24} color={C.onPrimaryContainer} />
          </View>
          <Text style={styles.heroSubLabel}>AI INSIGHTS SUMMARY</Text>
          <View style={styles.attentionRow}>
            <Text style={styles.heroTitle}>Attention Needed</Text>
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
          </View>
          <Text style={styles.heroDesc}>
            We've identified 2 key areas where {user?.childName || "your child"} might need extra support this week.
          </Text>
        </View>

        {/* Risk Alerts Bento Grid */}
        <View style={styles.grid}>
          {/* Math Card */}
          <View style={[styles.glassCard, styles.riskGlow]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.subjectIconWrap}>
                  <MaterialIcons name="calculate" size={20} color={C.onSecondaryContainer} />
                </View>
                <View>
                  <Text style={styles.subjectTitle}>Maths</Text>
                  <Text style={styles.subjectDesc}>Topic: Basic Arithmetic</Text>
                </View>
              </View>
              <View style={styles.riskBadge}>
                <Text style={styles.riskBadgeText}>MEDIUM RISK</Text>
              </View>
            </View>

            <View style={styles.chartSection}>
              <View style={styles.chartLabelsRow}>
                <Text style={styles.chartMainText}>Subtraction mastery only 42%</Text>
                <View style={styles.trendRow}>
                  <MaterialIcons name="trending-down" size={14} color={C.error} />
                  <Text style={styles.trendText}>Confidence Drop</Text>
                </View>
              </View>
              <View style={styles.chartContainer}>
                <Svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="none">
                  <AnimatedPath
                    d="M0,10 L40,15 L80,5 L120,25 L160,35 L200,45"
                    fill="none"
                    stroke={C.error}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={200}
                    strokeDashoffset={pathAnim}
                  />
                </Svg>
              </View>
            </View>
          </View>

          {/* Recommendation Card */}
          <View style={styles.recommendationCard}>
            <View style={styles.recHeaderRow}>
              <MaterialIcons name="lightbulb" size={20} color={C.onPrimaryContainer} />
              <Text style={styles.recTitle}>NEXT STEPS</Text>
            </View>
            <Text style={styles.recDesc}>
              Practice subtraction for 15 mins daily for 5 days to regain momentum.
            </Text>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
              <MaterialIcons name="calendar-month" size={20} color={C.onSecondaryContainer} />
              <Text style={styles.actionBtnText}>Schedule Practice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/dashboard')}>
          <MaterialIcons name="dashboard" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="analytics" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="notifications-active" size={24} color={C.secondary} />
          <Text style={[styles.navText, { color: C.secondary, fontWeight: '700' }]}>Alerts</Text>
          <View style={styles.activeDot} />
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
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 24,
  },
  heroCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlob: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(87, 250, 233, 0.2)',
    borderRadius: 64,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroSubLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.error,
  },
  heroDesc: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
  },
  riskGlow: {
    shadowColor: C.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  subjectDesc: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  riskBadge: {
    backgroundColor: C.errorContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onErrorContainer,
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  chartSection: {
    gap: 12,
  },
  chartLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartMainText: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.error,
    fontFamily: 'Quicksand',
    marginLeft: 4,
  },
  chartContainer: {
    height: 48,
    width: '100%',
  },
  recommendationCard: {
    backgroundColor: C.primaryContainer,
    borderRadius: 16,
    padding: 20,
  },
  recHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onPrimaryContainer,
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
  },
  recDesc: {
    fontSize: 18,
    fontWeight: '500',
    color: C.onPrimary,
    fontFamily: 'Quicksand',
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: C.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSecondaryContainer,
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
