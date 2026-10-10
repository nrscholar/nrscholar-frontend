import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Clock, TrendingUp, AlertTriangle, CheckCircle,
  Calculator, Atom, BookOpen, Star, Target, Lightbulb,
  Award, BookOpenCheck, Loader2, Brain, Zap, ShieldCheck, BookMarked,
  ChevronDown, ChevronUp, BarChart2
} from "lucide-react";
import { apiFetch } from "../../../api";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";
import { getSubjectChartColor, DISTINCT_SUBJECT_PALETTE } from "../../../utils/chartColors";

const SUBJECT_COLORS = DISTINCT_SUBJECT_PALETTE;

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)] ${className}`}>
      {children}
    </div>
  );
}

function StatBox({ label, value, color = "text-[#141779]" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-[#f2f4f6] p-3 rounded-xl border border-gray-100 flex flex-col">
      <p className="text-[9px] font-bold text-[#464652] uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ProgressBar({ value, color = "bg-[#141779]" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-[rgba(20,23,121,0.08)] flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <h2 className="text-[15px] font-bold text-[#191c1e]">{title}</h2>
        {subtitle && <p className="text-xs text-[#767683]">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ParentReportScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const formatReadingTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      const remainingSecs = seconds % 60;
      return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
    }
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
  };

  const formatChapterReadingTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
  };

  const [activeTab, setActiveTab] = useState("daily");
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const currentLang = i18n.language || localStorage.getItem("i18nextLng") || "en";
  const cachedReport = (() => {
    try {
      const raw = sessionStorage.getItem(`parent_report_cache_${currentLang}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  const [reportData, setReportData] = useState<any>(cachedReport);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [showAllMistakes, setShowAllMistakes] = useState(false);
  const [dateFilter, setDateFilter] = useState("this_week");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [compareFilter, setCompareFilter] = useState("none");
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [showSubjectSheet, setShowSubjectSheet] = useState(false);
  const [showCustomizeSheet, setShowCustomizeSheet] = useState(false);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string; variant: "primary" | "danger" | "success" } | null>(null);
  const getTodayString = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };
  const getPastDateString = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const [customStartDate, setCustomStartDate] = useState(getPastDateString(7));
  const [customEndDate, setCustomEndDate] = useState(getTodayString());
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getDateLabel = () => {
    const today = new Date();
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    switch (dateFilter) {
      case "today":
        return { label: `📅 ${t('today', 'Today')}`, range: formatDate(today) };
      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return { label: `📅 ${t('yesterday', 'Yesterday')}`, range: formatDate(yesterday) };
      }
      case "this_week": {
        const start = new Date(today);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // start on Monday
        const monday = new Date(start.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return { label: `📅 ${t('this_week', 'This Week')}`, range: `${formatDate(monday)} – ${formatDate(sunday)}` };
      }
      case "this_month": {
        const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { label: `📅 ${t('this_month', 'This Month')}`, range: monthName };
      }
      case "custom":
        if (customStartDate && customEndDate) {
          const s = new Date(customStartDate);
          const e = new Date(customEndDate);
          return { label: `📅 ${t('custom_date_range', 'Custom Date Range')}`, range: `${formatDate(s)} – ${formatDate(e)}` };
        }
        return { label: `📅 ${t('custom_date_range', 'Custom Date Range')}`, range: t('select_dates', 'Select Dates') };
      default:
        return { label: `📅 ${t('this_week', 'This Week')}`, range: t('select_dates', 'Select Dates') };
    }
  };

  const handleDownload = async (format: string) => {
    setIsDownloading(format);
    try {
      const tzOffset = new Date().getTimezoneOffset();
      const offsetMinutes = -tzOffset;

      let downloadFilter = "daily";
      if (dateFilter === "this_week") downloadFilter = "weekly";
      else if (dateFilter === "this_month") downloadFilter = "monthly";
      else if (dateFilter === "yesterday") downloadFilter = "daily";
      else if (dateFilter === "custom") downloadFilter = "weekly";
      // "today" stays as "daily"

      const activeLang = i18n.language || localStorage.getItem("i18nextLng") || "en";
      const url = `/api/parent/report/download?filter=${downloadFilter}&subject=${subjectFilter}&format=${format}&tz_offset_minutes=${offsetMinutes}&lang=${encodeURIComponent(activeLang)}`;
      const response = await apiFetch(url, { headers: { "Accept-Language": activeLang } });
      
      if (!response.ok) {
        setAlertModal({ show: true, title: "Download Failed", message: "Failed to download report. Please try again.", variant: "danger" });
        return;
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `report_${activeTab}.${format === "pdf" ? "pdf" : "docx"}`;
      if (contentDisposition) {
        const matches = /filename="?([^";]+)"?/g.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download error:", e);
      setAlertModal({ show: true, title: "Download Error", message: "Something went wrong during report download.", variant: "danger" });
    } finally {
      setIsDownloading(null);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out the latest learning report for my child on NRscholar!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NRscholar Learning Report',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setAlertModal({ show: true, title: "Link Copied!", message: "Report link copied to clipboard! You can share it now.", variant: "success" });
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  // Timeline history helpers
  const dailyHistory = reportData?.dailyTimelineHistory || [];
  const monthlyHistory = reportData?.monthlyTimelineHistory || [];
  const sixMonthHistory = reportData?.sixMonthTimelineHistory || [];
  const yearlyHistory = reportData?.yearlyTimelineHistory || [];
  
  // Chart dimensions & calculations
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const pL = paddingLeft;
  const pR = paddingRight;
  const pT = paddingTop;
  const pB = paddingBottom;

  const getX = (index: number) => {
    if (chartHistory.length <= 1) return paddingLeft;
    return paddingLeft + index * (chartWidth - paddingLeft - paddingRight) / (chartHistory.length - 1);
  };

  const getY = (score: number) => {
    return paddingTop + (100 - score) * (chartHeight - paddingTop - paddingBottom) / 100;
  };



  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current || chartHistory.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
    
    // Find closest data point
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < chartHistory.length; i++) {
      const diff = Math.abs(getX(i) - mouseX);
      if (diff < minDiff) { minDiff = diff; closestIndex = i; }
    }
    setHoveredIndex(closestIndex);
  };

  const getRadarPt = (cx: number, cy: number, r: number, ang: number) => ({
    x: cx + r * Math.cos((ang * Math.PI) / 180),
    y: cy + r * Math.sin((ang * Math.PI) / 180),
  });
  const dna = reportData?.learningDnaRadar || { accuracy: 0, speed: 0, resilience: 0, consistency: 0, retention: 0 };
  const dnaAxes = [
    { val: dna.accuracy,    ang: -90,  label: "Accuracy" },
    { val: dna.speed,       ang: -18,  label: "Speed" },
    { val: dna.resilience,  ang:  54,  label: "Boss" },
    { val: dna.consistency, ang: 126,  label: "Consistency" },
    { val: dna.retention,   ang: 198,  label: "Retention" },
  ];

  const translateRecommendation = (rec: string) => {
    if (!rec) return "";
    let translated = rec;
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
      .replace(/Focus on (.+?) practice sessions to reinforce core concepts\./g, (_, subj) =>
        t("rec_focus_practice", { subject: subj, defaultValue: `મૂળભૂત ખ્યાલોને મજબૂત કરવા માટે ${subj} પ્રેક્ટિસ સત્રો પર ધ્યાન કેન્દ્રિત કરો.` })
      )
      .replace(/Review incorrect answers in (.+?) quizzes to identify knowledge gaps\./g, (_, subj) =>
        t("rec_review_incorrect", { subject: subj, defaultValue: `જ્ઞાનની ખામીઓ ઓળખવા માટે ${subj} ક્વિઝમાં ખોટા જવાબોની સમીક્ષા કરો.` })
      )
      .replace(/Continue daily practice to maintain your learning streak\./g,
        t("rec_continue_daily", "તમારી શીખવાની સ્ટ્રીક જાળવી રાખવા માટે રોજિંદી પ્રેક્ટિસ ચાલુ રાખો.")
      )
      .replace(/Try a Boss Battle to test your mastery in completed chapters!/g,
        t("rec_try_boss_battle", "પૂર્ણ થયેલા પ્રકરણોમાં તમારી નિપુણતા ચકાસવા માટે બોસ બેટલ અજમાવો!")
      );

    return translated;
  };

  const fetchReport = useCallback(async () => {
    try {
      const lang = i18n.language || localStorage.getItem("i18nextLng") || "en";
      const tzOffset = -new Date().getTimezoneOffset();
      let activeCid = null;
      try {
        const stored = localStorage.getItem("userData");
        if (stored) activeCid = JSON.parse(stored).activeChildId;
      } catch (e) {}
      const childParam = activeCid ? `&childId=${encodeURIComponent(activeCid)}` : "";
      const [reportRes, userRes] = await Promise.all([
        apiFetch(`/api/parent/report?lang=${encodeURIComponent(lang)}&tz_offset_minutes=${tzOffset}${childParam}`, { headers: { "Accept-Language": lang } }),
        apiFetch("/api/users/me").catch(() => null)
      ]);
      const json = await reportRes.json();
      if (json.success) {
        setReportData(json.data);
        sessionStorage.setItem(`parent_report_cache_${lang}`, JSON.stringify(json.data));
      }
      if (userRes && userRes.ok) {
        const ujson = await userRes.json();
        if (ujson.success && ujson.data?.user) setUserData(ujson.data.user);
      }
    } catch (err) { console.error(err); }
    finally { setTimeout(() => setLoading(false), 350); }
  }, [refreshKey, i18n.language]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const tabs = [
    { id: "daily",    label: "Daily"    },
    { id: "subjects", label: "Subjects" },
    { id: "monthly",  label: "Monthly"  },
    { id: "yearly",   label: "Yearly"   },
  ];
  // Note: activeTab and tabs are retained for future tab-based navigation

  if (loading) return (
    <div className="min-h-screen bg-[#f7f9fb] px-5 pt-20 pb-24 flex flex-col gap-6 font-sans relative overflow-hidden">
      {/* Top Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-xl border-b border-white/40 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full animate-skeleton"></div>
          <div className="h-6 w-36 rounded-lg animate-skeleton"></div>
        </div>
        <div className="w-8 h-8 rounded-full animate-skeleton"></div>
      </header>

      {/* Range Chips Skeleton */}
      <div className="flex gap-2 pt-2 overflow-x-auto no-scrollbar">
        {[70, 90, 85, 95, 75].map((w, idx) => (
          <div key={idx} className="h-9 rounded-full shrink-0 animate-skeleton" style={{ width: `${w}px` }}></div>
        ))}
      </div>

      {/* Hero Stats Card Skeleton */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[24px] p-6 border-2 border-white/50 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-3 w-32 rounded-md animate-skeleton"></div>
            <div className="h-8 w-24 rounded-xl animate-skeleton"></div>
          </div>
          <div className="w-14 h-14 rounded-full animate-skeleton"></div>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-4/5 rounded-full animate-skeleton"></div>
        </div>
        <div className="pt-2 flex justify-between">
          <div className="h-3 w-28 rounded-md animate-skeleton"></div>
          <div className="h-3 w-20 rounded-md animate-skeleton"></div>
        </div>
      </div>

      {/* Subject Performance Cards Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-48 rounded-md animate-skeleton"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/60 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl animate-skeleton"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-md animate-skeleton"></div>
                  <div className="h-3 w-24 rounded-md animate-skeleton"></div>
                </div>
              </div>
              <div className="h-6 w-14 rounded-full animate-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const qA: any          = reportData?.questionAnalytics    || {};
  const rA: any          = reportData?.readingAnalytics     || {};
  const bA: any          = reportData?.bossAnalytics        || {};
  const bossHistory: any[] = reportData?.bossHistory        || [];
  const subjects: any[]  = reportData?.subjectBreakdown     || [];
  const chapters: any[]  = reportData?.chapterBreakdown     || [];
  const improvements: any[] = reportData?.improvementTracking || [];
  const recommendations: string[] = reportData?.recommendations || [];
  const strengths: string[]  = reportData?.strengths  || [];
  const weaknesses: string[] = reportData?.weaknesses || [];
  const risks: string[]      = reportData?.risks      || [];
  const mistakes: any[]      = reportData?.mistakes   || [];

  const hasStrengths = strengths.length > 0 && !strengths.some(s => s.toLowerCase().includes("not enough data") || s.toLowerCase().includes("no strength"));
  const hasWeaknesses = weaknesses.length > 0 && !weaknesses.some(w => w.toLowerCase().includes("not enough data") || w.toLowerCase().includes("no weakness"));
  const hasRisks = risks.length > 0 && !risks.some(r => r.toLowerCase().includes("not enough data") || r.toLowerCase().includes("no risk"));

  // 1. Identify overall timeline points based on dateFilter
  let activePts: any[] = [];
  if (dateFilter === "today") {
    activePts = monthlyHistory.length > 0 ? monthlyHistory.slice(-1) : (dailyHistory.length > 0 ? dailyHistory.slice(-1) : []);
  } else if (dateFilter === "yesterday") {
    activePts = monthlyHistory.length >= 2 ? monthlyHistory.slice(-2, -1) : (dailyHistory.length >= 2 ? dailyHistory.slice(-2, -1) : []);
  } else if (dateFilter === "this_week") {
    activePts = monthlyHistory.slice(-7);
  } else if (dateFilter === "this_month") {
    activePts = monthlyHistory.slice(-30);
  } else if (dateFilter === "custom") {
    if (customStartDate && customEndDate) {
      const s = new Date(customStartDate);
      const e = new Date(customEndDate);
      activePts = monthlyHistory.filter((pt: any) => {
        const [d, m] = pt.date?.split("/") || pt.day?.split("/") || [];
        if (d && m) {
          const ptYear = new Date().getFullYear();
          const ptDate = new Date(ptYear, parseInt(m) - 1, parseInt(d));
          return ptDate >= s && ptDate <= e;
        }
        return true;
      });
    } else {
      activePts = monthlyHistory;
    }
  }

  // 2. Compute displaySolved, displayAccuracy, displayTime based on subjectFilter and dateFilter
  let displaySolved = 0;
  let displayAccuracy = 0;
  let displayTime = 0;
  let displayLabel = t("activity", "Activity");

  if (dateFilter === "today") displayLabel = t("todays_activity", "Today's Activity");
  else if (dateFilter === "yesterday") displayLabel = t("yesterdays_activity", "Yesterday's Activity");
  else if (dateFilter === "this_week") displayLabel = t("this_weeks_activity", "This Week's Activity");
  else if (dateFilter === "this_month") displayLabel = t("this_months_activity", "This Month's Activity");
  else if (dateFilter === "custom") displayLabel = t("custom_range_activity", "Custom Range Activity");

  // Compute filteredQA for the card
  let filteredQA = { ...qA };
  if (subjectFilter !== "all") {
    const sObj = subjects.find(s => s?.subject && s.subject.toLowerCase() === subjectFilter.toLowerCase());
    if (sObj) {
      filteredQA = {
        totalAttempted: (sObj.correctAnswers ?? 0) + (sObj.wrongAnswers ?? 0),
        accuracy: sObj.accuracy ?? 0,
        correct: sObj.correctAnswers ?? 0,
        wrong: sObj.wrongAnswers ?? 0,
        avgTimePerQuestion: sObj.avgTimePerQuestion || qA.avgTimePerQuestion
      };
    }
  }

  if (subjectFilter === "all") {
    // Overall metrics
    if (dateFilter === "today") {
      displaySolved = reportData?.todaySolved ?? 0;
      displayTime = reportData?.todayTimeMinutes ?? 0;
      displayAccuracy = reportData?.todayConfidenceScore ?? 0;
    } else {
      const activeDays = activePts.filter(pt => (pt.total ?? 0) > 0);
      displaySolved = activePts.reduce((acc, pt) => acc + (pt.total ?? 0), 0);
      if (displaySolved > 0 && activeDays.length > 0) {
        const sumAcc = activeDays.reduce((acc, pt) => acc + (pt.masteryScore ?? pt.score ?? 0), 0);
        displayAccuracy = Math.round(sumAcc / activeDays.length);
        const totalMinutes = activePts.reduce((acc, pt) => acc + (pt.timeMinutes || (pt.timeSeconds ? pt.timeSeconds / 60 : 0)), 0);
        displayTime = totalMinutes > 0 ? Math.round(totalMinutes) : Math.max(1, Math.round(displaySolved * 0.5));
      }
    }
  } else {
    // Subject-specific metrics
    const sObj = subjects.find(s => s?.subject && s.subject.toLowerCase() === subjectFilter.toLowerCase());
    if (sObj) {
      const sTimeline = sObj.timeline || [];
      const targetDates = new Set(activePts.map(pt => pt.date || pt.day).filter(Boolean));
      
      // If targetDates is empty (e.g. today's point isn't in monthlyHistory yet), fallback to today's date string
      if (targetDates.size === 0 && dateFilter === "today") {
        const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace(/\//g, '/');
        targetDates.add(todayStr);
      }
      
      const matchedPts = sTimeline.filter((pt: any) => targetDates.has(pt.day || pt.date));
      
      if (matchedPts.length > 0) {
        displaySolved = matchedPts.reduce((acc, pt) => acc + (pt.total ?? 0), 0);
        const activeDays = matchedPts.filter(pt => (pt.total ?? 0) > 0);
        if (displaySolved > 0 && activeDays.length > 0) {
          const sumAcc = activeDays.reduce((acc, pt) => acc + (pt.score ?? pt.masteryScore ?? 0), 0);
          displayAccuracy = Math.round(sumAcc / activeDays.length);
          const totalMinutes = matchedPts.reduce((acc: number, pt: any) => acc + (pt.timeMinutes || (pt.timeSeconds ? pt.timeSeconds / 60 : 0)), 0);
          displayTime = totalMinutes > 0 ? Math.round(totalMinutes) : Math.max(1, Math.round(displaySolved * 0.5));
        }
      } else {
        // No practice inside targeted date range
        displaySolved = 0;
        displayAccuracy = 0;
        displayTime = 0;
      }
    }
  }
  displayTime = Math.max(0, Math.round(displayTime));

  // Dynamic chart selection based on dateFilter and subjectFilter
  let chartHistory = dailyHistory;
  if (dateFilter === "this_month") {
    chartHistory = reportData?.monthlyTimelineHistory || [];
  } else if (dateFilter === "custom") {
    const monthly = reportData?.monthlyTimelineHistory || [];
    if (customStartDate && customEndDate) {
      const s = new Date(customStartDate);
      const e = new Date(customEndDate);
      chartHistory = monthly.filter((pt: any) => {
        const [d, m] = pt.date?.split("/") || pt.day?.split("/") || [];
        if (d && m) {
          const ptYear = new Date().getFullYear();
          const ptDate = new Date(ptYear, parseInt(m) - 1, parseInt(d));
          return ptDate >= s && ptDate <= e;
        }
        return true;
      });
    } else {
      chartHistory = monthly;
    }
  } else if (dateFilter === "today") {
    chartHistory = dailyHistory.slice(-1);
  } else if (dateFilter === "yesterday") {
    chartHistory = dailyHistory.slice(-2, -1);
  }

  if (subjectFilter !== "all" && chartHistory.length > 0) {
    const activeSubj = subjects.find(s => s?.subject && s.subject.toLowerCase() === subjectFilter.toLowerCase());
    const subjTimeline = (activeSubj?.timeline && activeSubj.timeline.length > 0) 
      ? activeSubj.timeline 
      : ((activeSubj?.trend7Day && activeSubj.trend7Day.length > 0) ? activeSubj.trend7Day : []);

    if (subjTimeline.length > 0) {
      chartHistory = subjTimeline.map((pt: any) => {
        const score = typeof pt.score === 'number' ? pt.score : (typeof pt.masteryScore === 'number' ? pt.masteryScore : 0);
        return {
          day: pt.day || pt.date,
          date: pt.date || pt.day,
          total: pt.total,
          masteryScore: score,
          weaknessScore: score > 0 ? Math.max(10, 100 - score - 15) : 0,
          riskIndex: score > 0 ? Math.max(5, Math.round((100 - score) * 0.6)) : 0
        };
      });
    } else {
      const acc = typeof activeSubj?.accuracy === 'number' ? activeSubj.accuracy : 0;
      chartHistory = chartHistory.map(pt => ({
        ...pt,
        masteryScore: acc > 0 ? Math.round((pt.masteryScore || acc) * (acc / 100)) : 0,
        weaknessScore: acc > 0 ? Math.round((pt.weaknessScore || (100 - acc)) * ((100 - acc) / 100)) : 0
      }));
    }
  }

  // Carry forward last known score for unplayed days once a score is established;
  // keep 0% baseline strictly for days prior to the first activity.
  let runningMastery = 0;
  let runningWeakness = 0;
  let runningRisk = 0;
  let scoreEstablished = false;

  chartHistory = chartHistory.map((pt: any) => {
    const rawM = typeof pt.masteryScore === 'number' && !isNaN(pt.masteryScore) ? pt.masteryScore : (typeof pt.score === 'number' ? pt.score : 0);
    const hasActivity = (pt.total ?? 0) > 0 || rawM > 0;

    if (hasActivity && rawM > 0) {
      runningMastery = rawM;
      runningWeakness = typeof pt.weaknessScore === 'number' && !isNaN(pt.weaknessScore) && pt.weaknessScore > 0 ? pt.weaknessScore : Math.max(10, 100 - rawM - 15);
      runningRisk = typeof pt.riskIndex === 'number' && !isNaN(pt.riskIndex) && pt.riskIndex > 0 ? pt.riskIndex : Math.max(5, Math.round((100 - rawM) * 0.6));
      scoreEstablished = true;
    }

    if (scoreEstablished) {
      return {
        ...pt,
        masteryScore: runningMastery,
        weaknessScore: runningWeakness,
        riskIndex: runningRisk
      };
    }

    // Days prior to very first activity remain 0% baseline
    return {
      ...pt,
      masteryScore: 0,
      weaknessScore: 0,
      riskIndex: 0
    };
  });

  const masteryPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.masteryScore)}`).join(' ');
  const weaknessPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.weaknessScore)}`).join(' ');
  const riskPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.riskIndex)}`).join(' ');

  const masteryAreaPath = chartHistory.length > 0 
    ? `${masteryPath} L ${getX(chartHistory.length - 1)} ${chartHeight - paddingBottom} L ${getX(0)} ${chartHeight - paddingBottom} Z` 
    : '';

  const getTranslatedSubject = (subj: string) => {
    const lower = (subj || "").toLowerCase().trim();
    if (lower === "mathematics" || lower === "maths" || lower === "math") return t("maths", "ગણિત");
    if (lower === "gujarati") return t("gujarati", "ગુજરાતી");
    if (lower === "science") return t("science", "વિજ્ઞાન");
    if (lower === "english") return t("english_subject", "અંગ્રેજી");
    if (lower === "hindi") return t("hindi_subject", "હિન્દી");
    if (lower === "social studies" || lower === "social_studies") return t("social_studies", "સામાજિક વિજ્ઞાન");
    return t(lower, subj);
  };

  const formatInsightMessage = (msg: string) => {
    if (!msg) return msg;
    let translated = msg;
    translated = translated
      .replace(/(.*?) is currently high performing with (\d+)% accuracy\./g, (_, subj, acc) => {
        const trSubj = getTranslatedSubject(subj);
        return t("insight_high_performing", { subj: trSubj, acc, defaultValue: `${trSubj} ${acc}% ચોકસાઈ સાથે ઉચ્ચ પ્રદર્શન કરી રહ્યું છે.` });
      })
      .replace(/(.*?) is showing an increasing trend with (\d+)% accuracy\./g, (_, subj, acc) => {
        const trSubj = getTranslatedSubject(subj);
        return t("insight_increasing_trend", { subj: trSubj, acc, defaultValue: `${trSubj} ${acc}% ચોકસાઈ સાથે વધતી ક્ષમતા દર્શાવે છે.` });
      })
      .replace(/(.*?) accuracy is currently (\d+)%\. Requires targeted practice\./g, (_, subj, acc) => {
        const trSubj = getTranslatedSubject(subj);
        return t("insight_requires_practice", { subj: trSubj, acc, defaultValue: `${trSubj} ચોકસાઈ વર્તમાનમાં ${acc}% છે. લક્ષ્યાંકિત પ્રેક્ટિસની જરૂર છે.` });
      })
      .replace(/⚠️ Risk Alert: (.*?) score has stayed below 60% for 3 consecutive days \((.*?)\)\./g, (_, subj, trend) => {
        const trSubj = getTranslatedSubject(subj);
        return t("insight_risk_alert", { subj: trSubj, trend, defaultValue: `⚠️ જોખમ ચેતવણી: ${trSubj} સ્કોર સતત 3 દિવસથી 60% થી નીચે રહ્યો છે (${trend}).` });
      })
      .replace(/🎉 You are on the right track! (.*?) accuracy has recovered above 60% \((\d+)%\)\./g, (_, subj, acc) => {
        const trSubj = getTranslatedSubject(subj);
        return t("insight_recovery_track", { subj: trSubj, acc, defaultValue: `🎉 તમે યોગ્ય માર્ગ પર છો! ${trSubj} ચોકસાઈ 60% થી ઉપર સુધરી ગઈ છે (${acc}%).` });
      })
      .replace(/🎉 You are on the right track! (.*?) accuracy has improved to (\d+)% over the last 2 days\./g, (_, subj, acc) => {
        const trSubj = getTranslatedSubject(subj);
        return t("insight_improved_track", { subj: trSubj, acc, defaultValue: `🎉 તમે યોગ્ય માર્ગ પર છો! ${trSubj} ચોકસાઈ છેલ્લા 2 દિવસમાં ${acc}% સુધી સુધરી છે.` });
      })
      .replace(/needs attention with (\d+)% accuracy/g, (_, acc) =>
        t("insight_needs_attention", { acc, defaultValue: `${acc}% ચોકસાઈ સાથે વધુ ધ્યાન આપવાની જરૂર છે.` })
      )
      .replace(/is maintaining good scores across all subjects/g,
        t("insight_maintaining_good", "તમામ વિષયોમાં સારું પ્રદર્શન જાળવી રહ્યું છે.")
      )
      .replace(/No weakness for now\./gi, t("no_weakness_for_now", "હાલમાં કોઈ નબળાઈ નથી."))
      .replace(/No strength for now\./gi, t("no_strength_for_now", "હાલમાં કોઈ તાકાત નથી."))
      .replace(/No risk for now\./gi, t("no_risk_for_now", "હાલમાં કોઈ જોખમ નથી."))
      .replace(/Not enough Data for now wait few Days/gi, t("not_enough_data_for_now", "હાલમાં પૂરતો ડેટા નથી, થોડા દિવસ રાહ જુઓ"));

    return translated;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-28">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3.5 bg-white/90 border-b-2 border-slate-200/90 rounded-b-[28px] sticky top-0 z-50 backdrop-blur-2xl shadow-[0_12px_40px_rgba(20,23,121,0.14)]">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold text-[#141779]">{t('learning_reports', 'Learning Reports')}</h1>
          <p className="text-xs text-[#767683]">{t('learning_reports_sub', 'Real-time analytics from activity data')}</p>
        </div>
      </header>

      <main className="px-5 pt-5 flex flex-col gap-5 max-w-lg mx-auto">

        {/* Child Selector Pills — instant switch without reload */}
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
                        sessionStorage.removeItem("parent_report_cache");
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
            <button
              onClick={() => setShowSwitcher(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border-2 border-dashed border-indigo-200 text-[#141779] text-xs font-bold shrink-0 hover:bg-indigo-50 transition-all"
            >
              {t("add_manage_child", "+ Add / Manage")}
            </button>
          </div>
        )}

        {/* 1. Large compact date/time selector */}
        {dateFilter === "custom" ? (
          <div className="w-full bg-white border-2 border-indigo-200 p-4 rounded-[24px] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-[#141779] flex items-center gap-1.5">
                📅 {t("custom_date_range", "Custom Date Range")}
              </span>
              <button 
                onClick={() => setShowDateSheet(true)}
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-0.5"
              >
                {t("change_period", "Change Period")} <ChevronDown size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">{t("start_date", "Start Date")}</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:border-[#141779] outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">{t("end_date", "End Date")}</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 focus:border-[#141779] outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowDateSheet(true)}
            className="w-full bg-white border-2 border-slate-100 p-4 rounded-[24px] flex items-center justify-between shadow-xs hover:border-slate-200 transition-all active:scale-[0.99]"
          >
            <div className="text-left">
              <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                {getDateLabel().label}
              </span>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                {getDateLabel().range}
              </p>
            </div>
            <ChevronDown size={20} className="text-slate-400" />
          </button>
        )}

        {/* 2. Sub-filters row 1: Subject & Customize */}
        <div className="flex gap-3 w-full">
          {/* Subject pill */}
          <button
            onClick={() => setShowSubjectSheet(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black border-2 shadow-xs active:scale-[0.98] transition-all ${
              subjectFilter !== "all"
                ? "border-[#141779] text-[#141779] bg-indigo-50"
                : "bg-white border-slate-100 text-slate-700 hover:border-slate-200"
            }`}
          >
            <span>📚</span>
            <span>{subjectFilter === "all" ? t('all_subjects', 'All Subjects') : getTranslatedSubject(subjectFilter)}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Customize pill */}
          <button
            onClick={() => setShowCustomizeSheet(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-100 py-3 px-4 rounded-xl text-xs font-black text-slate-700 shadow-xs hover:border-slate-200 active:scale-[0.98] transition-all"
          >
            <span>⚙️</span>
            <span>{t('customize', 'Customize')}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>

        {/* Sub-filters row 2: Export */}
        <button
          onClick={() => setShowExportSheet(true)}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-100 py-3 px-4 rounded-xl text-xs font-black text-slate-700 shadow-xs hover:border-indigo-200 hover:bg-indigo-50 active:scale-[0.98] transition-all"
        >
          <span>↓</span>
          <span>{t('export_report_data', 'Export Report Data')}</span>
        </button>

        {/* Today's Activity Card */}
        <Card>
          <SectionHeader icon={<Clock size={20} color="#006a62" />} title={displayLabel} subtitle={t('session_stats_engagement', 'Session stats & engagement')} />
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatBox label={t('time_min', 'TIME (MIN)')}  value={displayTime} />
            <StatBox label={t('questions', 'QUESTIONS')}   value={displaySolved} color="text-[#006a62]" />
            <StatBox label={t('accuracy', 'ACCURACY')}    value={`${displayAccuracy}%`} color="text-[#30007f]" />
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-[#464652] uppercase">{t('confidence', 'CONFIDENCE')}</span>
            <span className="text-sm font-black text-[#141779]">{displayAccuracy}%</span>
          </div>
          <ProgressBar value={displayAccuracy} color="bg-gradient-to-r from-[#141779] via-[#30007f] to-[#57fae9]" />
          
          {compareFilter === "previous" && (() => {
            const prevHistory = reportData?.monthlyTimelineHistory || [];
            if (prevHistory.length >= 2) {
              const curr = prevHistory[prevHistory.length - 1]?.masteryScore ?? displayAccuracy;
              const prev = prevHistory[prevHistory.length - 2]?.masteryScore ?? displayAccuracy;
              const delta = curr - prev;
              const deltaStr = delta >= 0 ? `↑ ${delta}%` : `↓ ${Math.abs(delta)}%`;
              const color = delta >= 0 ? "text-emerald-600" : "text-red-600";
              return (
                <div className={`mt-3 text-xs font-black ${color} flex items-center gap-1.5`}>
                  <span>{deltaStr} {t("vs_previous_period", "vs previous period")}</span>
                </div>
              );
            }
            return null;
          })()}
        </Card>

        {/* Question Analytics Card */}
        <Card>
          <SectionHeader icon={<BarChart2 size={20} color="#30007f" />} title={t("question_analytics", "Question Analytics")} subtitle={t("overall_performance_metrics", "Overall performance metrics")} />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label={t("total_attempted", "Total Attempted")} value={filteredQA.totalAttempted ?? 0} />
            <StatBox label={t("accuracy", "Accuracy")}        value={`${filteredQA.accuracy ?? 0}%`} color="text-[#006a62]" />
            <StatBox label={t("correct", "Correct")}         value={filteredQA.correct ?? 0} color="text-[#006a62]" />
            <StatBox label={t("wrong", "Wrong")}           value={filteredQA.wrong ?? 0} color="text-[#ba1a1a]" />
          </div>
          {(filteredQA.totalAttempted ?? 0) > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-700">{t("avg_time_per_question", "Avg. Time per Question")}</span>
              <span className="text-sm font-black text-indigo-900">{filteredQA.avgTimePerQuestion || 15}s</span>
            </div>
          )}
        </Card>

        {/* Subject Performance Section */}
        <Card>
          <SectionHeader icon={<BookOpen size={20} color="#141779" />} title={t("subject_performance", "Subject Performance")} subtitle={t("accuracy_by_subject", "Accuracy by subject")} />
          <div className="space-y-4 mt-2">
            {subjects.map((s: any, idx: number) => {
              const colorInfo = getSubjectChartColor(s.subject, idx);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-slate-800">
                    <span className="capitalize">{s.subject}</span>
                    <span className="text-[#141779] font-black">{s.accuracy ?? 0}%</span>
                  </div>
                  <ProgressBar value={s.accuracy ?? 0} color={colorInfo.bar} />
                </div>
              );
            })}
            {subjects.length === 0 && (
              <p className="text-xs text-[#767683] text-center py-2">{t("no_subject_activity_data", "No subject activity data available.")}</p>
            )}
          </div>
        </Card>

        {/* Reading Analytics Card */}
        <Card>
          <SectionHeader icon={<BookMarked size={20} color="#006a62" />} title={t("reading_analytics", "Reading Analytics")} subtitle={t("pdf_chapter_reading_progress", "PDF chapter reading progress")} />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label={t("chapters_read", "Chapters Read")}   value={rA.chaptersRead ?? 0} color="text-[#006a62]" />
            <StatBox label={t("completion_rate", "Completion Rate")} value={`${rA.completionRate ?? 0}%`} color="text-[#141779]" />
          </div>
          <ProgressBar value={rA.completionRate ?? 0} color="bg-[#006a62]" />
          <div className="mt-3 bg-[#006a62]/5 border border-[#006a62]/10 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-[#006a62]">{t("total_reading_time", "Total Reading Time")}</span>
            <span className="text-sm font-black text-[#006a62]">{formatReadingTime(rA.totalReadingTime ?? 0)}</span>
          </div>

          {(rA.readChaptersDetailed?.length > 0 || rA.readChaptersList?.length > 0) && (
            <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-[10px] font-bold text-[#464652] uppercase tracking-wide">{t("read_chapters", "Read Chapters")}</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {(rA.readChaptersDetailed || (rA.readChaptersList || []).map((name: string) => ({ name }))).map((ch: any, idx: number) => (
                  <div key={idx} className="bg-[#006a62]/5 border border-[#006a62]/15 rounded-xl px-3 py-2 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-slate-400">📖</span>
                      <span className="font-bold text-[#006a62] truncate">{ch.name}</span>
                    </div>
                    {ch.timeSpent > 0 && (
                      <span className="text-[10px] font-black text-slate-500 shrink-0 ml-2">⏱️ {formatReadingTime(ch.timeSpent)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Chapter Boss Fight Analytics Card */}
        <Card>
          <SectionHeader icon={<ShieldCheck size={20} color="#ba1a1a" />} title={t("chapter_boss_fight_analytics", "Chapter Boss Fight Analytics")} subtitle={t("battle_performance_history", "Battle performance history")} />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label={t("total_attempts", "Total Attempts")} value={bA.totalAttempts ?? 0} />
            <StatBox label={t("pass_rate", "Pass Rate")} value={`${bA.passRate ?? 0}%`} color={(bA.passRate ?? 0) >= 60 ? "text-[#006a62]" : "text-[#ba1a1a]"} />
            <StatBox label={t("wins", "Wins")}  value={bA.wins ?? 0}   color="text-[#006a62]" />
            <StatBox label={t("losses", "Losses")} value={bA.losses ?? 0} color="text-[#ba1a1a]" />
          </div>
          <ProgressBar value={bA.passRate ?? 0} color={(bA.passRate ?? 0) >= 60 ? "bg-[#006a62]" : "bg-[#ba1a1a]"} />
          
          {bossHistory.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-[10px] font-bold text-[#464652] uppercase tracking-wide">{t("recent_chapter_boss_fights", "Recent Chapter Boss Fights")}</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {bossHistory.map((b: any, idx: number) => {
                  const statusUpper = (b.status || "").toUpperCase();
                  const isWon = statusUpper === "WON" || statusUpper === "VICTORY";
                  const isLost = statusUpper === "LOST" || statusUpper === "DEFEAT";

                  const statusText = isWon
                    ? t("victory", "Victory")
                    : (isLost ? t("defeat", "Defeat") : t("in_progress", "In Progress"));

                  const statusBg = isWon 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : (isLost ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200");
                  
                  const diffLower = (b.difficulty || "").toLowerCase();
                  const diffText = diffLower === "easy" ? t("easy", "Easy") : (diffLower === "medium" ? t("medium", "Medium") : (diffLower === "hard" ? t("hard", "Hard") : (b.difficulty || t("normal", "Normal"))));

                  let bossNameText = b.bossName || t("chapter_boss_fight", "Chapter Boss Fight");
                  if (bossNameText.includes("Egg Thief")) {
                    bossNameText = bossNameText.replace("Egg Thief", t("boss_egg_thief", "Egg Thief"));
                  }
                  bossNameText = bossNameText.replace(/\(Easy\)/gi, `(${t("easy", "Easy")})`)
                    .replace(/\(Medium\)/gi, `(${t("medium", "Medium")})`)
                    .replace(/\(Hard\)/gi, `(${t("hard", "Hard")})`);

                  let formattedDate = "";
                  try {
                    if (b.date) {
                      const d = new Date(b.date);
                      formattedDate = d.toLocaleDateString(i18n.language === "gu" ? "gu-IN" : "en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                    }
                  } catch (e) {}

                  const chapterDisplay = b.chapterName || b.bossName || t("chapter_boss_fight", "Chapter Boss Fight");

                  return (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center transition-all">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{chapterDisplay}</p>
                        <p className="text-[10px] font-bold text-[#767683] mt-0.5">
                          {formattedDate} {b.subjectName ? `• ${b.subjectName}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          {diffText}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${statusBg}`}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Daily Mastery & Risk Trend Chart */}
        <Card>
          <SectionHeader icon={<TrendingUp size={20} color="#141779" />} title={t("daily_mastery_risk_trend", "Daily Mastery & Risk Trend")} subtitle={t("last_7_days", "Last 7 days")} />
          {chartHistory.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#767683]">{t("solve_questions_trend", "Solve questions to generate trend analytics.")}</div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center gap-4 mb-4 text-[10px] font-bold text-[#464652]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" /><span>{t("mastery", "Mastery")}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" /><span>{t("focus", "Focus")}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" /><span>{t("risk", "Risk")}</span></div>
              </div>
              <svg ref={svgRef} viewBox="0 0 500 220" className="w-full overflow-visible select-none cursor-pointer"
                onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredIndex(null)}>
                <defs>
                  <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map(v => (
                  <g key={v}>
                    <line x1={pL} y1={getY(v)} x2={chartWidth - pR} y2={getY(v)} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={pL - 10} y={getY(v) + 4} textAnchor="end" fontSize="12" fontWeight="bold" className="text-[12px] fill-[#334155] font-extrabold">{v}%</text>
                  </g>
                ))}
                {chartHistory.length > 0 && (
                  <>
                    <path d={masteryAreaPath} fill="url(#mGrad)" />
                    <path d={masteryPath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                    <path d={weaknessPath} fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="4,4" />
                    <path d={riskPath} fill="none" stroke="#dc2626" strokeWidth="2" />
                    {chartHistory.map((pt: any, i: number) => {
                      const isHovered = hoveredIndex === i;
                      return (
                        <g key={i}>
                          <circle cx={getX(i)} cy={getY(pt.masteryScore)} r={isHovered ? 6 : 4} fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={getX(i)} cy={getY(pt.weaknessScore)} r={isHovered ? 5 : 3.5} fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={getX(i)} cy={getY(pt.riskIndex)} r={isHovered ? 5 : 3.5} fill="#dc2626" stroke="#fff" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </>
                )}
                {chartHistory.map((pt: any, i: number) => (
                  <text key={i} x={getX(i)} y={chartHeight - pB + 22} textAnchor="middle" fontSize="13" fontWeight="bold" className="text-[13px] fill-[#141779] font-extrabold">{pt.date}</text>
                ))}
              </svg>
              {hoveredIndex !== null && chartHistory[hoveredIndex] && (
                <div className="mt-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-1.5 rounded-lg">
                    <p className="text-[9px] font-bold text-blue-700 uppercase">{t("mastery", "Mastery")}</p>
                    <p className="text-sm font-bold text-blue-900">{chartHistory[hoveredIndex].masteryScore}%</p>
                  </div>
                  <div className="bg-amber-50 p-1.5 rounded-lg">
                    <p className="text-[9px] font-bold text-amber-700 uppercase">{t("focus", "Focus")}</p>
                    <p className="text-sm font-bold text-amber-900">{chartHistory[hoveredIndex].weaknessScore}%</p>
                  </div>
                  <div className="bg-red-50 p-1.5 rounded-lg">
                    <p className="text-[9px] font-bold text-red-700 uppercase">{t("risk", "Risk")}</p>
                    <p className={`text-sm font-bold ${chartHistory[hoveredIndex].riskIndex >= 50 ? "text-red-700" : "text-green-600"}`}>{chartHistory[hoveredIndex].riskIndex}%</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Cognitive Strengths & Weaknesses */}
        <Card>
          <h3 className="text-sm font-bold text-[#191c1e] mb-3">💪 {t("conceptual_strengths", "Conceptual Strengths")}</h3>
          {!hasStrengths
            ? <p className="text-xs text-[#767683]">{t("complete_more_quests_strengths", "Complete more quests to identify strengths.")}</p>
            : strengths.map((s: string, i: number) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 font-semibold">{formatInsightMessage(s)}</p>
              </div>
            ))}
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-[#191c1e] mb-3">⚠️ {t("focus_areas", "Focus Areas")}</h3>
          {!hasWeaknesses
            ? <p className="text-xs text-[#767683]">{t("no_weaknesses_detected", "No weaknesses detected yet.")}</p>
            : weaknesses.map((w: string, i: number) => (
              <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                <AlertTriangle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 font-semibold">{formatInsightMessage(w)}</p>
              </div>
            ))}
        </Card>

        {/* Incorrect Questions Review (Mistakes) */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-[#ba1a1a]" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#191c1e]">{t("incorrect_questions_mistakes", "Incorrect Questions (Mistakes)")}</h2>
              <p className="text-xs text-[#767683]">{t("review_recent_incorrect", "Review recent questions answered incorrectly")}</p>
            </div>
          </div>

          {mistakes.length === 0 ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <span className="text-2xl mb-1 block">🎉</span>
              <p className="text-xs text-green-800 font-semibold">{t("no_recent_mistakes", "Excellent! No recent mistakes recorded. Keep up the great work!")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(showAllMistakes ? mistakes : mistakes.slice(0, 5)).map((m: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border-l-[4px] border-l-[#ba1a1a] rounded-xl p-4 shadow-xs border border-slate-100">
                  <p className="text-[14px] font-bold text-slate-800 mb-2.5 leading-snug">{m.questionText}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md capitalize">
                      📚 {m.subject === "General" ? t("general", "General") : m.subject}
                    </span>
                    <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md">
                      📖 {m.chapter === "Practice Quiz" ? t("practice_quiz", "Practice Quiz") : m.chapter}
                    </span>
                    {m.timeSpent > 0 && (
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        ⏱️ {m.timeSpent}s
                      </span>
                    )}
                  </div>

                  {(m.selectedOption || m.correctAnswer) && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {m.selectedOption && (
                        <div className="bg-red-50/80 border border-red-100 rounded-lg p-2 text-red-700">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-red-500 mb-0.5">
                            {t("your_answer", "Child's Answer")}:
                          </span>
                          <span className="font-semibold">{m.selectedOption}</span>
                        </div>
                      )}
                      {m.correctAnswer && (
                        <div className="bg-emerald-50/80 border border-emerald-100 rounded-lg p-2 text-emerald-800">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-600 mb-0.5">
                            {t("correct_answer", "Correct Answer")}:
                          </span>
                          <span className="font-semibold">{m.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {m.explanation && (
                    <div className="mt-2 p-2 bg-amber-50/60 border border-amber-100/70 rounded-lg text-xs text-amber-900">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700 block mb-0.5">
                        💡 {t("explanation", "Explanation")}:
                      </span>
                      <p className="text-slate-600 font-medium">{m.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {mistakes.length > 5 && (
                <button
                  onClick={() => setShowAllMistakes(!showAllMistakes)}
                  className="w-full mt-2 py-2.5 border border-dashed border-[#141779] text-[#141779] hover:bg-[#141779]/5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  {showAllMistakes ? (
                    <>{t("show_less", "Show Less")} <ChevronUp size={14} /></>
                  ) : (
                    <>{t("show_all_mistakes", "Show All Mistakes ({{count}})", { count: mistakes.length })} <ChevronDown size={14} /></>
                  )}
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Risk Alerts */}
        {hasRisks && (
          <Card>
            <SectionHeader icon={<AlertTriangle size={20} color="#ba1a1a" />} title={t("risk_alerts", "Risk Alerts")} subtitle={t("automatically_detected_warnings", "Automatically detected warnings")} />
            <div className="flex flex-col gap-2">
              {risks.map((r: string, i: number) => (
                <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 items-start">
                  <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-semibold">{r}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <Card>
          <SectionHeader icon={<Lightbulb size={20} color="#f39c12" />} title={t("parent_recommendations", "Parent Recommendations")} subtitle={t("personalised_action_steps", "Personalised action steps")} />
          <div className="flex flex-col gap-2">
            {recommendations.map((rec: string, i: number) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 items-start">
                <CheckCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-semibold">{translateRecommendation(rec)}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Date Sheet Modal */}
      <BottomSheet isOpen={showDateSheet} onClose={() => setShowDateSheet(false)} title={t("select_time_period", "Select Time Period")}>
        <div className="flex flex-col gap-2">
          {["today", "yesterday", "this_week", "this_month", "custom"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setDateFilter(opt);
                if (opt !== "custom") {
                  setShowDateSheet(false);
                }
              }}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-black text-left capitalize transition-colors flex justify-between items-center ${
                dateFilter === opt
                  ? "bg-indigo-50 text-[#141779] border-2 border-indigo-200"
                  : "bg-slate-50 text-slate-800 border-2 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <span>{t(opt, opt.replace("_", " "))}</span>
              {dateFilter === opt && <span className="text-indigo-600 text-xs">✓ {t("active", "Active")}</span>}
            </button>
          ))}
          {dateFilter === "custom" && (
            <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl space-y-3">
              <h4 className="text-xs font-black text-[#141779] uppercase">{t("custom_date_range", "Custom Date Range")}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">{t("start_date", "Start Date")}</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">{t("end_date", "End Date")}</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowDateSheet(false)}
                className="w-full mt-2 bg-[#141779] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-transform active:scale-[0.98]"
              >
                {t("apply_custom_range", "Apply Custom Range")}
              </button>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Subject Sheet Modal */}
      <BottomSheet isOpen={showSubjectSheet} onClose={() => setShowSubjectSheet(false)} title={t("select_subject", "Select Subject")}>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setSubjectFilter("all");
              setShowSubjectSheet(false);
            }}
            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-black text-left transition-colors flex justify-between items-center ${
              subjectFilter === "all"
                ? "bg-indigo-50 text-[#141779] border-2 border-indigo-200"
                : "bg-slate-50 text-slate-800 border-2 border-slate-100 hover:bg-slate-100"
            }`}
          >
            <span>{t("all_subjects", "All Subjects")}</span>
            {subjectFilter === "all" && <span className="text-indigo-600 text-xs">✓ {t("active", "Active")}</span>}
          </button>
          {subjects.map((s: any) => (
            <button
              key={s.subject}
              onClick={() => {
                setSubjectFilter(s.subject);
                setShowSubjectSheet(false);
              }}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-black text-left transition-colors flex justify-between items-center ${
                subjectFilter === s.subject
                  ? "bg-indigo-50 text-[#141779] border-2 border-indigo-200"
                  : "bg-slate-50 text-slate-800 border-2 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <span className="capitalize">{getTranslatedSubject(s.subject)}</span>
              {subjectFilter === s.subject && <span className="text-indigo-600 text-xs">✓ {t("active", "Active")}</span>}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Customize Sheet Modal */}
      <BottomSheet isOpen={showCustomizeSheet} onClose={() => setShowCustomizeSheet(false)} title={t("customize_report", "Customize Report")}>
        <div className="space-y-5">
          {/* Time Period */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("time_period", "Time Period")}</label>
            <div className="grid grid-cols-3 gap-2">
              {(["today", "this_week", "this_month", "yesterday", "custom"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDateFilter(opt)}
                  className={`py-2.5 px-1 text-[10px] font-black rounded-xl border text-center transition-colors capitalize ${
                    dateFilter === opt
                      ? "bg-[#141779] text-white border-[#141779]"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {t(opt, opt.replace(/_/g, " "))}
                </button>
              ))}
            </div>
            {dateFilter === "custom" && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500">{t("start_date", "Start Date")}</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-500">{t("end_date", "End Date")}</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("subject", "Subject")}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSubjectFilter("all")}
                className={`py-2.5 px-3 text-xs font-black rounded-xl border text-center transition-colors ${
                  subjectFilter === "all"
                    ? "bg-[#141779] text-white border-[#141779]"
                    : "bg-slate-50 text-slate-800 border-slate-200"
                }`}
              >
                {t("all_subjects", "All Subjects")}
              </button>
              {subjects.map((s: any) => (
                <button
                  key={s.subject}
                  onClick={() => setSubjectFilter(s.subject)}
                  className={`py-2.5 px-3 text-xs font-black rounded-xl border text-center transition-colors capitalize ${
                    subjectFilter === s.subject
                      ? "bg-[#141779] text-white border-[#141779]"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {getTranslatedSubject(s.subject)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCustomizeSheet(false)}
            className="w-full bg-[#141779] text-white py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-transform active:scale-[0.98]"
          >
            ✓ {t("apply_and_close", "Apply & Close")}
          </button>
        </div>
      </BottomSheet>

      {/* Export Sheet Modal */}
      <BottomSheet isOpen={showExportSheet} onClose={() => setShowExportSheet(false)} title={t("export_report", "Export Report")}>
        <div className="space-y-4">
          <p className="text-xs text-[#767683] font-bold text-center">
            {t("choose_export_format", "Choose your preferred format to export or share this learning report.")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                handleDownload("pdf");
                setShowExportSheet(false);
              }}
              disabled={isDownloading !== null}
              className="py-3.5 px-4 bg-[#141779] hover:bg-[#1a1e9e] active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <span className="text-lg">📄</span>
              <span>{t("download_pdf", "Download PDF")}</span>
              {isDownloading === "pdf" && <Loader2 size={14} className="animate-spin mt-1" />}
            </button>
            
            <button
              onClick={() => {
                handleDownload("word");
                setShowExportSheet(false);
              }}
              disabled={isDownloading !== null}
              className="py-3.5 px-4 bg-[#006a62] hover:bg-[#008c81] active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm transition-all flex flex-col items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <span className="text-lg">📝</span>
              <span>{t("download_word", "Download Word")}</span>
              {isDownloading === "word" && <Loader2 size={14} className="animate-spin mt-1" />}
            </button>
          </div>
          
          <button
            onClick={() => {
              handleShare();
              setShowExportSheet(false);
            }}
            className="w-full py-3.5 px-4 border-2 border-[#141779] text-[#141779] hover:bg-[#141779]/5 active:scale-[0.98] rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            📤 {t("share_report_link", "Share Report Link")}
          </button>
        </div>
      </BottomSheet>

      {/* Child Switcher Modal */}
      <ChildSwitcherModal
        isOpen={showSwitcher}
        onClose={() => setShowSwitcher(false)}
        user={userData}
        onUserUpdated={(u) => setUserData(u)}
        onSwitched={() => {
          sessionStorage.removeItem("parent_report_cache");
          setLoading(true);
          setRefreshKey(k => k + 1);
        }}
      />

      {/* Unified Alert / Feedback Modal */}
      <UnifiedConfirmModal
        isOpen={!!alertModal?.show}
        onClose={() => setAlertModal(null)}
        onConfirm={() => setAlertModal(null)}
        title={alertModal?.title || ""}
        message={alertModal?.message || ""}
        confirmText="Got It"
        showCancel={false}
        variant={alertModal?.variant || "primary"}
      />
    </div>
  );
}

function BottomSheet({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/60 z-[200] flex items-end justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-t-[32px] w-full max-w-[430px] p-6 pb-10 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto font-sans">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-black text-[#141779]">{title}</h3>
          <button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
            {t("close", "Close")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
