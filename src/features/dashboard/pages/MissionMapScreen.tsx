import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle2, Play, Star, Trophy, Sparkles, Award, Zap, Bell, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";
import { motion } from "framer-motion";

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
      <div className="min-h-screen bg-[#f7f9fb] text-[#141779] font-sans pb-24">
        {/* Top Header Bar Skeleton */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b-2 border-slate-200/90 rounded-b-[28px] px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-1.5">
              <div className="w-24 h-3 bg-slate-200 animate-pulse rounded-md" />
              <div className="w-36 h-4 bg-slate-300 animate-pulse rounded-md" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
        </header>

        {/* Hero Banner Card Skeleton */}
        <div className="px-6 pt-6 pb-2 max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-28 h-6 bg-slate-200 animate-pulse rounded-full" />
              <div className="w-24 h-7 bg-slate-200 animate-pulse rounded-2xl" />
            </div>
            <div className="w-3/4 h-6 bg-slate-300 animate-pulse rounded-xl mt-2" />
            <div className="w-full h-3.5 bg-slate-200 animate-pulse rounded-lg mt-1" />
            <div className="w-2/3 h-3.5 bg-slate-200 animate-pulse rounded-lg" />
          </div>
        </div>

        {/* Mission Path Timeline Skeleton */}
        <main className="px-6 pt-6 flex flex-col gap-6 max-w-md mx-auto">
          <div className="flex justify-between items-center px-1">
            <div className="w-40 h-3.5 bg-slate-200 animate-pulse rounded-md" />
            <div className="w-24 h-6 bg-slate-200 animate-pulse rounded-full" />
          </div>

          <div className="relative flex flex-col gap-6">
            {/* Connecting Vertical Path Line */}
            <div className="absolute left-[39px] top-6 bottom-6 w-1 bg-slate-200 rounded-full opacity-60" />

            {/* 5 Skeleton Mission Nodes */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="relative z-10 flex items-center gap-4">
                {/* Node Icon Circle Skeleton */}
                <div className="w-20 h-20 rounded-3xl bg-slate-200 animate-pulse shrink-0 border-2 border-slate-100 flex flex-col items-center justify-center gap-1 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-300 animate-pulse" />
                  <div className="w-6 h-2 bg-slate-300 animate-pulse rounded-xs" />
                </div>

                {/* Details Card Skeleton */}
                <div className="flex-1 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 flex-1">
                      <div className="w-16 h-2.5 bg-slate-200 animate-pulse rounded-md" />
                      <div className="w-32 h-4 bg-slate-300 animate-pulse rounded-md" />
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="w-16 h-3 bg-slate-200 animate-pulse rounded-md" />
                        <div className="w-20 h-3 bg-slate-200 animate-pulse rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-slate-200 animate-pulse rounded-full" />
                      <div className="w-4 h-4 bg-slate-200 animate-pulse rounded-full" />
                      <div className="w-4 h-4 bg-slate-200 animate-pulse rounded-full" />
                    </div>
                    <div className="w-24 h-8 bg-slate-200 animate-pulse rounded-2xl" />
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
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] via-[#EEF1FF] to-[#FFFFFF] text-[#17157F] font-sans pb-28 relative selection:bg-[#5B5CFF] selection:text-white overflow-x-hidden">
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
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62] bg-[#35E5D4]/20 px-2 py-0.5 rounded-full border border-[#35E5D4]/50">
                {themeMeta.badge}
              </span>
              <button
                onClick={() =>
                  navigate(
                    `/chapter-reader?chapterId=${chapterId}&title=${encodeURIComponent(chapterTitle)}`
                  )
                }
                className="px-3.5 py-1.5 bg-[#EEF1FF] hover:bg-[#5B5CFF] hover:text-white text-[#17157F] border border-[#5B5CFF]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>{t('read_pdf', '📖 Read PDF')}</span>
              </button>
            </div>
            <h2 className="text-base font-black mt-2 text-[#17157F] leading-tight">{themeMeta.subtitle}</h2>
            <p className="text-xs text-[#767683] mt-1 font-medium leading-relaxed">
              {t('read_summary_first', 'Read the textbook summary first, then complete small achievements & battle bosses!')}
            </p>
          </div>
          <Sparkles className="absolute right-2 bottom-2 w-20 h-20 text-indigo-500/10 pointer-events-none" />
        </div>
      </div>

      {/* Mission Path Timeline */}
      <main className="px-4 pt-4 max-w-[430px] mx-auto w-full relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black tracking-wider text-[#17157F] uppercase">
            {t('chapter_missions_roadmap', 'CHAPTER MISSIONS ROADMAP')}
          </h3>
          <span className="text-[10px] font-black text-[#006a62] bg-[#35E5D4]/20 px-2.5 py-0.5 rounded-full border border-[#35E5D4]/50">
            {t('missions_completed_count', { completed: missions.filter((m: any) => m.status === "completed").length, total: missions.length, defaultValue: `${missions.filter((m: any) => m.status === "completed").length} / ${missions.length} Completed` })}
          </span>
        </div>

        <section className="relative py-2 flex flex-col gap-5">
          {/* Continuous Vertical Timeline Axis Line (Centered on 28px inside 56px Column) */}
          <div className="absolute left-[28px] top-6 bottom-14 w-1 -translate-x-1/2 bg-gradient-to-b from-[#45D483] via-[#5B5CFF] to-[#B9BBC8]/40 -z-10 rounded-full" />

          {missions.map((m: any, index: number) => {
            const isCompleted = m.status === "completed";
            const isRetest = m.status === "retest";
            const isUnlocked = m.status === "unlocked" || isCompleted || isRetest || Boolean(m.hasDraft);
            const isLocked = !isUnlocked;

            const savedAns = sessionStorage.getItem(`user_answers_${chapterId}_${m.seq}`);
            const savedPhase = sessionStorage.getItem(`mission_phase_${chapterId}_${m.seq}`);
            let hasInProgressSession = isUnlocked && Boolean(m.hasDraft);
            if (isUnlocked && savedAns) {
              try {
                const arr = JSON.parse(savedAns);
                if (Array.isArray(arr) && arr.length > 0) hasInProgressSession = true;
              } catch (e) {}
            }
            if (isUnlocked && savedPhase && savedPhase !== "SUMMARY" && savedPhase !== "INTRO") {
              hasInProgressSession = true;
            }

            return (
              <motion.div
                key={m.seq}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative flex items-start gap-3 w-full"
              >
                {/* FIXED TIMELINE COLUMN (56px Wide - Exact Center Alignment) */}
                <div className="w-14 shrink-0 flex items-center justify-center pt-1 relative">
                  {isCompleted ? (
                    <div className="w-11 h-11 rounded-full bg-[#45D483] border-4 border-white text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 size={22} strokeWidth={2.5} />
                    </div>
                  ) : isUnlocked ? (
                    <div className="w-11 h-11 rounded-full bg-white relative flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-full bg-[#5B5CFF] border-4 border-white text-white flex items-center justify-center shadow-[0_0_16px_rgba(91,92,255,0.6)] animate-pulse">
                        <span className="text-lg">{m.icon || "⚡"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full border-4 bg-[#F1F3F5] border-white text-[#B9BBC8] flex items-center justify-center">
                      <Lock size={18} className="text-[#B9BBC8]" />
                    </div>
                  )}
                </div>

                {/* Mission Details Card (Matching ChaptersScreen card designs) */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`rounded-2xl p-4 transition-all text-left ${
                      isCompleted
                        ? "bg-white border-2 border-[#45D483]/60 shadow-sm"
                        : isUnlocked
                        ? "bg-gradient-to-br from-white to-[#EEF1FF] border-2 border-[#5B5CFF] shadow-[0_4px_16px_rgba(91,92,255,0.2)]"
                        : "bg-white/80 border-2 border-[#E0E3E5]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <p className="text-[10px] font-bold text-[#767683] uppercase">
                            {t('mission', 'Mission')} {m.seq}
                          </p>
                          {isCompleted && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-[#45D483] bg-[#45D483]/15 px-2 py-0.5 rounded-full border border-[#45D483]/40 shrink-0">
                              {t('done', '✓ COMPLETED')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#17157F] leading-tight truncate">
                          {t(m.title.toLowerCase().replace(/ /g, '_'), { defaultValue: m.title })}
                        </h4>
                        <p className="text-xs text-[#767683] mt-1 font-medium flex items-center gap-2">
                          <span>🎯 {m.quizCount} {t('quiz', 'Quiz')}</span>
                          <span>•</span>
                          <span>👹 {t(m.bossName.toLowerCase().replace(/ /g, '_'), { defaultValue: m.bossName })}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stars / Play Button Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      {hasInProgressSession ? (
                        <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                          <Zap size={13} className="fill-indigo-500 text-indigo-500 animate-pulse" />
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
                        <span className="text-xs text-[#767683] font-medium">
                          {isUnlocked ? t('ready_to_launch', 'Ready to launch!') : t('complete_previous_mission', 'Complete previous mission')}
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
                        className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                          hasInProgressSession
                            ? "bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white shadow-md border border-[#5B5CFF]"
                            : isCompleted
                            ? "bg-[#45D483] hover:bg-[#34c774] text-white shadow-xs border border-[#45D483]"
                            : isRetest
                            ? "bg-gradient-to-r from-[#5B5CFF] via-[#2925A5] to-[#17157F] text-white shadow-md border border-[#5B5CFF]"
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
                            <RotateCcw size={13} />
                            <span>{t('replay', 'Replay')}</span>
                          </>
                        ) : isRetest ? (
                          <>
                            <span>{t('retest', 'Re-test')}</span>
                            <Play size={13} className="fill-white" />
                          </>
                        ) : isUnlocked ? (
                          <>
                            <span>{t('start_mission', 'Start Mission')}</span>
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
