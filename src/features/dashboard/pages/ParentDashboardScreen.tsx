import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Settings, BrainCircuit, Clock, ChevronRight, Home, Activity, X, BarChart2 } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentDashboardScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("Explorer");
  const [parentPhoto, setParentPhoto] = useState("");
  const [userLevel, setUserLevel] = useState(1);
  const [xp, setXp] = useState(0);

  const [modalType, setModalType] = useState<"strengths" | "weaknesses" | "risks" | "lastActivity" | "graph" | null>(null);
  const [strengths, setStrengths] = useState("Quick problem solver in Mathematics.");
  const [weaknesses, setWeaknesses] = useState("Needs more practice in Science concepts.");
  const [risks, setRisks] = useState("Slight drop in engagement this week.");
  const [todayTime, setTodayTime] = useState(0);
  const [solvedToday, setSolvedToday] = useState(0);
  const [todayConfidenceScore, setTodayConfidenceScore] = useState(0);

  const [weeklyTrend, setWeeklyTrend] = useState<{ day: string, score: number }[]>([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState<{ subject: string, accuracy: number }[]>([]);
  const [lastActivity, setLastActivity] = useState<string>("Exploring new quests...");

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const tzOffset = -new Date().getTimezoneOffset();
        
        const [userRes, reportRes, notifRes] = await Promise.all([
          apiFetch("/api/users/me").catch(() => null),
          apiFetch(`/api/parent/report?tz_offset_minutes=${tzOffset}`).catch(() => null),
          apiFetch("/api/notifications").catch(() => null)
        ]);

        if (userRes) {
          const json = await userRes.json();
          if (json.success && json.data?.user) {
            const user = json.data.user;
            setChildName(user.childName || "Explorer");
            setParentPhoto(user.parentPhoto || "");
            setUserLevel(user.level || 1);
            setXp(user.xp || 0);
          }
        }

        if (reportRes) {
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
          }
        }

        if (notifRes) {
          const notifJson = await notifRes.json();
          if (notifJson.success && notifJson.data) {
            setNotifications(notifJson.data);
            setUnreadCount(notifJson.data.filter((n: any) => !n.isRead).length);
          }
        }

      } catch (err) {
        console.error("Failed to load user info", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const markAllRead = async () => {
    try {
      await apiFetch("/api/notifications/mark-all-read", { method: "POST" });
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

  let highestSubject = "Math";
  let lowestSubject = "Science";
  let highestAcc = 90;
  let lowestAcc = 50;
  if (subjectBreakdown && subjectBreakdown.length > 0) {
    const sorted = [...subjectBreakdown].sort((a, b) => b.accuracy - a.accuracy);
    highestSubject = sorted[0].subject;
    highestAcc = sorted[0].accuracy;
    lowestSubject = sorted[sorted.length - 1].subject;
    lowestAcc = sorted[sorted.length - 1].accuracy;
  }

  const chartTitle = modalType === "strengths" ? highestSubject : modalType === "weaknesses" ? lowestSubject : modalType === "risks" ? "Confidence Decline" : "Overall Logic & Reasoning";
  const targetAcc = modalType === "strengths" ? highestAcc : modalType === "weaknesses" ? lowestAcc : modalType === "risks" ? undefined : undefined;

  const chart = generateChartData(targetAcc);
  const currentScore = chart.points.length > 0 ? chart.points[chart.points.length - 1].score : 92;
  const startScore = chart.points.length > 0 ? chart.points[0].score : 65;
  const diff = currentScore - startScore;
  const diffStr = diff >= 0 ? `+${diff}% this week` : `${diff}% this week`;
  const chartColor = modalType === "weaknesses" ? "#ba1a1a" : modalType === "risks" ? "#ff5e00" : "#006a62";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] font-sans relative pb-24 overflow-x-hidden">

      {/* Dynamic Background Glows */}
      <div className="absolute top-[5%] -right-[20%] w-[350px] h-[350px] rounded-full bg-[rgba(87,250,233,0.15)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[20%] w-[400px] h-[400px] rounded-full bg-[rgba(20,23,121,0.08)] blur-[80px] pointer-events-none" />

      {/* Top App Bar */}
      <header className="flex items-center justify-between px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
            <ArrowLeft size={22} className="text-[#141779]" />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[rgba(20,23,121,0.2)] overflow-hidden">
            {parentPhoto ? (
              <img
                src={parentPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#141779]/10 flex items-center justify-center text-lg">
                👨‍👩‍👦
              </div>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#141779] to-[#30007f]">Parent Space</h1>
        </div>
        <button onClick={() => { setShowNotifications(true); markAllRead(); }} className="relative w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
          <Bell size={22} className="text-[#141779]" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 w-4 h-4 bg-[#ba1a1a] rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      <main className="px-5 pt-6 flex flex-col gap-6">

        {/* Child Summary Hero */}
        <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex justify-between items-start mb-4 gap-2 relative z-10">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#464652] tracking-[1px] mb-1">STUDENT PROFILE</p>
              <h2 className="text-[26px] font-bold text-[#141779] truncate">{childName}'s Journey</h2>
            </div>
            <div className="bg-[#57fae9] px-3 py-1 rounded-full whitespace-nowrap shrink-0">
              <span className="text-xs font-bold text-[#007168]">Lvl {userLevel} Explorer</span>
            </div>
          </div>

          <div className="flex gap-3 mb-5 mt-2">
            <div className="flex-1 bg-gradient-to-br from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.5)] rounded-[18px] p-4 flex flex-col items-center justify-center border border-[rgba(255,255,255,0.6)] shadow-[0_8px_20px_rgba(0,106,98,0.04)] relative overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#006a62]/10 to-transparent rounded-bl-full" />
              <span className="text-4xl font-black text-[#006a62] drop-shadow-sm mb-1">{todayTime}<span className="text-xl">m</span></span>
              <span className="text-[11px] font-bold text-[#767683] uppercase tracking-widest">Today's Time</span>
            </div>
            <div className="flex-1 bg-gradient-to-br from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.5)] rounded-[18px] p-4 flex flex-col items-center justify-center border border-[rgba(255,255,255,0.6)] shadow-[0_8px_20px_rgba(48,0,127,0.04)] relative overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#30007f]/10 to-transparent rounded-bl-full" />
              <span className="text-4xl font-black text-[#30007f] drop-shadow-sm mb-1">{solvedToday}</span>
              <span className="text-[11px] font-bold text-[#767683] uppercase tracking-widest">Solved Today</span>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-bold text-[#141779] tracking-wider">DAILY CONFIDENCE SCORE</span>
              <span className="text-[15px] font-black text-[#141779]">{todayConfidenceScore}%</span>
            </div>
            <div className="h-3 bg-[rgba(20,23,121,0.06)] rounded-full overflow-hidden mb-2 shadow-inner relative">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#141779] via-[#30007f] to-[#57fae9] transition-all duration-1000 ease-out"
                style={{ width: `${todayConfidenceScore}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white/30 to-transparent" />
              </div>
            </div>
            <p className="text-xs text-[#767683] font-semibold">
              Based on today's correct answers ({solvedToday} attempts)
            </p>
          </div>
        </div>

        {/* Learning DNA */}
        <div id="dna-section" className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] font-semibold text-[#464652]">Cognitive Strengths & Weaknesses</h3>
          </div>

          <button onClick={() => setModalType("strengths")} className="text-left w-full bg-white/70 backdrop-blur-md rounded-[20px] p-5 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[5px] border-l-[#006a62] hover:bg-white hover:shadow-lg transition-all">
            <h4 className="text-[16px] font-bold text-[#006a62] mb-1">💪 Strengths (Fast Processor)</h4>
            <p className="text-[14px] text-[#464652]">{strengths}</p>
          </button>

          <button onClick={() => setModalType("weaknesses")} className="text-left w-full bg-white/70 backdrop-blur-md rounded-[20px] p-5 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[5px] border-l-[#ba1a1a] hover:bg-white hover:shadow-lg transition-all">
            <h4 className="text-[16px] font-bold text-[#ba1a1a] mb-1">⚠️ Weaknesses / Review Needed</h4>
            <p className="text-[14px] text-[#464652]">{weaknesses}</p>
          </button>

          <button onClick={() => setModalType("risks")} className="text-left w-full bg-white/70 backdrop-blur-md rounded-[20px] p-5 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[5px] border-l-[#ff5e00] hover:bg-white hover:shadow-lg transition-all">
            <h4 className="text-[16px] font-bold text-[#ff5e00] mb-1">🔔 Risk Alerts</h4>
            <p className="text-[14px] text-[#464652]">{risks}</p>
          </button>
        </div>

        {/* Parent Learning Section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[16px] font-semibold text-[#464652] px-1">Parent Learning</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/parent/daily-tip')}
              className="bg-gradient-to-br from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.6)] backdrop-blur-md rounded-[20px] p-4 flex flex-col justify-between h-36 border border-white shadow-[0_4px_15px_rgba(0,106,98,0.06)] text-left hover:scale-[1.02] transition-transform relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#006a62]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#006a62]/10 flex items-center justify-center mb-2 relative z-10">
                <BrainCircuit size={20} color="#006a62" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[15px] font-bold text-[#141779] leading-tight">Daily Tip</h3>
                  <span className="bg-[#006a62] text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">Hot</span>
                </div>
                <p className="text-xs text-[#767683] font-medium leading-tight mt-1">Quick family harmony ideas.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent/lessons')}
              className="bg-gradient-to-br from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.6)] backdrop-blur-md rounded-[20px] p-4 flex flex-col justify-between h-36 border border-white shadow-[0_4px_15px_rgba(20,23,121,0.06)] text-left hover:scale-[1.02] transition-transform relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#141779]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#141779]/10 flex items-center justify-center mb-2 relative z-10">
                <BrainCircuit size={20} color="#141779" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[15px] font-bold text-[#141779] leading-tight">Lessons</h3>
                  <span className="bg-[#30007f] text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">New</span>
                </div>
                <p className="text-xs text-[#767683] font-medium leading-tight mt-1">Bite-sized parent growth.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent/challenges')}
              className="bg-gradient-to-br from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.6)] backdrop-blur-md rounded-[20px] p-4 flex flex-col justify-between h-36 border border-white shadow-[0_4px_15px_rgba(48,0,127,0.06)] text-left hover:scale-[1.02] transition-transform relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#30007f]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#30007f]/10 flex items-center justify-center mb-2 relative z-10">
                <BrainCircuit size={20} color="#30007f" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[13px] font-bold text-[#141779] leading-tight">Challenges</h3>
                  <span className="bg-[#ba1a1a] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">Live</span>
                </div>
                <p className="text-[10px] text-[#767683] font-semibold leading-tight">Build strong daily habits.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent/achievements')}
              className="bg-gradient-to-br from-[rgba(255,255,255,0.9)] to-[rgba(255,255,255,0.6)] backdrop-blur-md rounded-[20px] p-4 flex flex-col justify-between h-36 border border-white shadow-[0_4px_15px_rgba(0,113,104,0.06)] text-left hover:scale-[1.02] transition-transform relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#007168]/5 rounded-full" />
              <div className="w-10 h-10 rounded-full bg-[#007168]/10 flex items-center justify-center mb-2 relative z-10">
                <Activity size={20} color="#007168" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="text-[13px] font-bold text-[#141779] leading-tight">Rewards</h3>
                  <span className="bg-[#007168] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">Badges</span>
                </div>
                <p className="text-[10px] text-[#767683] font-semibold leading-tight">View your milestones.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/parent/settings')}
              className="flex-1 bg-white/70 backdrop-blur-md rounded-[20px] p-4 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-3 hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Settings size={20} className="text-gray-600" />
              </div>
              <span className="text-[16px] font-bold text-[#141779]">Settings</span>
            </button>
            <button
              onClick={() => navigate('/parent/learning-dna')}
              className="flex-1 bg-white/70 backdrop-blur-md rounded-[20px] p-4 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-3 hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ccf4f0] flex items-center justify-center">
                <BrainCircuit size={20} className="text-[#006a62]" />
              </div>
              <span className="text-[16px] font-bold text-[#141779]">DNA</span>
            </button>
          </div>

          <button
            onClick={() => navigate('/parent/kids-activity')}
            className="w-full bg-white/70 backdrop-blur-md rounded-[20px] p-5 border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex justify-between items-center hover:bg-white hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6e0ff] flex items-center justify-center">
                <Clock size={24} className="text-[#30007f]" />
              </div>
              <div className="text-left">
                <h4 className="text-[16px] font-bold text-[#141779] mb-0.5">Kids Activity</h4>
                <p className="text-[14px] font-medium text-[#767683]">{lastActivity}</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#141779] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </main>

      {/* Floating Bottom Glassmorphic Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-3 bg-white/60 backdrop-blur-xl border-t border-white/60 shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate('/parent')} className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 bg-[#57fae9] text-[#007168] shadow-sm scale-105">
          <Home size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </button>
        <button onClick={() => navigate('/parent/reports')} className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168]">
          <BarChart2 size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Reports</span>
        </button>
        <button onClick={() => navigate('/parent/settings')} className="flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-full transition-all duration-300 text-[#464652] hover:text-[#007168]">
          <Settings size={20} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wide">Settings</span>
        </button>
      </nav>

      {/* Graph Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-5 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#f7f9fb] w-full sm:w-[400px] max-w-full rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#141779]">
                {modalType === "strengths" ? "Cognitive Strengths" :
                  modalType === "weaknesses" ? "Areas for Review" :
                  modalType === "risks" ? "Confidence Decline Risk" :
                    "Cognitive Profile Graph"}
              </h2>
              <button onClick={() => setModalType(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                <X size={20} color="#464652" />
              </button>
            </div>

            <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider mb-1">{chartTitle} (7-Day Trend)</p>
                  <p className="text-3xl font-black" style={{ color: chartColor }}>{currentScore}%</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${diff >= 0 ? 'bg-[#006a62]/10 text-[#006a62]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                  {diffStr}
                </div>
              </div>

              {/* Custom SVG Line Graph */}
              <div className="relative w-full h-[160px] mt-6">
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
              </div>
            </div>

            {/* Subject Breakdown Bars */}
            <div className="mt-6 mb-4 space-y-4">
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
                <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100 mt-4">
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
                    ) : (
                      <>{diff >= 0 ? "Consistent upward trend this week!" : "Noticed a slight dip recently."} {strengths}</>
                    )}
                  </p>
                </div>
              );
            })()}
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
    </div>
  );
}
