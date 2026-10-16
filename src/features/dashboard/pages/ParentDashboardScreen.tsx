import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BookOpen, Clock, Heart, ShieldAlert, Sparkles, TrendingUp, Trophy, Zap, ChevronRight, ChevronDown, Download, Share2, Award, Calendar, CheckCircle, CheckCircle2, Target, BarChart2, Flame, UserCheck, RefreshCw, X, AlertTriangle, Users, BrainCircuit, Activity, Settings } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import { translateNotificationTitle, translateNotificationMessage } from "../../../utils/notificationTranslator";
import { 
  getSubjectChartColor, 
  getCategorySubjectChartColor, 
  isCategoryTrendMode, 
  STRENGTH_GREEN_SHADES, 
  RISK_AMBER_SHADES, 
  WEAKNESS_RED_SHADES 
} from "../../../utils/chartColors";

export default function ParentDashboardScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userData, setUserData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem("userData") || localStorage.getItem("user");
      return cached ? JSON.parse(cached) : null;
    } catch (e) { return null; }
  });
  const [childName, setChildName] = useState(() => userData?.childName || "Explorer");
  const cleanChildName = childName || "Explorer";
  const [parentPhoto, setParentPhoto] = useState(() => userData?.parentPhoto || "");
  const [userLevel, setUserLevel] = useState(() => userData?.parentLevel || 1);
  const [xp, setXp] = useState(() => userData?.parentXp || 0);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const isCoParent = Boolean(
    userData?.isSecondaryParent ||
    userData?.isCoParent ||
    userData?.role === "co_parent" ||
    userData?.role === "secondary_parent" ||
    userData?.primary_parent_id
  );

  const activeChild = (userData?.children || []).find((c: any) => c.childId === userData?.activeChildId);
  const childClass = activeChild?.childClass || userData?.childClass || "";
  const childPhoto = activeChild?.childPhoto || userData?.childPhoto || "";

  const [reportData, setReportData] = useState<any>(null);
  const [modalType, setModalType] = useState<"strengths" | "weaknesses" | "risks" | "lastActivity" | "graph" | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [risks, setRisks] = useState<string[]>([]);
  const [strengthSubjects, setStrengthSubjects] = useState<any[]>([]);
  const [weaknessSubjects, setWeaknessSubjects] = useState<any[]>([]);
  const [riskSubjects, setRiskSubjects] = useState<any[]>([]);
  const [todayTime, setTodayTime] = useState(0);
  const [solvedToday, setSolvedToday] = useState(0);
  const [todayConfidenceScore, setTodayConfidenceScore] = useState(0);

  const [weeklyTrend, setWeeklyTrend] = useState<{ day: string, score: number }[]>([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState<{
    subject: string;
    accuracy: number;
    isStrength?: boolean;
    isWeakness?: boolean;
    isRisk?: boolean;
    consecutiveDaysBelow70?: number;
    chaptersCompleted?: number;
    totalChapters?: number;
    progress?: number;
    correctAnswers?: number;
    wrongAnswers?: number;
    monthImprovement?: number | null;
    prevMonthAccuracy?: number | null;
    currentMonthAccuracy?: number | null;
    timeline?: any[];
    trend7Day?: any[];
  }[]>([]);
  const [lastActivity, setLastActivity] = useState<string>("Exploring new quests...");
  const [lastActivityDetails, setLastActivityDetails] = useState<any>(null);
  const [top3SubjectsTrend, setTop3SubjectsTrend] = useState<any[]>([]);
  const [allSubjectsTrend, setAllSubjectsTrend] = useState<any[]>([]);
  const [hasEnoughData, setHasEnoughData] = useState(true);
  const [hasRiskAlert, setHasRiskAlert] = useState(false);
  const [riskTrend, setRiskTrend] = useState<{ day: string, score: number, isPredicted?: boolean }[]>([]);
  const [mathTrend, setMathTrend] = useState<{ day: string, score: number, isPredicted?: boolean }[]>([]);
  const [scienceTrend, setScienceTrend] = useState<{ day: string, score: number, isPredicted?: boolean }[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dailyTipTitle, setDailyTipTitle] = useState<string | null>(null);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [breakdownData, setBreakdownData] = useState<any>(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);

  const openBreakdown = async () => {
    setShowBreakdownModal(true);
    setLoadingBreakdown(true);
    try {
      const tzOffset = -new Date().getTimezoneOffset();
      const res = await apiFetch(`/api/parent/today-breakdown?tz_offset_minutes=${tzOffset}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBreakdownData(json.data);
      }
    } catch (err) {
      console.error("Failed to load breakdown", err);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  const getActiveChildId = () => userData?.activeChildId || null;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const tzOffset = -new Date().getTimezoneOffset();
      
      const userRes = await apiFetch("/api/users/me").catch(() => null);
      let currentChildId = userData?.activeChildId || null;

      if (userRes && userRes.ok) {
        const json = await userRes.json();
        if (json.success && json.data?.user) {
          const user = json.data.user;
          setUserData(user);
          setChildName(user.childName || "Explorer");
          setParentPhoto(user.parentPhoto || "");
          setUserLevel(user.parentLevel || 1);
          setXp(user.parentXp || 0);
          currentChildId = user.activeChildId || currentChildId;
        }
      }

      if (!currentChildId) {
        try {
          const stored = localStorage.getItem("userData");
          if (stored) {
            const u = JSON.parse(stored);
            currentChildId = u.activeChildId || u.children?.[0]?.childId || null;
          }
        } catch (e) {}
      }

      const childParam = currentChildId ? `&childId=${currentChildId}` : "";
      
      const [reportRes, notifRes, tipRes] = await Promise.all([
        apiFetch(`/api/parent/report?tz_offset_minutes=${tzOffset}${childParam}`).catch(() => null),
        apiFetch(`/api/notifications?role=parent${childParam}`).catch(() => null),
        apiFetch("/api/parent/daily-tip").catch(() => null)
      ]);

      if (tipRes && tipRes.ok) {
        const tipJson = await tipRes.json();
        if (tipJson.success && tipJson.data?.title) {
          setDailyTipTitle(tipJson.data.title);
        }
      }

      if (reportRes && reportRes.ok) {
        const repJson = await reportRes.json();
        if (repJson.success && repJson.data) {
          setReportData(repJson.data);
          if (repJson.data.hasEnoughData !== undefined) setHasEnoughData(Boolean(repJson.data.hasEnoughData));
          if (repJson.data.hasRiskAlert !== undefined) setHasRiskAlert(Boolean(repJson.data.hasRiskAlert));
          if (repJson.data.riskTrend) setRiskTrend(repJson.data.riskTrend);
          if (repJson.data.mathTrend) setMathTrend(repJson.data.mathTrend);
          if (repJson.data.scienceTrend) setScienceTrend(repJson.data.scienceTrend);
          if (repJson.data.strengths) setStrengths(repJson.data.strengths);
          if (repJson.data.weaknesses) setWeaknesses(repJson.data.weaknesses);
          if (repJson.data.risks) setRisks(repJson.data.risks);
          if (repJson.data.strengthSubjects) setStrengthSubjects(repJson.data.strengthSubjects);
          if (repJson.data.weaknessSubjects) setWeaknessSubjects(repJson.data.weaknessSubjects);
          if (repJson.data.riskSubjects) setRiskSubjects(repJson.data.riskSubjects);
          if (repJson.data.todayTimeMinutes !== undefined) setTodayTime(repJson.data.todayTimeMinutes);
          if (repJson.data.todaySolved !== undefined) setSolvedToday(repJson.data.todaySolved);
          if (repJson.data.todayConfidenceScore !== undefined) setTodayConfidenceScore(repJson.data.todayConfidenceScore);
          if (repJson.data.weeklyTrend) setWeeklyTrend(repJson.data.weeklyTrend);
          if (repJson.data.subjectBreakdown) setSubjectBreakdown(repJson.data.subjectBreakdown);
          if (repJson.data.lastActivity) setLastActivity(repJson.data.lastActivity);
          setLastActivityDetails(repJson.data.lastActivityDetails || null);
          if (repJson.data.top3SubjectsTrend) setTop3SubjectsTrend(repJson.data.top3SubjectsTrend);
          if (repJson.data.allSubjectsTrend) setAllSubjectsTrend(repJson.data.allSubjectsTrend);
        }
      }

      if (notifRes && notifRes.ok) {
        const notifJson = await notifRes.json();
        if (notifJson.success && notifJson.data) {
          setNotifications(notifJson.data);
          const uCount = notifJson.data.filter((n: any) => !n.isRead).length;
          setUnreadCount(uCount);
        }
      }

    } catch (err) {
      console.error("Failed to load user info", err);
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  useEffect(() => {
    loadData();

    const handleUserDataUpdate = () => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          setUserData(u);
        } catch (e) {}
      }
      loadData();
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => window.removeEventListener("userDataUpdated", handleUserDataUpdate);
  }, [loadData]);

  const handleOpenModal = (type: "strengths" | "weaknesses" | "risks") => {
    setModalType(type);
    loadData();
  };

  const markAllRead = async () => {
    try {
      const activeCid = userData?.activeChildId || getActiveChildId() || (() => {
        try {
          const stored = localStorage.getItem("userData");
          return stored ? JSON.parse(stored).activeChildId : null;
        } catch (e) { return null; }
      })();
      const markParam = activeCid ? `&childId=${encodeURIComponent(activeCid)}` : "";
      await apiFetch(`/api/notifications/mark-all-read?role=parent${markParam}`, { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) { }
  };

  const generateChartData = (customTrend?: { day: string, score: number }[], targetAcc?: number) => {
    const dataset = (customTrend && customTrend.length > 0) ? customTrend : weeklyTrend;
    if (!dataset || dataset.length === 0) return { pathLine: "", pathArea: "", points: [], labels: [] };
    const width = 300;
    const height = 120;
    const baseFinalScore = dataset[dataset.length - 1].score;
    const offset = (targetAcc !== undefined && (!customTrend || customTrend.length === 0)) ? targetAcc - baseFinalScore : 0;

    let lastKnown = 0;
    let started = false;
    const points = dataset.map((t, i) => {
      const x = (i / Math.max(1, (dataset.length - 1))) * width;
      let rawScore = typeof t.score === 'number' ? t.score : 0;
      if (rawScore > 0) {
        lastKnown = rawScore;
        started = true;
      } else if (started) {
        rawScore = lastKnown;
      }
      let score = rawScore + offset;
      score = Math.max(0, Math.min(100, score)); // clamp
      const y = height - (score / 100) * height;
      return { x, y, score: Math.round(score), day: t.day };
    });

    const pathLine = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
    const pathArea = `M 0,${height} L 0,${points[0].y} ${pathLine.substring(1)} L ${width},${height} Z`;

    return { pathLine, pathArea, points, labels: dataset.map(t => t.day) };
  };

  const translateSubjectName = (subj: string) => {
    if (!subj) return "";
    const lower = subj.toLowerCase();
    if (lower.includes("gujarati")) return t("gujarati", "Gujarati");
    if (lower.includes("math")) return t("maths", "Maths");
    if (lower.includes("english")) return t("english_subject", "English");
    if (lower.includes("science")) return t("science", "Science");
    if (lower.includes("social")) return t("social_studies", "Social Studies");
    if (lower.includes("hindi")) return t("hindi_subject", "Hindi");
    return t(subj, subj);
  };

  const translateModeName = (name: string) => {
    if (!name) return "";
    const lower = name.toLowerCase();
    if (lower.includes("practice")) return t("practice_quest", "Practice Quest");
    if (lower.includes("reading")) return t("reading_session", "Reading Session");
    if (lower.includes("battle") || lower.includes("shadow")) return t("shadow_arena", "Shadow Arena");
    return t(name, name);
  };

  const formatTimeFormatted = (str: string) => {
    if (!str) return "";
    return str
      .replace(/(\d+)\s*m\b/g, `$1 ${t("min_short", "m")}`)
      .replace(/(\d+)\s*s\b/g, `$1 ${t("sec_short", "s")}`)
      .replace(/(\d+)\s*h\b/g, `$1 ${t("hr_short", "h")}`);
  };

  const translateActivityTitle = (title: string) => {
    if (!title) return "";
    if (title === "Exploring new quests..." || title.includes("Exploring new quests")) {
      return t("exploring_new_quests", "Exploring new quests...");
    }
    if (title === "Practice Session") return t("practice_session", "Practice Session");
    if (title === "Reading Session") return t("reading_session", "Reading Session");
    if (title === "Shadow Arena Battle" || title.includes("Shadow Arena")) return t("shadow_arena_battle", "Shadow Arena Battle");
    if (title === "Quiz") return t("quiz", "Quiz");
    if (title.startsWith("Completed reading:")) {
      const rest = title.replace("Completed reading:", "").trim();
      return `${t("completed_reading", "Completed reading")}: ${t(rest, rest)}`;
    }
    if (title.startsWith("Completed Chapter")) {
      const chapNum = title.replace(/Completed Chapter\s*/i, "").trim();
      return t("completed_chapter_num", { num: chapNum, defaultValue: `અધ્યાય ${chapNum} પૂર્ણ કર્યો` });
    }
    if (title.startsWith("Completed")) {
      const rest = title.replace("Completed", "").trim();
      return `${t("completed", "Completed")} ${t(rest, rest)}`;
    }
    return t(title, title);
  };

  const translateInsightText = (text: string) => {
    if (!text) return "";
    let translated = text;
    const subjectMap: Record<string, string> = {
      "Mathematics": t("maths", "Maths"),
      "Gujarati": t("gujarati", "Gujarati"),
      "Maths": t("maths", "Maths"),
      "Math": t("maths", "Maths"),
      "Science": t("science", "Science"),
      "English": t("english_subject", "English"),
      "Social Studies": t("social_studies", "Social Studies"),
      "Hindi": t("hindi_subject", "Hindi")
    };

    for (const [subjEng, subjTrans] of Object.entries(subjectMap)) {
      translated = translated.replace(new RegExp(`\\b${subjEng}\\b`, "gi"), subjTrans);
    }

    translated = translated
      .replace(/is currently high performing with (\d+)% accuracy/g, (_, acc) =>
        t("insight_high_performing", { acc, defaultValue: `${acc}% ચોકસાઈ સાથે વર્તમાનમાં ઉચ્ચ પ્રદર્શન કરી રહ્યું છે.` })
      )
      .replace(/is showing an increasing trend with (\d+)% accuracy/g, (_, acc) =>
        t("insight_increasing_trend", { acc, defaultValue: `${acc}% ચોકસાઈ સાથે વધતી ક્ષમતા દર્શાવે છે.` })
      )
      .replace(/accuracy is currently (\d+)%\. Requires targeted practice\./g, (_, acc) =>
        t("insight_requires_practice", { acc, defaultValue: `ચોકસાઈ વર્તમાનમાં ${acc}% છે. લક્ષ્યાંકિત પ્રેક્ટિસની જરૂર છે.` })
      )
      .replace(/⚠️ Risk Alert: (.*?) score has stayed below 60% for 3 consecutive days \((.*?)\)\./g, (_, subj, trend) =>
        t("insight_risk_alert", { subj, trend, defaultValue: `⚠️ જોખમ ચેતવણી: ${subj} સ્કોર સતત 3 દિવસથી 60% થી નીચે રહ્યો છે (${trend}).` })
      )
      .replace(/🎉 You are on the right track! (.*?) accuracy has recovered above 60% \((\d+)%\)\./g, (_, subj, acc) =>
        t("insight_recovery_track", { subj, acc, defaultValue: `🎉 તમે યોગ્ય માર્ગ પર છો! ${subj} ચોકસાઈ 60% થી ઉપર સુધરી ગઈ છે (${acc}%).` })
      )
      .replace(/🎉 You are on the right track! (.*?) accuracy has improved to (\d+)% over the last 2 days\./g, (_, subj, acc) =>
        t("insight_improved_track", { subj, acc, defaultValue: `🎉 તમે યોગ્ય માર્ગ પર છો! ${subj} ચોકસાઈ છેલ્લા 2 દિવસમાં ${acc}% સુધી સુધરી છે.` })
      )
      .replace(/needs attention with (\d+)% accuracy/g, (_, acc) =>
        t("insight_needs_attention", { acc, defaultValue: `${acc}% ચોકસાઈ સાથે વધુ ધ્યાન આપવાની જરૂર છે.` })
      )
      .replace(/needs improvement with (\d+)% accuracy/g, (_, acc) =>
        t("insight_needs_improvement", { acc, defaultValue: `${acc}% ચોકસાઈ સાથે સુધારાની જરૂર છે.` })
      )
      .replace(/is maintaining good scores across all subjects/g,
        t("insight_maintaining_good", "તમામ વિષયોમાં સારું પ્રદર્શન જાળવી રહ્યું છે.")
      )
      .replace(/No weakness for now/g,
        t("no_weakness_for_now", "હાલમાં કોઈ નબળાઈ નથી.")
      )
      .replace(/No strength for now/g,
        t("no_strength_for_now", "હાલમાં કોઈ તાકાત નથી.")
      )
      .replace(/No risk for now/g,
        t("no_risk_for_now", "હાલમાં કોઈ જોખમ નથી.")
      )
      .replace(/Not enough Data for now wait few Days/gi,
        t("not_enough_data_for_now", "હાલમાં પૂરતો ડેટા નથી, થોડા દિવસ રાહ જુઓ")
      );

    return translated;
  };

  const formatNotifTitle = (title: string) => translateNotificationTitle(title, t);
  const formatNotifMsg = (msg: string) => translateNotificationMessage(msg, t);

  let highestSubject: string | null = null;
  let lowestSubject: string | null = null;
  let highestAcc: number | null = null;
  let lowestAcc: number | null = null;
  if (subjectBreakdown && subjectBreakdown.length > 0) {
    const sorted = [...subjectBreakdown].sort((a, b) => b.accuracy - a.accuracy);
    highestSubject = sorted[0].subject;
    highestAcc = sorted[0].accuracy;
    lowestSubject = sorted[sorted.length - 1].subject;
    lowestAcc = sorted[sorted.length - 1].accuracy;
  }

  const maxAccuracy = subjectBreakdown.length > 0 ? Math.max(...subjectBreakdown.map(s => s.accuracy)) : 0;
  
  // Strength: strictly accuracy >= 70%
  const rawStrengthList = Array.isArray(reportData?.strengthSubjects)
    ? reportData.strengthSubjects
    : (strengthSubjects.length > 0
      ? strengthSubjects
      : subjectBreakdown.filter(s => (s.accuracy ?? 0) >= 70 && (s.isStrength || s.accuracy === maxAccuracy)));
  const actualStrengthSubjects = !hasEnoughData
    ? []
    : rawStrengthList.filter((s: any) => (s.accuracy ?? 0) >= 70);

  const strengthSubNames = new Set(actualStrengthSubjects.map((s: any) => s.subject));

  // Weakness: strictly accuracy < 70% and persistent (consecutiveDaysBelow70 >= 2 or isWeakness), strictly excluding Strength
  const rawWeakList = Array.isArray(reportData?.weaknessSubjects)
    ? reportData.weaknessSubjects
    : (weaknessSubjects.length > 0
      ? weaknessSubjects
      : subjectBreakdown.filter(s => (s.accuracy ?? 0) < 70 && (s.isWeakness || (s.consecutiveDaysBelow70 !== undefined && s.consecutiveDaysBelow70 >= 2))));
  const actualWeakSubjects = !hasEnoughData
    ? []
    : rawWeakList.filter((s: any) => (s.accuracy ?? 0) < 70 && !strengthSubNames.has(s.subject));

  const weakSubNames = new Set(actualWeakSubjects.map((s: any) => s.subject));

  // Risk: strictly accuracy < 70% (Day 1 below 70%), strictly excluding Strength and Weakness
  const rawRiskList = Array.isArray(reportData?.riskSubjects)
    ? reportData.riskSubjects
    : (riskSubjects.length > 0
      ? riskSubjects
      : subjectBreakdown.filter(s => (s.accuracy ?? 0) < 70 && (s.isRisk || s.consecutiveDaysBelow70 === 1)));
  const actualRiskSubjects = !hasEnoughData
    ? []
    : rawRiskList.filter((s: any) => (s.accuracy ?? 0) < 70 && !strengthSubNames.has(s.subject) && !weakSubNames.has(s.subject));

  const activeTrend = modalType === "risks"
    ? (riskTrend && riskTrend.length > 0 ? riskTrend : undefined)
    : modalType === "weaknesses"
    ? (scienceTrend && scienceTrend.length > 0 ? scienceTrend : undefined)
    : modalType === "strengths"
    ? (mathTrend && mathTrend.length > 0 ? mathTrend : undefined)
    : undefined;
  const targetAcc = modalType === "strengths"
    ? (actualStrengthSubjects[0]?.accuracy ?? (maxAccuracy || undefined))
    : modalType === "weaknesses"
    ? (actualWeakSubjects.length > 0 ? Math.min(...actualWeakSubjects.map(s => s.accuracy)) : (lowestAcc ?? undefined))
    : modalType === "risks"
    ? (actualRiskSubjects.length > 0 ? Math.min(...actualRiskSubjects.map(s => s.accuracy)) : (lowestAcc ?? undefined))
    : undefined;
  const translatedHighest = highestSubject ? translateSubjectName(highestSubject) : "";
  const translatedLowest = lowestSubject ? translateSubjectName(lowestSubject) : "";

  const chartTitle = modalType === "strengths"
    ? (actualStrengthSubjects.length > 0 ? `${actualStrengthSubjects.map(s => translateSubjectName(s.subject)).join(" & ")} ${t("trend", "Trend")}` : (translatedHighest ? `${translatedHighest} ${t("trend", "Trend")}` : t("top_subject_trend", "Top Subject Trend")))
    : modalType === "weaknesses"
    ? (actualWeakSubjects.length > 0 ? `${actualWeakSubjects.map(s => translateSubjectName(s.subject)).join(" & ")} ${t("focus_trend", "Focus Trend")}` : (translatedLowest ? `${translatedLowest} ${t("focus_trend", "Focus Trend")}` : t("focus_area_trend", "Focus Area Trend")))
    : modalType === "risks"
    ? (actualRiskSubjects.length > 0 ? `${actualRiskSubjects.map(s => translateSubjectName(s.subject)).join(" & ")} ${t("at_risk_subject_trend", "At-Risk Subject Trend")}` : t("at_risk_subject_trend", "At-Risk Subject Trend"))
    : t("overall_trend", "Overall Trend");

  const chart = generateChartData(activeTrend, targetAcc);
  const currentScore = chart.points.length > 0 ? chart.points[chart.points.length - 1].score : 0;
  const startScore = chart.points.length > 0 ? chart.points[0].score : 0;
  const diff = chart.points.length > 0 ? currentScore - startScore : 0;
  const diffStr = chart.points.length > 0 ? (diff >= 0 ? `+${diff}% ${t("this_week", "this week")}` : `${diff}% ${t("this_week", "this week")}`) : "";
  const chartColor = modalType === "weaknesses" ? "#dc2626" : modalType === "risks" ? "#d97706" : "#006a62";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] font-sans relative pb-28 overflow-hidden">
        {/* Top App Bar Skeleton */}
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-50 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full animate-skeleton shrink-0" />
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full animate-skeleton shrink-0" />
            <div className="h-5 w-28 rounded-md animate-skeleton" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 rounded-full animate-skeleton hidden sm:block" />
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full animate-skeleton" />
          </div>
        </header>

        {/* Main Content Skeleton */}
        <div className="px-4 pt-20 max-w-lg mx-auto flex flex-col gap-4">
          {/* Profile Card Skeleton */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/70 shadow-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full animate-skeleton" />
                <div className="h-5 w-36 rounded-md animate-skeleton" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-16 rounded-full animate-skeleton" />
                <div className="h-6 w-20 rounded-full animate-skeleton" />
              </div>
            </div>

            {/* 2-Column Metrics Skeleton */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50/80 rounded-xl py-2 px-3 h-14 flex flex-col justify-center items-center border border-slate-200/60">
                <div className="h-5 w-14 rounded-md animate-skeleton mb-1" />
                <div className="h-2 w-16 rounded animate-skeleton" />
              </div>
              <div className="bg-slate-50/80 rounded-xl py-2 px-3 h-14 flex flex-col justify-center items-center border border-slate-200/60">
                <div className="h-5 w-10 rounded-md animate-skeleton mb-1" />
                <div className="h-2 w-16 rounded animate-skeleton" />
              </div>
            </div>

            {/* Confidence Progress Skeleton */}
            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between">
                <div className="h-2.5 w-32 rounded animate-skeleton" />
                <div className="h-2.5 w-6 rounded animate-skeleton" />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-3/4 rounded-full animate-skeleton" />
              </div>
            </div>
          </div>

          {/* Cognitive Cards Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-44 rounded animate-skeleton ml-1" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-slate-200/70 shadow-xs h-20 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg animate-skeleton" />
                  <div className="h-3.5 w-24 rounded animate-skeleton" />
                </div>
                <div className="h-2.5 w-3/4 rounded animate-skeleton" />
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs h-44 animate-skeleton" />

          {/* Recent Activity Skeleton */}
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded animate-skeleton ml-1" />
            <div className="bg-white rounded-2xl p-3 border border-slate-200/70 shadow-xs h-14 animate-skeleton" />
          </div>

          {/* Parent Learning 2x2 Grid Skeleton */}
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded animate-skeleton ml-1" />
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/70 shadow-xs flex flex-col justify-start">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-lg animate-skeleton" />
                    <div className="h-4 w-10 rounded-full animate-skeleton" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-16 rounded animate-skeleton" />
                    <div className="h-2 w-24 rounded animate-skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderTop3SubjectsGraphCard = () => {

    const sourceSubjects: any[] = (allSubjectsTrend && allSubjectsTrend.length > 0)
      ? allSubjectsTrend
      : ((top3SubjectsTrend && top3SubjectsTrend.length > 0)
        ? top3SubjectsTrend
        : (subjectBreakdown && subjectBreakdown.length > 0 ? subjectBreakdown : []));

    let displaySubjects: { subject: string; accuracy: number; color: string; bg: string; timeline: any[] }[] = [];

    if (sourceSubjects.length > 0) {
      displaySubjects = sourceSubjects.map((item: any, idx: number) => {
        const matchingSb = subjectBreakdown.find(s => s.subject.toLowerCase() === item.subject.toLowerCase());
        const acc = matchingSb ? matchingSb.accuracy : (item.accuracy !== undefined ? item.accuracy : 0);
        const colorEntry = getSubjectChartColor(item.subject, idx);
        return {
          subject: item.subject,
          accuracy: acc,
          color: colorEntry.color,
          bg: colorEntry.bg,
          timeline: item.timeline || []
        };
      });
    } else {
      // Dynamic fallback based on child standard and educational board
      const chClass = (userData?.childClass || "").toLowerCase();
      const chBoard = (userData?.childBoard || "").toLowerCase();
      let defaultSubjNames = ["Mathematics", "English", "Hindi"];
      if (chBoard.includes("gseb") || chBoard.includes("guj")) {
        defaultSubjNames = ["Gujarati", "Mathematics"];
      } else if (chClass.includes("1") || chClass.includes("2")) {
        defaultSubjNames = ["Mathematics", "English", "Hindi"];
      } else {
        defaultSubjNames = ["Mathematics", "Science", "English", "Hindi"];
      }

      displaySubjects = defaultSubjNames.map((sName, idx) => {
        const colorEntry = getSubjectChartColor(sName, idx);
        return {
          subject: sName,
          accuracy: 0,
          color: colorEntry.color,
          bg: colorEntry.bg,
          timeline: [
            { day: "Sat", score: 0 },
            { day: "Sun", score: 0 },
            { day: "Mon", score: 0 },
            { day: "Tue", score: 0 },
            { day: "Wed", score: 0 },
            { day: "Thu", score: 0 },
            { day: "Fri", score: 0 }
          ]
        };
      });
    }

    let dayLabels: string[] = [];
    if (displaySubjects[0]?.timeline?.length > 0) {
      dayLabels = displaySubjects[0].timeline.map((t: any) => t.day);
    } else if (weeklyTrend && weeklyTrend.length > 0) {
      dayLabels = weeklyTrend.map(w => w.day);
    }

    if (dayLabels.length === 0) {
      const daysAbbr = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dayLabels.push(daysAbbr[d.getDay() % 7]);
      }
    }

    const topY = 15;
    const bottomY = 110;
    const chartHeight = bottomY - topY;
    const startX = 35;
    const endX = 305;
    const chartWidth = endX - startX;

    const getX = (idx: number) => startX + (idx / Math.max(1, dayLabels.length - 1)) * chartWidth;
    const getY = (val: number) => bottomY - (Math.max(0, Math.min(100, val)) / 100) * chartHeight;

    return (
      <div className="bg-white rounded-[22px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(20,23,121,0.04)] border border-slate-200/70 flex flex-col gap-3 font-sans">
        
        {/* Header Title & Badge */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-none">
              {t("subject_performance_label", "SUBJECT PERFORMANCE")}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#141779] tracking-tight mt-1">
              {t("top_subjects_daily_trend", "Top Subjects Daily Trend")}
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {t("performance_last_7_days", "Performance over the last 7 active days")}
            </p>
          </div>
          <div className="bg-indigo-50/90 border border-indigo-100/90 px-2.5 py-1 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-[10px] font-extrabold text-[#141779] leading-none">7-DAY TREND</span>
          </div>
        </div>

        {/* Dynamic Subject Pills Row - Single Line with Horizontal Scroll & Indicator Color */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mt-0.5 -mx-1 px-1 scroll-smooth">
          {displaySubjects.map((subItem, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap shadow-2xs transition-transform active:scale-95 ${subItem.bg}`}
            >
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/70" 
                style={{ backgroundColor: subItem.color }} 
              />
              <span>{translateSubjectName(subItem.subject)} ({subItem.accuracy}%)</span>
            </div>
          ))}
        </div>

        {/* SVG Multi-Line Chart with Y-Axis Percentage Labels */}
        <div className="w-full relative mt-2">
          <svg viewBox="0 0 320 125" className="w-full h-auto overflow-visible">
            {/* Horizontal Dashed Grid Lines & Percentage Scale Labels */}
            {[100, 75, 50, 25].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={idx}>
                  <text x={startX - 5} y={y + 3.5} textAnchor="end" className="text-[9px] fill-slate-400 font-bold">
                    {val}%
                  </text>
                  <line x1={startX} y1={y} x2={endX} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                </g>
              );
            })}

            {/* Baseline 0% Axis Line & Label */}
            <text x={startX - 5} y={bottomY + 3.5} textAnchor="end" className="text-[9px] fill-slate-400 font-bold">
              0%
            </text>
            <line x1={startX} y1={bottomY} x2={endX} y2={bottomY} stroke="#e2e8f0" strokeWidth="1" />

            {/* Dynamic Subject Lines & Points */}
            {displaySubjects.map((subItem, subIdx) => {
              const rawScores = subItem.timeline?.map((t: any) => (typeof t.score === 'number' ? t.score : 0)) || [];
              
              // Enforce strict 0% baseline prior to first activity, and forward-fill once established
              let scores: number[] = [];
              if (rawScores.length === dayLabels.length) {
                scores = rawScores;
              } else {
                scores = dayLabels.map((_, i) => (typeof rawScores[i] === 'number' ? rawScores[i] : 0));
              }

              let lastKnownScore = 0;
              let scoreStarted = false;
              scores = scores.map((s: number) => {
                if (s > 0) {
                  lastKnownScore = s;
                  scoreStarted = true;
                  return s;
                }
                if (scoreStarted) {
                  return lastKnownScore;
                }
                return 0;
              });

              const pts = scores.map((s: number, i: number) => ({ x: getX(i), y: getY(s) }));
              const lineD = `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;

              return (
                <g key={subIdx}>
                  <path 
                    d={lineD} 
                    fill="none" 
                    stroke={subItem.color} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    opacity={scores.some(s => s > 0) ? 0.95 : 0.4}
                  />
                  {pts.map((p: any, i: number) => (
                    <circle 
                      key={i} 
                      cx={p.x} 
                      cy={p.y} 
                      r="3.5" 
                      fill="#ffffff" 
                      stroke={subItem.color} 
                      strokeWidth="2.5" 
                    />
                  ))}
                </g>
              );
            })}
          </svg>

          {/* All 7 Days Date Labels */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-2" style={{ paddingLeft: `${startX}px`, paddingRight: `${320 - endX}px` }}>
            {dayLabels.map((day, i) => (
              <span key={i} className={i === dayLabels.length - 1 ? "font-extrabold text-[#141779]" : ""}>
                {day}
              </span>
            ))}
          </div>
        </div>

      </div>
    );
  };

  const renderGraphCard = (
    mode: "dashboard" | "strengths" | "weaknesses" | "risks" | "lastActivity" | "graph" | string
  ) => {
    // 1. New User State (No Data Available)
    if (!hasEnoughData || subjectBreakdown.length === 0) {
      return (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center gap-3 font-sans my-2 min-h-[200px]">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl shadow-inner border border-slate-100">
            📊
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {t("no_data_available", "No data available")}
            </h4>
            <p className="text-xs text-slate-500 font-semibold mt-1 max-w-[280px] leading-relaxed">
              {t("no_test_activity_yet", "No test data or activity recorded yet. Take quizzes or practice tests to unlock performance trend graphs!")}
            </p>
          </div>
        </div>
      );
    }

    // Category-specific empty state handling for users with activity
    if (mode === "strengths" && actualStrengthSubjects.length === 0) {
      return (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center gap-3 font-sans my-2 min-h-[200px]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shadow-inner border border-emerald-100">
            💪
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {t("no_strengths_title", "No Strengths Yet")}
            </h4>
            <p className="text-xs text-slate-500 font-semibold mt-1 max-w-[280px] leading-relaxed">
              {t("keep_playing_build_strengths", "Keep playing to build up strong subjects at or above 70%!")}
            </p>
          </div>
        </div>
      );
    }

    if (mode === "weaknesses" && actualWeakSubjects.length === 0) {
      return (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center gap-3 font-sans my-2 min-h-[200px]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shadow-inner border border-emerald-100">
            🎉
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">
              {t("no_weaknesses_title", "No Weaknesses Detected")}
            </h4>
            <p className="text-xs text-emerald-700 font-semibold mt-1 max-w-[280px] leading-relaxed">
              {t("no_weaknesses_desc", "Great job! All active subjects are performing consistently at or above 70%.")}
            </p>
          </div>
        </div>
      );
    }

    if (mode === "risks" && actualRiskSubjects.length === 0) {
      return (
        <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center justify-center text-center gap-3 font-sans my-2 min-h-[200px]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shadow-inner border border-emerald-100">
            ✅
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">
              {t("no_risk_alerts", "No Risk Alerts")}
            </h4>
            <p className="text-xs text-emerald-700 font-semibold mt-1 max-w-[280px] leading-relaxed">
              {t("no_risk_alerts_desc", { name: cleanChildName, defaultValue: `All clear! ${cleanChildName} has no subjects below 70% right now.` })}
            </p>
          </div>
        </div>
      );
    }

    let dayLabels: string[] = [];
    if (weeklyTrend && weeklyTrend.length > 0) {
      dayLabels = weeklyTrend.map(w => w.day);
    } else if (riskTrend && riskTrend.length > 0) {
      dayLabels = riskTrend.map(r => r.day);
    }

    if (dayLabels.length === 0) {
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        dayLabels.push(`${dd}/${mm}`);
      }
    }

    const topY = 15;
    const bottomY = 110;
    const chartHeight = bottomY - topY;
    const startX = 35;
    const endX = 305;
    const chartWidth = endX - startX;

    const getX = (idx: number) => startX + (idx / Math.max(1, dayLabels.length - 1)) * chartWidth;
    const getY = (val: number) => bottomY - (Math.max(0, Math.min(100, val)) / 100) * chartHeight;

    // 1. Color Scheme & Mode Setup:
    // Risk = Warning Yellow/Amber (#d97706)
    // Weakness = Critical Red (#dc2626)
    // Strength = Emerald Green (#006a62)
    let activeSubjects: any[] = [];
    let badgeText = "";
    let themeColor = "#006a62";
    let badgeBg = "bg-[#e6f4ea] text-[#137333] border-[#ceead6]";
    let fillGradientId = "dashboardFillGrad";
    let categoryPalette: string[] = [];

    if (mode === "dashboard") {
      activeSubjects = actualStrengthSubjects.length > 0
        ? [actualStrengthSubjects[0]]
        : [{ subject: highestSubject || "Overall", accuracy: highestAcc ?? 80 }];
      themeColor = "#006a62";
      badgeBg = "bg-[#e6f4ea] text-[#137333] border-[#ceead6]";
      fillGradientId = "dashboardFillGrad";
      categoryPalette = ["#006a62"];
      badgeText = "+0% this week";
    } else if (mode === "strengths") {
      activeSubjects = actualStrengthSubjects.length > 0
        ? actualStrengthSubjects
        : [{ subject: highestSubject || "Overall", accuracy: highestAcc ?? 100 }];
      themeColor = "#006a62";
      badgeBg = "bg-[#e6f4ea] text-[#006a62] border-[#ceead6]";
      fillGradientId = "strengthFillGrad";
      categoryPalette = STRENGTH_GREEN_SHADES.map(s => s.color);
      badgeText = t("top_performing_badge", "Top Performing (≥70%)");
    } else if (mode === "weaknesses") {
      activeSubjects = actualWeakSubjects.length > 0
        ? actualWeakSubjects
        : [{ subject: lowestSubject || "Overall", accuracy: lowestAcc ?? 65 }];
      themeColor = "#dc2626"; // Critical Red Theme
      badgeBg = "bg-rose-50 text-[#dc2626] border-rose-200";
      fillGradientId = "weaknessFillGrad";
      categoryPalette = WEAKNESS_RED_SHADES.map(s => s.color);
      badgeText = t("needs_focus_badge", "Needs Focus (<70% for 2+ Days)");
    } else {
      // risks
      activeSubjects = actualRiskSubjects.length > 0
        ? actualRiskSubjects
        : [{ subject: lowestSubject || "Overall", accuracy: lowestAcc ?? 52 }];
      themeColor = "#d97706"; // Warning Yellow/Amber Theme
      badgeBg = "bg-amber-50 text-[#b45309] border-amber-200";
      fillGradientId = "riskFillGrad";
      categoryPalette = RISK_AMBER_SHADES.map(s => s.color);
      badgeText = t("at_risk_day1_badge", "At Risk (Day 1 <70%)");
    }

    // 2. Multi-Subject Series Computation with Dynamic Fluctuations (no flat lines)
    const isCategoryMode = isCategoryTrendMode(mode);

    const seriesList = activeSubjects.map((sItem: any, idx: number) => {
      const subjName = sItem.subject || "Subject";
      const targetAcc = typeof sItem.accuracy === "number" ? sItem.accuracy : 50;

      // Categorical Color-Shading Rules for 7-Day Trend Graphs:
      // Strengths -> Different shades of Green
      // Risks -> Different shades of Yellow / Amber
      // Weaknesses -> Different shades of Red
      const colorEntry = isCategoryMode
        ? getCategorySubjectChartColor(mode, idx)
        : getSubjectChartColor(subjName, idx);
      const lineColor = activeSubjects.length === 1 ? themeColor : colorEntry.color;

      // Match 7-day timeline: prefer sItem.trend7Day (keyed to DD/MM) or matchedTrend.timeline
      const matchedTrend = (top3SubjectsTrend || allSubjectsTrend || []).find(
        (t: any) => t.subject?.toLowerCase() === subjName.toLowerCase()
      );

      let scores: number[] = [];
      if (sItem.trend7Day && sItem.trend7Day.length > 0) {
        scores = sItem.trend7Day.map((item: any) => (typeof item.score === "number" ? item.score : 0));
      } else if (matchedTrend?.timeline && matchedTrend.timeline.length > 0) {
        scores = matchedTrend.timeline.map((item: any) => (typeof item.score === "number" ? item.score : 0));
      } else if (mode === "strengths" && mathTrend.length > 0 && idx === 0) {
        scores = mathTrend.map((t: any) => (typeof t.score === "number" ? t.score : 0));
      } else if (mode === "weaknesses" && scienceTrend.length > 0 && idx === 0) {
        scores = scienceTrend.map((t: any) => (typeof t.score === "number" ? t.score : 0));
      } else if (mode === "risks" && riskTrend.length > 0 && idx === 0) {
        scores = riskTrend.map((t: any) => (typeof t.score === "number" ? t.score : 0));
      }

      // Enforce strict 0% baseline prior to first activity, and forward-fill once established
      if (scores.length !== dayLabels.length) {
        scores = dayLabels.map((_, i) => (typeof scores[i] === "number" ? scores[i] : 0));
      }

      let lastKnownSubjScore = 0;
      let subjScoreStarted = false;
      scores = scores.map((s: number) => {
        if (s > 0) {
          lastKnownSubjScore = s;
          subjScoreStarted = true;
          return s;
        }
        if (subjScoreStarted) {
          return lastKnownSubjScore;
        }
        return 0;
      });

      const pts = scores.map((s, i) => ({ x: getX(i), y: getY(s), score: s }));
      const lineD = `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;
      const areaD = `M ${startX},${bottomY} L ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} ${lineD.substring(1)} L ${pts[pts.length - 1].x.toFixed(1)},${bottomY} Z`;

      return {
        subject: subjName,
        accuracy: targetAcc,
        color: lineColor,
        scores,
        pts,
        lineD,
        areaD
      };
    });

    const primaryScoreDisplay = activeSubjects.length === 1
      ? activeSubjects[0].accuracy
      : Math.round(activeSubjects.reduce((acc, s) => acc + (s.accuracy || 0), 0) / activeSubjects.length);

    const upperSubject = activeSubjects.map(s => translateSubjectName(s.subject)).join(" & ").toUpperCase();

    return (
      <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-3 font-sans">
        
        {/* Subtitle Header */}
        <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
          {upperSubject} TREND (7-DAY PERFORMANCE TREND)
        </span>

        {/* Large Score & Badge Row */}
        <div className="flex items-center justify-between">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: themeColor }}>
            {primaryScoreDisplay}%
          </span>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${badgeBg}`}>
            {badgeText}
          </span>
        </div>

        {/* Multi-Subject Pill Legend with Dedicated Categorical Color Shades */}
        {activeSubjects.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mt-0.5 -mx-1 px-1 scroll-smooth">
            {seriesList.map((item, idx) => {
              const colorInfo = isCategoryMode
                ? getCategorySubjectChartColor(mode, idx)
                : getSubjectChartColor(item.subject, idx);
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-extrabold border shrink-0 whitespace-nowrap shadow-2xs transition-transform active:scale-95 ${colorInfo.bg}`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/80 shadow-xs" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span>{translateSubjectName(item.subject)}</span>
                  <span className="font-black">({item.accuracy}%)</span>
                </div>
              );
            })}
          </div>
        )}

        {/* SVG Multi-Line Chart with Y-Axis Percentage Labels */}
        <div className="w-full relative mt-2">
          <svg viewBox="0 0 320 125" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dashed Grid Lines & Y-Axis Percentage Labels */}
            {[100, 75, 50, 25].map((val, idx) => {
              const y = getY(val);
              return (
                <g key={idx}>
                  <text x={startX - 5} y={y + 3.5} textAnchor="end" className="text-[9px] fill-slate-400 font-bold">
                    {val}%
                  </text>
                  <line x1={startX} y1={y} x2={endX} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                </g>
              );
            })}

            {/* Baseline 0% Axis Line & Label */}
            <text x={startX - 5} y={bottomY + 3.5} textAnchor="end" className="text-[9px] fill-slate-400 font-bold">
              0%
            </text>
            <line x1={startX} y1={bottomY} x2={endX} y2={bottomY} stroke="#e2e8f0" strokeWidth="1" />

            {/* Single Series Gradient Area Fill */}
            {seriesList.length === 1 && (
              <path d={seriesList[0].areaD} fill={`url(#${fillGradientId})`} />
            )}

            {/* Distinct Curve Lines & Hollow Points for Every Subject */}
            {seriesList.map((item, subIdx) => (
              <g key={subIdx}>
                <path 
                  d={item.lineD} 
                  fill="none" 
                  stroke={item.color} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {item.pts.map((p, i) => (
                  <circle 
                    key={i} 
                    cx={p.x} 
                    cy={p.y} 
                    r="3.5" 
                    fill="#ffffff" 
                    stroke={item.color} 
                    strokeWidth="2.5" 
                  />
                ))}
              </g>
            ))}
          </svg>

          {/* All 7 Days Date Labels Spaced Across Bottom */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-2" style={{ paddingLeft: `${startX}px`, paddingRight: `${320 - endX}px` }}>
            {dayLabels.map((day, i) => (
              <span key={i} className={i === dayLabels.length - 1 ? "font-extrabold text-[#141779]" : ""}>
                {day}
              </span>
            ))}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans relative pb-28">

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-50 shadow-[0_2px_12px_rgba(20,23,121,0.04)]">
        <div className="flex items-center gap-2.5 min-w-0">
          {!isCoParent && (
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={19} />
            </button>
          )}
          <button
            onClick={() => navigate('/parent/settings')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200/80 overflow-hidden bg-white shrink-0 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
            aria-label="Parent Profile"
          >
            <img
              src={parentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.fullName || "Parent")}&background=random`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-[#141779] tracking-tight truncate leading-tight">
                {t("parent_space") || "Parent Space"}
              </h1>
              {isCoParent && (
                <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                  Co-Parent
                </span>
              )}
            </div>
            <button
              onClick={() => setShowSwitcher(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 group cursor-pointer transition-colors text-left"
              title={t("switch_child_profile", "Switch Student Profile")}
            >
              <Users size={11} className="text-indigo-600 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[140px]">{cleanChildName}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-semibold">• {t("switch", "Switch")}</span>
              <ChevronDown size={11} className="text-slate-400 group-hover:text-indigo-600 shrink-0 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button 
            onClick={() => { setShowNotifications(true); markAllRead(); }} 
            className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#ba1a1a] rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="px-4 pt-20 max-w-lg mx-auto flex flex-col gap-3.5">

        {/* Full-width Kids Space Launcher Box (Primary Parent Only - Hidden for Co-Parents) */}
        {!isCoParent && (
          <button
            onClick={() => navigate("/home")}
            className="w-full bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-indigo-50/80 hover:from-indigo-100 hover:to-sky-100 p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-indigo-200/80 hover:border-indigo-300 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex items-center justify-between group cursor-pointer transition-all active:scale-[0.99] text-left"
            title={t("kids_space", "Kids Space")}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#141779] to-[#2d328f] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles size={19} className="text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-[#141779] leading-tight">
                    {t("kids_space", "Kids Space")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100/90 text-[#141779] text-[10px] font-extrabold uppercase tracking-wider">
                    {t("kids_mode", "Kids Mode")}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-indigo-700/80 font-medium truncate mt-0.5">
                  {t("kids_space_sub", "Return directly to student learning dashboard")}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/80 border border-indigo-200/70 text-[#141779] flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-all shadow-2xs ml-2">
              <ChevronRight size={16} />
            </div>
          </button>
        )}

        {/* 1. Student Profile, Journey, Metrics, and Confidence Score */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex flex-col gap-3.5">
          {/* Identity Header Row */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setShowSwitcher(true)}
              className="flex items-center gap-3 min-w-0 flex-1 text-left group cursor-pointer"
              title={t("switch_child_profile", "Click to switch student")}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#141779] to-[#2d328f] text-white flex items-center justify-center text-sm sm:text-base font-black shrink-0 shadow-2xs overflow-hidden border border-white/60 group-hover:scale-105 transition-transform">
                {childPhoto ? (
                  <img src={childPhoto} alt={cleanChildName} className="w-full h-full object-cover" />
                ) : (
                  cleanChildName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-black text-[#141779] leading-tight truncate group-hover:text-indigo-800 transition-colors">
                    {childName}'s {t("journey", "Journey")}
                  </h2>
                  <ChevronDown size={15} className="text-slate-400 group-hover:text-[#141779] shrink-0 transition-colors" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="text-[10px] sm:text-xs font-black text-white bg-[#141779] px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                    {t('lvl_explorer', { level: userLevel, defaultValue: `Lvl ${userLevel}` })}
                  </span>
                  {childClass && (
                    <span className="text-[10px] sm:text-xs font-bold text-[#141779] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                      {childClass}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Active profile status badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] sm:text-xs font-extrabold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("active_profile", "Active")}</span>
              </span>
            </div>
          </div>

          {/* Today's Learning Metrics (2-column layout, spacious & clear) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-slate-50/80 rounded-2xl py-2.5 sm:py-3 px-3.5 sm:px-4 flex flex-col items-center justify-center border border-slate-200/70 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-[#006a62] leading-none mb-1">
                {todayTime}<span className="text-sm sm:text-base font-bold ml-0.5">m</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                {t('todays_time', "TODAY'S TIME")}
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl py-2.5 sm:py-3 px-3.5 sm:px-4 flex flex-col items-center justify-center border border-slate-200/70 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-[#30007f] leading-none mb-1">
                {solvedToday}
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
                {t('solved_today', 'SOLVED TODAY')}
              </span>
            </div>
          </div>

          {/* Daily Confidence Score with Progress Bar & Details Affordance */}
          <div className="w-full pt-1">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#141779] tracking-wider uppercase">
                  {t('daily_confidence_score', 'DAILY CONFIDENCE SCORE')}
                </span>
                <button
                  onClick={openBreakdown}
                  className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-full transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{t('details', 'Details')}</span>
                  <span>→</span>
                </button>
              </div>
              <span className="text-xs sm:text-sm font-black text-[#141779]">{todayConfidenceScore}%</span>
            </div>
            <div className="h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-[#141779] to-[#2d328f] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, todayConfidenceScore))}%` }}
              />
            </div>
            <p 
              onClick={openBreakdown}
              className="text-[10px] sm:text-[11px] text-slate-500 font-medium cursor-pointer hover:text-indigo-900 transition-colors truncate"
            >
              {t('confidence_score_sub', { attempts: solvedToday, defaultValue: `Based on today's correct answers (${solvedToday} attempts) • Tap for details` })}
            </p>
          </div>
        </div>

        {/* 2. Cognitive Strengths, Weaknesses, and Risk Alerts (Screenshot 2 content) */}
        <div id="dna-section" className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {t('cognitive_strengths_weaknesses', 'Cognitive Strengths & Weaknesses')}
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Strengths Card */}
            <button
              onClick={() => handleOpenModal("strengths")}
              className="w-full bg-white rounded-2xl p-3.5 border border-slate-200/70 shadow-xs flex flex-col justify-between text-left hover:border-teal-300 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100/80 flex items-center justify-center text-sm">
                      💪
                    </div>
                    <h4 className="text-sm font-black text-[#006a62]">{t('strengths', 'Strengths')}</h4>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {!hasEnoughData || subjectBreakdown.length === 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {t('no_data_available', 'No data available')}
                  </span>
                ) : actualStrengthSubjects.length === 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {t('no_strengths_yet', 'No strength for now.')}
                  </span>
                ) : (
                  <div className="space-y-1">
                    {actualStrengthSubjects.map((ss, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs font-bold text-[#006a62]">
                        <CheckCircle size={13} className="text-[#006a62] shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {translateSubjectName(ss.subject)} is currently high performing with {ss.accuracy}% accuracy.
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-teal-700 font-extrabold uppercase tracking-wider mt-2.5">
                {t('fast_processor', 'Fast Processor')}
              </span>
            </button>

            {/* Areas for Review (Weaknesses) Card */}
            <button
              onClick={() => handleOpenModal("weaknesses")}
              className="w-full bg-white rounded-2xl p-3.5 border border-slate-200/70 shadow-xs flex flex-col justify-between text-left hover:border-rose-300 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100/80 flex items-center justify-center text-sm">
                      ⚠️
                    </div>
                    <h4 className="text-sm font-black text-[#ba1a1a]">{t('weaknesses', 'Areas to Improve')}</h4>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {!hasEnoughData || subjectBreakdown.length === 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {t('no_data_available', 'No data available')}
                  </span>
                ) : actualWeakSubjects.length === 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {t('all_subjects_top_level', 'No weaknesses detected 🎉')}
                  </span>
                ) : (
                  <div className="space-y-1">
                    {actualWeakSubjects.map((ws, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs font-bold text-[#ba1a1a]">
                        <AlertTriangle size={13} className="text-[#ba1a1a] shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {translateSubjectName(ws.subject)} needs improvement with {ws.accuracy}% accuracy.
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider mt-2.5">
                {t('review_needed', 'Review Needed')}
              </span>
            </button>

            {/* Risk Alerts Card */}
            <button
              onClick={() => handleOpenModal("risks")}
              className="w-full bg-white rounded-2xl p-3.5 border border-slate-200/70 shadow-xs flex flex-col justify-between text-left hover:border-amber-300 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100/80 flex items-center justify-center text-sm">
                      🔔
                    </div>
                    <h4 className="text-sm font-black text-[#d97706]">{t('risk_alerts', 'Risk Alerts')}</h4>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {!hasEnoughData || subjectBreakdown.length === 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {t('no_data_available', 'No data available')}
                  </span>
                ) : actualRiskSubjects.length === 0 ? (
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {t('no_risk_alerts_badge', '✅ No Risk Alerts')}
                  </span>
                ) : (
                  <div className="space-y-1">
                    {actualRiskSubjects.map((rs, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs font-semibold text-amber-800">
                        <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {translateSubjectName(rs.subject)} needs attention with {rs.accuracy}% accuracy.
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider mt-2.5">
                {t('three_day_alerts', '3-Day Alerts')}
              </span>
            </button>
          </div>
        </div>

        {/* Performance Trend Chart */}
        {renderTop3SubjectsGraphCard()}

        {/* 3. Recent Kids Activity (Child's immediate activity directly following subject trends) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {t("recent_activity", "Recent Activity")}
            </h3>
            <button
              onClick={() => navigate('/parent/kids-activity')}
              className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer flex items-center gap-1 group"
            >
              <span>{t("view_all", "View All").replace(/[-–—]?\s*[>→›»]/g, "").replace(/->/g, "").trim()}</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          <button
            onClick={() => navigate('/parent/kids-activity')}
            className="w-full bg-white rounded-2xl p-3 border border-slate-200/70 shadow-xs flex justify-between items-center hover:bg-slate-50 hover:shadow-sm transition-all group gap-3 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Clock size={17} className="text-[#141779]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <h4 className="text-xs font-black text-[#141779] leading-tight truncate">
                    {translateActivityTitle(lastActivityDetails?.title || lastActivity)}
                  </h4>
                  {lastActivityDetails && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[8px] font-black uppercase tracking-wider ${
                      lastActivityDetails.type === "reading" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      lastActivityDetails.type === "battle" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                      lastActivityDetails.type === "multiplayer" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                      "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}>
                      {lastActivityDetails.type === "reading" ? `📖 ${t("reading", "Reading")}` :
                       lastActivityDetails.type === "battle" ? `🐉 ${t("boss", "Boss")}` :
                       lastActivityDetails.type === "multiplayer" ? `⚔️ ${t("arena", "Arena")}` :
                       `🎯 ${t("quiz", "Quiz")}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  {lastActivityDetails?.timeTaken > 0 && (
                    <span>⏱️ {Math.round(lastActivityDetails.timeTaken / 60) || 1}m</span>
                  )}
                  {lastActivityDetails?.timeTaken > 0 && lastActivityDetails?.totalQuestions > 0 && <span>•</span>}
                  {lastActivityDetails?.totalQuestions > 0 && (
                    <span className="text-indigo-600 font-bold">
                      🎯 {lastActivityDetails.correctQuestions}/{lastActivityDetails.totalQuestions} {t("correct", "Correct")}
                    </span>
                  )}
                  {!lastActivityDetails && (
                    <span className="text-slate-400">{t("recent_activity_logged", "Activity logged")}</span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#141779] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* 4. Parent Learning Section — Compact & Polished */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {t("parent_learning", "Parent Learning")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Daily Tip */}
            <button
              onClick={() => navigate('/parent/daily-tip')}
              className="bg-white hover:bg-teal-50/30 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 hover:border-teal-300 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-start group cursor-pointer min-w-0 w-full"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 text-[#006a62] flex items-center justify-center shrink-0">
                  <BrainCircuit size={15} />
                </div>
                <span className="bg-teal-50 text-teal-700 border border-teal-200/80 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                  {t("hot", "Hot")}
                </span>
              </div>
              <div className="w-full min-w-0">
                <h4 className="text-xs font-black text-[#141779] group-hover:text-teal-700 transition-colors leading-tight truncate">
                  {t("daily_tip", "Daily Tip")}
                </h4>
                <p 
                  className="text-[10px] text-slate-500 font-medium truncate mt-0.5 leading-tight"
                  title={dailyTipTitle || t("daily_tip_sub", "Quick family harmony ideas.")}
                >
                  {dailyTipTitle || t("daily_tip_sub", "Quick family harmony ideas.")}
                </p>
              </div>
            </button>

            {/* Lessons */}
            <button
              onClick={() => navigate('/parent/lessons')}
              className="bg-white hover:bg-indigo-50/30 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-start group cursor-pointer min-w-0 w-full"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-[#141779] flex items-center justify-center shrink-0">
                  <BookOpen size={15} />
                </div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                  {t("new", "New")}
                </span>
              </div>
              <div className="w-full min-w-0">
                <h4 className="text-xs font-black text-[#141779] group-hover:text-indigo-700 transition-colors leading-tight truncate">
                  {t("lessons", "Lessons")}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 leading-tight" title={t("lessons_sub", "Bite-sized parent growth.")}>
                  {t("lessons_sub", "Bite-sized parent growth.")}
                </p>
              </div>
            </button>

            {/* Challenges */}
            <button
              onClick={() => navigate('/parent/challenges')}
              className="bg-white hover:bg-purple-50/30 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-start group cursor-pointer min-w-0 w-full"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 text-[#30007f] flex items-center justify-center shrink-0">
                  <Target size={15} />
                </div>
                <span className="bg-purple-50 text-purple-700 border border-purple-200/80 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                  {t("live", "Live")}
                </span>
              </div>
              <div className="w-full min-w-0">
                <h4 className="text-xs font-black text-[#141779] group-hover:text-purple-700 transition-colors leading-tight truncate">
                  {t("challenges", "Challenges")}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 leading-tight" title={t("challenges_sub", "Build strong daily habits.")}>
                  {t("challenges_sub", "Build strong daily habits.")}
                </p>
              </div>
            </button>

            {/* Rewards */}
            <button
              onClick={() => navigate('/parent/achievements')}
              className="bg-white hover:bg-emerald-50/30 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-start group cursor-pointer min-w-0 w-full"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-[#007168] flex items-center justify-center shrink-0">
                  <Award size={15} />
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                  {t("badges", "Badges")}
                </span>
              </div>
              <div className="w-full min-w-0">
                <h4 className="text-xs font-black text-[#141779] group-hover:text-emerald-700 transition-colors leading-tight truncate">
                  {t("rewards", "Rewards")}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 leading-tight" title={t("rewards_sub", "View your milestones.")}>
                  {t("rewards_sub", "View your milestones.")}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 5. Settings & DNA Compact Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate('/parent/settings')}
            className="bg-white rounded-xl p-2.5 border border-slate-200/70 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Settings size={15} className="text-slate-700" />
              </div>
              <span className="text-xs font-black text-[#141779] truncate">{t("settings", "Settings")}</span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          <button
            onClick={() => navigate('/parent/learning-dna')}
            className="bg-white rounded-xl p-2.5 border border-slate-200/70 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100/80 flex items-center justify-center shrink-0">
                <BrainCircuit size={15} className="text-[#006a62]" />
              </div>
              <span className="text-xs font-black text-[#141779] truncate">{t("dna", "DNA")}</span>
            </div>
            <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

      </main>



      {/* Graph Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-5 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#f7f9fb] w-full sm:w-[400px] max-w-full rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setModalType(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                  <ArrowLeft size={20} color="#141779" />
                </button>
                <h2 className="text-lg font-bold text-[#141779]">
                  {modalType === "strengths" ? t("cognitive_strengths_modal_title", "💪 Cognitive Strengths") :
                    modalType === "weaknesses" ? t("areas_for_review_modal_title", "⚠️ Areas for Review") :
                    modalType === "risks" ? t("risk_alerts_modal_title", "🔔 Risk Alerts") :
                      t("cognitive_profile_graph", "Cognitive Profile Graph")}
                </h2>
              </div>
              <button onClick={() => setModalType(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                <X size={20} color="#464652" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!hasEnoughData || subjectBreakdown.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200/80 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">📊</span>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t("no_data_available", "No Data Available")}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                    {t("no_test_activity_yet", "No test data or activity recorded yet. Complete quizzes or tests to unlock personalized performance trend graphs!")}
                  </p>
                </div>
              ) : modalType === "risks" && actualRiskSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">✅</span>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">{t("no_risk_alerts", "No Risk Alerts")}</h4>
                  <p className="text-xs text-emerald-700 font-bold mt-2 leading-relaxed">
                    {t("no_risk_alerts_desc", { name: cleanChildName, defaultValue: `All clear! ${cleanChildName} has no subjects below 70% right now.` })}
                  </p>
                </div>
              ) : modalType === "weaknesses" && actualWeakSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">🎉</span>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">{t("no_weaknesses_title", "No Weaknesses Detected")}</h4>
                  <p className="text-xs text-emerald-700 font-bold mt-2 leading-relaxed">
                    {t("no_weaknesses_desc", {
                      name: cleanChildName,
                      defaultValue: `Great job! ${cleanChildName} has all active subjects performing consistently at or above 70%.`
                    })}
                  </p>
                </div>
              ) : modalType === "strengths" && actualStrengthSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">💪</span>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t("no_strengths_title", "No Strengths Yet")}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                    {t("keep_playing_build_strengths", "Keep playing to build up strong subjects at or above 70%!")}
                  </p>
                </div>
              ) : (
                <>
                  {/* Modal-Specific Distinct Graph Card */}
                  {modalType && renderGraphCard(modalType)}

                  {/* Subject Breakdown / Weaknesses Section */}
                  <div className="space-y-3">
                    <h3 className="text-[13px] font-bold text-[#141779] border-b border-gray-100 pb-2">
                      {modalType === "strengths"
                        ? t("top_performing_subjects", "Top Performing Subject(s) (≥ 70%)")
                        : modalType === "weaknesses"
                        ? t("areas_for_review_title", "Areas for Improvement (< 70% for 2+ Days)")
                        : modalType === "risks"
                        ? t("at_risk_subjects_title", "At-Risk Subjects (Day 1 < 70%)")
                        : t("performance_by_subject", "Performance by Subject")}
                    </h3>

                    {modalType === "weaknesses" ? (
                      /* Enhanced Weaknesses Cards (consecutive days < 70%) */
                      <div className="space-y-3">
                        {actualWeakSubjects.map((sb, idx) => {
                          const improvementNeeded = Math.max(1, maxAccuracy - sb.accuracy);
                          const subjName = translateSubjectName(sb.subject);
                          const normSubj = sb.subject.toLowerCase();

                          const matchingWeakness = weaknesses?.find(
                            w =>
                              w.toLowerCase().includes(normSubj) &&
                              !w.includes("No weakness") &&
                              !w.includes("Not enough Data") &&
                              !w.includes("No data available")
                          );

                          let insightText = "";
                          if (matchingWeakness && !matchingWeakness.includes("currently")) {
                            insightText = translateInsightText(matchingWeakness);
                          } else if (sb.wrongAnswers !== undefined && sb.wrongAnswers > 0) {
                            insightText = t("weakness_insight_review_mistakes", {
                              subject: subjName,
                              count: sb.wrongAnswers,
                              defaultValue: `Practice ${subjName} regularly and review recent mistakes.`
                            });
                          } else {
                            insightText = t("weakness_insight_general", {
                              subject: subjName,
                              defaultValue: `Review chapter concepts in ${subjName} and retry practice questions to lift score above 70%.`
                            });
                          }

                          return (
                            <div
                              key={idx}
                              className="bg-white rounded-2xl p-4 border border-rose-200/90 shadow-xs space-y-2.5"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                  {actualWeakSubjects.length > 1 && (
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white shadow-2xs" 
                                      style={{ backgroundColor: getCategorySubjectChartColor("weaknesses", idx).color }} 
                                    />
                                  )}
                                  <span>{subjName}</span>
                                  <span className="text-xs">⚠️</span>
                                </h4>
                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#dc2626] border border-rose-200 flex items-center gap-1">
                                  <span className="text-[8px]">●</span>
                                  <span>{t("status_needs_improvement", "Needs Improvement (2+ Days)")}</span>
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-[#dc2626] font-bold">
                                  {`${subjName} needs improvement with ${sb.accuracy}% accuracy.`}
                                </span>
                                {improvementNeeded > 0 && (
                                  <span className="text-[11px] text-[#dc2626] font-bold bg-rose-50/70 px-2 py-0.5 rounded-md">
                                    {t("improvement_needed_gap", {
                                      gap: improvementNeeded,
                                      defaultValue: `+${improvementNeeded}% to match top subject`
                                    })}
                                  </span>
                                )}
                              </div>

                              <div className="h-2.5 w-full bg-rose-100/70 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{ 
                                    width: `${Math.min(100, Math.max(5, sb.accuracy))}%`,
                                    backgroundColor: actualWeakSubjects.length > 1 ? getCategorySubjectChartColor("weaknesses", idx).color : "#dc2626"
                                  }}
                                />
                              </div>

                              {(sb.wrongAnswers !== undefined && sb.correctAnswers !== undefined && (sb.correctAnswers + sb.wrongAnswers > 0)) && (
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-0.5">
                                  <span>{t("accuracy_label", "Accuracy")}: {sb.accuracy}%</span>
                                  <span>•</span>
                                  <span className="text-slate-600">{t("solved_count", { correct: sb.correctAnswers, total: sb.correctAnswers + sb.wrongAnswers, defaultValue: `${sb.correctAnswers}/${sb.correctAnswers + sb.wrongAnswers} correct` })}</span>
                                  {sb.wrongAnswers > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="text-[#dc2626]">{t("mistakes_count", { count: sb.wrongAnswers, defaultValue: `${sb.wrongAnswers} mistakes` })}</span>
                                    </>
                                  )}
                                </div>
                              )}

                              <div className="bg-rose-50/60 rounded-xl p-2.5 border border-rose-100/80 text-[11px] leading-relaxed">
                                <span className="font-extrabold text-[#dc2626]">
                                  {t("actionable_insight_label", "Actionable Insight")}:{" "}
                                </span>
                                <span className="font-semibold text-slate-700">{insightText}</span>
                              </div>
                            </div>
                          );
                        })}

                        {actualWeakSubjects.length === 0 && (
                          <p className="text-xs text-[#006a62] font-semibold bg-[#006a62]/10 p-3.5 rounded-xl text-center">
                            {t("no_weaknesses_desc", {
                              name: cleanChildName,
                              defaultValue: `🎉 Fantastic! ${cleanChildName} has all active subjects performing at or above 70%.`
                            })}
                          </p>
                        )}
                      </div>
                    ) : modalType === "risks" ? (
                      /* Enhanced Risks Cards (Day 1 below 70%) */
                      <div className="space-y-3">
                        {actualRiskSubjects.map((sb, idx) => {
                          const subjName = translateSubjectName(sb.subject);
                          return (
                            <div
                              key={idx}
                              className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-xs space-y-2.5"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                  {actualRiskSubjects.length > 1 && (
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white shadow-2xs" 
                                      style={{ backgroundColor: getCategorySubjectChartColor("risks", idx).color }} 
                                    />
                                  )}
                                  <span>{subjName}</span>
                                  <span className="text-xs">🔔</span>
                                </h4>
                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#b45309] border border-amber-200 flex items-center gap-1">
                                  <span className="text-[8px]">●</span>
                                  <span>{t("status_risk_day1", "At Risk (Day 1 <70%)")}</span>
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-[#b45309] font-bold">
                                  {`${subjName} needs attention with ${sb.accuracy}% accuracy.`}
                                </span>
                              </div>

                              <div className="h-2.5 w-full bg-amber-100/70 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{ 
                                    width: `${Math.min(100, Math.max(5, sb.accuracy))}%`,
                                    backgroundColor: actualRiskSubjects.length > 1 ? getCategorySubjectChartColor("risks", idx).color : "#d97706"
                                  }}
                                />
                              </div>

                              {(sb.wrongAnswers !== undefined && sb.correctAnswers !== undefined && (sb.correctAnswers + sb.wrongAnswers > 0)) && (
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-0.5">
                                  <span>{t("accuracy_label", "Accuracy")}: {sb.accuracy}%</span>
                                  <span>•</span>
                                  <span className="text-slate-600">{t("solved_count", { correct: sb.correctAnswers, total: sb.correctAnswers + sb.wrongAnswers, defaultValue: `${sb.correctAnswers}/${sb.correctAnswers + sb.wrongAnswers} correct` })}</span>
                                </div>
                              )}

                              <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-100/80 text-[11px] leading-relaxed">
                                <span className="font-extrabold text-[#b45309]">
                                  {t("recovery_tip_label", "Recovery Tip")}:{" "}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {t("risk_recovery_tip", {
                                    subject: subjName,
                                    defaultValue: `Practice ${subjName} tomorrow and score 70% or above to automatically recover and clear this alert.`
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {actualRiskSubjects.length === 0 && (
                          <p className="text-xs text-[#006a62] font-semibold bg-[#006a62]/10 p-3.5 rounded-xl text-center">
                            {t("no_risk_alerts_desc", { name: cleanChildName, defaultValue: `All clear! ${cleanChildName} has no subjects below 70% right now.` })}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* modalType === "strengths": Enhanced Strengths Cards (with ties displayed concurrently) */
                      <div className="space-y-3">
                        {actualStrengthSubjects.map((sb, idx) => {
                          const subjName = translateSubjectName(sb.subject);
                          return (
                            <div
                              key={idx}
                              className="bg-white rounded-2xl p-4 border border-emerald-200/90 shadow-xs space-y-2.5"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-black text-[#006a62] flex items-center gap-1.5">
                                  {actualStrengthSubjects.length > 1 && (
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white shadow-2xs" 
                                      style={{ backgroundColor: getCategorySubjectChartColor("strengths", idx).color }} 
                                    />
                                  )}
                                  <span>{subjName}</span>
                                  <span className="text-xs">🏆</span>
                                </h4>
                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006a62] border border-emerald-200 flex items-center gap-1">
                                  <span className="text-[8px]">●</span>
                                  <span>{t("top_performing_badge", "Top Performing (≥70%)")}</span>
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-[#006a62] font-bold">
                                  {`${subjName} is currently high performing with ${sb.accuracy}% accuracy.`}
                                </span>
                              </div>

                              <div className="h-2.5 w-full bg-emerald-100/70 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{ 
                                    width: `${Math.min(100, Math.max(5, sb.accuracy))}%`,
                                    backgroundColor: actualStrengthSubjects.length > 1 ? getCategorySubjectChartColor("strengths", idx).color : "#006a62"
                                  }}
                                />
                              </div>

                              {(sb.correctAnswers !== undefined && sb.wrongAnswers !== undefined && (sb.correctAnswers + sb.wrongAnswers > 0)) && (
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-0.5">
                                  <span>{t("accuracy_label", "Accuracy")}: {sb.accuracy}%</span>
                                  <span>•</span>
                                  <span className="text-slate-600">{t("solved_count", { correct: sb.correctAnswers, total: sb.correctAnswers + sb.wrongAnswers, defaultValue: `${sb.correctAnswers}/${sb.correctAnswers + sb.wrongAnswers} correct` })}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {actualStrengthSubjects.length === 0 && (
                          <p className="text-xs text-[#767683] font-semibold bg-slate-100 p-3.5 rounded-xl text-center">
                            {t("keep_playing_build_strengths", "Keep playing to build up strong subjects at or above 70%!")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* General Insight Box (kept for strengths, risks, or other non-weakness views) */}
                  {modalType !== "weaknesses" && (
                    <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100">
                      <p className="text-xs text-[#141779] leading-relaxed">
                        <span className="font-bold text-[#141779]">{t("actionable_insight", "Actionable Insight: ")} </span>
                        {modalType === "risks" ? (
                          actualRiskSubjects.length > 0 ? (
                            translateInsightText(
                              actualRiskSubjects
                                .map(s => `${translateSubjectName(s.subject)} needs attention with ${s.accuracy}% accuracy.`)
                                .join(" ")
                            )
                          ) : (
                            <>{t("maintaining_good_scores", { name: cleanChildName, defaultValue: `${cleanChildName} is maintaining good scores across all subjects.` })}</>
                          )
                        ) : modalType === "strengths" ? (
                          actualStrengthSubjects.length > 0 ? (
                            translateInsightText(
                              actualStrengthSubjects
                                .map(s => `${translateSubjectName(s.subject)} is currently high performing with ${s.accuracy}% accuracy.`)
                                .join(" ")
                            )
                          ) : (
                            <>{t("showing_good_performance", { name: cleanChildName, defaultValue: `${cleanChildName} is showing good performance in active subjects.` })}</>
                          )
                        ) : (
                          <>{t("no_trend_data_available", "No trend data available yet. Complete more quizzes to get personalized insights.")}</>
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* View Reports CTA */}
            {hasEnoughData && (
              <div className="p-5 pt-2 border-t border-slate-100 bg-white/50 shrink-0">
                <button
                  onClick={() => { setModalType(null); navigate('/parent/reports'); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#141779] text-white font-extrabold text-sm py-3 px-5 rounded-2xl hover:bg-[#1e23a0] active:scale-[0.98] transition-all shadow-md shadow-[#141779]/20"
                >
                  <span>📊</span>
                  <span>
                    {modalType === "weaknesses" ? t("review_mistakes_reports", "Review Mistakes & Reports") : t("view_subject_reports", "View Subject Reports")}
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Side Panel / Modal Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] flex justify-end animate-in fade-in duration-200">
          <div className="w-full sm:w-[420px] h-full bg-[#f7f9fb] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-200/80 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779]">
                  <Bell size={18} />
                </div>
                <h2 className="text-xl font-black text-[#141779]">
                  {t("notifications", "Notifications")}
                </h2>
              </div>
              <button 
                onClick={() => setShowNotifications(false)} 
                className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] mb-3 shadow-xs">
                    <Bell size={28} className="opacity-70" />
                  </div>
                  <p className="text-base font-bold text-[#141779]">
                    {t("no_notifications_yet", "No notifications yet!")}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1 max-w-[240px]">
                    {t("no_recent_activity", "No recent activity to show.")}
                  </p>
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  let iconBadge = <Bell size={18} />;
                  let badgeStyle = "bg-indigo-50 text-[#141779] border-indigo-100";
                  
                  if (notif.type === "gamification") {
                    iconBadge = <Sparkles size={18} />;
                    badgeStyle = "bg-teal-50 text-teal-700 border-teal-200";
                  } else if (notif.type === "habit") {
                    iconBadge = <Flame size={18} />;
                    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
                  } else if (notif.type === "learning") {
                    iconBadge = <BookOpen size={18} />;
                    badgeStyle = "bg-indigo-50 text-[#141779] border-indigo-200";
                  } else if (notif.type === "reward" || notif.type === "spin") {
                    iconBadge = <Trophy size={18} />;
                    badgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
                  } else if (notif.type === "warning" || notif.type === "risk") {
                    iconBadge = <AlertTriangle size={18} />;
                    badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
                  }
                  
                  return (
                    <div 
                      key={notif._id || idx} 
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(20,23,121,0.04)] hover:shadow-md hover:border-indigo-200/80 transition-all flex items-start gap-3.5 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${badgeStyle}`}>
                        {iconBadge}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-[15px] font-bold text-[#141779] leading-snug">
                            {formatNotifTitle(notif.title)}
                          </h4>
                          {notif.createdAt && (
                            <span className="text-xs font-semibold text-slate-500 shrink-0 mt-0.5">
                              {new Date(notif.createdAt).toLocaleString(undefined, { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-base font-medium text-[#191c1e] leading-relaxed mt-1">
                          {formatNotifMsg(notif.message)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Today's Time & Attempt Breakdown Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 bg-[#0f114a]/75 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] sm:rounded-[32px] max-w-lg w-full max-h-[90vh] flex flex-col p-5 sm:p-6 shadow-2xl relative border border-white/60">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#141779] flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{t("todays_time_breakdown_title", "Today's Time Breakdown")}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold mt-0.5">
                  {t("detailed_calc_for", { name: childName, defaultValue: `Detailed calculation for ${childName}` })}
                </p>
              </div>
              <button 
                onClick={() => setShowBreakdownModal(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {loadingBreakdown ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                <div className="w-8 h-8 border-3 border-[#141779] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-500">{t("calculating_todays_time", "Calculating today's time & attempts...")}</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-4">
                
                {/* 3 Summary Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">{t("total_time", "Total Time")}</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-700">{formatTimeFormatted(breakdownData?.totalTimeFormatted || "0m")}</span>
                  </div>

                  <div className="bg-indigo-50/80 border border-indigo-200/80 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider block">{t("questions", "Questions")}</span>
                    <span className="text-lg sm:text-xl font-black text-[#141779]">{breakdownData?.totalSolved || 0}</span>
                    <span className="text-[10px] text-indigo-600 font-bold block">{t("num_correct", { count: breakdownData?.totalCorrect || 0, defaultValue: `${breakdownData?.totalCorrect || 0} correct!` })}</span>
                  </div>

                  <div className="bg-purple-50/80 border border-purple-200/80 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider block">{t("confidence", "Confidence")}</span>
                    <span className="text-lg sm:text-xl font-black text-purple-700">{breakdownData?.confidenceScore || 0}%</span>
                  </div>
                </div>

                {/* Mode Breakdown Cards */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">{t("time_spent_by_mode", "Time Spent by Mode")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {breakdownData?.modeBreakdown && Object.entries(breakdownData.modeBreakdown).map(([key, m]: [string, any]) => (
                      <div key={key} className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                            <span>{m.icon}</span>
                            <span className="truncate">{translateModeName(m.name.split('/')[0])}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold">{m.count} {t("questions", "questions")}</p>
                        </div>
                        <span className="text-xs font-black text-[#141779] bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                          {Math.floor(m.timeSec / 60)}{t("min_short", "m")} {m.timeSec % 60}{t("sec_short", "s")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itemized Question & Answer List */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{t("todays_question_attempts", "Today's Question Attempts")}</span>
                    <span className="text-[10px] font-bold text-slate-500">({breakdownData?.attempts?.length || 0} {t("items_upper", "ITEMS")})</span>
                  </h4>

                  {(!breakdownData?.attempts || breakdownData.attempts.length === 0) ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                      <p className="text-xs font-bold text-slate-500">{t("no_question_attempts_logged", "No question attempts logged today yet.")}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{t("play_quiz_shadow_arena", "Play a Quiz, Shadow Arena battle, or AI quest to record live time!")}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {breakdownData.attempts.map((att: any, idx: number) => (
                        <div 
                          key={att.id || idx}
                          className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs">{att.modeIcon}</span>
                              <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                {translateModeName(att.mode)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold ml-auto">{att.timestamp}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 truncate">{att.questionText}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-extrabold text-slate-600 bg-slate-200/60 px-2 py-1 rounded-lg">
                              ⏱️ {formatTimeFormatted(att.timeFormatted)}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                              att.isCorrect 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}>
                              {att.isCorrect ? t("correct_check", "Correct ✓") : t("incorrect_cross", "Incorrect ✕")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-indigo-50/80 border border-indigo-100 p-3 rounded-2xl text-xs text-[#141779] font-bold flex items-center justify-between">
                  <span>{t("total_calculated_time", "Total Calculated Time:")}</span>
                  <span className="text-sm font-black text-[#141779] bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-2xs">
                    {formatTimeFormatted(breakdownData?.totalTimeFormatted || "0m")} ({breakdownData?.totalSolved || 0} {t("attempts", "attempts")})
                  </span>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      <ChildSwitcherModal 
        isOpen={showSwitcher} 
        onClose={() => setShowSwitcher(false)} 
        user={userData} 
        onUserUpdated={(u) => setUserData(u)}
        onSwitched={() => { setLoading(true); setRefreshKey(k => k + 1); }}
      />
    </div>
  );
}
