import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { parentApi } from "../services/api";

const C = {
  primary: "#141779",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  tertiary: "#30007f",
  surface: "#f7f9fb",
  white: "#ffffff",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  onSurfaceVariant: "#464652",
  error: "#ba1a1a",
  orange: "#ff9f43",
  success: "#20c997",
};

const ACTIVITY_ICONS: Record<string, string> = {
  quiz: "quiz",
  battle: "sports-kabaddi",
  scan: "document-scanner",
  "good-habits": "self-improvement",
  assessment: "assignment",
};

const ACTIVITY_COLORS: Record<string, string> = {
  quiz: C.primary,
  battle: "#e53935",
  scan: C.secondary,
  "good-habits": C.orange,
  assessment: C.tertiary,
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseDate(isoString: string): Date | null {
  try {
    return new Date(isoString);
  } catch {
    return null;
  }
}

/** Returns a date-section label: "Today", "Yesterday", or "DD MMM YYYY" */
function getSectionLabel(isoString: string, todayDate: Date): string {
  const d = parseDate(isoString);
  if (!d) return "Unknown Date";

  const localDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayLocal = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const diffDays = Math.round((todayLocal.getTime() - localDate.getTime()) / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: diffDays > 365 ? "numeric" : undefined,
  });
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function getScoreColor(correct: number, total: number): string {
  if (total === 0) return C.outline;
  const pct = (correct / total) * 100;
  if (pct >= 80) return C.success;
  if (pct >= 50) return C.orange;
  return C.error;
}

/** Group a flat activities list into SectionList sections by local date */
function groupByDate(activities: any[], todayDate: Date) {
  const sectionMap = new Map<string, any[]>();

  for (const act of activities) {
    const label = getSectionLabel(act.createdAt || "", todayDate);
    if (!sectionMap.has(label)) sectionMap.set(label, []);
    sectionMap.get(label)!.push(act);
  }

  // Preserve descending order (today first), then within each section newest first
  const sections: { title: string; data: any[] }[] = [];
  for (const [title, data] of sectionMap.entries()) {
    sections.push({
      title,
      data: data.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      }),
    });
  }

  return sections;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function KidsActivityScreen() {
  const router = useRouter();
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [engagementHours, setEngagementHours] = useState<string>("—");
  const [engagementTrend, setEngagementTrend] = useState<number | null>(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const hasDataRef = useRef(false);
  useEffect(() => {
    if (sections.length > 0) {
      hasDataRef.current = true;
    }
  }, [sections]);

  const loadActivities = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const tzOffset = -new Date().getTimezoneOffset(); // e.g. IST = +330
      const res = await parentApi.getActivities(tzOffset);
      if (res.success && res.data) {
        const acts: any[] = res.data.activities || [];
        const today = new Date();
        setSections(groupByDate(acts, today));
        setTotalSessions(acts.length);
        setEngagementHours(res.data.engagementHours || "—");
        setEngagementTrend(res.data.engagementTrend ?? null);
      }
    } catch (e) {
      console.error("Failed to fetch activities", e);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadActivities(hasDataRef.current);
    }, [loadActivities])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadActivities();
  };

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const id = String(item._id || item.createdAt || Math.random());
    const isExpanded = expandedId === id;
    const accentColor = ACTIVITY_COLORS[item.type] || C.primary;
    const iconName = (ACTIVITY_ICONS[item.type] || "school") as any;
    const score = item.correctQuestions ?? 0;
    const total = item.totalQuestions ?? 0;
    const pct = total > 0 ? Math.round((score / total) * 100) : null;
    const scoreColor = pct !== null ? getScoreColor(score, total) : C.outline;

    return (
      <TouchableOpacity
        style={[styles.card, isExpanded && styles.cardExpanded]}
        activeOpacity={0.8}
        onPress={() => toggleExpand(id)}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: accentColor + "20" }]}>
            <MaterialIcons name={iconName} size={22} color={accentColor} />
          </View>

          <View style={styles.cardMeta}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title || "Practice Session"}
            </Text>
            <View style={styles.cardSubRow}>
              {item.createdAt ? (
                <Text style={styles.cardSubText}>{formatTime(item.createdAt)}</Text>
              ) : null}
              {item.timeTaken > 0 && (
                <>
                  <Text style={styles.dot}>·</Text>
                  <MaterialIcons name="timer" size={12} color={C.outline} />
                  <Text style={styles.cardSubText}>{formatDuration(item.timeTaken)}</Text>
                </>
              )}
            </View>
          </View>

          {/* Score Badge */}
          {pct !== null ? (
            <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{pct}%</Text>
              <Text style={[styles.scoreLabel, { color: scoreColor }]}>
                {score}/{total}
              </Text>
            </View>
          ) : (
            <MaterialIcons
              name={isExpanded ? "expand-less" : "expand-more"}
              size={20}
              color={C.outline}
            />
          )}
        </View>

        {/* Accuracy Progress Bar */}
        {pct !== null && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${pct}%` as any, backgroundColor: scoreColor },
              ]}
            />
          </View>
        )}

        {/* Expanded Question Breakdown */}
        {isExpanded && Array.isArray(item.details) && item.details.length > 0 && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsHeader}>Question Breakdown</Text>
            {item.details.map((d: any, qi: number) => (
              <View key={qi} style={styles.detailRow}>
                <View
                  style={[
                    styles.detailDot,
                    { backgroundColor: d.isCorrect ? C.success : C.error },
                  ]}
                />
                <Text style={styles.detailText} numberOfLines={2}>
                  {d.questionText || `Question ${qi + 1}`}
                </Text>
                <MaterialIcons
                  name={d.isCorrect ? "check-circle" : "cancel"}
                  size={16}
                  color={d.isCorrect ? C.success : C.error}
                  style={{ flexShrink: 0 }}
                />
              </View>
            ))}
          </View>
        )}

        {pct !== null && (
          <TouchableOpacity onPress={() => toggleExpand(id)} style={styles.expandToggle}>
            <Text style={styles.expandText}>
              {isExpanded ? "Hide details" : "View questions"}
            </Text>
            <MaterialIcons
              name={isExpanded ? "expand-less" : "expand-more"}
              size={16}
              color={C.primary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => (
    <View style={styles.summaryBanner}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryNum}>{engagementHours}</Text>
        <Text style={styles.summaryLabel}>This Week</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryNum}>{totalSessions}</Text>
        <Text style={styles.summaryLabel}>Total Sessions</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text
          style={[
            styles.summaryNum,
            {
              color:
                engagementTrend === null
                  ? C.outline
                  : engagementTrend >= 0
                  ? C.success
                  : C.error,
            },
          ]}
        >
          {engagementTrend === null
            ? "—"
            : `${engagementTrend >= 0 ? "+" : ""}${engagementTrend}%`}
        </Text>
        <Text style={styles.summaryLabel}>vs Last Week</Text>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No Activities Yet</Text>
      <Text style={styles.emptyDesc}>
        Activities will appear here after your child completes practice sessions,
        quizzes, or boss battles.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Loading activity logs…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={C.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kids Activity Log</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <MaterialIcons name="refresh" size={22} color={C.primary} />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, idx) => String(item._id || item.createdAt || idx)}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 0,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
    gap: 12,
  },
  loadingText: { fontSize: 14, color: C.outline, fontWeight: "600" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant + "50",
    backgroundColor: C.white,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "800", color: C.primary, letterSpacing: 0.2 },
  refreshBtn: { padding: 4 },

  // Summary Banner
  summaryBanner: {
    flexDirection: "row",
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.outlineVariant + "40",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryNum: { fontSize: 20, fontWeight: "900", color: C.primary },
  summaryLabel: { fontSize: 10, fontWeight: "600", color: C.outline, marginTop: 2 },
  summaryDivider: {
    width: 1,
    height: "80%",
    backgroundColor: C.outlineVariant + "60",
    alignSelf: "center",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: C.outline,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: C.outlineVariant + "50" },

  // List
  scrollContent: { paddingBottom: 40 },

  // Activity Card
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.outlineVariant + "40",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardExpanded: { borderColor: C.primary + "30" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: C.primary },
  cardSubRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  cardSubText: { fontSize: 11, color: C.outline, fontWeight: "500" },
  dot: { color: C.outlineVariant, fontSize: 12 },

  // Score Badge
  scoreBadge: {
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 50,
  },
  scoreNum: { fontSize: 15, fontWeight: "900" },
  scoreLabel: { fontSize: 9, fontWeight: "700", opacity: 0.8 },

  // Progress bar
  progressTrack: {
    height: 5,
    backgroundColor: "rgba(20,23,121,0.08)",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: { height: "100%", borderRadius: 3 },

  // Expand toggle
  expandToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 2,
  },
  expandText: { fontSize: 12, color: C.primary, fontWeight: "600" },

  // Details
  detailsBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant + "40",
    paddingTop: 10,
    gap: 8,
  },
  detailsHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: C.outline,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  detailText: { flex: 1, fontSize: 12, color: C.onSurfaceVariant, lineHeight: 18 },

  // Empty state
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDesc: { fontSize: 13, color: C.outline, textAlign: "center", lineHeight: 20 },
});
