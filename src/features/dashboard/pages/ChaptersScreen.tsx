import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Rocket, Sun, Compass, Globe, Moon, CheckCircle, Lock, Bell, Sparkles, Trophy, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";

export default function ChaptersScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [chapterProgressMap, setChapterProgressMap] = useState<Record<string, any>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [childName, setChildName] = useState("Kid");
  const [childPhoto, setChildPhoto] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const cached = localStorage.getItem("userData");
        if (cached) {
          try {
            const u = JSON.parse(cached);
            setChildName(u.childName || u.name || "Kid");
            setChildPhoto(u.childPhoto || u.photo || "");
            setIsSubscribed(Boolean(u.is_subscribed || u.isSubscribed));
          } catch (e) { }
        }
        const meRes = await apiFetch("/api/users/me");
        const meJson = await meRes.json();
        if (meJson.success && meJson.data?.user) {
          setChildName(meJson.data.user.childName || meJson.data.user.name || "Kid");
          setChildPhoto(meJson.data.user.childPhoto || meJson.data.user.photo || "");
          setIsSubscribed(Boolean(meJson.data.user.is_subscribed || meJson.data.user.isSubscribed));
        }
      } catch (e) { }

      try {
        const notifRes = await apiFetch("/api/notifications");
        const notifData = await notifRes.json();
        if (notifData.success && notifData.data) {
          setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) { }

      try {
        const [subRes, controlsRes] = await Promise.all([
          apiFetch("/api/practice/subjects"),
          apiFetch("/api/parent/controls")
        ]);

        let subData: any = { success: false, data: [] };
        try {
          if (subRes.ok) subData = await subRes.json();
        } catch (e) { }

        let controlsData: any = { success: false };
        try {
          if (controlsRes.ok) controlsData = await controlsRes.json();
        } catch (e) { }

        let restricted: Record<string, boolean> = {};
        if (controlsData?.success && controlsData.data?.parentControls?.restrictedSubjects) {
          restricted = controlsData.data.parentControls.restrictedSubjects;
        }

        if (subData?.success && Array.isArray(subData.data) && subData.data.length > 0) {
          const allowedSubjects = subData.data.filter((s: any) => !restricted[s.name]);

          if (allowedSubjects.length > 0) {
            setSubjects(allowedSubjects);
            const savedSubjectId = sessionStorage.getItem("activeSubjectId");
            const found = allowedSubjects.find((s: any) => s._id === savedSubjectId);
            if (found) {
              setActiveSubject(found);
            } else {
              setActiveSubject(allowedSubjects[0]);
              sessionStorage.setItem("activeSubjectId", allowedSubjects[0]._id);
            }
          } else {
            setSubjects([]);
            setLoading(false);
          }
        } else {
          setSubjects([]);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch subjects", e);
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!activeSubject) return;

    const fetchChapters = async () => {
      setLoading(true);
      try {
        const [chRes, pRes] = await Promise.all([
          apiFetch(`/api/practice/chapters/${activeSubject._id}`),
          apiFetch(`/api/practice/chapter-progress`)
        ]);

        let chData: any = { success: false, data: [] };
        try {
          if (chRes.ok) chData = await chRes.json();
        } catch (e) { }

        let pData: any = { success: false, data: [] };
        try {
          if (pRes.ok) pData = await pRes.json();
        } catch (e) { }

        if (chData?.success && Array.isArray(chData.data)) {
          setChapters(chData.data);
        } else {
          setChapters([]);
        }

        if (pData?.success && Array.isArray(pData.data)) {
          const progMap: Record<string, any> = {};
          pData.data.forEach((p: any) => {
            if (p.completed && !p.chapterCompleted) p.chapterCompleted = true;
            progMap[p.chapterId] = p;
          });
          setChapterProgressMap(progMap);

          const completedIds = pData.data
            .filter((p: any) => p.chapterCompleted || p.completed)
            .map((p: any) => p.chapterId);
          setCompletedChapters(completedIds);
        }
      } catch (e) {
        console.error("Failed to fetch chapters");
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [activeSubject]);

  const totalChapters = chapters.length;
  const isChapterCompleted = (chapterId: string) => completedChapters.includes(chapterId) || completedChapters.includes(`${chapterId}_hard`);
  const completedChaptersCount = chapters.filter(ch => isChapterCompleted(ch._id)).length;

  let totalCompletedMissionsCount = 0;
  chapters.forEach(ch => {
    const prog = chapterProgressMap[ch._id] || {};
    const missions = prog.completedMissions || [];
    if (Array.isArray(missions)) {
      totalCompletedMissionsCount += missions.length;
    } else if (prog.chapterCompleted || prog.completed) {
      totalCompletedMissionsCount += 4;
    }
  });

  const totalMissions = Math.max(1, totalChapters * 4);
  const missionProgressPercent = (totalCompletedMissionsCount / totalMissions) * 100;
  const chapterProgressPercent = totalChapters > 0 ? (completedChaptersCount / totalChapters) * 100 : 0;
  const progressPercent = Math.max(missionProgressPercent, chapterProgressPercent);

  const currentChapterIndex = chapters.findIndex(ch => !isChapterCompleted(ch._id));
  const activeCurrentChapter = currentChapterIndex >= 0 ? chapters[currentChapterIndex] : chapters[chapters.length - 1];

  const handleToggleChapter = async (index: number, chapterId: string, chapterName: string) => {
    if (index >= 1 && !isSubscribed) {
      setShowSubModal(true);
      return;
    }
    const progress = chapterProgressMap[chapterId] || {};
    if (!progress.readingCompleted) {
      navigate(`/chapter-reader?chapterId=${chapterId}&title=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    } else {
      navigate(`/mission-roadmap?chapterId=${chapterId}&title=${encodeURIComponent(chapterName)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] via-[#EEF1FF] to-[#FFFFFF] text-[#17157F] font-sans pb-28 relative selection:bg-[#5B5CFF] selection:text-white overflow-x-hidden">
      {/* Background World Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#5B5CFF]/10 blur-[90px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#FFC83D]/15 blur-[90px]" />
      </div>

      {/* TOP APP BAR / GAME HUD */}
      <header className="flex flex-col bg-white/85 backdrop-blur-md border-b border-[#E0E3E5] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16 max-w-[430px] mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate("/home")} 
              className="w-9 h-9 rounded-full bg-[#F5F3FF] border border-[#E0E3E5] hover:bg-[#EEF1FF] flex items-center justify-center transition-all active:scale-95 shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={18} className="text-[#17157F]" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full border-2 border-white bg-[#17157F] overflow-hidden hover:opacity-90 transition-opacity shrink-0 shadow-sm"
            >
              {childPhoto ? (
                <img src={childPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(childName || "Kid")}&background=random`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </button>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#5B5CFF] block leading-none">
                LEVEL {Math.min(99, completedChaptersCount + 1)} ADVENTURER
              </span>
              <h1 className="text-sm font-black text-[#17157F] tracking-wide uppercase leading-tight">
                LEARNING JOURNEY
              </h1>
            </div>
          </div>

          {/* Right Notification Bell */}
          <button
            onClick={() => navigate("/notifications")}
            className="w-9 h-9 rounded-full bg-white border border-[#E0E3E5] shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shrink-0"
          >
            <div className="relative">
              <Bell size={18} className="text-[#17157F]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-black border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* SUBJECT SELECTION TABS */}
        {subjects.length > 0 && (
          <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2.5 gap-2 max-w-[430px] mx-auto w-full pr-6">
            {subjects.map((sub) => {
              const isActive = activeSubject?._id === sub._id;
              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setActiveSubject(sub);
                    sessionStorage.setItem("activeSubjectId", sub._id);
                  }}
                  className={`px-4 py-1.5 rounded-full font-black text-xs whitespace-nowrap transition-all uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#5B5CFF] to-[#17157F] text-white shadow-md border border-[#5B5CFF]' 
                      : 'bg-white text-[#767683] border border-[#E0E3E5] hover:border-[#5B5CFF]/60'
                  }`}
                >
                  <Globe size={13} className={isActive ? "text-[#FFC83D]" : "text-[#767683]"} />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN ADVENTURE CONTENT */}
      <main className="px-4 pt-4 max-w-[430px] mx-auto w-full relative z-10 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="bg-white rounded-2xl p-5 border border-[#E0E3E5] shadow-sm flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded-full w-full mt-2" />
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white rounded-2xl border border-[#E0E3E5]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* MISSION PROGRESS HERO CARD */}
            <section className="bg-white border-2 border-[#E0E3E5] rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Rocket size={16} className="text-[#5B5CFF]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#17157F]">
                    🚀 YOUR JOURNEY
                  </span>
                </div>
                <span className="text-[10px] font-black text-[#006a62] bg-[#35E5D4]/20 px-2 py-0.5 rounded-full border border-[#35E5D4]/50">
                  {completedChaptersCount} OF {totalChapters} MISSIONS
                </span>
              </div>

              <div className="mb-2.5">
                <h2 className="text-base font-black text-[#17157F] leading-tight">
                  {activeCurrentChapter ? activeCurrentChapter.name : "Journey Completed!"}
                </h2>
              </div>

              {/* Progress Bar & Percentage Alignment */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-[#EEF1FF] rounded-full overflow-hidden p-0.5 border border-[#E0E3E5]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#5B5CFF] via-[#35E5D4] to-[#45D483] rounded-full shadow-sm"
                  />
                </div>
                <span className="text-xs font-black text-[#17157F] shrink-0">
                  {Math.round(progressPercent)}%
                </span>
              </div>

              <p className="text-[10px] font-bold text-[#5B5CFF] mt-2 italic">
                {completedChaptersCount === totalChapters 
                  ? "🎉 You mastered this entire learning world!" 
                  : "Keep going! Your next mission is waiting."}
              </p>
            </section>

            {/* VERTICAL LEARNING ADVENTURE MAP WITH FIXED TIMELINE AXIS */}
            <section className="relative py-2 flex flex-col gap-5">
              {/* Continuous Vertical Timeline Axis Line (Centered on 28px inside 56px Timeline Column) */}
              <div className="absolute left-[28px] top-6 bottom-6 w-1 -translate-x-1/2 bg-gradient-to-b from-[#45D483] via-[#5B5CFF] to-[#B9BBC8]/40 -z-10 rounded-full" />

              {chapters.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-8 border-2 border-[#E0E3E5] border-dashed text-center my-4">
                  <Rocket size={40} className="text-[#5B5CFF] mb-2" />
                  <p className="text-sm font-bold text-[#17157F]">New Missions Launching Soon!</p>
                  <p className="text-xs text-[#767683] mt-1">Check back shortly for new adventures in {activeSubject?.name}.</p>
                </div>
              ) : (
                chapters.map((chap, index) => {
                  const isCompleted = isChapterCompleted(chap._id);
                  const isCurrent = !isCompleted && index === currentChapterIndex;
                  const status = isCompleted ? "completed" : isCurrent ? "current" : "locked";
                  const isSubLocked = index >= 1 && !isSubscribed;
                  const isExpanded = expandedChapter === chap._id;

                  // Accordion Options for Completed Chapter
                  const renderQuestions = () => (
                    isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-100 w-full text-left flex flex-col gap-2"
                      >
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/chapter-reader?chapterId=${chap._id}&title=${encodeURIComponent(`${index + 1}. ${chap.name}`)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`); 
                          }} 
                          className="bg-[#EEF1FF] border border-[#5B5CFF]/30 text-[#17157F] px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#5B5CFF] hover:text-white transition-all flex items-center justify-between"
                        >
                          <span>📖 Read Chapter PDF</span>
                          <ChevronRight size={16} />
                        </button>

                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/chapter-questions?chapterId=${chap._id}&chapterName=${encodeURIComponent(`${index + 1}. ${chap.name}`)}&subjectName=${encodeURIComponent(activeSubject?.name || "")}`); 
                          }} 
                          className="bg-[#EEF1FF] border border-[#5B5CFF]/30 text-[#17157F] px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#5B5CFF] hover:text-white transition-all flex items-center justify-between"
                        >
                          <span>⚡ Practice Mission Questions</span>
                          <ChevronRight size={16} />
                        </button>

                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/boss-battle?worldId=w1&chapterId=${chap._id}&difficulty=easy&returnTo=/practice/journey-map&subjectName=${encodeURIComponent(activeSubject?.name || "")}&chapterName=${encodeURIComponent(`${index + 1}. ${chap.name}`)}`); 
                          }} 
                          className="bg-[#FFC83D]/20 border border-[#FFC83D] text-[#17157F] px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-[#FFC83D] transition-all flex items-center justify-between"
                        >
                          <span>🏆 Chapter Boss Round</span>
                          <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    )
                  );

                  return (
                    <div key={chap._id} className="flex items-start gap-3 w-full">
                      {/* FIXED TIMELINE COLUMN (56px Wide - Exact Center Alignment across all nodes) */}
                      <div className="w-14 shrink-0 flex items-center justify-center pt-1">
                        {status === "completed" && (
                          <div className="w-11 h-11 rounded-full bg-[#45D483] border-4 border-white text-white flex items-center justify-center shadow-md">
                            <CheckCircle size={22} strokeWidth={2.5} />
                          </div>
                        )}
                        {status === "current" && (
                          <div className="w-11 h-11 rounded-full bg-[#5B5CFF] border-4 border-white text-white flex items-center justify-center shadow-[0_0_16px_rgba(91,92,255,0.6)] animate-pulse">
                            <Rocket size={20} className="text-[#FFC83D]" />
                          </div>
                        )}
                        {status === "locked" && (
                          <div className={`w-11 h-11 rounded-full border-4 flex items-center justify-center ${
                            isSubLocked 
                              ? 'bg-[#FEF3C7] border-white text-[#D97706]' 
                              : 'bg-[#F1F3F5] border-white text-[#B9BBC8]'
                          }`}>
                            <Lock size={18} className={isSubLocked ? 'text-[#D97706]' : 'text-[#B9BBC8]'} />
                          </div>
                        )}
                      </div>

                      {/* CHAPTER CARD (RIGHT OF TIMELINE) */}
                      <div className="flex-1 min-w-0">
                        {status === "completed" && (
                          <div className="bg-white border-2 border-[#45D483]/60 rounded-2xl p-3.5 shadow-sm transition-all">
                            <button 
                              onClick={() => {
                                if (expandedChapter === chap._id) setExpandedChapter(null);
                                else setExpandedChapter(chap._id);
                              }} 
                              className="flex items-center justify-between text-left w-full"
                            >
                              <div className="flex-1 pr-2">
                                <span className="text-[9px] font-black uppercase tracking-wider text-[#45D483] bg-[#45D483]/15 px-2 py-0.5 rounded-full border border-[#45D483]/40 inline-block mb-1">
                                  ✓ MISSION COMPLETED
                                </span>
                                <p className="text-[10px] font-bold text-[#767683]">
                                  Chapter {index + 1}
                                </p>
                                <h3 className="text-sm font-black text-[#17157F] leading-tight">
                                  {chap.name}
                                </h3>
                              </div>
                              <span className="text-xs text-[#5B5CFF] font-bold underline shrink-0">
                                {isExpanded ? "Close" : "Review"}
                              </span>
                            </button>
                            {renderQuestions()}
                          </div>
                        )}

                        {status === "current" && (
                          <div className={`flex-1 ${isSubLocked ? 'bg-amber-50 border-amber-300' : 'bg-gradient-to-br from-white to-[#EEF1FF] border-2 border-[#5B5CFF] shadow-[0_4px_16px_rgba(91,92,255,0.2)]'} rounded-2xl p-4 relative overflow-hidden transition-all`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${isSubLocked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#5B5CFF] text-white border-[#5B5CFF]'}`}>
                                {isSubLocked ? '👑 PREMIUM MISSION 🔒' : '🚀 CURRENT MISSION'}
                              </span>
                            </div>

                            <p className="text-[11px] font-bold text-[#5B5CFF] mb-0.5">
                              Chapter {index + 1}
                            </p>
                            <h3 className="text-base font-black text-[#17157F] leading-tight mb-2.5">
                              {chap.name}
                            </h3>

                            <button
                              onClick={() => handleToggleChapter(index, chap._id, `${index + 1}. ${chap.name}`)}
                              className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                isSubLocked
                                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md active:scale-95'
                                  : 'bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white shadow-[0_4px_14px_rgba(91,92,255,0.4)] hover:brightness-110 active:scale-95 border border-[#5B5CFF]'
                              }`}
                            >
                              <span>{isSubLocked ? 'UNLOCK PREMIUM MISSION' : 'START MISSION →'}</span>
                            </button>
                          </div>
                        )}

                        {status === "locked" && (
                          <div 
                            onClick={() => {
                              if (isSubLocked) setShowSubModal(true);
                              else showToast(t('complete_chapter_to_unlock', { chapter: currentChapterIndex + 1 }));
                            }}
                            className={`rounded-2xl p-3.5 border-2 transition-all cursor-pointer ${
                              isSubLocked 
                                ? 'bg-amber-50/60 border-amber-200' 
                                : 'bg-white/80 border-[#E0E3E5]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${isSubLocked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {isSubLocked ? '👑 PREMIUM 🔒' : '🔒 LOCKED'}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-[#767683]">
                              Chapter {index + 1}
                            </p>
                            <h3 className="text-sm font-bold text-[#767683] leading-tight">
                              {chap.name}
                            </h3>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}
      </main>

      {/* SUBSCRIPTION LOCK MODAL */}
      {showSubModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-6 max-w-sm w-full border-2 border-amber-300 shadow-2xl flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shadow-inner animate-bounce">
              👑
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Unlock Full Adventure!</h3>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                Chapter 1 is free for everyone. Access to Chapter 2 and beyond requires an active StudySaathy Subscription.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSubModal(false);
                navigate("/parent/subscription");
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-wider text-xs"
            >
              Upgrade Subscription →
            </button>
            <button
              onClick={() => setShowSubModal(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Maybe Later
            </button>
          </motion.div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#17157F] text-white px-5 py-2.5 rounded-full shadow-xl z-[9999] font-bold text-xs flex items-center gap-2 whitespace-nowrap max-w-[90vw]">
          <Lock size={15} className="text-[#FFC83D] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
