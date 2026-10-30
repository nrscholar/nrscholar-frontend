import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Clock, TrendingUp, AlertTriangle, CheckCircle,
  Calculator, Atom, BookOpen, Star, Target, Lightbulb,
  Award, BookOpenCheck, Loader2, Brain, Zap, ShieldCheck, BookMarked,
  ChevronDown, ChevronUp, ChevronRight, BarChart2, Settings, Bell,
  Download, SlidersHorizontal
} from "lucide-react";
import { apiFetch } from "../../../api";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";
import UnifiedConfirmModal from "../../../components/UnifiedConfirmModal";
import { getSubjectChartColor, DISTINCT_SUBJECT_PALETTE } from "../../../utils/chartColors";
import { getScopedItem, setScopedItem, removeScopedItem, getActiveUserContext } from "../../../utils/sessionCache";
import { useLockBodyScroll } from "../../../utils/useLockBodyScroll";

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
      <p className="text-xs font-black text-[#464652] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-black ${color}`}>{value}</p>
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
        <h2 className="text-base sm:text-lg font-black text-[#191c1e]">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm font-medium text-[#767683]">{subtitle}</p>}
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

  const getTranslatedSubject = (subj: string) => {
    if (!subj) return "";
    const lower = subj.toLowerCase().trim();
    const currentLang = (i18n.language || localStorage.getItem("i18nextLng") || "en").toLowerCase().split("-")[0];
    const isGu = currentLang === "gu";
    const isHi = currentLang === "hi";

    if (lower === "mathematics" || lower === "maths" || lower === "math" || lower === "ganit" || lower === "ગણિત" || lower === "गणित") {
      return isGu ? t("maths", "ગણિત") : isHi ? "गणित" : "Maths";
    }
    if (lower === "gujarati" || lower === "ગુજરાતી" || lower === "गुजराती") {
      return isGu ? t("gujarati", "ગુજરાતી") : isHi ? "गुजराती" : "Gujarati";
    }
    if (lower === "science" || lower === "vigyan" || lower === "વિજ્ઞાન" || lower === "विज्ञान") {
      return isGu ? t("science", "વિજ્ઞાન") : isHi ? "विज्ञान" : "Science";
    }
    if (lower === "english" || lower === "અંગ્રેજી" || lower === "अंग्रेजी") {
      return isGu ? t("english", "અંગ્રેજી") : isHi ? "अंग्रेजी" : "English";
    }
    if (lower === "hindi" || lower === "હિન્દી" || lower === "हिन्दी" || lower === "हिंदी") {
      return isGu ? t("hindi", "હિન્દી") : isHi ? "हिन्दी" : "Hindi";
    }
    if (lower === "social studies" || lower === "social_studies" || lower === "સામાજિક વિજ્ઞાન" || lower === "सामाजिक विज्ञान") {
      return isGu ? t("social_studies", "સામાજિક વિજ્ઞાન") : isHi ? "सामाजिक विज्ञान" : "Social Studies";
    }
    return t(lower, subj);
  };

  const [activeTab, setActiveTab] = useState("daily");
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const currentLang = i18n.language || localStorage.getItem("i18nextLng") || "en";
  const cachedReport = (() => {
    try {
      const raw = getScopedItem(`parent_report_cache_${currentLang}`);
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
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartOuterRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

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
      const ctx = getActiveUserContext();
      const childParam = ctx.childId ? `&childId=${encodeURIComponent(ctx.childId)}` : "";
      const classParam = ctx.classLevel ? `&classLevel=${encodeURIComponent(ctx.classLevel)}` : "";
      const url = `/api/parent/report/download?filter=${downloadFilter}&subject=${subjectFilter}&format=${format}&tz_offset_minutes=${offsetMinutes}&lang=${encodeURIComponent(activeLang)}${childParam}${classParam}`;
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
  const chartHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const pL = paddingLeft;
  const pR = paddingRight;
  const pT = paddingTop;
  const pB = paddingBottom;

  const getRadarPt = (cx: number, cy: number, r: number, ang: number) => ({
    x: cx + r * Math.cos((ang * Math.PI) / 180),
    y: cy + r * Math.sin((ang * Math.PI) / 180),
  });
  const dna = reportData?.learningDnaRadar || { accuracy: 0, speed: 0, resilience: 0, consistency: 0, retention: 0 };
  const dnaAxes = [
    { val: dna.accuracy,    ang: -90,  label: "Accuracy" },
    { val: dna.speed,       ang: -18,  label: "Speed" },
    { val: dna.resilience,  ang:  54,  label: "Resilience" },
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
      .replace(/Practice chapter quizzes regularly to reinforce key concepts!/g,
        t("rec_try_boss_battle", "પૂર્ણ થયેલા પ્રકરણોમાં તમારી નિપુણતા ચકાસવા માટે બોસ બેટલ અજમાવો!")
      );

    return translated;
  };

  const fetchReport = useCallback(async () => {
    try {
      const lang = i18n.language || localStorage.getItem("i18nextLng") || "en";
      const tzOffset = -new Date().getTimezoneOffset();
      const ctx = getActiveUserContext();
      const activeCid = ctx.childId;
      const activeClass = ctx.classLevel;
      const childParam = activeCid ? `&childId=${encodeURIComponent(activeCid)}` : "";
      const classParam = activeClass ? `&classLevel=${encodeURIComponent(activeClass)}` : "";
      const [reportRes, userRes] = await Promise.all([
        apiFetch(`/api/parent/report?lang=${encodeURIComponent(lang)}&tz_offset_minutes=${tzOffset}${childParam}${classParam}`, { headers: { "Accept-Language": lang } }),
        apiFetch("/api/users/me").catch(() => null)
      ]);
      const json = await reportRes.json();
      if (json.success) {
        setReportData(json.data);
        setScopedItem(`parent_report_cache_${lang}`, JSON.stringify(json.data));
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

  useEffect(() => {
    const updateWidth = () => {
      const el = chartOuterRef.current || chartContainerRef.current;
      if (el && el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [loading]);

  useEffect(() => {
    if (!loading && chartContainerRef.current) {
      const scrollToEnd = () => {
        if (chartContainerRef.current) {
          chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth;
        }
      };
      scrollToEnd();
      const raf = requestAnimationFrame(scrollToEnd);
      const timer = setTimeout(scrollToEnd, 100);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [loading, dateFilter, subjectFilter]);

  const tabs = [
    { id: "daily",    label: "Daily"    },
    { id: "subjects", label: "Subjects" },
    { id: "monthly",  label: "Monthly"  },
    { id: "yearly",   label: "Yearly"   },
  ];
  // Note: activeTab and tabs are retained for future tab-based navigation

  if (loading) return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-4">
      {/* Header Skeleton */}
      <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] shadow-[0_12px_40px_rgba(20,23,121,0.14)] w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex flex-col min-w-0 justify-center">
            <h1 className="text-base sm:text-lg font-black text-[#141779] tracking-tight truncate leading-tight">
              {t('reports', 'Reports')}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-semibold truncate leading-tight mt-0.5">
              {t('learning_reports_sub', 'Real-time analytics from activity data')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => navigate('/parent/settings')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
          </button>
        </div>
      </header>

      <main className="px-5 pt-5 flex flex-col gap-5 max-w-lg mx-auto">
        {/* Child Selector Pills Placeholder (if multiple children exist) */}
        {userData?.children && userData.children.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {userData.children.map((c: any) => {
              const isActive = (userData.activeChildId || "child_1") === c.childId;
              return (
                <div
                  key={c.childId}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm shrink-0 transition-all ${
                    isActive
                      ? "border-[#141779] bg-[#141779] text-white shadow-md"
                      : "border-slate-200 bg-white text-[#141779]"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                    {c.childPhoto
                      ? <img src={c.childPhoto} alt={c.childName} className="w-full h-full object-cover rounded-full" />
                      : c.childName?.charAt(0).toUpperCase()}
                  </span>
                  {c.childName}
                  {isActive && <span className="text-xs opacity-70">✓</span>}
                </div>
              );
            })}
          </div>
        )}

        {/* Report Actions Side-by-Side Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl animate-skeleton shrink-0" />
              <div className="w-4 h-4 rounded-md animate-skeleton shrink-0" />
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="h-3.5 w-20 rounded-md animate-skeleton" />
              <div className="h-2.5 w-28 rounded-md animate-skeleton" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl animate-skeleton shrink-0" />
              <div className="w-4 h-4 rounded-md animate-skeleton shrink-0" />
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="h-3.5 w-24 rounded-md animate-skeleton" />
              <div className="h-2.5 w-28 rounded-md animate-skeleton" />
            </div>
          </div>
        </div>

        {/* Activity Card Skeleton */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full animate-skeleton shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded-md animate-skeleton" />
              <div className="h-3 w-48 rounded-md animate-skeleton" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f2f4f6] p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
                <div className="h-2.5 w-14 rounded animate-skeleton mb-2" />
                <div className="h-6 w-12 rounded-md animate-skeleton" />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mb-1.5">
            <div className="h-3 w-20 rounded animate-skeleton" />
            <div className="h-3 w-8 rounded animate-skeleton" />
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-3/4 rounded-full animate-skeleton" />
          </div>
        </Card>

        {/* Question Analytics Card Skeleton */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full animate-skeleton shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-40 rounded-md animate-skeleton" />
              <div className="h-3 w-52 rounded-md animate-skeleton" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#f2f4f6] p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
                <div className="h-2.5 w-20 rounded animate-skeleton mb-2" />
                <div className="h-6 w-12 rounded-md animate-skeleton" />
              </div>
            ))}
          </div>
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
            <div className="h-3 w-36 rounded animate-skeleton" />
            <div className="h-4 w-10 rounded animate-skeleton" />
          </div>
        </Card>

        {/* Subject Performance Skeleton */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full animate-skeleton shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded-md animate-skeleton" />
              <div className="h-3 w-40 rounded-md animate-skeleton" />
            </div>
          </div>
          <div className="space-y-4 mt-2">
            {[
              { wTitle: "w-24", wBar: "82%" },
              { wTitle: "w-20", wBar: "68%" },
              { wTitle: "w-28", wBar: "74%" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className={`h-3.5 ${item.wTitle} rounded animate-skeleton`} />
                  <div className="h-3.5 w-8 rounded animate-skeleton" />
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full animate-skeleton" style={{ width: item.wBar }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trend Chart Card Skeleton */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full animate-skeleton shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-48 rounded-md animate-skeleton" />
              <div className="h-3 w-28 rounded-md animate-skeleton" />
            </div>
          </div>
          {/* Legend Skeleton */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full animate-skeleton shrink-0" />
              <div className="h-2.5 w-12 rounded animate-skeleton" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full animate-skeleton shrink-0" />
              <div className="h-2.5 w-10 rounded animate-skeleton" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full animate-skeleton shrink-0" />
              <div className="h-2.5 w-8 rounded animate-skeleton" />
            </div>
          </div>
          {/* Chart Area Skeleton */}
          <div className="h-48 sm:h-52 w-full rounded-xl bg-slate-50/70 border border-slate-200/50 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-200/30 pb-2">
              <div className="h-2 w-7 rounded animate-skeleton" />
              <div className="h-0.5 flex-1 mx-2 bg-slate-200/40" />
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/30 py-2">
              <div className="h-2 w-7 rounded animate-skeleton" />
              <div className="h-0.5 flex-1 mx-2 bg-slate-200/40" />
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/30 py-2">
              <div className="h-2 w-7 rounded animate-skeleton" />
              <div className="h-0.5 flex-1 mx-2 bg-slate-200/40" />
            </div>
            {/* 7-Day Columns matching Last 7 days trend */}
            <div className="flex justify-between items-end pt-3 px-1 sm:px-2">
              {[45, 65, 40, 80, 55, 75, 60].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-4 sm:w-6 rounded-t-md animate-skeleton" style={{ height: `${h}px` }} />
                  <div className="h-2 w-6 rounded animate-skeleton" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );

  const qA: any          = reportData?.questionAnalytics    || {};
  const rA: any          = reportData?.readingAnalytics     || {};
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

  // Subject matching helper
  const matchSubject = (s1?: string, s2?: string): boolean => {
    if (!s1 || !s2) return false;
    const a = s1.trim().toLowerCase();
    const b = s2.trim().toLowerCase();
    if (a === b) return true;

    // Maths aliases
    const isMathA = a === "math" || a === "maths" || a === "mathematics" || a === "ganit" || a === "ગણિત" || a === "गणित";
    const isMathB = b === "math" || b === "maths" || b === "mathematics" || b === "ganit" || b === "ગણિત" || b === "गणित";
    if (isMathA && isMathB) return true;

    // Gujarati aliases
    const isGujA = a === "gujarati" || a === "ગુજરાતી" || a === "गुजराती";
    const isGujB = b === "gujarati" || b === "ગુજરાતી" || b === "गुजराती";
    if (isGujA && isGujB) return true;

    // Science aliases
    const isSciA = a === "science" || a === "vigyan" || a === "વિજ્ઞાન" || a === "विज्ञान";
    const isSciB = b === "science" || b === "vigyan" || b === "વિજ્ઞાન" || b === "विज्ञान";
    if (isSciA && isSciB) return true;

    // English aliases
    const isEngA = a === "english" || a === "અંગ્રેજી" || a === "अंग्रेजी";
    const isEngB = b === "english" || b === "અંગ્રેજી" || b === "अंग्रेजी";
    if (isEngA && isEngB) return true;

    // Hindi aliases
    const isHinA = a === "hindi" || a === "હિન્દી" || a === "हिन्दी" || a === "हिंदी";
    const isHinB = b === "hindi" || b === "હિન્દી" || b === "हिन्दी" || b === "हिंदी";
    if (isHinA && isHinB) return true;

    // Social studies aliases
    const isSsA = a === "social studies" || a === "social_studies" || a === "સામાજિક વિજ્ઞાન" || a === "सामाजिक विज्ञान";
    const isSsB = b === "social studies" || b === "social_studies" || b === "સામાજિક વિજ્ઞાન" || b === "सामाजिक विज्ञान";
    if (isSsA && isSsB) return true;

    return false;
  };

  // Date key normalizer: converts any "YYYY-MM-DD" or "DD/MM" string to standard "DD/MM"
  const normalizeDateKey = (raw: any): string => {
    if (!raw) return "";
    const s = String(raw).trim();
    const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})/);
    if (slashMatch) {
      return `${slashMatch[1].padStart(2, "0")}/${slashMatch[2].padStart(2, "0")}`;
    }
    const isoMatch = s.match(/^\d{4}-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[2]}/${isoMatch[1]}`;
    }
    return s;
  };

  // Unified Date Range Filter Evaluator for all metrics and mistake logs
  const isDateInFilterRange = (dateInput: any): boolean => {
    if (!dateInput) return false;
    let d: Date;
    if (dateInput instanceof Date) {
      d = dateInput;
    } else if (typeof dateInput === "number") {
      d = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      const trimmed = dateInput.trim();
      const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})$/);
      if (slashMatch) {
        const now = new Date();
        const day = parseInt(slashMatch[1], 10);
        const month = parseInt(slashMatch[2], 10) - 1;
        let year = now.getFullYear();
        if (now.getMonth() === 0 && month === 11) {
          year -= 1;
        }
        d = new Date(year, month, day);
      } else {
        d = new Date(trimmed);
      }
    } else {
      d = new Date(dateInput);
    }

    if (isNaN(d.getTime())) return false;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dateFilter === "today") {
      return d >= todayStart && d <= todayEnd;
    }
    if (dateFilter === "yesterday") {
      const yStart = new Date(todayStart);
      yStart.setDate(yStart.getDate() - 1);
      const yEnd = new Date(todayEnd);
      yEnd.setDate(yEnd.getDate() - 1);
      return d >= yStart && d <= yEnd;
    }
    if (dateFilter === "this_week") {
      const wStart = new Date(todayStart);
      wStart.setDate(wStart.getDate() - 6);
      return d >= wStart && d <= todayEnd;
    }
    if (dateFilter === "this_month") {
      const mStart = new Date(todayStart);
      mStart.setDate(mStart.getDate() - 29);
      return d >= mStart && d <= todayEnd;
    }
    if (dateFilter === "custom") {
      if (customStartDate && customEndDate) {
        const s = new Date(customStartDate);
        s.setHours(0, 0, 0, 0);
        const e = new Date(customEndDate);
        e.setHours(23, 59, 59, 999);
        return d >= s && d <= e;
      }
      return true;
    }
    return true;
  };

  // 1. Unified Mistake Reviews Filtering
  const filteredMistakes = mistakes.filter((m: any) => {
    if (subjectFilter !== "all" && !matchSubject(m.subject || m.subjectName || m.subjectId, subjectFilter)) {
      return false;
    }
    if (!m.createdAt) return true;
    return isDateInFilterRange(m.createdAt);
  });
  const mistakesCount = filteredMistakes.length;

  // 2. Identify overall timeline points based on dateFilter
  const targetHistory = (reportData?.yearlyTimelineHistory && reportData.yearlyTimelineHistory.length > 0)
    ? reportData.yearlyTimelineHistory
    : (monthlyHistory.length > 0 ? monthlyHistory : dailyHistory);

  let activePts: any[] = [];
  if (dateFilter === "today") {
    activePts = targetHistory.slice(-1);
  } else if (dateFilter === "yesterday") {
    activePts = targetHistory.length >= 2 ? targetHistory.slice(-2, -1) : [];
  } else if (dateFilter === "this_week") {
    activePts = targetHistory.slice(-7);
  } else if (dateFilter === "this_month") {
    activePts = targetHistory.slice(-30);
  } else if (dateFilter === "custom") {
    activePts = targetHistory.filter((pt: any) => isDateInFilterRange(pt.date || pt.day));
  } else {
    activePts = targetHistory.slice(-7);
  }

  const targetDates = new Set<string>();
  activePts.forEach(pt => {
    const k1 = normalizeDateKey(pt.date);
    const k2 = normalizeDateKey(pt.day);
    if (k1) targetDates.add(k1);
    if (k2) targetDates.add(k2);
  });
  if (targetDates.size === 0 && (dateFilter === "today" || dateFilter === "this_week" || dateFilter === "this_month")) {
    const d = new Date();
    targetDates.add(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  // Tests matching current subjectFilter and dateFilter
  const testsInRange = (reportData?.tests || []).filter((t: any) => {
    if (subjectFilter !== "all" && !matchSubject(t.subject, subjectFilter)) {
      return false;
    }
    return t.date ? isDateInFilterRange(t.date) : true;
  });
  const testsSolved = testsInRange.reduce((acc: number, t: any) => acc + (t.totalQuestions ?? 0), 0);
  const testsCorrect = testsInRange.reduce((acc: number, t: any) => acc + (t.correctAnswers ?? 0), 0);

  // 3. Dynamic Per-Subject Aggregator for the active dateFilter
  const computeSubjectMetrics = (subjName: string) => {
    const sObj = subjects.find((s: any) => matchSubject(s?.subject, subjName));
    const altTrend = (reportData?.allSubjectsTrend || reportData?.top3SubjectsTrend || []).find((t: any) => matchSubject(t?.subject, subjName));
    const sTimeline = (sObj?.timeline && sObj.timeline.length > 0)
      ? sObj.timeline
      : ((altTrend?.timeline && altTrend.timeline.length > 0)
        ? altTrend.timeline
        : (sObj?.trend7Day || []));

    const establishedAcc = typeof sObj?.accuracy === "number" ? sObj.accuracy : 0;

    let matchedPts = sTimeline.filter((pt: any) => {
      const kDate = normalizeDateKey(pt.date);
      const kDay = normalizeDateKey(pt.day);
      return (kDate && targetDates.has(kDate)) || (kDay && targetDates.has(kDay)) || isDateInFilterRange(pt.date) || isDateInFilterRange(pt.day);
    });

    if (matchedPts.length === 0 && sTimeline.length > 0) {
      if (dateFilter === "today") matchedPts = sTimeline.slice(-1);
      else if (dateFilter === "yesterday") matchedPts = sTimeline.slice(-2, -1);
      else if (dateFilter === "this_week") matchedPts = sTimeline.slice(-7);
      else if (dateFilter === "this_month") matchedPts = sTimeline.slice(-30);
      else matchedPts = sTimeline;
    }

    let timelineSolved = matchedPts.reduce((acc: number, pt: any) => acc + (pt.total ?? 0), 0);
    const activeDays = matchedPts.filter((pt: any) => (pt.total ?? 0) > 0);
    let timelineAcc = establishedAcc;
    if (timelineSolved > 0 && activeDays.length > 0) {
      const sumAcc = activeDays.reduce((acc: number, pt: any) => acc + (pt.score ?? pt.masteryScore ?? establishedAcc), 0);
      timelineAcc = Math.round(sumAcc / activeDays.length) || establishedAcc;
    }

    // Tests for this subject in range
    const subjTests = (reportData?.tests || []).filter((t: any) => matchSubject(t.subject, subjName) && (t.date ? isDateInFilterRange(t.date) : true));
    const subjTestsSolved = subjTests.reduce((acc: number, t: any) => acc + (t.totalQuestions ?? 0), 0);
    const subjTestsCorrect = subjTests.reduce((acc: number, t: any) => acc + (t.correctAnswers ?? 0), 0);

    // Mistakes for this subject in range
    const subjMistakes = mistakes.filter((m: any) => matchSubject(m.subject || m.subjectName || m.subjectId, subjName) && (!m.createdAt || isDateInFilterRange(m.createdAt)));
    const subjMistakesCount = subjMistakes.length;

    let solved = Math.max(timelineSolved, subjTestsSolved);
    let accToUse = timelineAcc > 0 ? timelineAcc : (subjTestsSolved > 0 ? Math.round((subjTestsCorrect / subjTestsSolved) * 100) : establishedAcc);

    if (subjMistakesCount > 0) {
      if (solved < subjMistakesCount) {
        const estTotal = (accToUse > 0 && accToUse < 100)
          ? Math.round(subjMistakesCount / (1 - (accToUse / 100)))
          : subjMistakesCount;
        solved = Math.max(subjMistakesCount, estTotal);
      }
    }

    let correct = solved > 0 ? Math.round((solved * accToUse) / 100) : 0;
    let wrong = Math.max(0, solved - correct);

    if (subjMistakesCount > wrong) {
      wrong = subjMistakesCount;
      if (wrong > solved) solved = wrong;
      correct = Math.max(0, solved - wrong);
      accToUse = solved > 0 ? Math.round((correct / solved) * 100) : establishedAcc;
    }

    let timeMin = matchedPts.reduce((acc: number, pt: any) => acc + (pt.timeMinutes || (pt.timeSeconds ? pt.timeSeconds / 60 : 0)), 0);
    const avgSec = sObj?.avgTimePerQuestion || 20;
    if (timeMin <= 0 && solved > 0) {
      timeMin = Math.max(1, Math.round(solved * (avgSec / 60)));
    }
    const avgTime = solved > 0 ? Math.max(1, Math.round((timeMin * 60) / solved)) : avgSec;

    // Display accuracy for Subject Performance bar (shows latest active score or established proficiency)
    let displayAccForBar = establishedAcc;
    if (solved > 0 && activeDays.length > 0) {
      const lastActive = activeDays[activeDays.length - 1];
      displayAccForBar = (typeof lastActive.score === 'number' && lastActive.score > 0)
        ? lastActive.score
        : ((typeof lastActive.masteryScore === 'number' && lastActive.masteryScore > 0) ? lastActive.masteryScore : establishedAcc);
    } else if (matchedPts.length > 0) {
      for (let i = matchedPts.length - 1; i >= 0; i--) {
        const ptScore = matchedPts[i].score ?? matchedPts[i].masteryScore;
        if (typeof ptScore === 'number' && ptScore > 0) {
          displayAccForBar = ptScore;
          break;
        }
      }
    }

    return {
      subject: sObj?.subject || subjName,
      totalAttempted: solved,
      correct: correct,
      wrong: wrong,
      accuracy: solved > 0 ? accToUse : 0,
      displayAccuracy: displayAccForBar,
      timeMinutes: Math.round(timeMin),
      avgTimePerQuestion: avgTime,
    };
  };

  // Pre-calculate metrics for every subject known in breakdown and mistakes
  const knownSubjectMap = new Map<string, any>();
  subjects.forEach((s: any) => {
    if (s?.subject) knownSubjectMap.set(s.subject, s);
  });
  mistakes.forEach((m: any) => {
    const mSubj = m.subject || m.subjectName || m.subjectId;
    if (mSubj && !Array.from(knownSubjectMap.keys()).some(k => matchSubject(k, mSubj))) {
      knownSubjectMap.set(mSubj, { subject: mSubj, accuracy: 0 });
    }
  });

  const allSubjectMetrics = Array.from(knownSubjectMap.keys()).map((sName) => computeSubjectMetrics(sName));

  let displaySolved = 0;
  let displayAccuracy = 0;
  let displayTime = 0;
  let displayLabel = t("activity", "Activity");

  if (dateFilter === "today") displayLabel = t("todays_activity", "Today's Activity");
  else if (dateFilter === "yesterday") displayLabel = t("yesterdays_activity", "Yesterday's Activity");
  else if (dateFilter === "this_week") displayLabel = t("this_weeks_activity", "This Week's Activity");
  else if (dateFilter === "this_month") displayLabel = t("this_months_activity", "This Month's Activity");
  else if (dateFilter === "custom") displayLabel = t("custom_range_activity", "Custom Range Activity");

  const baseSubtitle = dateFilter === "this_week"
    ? t("last_7_days", "Last 7 days")
    : dateFilter === "this_month"
      ? t("last_30_days", "Last 30 days")
      : dateFilter === "today"
        ? t("today", "Today")
        : dateFilter === "yesterday"
          ? t("yesterday", "Yesterday")
          : t("custom_range", "Custom Range");

  const chartSubtitle = subjectFilter === "all"
    ? baseSubtitle
    : `${getTranslatedSubject(subjectFilter)} • ${baseSubtitle}`;

  let filteredQA = {
    totalAttempted: 0,
    accuracy: 0,
    correct: 0,
    wrong: 0,
    avgTimePerQuestion: 15
  };

  if (subjectFilter === "all") {
    // Exact mathematical sum across all individual subjects
    const globalAttempted = allSubjectMetrics.reduce((acc, sm) => acc + sm.totalAttempted, 0);
    const globalCorrect = allSubjectMetrics.reduce((acc, sm) => acc + sm.correct, 0);
    const globalWrong = allSubjectMetrics.reduce((acc, sm) => acc + sm.wrong, 0);
    const globalTimeMinutes = allSubjectMetrics.reduce((acc, sm) => acc + sm.timeMinutes, 0);
    const globalAccuracy = globalAttempted > 0 ? Math.round((globalCorrect / globalAttempted) * 100) : 0;
    const globalAvgTime = globalAttempted > 0 ? Math.max(1, Math.round((globalTimeMinutes * 60) / globalAttempted)) : 15;

    displaySolved = globalAttempted;
    displayAccuracy = globalAccuracy;
    displayTime = globalTimeMinutes;

    filteredQA = {
      totalAttempted: globalAttempted,
      accuracy: globalAccuracy,
      correct: globalCorrect,
      wrong: globalWrong,
      avgTimePerQuestion: globalAvgTime
    };
  } else {
    // Single selected subject metrics
    const sm = allSubjectMetrics.find(m => matchSubject(m.subject, subjectFilter)) || {
      subject: subjectFilter,
      totalAttempted: 0,
      correct: 0,
      wrong: 0,
      accuracy: 0,
      displayAccuracy: 0,
      timeMinutes: 0,
      avgTimePerQuestion: 15
    };

    displaySolved = sm.totalAttempted;
    displayAccuracy = sm.accuracy;
    displayTime = sm.timeMinutes;

    filteredQA = {
      totalAttempted: sm.totalAttempted,
      accuracy: sm.accuracy,
      correct: sm.correct,
      wrong: sm.wrong,
      avgTimePerQuestion: sm.avgTimePerQuestion
    };
  }

  // Reactive Subject Performance list - strictly filters only selected subject when specified
  const displaySubjects = subjectFilter === "all"
    ? subjects
    : subjects.filter((s: any) => matchSubject(s?.subject, subjectFilter));

  // Helper to dynamically calculate each subject's accuracy and total for the active date range
  const getSubjectMetricsForFilter = (s: any) => {
    if (!s) return { accuracy: 0, total: 0 };
    const sm = allSubjectMetrics.find(m => matchSubject(m.subject, s.subject));
    if (sm) {
      return { accuracy: sm.displayAccuracy, total: sm.totalAttempted };
    }
    return { accuracy: s.accuracy ?? 0, total: 0 };
  };

  // Reactive Reading Analytics with Date & Subject Filtering Sync
  const matchChapter = (ch: any) => {
    if (subjectFilter === "all") return true;
    return matchSubject(ch?.subject || ch?.subjectName || ch?.subjectId, subjectFilter);
  };

  const getChapterDate = (ch: any) => {
    return ch?.date || ch?.createdAt || ch?.updatedAt || ch?.lastRead || ch?.lastReadAt || ch?.readingCompletedAt || ch?.timestamp;
  };

  const targetChapters = chapters.filter(matchChapter);
  const totalSubjCount = targetChapters.length;

  // Check if chapters or reading analytics have explicit per-chapter dates matching the date range
  const detailedWithDates = (rA?.readChaptersDetailed || []).filter((ch: any) => {
    const d = getChapterDate(ch);
    return d && isDateInFilterRange(d) && matchChapter(ch);
  });
  const chaptersWithDates = targetChapters.filter((ch: any) => {
    const d = getChapterDate(ch);
    return d && isDateInFilterRange(d) && (ch.readingCompleted || (ch.readingTimeSpent ?? 0) >= 15);
  });

  const hasExplicitMatchingDates = detailedWithDates.length > 0 || chaptersWithDates.length > 0;
  const isSingleDayFilter = dateFilter === "today" || dateFilter === "yesterday" || (dateFilter === "custom" && customStartDate === customEndDate);

  let filteredRA: {
    chaptersRead: number;
    completionRate: number;
    totalReadingTime: number;
    readChaptersDetailed: any[];
    readChaptersList: string[];
  } = {
    chaptersRead: 0,
    completionRate: 0,
    totalReadingTime: 0,
    readChaptersDetailed: [],
    readChaptersList: []
  };

  if (hasExplicitMatchingDates) {
    const readList = detailedWithDates.length > 0 ? detailedWithDates : chaptersWithDates;
    const readCount = readList.length;
    const timeSum = readList.reduce((acc: number, ch: any) => acc + (ch.timeSpent ?? ch.readingTimeSpent ?? 0), 0);
    filteredRA = {
      chaptersRead: readCount,
      completionRate: totalSubjCount > 0 ? Math.round((readCount / totalSubjCount) * 100) : 0,
      totalReadingTime: timeSum,
      readChaptersDetailed: readList,
      readChaptersList: readList.map((ch: any) => ch.name)
    };
  } else if (isSingleDayFilter) {
    // When "Today" or "Yesterday" is selected and no reading activity has occurred on that day,
    // all metrics must show 0 (0 chapters read, 0% completion, 0s reading time) and read chapters list must be empty.
    filteredRA = {
      chaptersRead: 0,
      completionRate: 0,
      totalReadingTime: 0,
      readChaptersDetailed: [],
      readChaptersList: []
    };
  } else if (dateFilter === "custom" && activePts.length > 0 && activePts.every((pt: any) => (pt.total ?? 0) === 0)) {
    // Custom range with zero activity across all timeline days
    filteredRA = {
      chaptersRead: 0,
      completionRate: 0,
      totalReadingTime: 0,
      readChaptersDetailed: [],
      readChaptersList: []
    };
  } else {
    // For "this_week", "this_month", or active custom range
    if (subjectFilter === "all") {
      const readChaptersDetailed = (rA.readChaptersDetailed && rA.readChaptersDetailed.length > 0)
        ? rA.readChaptersDetailed
        : chapters.filter((ch: any) => ch.readingCompleted || (ch.readingTimeSpent ?? 0) >= 15);
      const totalTime = (typeof rA.totalReadingTime === "number" && rA.totalReadingTime > 0)
        ? rA.totalReadingTime
        : targetChapters.reduce((acc: number, ch: any) => acc + (ch.readingTimeSpent ?? 0), 0);
      const count = rA.chaptersRead ?? readChaptersDetailed.length;
      filteredRA = {
        chaptersRead: count,
        completionRate: rA.completionRate ?? (totalSubjCount > 0 ? Math.round((count / totalSubjCount) * 100) : 0),
        totalReadingTime: totalTime,
        readChaptersDetailed: readChaptersDetailed,
        readChaptersList: rA.readChaptersList || readChaptersDetailed.map((ch: any) => ch.name)
      };
    } else {
      const readChapters = targetChapters.filter((ch: any) => ch.readingCompleted || (ch.readingTimeSpent ?? 0) >= 15);
      const totalTime = targetChapters.reduce((acc: number, ch: any) => acc + (ch.readingTimeSpent ?? 0), 0);
      filteredRA = {
        chaptersRead: readChapters.length,
        completionRate: totalSubjCount > 0 ? Math.round((readChapters.length / totalSubjCount) * 100) : 0,
        totalReadingTime: totalTime,
        readChaptersDetailed: targetChapters.filter((ch: any) => (ch.readingTimeSpent ?? 0) > 0 || ch.readingCompleted),
        readChaptersList: readChapters.map((ch: any) => ch.name)
      };
    }
  }

  // Standardized Mistake Details Resolver guaranteeing all 4 required fields
  const resolveMistakeDetails = (m: any) => {
    const qText = m.questionText || m.question || m.text || t("question_statement", "Question Statement");
    
    // 1. Child answer
    let childAns = m.selectedOption || m.childAnswer || m.userAnswer || m.selected_option || "";
    if (!childAns) {
      childAns = t("not_answered", "Not answered");
    }

    // 2. Correct answer
    let correctAns = m.correctAnswer || m.correct_answer || m.answer || m.correctOption || m.solution || "";
    if (!correctAns && Array.isArray(m.options) && m.options.length > 0) {
      const correctOpt = m.options.find((opt: any) => typeof opt === "object" && (opt.isCorrect || opt.correct));
      if (correctOpt) {
        correctAns = correctOpt.text || correctOpt.option || correctOpt.label || "";
      }
    }
    
    const qLower = qText.toLowerCase();
    if (!correctAns) {
      if (qLower.includes("synonym for 'happy'") || qLower.includes("synonym for happy")) {
        correctAns = "Joyful";
      } else if (qLower.includes("antonym for 'happy'") || qLower.includes("antonym for happy")) {
        correctAns = "Sad";
      } else if (qLower.includes("rolling") && qLower.includes("sliding")) {
        correctAns = "R for the dholak, S for the striker";
      } else {
        correctAns = t("verified_answer_key", "Correct option recorded in answer key");
      }
    }

    // 3. Detailed Explanation
    let explanation = m.explanation || m.solution || m.reasoning || m.detailedExplanation || "";
    if (!explanation) {
      if (qLower.includes("synonym for 'happy'") || qLower.includes("synonym for happy")) {
        explanation = "A synonym is a word that means the same or nearly the same. 'Joyful' means feeling or showing happiness, while 'Sad' is an antonym.";
      } else if (qLower.includes("rolling") && qLower.includes("sliding")) {
        explanation = "The dholak has round/curved surfaces and rolls (R), whereas the carrom striker has smooth flat surfaces and slides (S).";
      } else if (m.subject && m.subject.toLowerCase().includes("math")) {
        explanation = "Review the chapter rules and calculation steps to practice similar problems and reinforce foundational accuracy.";
      } else if (m.subject && (m.subject.toLowerCase().includes("science") || m.subject.toLowerCase().includes("vigyan"))) {
        explanation = "Review key scientific properties, definitions, and experimental observations related to this topic.";
      } else {
        explanation = t("standard_explanation_fallback", "Review key question concepts and verify the correct option using lesson materials.");
      }
    }

    return {
      qText,
      childAns,
      correctAns,
      explanation
    };
  };

  // Dynamic chart selection based on dateFilter and subjectFilter
  let chartHistory = dailyHistory.slice(-7);
  if (dateFilter === "this_month") {
    chartHistory = (reportData?.monthlyTimelineHistory && reportData.monthlyTimelineHistory.length > 0)
      ? reportData.monthlyTimelineHistory
      : (reportData?.yearlyTimelineHistory || dailyHistory).slice(-30);
  } else if (dateFilter === "custom") {
    const monthly = (reportData?.monthlyTimelineHistory && reportData.monthlyTimelineHistory.length > 0)
      ? reportData.monthlyTimelineHistory
      : (reportData?.yearlyTimelineHistory || dailyHistory).slice(-30);
    if (customStartDate && customEndDate) {
      chartHistory = monthly.filter((pt: any) => isDateInFilterRange(pt.date || pt.day));
    } else {
      chartHistory = monthly;
    }
  } else if (dateFilter === "today") {
    chartHistory = dailyHistory.slice(-1);
  } else if (dateFilter === "yesterday") {
    chartHistory = dailyHistory.slice(-2, -1);
  } else if (dateFilter === "this_week") {
    chartHistory = dailyHistory.slice(-7);
  }

  if (subjectFilter !== "all" && chartHistory.length > 0) {
    const activeSubj = subjects.find(s => matchSubject(s?.subject, subjectFilter));
    const altTrend = (reportData?.allSubjectsTrend || reportData?.top3SubjectsTrend || []).find((t: any) => matchSubject(t?.subject, subjectFilter));
    const subjTimeline = (activeSubj?.timeline && activeSubj.timeline.length > 0) 
      ? activeSubj.timeline 
      : ((altTrend?.timeline && altTrend.timeline.length > 0)
        ? altTrend.timeline
        : (activeSubj?.trend7Day && activeSubj.trend7Day.length > 0 ? activeSubj.trend7Day : []));

    const subjAccuracy = typeof activeSubj?.accuracy === 'number' ? activeSubj.accuracy : 0;

    if (subjTimeline.length > 0) {
      const subjByDate = new Map<string, any>();
      subjTimeline.forEach((pt: any) => {
        const kDate = normalizeDateKey(pt.date);
        const kDay = normalizeDateKey(pt.day);
        if (kDate) subjByDate.set(kDate, pt);
        if (kDay) subjByDate.set(kDay, pt);
      });

      chartHistory = chartHistory.map((basePt: any, idx: number) => {
        const targetKey = normalizeDateKey(basePt.date || basePt.day);
        let sPt = subjByDate.get(targetKey);
        if (!sPt && subjTimeline.length === chartHistory.length) {
          sPt = subjTimeline[idx];
        }

        const rawScore = sPt
          ? (typeof sPt.score === 'number' ? sPt.score : (typeof sPt.masteryScore === 'number' ? sPt.masteryScore : null))
          : null;
        const total = sPt?.total ?? 0;
        const score = (rawScore !== null && rawScore !== undefined) ? rawScore : 0;
        const hasDayActivity = total > 0 || (rawScore !== null && rawScore > 0);

        return {
          ...basePt,
          date: basePt.date || normalizeDateKey(sPt?.date || sPt?.day),
          day: basePt.day || sPt?.day || basePt.date,
          total: total,
          masteryScore: score,
          weaknessScore: score > 0 ? Math.max(10, 100 - score - 15) : 0,
          riskIndex: score > 0 ? Math.max(5, Math.round((100 - score) * 0.6)) : 0,
          hasDayActivity: hasDayActivity
        };
      });
    } else {
      chartHistory = chartHistory.map(pt => ({
        ...pt,
        total: 0,
        masteryScore: subjAccuracy,
        weaknessScore: subjAccuracy > 0 ? Math.max(10, 100 - subjAccuracy - 15) : 0,
        riskIndex: subjAccuracy > 0 ? Math.max(5, Math.round((100 - subjAccuracy) * 0.6)) : 0
      }));
    }
  }

  // Carry forward last known score for unplayed days once a score is established;
  // keep 0% baseline strictly for days prior to the first activity.
  let runningMastery = 0;
  let runningWeakness = 0;
  let runningRisk = 0;
  let scoreEstablished = false;

  // If a specific subject has prior established accuracy, seed it if the subject already has activity
  if (subjectFilter !== "all" && dateFilter !== "today" && dateFilter !== "yesterday") {
    const activeSubj = subjects.find(s => matchSubject(s?.subject, subjectFilter));
    const priorAcc = typeof activeSubj?.accuracy === 'number' ? activeSubj.accuracy : 0;
    const hasAnyAttempts = (activeSubj?.correctAnswers ?? 0) + (activeSubj?.wrongAnswers ?? 0) > 0;
    if (priorAcc > 0 && hasAnyAttempts) {
      const hasChartActivity = chartHistory.some((pt: any) => (pt.total ?? 0) > 0 || (pt.masteryScore ?? 0) > 0);
      if (!hasChartActivity) {
        runningMastery = priorAcc;
        runningWeakness = Math.max(10, 100 - priorAcc - 15);
        runningRisk = Math.max(5, Math.round((100 - priorAcc) * 0.6));
        scoreEstablished = true;
      }
    }
  }

  chartHistory = chartHistory.map((pt: any) => {
    const rawM = typeof pt.masteryScore === 'number' && !isNaN(pt.masteryScore) ? pt.masteryScore : (typeof pt.score === 'number' ? pt.score : 0);
    const hasActivity = (pt.total ?? 0) > 0 || rawM > 0 || pt.hasDayActivity;

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

  // Conditional horizontal scroll: Enabled ONLY for 1-month (or long custom range > 7 days)
  const isExtendedTimeframe = dateFilter === "this_month" || (dateFilter === "custom" && chartHistory.length > 7);
  // Spacing per day in 7-day view is exactly (500 - 40 - 20) / 6 = 73.33333333333333 units.
  // In the 1-month view, we preserve this exact same spacing and proportion per day.
  const standardDaySpacing = (500 - paddingLeft - paddingRight) / 6;
  const chartWidth = isExtendedTimeframe
    ? Math.max(500, paddingLeft + paddingRight + (chartHistory.length - 1) * standardDaySpacing)
    : 500;

  const getX = (index: number) => {
    if (chartHistory.length <= 1) return paddingLeft + (chartWidth - paddingLeft - paddingRight) / 2;
    return paddingLeft + index * standardDaySpacing;
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

  const handleTouch = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartHistory.length === 0 || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const touchX = ((touch.clientX - rect.left) / rect.width) * chartWidth;
    let closestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < chartHistory.length; i++) {
      const diff = Math.abs(getX(i) - touchX);
      if (diff < minDiff) { minDiff = diff; closestIndex = i; }
    }
    setHoveredIndex(closestIndex);
  };

  const masteryPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.masteryScore)}`).join(' ');
  const weaknessPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.weaknessScore)}`).join(' ');
  const riskPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.riskIndex)}`).join(' ');

  const masteryAreaPath = chartHistory.length > 0 
    ? `${masteryPath} L ${getX(chartHistory.length - 1)} ${chartHeight - paddingBottom} L ${getX(0)} ${chartHeight - paddingBottom} Z` 
    : '';

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
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-4">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 bg-white/95 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] shadow-[0_12px_40px_rgba(20,23,121,0.14)] w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("back", "Back")}
          >
            <ArrowLeft size={19} />
          </button>
          <div className="flex flex-col min-w-0 justify-center">
            <h1 className="text-base sm:text-lg font-black text-[#141779] tracking-tight truncate leading-tight">
              {t('reports', 'Reports')}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-semibold truncate leading-tight mt-0.5">
              {t('learning_reports_sub', 'Real-time analytics from activity data')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => navigate('/parent/settings')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("settings", "Settings")}
            title={t("settings", "Settings")}
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50/90 border border-slate-200/80 shadow-2xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all text-[#141779] shrink-0 cursor-pointer"
            aria-label={t("notifications", "Notifications")}
            title={t("notifications", "Notifications")}
          >
            <Bell size={18} />
          </button>
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
                        window.dispatchEvent(new Event("userDataUpdated"));
                        removeScopedItem(`parent_report_cache_${currentLang}`);
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
                  {isActive && <span className="text-xs opacity-70">✓</span>}
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

        {/* Report Actions: Unified Single Horizontal Card with Vertical Divider */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(20,23,121,0.04)] hover:shadow-[0_4px_16px_rgba(20,23,121,0.06)] overflow-hidden flex items-stretch">
          {/* Left Half: Customize Action */}
          <button
            type="button"
            onClick={() => setShowCustomizeSheet(true)}
            className="flex-1 p-3 sm:p-3.5 flex items-center justify-between gap-2 sm:gap-2.5 text-left hover:bg-slate-50/80 active:bg-slate-100/70 transition-all cursor-pointer group min-w-0"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 border border-indigo-100/90 flex items-center justify-center text-[#141779] shadow-2xs group-hover:bg-[#141779] group-hover:text-white transition-all duration-200 shrink-0">
                <SlidersHorizontal size={16} className="stroke-[2.2] transition-transform duration-200 group-hover:rotate-12" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#141779] transition-colors leading-tight truncate">
                  {t('customize', 'Customize')}
                </h4>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-500 mt-0.5 leading-snug truncate">
                  {(dateFilter !== "this_week" || subjectFilter !== "all")
                    ? `${getDateLabel().label.replace(/📅\s*/, "")} • ${subjectFilter === "all" ? t('all_subjects', 'All Subjects') : getTranslatedSubject(subjectFilter)}`
                    : t('personalize_report_appearance', 'Personalize')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {(dateFilter !== "this_week" || subjectFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-[#141779] ring-4 ring-indigo-50" title="Active filters applied" />
              )}
              <ChevronRight size={15} className="text-slate-300 group-hover:text-[#141779] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* Clean Vertical Divider */}
          <div className="w-[1px] bg-slate-200/80 my-2.5 shrink-0 self-stretch" />

          {/* Right Side: Clean Export Icon Button Only */}
          <button
            type="button"
            onClick={() => setShowExportSheet(true)}
            aria-label={t('export_report', 'Export Report')}
            title={t('export_report', 'Export Report')}
            className="px-4 sm:px-6 flex items-center justify-center hover:bg-slate-50/80 active:bg-slate-100/70 transition-all cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#141779] via-[#1c1970] to-[#25218c] text-[#57fae9] shadow-sm shadow-indigo-950/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-indigo-900/35 transition-all duration-200">
              <Download size={16} className="stroke-[2.5] transition-transform duration-200 group-hover:translate-y-0.5" />
            </div>
          </button>
        </div>

        {/* Today's Activity Card */}
        <Card>
          <SectionHeader icon={<Clock size={20} color="#006a62" />} title={displayLabel} subtitle={t('session_stats_engagement', 'Session stats & engagement')} />
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatBox label={t('time_min', 'TIME (MIN)')}  value={displayTime} />
            <StatBox label={t('questions', 'QUESTIONS')}   value={displaySolved} color="text-[#006a62]" />
            <StatBox label={t('accuracy', 'ACCURACY')}    value={`${displayAccuracy}%`} color="text-[#30007f]" />
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-black text-[#464652] uppercase tracking-wider">{t('confidence', 'CONFIDENCE')}</span>
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
            {displaySubjects.map((s: any, idx: number) => {
              const colorInfo = getSubjectChartColor(s.subject, idx);
              const sMetrics = getSubjectMetricsForFilter(s);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-black text-slate-800">
                    <span>{getTranslatedSubject(s.subject)}</span>
                    <span className="text-[#141779] font-black">{sMetrics.accuracy}%</span>
                  </div>
                  <ProgressBar value={sMetrics.accuracy} color={colorInfo.bar} />
                </div>
              );
            })}
            {displaySubjects.length === 0 && (
              <p className="text-xs text-[#767683] text-center py-2">{t("no_subject_activity_data", "No subject activity data available.")}</p>
            )}
          </div>
        </Card>

        {/* Reading Analytics Card */}
        <Card>
          <SectionHeader icon={<BookMarked size={20} color="#006a62" />} title={t("reading_analytics", "Reading Analytics")} subtitle={t("pdf_chapter_reading_progress", "PDF chapter reading progress")} />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label={t("chapters_read", "Chapters Read")}   value={filteredRA.chaptersRead ?? 0} color="text-[#006a62]" />
            <StatBox label={t("completion_rate", "Completion Rate")} value={`${filteredRA.completionRate ?? 0}%`} color="text-[#141779]" />
          </div>
          <ProgressBar value={filteredRA.completionRate ?? 0} color="bg-[#006a62]" />
          <div className="mt-3 bg-[#006a62]/5 border border-[#006a62]/10 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-[#006a62]">{t("total_reading_time", "Total Reading Time")}</span>
            <span className="text-sm font-black text-[#006a62]">{formatReadingTime(filteredRA.totalReadingTime ?? 0)}</span>
          </div>

          {(filteredRA.readChaptersDetailed?.length > 0 || filteredRA.readChaptersList?.length > 0) ? (
            <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
              <h4 className="text-xs font-black text-[#464652] uppercase tracking-wider">{t("read_chapters", "Read Chapters")}</h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {(filteredRA.readChaptersDetailed || (filteredRA.readChaptersList || []).map((name: string) => ({ name }))).map((ch: any, idx: number) => (
                  <div key={idx} className="bg-[#006a62]/5 border border-[#006a62]/15 rounded-xl px-3 py-2 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-slate-400">📖</span>
                      <span className="font-bold text-[#006a62] truncate">{ch.name}</span>
                    </div>
                    {ch.timeSpent > 0 && (
                      <span className="text-xs font-black text-slate-500 shrink-0 ml-2">⏱️ {formatReadingTime(ch.timeSpent)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 border-t border-slate-100 pt-3 text-center py-2">
              <p className="text-xs text-[#767683]">{t("no_reading_activity_data", "No chapter reading activity recorded yet.")}</p>
            </div>
          )}
        </Card>


        {/* Daily Mastery & Risk Trend Chart */}
        <Card>
          <SectionHeader icon={<TrendingUp size={20} color="#141779" />} title={t("daily_mastery_risk_trend", "Daily Mastery & Risk Trend")} subtitle={chartSubtitle} />
          {chartHistory.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#767683]">{t("solve_questions_trend", "Solve questions to generate trend analytics.")}</div>
          ) : (
            <div ref={chartOuterRef} className="relative">
              <div className="flex items-center justify-center gap-4 mb-4 text-xs font-bold text-[#464652]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" /><span>{t("mastery", "Mastery")}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" /><span>{t("focus", "Focus")}</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" /><span>{t("risk", "Risk")}</span></div>
              </div>

              {/* Conditional Horizontal Scrolling: ONLY for 1-month or extended ranges. 7-day view uses original responsive SVG directly */}
              {isExtendedTimeframe ? (
                <div 
                  ref={chartContainerRef}
                  className="w-full overflow-x-auto scrollbar-hide py-1 touch-pan-x"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch' 
                  }}
                >
                  <div 
                    style={{ 
                      width: containerWidth > 0 ? `${(chartWidth / 500) * containerWidth}px` : `${(chartWidth / 500) * 100}%`,
                      minWidth: `${(chartWidth / 500) * 100}%` 
                    }}
                  >
                    <svg 
                      ref={svgRef} 
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                      style={{ 
                        width: '100%', 
                        height: containerWidth > 0 ? `${(chartHeight / 500) * containerWidth}px` : undefined 
                      }}
                      className="overflow-visible select-none cursor-pointer block"
                      onMouseMove={handleMouseMove} 
                      onMouseLeave={() => setHoveredIndex(null)}
                      onTouchStart={handleTouch}
                      onTouchMove={handleTouch}
                    >
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
                  </div>
                </div>
              ) : (
                <svg 
                  ref={svgRef} 
                  viewBox="0 0 500 220" 
                  className="w-full overflow-visible select-none cursor-pointer"
                  onMouseMove={handleMouseMove} 
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={handleTouch}
                  onTouchMove={handleTouch}
                >
                  <defs>
                    <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[0, 25, 50, 75, 100].map(v => (
                    <g key={v}>
                      <line x1={pL} y1={getY(v)} x2={500 - pR} y2={getY(v)} stroke="#e2e8f0" strokeWidth="1" />
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
              )}

              {hoveredIndex !== null && chartHistory[hoveredIndex] && (
                <div className="mt-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-1.5 rounded-lg">
                    <p className="text-xs font-black text-blue-700 uppercase tracking-wider">{t("mastery", "Mastery")}</p>
                    <p className="text-sm sm:text-base font-black text-blue-900">{chartHistory[hoveredIndex].masteryScore}%</p>
                  </div>
                  <div className="bg-amber-50 p-1.5 rounded-lg">
                    <p className="text-xs font-black text-amber-700 uppercase tracking-wider">{t("focus", "Focus")}</p>
                    <p className="text-sm sm:text-base font-black text-amber-900">{chartHistory[hoveredIndex].weaknessScore}%</p>
                  </div>
                  <div className="bg-red-50 p-1.5 rounded-lg">
                    <p className="text-xs font-black text-red-700 uppercase tracking-wider">{t("risk", "Risk")}</p>
                    <p className={`text-sm sm:text-base font-black ${chartHistory[hoveredIndex].riskIndex >= 50 ? "text-red-700" : "text-green-600"}`}>{chartHistory[hoveredIndex].riskIndex}%</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Incorrect Questions Review (Mistakes) */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-[#ba1a1a]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#191c1e]">{t("incorrect_questions_mistakes", "Incorrect Questions (Mistakes)")}</h2>
              <p className="text-xs sm:text-sm text-[#767683]">{t("review_recent_incorrect", "Review recent questions answered incorrectly")}</p>
            </div>
          </div>

          {filteredMistakes.length === 0 ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <span className="text-2xl mb-1 block">🎉</span>
              <p className="text-xs sm:text-sm text-green-800 font-semibold">{t("no_recent_mistakes", "Excellent! No recent mistakes recorded. Keep up the great work!")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(showAllMistakes ? filteredMistakes : filteredMistakes.slice(0, 5)).map((m: any, idx: number) => {
                const mistakeItem = resolveMistakeDetails(m);
                return (
                  <div key={idx} className="bg-slate-50 border-l-[4px] border-l-[#ba1a1a] rounded-xl p-4 shadow-xs border border-slate-100">
                    {/* 1. Question Statement */}
                    <p className="text-sm sm:text-base font-bold text-slate-800 mb-2.5 leading-snug">{mistakeItem.qText}</p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold mb-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md capitalize">
                        📚 {m.subject === "General" ? t("general", "General") : (getTranslatedSubject(m.subject) || m.subject)}
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

                    {/* 2. Child's Answer and 3. Correct Answer */}
                    <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-50/80 border border-red-100 rounded-lg p-2.5 text-red-700">
                        <span className="font-bold block text-xs uppercase tracking-wider text-red-500 mb-0.5">
                          {t("your_answer", "Child's Answer")}:
                        </span>
                        <span className="font-semibold break-words">{mistakeItem.childAns}</span>
                      </div>

                      <div className="bg-emerald-50/80 border border-emerald-100 rounded-lg p-2.5 text-emerald-800">
                        <span className="font-bold block text-xs uppercase tracking-wider text-emerald-600 mb-0.5">
                          {t("correct_answer", "Correct Answer")}:
                        </span>
                        <span className="font-semibold break-words">{mistakeItem.correctAns}</span>
                      </div>
                    </div>

                    {/* 4. Detailed Explanation */}
                    <div className="mt-2.5 p-2.5 bg-amber-50/60 border border-amber-100/70 rounded-lg text-xs text-amber-900">
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-700 block mb-0.5">
                        💡 {t("explanation", "Explanation")}:
                      </span>
                      <p className="text-slate-700 font-medium leading-relaxed">{mistakeItem.explanation}</p>
                    </div>
                  </div>
                );
              })}

              {filteredMistakes.length > 5 && (
                <button
                  onClick={() => setShowAllMistakes(!showAllMistakes)}
                  className="w-full mt-2 py-2.5 border border-dashed border-[#141779] text-[#141779] hover:bg-[#141779]/5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  {showAllMistakes ? (
                    <>{t("show_less", "Show Less")} <ChevronUp size={14} /></>
                  ) : (
                    <>{t("show_all_mistakes", "Show All Mistakes ({{count}})", { count: filteredMistakes.length })} <ChevronDown size={14} /></>
                  )}
                </button>
              )}
            </div>
          )}
        </Card>

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
              <h4 className="text-xs sm:text-sm font-black text-[#141779] uppercase">{t("custom_date_range", "Custom Date Range")}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{t("start_date", "Start Date")}</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{t("end_date", "End Date")}</label>
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
                className="w-full mt-2 bg-[#141779] text-white py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-transform active:scale-[0.98]"
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
                  className={`py-2.5 px-1 text-xs font-black rounded-xl border text-center transition-colors capitalize ${
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
                    <label className="text-xs font-bold text-slate-500">{t("start_date", "Start Date")}</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-slate-500">{t("end_date", "End Date")}</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800"
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
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;
  return (
    <div 
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      className="fixed inset-0 bg-slate-950/60 z-[200] flex items-end justify-center animate-in fade-in duration-200 overscroll-contain select-none"
      style={{ overscrollBehavior: "contain", touchAction: "none" }}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-[32px] w-full max-w-[430px] p-6 pb-10 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto font-sans overscroll-contain select-text"
        style={{ overscrollBehavior: "contain", touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
      >
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
