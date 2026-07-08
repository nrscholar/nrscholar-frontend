import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart2, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle, Calculator, Atom, BookOpen, Star, Target, Lightbulb, Trophy, Award, BookOpenCheck, Loader2 } from "lucide-react";
import { apiFetch } from "../../../api";

export default function ParentReportScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("daily");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await apiFetch("/api/parent/report");
        const json = await res.json();
        if (json.success) {
          setReportData(json.data);
        }
      } catch (err) {
        console.error("Failed to load report", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  const tabs = [
    { id: "daily", label: "Daily" },
    { id: "monthly", label: "Monthly" },
    { id: "6month", label: "6 Months" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-24">
      {/* Top App Bar */}
      <header className="flex items-center gap-4 px-5 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[22px] font-bold text-[#141779]">Learning Reports</h1>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 py-32">
          <Loader2 size={32} className="animate-spin text-[#141779] mb-4" />
          <p className="text-sm font-bold text-[#464652]">Loading insights...</p>
        </div>
      ) : (
      <main className="px-5 pt-6">
        {/* Tabs */}
        <div className="flex bg-[rgba(255,255,255,0.5)] p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-white text-[#141779] shadow-sm" 
                  : "text-[#767683] hover:text-[#464652]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {/* DAILY TAB */}
          {activeTab === "daily" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-5">
              
              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(0,106,98,0.1)] flex items-center justify-center">
                    <Clock size={20} color="#006a62" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#191c1e]">Today's Activity</h2>
                    <p className="text-xs text-[#767683]">Great focus today!</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#f2f4f6] p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-[#464652] uppercase mb-1">Time Spent</p>
                    <p className="text-2xl font-bold text-[#141779]">{reportData?.todayTimeMinutes || 0}<span className="text-sm font-bold text-[#767683]">m</span></p>
                  </div>
                  <div className="bg-[#f2f4f6] p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-[#464652] uppercase mb-1">Questions</p>
                    <p className="text-2xl font-bold text-[#006a62]">{reportData?.todaySolved || 0}</p>
                  </div>
                </div>
                <div className="bg-[#f2f4f6] p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-bold text-[#464652] uppercase">Accuracy Score</p>
                    <p className="text-2xl font-bold text-[#30007f]">{reportData?.todayConfidenceScore || 0}%</p>
                  </div>
                  <div className="w-full h-3 bg-[rgba(48,0,127,0.1)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#141779] to-[#30007f] rounded-full relative" style={{ width: `${reportData?.todayConfidenceScore || 0}%` }}>
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 skew-x-12" />
                    </div>
                  </div>
                  <p className="text-xs text-[#767683] mt-2">{reportData?.risks || "+5% higher than yesterday"}</p>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)]">
                <h3 className="text-sm font-bold text-[#191c1e] mb-4">Subject Breakdown</h3>
                <div className="flex flex-col gap-4">
                  {reportData?.subjectBreakdown?.map((subject: any, idx: number) => {
                    const colors = [
                      { bg: "bg-blue-50", text: "text-blue-600", barBg: "bg-blue-100", bar: "bg-blue-600", icon: <Calculator size={16} className="text-blue-600"/> },
                      { bg: "bg-green-50", text: "text-green-600", barBg: "bg-green-100", bar: "bg-green-600", icon: <Atom size={16} className="text-green-600"/> },
                      { bg: "bg-purple-50", text: "text-purple-600", barBg: "bg-purple-100", bar: "bg-purple-600", icon: <BookOpen size={16} className="text-purple-600"/> },
                      { bg: "bg-orange-50", text: "text-orange-600", barBg: "bg-orange-100", bar: "bg-orange-600", icon: <Star size={16} className="text-orange-600"/> },
                    ];
                    const color = colors[idx % colors.length];
                    
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center`}>{color.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1"><span className="text-xs font-bold text-[#464652]">{subject.subject}</span><span className={`text-xs font-bold ${color.text}`}>{subject.accuracy}%</span></div>
                          <div className={`h-1.5 w-full ${color.barBg} rounded-full`}><div className={`h-full ${color.bar} rounded-full`} style={{ width: `${subject.accuracy}%` }}/></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MONTHLY TAB */}
          {activeTab === "monthly" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-5">
              
              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(20,23,121,0.1)] flex items-center justify-center">
                    <Calendar size={20} color="#141779" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#191c1e]">This Month</h2>
                    <p className="text-xs text-[#767683]">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Overview</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-[#f2f4f6] p-4 rounded-xl border border-gray-100 mb-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#767683] uppercase">Active Days</p>
                    <p className="text-2xl font-bold text-[#141779]">
                      {reportData?.monthlyStats?.activeDays ?? 0}<span className="text-lg text-gray-400">/{reportData?.monthlyStats?.totalDaysInMonth ?? 30}</span>
                    </p>
                  </div>
                  <div className="w-[1px] h-10 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#767683] uppercase">Hours</p>
                    <p className="text-2xl font-bold text-[#006a62]">{reportData?.monthlyStats?.timeHours ?? 0}</p>
                  </div>
                  <div className="w-[1px] h-10 bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#767683] uppercase">Bosses Defeated</p>
                    <p className="text-2xl font-bold text-[#ba1a1a]">{reportData?.monthlyStats?.bossesDefeated ?? 0}</p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-3 items-start">
                  <AlertTriangle size={20} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-orange-800">Attention Needed</p>
                    <p className="text-[11px] text-orange-700 mt-0.5">{reportData?.weaknesses || "Keep practicing to identify areas needing improvement."}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)]">
                <h3 className="text-sm font-bold text-[#191c1e] mb-3">Recent Badges</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  <div className="min-w-[100px] bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                    <Trophy size={28} className="text-yellow-600 mb-2" />
                    <p className="text-xs font-bold text-yellow-800">Math Whiz</p>
                    <p className="text-[9px] text-yellow-600">Recent</p>
                  </div>
                  <div className="min-w-[100px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                    <Star size={28} className="text-blue-600 mb-2" />
                    <p className="text-xs font-bold text-blue-800">7-Day Streak</p>
                  </div>
                  <div className="min-w-[100px] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                    <CheckCircle size={28} className="text-green-600 mb-2" />
                    <p className="text-xs font-bold text-green-800">Consistent</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6 MONTH TAB */}
          {activeTab === "6month" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-5">
              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[rgba(48,0,127,0.1)] flex items-center justify-center">
                    <TrendingUp size={20} color="#30007f" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#191c1e]">6-Month Trend</h2>
                    <p className="text-xs text-[#767683]">Accuracy score per month</p>
                  </div>
                </div>

                <div className="h-40 flex items-end justify-between gap-2 px-2 border-b border-gray-200 pb-2 mb-4">
                  {(reportData?.sixMonthTrend ?? [{month:'',score:0},{month:'',score:0},{month:'',score:0},{month:'',score:0},{month:'',score:0},{month:'',score:0}]).map((m: any, i: number) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-2">
                      <div
                        className="w-full bg-[#30007f] rounded-t-md opacity-80 transition-all duration-700"
                        style={{ height: `${Math.max(4, m.score)}%` }}
                      ></div>
                      <span className="text-[9px] font-bold text-[#767683]">{m.month}</span>
                    </div>
                  ))}
                </div>
                {(() => {
                  const trend = reportData?.sixMonthTrend ?? [];
                  if (trend.length < 2) return <p className="text-xs text-[#767683] text-center">Complete more quests to build your trend!</p>;
                  const first = trend[0]?.score ?? 0;
                  const last = trend[trend.length - 1]?.score ?? 0;
                  const diff = last - first;
                  return (
                    <>
                      <p className="text-sm font-bold text-[#464652] text-center mb-1">{diff >= 0 ? `Upward Trajectory! 🚀` : `Keep Going! 💪`}</p>
                      <p className="text-xs text-[#767683] text-center">
                        Accuracy {diff >= 0 ? 'increased' : 'changed'} by {Math.abs(diff)}% over 6 months.
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)]">
                <h3 className="text-sm font-bold text-[#191c1e] mb-3">Skill Evolution</h3>
                <div className="space-y-3">
                  {(reportData?.subjectBreakdown ?? []).slice(0,3).map((sb: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Target size={18} className="text-green-600"/>
                        <span className="text-xs font-bold text-[#464652]">{sb.subject}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        sb.accuracy >= 80 ? 'text-green-600 bg-green-50' :
                        sb.accuracy >= 60 ? 'text-blue-600 bg-blue-50' : 'text-orange-600 bg-orange-50'
                      }`}>{sb.accuracy >= 80 ? 'Mastered' : sb.accuracy >= 60 ? 'Improving' : 'Needs Work'}</span>
                    </div>
                  ))}
                  {(!reportData?.subjectBreakdown || reportData.subjectBreakdown.length === 0) && (
                    <p className="text-xs text-[#767683]">Complete more quests to see skill evolution!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* YEARLY TAB */}
          {activeTab === "yearly" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-5">
              <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl p-5 border-[1.5px] border-[rgba(255,255,255,0.4)] shadow-[0_4px_20px_rgba(20,23,121,0.05)] text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#141779] to-[#006a62] flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Award size={32} color="white" />
                </div>
                <h2 className="text-xl font-bold text-[#191c1e]">{new Date().getFullYear()} Annual Review</h2>
                <p className="text-xs text-[#767683] mb-5">Your learning journey so far</p>
                
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-800 uppercase mb-1">Total Hours</p>
                    <p className="text-2xl font-bold text-indigo-900">{reportData?.yearlyStats?.timeHours ?? 0}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase mb-1">Levels Gained</p>
                    <p className="text-2xl font-bold text-emerald-900">{reportData?.yearlyStats?.levelsGained ?? 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-purple-800 uppercase mb-1">Questions Solved</p>
                      <p className="text-2xl font-bold text-purple-900">{(reportData?.yearlyStats?.questionsSolved ?? 0).toLocaleString()}</p>
                    </div>
                    <BookOpenCheck size={36} className="text-purple-300" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#141779] to-[#30007f] rounded-2xl p-5 shadow-lg text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={20} className="text-yellow-400" />
                  <h3 className="text-sm font-bold">Strengths & Recommendation</h3>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  {reportData?.strengths || "Keep learning and exploring to unlock personalised recommendations!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      )}
    </div>
  );
}
