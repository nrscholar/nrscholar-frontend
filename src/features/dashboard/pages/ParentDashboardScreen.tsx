import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BookOpen, Clock, Heart, ShieldAlert, Sparkles, TrendingUp, Trophy, Zap, ChevronRight, Download, Share2, Award, Calendar, CheckCircle, CheckCircle2, Target, BarChart2, Flame, UserCheck, RefreshCw, X, AlertTriangle, Users, BrainCircuit, Activity, Settings } from "lucide-react";
import FamilyLinkModal from "../../../components/FamilyLinkModal";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import { translateNotificationTitle, translateNotificationMessage } from "../../../utils/notificationTranslator";

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

  const [modalType, setModalType] = useState<"strengths" | "weaknesses" | "risks" | "lastActivity" | "graph" | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [risks, setRisks] = useState<string[]>([]);
  const [todayTime, setTodayTime] = useState(0);
  const [solvedToday, setSolvedToday] = useState(0);
  const [todayConfidenceScore, setTodayConfidenceScore] = useState(0);

  const [weeklyTrend, setWeeklyTrend] = useState<{ day: string, score: number }[]>([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState<{
    subject: string;
    accuracy: number;
    chaptersCompleted?: number;
    totalChapters?: number;
    progress?: number;
    correctAnswers?: number;
    wrongAnswers?: number;
    bossSuccessRate?: number;
    monthImprovement?: number | null;
    prevMonthAccuracy?: number | null;
    currentMonthAccuracy?: number | null;
    timeline?: any[];
  }[]>([]);
  const [lastActivity, setLastActivity] = useState<string>("Exploring new quests...");
  const [lastActivityDetails, setLastActivityDetails] = useState<any>(null);
  const [top3SubjectsTrend, setTop3SubjectsTrend] = useState<any[]>([]);
  const [hasEnoughData, setHasEnoughData] = useState(true);
  const [hasRiskAlert, setHasRiskAlert] = useState(false);
  const [riskTrend, setRiskTrend] = useState<{ day: string, score: number, isPredicted?: boolean }[]>([]);
  const [mathTrend, setMathTrend] = useState<{ day: string, score: number, isPredicted?: boolean }[]>([]);
  const [scienceTrend, setScienceTrend] = useState<{ day: string, score: number, isPredicted?: boolean }[]>([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
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
      let currentChildId = null;

      if (userRes && userRes.ok) {
        const json = await userRes.json();
        if (json.success && json.data?.user) {
          const user = json.data.user;
          setUserData(user);
          setChildName(user.childName || "Explorer");
          setParentPhoto(user.parentPhoto || "");
          setUserLevel(user.parentLevel || 1);
          setXp(user.parentXp || 0);
          currentChildId = user.activeChildId || null;
        }
      }

      const childParam = currentChildId ? `&childId=${currentChildId}` : "";
      
      const [reportRes, notifRes] = await Promise.all([
        apiFetch(`/api/parent/report?tz_offset_minutes=${tzOffset}${childParam}`).catch(() => null),
        apiFetch("/api/notifications").catch(() => null)
      ]);

      if (reportRes && reportRes.ok) {
        const repJson = await reportRes.json();
        if (repJson.success && repJson.data) {
          if (repJson.data.hasEnoughData !== undefined) setHasEnoughData(Boolean(repJson.data.hasEnoughData));
          if (repJson.data.hasRiskAlert !== undefined) setHasRiskAlert(Boolean(repJson.data.hasRiskAlert));
          if (repJson.data.riskTrend) setRiskTrend(repJson.data.riskTrend);
          if (repJson.data.mathTrend) setMathTrend(repJson.data.mathTrend);
          if (repJson.data.scienceTrend) setScienceTrend(repJson.data.scienceTrend);
          if (repJson.data.strengths) setStrengths(repJson.data.strengths);
          if (repJson.data.weaknesses) setWeaknesses(repJson.data.weaknesses);
          if (repJson.data.risks) setRisks(repJson.data.risks);
          if (repJson.data.todayTimeMinutes !== undefined) setTodayTime(repJson.data.todayTimeMinutes);
          if (repJson.data.todaySolved !== undefined) setSolvedToday(repJson.data.todaySolved);
          if (repJson.data.todayConfidenceScore !== undefined) setTodayConfidenceScore(repJson.data.todayConfidenceScore);
          if (repJson.data.weeklyTrend) setWeeklyTrend(repJson.data.weeklyTrend);
          if (repJson.data.subjectBreakdown) setSubjectBreakdown(repJson.data.subjectBreakdown);
          if (repJson.data.lastActivity) setLastActivity(repJson.data.lastActivity);
          setLastActivityDetails(repJson.data.lastActivityDetails || null);
          if (repJson.data.top3SubjectsTrend) setTop3SubjectsTrend(repJson.data.top3SubjectsTrend);
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
    };
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    return () => window.removeEventListener("userDataUpdated", handleUserDataUpdate);
  }, [loadData]);

  const markAllRead = async () => {
    try {
      await apiFetch("/api/notifications/mark-all-read?role=parent", { method: "POST" });
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

    const points = dataset.map((t, i) => {
      const x = (i / Math.max(1, (dataset.length - 1))) * width;
      let score = t.score + offset;
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
  const actualStrengthSubjects = subjectBreakdown.filter(s => s.accuracy === maxAccuracy && s.accuracy >= 60);
  const actualWeakSubjects = subjectBreakdown.filter(s => s.accuracy >= 60 && s.accuracy < maxAccuracy);
  const actualRiskSubjects = subjectBreakdown.filter(s => s.accuracy < 60);

  const activeTrend = modalType === "risks"
    ? (riskTrend && riskTrend.length > 0 ? riskTrend : undefined)
    : modalType === "weaknesses"
    ? (scienceTrend && scienceTrend.length > 0 ? scienceTrend : undefined)
    : modalType === "strengths"
    ? (mathTrend && mathTrend.length > 0 ? mathTrend : undefined)
    : undefined;
  const targetAcc = modalType === "strengths"
    ? (maxAccuracy || undefined)
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
    ? (translatedLowest ? `${translatedLowest} ${t("focus_trend", "Focus Trend")}` : t("focus_area_trend", "Focus Area Trend"))
    : modalType === "risks"
    ? t("at_risk_subject_trend", "At-Risk Subject Trend")
    : t("overall_trend", "Overall Trend");

  const chart = generateChartData(activeTrend, targetAcc);
  const currentScore = chart.points.length > 0 ? chart.points[chart.points.length - 1].score : 0;
  const startScore = chart.points.length > 0 ? chart.points[0].score : 0;
  const diff = chart.points.length > 0 ? currentScore - startScore : 0;
  const diffStr = chart.points.length > 0 ? (diff >= 0 ? `+${diff}% ${t("this_week", "this week")}` : `${diff}% ${t("this_week", "this week")}`) : "";
  const chartColor = (modalType === "weaknesses" || modalType === "risks") ? "#ba1a1a" : "#006a62";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] px-5 pt-24 pb-24 flex flex-col gap-6 relative font-sans overflow-hidden">
        {/* Top App Bar Skeleton */}
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 h-20 bg-white/80 backdrop-blur-xl border-b border-white/40 z-50 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full animate-skeleton shrink-0"></div>
            <div className="w-10 h-10 rounded-full animate-skeleton shrink-0"></div>
            <div className="h-6 w-32 rounded-lg animate-skeleton"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full animate-skeleton"></div>
            <div className="w-10 h-10 rounded-full animate-skeleton"></div>
          </div>
        </header>

        {/* Student Summary Hero Card Skeleton */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border-2 border-white/50 shadow-sm space-y-5">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-28 rounded-md animate-skeleton"></div>
              <div className="h-7 w-48 rounded-xl animate-skeleton"></div>
            </div>
            <div className="h-7 w-28 rounded-full animate-skeleton"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/80 rounded-[18px] p-4 h-24 flex flex-col justify-between border border-slate-200/60 shadow-xs">
              <div className="h-8 w-16 rounded-lg animate-skeleton mx-auto"></div>
              <div className="h-3 w-20 rounded-md animate-skeleton mx-auto"></div>
            </div>
            <div className="bg-slate-50/80 rounded-[18px] p-4 h-24 flex flex-col justify-between border border-slate-200/60 shadow-xs">
              <div className="h-8 w-12 rounded-lg animate-skeleton mx-auto"></div>
              <div className="h-3 w-20 rounded-md animate-skeleton mx-auto"></div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between">
              <div className="h-4 w-44 rounded-md animate-skeleton"></div>
              <div className="h-4 w-12 rounded-md animate-skeleton"></div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 rounded-full animate-skeleton"></div>
            </div>
          </div>
        </div>

        {/* Cognitive Strengths & Weaknesses Grid Skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-56 rounded-md animate-skeleton"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur-md rounded-[20px] p-4 border border-slate-200/80 shadow-xs space-y-3 h-28 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full animate-skeleton"></div>
                <div className="h-4 w-20 rounded-md animate-skeleton"></div>
              </div>
              <div className="h-3 w-28 rounded-md animate-skeleton"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-[20px] p-4 border border-slate-200/80 shadow-xs space-y-3 h-28 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full animate-skeleton"></div>
                <div className="h-4 w-20 rounded-md animate-skeleton"></div>
              </div>
              <div className="h-3 w-28 rounded-md animate-skeleton"></div>
            </div>
          </div>
        </div>

        {/* Quick Action Grid Skeleton */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-[20px] p-4 h-36 flex flex-col justify-between border border-slate-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-full animate-skeleton"></div>
              <div className="space-y-2">
                <div className="h-4 w-16 rounded-md animate-skeleton"></div>
                <div className="h-3 w-20 rounded-md animate-skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderTop3SubjectsGraphCard = () => {
    const themeColors = ["#047857", "#1e1b4b", "#7e22ce"];
    const themeBgs = [
      "bg-emerald-50 text-emerald-800 border-emerald-200",
      "bg-indigo-50 text-indigo-900 border-indigo-200",
      "bg-purple-50 text-purple-900 border-purple-200"
    ];

    let displaySubjects: { subject: string; accuracy: number; color: string; bg: string; timeline: any[] }[] = [];

    if (top3SubjectsTrend && top3SubjectsTrend.length > 0) {
      displaySubjects = top3SubjectsTrend.slice(0, 3).map((item: any, idx: number) => {
        const matchingSb = subjectBreakdown.find(s => s.subject.toLowerCase() === item.subject.toLowerCase());
        const acc = matchingSb ? matchingSb.accuracy : (item.timeline && item.timeline.length > 0 ? item.timeline[item.timeline.length - 1].score : 80);
        return {
          subject: item.subject,
          accuracy: acc,
          color: themeColors[idx % themeColors.length],
          bg: themeBgs[idx % themeBgs.length],
          timeline: item.timeline || []
        };
      });
    } else if (subjectBreakdown && subjectBreakdown.length > 0) {
      displaySubjects = subjectBreakdown.slice(0, 3).map((sb, idx) => ({
        subject: sb.subject,
        accuracy: sb.accuracy,
        color: themeColors[idx % themeColors.length],
        bg: themeBgs[idx % themeBgs.length],
        timeline: sb.timeline || []
      }));
    }

    if (displaySubjects.length === 0) {
      displaySubjects = [
        { subject: "Hindi", accuracy: 84, color: themeColors[0], bg: themeBgs[0], timeline: [] },
        { subject: "MATHS", accuracy: 36, color: themeColors[1], bg: themeBgs[1], timeline: [] },
        { subject: "English", accuracy: 78, color: themeColors[2], bg: themeBgs[2], timeline: [] }
      ];
    }

    let dayLabels: string[] = [];
    if (displaySubjects[0]?.timeline?.length > 0) {
      dayLabels = displaySubjects[0].timeline.map((t: any) => t.day);
    } else if (weeklyTrend && weeklyTrend.length > 0) {
      dayLabels = weeklyTrend.map(w => w.day);
    }

    if (dayLabels.length === 0) {
      const daysAbbr = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
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
    const startX = 15;
    const endX = 305;
    const chartWidth = endX - startX;

    const getX = (idx: number) => startX + (idx / Math.max(1, dayLabels.length - 1)) * chartWidth;
    const getY = (val: number) => bottomY - (val / 100) * chartHeight;

    return (
      <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-3 font-sans">
        
        {/* Header Title & Badge */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="text-sm sm:text-base font-extrabold text-[#141779] tracking-wide uppercase">
              {t("top_subjects_daily_trend", "TOP SUBJECTS DAILY TREND")}
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              {t("performance_last_7_days", "Performance over the last 7 active days")}
            </p>
          </div>
          <div className="bg-indigo-50/80 border border-indigo-100/80 px-3 py-1.5 rounded-2xl flex flex-col items-center justify-center shrink-0">
            <span className="text-[9px] font-extrabold text-indigo-900 leading-none">7-DAY</span>
            <span className="text-[9px] font-extrabold text-indigo-900 leading-none mt-0.5">GRAPH</span>
          </div>
        </div>

        {/* Subject Pills Row */}
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {displaySubjects.map((subItem, idx) => (
            <div key={idx} className={`flex items-center gap-2 px-3 py-1 rounded-2xl text-xs font-extrabold border ${subItem.bg}`}>
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: subItem.color }} />
              <span>{translateSubjectName(subItem.subject)} ({subItem.accuracy}%)</span>
            </div>
          ))}
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="w-full relative mt-2">
          <svg viewBox="0 0 320 120" className="w-full h-auto overflow-visible">
            {/* Horizontal Dashed Grid Lines */}
            {[25, 50, 75, 100].map((val, idx) => {
              const y = getY(val);
              return (
                <line key={idx} x1={startX} y1={y} x2={endX} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              );
            })}

            {/* Subject Lines & Points */}
            {displaySubjects.map((subItem, subIdx) => {
              let scores = subItem.timeline?.map((t: any) => t.score) || [];
              if (scores.length === 0) {
                const acc = subItem.accuracy;
                scores = [Math.max(10, acc - 50), acc, acc, acc, acc - 10, acc, acc];
              }
              const pts = scores.map((s: number, i: number) => ({ x: getX(i), y: getY(s) }));
              const lineD = `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;

              return (
                <g key={subIdx}>
                  <path d={lineD} fill="none" stroke={subItem.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map((p: any, i: number) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke={subItem.color} strokeWidth="2.5" />
                  ))}
                </g>
              );
            })}
          </svg>

          {/* All 7 Days Date Labels */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-2 px-1">
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
    const bottomY = 115;
    const chartHeight = bottomY - topY;
    const startX = 15;
    const endX = 305;
    const chartWidth = endX - startX;

    const getX = (idx: number) => startX + (idx / Math.max(1, dayLabels.length - 1)) * chartWidth;
    const getY = (val: number) => bottomY - (val / 100) * chartHeight;

    let mainSubject = "MATHS";
    let scoreDisplay = 100;
    let badgeText = "+0% this week";
    let themeColor = "#006a62";
    let badgeBg = "bg-[#e6f4ea] text-[#137333] border-[#ceead6]";
    let fillGradientId = "dashboardFillGrad";
    let scoresData: number[] = [];

    if (mode === "dashboard") {
      mainSubject = highestSubject || "MATHS";
      scoresData = weeklyTrend.length > 0 ? weeklyTrend.map(w => Math.max(0, Math.min(100, w.score))) : dayLabels.map(() => 80);
      scoreDisplay = scoresData.length > 0 ? scoresData[scoresData.length - 1] : 80;
      const startS = scoresData.length > 0 ? scoresData[0] : 80;
      const diffS = scoreDisplay - startS;
      badgeText = diffS >= 0 ? `+${diffS}% ${t("this_week", "this week")}` : `${diffS}% ${t("this_week", "this week")}`;
      themeColor = "#006a62";
      badgeBg = "bg-[#e6f4ea] text-[#137333] border-[#ceead6]";
      fillGradientId = "dashboardFillGrad";
    } else if (mode === "strengths") {
      mainSubject = highestSubject || "MATHS";
      scoreDisplay = highestAcc !== null ? highestAcc : 100;
      badgeText = "+0% this week";
      themeColor = "#006a62";
      badgeBg = "bg-[#e6f4ea] text-[#137333] border-[#ceead6]";
      fillGradientId = "strengthFillGrad";
      scoresData = mathTrend.length > 0
        ? mathTrend.map(t => Math.max(0, Math.min(100, t.score)))
        : dayLabels.map(() => scoreDisplay);
    } else if (mode === "weaknesses") {
      mainSubject = lowestSubject || "SCIENCE";
      scoreDisplay = lowestAcc !== null ? lowestAcc : 65;
      badgeText = t("needs_focus", "Needs Focus");
      themeColor = "#d97706";
      badgeBg = "bg-[#fef3c7] text-[#b45309] border-[#fde68a]";
      fillGradientId = "weaknessFillGrad";
      scoresData = scienceTrend.length > 0
        ? scienceTrend.map(t => Math.max(0, Math.min(100, t.score)))
        : dayLabels.map(() => scoreDisplay);
    } else {
      mainSubject = actualRiskSubjects[0]?.subject || lowestSubject || "GUJARATI";
      scoreDisplay = actualRiskSubjects[0]?.accuracy || lowestAcc || 52;
      badgeText = t("at_risk_badge", "At Risk (<60%)");
      themeColor = "#dc2626";
      badgeBg = "bg-[#ffe4e6] text-[#b91c1c] border-[#fecdd3]";
      fillGradientId = "riskFillGrad";
      scoresData = riskTrend.length > 0
        ? riskTrend.map(t => Math.max(0, Math.min(100, t.score)))
        : dayLabels.map(() => scoreDisplay);
    }

    const pts = scoresData.map((s, i) => ({ x: getX(i), y: getY(s), score: s }));
    const lineD = `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;
    const areaD = `M ${startX},${bottomY} L ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} ${lineD.substring(1)} L ${pts[pts.length - 1].x.toFixed(1)},${bottomY} Z`;

    const upperSubject = translateSubjectName(mainSubject).toUpperCase();

    return (
      <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-3 font-sans">
        
        {/* Subtitle Header */}
        <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
          {upperSubject} TREND (7-DAY PERFORMANCE TREND)
        </span>

        {/* Large Score & Badge Row */}
        <div className="flex items-center justify-between">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: themeColor }}>
            {scoreDisplay}%
          </span>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${badgeBg}`}>
            {badgeText}
          </span>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full relative mt-1">
          <svg viewBox="0 0 320 125" className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dashed Grid Lines */}
            {[25, 50, 75, 100].map((val, idx) => {
              const y = getY(val);
              return (
                <line key={idx} x1={startX} y1={y} x2={endX} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill={`url(#${fillGradientId})`} />

            {/* Smooth Curve Line */}
            <path d={lineD} fill="none" stroke={themeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Hollow Circle Data Points */}
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={themeColor} strokeWidth="2.5" />
            ))}
          </svg>

          {/* All 7 Days Date Labels Spaced Across Bottom */}
          <div className="flex justify-between text-[11px] font-bold text-slate-400 pt-2 px-1">
            {dayLabels.map((day, i) => (
              <span key={i} className={i === dayLabels.length - 1 ? "font-extrabold text-[#006a62]" : ""}>
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] font-sans relative pb-24 overflow-x-hidden">

      {/* Dynamic Background Glows */}
      <div className="absolute top-[5%] -right-[20%] w-[350px] h-[350px] rounded-full bg-[rgba(87,250,233,0.15)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[20%] w-[400px] h-[400px] rounded-full bg-[rgba(20,23,121,0.08)] blur-[80px] pointer-events-none" />

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 h-20 bg-white/90 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] z-50 shadow-[0_12px_40px_rgba(20,23,121,0.14)]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all">
            <ArrowLeft size={22} className="text-[#141779]" />
          </button>
          <button
            onClick={() => navigate('/parent/settings')}
            className="w-10 h-10 rounded-full border-2 border-[rgba(20,23,121,0.2)] overflow-hidden bg-white shrink-0 hover:scale-105 active:scale-95 transition-all"
          >
            <img
              src={parentPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.fullName || "Parent")}&background=random`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          <h1 className="text-2xl font-black text-[#141779]">{t("parent_space") || "Parent Space"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFamilyModal(true)} 
            className="h-10 px-3 flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#141779] font-black text-xs hover:bg-indigo-100 active:scale-95 transition-all shadow-xs"
          >
            <Users size={16} />
            <span className="hidden sm:inline">{t("family_code", "Family Code")}</span>
          </button>
          <button onClick={() => { setShowNotifications(true); markAllRead(); }} className="relative w-11 h-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all">
            <Bell size={22} className="text-[#141779]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-4 h-4 bg-[#ba1a1a] rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <FamilyLinkModal isOpen={showFamilyModal} onClose={() => setShowFamilyModal(false)} />

      <main className="px-5 pt-[104px] flex flex-col gap-6">

        {/* Child Selector Pills — instant switch with no reload */}
        {userData?.children && userData.children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {userData.children.map((c: any) => {
              const isActive = (userData.activeChildId || "child_1") === c.childId;
              return (
                <button
                  key={c.childId}
                  onClick={async () => {
                    if (isActive) return;
                    try {
                      const res = await apiFetch("/api/users/active-child", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ childId: c.childId })
                      });
                      const json = await res.json();
                      if (json.success && json.data?.user) {
                        localStorage.setItem("userData", JSON.stringify(json.data.user));
                        const pin = sessionStorage.getItem("parentPinVerified");
                        sessionStorage.clear();
                        if (pin) sessionStorage.setItem("parentPinVerified", pin);
                        setUserData(json.data.user);
                        setLoading(true);
                        setRefreshKey(k => k + 1);
                      }
                    } catch (e) { console.error("Switch failed", e); }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm shrink-0 transition-all ${
                    isActive
                      ? "border-[#141779] bg-[#141779] text-white shadow-md"
                      : "border-slate-200 bg-white text-[#141779] hover:border-[#141779] hover:bg-indigo-50"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                    {c.childPhoto
                      ? <img src={c.childPhoto} alt={c.childName} className="w-full h-full object-cover rounded-full" />
                      : c.childName?.charAt(0).toUpperCase()}
                  </span>
                  {c.childName}
                  {isActive && <span className="text-[10px] opacity-70">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Kids Space Link Card (Navigate back to Child Home page) */}
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-white rounded-[20px] p-3.5 flex justify-between items-center border-2 border-indigo-100 shadow-xs hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
              <Sparkles size={18} className="text-[#141779]" />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-black text-[#141779] flex items-center gap-1.5">
                <span>{t('back_to_kids_home', 'Back to Kids Home')}</span>
                <span className="text-[9px] bg-indigo-100 text-[#141779] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{t('kids_space', 'Kids Space')}</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold">{t('kids_space_sub', 'Return directly to student learning dashboard')}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#141779] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Child Summary Hero */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-start mb-4 gap-2 relative z-10">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-slate-500 tracking-[1.5px] mb-1">{t("student_profile", "STUDENT PROFILE")}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[22px] sm:text-[26px] font-black text-[#141779] leading-snug break-words">{childName}'s {t("journey", "Journey")}</h2>
                <button
                  onClick={() => setShowSwitcher(true)}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#141779] border border-indigo-200 font-extrabold text-xs flex items-center gap-1 hover:bg-indigo-100 transition-colors shadow-2xs"
                >
                  <Users size={12} />
                  <span>{t("switch", "Switch")}</span>
                </button>
              </div>
            </div>
            <div className="bg-[#141779] px-3 py-1 rounded-full whitespace-nowrap shrink-0 border border-[#141779]/20 shadow-2xs">
              <span className="text-xs font-black text-white">{t('lvl_explorer', { level: userLevel, defaultValue: `Lvl ${userLevel} Explorer` })}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-5 mt-2">
            <div 
              onClick={openBreakdown}
              className="flex-1 bg-slate-50/80 rounded-[18px] p-4 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs relative overflow-hidden hover:scale-[1.02] hover:border-[#141779] cursor-pointer transition-all group/card"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full" />
              <span className="text-4xl font-black text-[#006a62] mb-1">{todayTime}<span className="text-xl">m</span></span>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider group-hover/card:text-[#141779]">{t('todays_time', "TODAY'S TIME")} 🔍</span>
            </div>

            <div 
              onClick={openBreakdown}
              className="flex-1 bg-slate-50/80 rounded-[18px] p-4 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs relative overflow-hidden hover:scale-[1.02] hover:border-[#141779] cursor-pointer transition-all group/card"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#30007f]/10 to-transparent rounded-bl-full" />
              <span className="text-4xl font-black text-[#30007f] mb-1">{solvedToday}</span>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider group-hover/card:text-[#141779]">{t('solved_today', 'SOLVED TODAY')} 🔍</span>
            </div>
          </div>

          <div onClick={openBreakdown} className="w-full cursor-pointer group/score">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-extrabold text-[#141779] tracking-wider group-hover/score:underline flex items-center gap-1">
                <span>{t('daily_confidence_score', 'DAILY CONFIDENCE SCORE')}</span>
                <span className="text-[10px] bg-indigo-50 text-[#141779] px-2 py-0.5 rounded-full font-bold">{t('details', 'Details')} 🔍</span>
              </span>
              <span className="text-[15px] font-black text-[#141779]">{todayConfidenceScore}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2 shadow-inner relative border border-slate-200/60">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#141779] to-[#2d328f] transition-all duration-1000 ease-out"
                style={{ width: `${todayConfidenceScore}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/30 to-transparent" />
              </div>
            </div>
            <p className="text-xs text-slate-600 font-bold">
              {t('confidence_score_sub', { attempts: solvedToday, defaultValue: `Based on today's correct answers (${solvedToday} attempts) • Tap for time breakdown` })}
            </p>
          </div>
        </div>

        {/* Learning DNA */}
        <div id="dna-section" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-extrabold text-slate-800">{t('cognitive_strengths_weaknesses', 'Cognitive Strengths & Weaknesses')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Strengths Card */}
            <button
              onClick={() => setModalType("strengths")}
              className="bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-xs border-t-4 border-t-[#006a62] flex flex-col justify-between text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden group min-h-[110px]"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">💪</span>
                    <h4 className="text-sm font-black text-[#006a62]">{t('strengths', 'Strengths')}</h4>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {subjectBreakdown.length === 0 ? (
                  <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mt-1">
                    {t('not_enough_data_for_now', 'Not enough data for now')}
                  </span>
                ) : actualStrengthSubjects.length === 0 ? (
                  <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mt-1">
                    {t('no_strengths_yet', 'No strength for now.')}
                  </span>
                ) : (
                  <div className="space-y-1.5 mt-1">
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
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-3">{t('fast_processor', 'Fast Processor 🔍')}</span>
            </button>

            {/* Weaknesses Card */}
            <button
              onClick={() => setModalType("weaknesses")}
              className="bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-xs border-t-4 border-t-[#ba1a1a] flex flex-col justify-between text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden group min-h-[110px]"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">⚠️</span>
                    <h4 className="text-sm font-black text-[#ba1a1a]">{t('weaknesses', 'Weaknesses')}</h4>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {subjectBreakdown.length === 0 ? (
                  <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mt-1">
                    {t('not_enough_data_for_now', 'Not enough data for now')}
                  </span>
                ) : actualWeakSubjects.length === 0 ? (
                  <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-1 border border-emerald-100">
                    {t('all_subjects_top_level', 'All subjects at top level 🎉')}
                  </span>
                ) : (
                  <div className="space-y-1.5 mt-1">
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
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-3">{t('review_needed', 'Review Needed 🔍')}</span>
            </button>

            {/* Risk Alerts Card */}
            <button
              onClick={() => setModalType("risks")}
              className="bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-xs border-t-4 border-t-[#d97706] flex flex-col justify-between text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden group min-h-[110px]"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🔔</span>
                    <h4 className="text-sm font-black text-[#d97706]">{t('risk_alerts', 'Risk Alerts')}</h4>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                {subjectBreakdown.length === 0 ? (
                  <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full mt-1">
                    {t('not_enough_data_for_now', 'Not enough data for now')}
                  </span>
                ) : actualRiskSubjects.length === 0 ? (
                  <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mt-1 border border-emerald-100">
                    {t('no_risk_alerts_badge', '✅ No Risk Alerts')}
                  </span>
                ) : (
                  <div className="space-y-1.5 mt-1">
                    {actualRiskSubjects.map((rs, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs font-bold text-rose-800">
                        <AlertTriangle size={13} className="text-rose-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {translateSubjectName(rs.subject)} needs attention with {rs.accuracy}% accuracy.
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-3">{t('three_day_alerts', '3-Day Alerts 🔍')}</span>
            </button>
          </div>
        </div>

        {/* Performance Trend Chart */}
        {renderTop3SubjectsGraphCard()}


        {/* Parent Learning Section */}
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-base font-extrabold text-slate-800 px-1">{t("parent_learning", "Parent Learning")}</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/parent/daily-tip')}
              className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-36 border border-slate-200/80 shadow-sm text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#006a62]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#006a62]/10 flex items-center justify-center mb-2 relative z-10">
                <BrainCircuit size={20} color="#006a62" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[15px] font-black text-[#141779] leading-tight">{t("daily_tip", "Daily Tip")}</h3>
                  <span className="bg-[#006a62] text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">{t("hot", "Hot")}</span>
                </div>
                <p className="text-xs text-slate-600 font-bold leading-tight mt-1">{t("daily_tip_sub", "Quick family harmony ideas.")}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent/lessons')}
              className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-36 border border-slate-200/80 shadow-sm text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#141779]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#141779]/10 flex items-center justify-center mb-2 relative z-10">
                <BrainCircuit size={20} color="#141779" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[15px] font-black text-[#141779] leading-tight">{t("lessons", "Lessons")}</h3>
                  <span className="bg-[#30007f] text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">{t("new", "New")}</span>
                </div>
                <p className="text-xs text-slate-600 font-bold leading-tight mt-1">{t("lessons_sub", "Bite-sized parent growth.")}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent/challenges')}
              className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-36 border border-slate-200/80 shadow-sm text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#30007f]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#30007f]/10 flex items-center justify-center mb-2 relative z-10">
                <BrainCircuit size={20} color="#30007f" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[13px] font-black text-[#141779] leading-tight">{t("challenges", "Challenges")}</h3>
                  <span className="bg-[#ba1a1a] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">{t("live", "Live")}</span>
                </div>
                <p className="text-[10px] text-slate-600 font-extrabold leading-tight">{t("challenges_sub", "Build strong daily habits.")}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent/achievements')}
              className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-36 border border-slate-200/80 shadow-sm text-left hover:scale-[1.02] hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#007168]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#007168]/10 flex items-center justify-center mb-2 relative z-10">
                <Activity size={20} color="#007168" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[13px] font-black text-[#141779] leading-tight">{t("rewards", "Rewards")}</h3>
                  <span className="bg-[#007168] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">{t("badges", "Badges")}</span>
                </div>
                <p className="text-[10px] text-slate-600 font-extrabold leading-tight">{t("rewards_sub", "View your milestones.")}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/parent/settings')}
              className="flex-1 bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-sm flex items-center gap-3 hover:bg-slate-50 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Settings size={20} className="text-slate-700" />
              </div>
              <span className="text-[16px] font-extrabold text-[#141779]">{t("settings", "Settings")}</span>
            </button>
            <button
              onClick={() => navigate('/parent/learning-dna')}
              className="flex-1 bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-sm flex items-center gap-3 hover:bg-slate-50 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ccf4f0] flex items-center justify-center">
                <BrainCircuit size={20} className="text-[#006a62]" />
              </div>
              <span className="text-[16px] font-extrabold text-[#141779]">{t("dna", "DNA")}</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/parent/kids-activity')}
            className="w-full bg-white rounded-[20px] p-5 border border-slate-200/80 shadow-sm flex justify-between items-center hover:bg-slate-50 hover:shadow-md transition-all group gap-3"
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#e6e0ff] flex items-center justify-center shrink-0">
                <Clock size={24} className="text-[#30007f]" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className="text-[16px] font-extrabold text-[#141779] leading-none">{t("kids_activity", "Kids Activity")}</h4>
                  {lastActivityDetails && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
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
                {lastActivityDetails ? (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-slate-800 break-words leading-snug">{translateActivityTitle(lastActivityDetails.title)}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-0.5">
                      {lastActivityDetails.timeTaken > 0 && (
                        <span>⏱️ {Math.round(lastActivityDetails.timeTaken / 60) || 1}m</span>
                      )}
                      {lastActivityDetails.timeTaken > 0 && lastActivityDetails.totalQuestions > 0 && <span>•</span>}
                      {lastActivityDetails.totalQuestions > 0 && (
                        <span className="text-indigo-600 font-extrabold">
                          🎯 {lastActivityDetails.correctQuestions}/{lastActivityDetails.totalQuestions} {t("correct", "Correct")}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-700 break-words line-clamp-2">{translateActivityTitle(lastActivity)}</p>
                )}
              </div>
            </div>
            <ChevronRight size={24} className="text-[#141779] group-hover:translate-x-1 transition-transform shrink-0 self-center" />
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
              {subjectBreakdown.length === 0 && !hasEnoughData ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200/80 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">📊</span>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t("not_enough_data_for_now", "Not Enough Data For Now")}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                    {t("not_enough_data_desc", "Complete quizzes or tests to unlock personalized cognitive strengths, weakness analysis, and 7-day trend graphs!")}
                  </p>
                </div>
              ) : modalType === "risks" && actualRiskSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">✅</span>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">{t("no_risk_alerts", "No Risk Alerts")}</h4>
                  <p className="text-xs text-emerald-700 font-bold mt-2 leading-relaxed">
                    {t("no_risk_alerts_desc", { name: cleanChildName, defaultValue: `All clear! ${cleanChildName} is performing consistently with scores above 60% across all subjects.` })}
                  </p>
                </div>
              ) : modalType === "weaknesses" && actualWeakSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">🎉</span>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-wider">{t("no_weaknesses_title", "No Weaknesses Detected")}</h4>
                  <p className="text-xs text-emerald-700 font-bold mt-2 leading-relaxed">
                    {t("fantastic_no_subjects_below_top", {
                      name: cleanChildName,
                      defaultValue: `Great job! ${cleanChildName} has all active subjects performing at the top level.`
                    })}
                  </p>
                </div>
              ) : modalType === "strengths" && actualStrengthSubjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center my-4">
                  <span className="text-4xl mb-2">💪</span>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t("no_strengths_title", "No Strengths Yet")}</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
                    {t("keep_playing_build_strengths", "Keep playing to build up strong subjects above 60%!")}
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
                        ? t("top_performing_subjects", "Top Performing Subject(s)")
                        : modalType === "weaknesses"
                        ? t("areas_for_review_title", "Areas for Improvement (≥ 60%)")
                        : modalType === "risks"
                        ? t("at_risk_subjects_lt_60", "At-Risk Subjects (< 60%)")
                        : t("performance_by_subject", "Performance by Subject")}
                    </h3>

                    {modalType === "weaknesses" ? (
                      /* Enhanced Weaknesses / Needs Attention Cards */
                      <div className="space-y-3">
                        {subjectBreakdown
                          .slice()
                          .filter(sb => sb.accuracy >= 60 && sb.accuracy < maxAccuracy)
                          .sort((a, b) => a.accuracy - b.accuracy)
                          .map((sb, idx) => {
                            const improvementNeeded = Math.max(1, maxAccuracy - sb.accuracy);
                            const subjName = translateSubjectName(sb.subject);
                            const normSubj = sb.subject.toLowerCase();

                            // Actionable recommendation tailored to this subject
                            const matchingWeakness = weaknesses?.find(
                              w =>
                                w.toLowerCase().includes(normSubj) &&
                                !w.includes("No weakness") &&
                                !w.includes("Not enough Data")
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
                            } else if (sb.accuracy < 40) {
                              insightText = t("weakness_insight_foundational", {
                                subject: subjName,
                                defaultValue: `Revise foundational chapter concepts in ${subjName} and retry practice quizzes.`
                              });
                            } else if (normSubj.includes("math")) {
                              insightText = t("weakness_insight_math", {
                                subject: subjName,
                                defaultValue: `Focus on the topics where recent quiz accuracy is low.`
                              });
                            } else if (normSubj.includes("gujarati") || normSubj.includes("english") || normSubj.includes("hindi")) {
                              insightText = t("weakness_insight_language", {
                                subject: subjName,
                                defaultValue: `Practice ${subjName} regularly and review recent mistakes.`
                              });
                            } else {
                              insightText = t("weakness_insight_general", {
                                subject: subjName,
                                defaultValue: `Practice ${subjName} regularly and focus on topics where recent quiz accuracy is low.`
                              });
                            }

                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-2xl p-4 border border-red-100/90 shadow-xs space-y-2.5"
                              >
                                {/* Subject Header & Status Badge */}
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                    <span>{subjName}</span>
                                    <span className="text-xs">⚠️</span>
                                  </h4>
                                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-[#ba1a1a] border border-red-100 flex items-center gap-1">
                                    <span className="text-[8px]">●</span>
                                    <span>{t("status_needs_improvement", "Needs Improvement")}</span>
                                  </span>
                                </div>

                                {/* Current Performance & Gap */}
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-[#ba1a1a] font-bold">
                                    {`${subjName} needs improvement with ${sb.accuracy}% accuracy.`}
                                  </span>
                                  <span className="text-[11px] text-[#ba1a1a] font-bold bg-red-50/70 px-2 py-0.5 rounded-md">
                                    {t("improvement_needed_gap", {
                                      gap: improvementNeeded,
                                      defaultValue: `+${improvementNeeded}% to match top subject`
                                    })}
                                  </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2.5 w-full bg-red-100/70 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[#ba1a1a] transition-all duration-700"
                                    style={{ width: `${Math.min(100, Math.max(5, sb.accuracy))}%` }}
                                  />
                                </div>

                                {/* Additional metrics if available */}
                                {(sb.wrongAnswers !== undefined && sb.correctAnswers !== undefined && (sb.correctAnswers + sb.wrongAnswers > 0)) && (
                                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-0.5">
                                    <span>{t("accuracy_label", "Accuracy")}: {sb.accuracy}%</span>
                                    <span>•</span>
                                    <span className="text-slate-600">{t("solved_count", { correct: sb.correctAnswers, total: sb.correctAnswers + sb.wrongAnswers, defaultValue: `${sb.correctAnswers}/${sb.correctAnswers + sb.wrongAnswers} correct` })}</span>
                                    {sb.wrongAnswers > 0 && (
                                      <>
                                        <span>•</span>
                                        <span className="text-[#ba1a1a]">{t("mistakes_count", { count: sb.wrongAnswers, defaultValue: `${sb.wrongAnswers} mistakes` })}</span>
                                      </>
                                    )}
                                  </div>
                                )}

                                {/* Actionable Insight Box */}
                                <div className="bg-amber-50/60 rounded-xl p-2.5 border border-amber-100/80 text-[11px] leading-relaxed">
                                  <span className="font-extrabold text-[#ba1a1a]">
                                    {t("actionable_insight_label", "Actionable Insight")}:{" "}
                                  </span>
                                  <span className="font-semibold text-slate-700">{insightText}</span>
                                </div>
                              </div>
                            );
                          })}

                        {/* If NO weak subjects */}
                        {subjectBreakdown.length > 0 &&
                          actualWeakSubjects.length === 0 && (
                            <p className="text-xs text-[#006a62] font-semibold bg-[#006a62]/10 p-3.5 rounded-xl text-center">
                              {t("fantastic_no_subjects_below_top", {
                                name: cleanChildName,
                                defaultValue: `🎉 Fantastic! ${cleanChildName} has all active subjects performing at the top level.`
                              })}
                            </p>
                          )}

                        {/* If no subject breakdown data */}
                        {subjectBreakdown.length === 0 && (
                          <p className="text-xs text-[#767683]">{t("play_more_quests_breakdown", "Play more quests to see detailed subject breakdown!")}</p>
                        )}
                      </div>
                    ) : (
                      /* modalType === "strengths" or modalType === "risks" (preserve exact existing format) */
                      <div className="space-y-3">
                        {subjectBreakdown
                          .slice()
                          .filter(sb => {
                            if (modalType === "strengths") return sb.accuracy === maxAccuracy && sb.accuracy >= 60;
                            if (modalType === "risks") return sb.accuracy < 60;
                            return true;
                          })
                          .sort((a, b) => {
                            if (modalType === "risks") return a.accuracy - b.accuracy;
                            return b.accuracy - a.accuracy;
                          })
                          .map((sb, idx) => {
                            const isStrength = sb.accuracy >= 60;
                            const barColor = isStrength ? "#006a62" : "#ba1a1a";
                            const bgColor = isStrength ? "bg-[#006a62]/10" : "bg-[#ba1a1a]/10";

                            return (
                              <div key={idx}>
                                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                                  <span className={isStrength ? "text-[#006a62]" : "text-[#ba1a1a]"}>
                                    {isStrength
                                      ? `${translateSubjectName(sb.subject)} is currently high performing with ${sb.accuracy}% accuracy.`
                                      : `${translateSubjectName(sb.subject)} needs attention with ${sb.accuracy}% accuracy.`}
                                  </span>
                                </div>
                                <div className={`h-2.5 w-full ${bgColor} rounded-full overflow-hidden`}>
                                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${sb.accuracy}%`, backgroundColor: barColor }} />
                                </div>
                              </div>
                            );
                          })}
                        {subjectBreakdown.length === 0 && (
                          <p className="text-xs text-[#767683]">{t("play_more_quests_breakdown", "Play more quests to see detailed subject breakdown!")}</p>
                        )}
                        {subjectBreakdown.length > 0 &&
                          modalType === "risks" &&
                          actualRiskSubjects.length === 0 && (
                            <p className="text-xs text-[#006a62] font-semibold bg-[#006a62]/10 p-3 rounded-lg text-center mt-2">
                              {t("fantastic_no_subjects_below_60", { name: cleanChildName, defaultValue: `🎉 Fantastic! ${cleanChildName} has no subjects below 60% right now.` })}
                            </p>
                          )}
                        {subjectBreakdown.length > 0 &&
                          modalType === "strengths" &&
                          actualStrengthSubjects.length === 0 && (
                            <p className="text-xs text-[#ba1a1a] font-semibold bg-[#ba1a1a]/10 p-3 rounded-lg text-center mt-2">
                              {t("keep_playing_build_strengths", "Keep playing to build up strong subjects above 60%!")}
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

      {/* Notifications Side Panel / Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-end">
          <div className="w-full sm:w-[400px] h-full bg-[#f7f9fb] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-[#141779] flex items-center gap-2">
                <Bell size={24} /> {t("notifications", "Notifications")}
              </h2>
              <button onClick={() => setShowNotifications(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} color="#464652" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <Bell size={48} className="mb-4 text-gray-400" />
                  <p className="text-gray-500 font-medium">{t("no_recent_activity", "No recent activity to show.")}</p>
                </div>
              ) : (
                notifications.map((notif, idx) => {
                  let icon = "🔔";
                  let bg = "bg-white";
                  if (notif.type === "gamification") icon = "🎮";
                  if (notif.type === "habit") icon = "✨";
                  if (notif.type === "learning") icon = "📚";
                  
                  return (
                    <div key={idx} className={`p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 ${bg} hover:shadow-md transition-shadow`}>
                      <div className="text-2xl pt-1">{icon}</div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#141779] mb-1">{formatNotifTitle(notif.title)}</h4>
                        <p className="text-[12px] text-[#464652] leading-tight">{formatNotifMsg(notif.message)}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                          {new Date(notif.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
