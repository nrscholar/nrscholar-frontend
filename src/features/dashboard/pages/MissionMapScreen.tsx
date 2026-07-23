import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle2, Play, Star, Trophy, Sparkles, Award, Zap, Bell } from "lucide-react";
import { apiFetch } from "../../../api";
import { motion } from "framer-motion";

export default function MissionMapScreen() {
  const navigate = useNavigate();
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
      try {
        const meRes = await apiFetch("/api/users/me");
        const meJson = await meRes.json();
        if (meJson.success && meJson.data?.user) {
          setChildName(meJson.data.user.childName || "Explorer");
          setChildPhoto(meJson.data.user.childPhoto || meJson.data.user.photo || "");
          setUserClass(meJson.data.user.childClass || "Class 3");
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
        const res = await apiFetch(`/api/practice/chapters/${chapterId}/missions`);
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
      <div className="min-h-screen bg-[#f7f9fb] text-[#141779] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-bold tracking-wide text-base animate-pulse">Loading Mission Map...</p>
      </div>
    );
  }

  const missions = chapterData?.missions || [];
  const themeName = chapterData?.themeName || "dragon";

  const getThemeHeader = () => {
    if (themeName === "lab") {
      return {
        title: "🔬 Research Lab Missions",
        subtitle: "Unlock quantum core breakthroughs!",
        badge: "Scientific Expedition",
        badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-300"
      };
    } else if (themeName === "championship") {
      return {
        title: "🏆 Scholar Championship",
        subtitle: "Battle your way to the National Finale!",
        badge: "Grand League",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-300"
      };
    }
    return {
      title: "🐲 Dragon Journey Missions",
      subtitle: "Conquer all realms to reach the Dragon King!",
      badge: "Dragon Quest",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300"
    };
  };

  const themeMeta = getThemeHeader();

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans pb-24">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[rgba(247,249,251,0.85)] backdrop-blur-md border-b border-[rgba(255,255,255,0.4)] px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/practice/chapters")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all shadow-xs"
          >
            <ArrowLeft size={22} className="text-[#141779]" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#006a62]">
              {userClass} • Mission Roadmap
            </span>
            <h1 className="text-lg font-bold text-[#141779] leading-tight truncate max-w-[200px]">
              {chapterTitle}
            </h1>
          </div>
        </div>

        <button
          onClick={() => navigate("/notifications")}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shrink-0"
        >
          <div className="relative">
            <Bell size={20} className="text-[#141779]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </button>
      </header>

      {/* Hero Banner Card */}
      <div className="px-6 pt-6 pb-2 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${themeMeta.badgeBg}`}>
                {themeMeta.badge}
              </span>
              <button
                onClick={() =>
                  navigate(
                    `/chapter-reader?chapterId=${chapterId}&title=${encodeURIComponent(chapterTitle)}`
                  )
                }
                className="px-3 py-1.5 bg-[#141779]/10 hover:bg-[#141779]/20 text-[#141779] border border-[#141779]/20 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>📖 Read PDF</span>
              </button>
            </div>
            <h2 className="text-xl font-black mt-3 text-[#141779]">{themeMeta.subtitle}</h2>
            <p className="text-xs text-[#464652] mt-1 font-medium leading-relaxed">
              Read the textbook summary first, then complete small achievements & battle bosses!
            </p>
          </div>
          <Sparkles className="absolute right-2 bottom-2 w-24 h-24 text-teal-500/10 pointer-events-none" />
        </div>
      </div>

      {/* Mission Path Timeline */}
      <main className="px-6 pt-6 flex flex-col gap-6 max-w-md mx-auto">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold tracking-widest text-[#767683] uppercase">
            Chapter Missions Roadmap
          </h3>
          <span className="text-xs font-bold text-[#006a62] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            {missions.filter((m: any) => m.status === "completed").length} / {missions.length} Completed
          </span>
        </div>

        <div className="relative flex flex-col gap-6">
          {/* Vertical Path Line */}
          <div className="absolute left-[39px] top-6 bottom-6 w-1 bg-gradient-to-b from-[#006a62] via-[#141779] to-gray-300 rounded-full opacity-30" />

          {missions.map((m: any, index: number) => {
            const isCompleted = m.status === "completed";
            const isUnlocked = m.status === "unlocked";
            const isLocked = m.status === "locked";

            return (
              <motion.div
                key={m.seq}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative z-10 flex items-center gap-4"
              >
                {/* Mission Node Icon */}
                <div
                  className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center shrink-0 border-2 shadow-md transition-all ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-300 text-white shadow-emerald-200"
                      : isUnlocked
                      ? "bg-[#141779] border-amber-300 text-white shadow-[#141779]/30 ring-4 ring-[#141779]/15 animate-bounce"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                    M{m.seq}
                  </span>
                </div>

                {/* Mission Details Card */}
                <div
                  className={`flex-1 rounded-3xl p-5 border transition-all ${
                    isCompleted
                      ? "bg-emerald-50/80 border-emerald-200 shadow-xs"
                      : isUnlocked
                      ? "bg-white border-2 border-[#141779] shadow-md shadow-[#141779]/5"
                      : "bg-gray-100/60 border-gray-200 opacity-70"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#006a62] uppercase">
                        Mission {m.seq}
                      </span>
                      <h4 className="text-base font-bold text-[#141779] leading-tight">{m.title}</h4>
                      <p className="text-xs text-[#464652] mt-1 font-medium flex items-center gap-2">
                        <span>🎯 {m.quizCount} Quiz</span>
                        <span>•</span>
                        <span>👹 {m.bossName}</span>
                      </p>
                    </div>

                    {isCompleted && (
                      <div className="flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        <span className="text-[10px] font-black text-emerald-800 uppercase">Done</span>
                      </div>
                    )}
                  </div>

                  {/* Stars / Play Button */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    {isCompleted ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIndex) => (
                          <Star
                            key={starIndex}
                            size={16}
                            className={starIndex <= m.stars ? "text-amber-500 fill-amber-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-[#767683] font-medium">
                        {isUnlocked ? "Ready to launch!" : "Complete previous mission"}
                      </span>
                    )}

                    <button
                      disabled={isLocked}
                      onClick={() =>
                        navigate(`/mission-play?chapterId=${chapterId}&missionSeq=${m.seq}`)
                      }
                      className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 ${
                        isCompleted
                          ? "bg-gray-100 text-[#141779] hover:bg-gray-200 border border-gray-300"
                          : isUnlocked
                          ? "bg-[#141779] text-white font-black shadow-md shadow-[#141779]/20 hover:bg-[#101362]"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? (
                        "Replay"
                      ) : isUnlocked ? (
                        <>
                          <span>Start Mission</span>
                          <Play size={14} className="fill-white" />
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          <span>Locked</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
