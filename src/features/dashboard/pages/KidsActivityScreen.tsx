import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, ShieldAlert, Star, TrendingUp, Search, Calendar, FileText, Activity, X, ChevronDown, ChevronUp, BookOpen, Layers, ChevronRight } from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

export default function KidsActivityScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cached = (() => {
    try {
      const raw = sessionStorage.getItem("kids_activities_cache");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  const [loading, setLoading] = useState(!cached);
  const [activities, setActivities] = useState<any[]>(cached?.activities || []);
  const [engagementHours, setEngagementHours] = useState(cached?.engagementHours || "0");
  const [engagementTrend, setEngagementTrend] = useState<number | null>(cached?.engagementTrend !== undefined ? cached.engagementTrend : null);
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
        if (!cached) setLoading(true);
        const tzOffset = -new Date().getTimezoneOffset();
        const res = await apiFetch(`/api/parent/activities?tz_offset_minutes=${tzOffset}`);

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setActivities(json.data.activities || []);
            setEngagementHours(json.data.engagementHours || "0");
            setEngagementTrend(json.data.engagementTrend !== undefined ? json.data.engagementTrend : null);
            sessionStorage.setItem("kids_activities_cache", JSON.stringify({
              activities: json.data.activities || [],
              engagementHours: json.data.engagementHours || "0",
              engagementTrend: json.data.engagementTrend !== undefined ? json.data.engagementTrend : null
            }));
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
      case "quiz": return { icon: <CheckCircle2 className="text-[#006a62]" size={20} />, bgColor: "bg-teal-100" };
      case "scan": return { icon: <Search className="text-[#141779]" size={20} />, bgColor: "bg-indigo-100" };
      case "milestone": return { icon: <Star className="text-amber-600" size={20} />, bgColor: "bg-amber-100" };
      case "struggle": return { icon: <ShieldAlert className="text-red-600" size={20} />, bgColor: "bg-red-100" };
      case "chapter": return { icon: <FileText className="text-[#30007f]" size={20} />, bgColor: "bg-indigo-100" };
      case "reading": return { icon: <BookOpen className="text-[#006a62]" size={20} />, bgColor: "bg-teal-100" };
      default: return { icon: <Activity className="text-slate-500" size={20} />, bgColor: "bg-slate-100" };
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f0f4f8] to-[#e6eef5] text-[#141779] flex flex-col min-h-screen w-full relative overflow-x-hidden font-sans">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs flex items-center px-6 h-16 gap-3">
        <button 
          onClick={() => navigate("/parent/dashboard")} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} className="text-[#141779]" />
        </button>
        <h1 className="text-xl font-black text-[#141779] tracking-tight">
          Recent Activity
        </h1>
      </header>

      <main className="w-full max-w-lg mx-auto pt-20 pb-32 px-5 relative z-10">
        
        {/* Analytics Summary Card */}
        {loading ? (
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md mb-5 flex items-center justify-between animate-pulse">
            <div className="flex-1">
              <div className="h-3 w-32 bg-slate-200 rounded mb-3"></div>
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-200"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-md mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Weekly Engagement</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#141779]">{engagementHours}</span>
                {engagementTrend !== null && engagementTrend !== undefined && (
                  <span className={`text-sm font-black flex items-center gap-1 ${engagementTrend >= 0 ? 'text-[#006a62]' : 'text-red-600'}`}>
                    {engagementTrend >= 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />} 
                    {engagementTrend >= 0 ? '+' : ''}{engagementTrend}%
                  </span>
                )}
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#141779] shadow-xs">
              <Clock size={28} />
            </div>
          </div>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="flex flex-col gap-4 mt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[20px] p-4 flex gap-4 animate-pulse border border-slate-200">
                <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
                <div className="flex-1 flex flex-col gap-2 justify-center">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[24px] border border-slate-200/80 shadow-sm p-6">
            <Activity className="mx-auto text-slate-400 mb-3" size={32} />
            <h3 className="text-base font-black text-[#141779]">No recent activity</h3>
            <p className="text-xs font-bold text-slate-600 mt-1">Your child hasn't completed any activities yet.</p>
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
                <div key={dateLabel} className="mb-4 bg-white rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300">
                  {/* Accordion Header */}
                  <button 
                    onClick={() => setOpenDateLabel(isOpen ? "" : dateLabel)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="text-[#141779]" size={20} />
                      <span className="text-base font-black text-[#141779]">{dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {group.totalTime > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[#141779]">
                          <Clock size={14} />
                          <span className="text-xs font-black">{formatTime(group.totalTime)}</span>
                        </div>
                      )}
                      <div className="text-[#141779]">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </button>
                  
                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="p-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                      <div className="relative pl-6 pt-2 before:content-[''] before:absolute before:left-[11px] before:top-4 before:bottom-2 before:w-[2px] before:bg-slate-200">
                        {group.activities.map((activity: any, index: number) => {
                          const { icon, bgColor } = getIconData(activity.type);
                          return (
                            <div key={activity.id || `${groupIdx}-${index}`} className="relative mb-4 group">
                              
                              {/* Timeline Dot */}
                              <div className={`absolute -left-[25px] w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-xs flex items-center justify-center z-10 group-hover:scale-110 transition-transform`}>
                                <div className="scale-75">{icon}</div>
                              </div>
                              
                              {/* Content Card */}
                              <div 
                                onClick={() => setSelectedActivity(activity)}
                                className="ml-6 bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
                              >
                                <div className="flex justify-between items-start mb-1.5">
                                  <h3 className="text-sm font-black text-[#141779] pr-3 leading-tight">{activity.title}</h3>
                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                      <Clock size={10} /> {activity.time || (activity.createdAt ? new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now")}
                                    </span>
                                  </div>
                                </div>

                                {activity.description && (
                                  <p className="text-xs text-slate-700 font-bold leading-snug mb-2">
                                    {activity.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {activity.correctQuestions !== undefined && activity.totalQuestions !== undefined && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#006a62]">
                                      <CheckCircle2 size={12} />
                                      <span className="text-xs font-black tracking-wide">
                                        {activity.correctQuestions}/{activity.totalQuestions}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {activity.timeTaken !== undefined && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#141779]">
                                      <Clock size={12} />
                                      <span className="text-xs font-black tracking-wide">
                                        {formatTime(activity.timeTaken)}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {activity.subject && (
                                    <div className="ml-auto flex items-center gap-2">
                                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                                        <Layers size={10} />
                                        <span className="text-[10px] font-black uppercase tracking-wide truncate max-w-[100px]">{activity.subject}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {activity.type === 'reading' || !activity.details || activity.details.length === 0 ? (
                                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-black">
                                    <span className="flex items-center gap-1 text-slate-600 font-bold">
                                      <BookOpen size={12} className="text-slate-500" />
                                      {activity.type === 'reading' ? 'Reading Session' : '0 Questions'}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-[#141779] font-black hover:underline transition-all">
                                      {activity.type === 'reading' ? 'view details' : 'show more'} <ChevronRight size={14} className="mt-[0.5px]" />
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-black">
                                    <span className="flex items-center gap-1 text-slate-600 font-bold">
                                      <BookOpen size={12} className="text-slate-500" />
                                      {activity.details.length} {activity.details.length === 1 ? 'Question' : 'Questions'}
                                    </span>
                                    <span className="flex items-center gap-0.5 text-[#141779] font-black hover:underline transition-all">
                                      show more <ChevronRight size={14} className="mt-[0.5px]" />
                                    </span>
                                  </div>
                                )}
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

      </main>

      {/* Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[24px] max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-5">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-[32px] sm:rounded-[24px]">
              <div>
                <h2 className="text-lg font-black text-[#141779]">{selectedActivity.title}</h2>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs font-black text-[#006a62] flex items-center gap-1">
                    <CheckCircle2 size={14} /> {selectedActivity.correctQuestions}/{selectedActivity.totalQuestions}
                  </span>
                  <span className="text-xs font-black text-[#141779] flex items-center gap-1">
                    <Clock size={14} /> {formatTime(selectedActivity.timeTaken)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="w-9 h-9 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shrink-0"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">
                {selectedActivity.type === 'reading' ? 'Session Details' : 'Question Breakdown'}
              </h3>
              
              <div className="flex flex-col gap-3">
                {Array.isArray(selectedActivity.details) && selectedActivity.details.length > 0 ? (
                  selectedActivity.details.map((detail: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-[20px] p-4 border border-slate-200/80 shadow-xs flex gap-4 items-start">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${detail.isCorrect ? 'bg-teal-50 border border-teal-200 text-[#006a62]' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                        {detail.isCorrect ? <CheckCircle2 size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-slate-800 mb-2 leading-snug">{detail.questionText}</p>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                          <Clock size={12} />
                          <span className="text-xs font-black">
                            {formatTime(detail.timeSpent)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[24px] p-8 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center">
                    <BookOpen size={48} className="text-slate-400 mb-4" />
                    <p className="text-base font-black text-[#141779]">
                      {selectedActivity.type === 'reading' ? 'Reading Session' : 'No Details Available'}
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-2 max-w-[240px] mx-auto leading-relaxed">
                      {selectedActivity.type === 'reading' 
                        ? 'No questions were attempted during this reading session.' 
                        : 'There is no detailed question breakdown for this activity.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

