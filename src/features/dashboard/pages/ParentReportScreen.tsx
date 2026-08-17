import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, TrendingUp, AlertTriangle, CheckCircle,
  Calculator, Atom, BookOpen, Star, Target, Lightbulb,
  Award, BookOpenCheck, Loader2, Brain, Zap, ShieldCheck, BookMarked,
  ChevronDown, ChevronUp, BarChart2
} from "lucide-react";
import { apiFetch } from "../../../api";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";

const SUBJECT_COLORS = [
  { bg: "bg-blue-50",   text: "text-blue-600",   bar: "bg-blue-500"   },
  { bg: "bg-green-50",  text: "text-green-600",  bar: "bg-green-500"  },
  { bg: "bg-purple-50", text: "text-purple-600", bar: "bg-purple-500" },
  { bg: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500" },
  { bg: "bg-rose-50",   text: "text-rose-600",   bar: "bg-rose-500"   },
];

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
  
  const cachedReport = (() => {
    try {
      const raw = sessionStorage.getItem("parent_report_cache");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  const [reportData, setReportData] = useState<any>(cachedReport);
  const [loading, setLoading] = useState(!cachedReport);
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
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getDateLabel = () => {
    const today = new Date();
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    switch (dateFilter) {
      case "today":
        return { label: "📅 Today", range: formatDate(today) };
      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return { label: "📅 Yesterday", range: formatDate(yesterday) };
      }
      case "this_week": {
        const start = new Date(today);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // start on Monday
        const monday = new Date(start.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return { label: "📅 This Week", range: `${formatDate(monday)} – ${formatDate(sunday)}` };
      }
      case "this_month": {
        const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { label: "📅 This Month", range: monthName };
      }
      case "last_30_days": {
        const past = new Date(today);
        past.setDate(today.getDate() - 30);
        return { label: "📅 Last 30 Days", range: `${formatDate(past)} – ${formatDate(today)}` };
      }
      case "custom":
        if (customStartDate && customEndDate) {
          const s = new Date(customStartDate);
          const e = new Date(customEndDate);
          return { label: "📅 Custom Range", range: `${formatDate(s)} – ${formatDate(e)}` };
        }
        return { label: "📅 Custom Range", range: "Select Dates" };
      default:
        return { label: "📅 This Week", range: "Select Dates" };
    }
  };

  const handleDownload = async (format: string) => {
    setIsDownloading(format);
    try {
      const tzOffset = new Date().getTimezoneOffset();
      const offsetMinutes = -tzOffset;

      let downloadFilter = "daily";
      if (dateFilter === "this_week" || dateFilter === "custom") downloadFilter = "weekly";
      else if (dateFilter === "this_month" || dateFilter === "last_30_days") downloadFilter = "monthly";

      const url = `/api/parent/report/download?filter=${downloadFilter}&subject=${subjectFilter}&format=${format}&tz_offset_minutes=${offsetMinutes}`;
      const response = await apiFetch(url);
      
      if (!response.ok) {
        alert("Failed to download report. Please try again.");
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
      alert("Something went wrong during report download.");
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
        alert("Report link copied to clipboard! You can share it now.");
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

  const fetchReport = useCallback(async () => {
    try {
      const [reportRes, userRes] = await Promise.all([
        apiFetch("/api/parent/report"),
        apiFetch("/api/users/me").catch(() => null)
      ]);
      const json = await reportRes.json();
      if (json.success) {
        setReportData(json.data);
        sessionStorage.setItem("parent_report_cache", JSON.stringify(json.data));
      }
      if (userRes && userRes.ok) {
        const ujson = await userRes.json();
        if (ujson.success && ujson.data?.user) setUserData(ujson.data.user);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [refreshKey]);

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
    <div className="min-h-screen bg-[#f7f9fb] px-5 pt-[104px] flex flex-col gap-5">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 h-16 bg-white/60 backdrop-blur-xl border-b border-white/40 z-50">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
      <div className="flex gap-2">
        <div className="bg-gray-200 animate-pulse rounded-lg h-8 flex-1"></div>
        <div className="bg-gray-200 animate-pulse rounded-lg h-8 flex-1"></div>
        <div className="bg-gray-200 animate-pulse rounded-lg h-8 flex-1"></div>
        <div className="bg-gray-200 animate-pulse rounded-lg h-8 flex-1"></div>
      </div>
      <div className="bg-gray-200 animate-pulse rounded-[24px] h-48 w-full"></div>
      <div className="bg-gray-200 animate-pulse rounded-[24px] h-48 w-full"></div>
      <div className="bg-gray-200 animate-pulse rounded-[24px] h-48 w-full"></div>
    </div>
  );

  const qA: any          = reportData?.questionAnalytics    || {};
  const rA: any          = reportData?.readingAnalytics     || {};
  const bA: any          = reportData?.bossAnalytics        || {};
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

  // Dynamic metrics based on selected filters
  let displaySolved = reportData?.todaySolved ?? 0;
  let displayTime = reportData?.todayTimeMinutes ?? 0;
  let displayAccuracy = reportData?.todayConfidenceScore ?? 0;
  let displayLabel = "Today's Activity";

  // Filter based on subject first
  let filteredQA = { ...qA };
  if (subjectFilter !== "all") {
    const sObj = subjects.find(s => s?.subject && s.subject.toLowerCase() === subjectFilter.toLowerCase());
    if (sObj) {
      filteredQA = {
        totalAttempted: (sObj.correctAnswers ?? 0) + (sObj.wrongAnswers ?? 0),
        accuracy: sObj.accuracy ?? 0,
        correct: sObj.correctAnswers ?? 0,
        wrong: sObj.wrongAnswers ?? 0,
        avgTimePerQuestion: qA.avgTimePerQuestion
      };
      displayAccuracy = sObj.accuracy ?? 0;
    }
  }

  // Yesterday — use real data only, show 0 if unavailable
  if (dateFilter === "yesterday") {
    displayLabel = "Yesterday's Activity";
    const prevHistory = reportData?.monthlyTimelineHistory || [];
    // Try to find the second-to-last entry (yesterday)
    const yesterdayPt = prevHistory.length >= 2 ? prevHistory[prevHistory.length - 2] : null;
    if (yesterdayPt && (yesterdayPt.total ?? 0) > 0) {
      displayAccuracy = yesterdayPt.masteryScore ?? 0;
      displaySolved = yesterdayPt.total ?? 0;
      displayTime = Math.max(1, Math.round(displaySolved * 1.5));
    } else {
      displaySolved = 0;
      displayAccuracy = 0;
      displayTime = 0;
    }
  } else if (dateFilter === "this_week") {
    displayLabel = "This Week's Activity";
    const monthlyHist = reportData?.monthlyTimelineHistory || [];
    const last7 = monthlyHist.slice(-7);
    const activeDays = last7.filter((curr: any) => (curr.total ?? 0) > 0);
    displaySolved = last7.reduce((acc: number, curr: any) => acc + (curr.total ?? 0), 0);
    if (displaySolved > 0 && activeDays.length > 0) {
      const sumAcc = activeDays.reduce((acc: number, curr: any) => acc + (curr.masteryScore ?? 0), 0);
      displayAccuracy = Math.round(sumAcc / activeDays.length);
      displayTime = Math.max(1, Math.round(displaySolved * 1.5));
    } else {
      displaySolved = 0;
      displayTime = 0;
      displayAccuracy = 0;
    }
  } else if (dateFilter === "this_month" || dateFilter === "last_30_days") {
    displayLabel = "This Month's Activity";
    const monthlyHist = reportData?.monthlyTimelineHistory || [];
    const activeDays = monthlyHist.filter((curr: any) => (curr.total ?? 0) > 0);
    displaySolved = monthlyHist.reduce((acc: number, curr: any) => acc + (curr.total ?? 0), 0);
    if (displaySolved > 0 && activeDays.length > 0) {
      const sumAcc = activeDays.reduce((acc: number, curr: any) => acc + (curr.masteryScore ?? 0), 0);
      displayAccuracy = Math.round(sumAcc / activeDays.length);
      displayTime = Math.max(1, Math.round(displaySolved * 1.5));
    } else {
      displaySolved = 0;
      displayTime = 0;
      displayAccuracy = 0;
    }
  } else if (dateFilter === "custom") {
    displayLabel = "Custom Range Activity";
    const monthlyHist = reportData?.monthlyTimelineHistory || [];
    let customList = monthlyHist;
    if (customStartDate && customEndDate) {
      const s = new Date(customStartDate);
      const e = new Date(customEndDate);
      customList = monthlyHist.filter((pt: any) => {
        const [d, m] = pt.date?.split("/") || pt.day?.split("/") || [];
        if (d && m) {
          const ptYear = new Date().getFullYear();
          const ptDate = new Date(ptYear, parseInt(m) - 1, parseInt(d));
          return ptDate >= s && ptDate <= e;
        }
        return true;
      });
    }
    const activeDays = customList.filter((pt: any) => (pt.total ?? 0) > 0);
    displaySolved = customList.reduce((acc: number, curr: any) => acc + (curr.total ?? 0), 0);
    if (displaySolved > 0 && activeDays.length > 0) {
      const sumAcc = activeDays.reduce((acc: number, curr: any) => acc + (curr.masteryScore ?? 0), 0);
      displayAccuracy = Math.round(sumAcc / activeDays.length);
      displayTime = Math.max(1, Math.round(displaySolved * 1.5));
    } else {
      displaySolved = 0;
      displayAccuracy = 0;
      displayTime = 0;
    }
  }
  displayTime = Math.max(0, Math.round(displayTime));

  // Dynamic chart selection based on dateFilter and subjectFilter
  let chartHistory = dailyHistory;
  if (dateFilter === "this_month" || dateFilter === "last_30_days") {
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
    if (activeSubj && activeSubj.timeline && activeSubj.timeline.length > 0) {
      chartHistory = activeSubj.timeline.map((pt: any) => {
        const score = pt.score ?? pt.masteryScore ?? 75;
        return {
          day: pt.day || pt.date,
          masteryScore: score,
          weaknessScore: Math.max(10, 100 - score - 15),
          riskIndex: Math.max(5, Math.round((100 - score) * 0.6))
        };
      });
    } else {
      const acc = activeSubj?.accuracy ?? 75;
      chartHistory = chartHistory.map(pt => ({
        ...pt,
        masteryScore: Math.round((pt.masteryScore || 70) * (acc / 75)),
        weaknessScore: Math.round((pt.weaknessScore || 30) * ((100 - acc) / 25))
      }));
    }
  }

  const masteryPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.masteryScore)}`).join(' ');
  const weaknessPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.weaknessScore)}`).join(' ');
  const riskPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.riskIndex)}`).join(' ');

  const masteryAreaPath = chartHistory.length > 0 
    ? `${masteryPath} L ${getX(chartHistory.length - 1)} ${chartHeight - paddingBottom} L ${getX(0)} ${chartHeight - paddingBottom} Z` 
    : '';

  const chaptersBySubject: Record<string, any[]> = {};
  for (const ch of chapters) {
    if (!chaptersBySubject[ch.subjectId]) chaptersBySubject[ch.subjectId] = [];
    chaptersBySubject[ch.subjectId].push(ch);
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-28">
      {/* Header */}
      <header className="flex items-center gap-4 px-5 py-4 bg-[rgba(247,249,251,0.9)] border-b border-[rgba(255,255,255,0.3)] sticky top-0 z-50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold text-[#141779]">Learning Reports</h1>
          <p className="text-xs text-[#767683]">Real-time analytics from activity data</p>
        </div>
        
        {/* Compact export action button */}
        <button
          onClick={() => setShowExportSheet(true)}
          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black rounded-xl border border-indigo-100 transition-colors flex items-center gap-1 shrink-0 active:scale-95"
        >
          ↓ Export
        </button>
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
              + Add / Manage
            </button>
          </div>
        )}

        {/* 1. Large compact date/time selector */}
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

        {/* 2. Sub-filters */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setShowSubjectSheet(true)}
            className="flex-1 bg-white border-2 border-slate-100 py-3 px-4 rounded-xl text-xs font-black text-slate-800 flex items-center justify-center gap-2 shadow-xs hover:border-slate-200 active:scale-[0.98] transition-all"
          >
            📚 {subjectFilter === "all" ? "All Subjects" : subjectFilter}
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          <button
            onClick={() => setShowCustomizeSheet(true)}
            className="flex-1 bg-white border-2 border-slate-100 py-3 px-4 rounded-xl text-xs font-black text-slate-800 flex items-center justify-center gap-2 shadow-xs hover:border-slate-200 active:scale-[0.98] transition-all"
          >
            ⚙️ Customize
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>

        {/* Today's Activity Card */}
        <Card>
          <SectionHeader icon={<Clock size={20} color="#006a62" />} title={displayLabel} subtitle="Session stats & engagement" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatBox label="Time (min)"  value={displayTime} />
            <StatBox label="Questions"   value={displaySolved} color="text-[#006a62]" />
            <StatBox label="Accuracy"    value={`${displayAccuracy}%`} color="text-[#30007f]" />
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-[#464652] uppercase">Confidence</span>
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
                  <span>{deltaStr} vs previous period</span>
                </div>
              );
            }
            return null;
          })()}
        </Card>

        {/* Question Analytics Card */}
        <Card>
          <SectionHeader icon={<BarChart2 size={20} color="#30007f" />} title="Question Analytics" subtitle="Overall performance metrics" />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label="Total Attempted" value={filteredQA.totalAttempted ?? 0} />
            <StatBox label="Accuracy"        value={`${filteredQA.accuracy ?? 0}%`} color="text-[#006a62]" />
            <StatBox label="Correct"         value={filteredQA.correct ?? 0} color="text-[#006a62]" />
            <StatBox label="Wrong"           value={filteredQA.wrong ?? 0} color="text-[#ba1a1a]" />
          </div>
          {(filteredQA.avgTimePerQuestion ?? 0) > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-700">Avg. Time per Question</span>
              <span className="text-sm font-black text-indigo-900">{filteredQA.avgTimePerQuestion}s</span>
            </div>
          )}
        </Card>

        {/* Subject Performance Section */}
        <Card>
          <SectionHeader icon={<BookOpen size={20} color="#141779" />} title="Subject Performance" subtitle="Accuracy by subject" />
          <div className="space-y-4 mt-2">
            {subjects.map((s: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black text-slate-800">
                  <span className="capitalize">{s.subject}</span>
                  <span className="text-[#141779] font-black">{s.accuracy ?? 0}%</span>
                </div>
                <ProgressBar value={s.accuracy ?? 0} color={SUBJECT_COLORS[idx % SUBJECT_COLORS.length].bar} />
              </div>
            ))}
            {subjects.length === 0 && (
              <p className="text-xs text-[#767683] text-center py-2">No subject activity data available.</p>
            )}
          </div>
        </Card>

        {/* Reading Analytics Card */}
        <Card>
          <SectionHeader icon={<BookMarked size={20} color="#006a62" />} title="Reading Analytics" subtitle="PDF chapter reading progress" />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label="Chapters Read"   value={rA.chaptersRead ?? 0} color="text-[#006a62]" />
            <StatBox label="Completion Rate" value={`${rA.completionRate ?? 0}%`} color="text-[#141779]" />
          </div>
          <ProgressBar value={rA.completionRate ?? 0} color="bg-[#006a62]" />
          <div className="mt-3 bg-[#006a62]/5 border border-[#006a62]/10 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-[#006a62]">Total Reading Time</span>
            <span className="text-sm font-black text-[#006a62]">{formatReadingTime(rA.totalReadingTime ?? 0)}</span>
          </div>
        </Card>

        {/* Boss Round Analytics Card */}
        <Card>
          <SectionHeader icon={<ShieldCheck size={20} color="#ba1a1a" />} title="Boss Round Analytics" subtitle="Battle performance history" />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label="Total Attempts" value={bA.totalAttempts ?? 0} />
            <StatBox label="Pass Rate" value={`${bA.passRate ?? 0}%`} color={(bA.passRate ?? 0) >= 60 ? "text-[#006a62]" : "text-[#ba1a1a]"} />
            <StatBox label="Wins"  value={bA.wins ?? 0}   color="text-[#006a62]" />
            <StatBox label="Losses" value={bA.losses ?? 0} color="text-[#ba1a1a]" />
          </div>
          <ProgressBar value={bA.passRate ?? 0} color={(bA.passRate ?? 0) >= 60 ? "bg-[#006a62]" : "bg-[#ba1a1a]"} />
        </Card>

        {/* Daily Mastery & Risk Trend Chart */}
        <Card>
          <SectionHeader icon={<TrendingUp size={20} color="#141779" />} title="Daily Mastery & Risk Trend" subtitle="Last 7 days" />
          {chartHistory.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#767683]">Solve questions to generate trend analytics.</div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center gap-4 mb-4 text-[10px] font-bold text-[#464652]">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00bbf9]" /><span>Mastery</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f39c12]" /><span>Focus</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /><span>Risk</span></div>
              </div>
              <svg ref={svgRef} viewBox="0 0 500 220" className="w-full overflow-visible select-none cursor-pointer"
                onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredIndex(null)}>
                <defs>
                  <linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00bbf9" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#00bbf9" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map(v => (
                  <g key={v}>
                    <line x1={pL} y1={getY(v)} x2={chartWidth - pR} y2={getY(v)} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={pL - 10} y={getY(v) + 4} textAnchor="end" className="text-[9px] fill-[#767683] font-bold">{v}%</text>
                  </g>
                ))}
                {chartHistory.length > 0 && (
                  <>
                    <path d={masteryAreaPath} fill="url(#mGrad)" />
                    <path d={masteryPath} fill="none" stroke="#00bbf9" strokeWidth="3" strokeLinecap="round" />
                    <path d={weaknessPath} fill="none" stroke="#f39c12" strokeWidth="2.5" strokeDasharray="4,4" />
                    <path d={riskPath} fill="none" stroke="#ba1a1a" strokeWidth="2" />
                    {chartHistory.map((pt: any, i: number) => {
                      const isHovered = hoveredIndex === i;
                      return (
                        <g key={i}>
                          <circle cx={getX(i)} cy={getY(pt.masteryScore)} r={isHovered ? 6 : 4} fill="#00bbf9" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={getX(i)} cy={getY(pt.weaknessScore)} r={isHovered ? 5 : 3.5} fill="#f39c12" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={getX(i)} cy={getY(pt.riskIndex)} r={isHovered ? 5 : 3.5} fill="#ba1a1a" stroke="#fff" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </>
                )}
                {chartHistory.map((pt: any, i: number) => (
                  <text key={i} x={getX(i)} y={chartHeight - pB + 18} textAnchor="middle" className="text-[10px] fill-[#464652]">{pt.date}</text>
                ))}
              </svg>
              {hoveredIndex !== null && chartHistory[hoveredIndex] && (
                <div className="mt-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-1.5 rounded-lg">
                    <p className="text-[9px] font-bold text-blue-700 uppercase">Mastery</p>
                    <p className="text-sm font-bold text-blue-900">{chartHistory[hoveredIndex].masteryScore}%</p>
                  </div>
                  <div className="bg-amber-50 p-1.5 rounded-lg">
                    <p className="text-[9px] font-bold text-amber-700 uppercase">Focus</p>
                    <p className="text-sm font-bold text-amber-900">{chartHistory[hoveredIndex].weaknessScore}%</p>
                  </div>
                  <div className="bg-red-50 p-1.5 rounded-lg">
                    <p className="text-[9px] font-bold text-red-700 uppercase">Risk</p>
                    <p className={`text-sm font-bold ${chartHistory[hoveredIndex].riskIndex >= 50 ? "text-red-700" : "text-green-600"}`}>{chartHistory[hoveredIndex].riskIndex}%</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Cognitive Strengths & Weaknesses */}
        <Card>
          <h3 className="text-sm font-bold text-[#191c1e] mb-3">💪 Conceptual Strengths</h3>
          {!hasStrengths
            ? <p className="text-xs text-[#767683]">Complete more quests to identify strengths.</p>
            : strengths.map((s: string, i: number) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 font-semibold">{s}</p>
              </div>
            ))}
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-[#191c1e] mb-3">⚠️ Focus Areas</h3>
          {!hasWeaknesses
            ? <p className="text-xs text-[#767683]">No weaknesses detected yet.</p>
            : weaknesses.map((w: string, i: number) => (
              <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                <AlertTriangle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 font-semibold">{w}</p>
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
              <h2 className="text-[15px] font-bold text-[#191c1e]">Incorrect Questions (Mistakes)</h2>
              <p className="text-xs text-[#767683]">Review recent questions answered incorrectly</p>
            </div>
          </div>

          {mistakes.length === 0 ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <span className="text-2xl mb-1 block">🎉</span>
              <p className="text-xs text-green-800 font-semibold">Excellent! No recent mistakes recorded. Keep up the great work!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(showAllMistakes ? mistakes : mistakes.slice(0, 5)).map((m: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border-l-[4px] border-l-[#ba1a1a] rounded-xl p-4 shadow-xs border border-slate-100">
                  <p className="text-[14px] font-bold text-slate-800 mb-2.5 leading-snug">{m.questionText}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md capitalize">
                      📚 {m.subject}
                    </span>
                    <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md">
                      📖 {m.chapter}
                    </span>
                    {m.timeSpent > 0 && (
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                        ⏱️ {m.timeSpent}s
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {mistakes.length > 5 && (
                <button
                  onClick={() => setShowAllMistakes(!showAllMistakes)}
                  className="w-full mt-2 py-2.5 border border-dashed border-[#141779] text-[#141779] hover:bg-[#141779]/5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1"
                >
                  {showAllMistakes ? (
                    <>Show Less <ChevronUp size={14} /></>
                  ) : (
                    <>Show All Mistakes ({mistakes.length}) <ChevronDown size={14} /></>
                  )}
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Risk Alerts */}
        {hasRisks && (
          <Card>
            <SectionHeader icon={<AlertTriangle size={20} color="#ba1a1a" />} title="Risk Alerts" subtitle="Automatically detected warnings" />
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
          <SectionHeader icon={<Lightbulb size={20} color="#f39c12" />} title="Parent Recommendations" subtitle="Personalised action steps" />
          <div className="flex flex-col gap-2">
            {recommendations.map((rec: string, i: number) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 items-start">
                <CheckCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-semibold">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* Date Sheet Modal */}
      <BottomSheet isOpen={showDateSheet} onClose={() => setShowDateSheet(false)} title="Select Time Period">
        <div className="flex flex-col gap-2">
          {["today", "yesterday", "this_week", "this_month", "last_30_days", "custom"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setDateFilter(opt);
                setShowDateSheet(false);
              }}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-black text-left capitalize transition-colors flex justify-between items-center ${
                dateFilter === opt
                  ? "bg-indigo-50 text-[#141779] border-2 border-indigo-200"
                  : "bg-slate-50 text-slate-800 border-2 border-slate-100 hover:bg-slate-100"
              }`}
            >
              <span>{opt.replace("_", " ")}</span>
              {dateFilter === opt && <span className="text-indigo-600 text-xs">✓ Active</span>}
            </button>
          ))}
          {dateFilter === "custom" && (
            <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl space-y-3">
              <h4 className="text-xs font-black text-[#141779] uppercase">Custom Date Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Subject Sheet Modal */}
      <BottomSheet isOpen={showSubjectSheet} onClose={() => setShowSubjectSheet(false)} title="Select Subject">
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
            <span>All Subjects</span>
            {subjectFilter === "all" && <span className="text-indigo-600 text-xs">✓ Active</span>}
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
              <span className="capitalize">{s.subject}</span>
              {subjectFilter === s.subject && <span className="text-indigo-600 text-xs">✓ Active</span>}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Customize Sheet Modal */}
      <BottomSheet isOpen={showCustomizeSheet} onClose={() => setShowCustomizeSheet(false)} title="Customize Report">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Period</label>
            <div className="grid grid-cols-3 gap-2">
              {["today", "this_week", "this_month"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDateFilter(opt)}
                  className={`py-2 px-1 text-[10px] sm:text-xs font-black rounded-xl border text-center transition-colors capitalize ${
                    dateFilter === opt
                      ? "bg-[#141779] text-white border-[#141779]"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {opt.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSubjectFilter("all")}
                className={`py-2 px-3 text-xs font-black rounded-xl border text-center transition-colors ${
                  subjectFilter === "all"
                    ? "bg-[#141779] text-white border-[#141779]"
                    : "bg-slate-50 text-slate-800 border-slate-200"
                }`}
              >
                All Subjects
              </button>
              {subjects.slice(0, 3).map((s: any) => (
                <button
                  key={s.subject}
                  onClick={() => setSubjectFilter(s.subject)}
                  className={`py-2 px-3 text-xs font-black rounded-xl border text-center transition-colors capitalize ${
                    subjectFilter === s.subject
                      ? "bg-[#141779] text-white border-[#141779]"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {s.subject}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Type</label>
            <p className="text-xs text-slate-400 font-bold">Coming soon — filter by quiz, reading, or boss activity.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compare With</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: "none", label: "None" }, { id: "previous", label: "Previous Period" }].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCompareFilter(opt.id)}
                  className={`py-2 px-3 text-xs font-black rounded-xl border text-center transition-colors ${
                    compareFilter === opt.id
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setShowCustomizeSheet(false)}
            className="w-full mt-4 bg-[#141779] text-white py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-transform active:scale-[0.98]"
          >
            Apply Customization
          </button>
        </div>
      </BottomSheet>

      {/* Export Sheet Modal */}
      <BottomSheet isOpen={showExportSheet} onClose={() => setShowExportSheet(false)} title="Export Report">
        <div className="space-y-4">
          <p className="text-xs text-[#767683] font-bold text-center">
            Choose your preferred format to export or share this learning report.
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
              <span>Download PDF</span>
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
              <span>Download Word</span>
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
            📤 Share Report Link
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
    </div>
  );
}

function BottomSheet({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-end justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-t-[32px] w-full max-w-[430px] p-6 pb-8 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto font-sans">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-base font-black text-[#141779]">{title}</h3>
          <button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
