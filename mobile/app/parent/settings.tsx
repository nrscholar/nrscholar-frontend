import React, { useState, useEffect, useRef } from "react";
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
  TextInput,
  Dimensions,
  Platform,
  Animated,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { parentApi, authApi } from "../services/api";
import NotificationBell from "../components/NotificationBell";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  notifyReelsDisabled,
  notifyReelsEnabled,
  notifyChatDisabled,
  notifyChatEnabled,
  notifyScreenTimeChanged,
  notifySubscriptionActivated,
} from "../services/notifications";
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
  surfaceContainerHighest: "#e0e3e5",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.8)",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onPrimary: "#ffffff",
};

// Custom Switch component to match the HTML high-fidelity toggle design
function CustomSwitch({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.surfaceDim, C.secondary],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={styles.switchTrack}
    >
      <Animated.View style={[styles.switchSlot, { backgroundColor }]}>
        <Animated.View style={[styles.switchDot, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ParentSettings() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [controls, setControls] = useState<any>({ allowReels: true, allowChat: true, screenTimeMinutes: 60 });
  const [subscription, setSubscription] = useState<any>({ plan: "free", status: "active", expiresAt: null });

  // Subjects Restrictions Mocked local state as it isn't persisted in schema
  const [mathRestricted, setMathRestricted] = useState(false);
  const [scienceRestricted, setScienceRestricted] = useState(false);
  const [languageRestricted, setLanguageRestricted] = useState(true);

  // HIDDEN: const [kidSafeMode, setKidSafeMode] = useState(true);

  // Reset journey state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Report
  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Global Exam
  const [examResult, setExamResult] = useState<any>(null);
  const [examLoading, setExamLoading] = useState(false);
  const [showExam, setShowExam] = useState(false);

  // Plans
  const [plans, setPlans] = useState<any[]>([]);
  const [showPlans, setShowPlans] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  // Support
  const [tickets, setTickets] = useState<any[]>([]);
  const [showSupport, setShowSupport] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketCategory, setTicketCategory] = useState("feedback");

  // ── Load Data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [userRes, ctrlRes] = await Promise.all([
        authApi.getMe(),
        parentApi.getControls(),
      ]);
      if (userRes.success) setUser(userRes.data);
      if (ctrlRes.success) {
        setControls(ctrlRes.data.parentControls);
        setSubscription(ctrlRes.data.subscription);
      }
    } catch (e) {
      console.log("Parent load error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Controls Toggle ────────────────────────────────────────────────────────
  const toggleControl = async (field: string, value: boolean) => {
    const updated = { ...controls, [field]: value };
    setControls(updated);
    const res = await parentApi.updateControls({ [field]: value });
    if (!res.success) {
      setControls({ ...controls }); // revert
      Alert.alert("Error", "Failed to update control");
      return;
    }
    if (field === "allowReels") {
      value ? notifyReelsEnabled() : notifyReelsDisabled();
    } else if (field === "allowChat") {
      value ? notifyChatEnabled() : notifyChatDisabled();
    }
  };

  const changeScreenTime = async (minutes: number) => {
    setControls({ ...controls, screenTimeMinutes: minutes });
    const res = await parentApi.updateControls({ screenTimeMinutes: minutes });
    if (!res.success) {
      Alert.alert("Error", "Failed to update screen time");
      return;
    }
    if (minutes < 9999) {
      notifyScreenTimeChanged(minutes / 60);
    }
  };

  // ── PDF Download (Real) ───────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      const studentName = report.student.name || "Unknown";
      const studentClass = report.student.class || "N/A";
      const generatedDate = new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      });

      const testRows = report.tests.map((t: any) => `
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
              <div class="stat"><div class="stat-num">${report.totalTests}</div><div class="stat-lbl">Total Tests</div></div>
              <div class="stat"><div class="stat-num">${report.averageScore}%</div><div class="stat-lbl">Average Score</div></div>
              <div class="stat"><div class="stat-num">${report.student.totalStars || 0} ⭐</div><div class="stat-lbl">Total Stars</div></div>
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
            <div class="footer">📚 Generated by NR Scholar · Keep Learning!</div>
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

  // ── Global Exam ────────────────────────────────────────────────────────────
  const handleViewExam = async () => {
    setExamLoading(true);
    try {
      const res = await parentApi.getGlobalExamResult();
      if (res.success) {
        setExamResult(res.data);
        setShowExam(true);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to check exam result");
    } finally {
      setExamLoading(false);
    }
  };

  // ── Plans ──────────────────────────────────────────────────────────────────
  const handleViewPlans = async () => {
    try {
      const res = await parentApi.getPlans();
      if (res.success) {
        setPlans(res.data.plans);
        setSubscription({ plan: res.data.currentPlan, status: res.data.status, expiresAt: res.data.expiresAt });
        setShowPlans(true);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load plans");
    }
  };

  const handleSubscribe = async (planId: string) => {
    setSubscribing(true);
    try {
      const res = await parentApi.subscribe(planId);
      if (res.success) {
        setSubscription(res.data.subscription);
        const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
        notifySubscriptionActivated(planName);
        Alert.alert("🎊 Subscribed!", `${planName} plan is now active. Enjoy all features!`);
        setShowPlans(false);
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (e) {
      Alert.alert("Error", "Subscription failed");
    } finally {
      setSubscribing(false);
    }
  };

  // ── Support ────────────────────────────────────────────────────────────────
  const handleViewSupport = async () => {
    try {
      const res = await parentApi.getTickets();
      if (res.success) {
        setTickets(res.data);
        setShowSupport(true);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load tickets");
    }
  };

  const handleSubmitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert("Error", "Please fill in subject and message");
      return;
    }
    try {
      const res = await parentApi.createTicket(ticketSubject, ticketMessage, ticketCategory);
      if (res.success) {
        Alert.alert("Success", "Your ticket has been submitted. We'll get back to you shortly!");
        setShowNewTicket(false);
        setTicketSubject("");
        setTicketMessage("");
        handleViewSupport(); 
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to submit ticket");
    }
  };

  const handleUpdatePin = () => {
    Alert.alert(
      "Update Access PIN",
      "An access reset link has been dispatched to your registered email address.",
      [{ text: "OK" }]
    );
  };

  const handleResetJourney = async () => {
    setResetting(true);
    try {
      const res = await parentApi.resetJourney();
      if (res.success) {
        await AsyncStorage.removeItem("nrscholar_fuel");
        await AsyncStorage.removeItem("nrscholar_coins");
        await AsyncStorage.removeItem("nrscholar_level");
        await AsyncStorage.removeItem("nrscholar_completed_chapters");
        await AsyncStorage.removeItem("nrscholar_badges");
        
        Alert.alert("Success", "Journey has been reset to zero.");
        setShowResetModal(false);
      } else {
        Alert.alert("Error", res.message || "Failed to reset journey.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "An error occurred during reset.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: C.surface }]}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  const isExpired = subscription.expiresAt && new Date(subscription.expiresAt) < new Date() && subscription.plan !== "free";
  const planLabel = subscription.plan === "free" ? "Free Plan" : `${subscription.plan?.charAt(0).toUpperCase()}${subscription.plan?.slice(1)} Plan`;
  
  // Screen Time checks
  const isScreenTimeOn = controls.screenTimeMinutes < 9999;
  const currentMinutes = controls.screenTimeMinutes || 60;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Top App Bar */}
      <View style={[styles.header, { paddingTop: Math.max(StatusBar.currentHeight || 0, 16) }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity 
            style={styles.backBtn} 
            activeOpacity={0.7} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={C.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <NotificationBell role="parent" />
        </View>
      </View>

      {isExpired && (
        <TouchableOpacity style={styles.expiredBanner} onPress={handleViewPlans}>
          <Text style={styles.expiredText}>⚠️ Your plan has expired. Tap to renew and continue learning!</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Screen Time Management */}
        <View style={styles.glassCard}>
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <MaterialIcons name="timer" size={22} color={C.secondary} />
              <Text style={styles.sectionHeading}>Screen Time</Text>
            </View>
            <CustomSwitch 
              value={isScreenTimeOn} 
              onValueChange={(v) => {
                changeScreenTime(v ? 60 : 9999);
              }} 
            />
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.flexButton, 
                isScreenTimeOn && currentMinutes === 30 && styles.activeButton
              ]}
              onPress={() => changeScreenTime(30)}
            >
              <Text style={[
                styles.buttonText, 
                isScreenTimeOn && currentMinutes === 30 && styles.activeButtonText
              ]}>30 Mins</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.flexButton, 
                isScreenTimeOn && currentMinutes === 60 && styles.activeButton
              ]}
              onPress={() => changeScreenTime(60)}
            >
              <Text style={[
                styles.buttonText, 
                isScreenTimeOn && currentMinutes === 60 && styles.activeButtonText
              ]}>1 Hour</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.flexButton, 
                (!isScreenTimeOn || currentMinutes >= 9999) && styles.activeButton
              ]}
              onPress={() => changeScreenTime(9999)}
            >
              <Text style={[
                styles.buttonText, 
                (!isScreenTimeOn || currentMinutes >= 9999) && styles.activeButtonText
              ]}>Unlimited</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Subject Restrictions */}
        <View style={styles.glassCard}>
          <View style={[styles.titleRow, { marginBottom: 16 }]}>
            <MaterialIcons name="auto-stories" size={22} color={C.secondary} />
            <Text style={styles.sectionHeading}>Subject Restrictions</Text>
          </View>

          <View style={styles.subjectRows}>
            {/* Math */}
            <View style={styles.subjectItem}>
              <Text style={styles.subjectLabel}>Mathematics</Text>
              <CustomSwitch value={mathRestricted} onValueChange={setMathRestricted} />
            </View>

            {/* Science */}
            <View style={styles.subjectItem}>
              <Text style={styles.subjectLabel}>Science & Tech</Text>
              <CustomSwitch value={scienceRestricted} onValueChange={setScienceRestricted} />
            </View>

            {/* Language */}
            <View style={styles.subjectItem}>
              <Text style={styles.subjectLabel}>Language Arts</Text>
              <CustomSwitch value={languageRestricted} onValueChange={setLanguageRestricted} />
            </View>
          </View>
        </View>

        {/* Section: Bento Grid Controls */}
        <View style={styles.bentoGrid}>
          {/* HIDDEN: Kid Safe Mode */}
          {/*
          <View style={styles.bentoCard}>
            <View style={[styles.iconCircle, { backgroundColor: C.secondaryContainer }]}>
              <MaterialIcons name="verified-user" size={24} color={C.secondary} />
            </View>
            <Text style={styles.bentoTitle}>Kid-Safe Mode</Text>
            <CustomSwitch value={kidSafeMode} onValueChange={setKidSafeMode} />
          </View>
          */}

          {/* HIDDEN: Edu Reels */}
          {/*
          <View style={styles.bentoCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#ffe0b2" }]}>
              <MaterialIcons name="movie" size={24} color="#f57c00" />
            </View>
            <Text style={styles.bentoTitle}>Edu Reels</Text>
            <CustomSwitch 
              value={controls.allowReels} 
              onValueChange={(v) => toggleControl("allowReels", v)} 
            />
          </View>
          */}

          {/* Update PIN */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleUpdatePin} 
            style={styles.bentoCard}
          >
            <View style={[styles.iconCircle, { backgroundColor: C.primaryFixedDim }]}>
              <MaterialIcons name="lock-reset" size={24} color={C.primary} />
            </View>
            <Text style={styles.bentoTitle}>Update Pin</Text>
            <Text style={styles.bentoSub}>Change Access</Text>
          </TouchableOpacity>

          {/* Chat Control */}
          <View style={styles.bentoCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#e3f2fd" }]}>
              <MaterialIcons name="forum" size={24} color="#1976d2" />
            </View>
            <Text style={styles.bentoTitle}>AI Teacher</Text>
            <CustomSwitch 
              value={controls.allowChat} 
              onValueChange={(v) => toggleControl("allowChat", v)} 
            />
          </View>

          {/* Subscription Manage */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => router.push("/parent/subscription")} 
            style={styles.bentoCard}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#fff9c4" }]}>
              <MaterialIcons name="loyalty" size={24} color="#fbc02d" />
            </View>
            <Text style={styles.bentoTitle}>Premium Plans</Text>
            <Text style={styles.bentoSub}>{planLabel}</Text>
          </TouchableOpacity>

          {/* Support / Help */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleViewSupport} 
            style={styles.bentoCard}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#f8bbd0" }]}>
              <MaterialIcons name="support-agent" size={24} color="#c2185b" />
            </View>
            <Text style={styles.bentoTitle}>Support & Help</Text>
            <Text style={styles.bentoSub}>Request Logs</Text>
          </TouchableOpacity>
        </View>

        {/* Reset Journey Section */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowResetModal(true)}
          style={[styles.glassCard, { borderColor: "rgba(186, 26, 26, 0.3)", backgroundColor: "rgba(255, 218, 214, 0.2)" }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={[styles.iconCircle, { backgroundColor: C.errorContainer }]}>
              <MaterialIcons name="delete-forever" size={24} color={C.error} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionHeading, { color: C.error }]}>Reset Learning Journey</Text>
              <Text style={[styles.bentoSub, { color: C.onSurfaceVariant, fontSize: 13, marginTop: 2 }]}>Clear all coins, progress, and battle history</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Visual spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ════════ MODALS ════════ */}

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
                  <Text style={styles.reportName}>{report.student.name}</Text>
                  <Text style={styles.reportClass}>{report.student.class || "2nd Standard"}</Text>
                  <View style={styles.reportStatsRow}>
                    <View style={styles.reportStatBox}>
                      <Text style={styles.reportStatNum}>{report.totalTests}</Text>
                      <Text style={styles.reportStatLbl}>Total Tests</Text>
                    </View>
                    <View style={styles.reportStatBox}>
                      <Text style={styles.reportStatNum}>{report.averageScore}%</Text>
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

                {report.tests.map((test: any, i: number) => (
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

                {report.tests.length === 0 && (
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

      {/* ── Global Exam Modal ── */}
      <Modal visible={showExam} animationType="slide" onRequestClose={() => setShowExam(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🌍 Global Tournament</Text>
            <TouchableOpacity onPress={() => setShowExam(false)}>
              <MaterialIcons name="close" size={24} color={C.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <View style={styles.examContent}>
            {examResult?.status === "not_scheduled" && (
              <>
                <View style={styles.examIconWrap}>
                  <MaterialIcons name="event-busy" size={40} color={C.primary} />
                </View>
                <Text style={styles.examTitle}>Coming Soon</Text>
                <Text style={styles.examDesc}>{examResult.message}</Text>
              </>
            )}
            {examResult?.status === "not_participated" && (
              <>
                <View style={styles.examIconWrap}>
                  <MaterialIcons name="sentiment-dissatisfied" size={40} color={C.primary} />
                </View>
                <Text style={styles.examTitle}>Missed Participation</Text>
                <Text style={styles.examDesc}>{examResult.message}</Text>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Plans Modal ── */}
      <Modal visible={showPlans} animationType="slide" onRequestClose={() => setShowPlans(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Premium Plan</Text>
            <TouchableOpacity onPress={() => setShowPlans(false)}>
              <MaterialIcons name="close" size={24} color={C.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {plans.map((plan: any) => (
              <View key={plan.id} style={[styles.planCard, subscription.plan === plan.id && { borderColor: C.primary, borderWidth: 2.5, backgroundColor: "#fffde7" }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={styles.planCardName}>{plan.name}</Text>
                  <Text style={styles.planCardPrice}>₹{plan.price}</Text>
                </View>
                <Text style={styles.planDuration}>{plan.duration} access</Text>
                
                <View style={styles.planFeaturesList}>
                  {plan.features.map((f: string, idx: number) => (
                    <Text key={idx} style={styles.planFeatureText}>✨ {f}</Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.subscribeBtn, subscription.plan === plan.id && { backgroundColor: C.onSurfaceVariant }]}
                  onPress={() => handleSubscribe(plan.id)}
                  disabled={subscribing}
                >
                  <Text style={styles.subscribeBtnText}>
                    {subscription.plan === plan.id ? "Currently Active" : "Choose " + plan.id.charAt(0).toUpperCase() + plan.id.slice(1)}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── Support Modal ── */}
      <Modal visible={showSupport} animationType="slide" onRequestClose={() => setShowSupport(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Support Requests</Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={() => setShowNewTicket(true)}>
                <MaterialIcons name="add" size={24} color={C.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSupport(false)}>
                <MaterialIcons name="close" size={24} color={C.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {tickets.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No requests found.</Text>
                <TouchableOpacity style={styles.createTicketBtn} onPress={() => setShowNewTicket(true)}>
                  <Text style={styles.createTicketBtnText}>Create New Ticket</Text>
                </TouchableOpacity>
              </View>
            )}
            {tickets.map((t: any, i: number) => (
              <View key={i} style={styles.ticketCard}>
                <View style={styles.ticketHeaderRow}>
                  <Text style={styles.ticketSubject} numberOfLines={1}>{t.subject}</Text>
                  <View style={[styles.statusTag, { backgroundColor: t.status === "open" ? "#fff9c4" : "#c8e6c9" }]}>
                    <Text style={styles.statusTagText}>{t.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.ticketMsg}>{t.message}</Text>
                <Text style={styles.ticketMeta}>{new Date(t.createdAt).toLocaleDateString()} · {t.category}</Text>
                {t.adminReply && (
                  <View style={styles.adminResp}>
                    <Text style={styles.adminRespTitle}>School Response:</Text>
                    <Text style={styles.adminRespText}>{t.adminReply}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── New Ticket Modal ── */}
      <Modal visible={showNewTicket} animationType="slide" onRequestClose={() => setShowNewTicket(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>File Complaint / Support</Text>
            <TouchableOpacity onPress={() => setShowNewTicket(false)}>
              <MaterialIcons name="close" size={24} color={C.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.label}>Reason for contacting</Text>
            <View style={styles.catGroup}>
              {["feedback", "complaint", "bug"].map((cat) => (
                <TouchableOpacity key={cat} style={[styles.catBtn, ticketCategory === cat && styles.catBtnActive]} onPress={() => setTicketCategory(cat)}>
                  <Text style={[styles.catBtnText, ticketCategory === cat && styles.catBtnTextActive]}>{cat.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Brief Subject</Text>
            <TextInput style={styles.input} placeholder="Enter subject" value={ticketSubject} onChangeText={setTicketSubject} />

            <Text style={styles.label}>Detailed Description</Text>
            <TextInput style={[styles.input, { height: 120, textAlignVertical: "top" }]} placeholder="Tell us more..." multiline value={ticketMessage} onChangeText={setTicketMessage} />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitTicket}>
              <Text style={styles.submitBtnText}>Submit Complaint</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ── Reset Journey Modal ── */}
      <Modal visible={showResetModal} transparent animationType="fade" onRequestClose={() => setShowResetModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <View style={[styles.iconCircle, { backgroundColor: C.errorContainer, width: 64, height: 64, borderRadius: 32, alignSelf: "center", marginBottom: 16, justifyContent: "center", alignItems: "center" }]}>
              <MaterialIcons name="warning" size={32} color={C.error} />
            </View>
            <Text style={styles.confirmTitle}>Are you sure you want to reset this journey as it lost all the data?</Text>
            <Text style={styles.confirmSubtitle}>
              This will permanently delete all coins, learning progress, level achievements, completed chapters, and badges. This cannot be undone.
            </Text>
            
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.cancelBtn]}
                onPress={() => setShowResetModal(false)}
                disabled={resetting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmBtn, styles.dangerBtn]}
                onPress={handleResetJourney}
                disabled={resetting}
              >
                {resetting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.dangerBtnText}>Yes, Reset</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
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
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.primary,
  },
  expiredBanner: { 
    backgroundColor: C.error, 
    padding: 12 
  },
  expiredText: { 
    color: C.white, 
    fontSize: 13, 
    fontWeight: "700", 
    textAlign: "center" 
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // Glass Card
  glassCard: {
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
  },

  // Switch styles
  switchTrack: {
    width: 48,
    height: 28,
    justifyContent: "center",
  },
  switchSlot: {
    width: 44,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 2,
    justifyContent: "center",
  },
  switchDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },

  // Button Group Screen time
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  flexButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: C.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  activeButton: {
    borderColor: C.secondary,
    backgroundColor: "rgba(0, 106, 98, 0.1)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.outline,
  },
  activeButtonText: {
    color: C.secondary,
    fontWeight: "700",
  },

  // Subject rows
  subjectRows: {
    gap: 12,
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
  },
  subjectLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: C.onSurface,
  },

  // Bento Grid
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  bentoCard: {
    width: (width - 64) / 2,
    backgroundColor: C.glassBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    alignItems: "center",
    textAlign: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
  },
  bentoSub: {
    fontSize: 12,
    color: C.outline,
    fontWeight: "600",
    textAlign: "center",
  },

  // Reports Button CTA
  reportsBtn: {
    width: "100%",
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  reportsBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  reportsBtnIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  reportsBtnTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },
  reportsBtnSub: {
    fontSize: 12,
    color: C.primaryFixedDim,
    opacity: 0.8,
  },

  // Tournament Button
  tournamentBtn: {
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.glassBorder,
    shadowColor: "#000",
    shadowOpacity: 0.03,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  createTicketBtn: {
    marginTop: 20,
    backgroundColor: C.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
  },
  createTicketBtnText: {
    color: C.white,
    fontWeight: "700",
  },

  examContent: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 40 
  },
  examIconWrap: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: C.primaryFixedDim, 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 25 
  },
  examTitle: { 
    fontSize: 26, 
    fontWeight: "700", 
    color: C.onSurface, 
    marginBottom: 15 
  },
  examDesc: { 
    fontSize: 15, 
    color: C.onSurfaceVariant, 
    textAlign: "center", 
    lineHeight: 24, 
    fontWeight: "500" 
  },

  planCard: { 
    backgroundColor: C.white, 
    borderRadius: 20, 
    padding: 24, 
    marginBottom: 20, 
    borderWidth: 1.5, 
    borderColor: "#f0f0f0" 
  },
  planCardName: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: C.onSurface 
  },
  planCardPrice: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: C.primary 
  },
  planDuration: { 
    fontSize: 14, 
    color: C.onSurfaceVariant, 
    fontWeight: "600", 
    marginBottom: 18 
  },
  planFeaturesList: { 
    gap: 8, 
    marginBottom: 22 
  },
  planFeatureText: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: C.onSurface 
  },
  subscribeBtn: { 
    backgroundColor: C.primary, 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: "center" 
  },
  subscribeBtnText: { 
    color: C.white, 
    fontWeight: "700", 
    fontSize: 15 
  },

  ticketCard: { 
    backgroundColor: C.white, 
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 15, 
    borderWidth: 1.5, 
    borderColor: "#f0f0f0" 
  },
  ticketHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 12 
  },
  ticketSubject: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: C.onSurface, 
    flex: 1, 
    marginRight: 10 
  },
  statusTag: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  statusTagText: { 
    fontSize: 10, 
    fontWeight: "700", 
    color: C.onSurface 
  },
  ticketMsg: { 
    fontSize: 14, 
    color: C.onSurfaceVariant, 
    marginBottom: 12, 
    lineHeight: 20 
  },
  ticketMeta: { 
    fontSize: 11, 
    color: "#aaa", 
    fontWeight: "600" 
  },
  adminResp: { 
    backgroundColor: C.surfaceContainerLow, 
    padding: 15, 
    borderRadius: 12, 
    marginTop: 15, 
    borderLeftWidth: 3, 
    borderLeftColor: C.primary 
  },
  adminRespTitle: { 
    fontSize: 12, 
    fontWeight: "700", 
    color: C.primary, 
    marginBottom: 5 
  },
  adminRespText: { 
    fontSize: 14, 
    color: C.onSurface, 
    lineHeight: 19 
  },

  label: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: C.onSurface, 
    marginBottom: 10, 
    marginTop: 20 
  },
  catGroup: { 
    flexDirection: "row", 
    gap: 10, 
    flexWrap: "wrap" 
  },
  catBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: C.outlineVariant 
  },
  catBtnActive: { 
    backgroundColor: C.primary, 
    borderColor: C.primary 
  },
  catBtnText: { 
    fontSize: 12, 
    fontWeight: "700" 
  },
  catBtnTextActive: { 
    color: C.white 
  },
  input: { 
    backgroundColor: C.white, 
    borderWidth: 1.5, 
    borderColor: C.outlineVariant, 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 15, 
    color: C.onSurface, 
    fontWeight: "500" 
  },
  submitBtn: { 
    backgroundColor: C.primary, 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 30, 
    shadowColor: C.primary, 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 
    elevation: 5 
  },
  submitBtnText: { 
    color: C.white, 
    fontSize: 16, 
    fontWeight: "700" 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmBox: {
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.onSurface,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 24,
  },
  confirmSubtitle: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    backgroundColor: "transparent",
  },
  cancelBtnText: {
    color: C.onSurfaceVariant,
    fontSize: 15,
    fontWeight: "600",
  },
  dangerBtn: {
    backgroundColor: C.error,
  },
  dangerBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
