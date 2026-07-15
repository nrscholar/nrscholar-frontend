import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, TrendingUp, AlertTriangle, CheckCircle,
  Calculator, Atom, BookOpen, Star, Target, Lightbulb,
  Award, BookOpenCheck, Loader2, Brain, Zap, ShieldCheck, BookMarked,
  ChevronDown, ChevronUp, BarChart2
} from "lucide-react";
import { apiFetch } from "../../../api";

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
  const [activeTab, setActiveTab] = useState("daily");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Timeline history helpers
  const dailyHistory = reportData?.dailyTimelineHistory || [];
  const monthlyHistory = reportData?.monthlyTimelineHistory || [];
  const sixMonthHistory = reportData?.sixMonthTimelineHistory || [];
  const yearlyHistory = reportData?.yearlyTimelineHistory || [];
  
  let chartHistory = dailyHistory;
  if (activeTab === "monthly") chartHistory = monthlyHistory;
  if (activeTab === "6month") chartHistory = sixMonthHistory;
  if (activeTab === "yearly") chartHistory = yearlyHistory;

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

  const masteryPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.masteryScore)}`).join(' ');
  const weaknessPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.weaknessScore)}`).join(' ');
  const riskPath = chartHistory.map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(pt.riskIndex)}`).join(' ');

  const masteryAreaPath = chartHistory.length > 0 
    ? `${masteryPath} L ${getX(chartHistory.length - 1)} ${chartHeight - paddingBottom} L ${getX(0)} ${chartHeight - paddingBottom} Z` 
    : '';

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

  useEffect(() => {
    (async () => {
      try {
        const res  = await apiFetch("/api/parent/report");
        const json = await res.json();
        if (json.success) setReportData(json.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const tabs = [
    { id: "daily",    label: "Daily"    },
    { id: "subjects", label: "Subjects" },
    { id: "monthly",  label: "Monthly"  },
    { id: "yearly",   label: "Yearly"   },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center gap-3">
      <Loader2 size={32} className="animate-spin text-[#141779]" />
      <p className="text-sm font-bold text-[#464652]">Analysing learning data...</p>
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
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-[#141779]">{reportData?.overallAccuracy ?? 0}%</span>
          <span className="text-[9px] text-[#767683]">Overall Accuracy</span>
        </div>
      </header>

      <main className="px-5 pt-5 flex flex-col gap-5">
        {/* Tabs */}
        <div className="flex bg-white/60 p-1 rounded-xl shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[75px] py-2 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === t.id ? "bg-white text-[#141779] shadow-sm" : "text-[#767683]"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ DAILY TAB ══ */}
        {activeTab === "daily" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">

            {/* Today summary */}
            <Card>
              <SectionHeader icon={<Clock size={20} color="#006a62" />} title="Today's Activity" subtitle="Live session stats" />
              <div className="grid grid-cols-3 gap-2 mb-4">
                <StatBox label="Time (min)"  value={reportData?.todayTimeMinutes ?? 0} />
                <StatBox label="Questions"   value={reportData?.todaySolved ?? 0} color="text-[#006a62]" />
                <StatBox label="Accuracy"    value={`${reportData?.todayConfidenceScore ?? 0}%`} color="text-[#30007f]" />
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#464652] uppercase">Daily Confidence</span>
                <span className="text-sm font-black text-[#141779]">{reportData?.todayConfidenceScore ?? 0}%</span>
              </div>
              <ProgressBar value={reportData?.todayConfidenceScore ?? 0} color="bg-gradient-to-r from-[#141779] via-[#30007f] to-[#57fae9]" />
            </Card>

            {/* Question Analytics */}
            <Card>
              <SectionHeader icon={<BarChart2 size={20} color="#30007f" />} title="Question Analytics" subtitle="Lifetime performance stats" />
              <div className="grid grid-cols-2 gap-2 mb-3">
                <StatBox label="Total Attempted" value={qA.totalAttempted ?? 0} />
                <StatBox label="Accuracy"        value={`${qA.accuracy ?? 0}%`} color="text-[#006a62]" />
                <StatBox label="Correct"         value={qA.correct ?? 0} color="text-[#006a62]" />
                <StatBox label="Wrong"           value={qA.wrong ?? 0} color="text-[#ba1a1a]" />
              </div>
              {(qA.avgTimePerQuestion ?? 0) > 0 && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-700">Avg. Time per Question</span>
                  <span className="text-sm font-black text-indigo-900">{qA.avgTimePerQuestion}s</span>
                </div>
              )}
            </Card>

            {/* Reading Analytics */}
            <Card>
              <SectionHeader icon={<BookMarked size={20} color="#006a62" />} title="Reading Analytics" subtitle="PDF chapter reading progress" />
              <div className="grid grid-cols-2 gap-2 mb-3">
                <StatBox label="Chapters Read"   value={rA.chaptersRead ?? 0} color="text-[#006a62]" />
                <StatBox label="Completion Rate" value={`${rA.completionRate ?? 0}%`} color="text-[#141779]" />
              </div>
              <ProgressBar value={rA.completionRate ?? 0} color="bg-[#006a62]" />
              {rA.qualityWarning && (
                <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2 items-start">
                  <AlertTriangle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-orange-700">{rA.warningMessage}</p>
                </div>
              )}
            </Card>

            {/* Boss Round Analytics */}
            <Card>
              <SectionHeader icon={<ShieldCheck size={20} color="#ba1a1a" />} title="Boss Round Analytics" subtitle="Battle performance & history" />
              <div className="grid grid-cols-2 gap-2 mb-3">
                <StatBox label="Total Attempts" value={bA.totalAttempts ?? 0} />
                <StatBox label="Pass Rate" value={`${bA.passRate ?? 0}%`} color={(bA.passRate ?? 0) >= 60 ? "text-[#006a62]" : "text-[#ba1a1a]"} />
                <StatBox label="Wins"  value={bA.wins ?? 0}   color="text-[#006a62]" />
                <StatBox label="Losses" value={bA.losses ?? 0} color="text-[#ba1a1a]" />
              </div>
              <ProgressBar value={bA.passRate ?? 0} color={(bA.passRate ?? 0) >= 60 ? "bg-[#006a62]" : "bg-[#ba1a1a]"} />
              {(bA.consecutiveFailures ?? 0) >= 2 && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 items-start">
                  <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">Boss Round failed {bA.consecutiveFailures} times in a row. Recommend revision before next attempt.</p>
                </div>
              )}
            </Card>

            {/* Daily Mastery & Risk Trend Chart */}
            <Card>
              <SectionHeader icon={<TrendingUp size={20} color="#141779" />} title="Daily Mastery & Risk Trend" subtitle="Last 7 days" />
              {dailyHistory.length === 0 ? (
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
                        <line x1={pL} y1={getY(v)} x2={chartWidth - pR} y2={getY(v)} stroke="#eef0f2" strokeWidth="1.5" />
                        <text x={pL - 6} y={getY(v) + 4} textAnchor="end" className="text-[10px] fill-[#767683]">{v}%</text>
                      </g>
                    ))}
                    {masteryAreaPath && <path d={masteryAreaPath} fill="url(#mGrad)" />}
                    <path d={masteryPath}  fill="none" stroke="#00bbf9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={weaknessPath} fill="none" stroke="#f39c12" strokeWidth="2.5" strokeDasharray="4,4" strokeLinecap="round" />
                    <path d={riskPath}     fill="none" stroke="#ba1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {hoveredIndex !== null && dailyHistory[hoveredIndex] && (
                      <g>
                        <line x1={getX(hoveredIndex)} y1={pT} x2={getX(hoveredIndex)} y2={chartHeight - pB} stroke="#141779" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5" />
                        <circle cx={getX(hoveredIndex)} cy={getY(dailyHistory[hoveredIndex].masteryScore)}  r="6" fill="#00bbf9" stroke="#fff" strokeWidth="2" />
                        <circle cx={getX(hoveredIndex)} cy={getY(dailyHistory[hoveredIndex].weaknessScore)} r="5" fill="#f39c12" stroke="#fff" strokeWidth="1.5" />
                        <circle cx={getX(hoveredIndex)} cy={getY(dailyHistory[hoveredIndex].riskIndex)}     r="6" fill="#ba1a1a" stroke="#fff" strokeWidth="2" />
                      </g>
                    )}
                    {hoveredIndex === null && dailyHistory.map((pt: any, i: number) => (
                      <g key={i}>
                        <circle cx={getX(i)} cy={getY(pt.masteryScore)} r="4" fill="#00bbf9" />
                        <circle cx={getX(i)} cy={getY(pt.riskIndex)} r="4" fill="#ba1a1a" />
                      </g>
                    ))}
                    {dailyHistory.map((pt: any, i: number) => (
                      <text key={i} x={getX(i)} y={chartHeight - pB + 18} textAnchor="middle" className="text-[10px] fill-[#464652]">{pt.date}</text>
                    ))}
                  </svg>
                  {hoveredIndex !== null && dailyHistory[hoveredIndex] && (
                    <div className="mt-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 p-1.5 rounded-lg">
                        <p className="text-[9px] font-bold text-blue-700 uppercase">Mastery</p>
                        <p className="text-sm font-bold text-blue-900">{dailyHistory[hoveredIndex].masteryScore}%</p>
                      </div>
                      <div className="bg-amber-50 p-1.5 rounded-lg">
                        <p className="text-[9px] font-bold text-amber-700 uppercase">Focus</p>
                        <p className="text-sm font-bold text-amber-900">{dailyHistory[hoveredIndex].weaknessScore}%</p>
                      </div>
                      <div className="bg-red-50 p-1.5 rounded-lg">
                        <p className="text-[9px] font-bold text-red-700 uppercase">Risk</p>
                        <p className={`text-sm font-bold ${dailyHistory[hoveredIndex].riskIndex >= 50 ? "text-red-700" : "text-green-600"}`}>{dailyHistory[hoveredIndex].riskIndex}%</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Learning DNA Radar */}
            <Card>
              <SectionHeader icon={<Award size={20} color="#141779" />} title="Learning DNA Profile" subtitle="Cognitive skill mapping" />
              <div className="flex justify-center">
                <div className="relative w-full max-w-[280px]">
                  <svg viewBox="0 0 300 240" className="w-full overflow-visible">
                    {[20, 40, 60, 80].map((r, idx) => (
                      <polygon key={idx}
                        points={[-90, -18, 54, 126, 198].map(ang => { const p = getRadarPt(150, 110, r, ang); return `${p.x},${p.y}`; }).join(" ")}
                        fill="none" stroke="#eef0f2" strokeWidth="1.5" />
                    ))}
                    {[-90, -18, 54, 126, 198].map((ang, idx) => {
                      const p = getRadarPt(150, 110, 80, ang);
                      return <line key={idx} x1="150" y1="110" x2={p.x} y2={p.y} stroke="#eef0f2" strokeWidth="1.5" />;
                    })}
                    <polygon
                      points={dnaAxes.map(item => { const p = getRadarPt(150, 110, (item.val / 100) * 80, item.ang); return `${p.x},${p.y}`; }).join(" ")}
                      fill="rgba(0,187,249,0.25)" stroke="#00bbf9" strokeWidth="2.5" />
                    {dnaAxes.map((item, idx) => {
                      const p  = getRadarPt(150, 110, (item.val / 100) * 80, item.ang);
                      const lp = getRadarPt(150, 110, 104, item.ang);
                      return (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="4" fill="#141779" stroke="#fff" strokeWidth="1.5" />
                          <text x={lp.x} y={lp.y + 4}
                            textAnchor={item.ang === -90 ? "middle" : (item.ang === -18 || item.ang === 54) ? "start" : "end"}
                            className="text-[10px] fill-[#141779] font-bold">{item.label} ({item.val}%)</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </Card>

            {/* Improvement Tracking */}
            {improvements.length > 0 && (
              <Card>
                <SectionHeader icon={<TrendingUp size={20} color="#006a62" />} title="Improvement Tracking" subtitle="First attempt vs latest attempt" />
                <div className="flex flex-col gap-3">
                  {improvements.map((item: any, idx: number) => (
                    <div key={idx} className="bg-[#f2f4f6] rounded-xl p-3 border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-[#141779]">{item.chapterName}</p>
                          <p className="text-[10px] text-[#767683]">{item.subject}</p>
                        </div>
                        <span className={`text-xs font-black px-2 py-1 rounded-full ${item.trend === "up" ? "bg-green-100 text-green-700" : item.trend === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                          {item.trend === "up" ? "📈" : item.trend === "down" ? "📉" : "➡️"} {item.improvement > 0 ? "+" : ""}{item.improvement}%
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white rounded-lg p-2 text-center border border-gray-100">
                          <p className="text-[9px] font-bold text-[#767683] uppercase">First</p>
                          <p className="text-sm font-bold text-[#464652]">{item.firstAttemptAccuracy}%</p>
                        </div>
                        <div className="flex items-center text-[#767683]">→</div>
                        <div className="flex-1 bg-white rounded-lg p-2 text-center border border-gray-100">
                          <p className="text-[9px] font-bold text-[#767683] uppercase">Latest</p>
                          <p className={`text-sm font-bold ${item.trend === "up" ? "text-[#006a62]" : "text-[#ba1a1a]"}`}>{item.latestAccuracy}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Risk Alerts */}
            {risks.length > 0 && (
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
          </div>
        )}

        {/* ══ SUBJECTS TAB ══ */}
        {activeTab === "subjects" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">

            {/* Strengths */}
            <Card>
              <h3 className="text-sm font-bold text-[#191c1e] mb-3">💪 Strengths</h3>
              {strengths.length === 0
                ? <p className="text-xs text-[#767683]">Complete more quests to identify strengths.</p>
                : strengths.map((s: string, i: number) => (
                  <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                    <CheckCircle size={14} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800 font-semibold">{s}</p>
                  </div>
                ))}
            </Card>

            {/* Weaknesses */}
            <Card>
              <h3 className="text-sm font-bold text-[#191c1e] mb-3">⚠️ Weaknesses</h3>
              {weaknesses.length === 0
                ? <p className="text-xs text-[#767683]">No weaknesses detected.</p>
                : weaknesses.map((w: string, i: number) => (
                  <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-2 flex gap-2 items-start">
                    <AlertTriangle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-800 font-semibold">{w}</p>
                  </div>
                ))}
            </Card>

            {/* Per-Subject Analytics */}
            {subjects.length === 0 && (
              <Card><p className="text-xs text-center text-[#767683]">Start practicing to see subject analytics.</p></Card>
            )}
            {subjects.map((s: any, idx: number) => {
              const col = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
              const isExpanded = expandedSubject === s.subjectId;
              const subjChapters = chaptersBySubject[s.subjectId] || [];
              return (
                <Card key={s.subjectId}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#141779]">{s.subject}</h3>
                      <p className="text-[10px] text-[#767683]">{s.chaptersCompleted}/{s.totalChapters} chapters completed</p>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${s.accuracy >= 80 ? "bg-green-100 text-green-700" : s.accuracy >= 60 ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                      {s.accuracy}% acc
                    </span>
                  </div>

                  <div className="mb-1 flex justify-between">
                    <span className="text-[10px] font-bold text-[#464652]">Progress</span>
                    <span className="text-[10px] font-bold text-[#141779]">{s.progress}%</span>
                  </div>
                  <ProgressBar value={s.progress} color={col.bar} />

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <StatBox label="Correct" value={s.correctAnswers} color="text-[#006a62]" />
                    <StatBox label="Wrong"   value={s.wrongAnswers}   color="text-[#ba1a1a]" />
                    <StatBox label="Boss"    value={`${s.bossSuccessRate}%`} color="text-[#30007f]" />
                  </div>

                  {s.monthImprovement !== null && s.monthImprovement !== undefined && (
                    <div className={`mt-3 rounded-xl p-2.5 flex justify-between items-center ${s.monthImprovement >= 0 ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                      <span className="text-[10px] font-bold text-[#464652]">Month vs Last Month</span>
                      <span className={`text-xs font-black ${s.monthImprovement >= 0 ? "text-green-700" : "text-red-700"}`}>
                        {s.monthImprovement >= 0 ? "+" : ""}{s.monthImprovement}%
                      </span>
                    </div>
                  )}

                  {subjChapters.length > 0 && (
                    <button onClick={() => setExpandedSubject(isExpanded ? null : s.subjectId)}
                      className="mt-3 w-full flex items-center justify-center gap-1 text-[11px] font-bold text-[#141779] py-2 bg-[#f2f4f6] rounded-xl hover:bg-gray-100 transition-colors">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? "Hide" : "Show"} Chapters ({subjChapters.length})
                    </button>
                  )}

                  {isExpanded && (
                    <div className="mt-3 flex flex-col gap-2">
                      {subjChapters.map((ch: any, ci: number) => (
                        <div key={ci} className="flex items-center justify-between bg-[#f2f4f6] rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            {ch.status === "Completed"
                              ? <CheckCircle size={16} className="text-green-600 shrink-0" />
                              : ch.status === "In Progress"
                              ? <div className="w-4 h-4 rounded-full border-2 border-[#f39c12] flex items-center justify-center shrink-0"><div className="w-1.5 h-1.5 bg-[#f39c12] rounded-full" /></div>
                              : <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />}
                            <div>
                              <p className="text-xs font-bold text-[#141779]">{ch.name}</p>
                              <div className="flex gap-1 mt-0.5 flex-wrap">
                                {ch.readingCompleted    && <span className="text-[8px] bg-blue-100   text-blue-700   rounded px-1 font-bold">📖 Read</span>}
                                {ch.questionsCompleted  && <span className="text-[8px] bg-green-100  text-green-700  rounded px-1 font-bold">✅ Q&amp;A</span>}
                                {ch.bossCompleted       && <span className="text-[8px] bg-purple-100 text-purple-700 rounded px-1 font-bold">🏆 Boss</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-black ${ch.status === "Completed" ? "text-green-600" : ch.status === "In Progress" ? "text-[#f39c12]" : "text-gray-400"}`}>
                              {ch.status === "Completed" ? "✔ Done" : ch.status === "In Progress" ? "In Progress" : "Locked"}
                            </span>
                            {ch.accuracy > 0 && <p className="text-[9px] text-[#767683]">{ch.accuracy}% acc</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ══ MONTHLY TAB ══ */}
        {activeTab === "monthly" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <Card>
              <SectionHeader icon={<BarChart2 size={20} color="#141779" />}
                title={`${new Date().toLocaleString("default", { month: "long", year: "numeric" })}`}
                subtitle="This month's learning overview" />
              <div className="flex justify-between items-center bg-[#f2f4f6] p-4 rounded-xl mb-4">
                <div className="text-center">
                  <p className="text-[9px] font-bold text-[#767683] uppercase">Active Days</p>
                  <p className="text-2xl font-bold text-[#141779]">{reportData?.monthlyStats?.activeDays ?? 0}<span className="text-base text-gray-400">/{reportData?.monthlyStats?.totalDaysInMonth ?? 30}</span></p>
                </div>
                <div className="w-[1px] h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[9px] font-bold text-[#767683] uppercase">Hours</p>
                  <p className="text-2xl font-bold text-[#006a62]">{reportData?.monthlyStats?.timeHours ?? 0}</p>
                </div>
                <div className="w-[1px] h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[9px] font-bold text-[#767683] uppercase">Bosses Won</p>
                  <p className="text-2xl font-bold text-[#ba1a1a]">{reportData?.monthlyStats?.bossesDefeated ?? 0}</p>
                </div>
              </div>

              <h3 className="text-xs font-bold text-[#464652] mb-3">6-Month Accuracy Trend</h3>
              <div className="h-36 flex items-end justify-between gap-2 border-b border-gray-200 pb-2 mb-4">
                {(reportData?.sixMonthTrend ?? []).map((m: any, i: number) => (
                  <div key={i} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-[8px] font-bold text-[#141779]">{m.score > 0 ? `${m.score}%` : ""}</span>
                    <div className="w-full bg-[#141779] rounded-t-md opacity-80" style={{ height: `${Math.max(4, m.score * 1.3)}px` }} />
                    <span className="text-[9px] font-bold text-[#767683]">{m.month}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-bold text-[#464652] mb-3">Subject: Month vs Last Month</h3>
              <div className="flex flex-col gap-2">
                {subjects.filter((s: any) => s.monthImprovement !== null && s.monthImprovement !== undefined).map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-[#f2f4f6] rounded-xl p-3">
                    <div>
                      <p className="text-xs font-bold text-[#141779]">{s.subject}</p>
                      <p className="text-[9px] text-[#767683]">Last: {s.prevMonthAccuracy ?? "–"}% → Now: {s.currentMonthAccuracy ?? "–"}%</p>
                    </div>
                    <span className={`text-xs font-black ${s.monthImprovement >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {s.monthImprovement >= 0 ? "+" : ""}{s.monthImprovement}%
                    </span>
                  </div>
                ))}
                {subjects.every((s: any) => s.monthImprovement === null || s.monthImprovement === undefined) && (
                  <p className="text-xs text-center text-[#767683]">Complete more quests to see month-over-month data.</p>
                )}
              </div>
            </Card>

            {weaknesses.length > 0 && (
              <Card>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-3 items-start">
                  <AlertTriangle size={20} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-orange-800 mb-1">Areas Needing Attention</p>
                    {weaknesses.slice(0, 3).map((w: string, i: number) => (
                      <p key={i} className="text-[11px] text-orange-700">{w}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ══ YEARLY TAB ══ */}
        {activeTab === "yearly" && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <Card className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#141779] to-[#006a62] flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Award size={32} color="white" />
              </div>
              <h2 className="text-xl font-bold text-[#191c1e]">{new Date().getFullYear()} Annual Review</h2>
              <p className="text-xs text-[#767683] mb-5">Complete learning journey summary</p>
              <div className="grid grid-cols-2 gap-4 text-left">
                <StatBox label="Total Hours"      value={reportData?.yearlyStats?.timeHours ?? 0} />
                <StatBox label="Chapters Done"    value={reportData?.totalChaptersCompleted ?? 0} color="text-emerald-700" />
                <StatBox label="Overall Accuracy" value={`${reportData?.overallAccuracy ?? 0}%`} color="text-[#141779]" />
                <StatBox label="Bosses Won"       value={reportData?.bossesWon ?? 0} color="text-[#ba1a1a]" />
                <div className="col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-purple-700 uppercase mb-1">Questions Solved</p>
                    <p className="text-2xl font-bold text-purple-900">{(reportData?.yearlyStats?.questionsSolved ?? 0).toLocaleString()}</p>
                  </div>
                  <BookOpenCheck size={36} className="text-purple-200" />
                </div>
              </div>
            </Card>

            {/* Confidence Scores */}
            <Card>
              <SectionHeader icon={<Zap size={20} color="#f39c12" />} title="Confidence Scores" subtitle="Multi-dimensional performance" />
              <div className="flex flex-col gap-3">
                {[
                  { label: "Today's Confidence", val: reportData?.todayConfidenceScore  ?? 0 },
                  { label: "Weekly Confidence",  val: reportData?.weeklyConfidenceScore  ?? 0 },
                  { label: "Overall Confidence", val: reportData?.overallConfidenceScore ?? 0 },
                ].map(({ label, val }, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-bold text-[#464652]">{label}</span>
                      <span className="text-[11px] font-black text-[#141779]">{val}%</span>
                    </div>
                    <ProgressBar value={val} color={val >= 70 ? "bg-[#006a62]" : val >= 50 ? "bg-[#f39c12]" : "bg-[#ba1a1a]"} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Skill Evolution */}
            <Card>
              <SectionHeader icon={<Target size={20} color="#006a62" />} title="Skill Evolution" subtitle="Subject mastery status" />
              <div className="flex flex-col gap-2">
                {subjects.slice(0, 5).map((sb: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-[#464652]">{sb.subject}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${sb.accuracy >= 80 ? "text-green-600 bg-green-50" : sb.accuracy >= 60 ? "text-blue-600 bg-blue-50" : "text-orange-600 bg-orange-50"}`}>
                      {sb.accuracy >= 80 ? "Mastered" : sb.accuracy >= 60 ? "Improving" : "Needs Work"}
                    </span>
                  </div>
                ))}
                {subjects.length === 0 && <p className="text-xs text-center text-[#767683]">Complete more quests to see skill evolution!</p>}
              </div>
            </Card>

            {/* Strengths */}
            <div className="bg-gradient-to-br from-[#141779] to-[#30007f] rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={20} className="text-yellow-400" />
                <h3 className="text-sm font-bold">Strengths &amp; Smart Insights</h3>
              </div>
              <div className="flex flex-col gap-2">
                {strengths.map((s: string, i: number) => (
                  <div key={i} className="bg-white/10 rounded-lg p-2.5 flex gap-2 items-start">
                    <CheckCircle size={13} className="text-[#57fae9] shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-100">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
