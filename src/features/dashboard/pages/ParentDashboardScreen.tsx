import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BookOpen, Clock, Heart, ShieldAlert, Sparkles, TrendingUp, Trophy, Zap, ChevronRight, Download, Share2, Award, Calendar, CheckCircle, CheckCircle2, Target, BarChart2, Flame, UserCheck, RefreshCw, X, AlertTriangle, Users, BrainCircuit, Activity, Settings } from "lucide-react";
import FamilyLinkModal from "../../../components/FamilyLinkModal";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";
import ChildSwitcherModal from "../../../components/ChildSwitcherModal";

export default function ParentDashboardScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [childName, setChildName] = useState("Explorer");
  const [parentPhoto, setParentPhoto] = useState("");
  const [userLevel, setUserLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const [modalType, setModalType] = useState<"strengths" | "weaknesses" | "risks" | "lastActivity" | "graph" | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [risks, setRisks] = useState<string[]>([]);
  const [todayTime, setTodayTime] = useState(0);
  const [solvedToday, setSolvedToday] = useState(0);
  const [todayConfidenceScore, setTodayConfidenceScore] = useState(0);

  const [weeklyTrend, setWeeklyTrend] = useState<{ day: string, score: number }[]>([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState<{ subject: string, accuracy: number }[]>([]);
  const [lastActivity, setLastActivity] = useState<string>("Exploring new quests...");
  const [lastActivityDetails, setLastActivityDetails] = useState<any>(null);
  const [top3SubjectsTrend, setTop3SubjectsTrend] = useState<any[]>([]);

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

  const loadData = useCallback(async () => {
    try {
      const tzOffset = -new Date().getTimezoneOffset();
      
      const [userRes, reportRes, notifRes] = await Promise.all([
        apiFetch("/api/users/me").catch(() => null),
        apiFetch(`/api/parent/report?tz_offset_minutes=${tzOffset}`).catch(() => null),
        apiFetch("/api/notifications?role=parent").catch(() => null)
      ]);

      if (userRes && userRes.ok) {
        const json = await userRes.json();
        if (json.success && json.data?.user) {
          const user = json.data.user;
          setUserData(user);
          setChildName(user.childName || "Explorer");
          setParentPhoto(user.parentPhoto || "");
          setUserLevel(user.level || 1);
          setXp(user.xp || 0);
        }
      }

      if (reportRes && reportRes.ok) {
        const repJson = await reportRes.json();
        if (repJson.success && repJson.data) {
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

  const generateChartData = (targetAcc?: number) => {
    if (!weeklyTrend || weeklyTrend.length === 0) return { pathLine: "", pathArea: "", points: [], labels: [] };
    const width = 300;
    const height = 120;
    const baseFinalScore = weeklyTrend[weeklyTrend.length - 1].score;
    const offset = targetAcc !== undefined ? targetAcc - baseFinalScore : 0;

    const points = weeklyTrend.map((t, i) => {
      const x = (i / (weeklyTrend.length - 1)) * width;
      let score = t.score + offset;
      score = Math.max(0, Math.min(100, score)); // clamp
      const y = height - (score / 100) * height;
      return { x, y, score: Math.round(score), day: t.day };
    });

    const pathLine = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
    const pathArea = `M 0,${height} L 0,${points[0].y} ${pathLine.substring(1)} L ${width},${height} Z`;

    return { pathLine, pathArea, points, labels: weeklyTrend.map(t => t.day) };
  };

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

  const chartTitle = modalType === "strengths" ? (highestSubject ?? "Top Subject") : modalType === "weaknesses" ? (lowestSubject ?? "Focus Area") : modalType === "risks" ? "Confidence Decline" : "Overall Logic & Reasoning";
  const targetAcc = modalType === "strengths" ? (highestAcc ?? undefined) : modalType === "weaknesses" ? (lowestAcc ?? undefined) : undefined;

  const chart = generateChartData(targetAcc);
  const currentScore = chart.points.length > 0 ? chart.points[chart.points.length - 1].score : 0;
  const startScore = chart.points.length > 0 ? chart.points[0].score : 0;
  const diff = chart.points.length > 0 ? currentScore - startScore : 0;
  const diffStr = chart.points.length > 0 ? (diff >= 0 ? `+${diff}% this week` : `${diff}% this week`) : "";
  const chartColor = modalType === "weaknesses" ? "#ba1a1a" : modalType === "risks" ? "#ff5e00" : "#006a62";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] px-5 pt-[104px] flex flex-col gap-6 relative">
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 z-50">
          <div className="flex items-center gap-3 w-full">
            <div className="w-11 h-11 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </header>
        <div className="bg-gray-200 animate-pulse rounded-[24px] h-64 w-full"></div>
        <div className="flex flex-col gap-3">
          <div className="h-5 w-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="bg-gray-200 animate-pulse rounded-[20px] h-20 w-full"></div>
          <div className="bg-gray-200 animate-pulse rounded-[20px] h-20 w-full"></div>
          <div className="bg-gray-200 animate-pulse rounded-[20px] h-20 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] font-sans relative pb-24 overflow-x-hidden">

      {/* Dynamic Background Glows */}
      <div className="absolute top-[5%] -right-[20%] w-[350px] h-[350px] rounded-full bg-[rgba(87,250,233,0.15)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[20%] w-[400px] h-[400px] rounded-full bg-[rgba(20,23,121,0.08)] blur-[80px] pointer-events-none" />

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 shadow-xs hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all">
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
            <span className="hidden sm:inline">Family Code</span>
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
                        sessionStorage.clear();
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

        {/* Child Summary Hero */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-start mb-4 gap-2 relative z-10">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-slate-500 tracking-[1.5px] mb-1">{t("student_profile") || "STUDENT PROFILE"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[22px] sm:text-[26px] font-black text-[#141779] leading-snug break-words">{childName}'s {t("journey") || "Journey"}</h2>
                <button
                  onClick={() => setShowSwitcher(true)}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#141779] border border-indigo-200 font-extrabold text-xs flex items-center gap-1 hover:bg-indigo-100 transition-colors shadow-2xs"
                >
                  <Users size={12} />
                  <span>Switch</span>
                </button>
              </div>
            </div>
            <div className="bg-[#57fae9] px-3 py-1 rounded-full whitespace-nowrap shrink-0 border border-[#007168]/20 shadow-2xs">
              <span className="text-xs font-black text-[#007168]">Lvl {userLevel} Explorer</span>
            </div>
          </div>

          <div className="flex gap-3 mb-5 mt-2">
            <div 
              onClick={openBreakdown}
              className="flex-1 bg-slate-50/80 rounded-[18px] p-4 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs relative overflow-hidden hover:scale-[1.02] hover:border-[#141779] cursor-pointer transition-all group/card"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full" />
              <span className="text-4xl font-black text-[#006a62] mb-1">{todayTime}<span className="text-xl">m</span></span>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider group-hover/card:text-[#141779]">Today's Time 🔍</span>
            </div>

            <div 
              onClick={openBreakdown}
              className="flex-1 bg-slate-50/80 rounded-[18px] p-4 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs relative overflow-hidden hover:scale-[1.02] hover:border-[#141779] cursor-pointer transition-all group/card"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#30007f]/10 to-transparent rounded-bl-full" />
              <span className="text-4xl font-black text-[#30007f] mb-1">{solvedToday}</span>
              <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider group-hover/card:text-[#141779]">Solved Today 🔍</span>
            </div>
          </div>

          <div onClick={openBreakdown} className="w-full cursor-pointer group/score">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-extrabold text-[#141779] tracking-wider group-hover/score:underline flex items-center gap-1">
                <span>DAILY CONFIDENCE SCORE</span>
                <span className="text-[10px] bg-indigo-50 text-[#141779] px-2 py-0.5 rounded-full font-bold">Details 🔍</span>
              </span>
              <span className="text-[15px] font-black text-[#141779]">{todayConfidenceScore}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2 shadow-inner relative border border-slate-200/60">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#141779] via-[#30007f] to-[#57fae9] transition-all duration-1000 ease-out"
                style={{ width: `${todayConfidenceScore}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/30 to-transparent" />
              </div>
            </div>
            <p className="text-xs text-slate-600 font-bold">
              Based on today's correct answers ({solvedToday} attempts) • Tap for time breakdown
            </p>
          </div>
        </div>

        {/* Learning DNA */}
        <div id="dna-section" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-extrabold text-slate-800">Cognitive Strengths & Weaknesses</h3>
          </div>

          <button onClick={() => setModalType("strengths")} className="text-left w-full bg-white rounded-[20px] p-5 border border-slate-200/80 shadow-sm border-l-[6px] border-l-[#006a62] hover:shadow-md transition-all">
            <h4 className="text-base font-extrabold text-[#006a62] mb-3">💪 Strengths (Fast Processor)</h4>
            {strengths.length === 0 || strengths[0] === "No strength for now." ? (
              <p className="text-xs text-slate-500">No strength for now.</p>
            ) : strengths[0] === "Not enough Data for now wait few Days" ? (
              <p className="text-xs text-slate-500">Not enough Data for now wait few Days</p>
            ) : (
              strengths.map((s: string, i: number) => (
                <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                  <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-800 font-semibold">{s}</p>
                </div>
              ))
            )}
          </button>

          <button onClick={() => setModalType("weaknesses")} className="text-left w-full bg-white rounded-[20px] p-5 border border-slate-200/80 shadow-sm border-l-[6px] border-l-[#ba1a1a] hover:shadow-md transition-all">
            <h4 className="text-base font-extrabold text-[#ba1a1a] mb-3">⚠️ Weaknesses / Review Needed</h4>
            {weaknesses.length === 0 || weaknesses[0] === "No weakness for now." ? (
              <p className="text-xs text-slate-500">No weakness for now.</p>
            ) : weaknesses[0] === "Not enough Data for now wait few Days" ? (
              <p className="text-xs text-slate-500">Not enough Data for now wait few Days</p>
            ) : (
              weaknesses.map((w: string, i: number) => (
                <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                  <AlertTriangle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-800 font-semibold">{w}</p>
                </div>
              ))
            )}
          </button>

          <button onClick={() => setModalType("risks")} className="text-left w-full bg-white rounded-[20px] p-5 border border-slate-200/80 shadow-sm border-l-[6px] border-l-[#d97706] hover:shadow-md transition-all">
            <h4 className="text-base font-extrabold text-[#d97706] mb-3">🔔 Risk Alerts</h4>
            {risks.length === 0 || risks[0] === "No risk for now." ? (
              <p className="text-xs text-slate-500">No risk for now.</p>
            ) : risks[0] === "Not enough Data for now wait few Days" ? (
              <p className="text-xs text-slate-500">Not enough Data for now wait few Days</p>
            ) : (
              risks.map((r: string, i: number) => (
                <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                  <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-800 font-semibold">{r}</p>
                </div>
              ))
            )}
          </button>
        </div>

        {/* Top 3 Subjects Trend Chart */}
        <div className="w-full bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-black text-[#141779] uppercase tracking-wider">Top Subjects Daily Trend</h3>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5">Performance over the last 7 active days</p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-[#141779] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border border-indigo-100">
              7-Day Graph
            </span>
          </div>

          {/* Graph Legend */}
          {top3SubjectsTrend && top3SubjectsTrend.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-black">
              {top3SubjectsTrend.map((t, idx) => {
                const colors = ["#006a62", "#141779", "#7b1fa2"];
                const color = colors[idx % colors.length];
                const latestScore = t.timeline && t.timeline.length > 0 ? t.timeline[t.timeline.length - 1].score : 0;
                return (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/70" style={{ color }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span>{t.subject}</span>
                    <span className="text-[10px] opacity-75 font-bold">({latestScore}%)</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* SVG Line Graph Container */}
          <div className="w-full flex flex-col gap-2 mt-1">
            <div className="relative w-full h-[140px] px-1 pt-1">
              <svg viewBox="0 0 300 130" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Horizontal Grid Lines */}
                <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="62.5" x2="300" y2="62.5" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="115" x2="300" y2="115" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="4 4" />

                {top3SubjectsTrend && top3SubjectsTrend.length > 0 ? (
                  top3SubjectsTrend.map((t, idx) => {
                    const colors = ["#006a62", "#141779", "#7b1fa2"];
                    const color = colors[idx % colors.length];
                    const points = (t.timeline || []).map((pt: any, i: number) => {
                      const len = Math.max(1, (t.timeline.length - 1));
                      const x = (i / len) * 300;
                      // Map score (0..100) to Y range (115..10)
                      const y = 115 - (pt.score / 100) * 105;
                      return { x, y, score: pt.score };
                    });
                    const pathLine = points.length > 0 ? `M ${points.map((p: any) => `${p.x},${p.y}`).join(" L ")}` : "";
                    return (
                      <g key={idx}>
                        <path d={pathLine} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p: any, pIdx: number) => (
                          <circle key={pIdx} cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2.5" />
                        ))}
                      </g>
                    );
                  })
                ) : (
                  <text x="150" y="65" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
                    No 7-day trend data available yet
                  </text>
                )}
              </svg>
            </div>

            {/* Dedicated X Axis Labels */}
            <div className="flex justify-between text-[10px] font-extrabold text-slate-500 px-1 pt-1 border-t border-slate-100">
              {top3SubjectsTrend && top3SubjectsTrend[0]?.timeline ? (
                top3SubjectsTrend[0].timeline.map((pt: any, i: number) => (
                  <span key={i}>{pt.day}</span>
                ))
              ) : (
                <span>Mon</span>
              )}
            </div>
          </div>
        </div>


        {/* Parent Learning Section */}
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-base font-extrabold text-slate-800 px-1">Parent Learning</h3>
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
                  <h3 className="text-[15px] font-black text-[#141779] leading-tight">{t("daily_tip") || "Daily Tip"}</h3>
                  <span className="bg-[#006a62] text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">Hot</span>
                </div>
                <p className="text-xs text-slate-600 font-bold leading-tight mt-1">Quick family harmony ideas.</p>
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
                  <h3 className="text-[15px] font-black text-[#141779] leading-tight">{t("lessons") || "Lessons"}</h3>
                  <span className="bg-[#30007f] text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">New</span>
                </div>
                <p className="text-xs text-slate-600 font-bold leading-tight mt-1">Bite-sized parent growth.</p>
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
                  <h3 className="text-[13px] font-black text-[#141779] leading-tight">{t("challenges") || "Challenges"}</h3>
                  <span className="bg-[#ba1a1a] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">Live</span>
                </div>
                <p className="text-[10px] text-slate-600 font-extrabold leading-tight">Build strong daily habits.</p>
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
                  <h3 className="text-[13px] font-black text-[#141779] leading-tight">{t("rewards") || "Rewards"}</h3>
                  <span className="bg-[#007168] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">Badges</span>
                </div>
                <p className="text-[10px] text-slate-600 font-extrabold leading-tight">View your milestones.</p>
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
              <span className="text-[16px] font-extrabold text-[#141779]">Settings</span>
            </button>
            <button
              onClick={() => navigate('/parent/learning-dna')}
              className="flex-1 bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-sm flex items-center gap-3 hover:bg-slate-50 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ccf4f0] flex items-center justify-center">
                <BrainCircuit size={20} className="text-[#006a62]" />
              </div>
              <span className="text-[16px] font-extrabold text-[#141779]">DNA</span>
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
                  <h4 className="text-[16px] font-extrabold text-[#141779] leading-none">Kids Activity</h4>
                  {lastActivityDetails && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      lastActivityDetails.type === "reading" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      lastActivityDetails.type === "battle" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                      lastActivityDetails.type === "multiplayer" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                      "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}>
                      {lastActivityDetails.type === "reading" ? "📖 Reading" :
                       lastActivityDetails.type === "battle" ? "🐉 Boss" :
                       lastActivityDetails.type === "multiplayer" ? "⚔️ Arena" :
                       "🎯 Quiz"}
                    </span>
                  )}
                </div>
                {lastActivityDetails ? (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-slate-800 break-words leading-snug">{lastActivityDetails.title}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-0.5">
                      {lastActivityDetails.timeTaken > 0 && (
                        <span>⏱️ {Math.round(lastActivityDetails.timeTaken / 60) || 1}m</span>
                      )}
                      {lastActivityDetails.timeTaken > 0 && lastActivityDetails.totalQuestions > 0 && <span>•</span>}
                      {lastActivityDetails.totalQuestions > 0 && (
                        <span className="text-indigo-600 font-extrabold">
                          🎯 {lastActivityDetails.correctQuestions}/{lastActivityDetails.totalQuestions} Correct
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-700 break-words line-clamp-2">{lastActivity}</p>
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
                  {modalType === "strengths" ? "💪 Cognitive Strengths" :
                    modalType === "weaknesses" ? "⚠️ Areas for Review" :
                    modalType === "risks" ? "🔔 Risk Alerts" :
                      "Cognitive Profile Graph"}
                </h2>
              </div>
              <button onClick={() => setModalType(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                <X size={20} color="#464652" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider mb-1">{chartTitle} (7-Day Trend)</p>
                    {chart.points.length > 0 ? (
                      <p className="text-3xl font-black" style={{ color: chartColor }}>{currentScore}%</p>
                    ) : (
                      <p className="text-3xl font-black text-slate-400">--%</p>
                    )}
                  </div>
                  {chart.points.length > 0 && diffStr && (
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${diff >= 0 ? 'bg-[#006a62]/10 text-[#006a62]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                      {diffStr}
                    </div>
                  )}
                </div>

                {/* Custom SVG Line Graph */}
                <div className="relative w-full h-[160px] mt-6">
                  {(!weeklyTrend || weeklyTrend.length === 0 || weeklyTrend.every(t => t.score === 0)) ? (
                    <div className="w-full h-[120px] bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-4">
                      <Activity size={24} className="text-gray-400 mb-2 animate-pulse" />
                      <p className="text-xs font-bold text-[#7c7d8a]">Weekly trend requires completed quizzes.</p>
                      <p className="text-[10px] text-gray-400 mt-1">No performance data recorded for this week yet.</p>
                    </div>
                  ) : (
                    <>
                      <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="0" y1="0" x2="300" y2="0" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="60" x2="300" y2="60" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4 4" />
                        <line x1="0" y1="120" x2="300" y2="120" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4 4" />

                        {/* Area Fill */}
                        <path
                          d={chart.pathArea}
                          fill="url(#lineGradient)"
                          className="animate-in fade-in duration-700"
                        />

                        {/* The Line */}
                        <path
                          d={chart.pathLine}
                          fill="none"
                          stroke={chartColor}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-sm animate-in slide-in-from-left-4 duration-700"
                        />

                        {/* Data Points */}
                        {chart.points.map((p, idx) => (
                          <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r={idx === chart.points.length - 1 ? 5 : 4}
                            fill={idx === chart.points.length - 1 ? chartColor : "#ffffff"}
                            stroke={idx === chart.points.length - 1 ? "#ffffff" : chartColor}
                            strokeWidth="2.5"
                            className={idx === chart.points.length - 1 ? "animate-pulse" : ""}
                          />
                        ))}
                      </svg>

                      {/* X Axis Labels */}
                      <div className="flex justify-between text-[10px] font-bold text-[#767683] mt-4 px-1">
                        {chart.labels.map((lbl, idx) => (
                          <span key={idx} style={{ color: idx === chart.labels.length - 1 ? chartColor : undefined }}>{lbl}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Subject Breakdown Bars */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-bold text-[#141779] mb-3 border-b border-gray-100 pb-2">
                  {modalType === "strengths" ? "Top Subjects" : modalType === "weaknesses" ? "Needs Attention" : modalType === "risks" ? "At-Risk Subjects" : "Performance by Subject"}
                </h3>
                {subjectBreakdown
                  .slice()
                  .filter(sb => {
                    if (modalType === "strengths") return sb.accuracy >= 70;
                    if (modalType === "weaknesses") return sb.accuracy < 70;
                    return true;
                  })
                  .sort((a, b) => {
                    if (modalType === "weaknesses") return a.accuracy - b.accuracy;
                    return b.accuracy - a.accuracy;
                  })
                  .map((sb, idx) => {
                    const isStrength = sb.accuracy >= 70;
                    const barColor = isStrength ? "#006a62" : "#ba1a1a";
                    const bgColor = isStrength ? "bg-[#006a62]/10" : "bg-[#ba1a1a]/10";

                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className={isStrength ? "text-[#006a62]" : "text-[#ba1a1a]"}>
                            {sb.subject} {isStrength ? "💪" : "⚠️"}
                          </span>
                          <span className={isStrength ? "text-[#006a62]" : "text-[#ba1a1a]"}>{sb.accuracy}%</span>
                        </div>
                        <div className={`h-2.5 w-full ${bgColor} rounded-full overflow-hidden`}>
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${sb.accuracy}%`, backgroundColor: barColor }} />
                        </div>
                      </div>
                    );
                  })}
                {subjectBreakdown.length === 0 && (
                  <p className="text-xs text-[#767683]">Play more quests to see detailed subject breakdown!</p>
                )}
                {subjectBreakdown.length > 0 &&
                  modalType === "weaknesses" &&
                  subjectBreakdown.every(sb => sb.accuracy >= 70) && (
                    <p className="text-xs text-[#006a62] font-semibold bg-[#006a62]/10 p-3 rounded-lg text-center mt-2">
                      🎉 Fantastic! Your child has no weak subjects right now.
                    </p>
                  )}
                {subjectBreakdown.length > 0 &&
                  modalType === "strengths" &&
                  subjectBreakdown.every(sb => sb.accuracy < 70) && (
                    <p className="text-xs text-[#ba1a1a] font-semibold bg-[#ba1a1a]/10 p-3 rounded-lg text-center mt-2">
                      Keep playing to build up strong subjects!
                    </p>
                  )}
              </div>

              {(() => {
                return (
                  <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100">
                    <p className="text-xs text-[#141779] leading-relaxed">
                      <span className="font-bold text-[#141779]">Actionable Insight: </span>
                      {modalType === "risks" ? (
                        <>Noticeable decline in confidence recently. We recommend a <strong>15-minute review session</strong> today focusing on basics, avoiding complex new quests to rebuild {childName}'s confidence slowly.</>
                      ) : subjectBreakdown.length > 0 ? (
                        modalType === "strengths" ?
                          `Your child is currently excelling at ${highestSubject}! These strong foundations help boost overall confidence.`
                          : modalType === "weaknesses" ?
                            `They should give more attention to ${lowestSubject} to build a more balanced cognitive profile.`
                            : <>Your child is currently excelling at <strong>{highestSubject}</strong>! However, they should give more attention to <strong>{lowestSubject}</strong> to build a more balanced cognitive profile.</>
                      ) : chart.points.length > 0 ? (
                        <>{diff >= 0 ? "Consistent upward trend this week!" : "Noticed a slight dip recently."} {strengths.join(" ")}</>
                      ) : (
                        <>No trend data available yet. Complete more quizzes to get personalized insights.</>
                      )}
                    </p>
                  </div>
                );
              })()}

              {/* View Reports CTA */}
              <button
                onClick={() => { setModalType(null); navigate('/parent/reports'); }}
                className="w-full flex items-center justify-center gap-2 bg-[#141779] text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl hover:bg-[#1e23a0] active:scale-95 transition-all shadow-md shadow-[#141779]/25 shrink-0"
              >
                <span>📊</span>
                <span>
                  {modalType === "weaknesses" ? "Review Mistakes & Reports" : "View Subject Reports"}
                </span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Side Panel / Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-end">
          <div className="w-full sm:w-[400px] h-full bg-[#f7f9fb] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-[#141779] flex items-center gap-2">
                <Bell size={24} /> Notifications
              </h2>
              <button onClick={() => setShowNotifications(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} color="#464652" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <Bell size={48} className="mb-4 text-gray-400" />
                  <p className="text-gray-500 font-medium">No recent activity to show.</p>
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
                        <h4 className="text-[14px] font-bold text-[#141779] mb-1">{notif.title}</h4>
                        <p className="text-[12px] text-[#464652] leading-tight">{notif.message}</p>
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
                  <span>Today's Time Breakdown</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold mt-0.5">
                  Detailed calculation for <span className="text-[#141779] font-extrabold">{childName}</span>
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
                <span className="text-xs font-bold text-slate-500">Calculating today's time & attempts...</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-0.5 space-y-4">
                
                {/* 3 Summary Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Total Time</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-700">{breakdownData?.totalTimeFormatted || "0m"}</span>
                  </div>

                  <div className="bg-indigo-50/80 border border-indigo-200/80 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider block">Questions</span>
                    <span className="text-lg sm:text-xl font-black text-[#141779]">{breakdownData?.totalSolved || 0}</span>
                    <span className="text-[10px] text-indigo-600 font-bold block">{breakdownData?.totalCorrect || 0} Correct</span>
                  </div>

                  <div className="bg-purple-50/80 border border-purple-200/80 p-3 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider block">Confidence</span>
                    <span className="text-lg sm:text-xl font-black text-purple-700">{breakdownData?.confidenceScore || 0}%</span>
                  </div>
                </div>

                {/* Mode Breakdown Cards */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Time Spent by Mode</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {breakdownData?.modeBreakdown && Object.entries(breakdownData.modeBreakdown).map(([key, m]: [string, any]) => (
                      <div key={key} className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                            <span>{m.icon}</span>
                            <span className="truncate">{m.name.split('/')[0]}</span>
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold">{m.count} questions</p>
                        </div>
                        <span className="text-xs font-black text-[#141779] bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0">
                          {Math.floor(m.timeSec / 60)}m {m.timeSec % 60}s
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itemized Question & Answer List */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Today's Question Attempts</span>
                    <span className="text-[10px] font-bold text-slate-500">({breakdownData?.attempts?.length || 0} items)</span>
                  </h4>

                  {(!breakdownData?.attempts || breakdownData.attempts.length === 0) ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                      <p className="text-xs font-bold text-slate-500">No question attempts logged today yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Play a Quiz, Shadow Arena battle, or AI quest to record live time!</p>
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
                                {att.mode}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold ml-auto">{att.timestamp}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 truncate">{att.questionText}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-extrabold text-slate-600 bg-slate-200/60 px-2 py-1 rounded-lg">
                              ⏱️ {att.timeFormatted}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                              att.isCorrect 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}>
                              {att.isCorrect ? "Correct ✓" : "Incorrect ✕"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-indigo-50/80 border border-indigo-100 p-3 rounded-2xl text-xs text-[#141779] font-bold flex items-center justify-between">
                  <span>Total Calculated Time:</span>
                  <span className="text-sm font-black text-[#141779] bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-2xs">
                    {breakdownData?.totalTimeFormatted || "0m"} ({breakdownData?.totalSolved || 0} attempts)
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
