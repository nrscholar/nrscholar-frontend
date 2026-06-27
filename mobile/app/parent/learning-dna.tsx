import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { authApi } from "../services/api";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  primaryContainer: "#2d328f",
  onPrimaryContainer: "#9ba1ff",
  surface: "#f7f9fb",
  surfaceVariant: "#e0e3e5",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  white: "#ffffff",
  background: "#f7f9fb",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

export default function LearningDNA() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = React.useState<any>(null);

  // Ring configurations
  const radius1 = 80; // Practice
  const radius2 = 62; // Visual
  const radius3 = 44; // Reading
  
  const circ1 = 2 * Math.PI * radius1;
  const circ2 = 2 * Math.PI * radius2;
  const circ3 = 2 * Math.PI * radius3;

  const target1 = circ1 * (1 - 0.91);
  const target2 = circ2 * (1 - 0.82);
  const target3 = circ3 * (1 - 0.54);

  const anim1 = useRef(new Animated.Value(circ1)).current;
  const anim2 = useRef(new Animated.Value(circ2)).current;
  const anim3 = useRef(new Animated.Value(circ3)).current;

  // Pulse animation for badges
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success) {
          setUser(res.data?.user || res.data);
        }
      } catch (err) {
        console.error("Failed to load user in learning-dna", err);
      }
    };
    loadUser();

    Animated.parallel([
      Animated.timing(anim1, { toValue: target1, duration: 1500, useNativeDriver: true }),
      Animated.timing(anim2, { toValue: target2, duration: 1500, useNativeDriver: true }),
      Animated.timing(anim3, { toValue: target3, duration: 1500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.7, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [anim1, anim2, anim3, pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ marginRight: 8 }}>
            <MaterialIcons name="arrow-back" size={24} color={C.primary} />
          </TouchableOpacity>
          <MaterialIcons name="psychology" size={28} color={C.primary} />
          <Text style={styles.headerTitle}>{user?.childName || "Explorer"}'s DNA</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/parent/notifications")}>
          <MaterialIcons name="notifications" size={24} color={C.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Learning DNA Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Learning DNA</Text>
            <Text style={styles.updateLabel}>Updated Today</Text>
          </View>
          <View style={[styles.glassCard, styles.dnaCard]}>
            {/* Progress Rings */}
            <View style={styles.ringsContainer}>
              <Svg width="192" height="192" viewBox="0 0 192 192" style={{ transform: [{ rotate: "-90deg" }] }}>
                {/* Practice Track */}
                <Circle cx="96" cy="96" r={radius1} stroke="rgba(224, 227, 229, 0.5)" strokeWidth="12" fill="transparent" />
                <AnimatedCircle cx="96" cy="96" r={radius1} stroke={C.secondary} strokeWidth="12" fill="transparent" strokeDasharray={circ1} strokeDashoffset={anim1} strokeLinecap="round" />
                
                {/* Visual Track */}
                <Circle cx="96" cy="96" r={radius2} stroke="rgba(224, 227, 229, 0.5)" strokeWidth="12" fill="transparent" />
                <AnimatedCircle cx="96" cy="96" r={radius2} stroke={C.primary} strokeWidth="12" fill="transparent" strokeDasharray={circ2} strokeDashoffset={anim2} strokeLinecap="round" />
                
                {/* Reading Track */}
                <Circle cx="96" cy="96" r={radius3} stroke="rgba(224, 227, 229, 0.5)" strokeWidth="12" fill="transparent" />
                <AnimatedCircle cx="96" cy="96" r={radius3} stroke={C.onPrimaryContainer} strokeWidth="12" fill="transparent" strokeDasharray={circ3} strokeDashoffset={anim3} strokeLinecap="round" />
              </Svg>
              <View style={styles.ringsIconCenter}>
                <MaterialIcons name="auto-awesome" size={32} color="rgba(20, 23, 121, 0.4)" />
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendCol}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: C.secondary }]} />
                <View style={styles.legendTextWrap}>
                  <Text style={styles.legendLabel}>Practice Learning</Text>
                  <Text style={[styles.legendValue, { color: C.secondary }]}>91%</Text>
                </View>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: C.primary }]} />
                <View style={styles.legendTextWrap}>
                  <Text style={styles.legendLabel}>Visual Learning</Text>
                  <Text style={[styles.legendValue, { color: C.primary }]}>82%</Text>
                </View>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: C.onPrimaryContainer }]} />
                <View style={styles.legendTextWrap}>
                  <Text style={styles.legendLabel}>Reading Learning</Text>
                  <Text style={[styles.legendValue, { color: C.onPrimaryContainer }]}>54%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="timer" size={24} color={C.secondary} />
              <Text style={styles.statLabel}>Attention Span</Text>
              <Text style={styles.statValue}>14 min</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="speed" size={24} color={C.primary} />
              <Text style={styles.statLabel}>Learning Speed</Text>
              <Text style={styles.statValue}>Above Avg</Text>
            </View>
            <View style={[styles.statCard, styles.statCardFull]}>
              <View style={styles.statRowLabel}>
                <MaterialIcons name="schedule" size={20} color={C.onPrimaryContainer} />
                <Text style={styles.statLabel}>Best Learning Time</Text>
              </View>
              <Text style={styles.statValue}>6 PM - 7 PM</Text>
            </View>
          </View>
        </View>

        {/* Personality DNA */}
        <View style={styles.section}>
          <View style={styles.personalityHeader}>
            <Text style={styles.sectionTitle}>Personality DNA</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI GEN</Text>
            </View>
          </View>
          <View style={styles.tagsContainer}>
            <Animated.View style={[styles.glassCard, styles.tagBox, { opacity: pulseAnim }]}>
              <MaterialIcons name="stars" size={18} color={C.secondary} />
              <Text style={styles.tagText}>Curious Learner</Text>
            </Animated.View>
            <View style={[styles.glassCard, styles.tagBox]}>
              <MaterialIcons name="visibility" size={18} color={C.primary} />
              <Text style={styles.tagText}>Fast Visual Processor</Text>
            </View>
            <View style={[styles.glassCard, styles.tagBox]}>
              <MaterialIcons name="terminal" size={18} color={C.onPrimaryContainer} />
              <Text style={styles.tagText}>Strong Practical Learner</Text>
            </View>
          </View>

          {/* AI Insights Summary */}
          <View style={[styles.glassCard, styles.aiInsightBox]}>
            <View style={styles.aiInsightRow}>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzUvQ64WDG6qt2kDcZCgXsi81kCq1ZsPPkNEFLSuIP3f6Yx40dRiaTaOrWvBp6xoHg4jUitYYfQmenGQGNTIespnhK8TBOhnTvVahkmNG2lyFygUccbdBjjIexTMk9VRmCAb5JSN_DvTjwA8pEOL0cDobBUkuGsSW9hSDUPD5wYLaKHLzGwC2xTnbo58Wew7DjfzvktCu0-pWorP9FMNSOk-yoJn3H53wTPNEpm3PfiGmnLiEBhRFbthJE0XcnO-WaZKecjYhbSw" }} 
                style={styles.aiImage} 
              />
              <Text style={styles.aiQuote}>
                "{user?.childName || "Explorer"}, your cognitive pattern shows exceptional retention during evening hours when solving hands-on challenges. Focus on visual simulators to maximize your 82% visual bias."
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/dashboard')}>
          <MaterialIcons name="analytics" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive} activeOpacity={0.9}>
          <View style={styles.activeIconWrap}>
            <MaterialIcons name="science" size={20} color={C.onSecondaryContainer} />
            <Text style={styles.navTextActive}>DNA</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/report')}>
          <MaterialIcons name="assessment" size={24} color={C.onSurfaceVariant} />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingTop: 24,
    paddingBottom: 120,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  updateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.secondary,
    fontFamily: 'Quicksand',
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dnaCard: {
    padding: 24,
    alignItems: 'center',
    gap: 24,
    shadowColor: C.secondaryContainer,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  ringsContainer: {
    width: 192,
    height: 192,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringsIconCenter: {
    position: 'absolute',
  },
  legendCol: {
    gap: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  legendTextWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  legendValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Quicksand',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    gap: 8,
  },
  statCardFull: {
    minWidth: '100%',
  },
  statRowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  personalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiBadge: {
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onSecondaryContainer,
    fontFamily: 'Quicksand',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  aiInsightBox: {
    marginTop: 16,
    backgroundColor: 'rgba(45, 50, 143, 0.05)',
    padding: 24,
  },
  aiInsightRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  aiImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: C.white,
  },
  aiQuote: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    fontFamily: 'Quicksand',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(247, 249, 251, 0.9)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingBottom: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    fontFamily: 'Quicksand',
    marginTop: 4,
  },
  navItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.secondaryContainer,
    borderRadius: 9999,
    shadowColor: C.secondaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  activeIconWrap: {
    alignItems: 'center',
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: C.onSecondaryContainer,
    fontFamily: 'Quicksand',
    marginTop: 2,
  },
});
