import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { authApi } from "../services/api";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  tertiary: "#30007f",
  surface: "#ffffff",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerLowest: "#ffffff",
  surfaceContainer: "#eceef0",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  white: "#ffffff",
  background: "#f7f9fb",
};

export default function StudentReport() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Monthly");
  const [user, setUser] = useState<any>(null);

  // Animations for progress bars
  const mathAnim = useRef(new Animated.Value(0)).current;
  const scienceAnim = useRef(new Animated.Value(0)).current;
  const englishAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success) {
          setUser(res.data?.user || res.data);
        }
      } catch (err) {
        console.error("Failed to load user in report", err);
      }
    };
    loadUser();

    Animated.parallel([
      Animated.timing(mathAnim, { toValue: 92, duration: 1000, useNativeDriver: false }),
      Animated.timing(scienceAnim, { toValue: 88, duration: 1000, useNativeDriver: false }),
      Animated.timing(englishAnim, { toValue: 95, duration: 1000, useNativeDriver: false }),
    ]).start();
  }, [mathAnim, scienceAnim, englishAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={20} color={C.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerSubtitle}>ACADEMIC YEAR 2023-24</Text>
            <Text style={styles.headerTitle}>Student Report</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="more-vert" size={24} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Summary */}
        <View style={styles.profileSummary}>
          <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.7} style={styles.profileImageWrap}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsw5QM4ckfgV4r47k9iglGsrwO7NzpEQqaFt2Wapg5Z_iullDNHZxy8K3lBwww8wTKzKsTW4HZXRyvol6fP1If9EMT3e3dkzP8Txldwtfnye-t2qm4J4TE2zMuerwTlchYoY6EmHwK-sdI3eWHPDC4EZCEILl48U94yr2KphtMG5vQoDZPck6qzgiTs5t4IyRDqjUvKFWgeaT59xOPjiNk0I42Nx8wcybHADz8X62nhcVwziGPykMqrGGRBq_KqDJeU99U9Ss8hg" }}
              style={styles.profileImage}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>A+</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.profileTextWrap}>
            <Text style={styles.studentName}>{user?.childName || "Explorer"}</Text>
            <Text style={styles.studentInfo}>Lvl {user?.level || 1} Explorer</Text>
          </View>
          <View style={styles.overallWrap}>
            <Text style={styles.overallPercent}>92.4%</Text>
            <Text style={styles.overallLabel}>OVERALL PERCENT</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Tabs */}
        <View style={styles.tabsContainer}>
          {["Monthly", "Quarterly", "Annual"].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.premiumCard}>
            <View style={styles.statIconRow}>
              <MaterialIcons name="verified-user" size={18} color={C.secondary} />
              <Text style={styles.statLabel}>ATTENDANCE</Text>
            </View>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statDesc}>2 days leave taken</Text>
          </View>
          <View style={styles.premiumCard}>
            <View style={styles.statIconRow}>
              <MaterialIcons name="workspace-premium" size={18} color={C.primary} />
              <Text style={styles.statLabel}>STANDING</Text>
            </View>
            <Text style={styles.statValue}>3rd <Text style={styles.statValueLight}>Rank</Text></Text>
            <Text style={styles.statDesc}>Out of 42 students</Text>
          </View>
        </View>

        {/* Subject Performance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subject Performance</Text>
            <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
              <MaterialIcons name="arrow-forward" size={14} color={C.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.subjectsList}>
            {/* Maths */}
            <View style={styles.subjectItem}>
              <View style={[styles.subjectIconWrap, { backgroundColor: 'rgba(20, 23, 121, 0.05)', borderColor: 'rgba(20, 23, 121, 0.1)' }]}>
                <MaterialIcons name="calculate" size={20} color={C.primary} />
              </View>
              <View style={styles.subjectRight}>
                <View style={styles.subjectLabelRow}>
                  <Text style={styles.subjectName}>Mathematics</Text>
                  <Text style={[styles.subjectScore, { color: C.primary }]}>92/100</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { backgroundColor: C.primary, width: mathAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
                </View>
              </View>
            </View>

            {/* Science */}
            <View style={styles.subjectItem}>
              <View style={[styles.subjectIconWrap, { backgroundColor: 'rgba(0, 106, 98, 0.05)', borderColor: 'rgba(0, 106, 98, 0.1)' }]}>
                <MaterialIcons name="biotech" size={20} color={C.secondary} />
              </View>
              <View style={styles.subjectRight}>
                <View style={styles.subjectLabelRow}>
                  <Text style={styles.subjectName}>Science</Text>
                  <Text style={[styles.subjectScore, { color: C.secondary }]}>88/100</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { backgroundColor: C.secondary, width: scienceAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
                </View>
              </View>
            </View>

            {/* English */}
            <View style={styles.subjectItem}>
              <View style={[styles.subjectIconWrap, { backgroundColor: 'rgba(48, 0, 127, 0.05)', borderColor: 'rgba(48, 0, 127, 0.1)' }]}>
                <MaterialIcons name="translate" size={20} color={C.tertiary} />
              </View>
              <View style={styles.subjectRight}>
                <View style={styles.subjectLabelRow}>
                  <Text style={styles.subjectName}>English Literature</Text>
                  <Text style={[styles.subjectScore, { color: C.tertiary }]}>95/100</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { backgroundColor: C.tertiary, width: englishAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Growth Timeline */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Growth Timeline</Text>
          <View style={styles.timelineList}>
            {/* Item 1 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineIcon, { borderColor: C.secondary }]}>
                <MaterialIcons name="trending-up" size={18} color={C.secondary} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>Critical Thinking</Text>
                  <Text style={styles.timelineScore}>+12%</Text>
                </View>
                <Text style={styles.timelineDesc}>
                  Improved logical reasoning and problem decomposition skills in science projects.
                </Text>
              </View>
            </View>

            {/* Item 2 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLine} />
              <View style={[styles.timelineIcon, { borderColor: C.primary }]}>
                <MaterialIcons name="auto-stories" size={18} color={C.primary} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>Vocabulary Expansion</Text>
                  <Text style={styles.timelineScore}>+15%</Text>
                </View>
                <Text style={styles.timelineDesc}>
                  Demonstrated mastery of 50+ new academic terms this month.
                </Text>
              </View>
            </View>

            {/* Item 3 */}
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, { borderColor: C.outlineVariant }]}>
                <MaterialIcons name="groups" size={18} color={C.outline} />
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>Team Collaboration</Text>
                  <Text style={styles.timelineScore}>+8%</Text>
                </View>
                <Text style={styles.timelineDesc}>
                  Actively led 2 group study sessions for Social Studies finals.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
          <MaterialIcons name="file-download" size={20} color={C.white} />
          <Text style={styles.downloadText}>Download Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
          <MaterialIcons name="ios-share" size={24} color={C.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: C.outline,
    fontFamily: 'Quicksand',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: C.surfaceContainerLowest,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 212, 0.2)',
  },
  profileImageWrap: {
    position: 'relative',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(20, 23, 121, 0.1)',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: C.secondary,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Quicksand',
  },
  profileTextWrap: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  studentInfo: {
    fontSize: 14,
    fontWeight: '500',
    color: C.outline,
    fontFamily: 'Quicksand',
  },
  overallWrap: {
    alignItems: 'flex-end',
  },
  overallPercent: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  overallLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.outline,
    fontFamily: 'Quicksand',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 9999,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9999,
  },
  tabBtnActive: {
    backgroundColor: C.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.outline,
    fontFamily: 'Quicksand',
  },
  tabTextActive: {
    color: C.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  premiumCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f3f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    gap: 4,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.outline,
    fontFamily: 'Quicksand',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  statValueLight: {
    fontSize: 14,
    fontWeight: '500',
    color: C.outline,
  },
  statDesc: {
    fontSize: 11,
    color: C.outline,
    fontFamily: 'Quicksand',
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.primary,
    fontFamily: 'Quicksand',
  },
  subjectsList: {
    gap: 12,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  subjectIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  subjectRight: {
    flex: 1,
  },
  subjectLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  subjectScore: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Quicksand',
  },
  progressBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  timelineList: {},
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 24,
    bottom: 0,
    width: 2,
    backgroundColor: '#e9ecef',
    zIndex: 1,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.onSurface,
    fontFamily: 'Quicksand',
  },
  timelineScore: {
    fontSize: 12,
    fontWeight: '600',
    color: C.secondary,
    fontFamily: 'Quicksand',
  },
  timelineDesc: {
    fontSize: 13,
    color: C.outline,
    fontFamily: 'Quicksand',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(199, 197, 212, 0.2)',
  },
  downloadBtn: {
    flex: 1,
    height: 56,
    backgroundColor: C.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
    fontFamily: 'Quicksand',
  },
  shareBtn: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
