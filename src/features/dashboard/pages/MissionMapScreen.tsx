import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle2, Check, Play, Star, Trophy, Sparkles, Award, Zap, Bell, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";
import { motion } from "framer-motion";
import { prefetchPdf } from "../../../utils/pdfCache";

export default function MissionMapScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapterId") || "ch1";
  const chapterTitle = searchParams.get("title") || "Chapter Path";

  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState<any>(null);
  const [childName, setChildName] = useState("Explorer");
  const [childPhoto, setChildPhoto] = useState("");
  const [userClass, setUserClass] = useState("Class 3");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (chapterId) {
      prefetchPdf(chapterId);
    }
  }, [chapterId]);

  useEffect(() => {
    async function loadRoadmap() {
      let activeClass = "Class 3";
      try {
        const meRes = await apiFetch("/api/users/me");
        const meJson = await meRes.json();
        if (meJson.success && meJson.data?.user) {
          setChildName(meJson.data.user.childName || "Explorer");
          setChildPhoto(meJson.data.user.childPhoto || meJson.data.user.photo || "");
          activeClass = meJson.data.user.childClass || "Class 3";
          setUserClass(activeClass);
        }
      } catch (e) {}

      try {
        const notifRes = await apiFetch("/api/notifications");
        const notifData = await notifRes.json();
        if (notifData.success && notifData.data) {
          setUnreadCount(notifData.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}

      try {
        const res = await apiFetch(`/api/practice/chapters/${chapterId}/missions?classLevel=${encodeURIComponent(activeClass)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setChapterData(json.data);
        }
      } catch (e) {
        console.error("Failed to load mission roadmap:", e);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] via-[#EEF1FF] to-[#FFFFFF] text-[#17157F] font-sans pb-28 relative overflow-x-hidden">
        {/* Background Glow Accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#5B5CFF]/10 blur-[90px]" />
          <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#35E5D4]/15 blur-[90px]" />
        </div>

        {/* Top Header Bar Skeleton */}
        <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100 rounded-b-[28px] shadow-xs px-4 py-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-indigo-100/80 animate-pulse shrink-0 border border-indigo-200/50" />
            <div className="space-y-1.5 flex-1">
              <div className="w-24 h-3.5 bg-indigo-100/80 animate-pulse rounded-full border border-indigo-200/40" />
              <div className="w-36 h-4 bg-indigo-200/70 animate-pulse rounded-md" />
            </div>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-indigo-100/80 animate-pulse shrink-0 border border-indigo-200/40" />
        </header>

        {/* Hero Banner Card Skeleton */}
        <div className="px-4 pt-4 pb-1 max-w-[430px] mx-auto w-full relative z-10">
          <div className="bg-white/90 border-2 border-indigo-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-24 h-5 bg-[#35E5D4]/20 border border-[#35E5D4]/40 animate-pulse rounded-full" />
              <div className="w-24 h-7 bg-indigo-100/80 border border-indigo-200/50 animate-pulse rounded-xl" />
            </div>
            <div className="w-3/4 h-5 bg-indigo-200/60 animate-pulse rounded-lg mt-2" />
            <div className="w-full h-3.5 bg-indigo-100/70 animate-pulse rounded-md mt-1" />
            <div className="w-2/3 h-3.5 bg-indigo-100/70 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Mission Path Timeline Skeleton */}
        <main className="px-4 pt-4 max-w-[430px] mx-auto w-full relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <div className="w-36 h-3.5 bg-indigo-100/80 animate-pulse rounded-md" />
            <div className="w-24 h-5 bg-[#35E5D4]/20 border border-[#35E5D4]/40 animate-pulse rounded-full" />
          </div>

          <div className="relative py-2 flex flex-col gap-5">
            {/* Connecting Vertical Timeline Line */}
            <div className="absolute left-[28px] top-6 bottom-14 w-1 -translate-x-1/2 bg-gradient-to-b from-[#5B5CFF]/30 to-[#B9BBC8]/20 -z-10 rounded-full" />

            {/* 4 Skeleton Mission Nodes matching theme */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative flex items-start gap-3 w-full">
                {/* Timeline Column Skeleton */}
                <div className="w-14 shrink-0 flex items-center justify-center pt-1">
                  <div className="w-11 h-11 rounded-full bg-indigo-100/90 border-4 border-white animate-pulse shadow-xs" />
                </div>

                {/* Details Card Skeleton */}
                <div className="flex-1 min-w-0 bg-white/90 rounded-2xl p-4 border-2 border-indigo-100 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="w-16 h-3 bg-indigo-100/80 animate-pulse rounded-md" />
                      <div className="w-32 h-4 bg-indigo-200/60 animate-pulse rounded-md" />
                      <div className="w-28 h-3 bg-indigo-100/70 animate-pulse rounded-md" />
                    </div>
                    <div className="w-12 h-6 bg-indigo-100/80 animate-pulse rounded-xl" />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-indigo-100 animate-pulse rounded-full" />
                      <div className="w-4 h-4 bg-indigo-100 animate-pulse rounded-full" />
                      <div className="w-4 h-4 bg-indigo-100 animate-pulse rounded-full" />
                    </div>
                    <div className="w-20 h-7 bg-indigo-100/80 animate-pulse rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const missions = chapterData?.missions || [];
  const themeName = chapterData?.themeName || "dragon";

  const getThemeHeader = () => {
    if (themeName === "lab") {
      return {
        title: t('lab_missions_title', '🔬 Research Lab Missions'),
        subtitle: t('unlock_quantum', 'Unlock quantum core breakthroughs!'),
        badge: t('scientific_expedition', 'Scientific Expedition'),
        badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-300"
      };
    } else if (themeName === "championship") {
      return {
        title: t('scholar_championship_title', '🏆 Scholar Championship'),
        subtitle: t('battle_to_finale', 'Battle your way to the National Finale!'),
        badge: t('grand_league', 'Grand League'),
        badgeBg: "bg-amber-100 text-amber-800 border-amber-300"
      };
    }
    return {
      title: t('dragon_journey_title', '🐲 Dragon Journey Missions'),
      subtitle: t('conquer_realms', 'Conquer all realms to reach the Dragon King!'),
      badge: t('dragon_quest', 'Dragon Quest'),
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300"
    };
  };

  const themeMeta = getThemeHeader();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] via-[#EEF1FF] to-[#FFFFFF] text-[#17157F] font-sans pb-44 relative selection:bg-[#5B5CFF] selection:text-white overflow-x-hidden">
      {/* Background World Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#5B5CFF]/10 blur-[90px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#35E5D4]/15 blur-[90px]" />
      </div>

      {/* Top Header Bar */}
      <header className="sticky top-0 left-0 right-0 max-w-md mx-auto z-50 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100 rounded-b-[28px] shadow-xs px-4 py-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={() => navigate("/practice/chapters")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all shadow-xs shrink-0"
          >
            <ArrowLeft size={20} className="text-[#141779]" />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#4f46e5] bg-[#eef2ff] font-black px-2 py-0.5 rounded-full border border-indigo-100 shrink-0 inline-block w-fit mb-0.5">
              {userClass} • {t('mission_roadmap', 'Mission Roadmap')}
            </span>
            <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
              {chapterTitle}
            </h1>
          </div>
        </div>

        <button
          onClick={() => navigate("/notifications")}
          className="w-9 h-9 rounded-2xl bg-slate-50 shadow-2xs flex items-center justify-center hover:bg-slate-100 transition-all shrink-0 border border-slate-100 relative"
        >
          <Bell size={16} className="text-[#1c1970]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </header>

      {/* Hero Banner Card */}
      <div className="px-4 pt-4 pb-1 max-w-[430px] mx-auto w-full relative z-10">
        <div className="bg-white border-2 border-[#E0E3E5] rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] bg-[#35E5D4]/20 px-2 py-0.5 rounded-full border border-[#35E5D4]/50 shrink-0">
                {themeMeta.badge}
              </span>
              <button
                onClick={() =>
                  navigate(
                    `/chapter-reader?chapterId=${chapterId}&title=${encodeURIComponent(chapterTitle)}`
                  )
                }
                className="px-3 py-1.5 bg-[#EEF1FF] hover:bg-[#5B5CFF] hover:text-white text-[#17157F] border border-[#5B5CFF]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                <span>{t('read_pdf', '📖 Read PDF')}</span>
              </button>
            </div>
            <h2 className="text-base font-black mt-2 text-[#17157F] leading-tight pr-6">{themeMeta.subtitle}</h2>
            <p className="text-xs text-[#767683] mt-1 font-medium leading-relaxed pr-6">
              {t('read_summary_first', 'Read the textbook summary first, then complete small achievements & battle bosses!')}
            </p>
          </div>
          <Sparkles className="absolute right-2 bottom-2 w-16 h-16 text-indigo-500/10 pointer-events-none" />
        </div>
      </div>

      {/* 65% Unlock Requirement Tip Banner */}
      <div className="px-4 pt-2 pb-0 max-w-[430px] mx-auto w-full relative z-10">
        <div className="bg-gradient-to-r from-[#EEF1FF] via-[#F0F3FF] to-[#E0E7FF] border border-[#5B5CFF]/30 rounded-2xl px-3.5 py-2.5 shadow-2xs flex items-center gap-2.5">
          <span className="text-base shrink-0">🎯</span>
          <p className="text-xs font-bold text-[#17157F] leading-snug">
            {t('unlock_requirement_banner', 'Achieve at least 65% accuracy on a mission to unlock the next mission!')}
          </p>
        </div>
      </div>

      {/* Mission Path Timeline */}
      <main className="px-4 pt-4 pb-16 max-w-[430px] mx-auto w-full relative z-10 flex flex-col gap-4">
        {(() => {
          const completedMissionsCount = missions.filter((m: any) => m.status === "completed").length;
          const totalMissionsCount = missions.length || 1;
          const overallProgressPct = Math.round((completedMissionsCount / totalMissionsCount) * 100);

          return (
            <div className="flex flex-col gap-2.5 px-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black tracking-wider text-[#17157F] uppercase">
                  {t('chapter_missions_roadmap', 'CHAPTER MISSIONS ROADMAP')}
                </h3>
                <span className="text-[10px] font-black text-[#006a62] bg-[#35E5D4]/20 px-2.5 py-0.5 rounded-full border border-[#35E5D4]/50">
                  {t('missions_completed_count', { completed: completedMissionsCount, total: totalMissionsCount, defaultValue: `${completedMissionsCount} / ${totalMissionsCount} Completed` })}
                </span>
              </div>

              {/* Segmented Horizontal Progress Bar (Borderless) */}
              <div className="flex items-center gap-3 w-full py-1">
                <div className="flex-1 flex items-center gap-1.5 h-2.5">
                  {Array.from({ length: totalMissionsCount }).map((_, idx) => {
                    const isSegCompleted = idx < completedMissionsCount;
                    return (
                      <div
                        key={idx}
                        className={`h-full flex-1 rounded-full transition-all duration-500 ${
                          isSegCompleted
                            ? "bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669]"
                            : "bg-slate-200/90"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs font-black text-[#17157F] shrink-0 min-w-[32px] text-right">
                  {overallProgressPct}%
                </span>
              </div>
            </div>
          );
        })()}

        <section className="relative py-2 pb-16 flex flex-col gap-4">
          {missions.map((m: any, index: number) => {
            const isCompleted = m.status === "completed";
            const isRetest = m.status === "retest";
            const isUnlocked = m.status === "unlocked" || isCompleted || isRetest || Boolean(m.hasDraft);
            const isLocked = !isUnlocked;

            const savedAns = sessionStorage.getItem(`user_answers_${chapterId}_${m.seq}`);
            const savedPhase = sessionStorage.getItem(`mission_phase_${chapterId}_${m.seq}`);
            
            let hasInProgressSession = false;
            if (isUnlocked && !isCompleted) {
              if (Boolean(m.hasDraft)) hasInProgressSession = true;
              if (savedAns) {
                try {
                  const arr = JSON.parse(savedAns);
                  if (Array.isArray(arr) && arr.length > 0) hasInProgressSession = true;
                } catch (e) {}
              }
              if (savedPhase && savedPhase !== "SUMMARY" && savedPhase !== "INTRO") {
                hasInProgressSession = true;
              }
            } else if (isUnlocked && isCompleted) {
              if (savedPhase === "QUIZ" || savedPhase === "BOSS") {
                hasInProgressSession = true;
              }
            }
            if (savedPhase === "SUMMARY") {
              hasInProgressSession = false;
            }

            return (
              <motion.div
                key={m.seq}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative flex items-start gap-3 w-full"
              >
                {/* Connecting Line Segment to Next Node (100% continuous, stops cleanly at last mission) */}
                {index < missions.length - 1 && (
                  <div
                    className={`absolute left-[28px] top-4 bottom-[-28px] w-[2.5px] -translate-x-1/2 -z-10 transition-colors duration-300 ${
                      isCompleted ? "bg-[#10b981]" : "bg-slate-300/80"
                    }`}
                  />
                )}

                {/* FIXED TIMELINE COLUMN - Solid Colored Nodes with Crisp Outer White Border Ring */}
                <div className="w-14 shrink-0 flex items-center justify-center pt-2 relative z-10">
                  {isCompleted ? (
                    <div className="w-9 h-9 rounded-full bg-[#10b981] border-[3.5px] border-white text-white flex items-center justify-center shadow-md">
                      <Check size={18} strokeWidth={3.5} className="text-white" />
                    </div>
                  ) : isUnlocked ? (
                    <div className="w-9 h-9 rounded-full bg-[#5B5CFF] border-[3.5px] border-white text-white flex items-center justify-center shadow-md animate-pulse">
                      <span className="text-xs">{m.icon || "⚡"}</span>
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#CBD5E1] border-[3.5px] border-white text-[#64748B] flex items-center justify-center shadow-sm">
                      <Lock size={14} />
                    </div>
                  )}
                </div>

                {/* Mission Details Card (Borderless, Clean Floating White Card) */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`rounded-2xl p-3 sm:p-3.5 transition-all text-left bg-white border-0 ${
                      isCompleted
                        ? "shadow-sm"
                        : isUnlocked
                        ? "shadow-[0_4px_16px_rgba(91,92,255,0.12)]"
                        : "opacity-75 shadow-2xs"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-[10px] font-bold text-[#767683] uppercase tracking-wider">
                            {t('mission', 'MISSION')} {m.seq}
                          </p>
                          {isCompleted && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#006a62] bg-[#35E5D4]/20 px-2 py-0.5 rounded-full border border-[#35E5D4]/50 shrink-0">
                              {t('done', 'COMPLETED')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-[#17157F] leading-snug truncate">
                          {t(m.title.toLowerCase().replace(/ /g, '_'), { defaultValue: m.title })}
                        </h4>
                        <p className="text-xs text-[#767683] mt-0.5 font-medium flex items-center gap-2">
                          <span className="flex items-center gap-1">🎯 {m.quizCount} {t('quiz', 'Quiz')}</span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1">👹 {t(m.bossName.toLowerCase().replace(/ /g, '_'), { defaultValue: m.bossName })}</span>
                        </p>
                      </div>

                      {(isCompleted || isRetest || (m.accuracy !== undefined && m.accuracy > 0)) && (
                        <div className="shrink-0 flex items-center gap-1 bg-[#EEF1FF] text-[#17157F] px-2.5 py-1 rounded-xl border border-[#5B5CFF]/30 shadow-2xs ml-2">
                          <span className="text-xs">🎯</span>
                          <span className="text-xs font-black">{m.accuracy ?? 0}%</span>
                        </div>
                      )}
                    </div>

                    {/* Stars / Action Button Footer */}
                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      {hasInProgressSession ? (
                        <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                          {t('in_progress_sub', '⚡ In progress...')}
                        </span>
                      ) : isCompleted || isRetest ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((starIndex) => (
                            <Star
                              key={starIndex}
                              size={15}
                              className={starIndex <= m.stars ? "text-[#FFC83D] fill-[#FFC83D]" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[#767683] font-medium truncate max-w-[180px]">
                          {isUnlocked
                            ? t('ready_to_launch', 'Ready to launch!')
                            : t('complete_previous_mission_with_acc', 'Achieve 65%+ accuracy in Mission {{prev}} to unlock', { prev: m.seq - 1, defaultValue: `Achieve 65%+ accuracy in Mission ${m.seq - 1} to unlock` })}
                        </span>
                      )}

                      <button
                        disabled={isLocked}
                        onClick={() => {
                          if (hasInProgressSession) {
                            navigate(`/mission-play?chapterId=${chapterId}&missionSeq=${m.seq}`);
                          } else {
                            const isReplaying = isCompleted || isRetest;
                            if (isReplaying) {
                              sessionStorage.removeItem(`user_answers_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`mission_phase_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`mission_timer_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`boss_damage_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`boss_wrong_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`boss_index_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`quiz_correct_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`xp_earned_${chapterId}_${m.seq}`);
                              sessionStorage.removeItem(`coins_earned_${chapterId}_${m.seq}`);
                              apiFetch(`/api/practice/chapters/${chapterId}/missions/${m.seq}/draft`, { method: "DELETE" }).catch(() => {});
                            }
                            navigate(`/mission-play?chapterId=${chapterId}&missionSeq=${m.seq}${isReplaying ? "&replay=true" : ""}`);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                          hasInProgressSession
                            ? "bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white border border-[#5B5CFF]"
                            : isCompleted
                            ? "bg-[#45D483] hover:bg-[#34c774] text-white border border-[#45D483]"
                            : isRetest
                            ? "bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white border border-[#5B5CFF]"
                            : isUnlocked
                            ? "bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white shadow-[0_4px_14px_rgba(91,92,255,0.4)] hover:brightness-110 border border-[#5B5CFF]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
                      >
                        {hasInProgressSession ? (
                          <>
                            <span>{t('resume', 'Resume')}</span>
                            <Play size={13} className="fill-white" />
                          </>
                        ) : isCompleted ? (
                          <>
                            <RotateCcw size={13} strokeWidth={2.5} />
                            <span>{t('replay', 'Replay')}</span>
                          </>
                        ) : isRetest ? (
                          <>
                            <span>{t('retest', 'Re-test')}</span>
                            <Play size={13} className="fill-white" />
                          </>
                        ) : isUnlocked ? (
                          <>
                            <span>{t('start_mission', 'Start')}</span>
                            <Play size={13} className="fill-white" />
                          </>
                        ) : (
                          <>
                            <Lock size={13} />
                            <span>{t('locked', 'Locked')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
