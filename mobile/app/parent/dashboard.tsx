import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { parentApi, authApi } from "../services/api";
import NotificationBell from "../components/NotificationBell";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const C = {
  primary: "#141779",
  primaryContainer: "#2d328f",
  primaryFixedDim: "#bfc2ff",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  onSecondary: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  outline: "#767683",
  outlineVariant: "#c7c5d4",
  surface: "#f7f9fb",
  surfaceDim: "#d8dadc",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainerHigh: "#e6e8ea",
  surfaceContainerHighest: "#e0e3e5",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  tertiary: "#30007f",
  background: "#f7f9fb",
};

export default function ParentDashboard() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Report
  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ── Load Data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const userRes = await authApi.getMe();
      if (userRes.success) setUser(userRes.data);
    } catch (e) {
      console.log("Parent load error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ── PDF Download (Real) ───────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      const studentName = report.student?.name || "Unknown";
      const studentClass = report.student?.class || "N/A";
      const generatedDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      });

      const testRows = (report.tests || []).map((t: any) => `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding:12px 8px; font-weight:600;">${t.chapter}</td>
          <td style="padding:12px 8px; color:#50462a;">${t.subject}</td>
          <td style="padding:12px 8px;">${t.correctAnswers}/${t.totalQuestions}</td>
          <td style="padding:12px 8px; font-weight:800; color:${t.scorePercentage >= 70 ? "#286b33" : "#ba1a1a"}">${t.scorePercentage}%</td>
          <td style="padding:12px 8px; color:#aaa; font-size:12px;">${new Date(t.date).toLocaleDateString("en-IN")}</td>
        </tr>
      `).join("");

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Progress Report - ${studentName}</title>
            <style>
              body { font-family: -apple-system, sans-serif; margin: 40px; color: #1b1c15; background: #fff; }
              .header { background: linear-gradient(135deg, #ffe087, #ebc23e); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px; }
              .header h1 { margin: 0; font-size: 28px; color: #574500; }
              .header p { margin: 6px 0 0; color: #735c00; font-size: 15px; }
              .stats { display: flex; gap: 20px; margin-bottom: 24px; }
              .stat { flex: 1; background: #fbfaee; border-radius:12px; padding:16px; text-align:center; border: 1px solid #e0d8c0; }
              .stat-num { font-size: 28px; font-weight: 900; color: #735c00; }
              .stat-lbl { font-size: 12px; color: #50462a; margin-top: 4px; }
              .section-title { font-size: 16px; font-weight: 800; color: #50462a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
              table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
              thead th { background: #ffe087; padding: 12px 8px; text-align: left; font-size: 12px; font-weight: 800; color: #574500; text-transform: uppercase; letter-spacing: 0.5px; }
              .footer { text-align: center; margin-top: 40px; color: #aaa; font-size: 12px; }
              .generated { font-size: 13px; color: #aaa; text-align: right; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📊 Progress Report</h1>
              <p>${studentName} · Class ${studentClass}</p>
            </div>
            <p class="generated">Generated on ${generatedDate}</p>
            <div class="stats">
              <div class="stat"><div class="stat-num">${report.totalTests || 0}</div><div class="stat-lbl">Total Tests</div></div>
              <div class="stat"><div class="stat-num">${report.averageScore || 0}%</div><div class="stat-lbl">Average Score</div></div>
              <div class="stat"><div class="stat-num">${report.student?.totalStars || 0} ⭐</div><div class="stat-lbl">Total Stars</div></div>
            </div>
            <div class="section-title">Test History</div>
            <table>
              <thead>
                <tr>
                  <th>Chapter</th><th>Subject</th><th>Score</th><th>Percentage</th><th>Date</th>
                </tr>
              </thead>
              <tbody>${testRows || "<tr><td colspan='5' style='padding:20px;text-align:center;color:#aaa;'>No tests yet</td></tr>"}</tbody>
            </table>
            <div class="footer">📚 Generated by StudySaathy · Keep Learning!</div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      
      if (Platform.OS === "web") {
        window.open(uri, "_blank");
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `Progress Report - ${studentName}`,
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Downloaded", `Report saved to: ${uri}`);
      }
    } catch (e: any) {
      console.error("PDF error:", e);
      Alert.alert("Error", "Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleFetchReport = async () => {
    setReportLoading(true);
    try {
      const res = await parentApi.getReport();
      if (res.success) {
        setReport(res.data);
        setShowReport(true);
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load report");
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: C.surface }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  const fuel = user?.user?.fuel ?? user?.fuel ?? 350;
  const userLevel = user?.user?.level ?? user?.level ?? 1;
  const childName = user?.user?.childName ?? user?.childName ?? "Aarav";
  const currentCityIndex = Math.max(0, Math.min(8, Math.floor(fuel / 500)));
  const nextCityIndex = Math.min(8, currentCityIndex + 1);
  const cities = ["Ahmedabad", "Gandhinagar", "Mehsana", "Patan", "Vadodara", "Surat", "Rajkot", "Dwarka", "Somnath"];
  
  const currentCityName = cities[currentCityIndex] || "Ahmedabad";
  const nextCityName = cities[nextCityIndex] || "Gandhinagar";
  
  const targetFuel = nextCityIndex * 500;
  const fuelNeeded = Math.max(0, targetFuel - fuel);
  const prevMilestoneFuel = currentCityIndex * 500;
  const currentLegFuelTotal = 500;
  const currentLegFuelEarned = Math.max(0, fuel - prevMilestoneFuel);
  const fuelPercentage = Math.min(100, Math.max(0, (currentLegFuelEarned / currentLegFuelTotal) * 100));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(StatusBar.currentHeight || 0, 16) }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={{ padding: 4, marginRight: 4 }} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={C.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.7} style={styles.profilePicWrapper}>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIUh4mbkBc6p_INhz-RWpzD4E3i4upVIc85YORgArLaPQ-BpyKd__tr7dbgfBFON8CX9MoGTqr0kcDDq0wnqD7D2wSKwaeRjLNdhKTgqAdjxgrdeLOomzwwsL7MiSJ73kYyX4HhssxDlub28Yv1esVfCT5acshzaqsFjNxs7Jo7a1_eZ_-9Pg92fxcErBbW9jY4sd3EZjPVQftnKZa0dNPXJq7tNYuHG7Qb3PWg_UCPSCOyK2eylBugrfkFvCBSoxYXEcgXCaDjA" }}
                style={styles.profilePic}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Parent Space</Text>
          </View>
          <NotificationBell role="parent" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Child Summary Hero */}
        <View style={[styles.glassCard, styles.cosmicGlow]}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroSubText}>STUDENT PROFILE</Text>
              <Text style={styles.heroTitle}>{childName}’s Journey</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lvl {userLevel} Explorer</Text>
            </View>
          </View>
          
          {/* Today's Stats & Current City */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: C.secondary }]}>45m</Text>
              <Text style={styles.statLabel}>Today's Time</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: C.tertiary }]}>35</Text>
              <Text style={styles.statLabel}>Solved Today</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: C.primary }]}>{currentCityName}</Text>
              <Text style={styles.statLabel}>Current City</Text>
            </View>
          </View>

          {/* Journey Fuel Progress */}
          <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.primary }}>JOURNEY PROGRESS</Text>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.primary }}>{fuel} / {targetFuel} Fuel</Text>
            </View>
            <View style={{ height: 8, backgroundColor: "rgba(20, 23, 121, 0.1)", borderRadius: 4, overflow: "hidden" }}>
              <View style={{ height: "100%", width: `${fuelPercentage}%`, backgroundColor: C.secondary }} />
            </View>
            <Text style={{ fontSize: 11, color: C.outline, marginTop: 6 }}>
              {currentCityName} ➡️ {nextCityName} ({fuelNeeded} Fuel remaining)
            </Text>
          </View>
        </View>

        {/* Learning DNA Highlights (Strengths & Weaknesses) */}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Cognitive Strengths & Weaknesses</Text>
          <View style={{ gap: 12 }}>
            <View style={[styles.glassCard, { borderLeftWidth: 4, borderLeftColor: C.secondary, padding: 12 }]}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: C.secondary, marginBottom: 4 }}>
                💪 Strengths (Fast Processor)
              </Text>
              <Text style={{ fontSize: 12, color: C.onSurfaceVariant }}>
                Visual Apple Math Quest, shape recognition, and spatial logic calculations.
              </Text>
            </View>

            <View style={[styles.glassCard, { borderLeftWidth: 4, borderLeftColor: C.error, padding: 12 }]}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: C.error, marginBottom: 4 }}>
                ⚠️ Weaknesses / Review Needed
              </Text>
              <Text style={{ fontSize: 12, color: C.onSurfaceVariant }}>
                Reading comprehension speed under timed math questions.
              </Text>
            </View>

            <View style={[styles.glassCard, { borderLeftWidth: 4, borderLeftColor: C.primary, padding: 12 }]}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: C.primary, marginBottom: 4 }}>
                🔔 Risk Alerts
              </Text>
              <Text style={{ fontSize: 12, color: C.onSurfaceVariant }}>
                No critical drops. Attention level remains consistent over the past 7 days.
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly & Monthly Growth Graphs */}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Weekly Progress & Monthly Growth</Text>
          <View style={[styles.glassCard, { padding: 16, gap: 16 }]}>
            {/* Weekly bar chart mock */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: C.primary, marginBottom: 12 }}>
                Weekly Solving Time (Min)
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 80 }}>
                {[
                  { day: "Mon", min: 30 },
                  { day: "Tue", min: 45 },
                  { day: "Wed", min: 20 },
                  { day: "Thu", min: 60 },
                  { day: "Fri", min: 40 },
                  { day: "Sat", min: 15 },
                  { day: "Sun", min: 45 },
                ].map((item) => (
                  <View key={item.day} style={{ alignItems: "center" }}>
                    <View style={{ height: item.min, width: 12, backgroundColor: C.primary, borderRadius: 6 }} />
                    <Text style={{ fontSize: 10, color: C.outline, marginTop: 4 }}>{item.day}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Monthly growth */}
            <View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: C.primary, marginBottom: 8 }}>
                Monthly Syllabus Mastery
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 13, color: C.onSurfaceVariant }}>Level Growth</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.secondary }}>+24% (Explorer Lvl {userLevel})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Links */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.glassCard, styles.actionCard]} 
              activeOpacity={0.8}
              onPress={() => router.push('/parent/settings')}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: C.outline }]}>
                <MaterialIcons name="settings" size={20} color={C.white} />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.glassCard, styles.actionCard]} 
              activeOpacity={0.8}
              onPress={() => router.push('/parent/learning-dna')}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: C.secondary }]}>
                <MaterialIcons name="psychology" size={20} color={C.white} />
              </View>
              <Text style={styles.actionText}>Learning DNA</Text>
            </TouchableOpacity>
          </View>

          {/* Last Activity */}
          <TouchableOpacity 
            style={[styles.glassCard, styles.activityCard]}
            activeOpacity={0.8}
            onPress={() => router.push('/parent/assessment-summary')}
          >
            <View style={styles.activityLeft}>
              <MaterialIcons name="schedule" size={24} color={C.outline} />
              <View>
                <Text style={styles.activityTitle}>Last Activity</Text>
                <Text style={styles.activityDesc}>Math Apple quest solved • 2 hours ago</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={C.primary} />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom NavBar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <View style={styles.navItemActiveBg}>
            <MaterialIcons name="home" size={24} color={C.onSecondaryContainer} />
            <Text style={[styles.navText, { color: C.onSecondaryContainer }]}>Home</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={() => router.push('/parent/report')}>
          <MaterialIcons name="analytics" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={() => router.push('/parent/settings')}>
          <MaterialIcons name="settings" size={24} color={C.onSurfaceVariant} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* ── Report Modal ── */}
      <Modal visible={showReport} animationType="slide" onRequestClose={() => setShowReport(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📊 Child Performance</Text>
            <TouchableOpacity onPress={() => setShowReport(false)}>
              <MaterialIcons name="close" size={24} color={C.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {report && (
              <>
                <View style={styles.reportSummary}>
                  <Text style={styles.reportName}>{report.student?.name || 'Arjun'}</Text>
                  <Text style={styles.reportClass}>{report.student?.class || "2nd Standard"}</Text>
                  <View style={styles.reportStatsRow}>
                    <View style={styles.reportStatBox}>
                      <Text style={styles.reportStatNum}>{report.totalTests || 0}</Text>
                      <Text style={styles.reportStatLbl}>Total Tests</Text>
                    </View>
                    <View style={styles.reportStatBox}>
                      <Text style={styles.reportStatNum}>{report.averageScore || 0}%</Text>
                      <Text style={styles.reportStatLbl}>Avg Score</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.dlHeader}>
                   <Text style={styles.dlTitle}>Recent Test Scores</Text>
                   <TouchableOpacity 
                    style={[styles.dlBtn, downloading && { opacity: 0.6 }]} 
                    onPress={handleDownloadPDF}
                    disabled={downloading}
                   >
                     {downloading ? (
                       <ActivityIndicator size="small" color={C.primary} />
                     ) : (
                       <>
                         <Text style={styles.dlBtnText}>PDF Download</Text>
                         <MaterialIcons name="file-download" size={16} color={C.primary} style={{ marginLeft: 4 }} />
                       </>
                     )}
                   </TouchableOpacity>
                </View>

                {(report.tests || []).map((test: any, i: number) => (
                  <View key={i} style={styles.reportTest}>
                    <View style={styles.reportTestHeader}>
                      <Text style={styles.reportTestChapter}>{test.chapter}</Text>
                      <Text style={[styles.reportTestScore, { color: test.scorePercentage >= 70 ? C.secondary : C.error }]}>
                        {test.scorePercentage}%
                      </Text>
                    </View>
                    <View style={styles.reportTestSubRow}>
                      <Text style={styles.reportTestSubText}>{test.subject}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.reportTestSubText}>{test.correctAnswers}/{test.totalQuestions} Correct</Text>
                      <View style={styles.dot} />
                      <Text style={styles.reportTestSubText}>{new Date(test.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</Text>
                    </View>
                  </View>
                ))}

                {(!report.tests || report.tests.length === 0) && (
                  <View style={styles.emptyContainer}>
                    <Text style={{ fontSize: 50, marginBottom: 10 }}>📖</Text>
                    <Text style={styles.emptyText}>No tests recorded yet.</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "rgba(247, 249, 251, 0.8)",
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 50,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 64,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profilePicWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(20, 23, 121, 0.2)",
    overflow: "hidden",
  },
  profilePic: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
  },
  cosmicGlow: {
    shadowColor: C.secondaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  heroSubText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.onSurfaceVariant,
    letterSpacing: 1,
    fontFamily: "Quicksand",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.primary,
    fontFamily: "Quicksand",
  },
  levelBadge: {
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.onSecondaryContainer,
    fontFamily: "Quicksand",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(242, 244, 246, 0.5)",
    padding: 8,
    borderRadius: 12,
  },
  statNum: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Quicksand",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.outline,
    fontFamily: "Quicksand",
    marginTop: 2,
  },
  highlightsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
    fontFamily: "Quicksand",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  bentoContainer: {
    flexDirection: "row",
    gap: 12,
    height: 192,
  },
  bentoCardLeft: {
    flex: 1,
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: C.secondary,
  },
  bentoCardTextWrap: {
    marginTop: 'auto',
  },
  bentoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
    fontFamily: "Quicksand",
    marginBottom: 4,
  },
  bentoCardDesc: {
    fontSize: 12,
    color: C.outline,
    fontFamily: "Quicksand",
  },
  bentoRightCol: {
    flex: 1,
    gap: 12,
  },
  bentoSmallCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Quicksand",
    marginBottom: 2,
  },
  smallCardDesc: {
    fontSize: 12,
    color: C.outline,
    fontFamily: "Quicksand",
  },
  quickActionsSection: {
    gap: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onSurfaceVariant,
    fontFamily: "Quicksand",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Quicksand",
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: C.outline,
    fontFamily: "Quicksand",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(247, 249, 251, 0.9)",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255, 255, 255, 0.4)",
    height: 80,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  navItemActiveBg: {
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Quicksand",
    marginTop: 4,
    color: C.onSurfaceVariant,
  },

  // Modals generic
  modalSafe: { 
    flex: 1, 
    backgroundColor: C.surface 
  },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: C.white, 
    borderBottomWidth: 1.5, 
    borderBottomColor: "#eee" 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: C.primary 
  },
  modalScroll: { 
    padding: 20 
  },
  reportSummary: { 
    backgroundColor: C.primaryFixedDim, 
    borderRadius: 20, 
    padding: 24, 
    alignItems: "center", 
    marginBottom: 20 
  },
  reportName: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: C.primary 
  },
  reportClass: { 
    fontSize: 14, 
    color: C.primary, 
    fontWeight: "600", 
    marginBottom: 18, 
    opacity: 0.8 
  },
  reportStatsRow: { 
    flexDirection: "row", 
    gap: 30 
  },
  reportStatBox: { 
    alignItems: "center" 
  },
  reportStatNum: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: C.primary 
  },
  reportStatLbl: { 
    fontSize: 11, 
    fontWeight: "600", 
    color: C.primary, 
    opacity: 0.7 
  },
  dlHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 15, 
    marginTop: 5 
  },
  dlTitle: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: C.onSurface 
  },
  dlBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: C.primaryFixedDim, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10 
  },
  dlBtnText: { 
    fontSize: 12, 
    fontWeight: "700", 
    color: C.primary 
  },
  reportTest: { 
    backgroundColor: C.white, 
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 12, 
    borderWidth: 1.5, 
    borderColor: "#f0f0f0" 
  },
  reportTestHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 6 
  },
  reportTestChapter: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: C.onSurface 
  },
  reportTestScore: { 
    fontSize: 18, 
    fontWeight: "700" 
  },
  reportTestSubRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  reportTestSubText: { 
    fontSize: 12, 
    color: C.onSurfaceVariant, 
    fontWeight: "600" 
  },
  dot: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: C.outlineVariant, 
    marginHorizontal: 8 
  },
  emptyContainer: { 
    alignItems: "center", 
    marginTop: 50 
  },
  emptyText: { 
    color: C.onSurfaceVariant, 
    fontSize: 15, 
    fontWeight: "600" 
  },
});
