import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { authApi } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const level = user?.level ?? 1;
  const fuel = user?.fuel ?? 350;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((fuel % 500) / 500) * 100)));
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success) setUser(res.data?.user || res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#141779" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* TopAppBar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <MaterialIcons name="rocket-launch" size={24} color="#141779" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Progress</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7} onPress={() => router.push("/profile")}>
          <MaterialIcons name="account-circle" size={28} color="#141779" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Section: Level & Circular Progress */}
        <View style={styles.heroSection}>
          <View style={styles.progressRingContainer}>
            <Svg height="192" width="192" viewBox="0 0 192 192" style={{ transform: [{ rotate: "-90deg" }] }}>
              <Circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#eceef0"
                strokeWidth="12"
                fill="transparent"
              />
              <Circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#2addcd"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>
            <View style={styles.progressRingContent}>
              <Text style={styles.levelLabel}>LEVEL</Text>
              <Text style={styles.levelValue}>{level}</Text>
              <Text style={styles.levelSub}>{progressPercent}% to Next</Text>
            </View>
          </View>
        </View>

        {/* Mid Section: Subject Mastery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBJECT MASTERY</Text>
          <View style={styles.glassCard}>
            
            {/* Math */}
            <View style={styles.subjectRow}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>Math</Text>
                <Text style={styles.subjectScore}>92%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '92%', backgroundColor: '#141779' }]} />
              </View>
            </View>

            {/* Science */}
            <View style={styles.subjectRow}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>Science</Text>
                <Text style={styles.subjectScore}>78%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '78%', backgroundColor: '#2addcd' }]} />
              </View>
            </View>

            {/* Vocabulary */}
            <View style={styles.subjectRow}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>Vocabulary</Text>
                <Text style={styles.subjectScore}>85%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '85%', backgroundColor: '#2d328f' }]} />
              </View>
            </View>

          </View>
        </View>

        {/* Bottom Section: Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT ACHIEVEMENTS</Text>
          <View style={styles.achievementsGrid}>
            
            <TouchableOpacity style={styles.achievementCard} activeOpacity={0.8}>
              <View style={[styles.achievementIconBox, { backgroundColor: '#e0e0ff' }]}>
                <MaterialIcons name="workspace-premium" size={28} color="#141779" />
              </View>
              <Text style={styles.achievementText}>Math Ace</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.achievementCard} activeOpacity={0.8}>
              <View style={[styles.achievementIconBox, { backgroundColor: '#57fae9' }]}>
                <MaterialIcons name="local-fire-department" size={28} color="#006a62" />
              </View>
              <Text style={styles.achievementText}>{user?.streakDays || 5} Day Streak</Text>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f7f9fb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#141779", letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 100, gap: 32 },
  
  heroSection: { alignItems: "center", justifyContent: "center" },
  progressRingContainer: { width: 192, height: 192, alignItems: "center", justifyContent: "center", position: "relative" },
  progressRingContent: { position: "absolute", alignItems: "center", justifyContent: "center" },
  levelLabel: { fontSize: 12, fontWeight: "700", color: "#464652", textTransform: "uppercase", letterSpacing: 1 },
  levelValue: { fontSize: 36, fontWeight: "700", color: "#141779", marginVertical: 0 },
  levelSub: { fontSize: 14, fontWeight: "600", color: "#006a62", marginTop: 4 },

  section: { gap: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#464652", letterSpacing: 1, paddingHorizontal: 4 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 20,
  },
  subjectRow: { gap: 8 },
  subjectHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 4 },
  subjectName: { fontSize: 16, fontWeight: "700", color: "#141779" },
  subjectScore: { fontSize: 12, fontWeight: "700", color: "#006a62" },
  progressBarTrack: { height: 12, width: "100%", backgroundColor: "#eceef0", borderRadius: 6, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 6 },
  
  achievementsGrid: { flexDirection: "row", gap: 16 },
  achievementCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  achievementIconBox: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  achievementText: { fontSize: 14, fontWeight: "600", color: "#191c1e", textAlign: "center" },
});
