import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, ShieldAlert, Star, TrendingUp, Search, Calendar, FileText, Activity, X, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "../../../api";

export default function KidsActivityScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [engagementHours, setEngagementHours] = useState("0");
  const [engagementTrend, setEngagementTrend] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [openDateLabel, setOpenDateLabel] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null) return "0 sec";
    if (seconds < 60) return `${seconds} sec`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} mins`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const hourStr = hours === 1 ? "hour" : "hrs";
    if (remainingMins === 0) return `${hours} ${hourStr}`;
    return `${hours} ${hourStr} ${remainingMins} mins`;
  };

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        // Fetching real data from the backend
        // Pass browser timezone offset so server computes "today" in local time
        const tzOffset = -new Date().getTimezoneOffset(); // positive for east of UTC (IST = +330)
        const res = await apiFetch(`/api/parent/activities?tz_offset_minutes=${tzOffset}`);

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setActivities(json.data.activities || []);
            setEngagementHours(json.data.engagementHours || "0");
            setEngagementTrend(json.data.engagementTrend !== undefined ? json.data.engagementTrend : null);
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const getIconData = (type: string) => {
    switch (type) {
      case "quiz": return { icon: <CheckCircle2 className="text-[#007168]" size={20} />, bgColor: "bg-[#007168]/10" };
      case "scan": return { icon: <Search className="text-[#141779]" size={20} />, bgColor: "bg-[#141779]/10" };
      case "milestone": return { icon: <Star className="text-[#ff5e00]" size={20} />, bgColor: "bg-[#ff5e00]/10" };
      case "struggle": return { icon: <ShieldAlert className="text-[#ba1a1a]" size={20} />, bgColor: "bg-[#ba1a1a]/10" };
      case "chapter": return { icon: <FileText className="text-[#30007f]" size={20} />, bgColor: "bg-[#30007f]/10" };
      default: return { icon: <Activity className="text-[#464652]" size={20} />, bgColor: "bg-gray-100" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] font-sans pb-24 relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[10%] -right-[20%] w-[350px] h-[350px] rounded-full bg-[rgba(87,250,233,0.15)] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[20%] w-[400px] h-[400px] rounded-full bg-[rgba(20,23,121,0.08)] blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center gap-4 px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50 shadow-sm">
        <button 
          onClick={() => navigate("/parent/dashboard")} 
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft size={22} className="text-[#141779]" />
        </button>
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#141779] to-[#30007f]">
          Recent Activity
        </h1>
      </header>

      <main className="px-5 pt-6 relative z-10">
        
        {/* Analytics Summary Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-[24px] p-6 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-[#767683] uppercase tracking-wider mb-1">Weekly Engagement</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#141779]">{engagementHours}</span>
              {engagementTrend !== null && engagementTrend !== undefined && (
                <span className={`text-[14px] font-bold flex items-center gap-1 ${engagementTrend >= 0 ? 'text-[#007168]' : 'text-[#ba1a1a]'}`}>
                  {engagementTrend >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />} 
                  {engagementTrend >= 0 ? '+' : ''}{engagementTrend}%
                </span>
              )}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#141779]/10 flex items-center justify-center">
            <Clock size={28} className="text-[#141779]" />
          </div>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-[24px] border border-white/60 shadow-sm">
            <Activity className="mx-auto text-gray-400 mb-3" size={32} />
            <h3 className="text-[16px] font-bold text-[#141779]">No recent activity</h3>
            <p className="text-[14px] text-[#767683] mt-1">Your child hasn't completed any activities yet.</p>
          </div>
        ) : (
          <div className="relative">
            {Object.entries(
              activities.reduce((acc, activity) => {
                const dateStr = activity.createdAt ? new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Today";
                const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const yesterday = new Date(Date.now() - 86400000);
                const yesterdayStr = yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                let groupLabel = dateStr;
                if (dateStr === todayStr) groupLabel = "Today";
                else if (dateStr === yesterdayStr) groupLabel = "Yesterday";
                
                if (!acc[groupLabel]) {
                  acc[groupLabel] = {
                    label: groupLabel,
                    activities: [],
                    totalTime: 0
                  };
                }
                acc[groupLabel].activities.push(activity);
                if (activity.timeTaken) {
                  acc[groupLabel].totalTime += activity.timeTaken;
                }
                return acc;
              }, {} as Record<string, { label: string, activities: any[], totalTime: number }>)
            ).map(([dateLabel, groupObj], groupIdx) => {
              const group = groupObj as { label: string, activities: any[], totalTime: number };
              const isOpen = openDateLabel === null ? groupIdx === 0 : openDateLabel === dateLabel;
              
              return (
                <div key={dateLabel} className="mb-6 bg-white/70 backdrop-blur-md rounded-[20px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
                  {/* Accordion Header */}
                  <button 
                    onClick={() => setOpenDateLabel(isOpen ? "" : dateLabel)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="text-[#141779]" size={20} />
                      <span className="text-[16px] font-extrabold text-[#141779]">{dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {group.totalTime > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#30007f]/10 rounded-full text-[#30007f]">
                          <Clock size={14} />
                          <span className="text-[13px] font-bold">{formatTime(group.totalTime)}</span>
                        </div>
                      )}
                      <div className="text-[#141779] opacity-70">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </button>
                  
                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="p-5 pt-2 border-t border-gray-100/50 bg-white/30">
                      <div className="relative pl-6 pt-4 before:content-[''] before:absolute before:left-[11px] before:top-6 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#141779]/30 before:to-transparent">
                        {group.activities.map((activity: any, index: number) => {
                          const { icon, bgColor } = getIconData(activity.type);
                          return (
                            <div key={activity.id || `${groupIdx}-${index}`} className="relative mb-6 group animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}>
                              
                              {/* Timeline Dot */}
                              <div className={`absolute -left-[25px] w-8 h-8 rounded-full ${bgColor} border-[2px] border-white shadow-sm flex items-center justify-center z-10 group-hover:scale-110 transition-transform`}>
                                <div className="scale-75">{icon}</div>
                              </div>
                              
                              {/* Content Card */}
                              <div 
                                onClick={() => activity.details && setSelectedActivity(activity)}
                                className={`ml-8 bg-white/90 rounded-[16px] p-4 border border-white/60 shadow-sm hover:shadow-md transition-all ${activity.details ? 'cursor-pointer hover:scale-[1.01]' : 'cursor-default'}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-[15px] font-bold text-[#141779] pr-4">{activity.title}</h3>
                                  <span className="text-[11px] font-bold text-[#767683] whitespace-nowrap bg-gray-100/80 px-2 py-1 rounded-md flex items-center gap-1">
                                    <Clock size={11} /> {activity.time || (activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now")}
                                  </span>
                                </div>
                                
                                {activity.description && (
                                  <p className="text-[13px] text-[#464652] font-medium leading-snug mb-3">
                                    {activity.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {activity.correctQuestions !== undefined && activity.totalQuestions !== undefined && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#007168]/10 text-[#007168]">
                                      <CheckCircle2 size={12} />
                                      <span className="text-[12px] font-extrabold tracking-wide">
                                        {activity.correctQuestions}/{activity.totalQuestions}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {activity.timeTaken !== undefined && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#30007f]/10 text-[#30007f]">
                                      <Clock size={12} />
                                      <span className="text-[12px] font-extrabold tracking-wide">
                                        {formatTime(activity.timeTaken)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* End of timeline indicator */}
        {!loading && activities.length > 0 && (
          <div className="text-center mt-6 mb-8">
            <p className="text-[13px] font-bold text-[#767683]">No more recent activity</p>
          </div>
        )}

      </main>

      {/* Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[24px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-5">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-[32px] sm:rounded-[24px]">
              <div>
                <h2 className="text-[20px] font-black text-[#141779]">{selectedActivity.title}</h2>
                <div className="flex gap-3 mt-1">
                  <span className="text-sm font-bold text-[#007168] flex items-center gap-1">
                    <CheckCircle2 size={14} /> {selectedActivity.correctQuestions}/{selectedActivity.totalQuestions}
                  </span>
                  <span className="text-sm font-bold text-[#30007f] flex items-center gap-1">
                    <Clock size={14} /> {formatTime(selectedActivity.timeTaken)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all shrink-0"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#f4efff]/30">
              <h3 className="text-sm font-extrabold text-[#767683] uppercase tracking-wider mb-4">Question Breakdown</h3>
              
              <div className="flex flex-col gap-3">
                {selectedActivity.details.map((detail: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm flex gap-4 items-start">
                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${detail.isCorrect ? 'bg-[#007168]/10 text-[#007168]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                      {detail.isCorrect ? <CheckCircle2 size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-[#4b4b4b] mb-2 leading-snug">{detail.questionText}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-[#767683]">
                        <Clock size={12} />
                        <span className="text-[12px] font-bold">
                          {formatTime(detail.timeSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
