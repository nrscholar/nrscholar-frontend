import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, Brain, BookOpen, Zap, Target, TrendingUp, X, Lightbulb } from "lucide-react";
import { apiFetch } from "../api";
import { getActiveUserContext } from "../utils/sessionCache";
import { useLockBodyScroll } from "../utils/useLockBodyScroll";

export interface GrowthScoreCardProps {
  score?: number;
  tag?: string;
  subtitle?: string;
  childName?: string;
  className?: string;
}

export default function GrowthScoreCard({
  score: propScore,
  tag: propTag,
  subtitle: propSubtitle,
  childName: propChildName,
  className = "",
}: GrowthScoreCardProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const [fetchedScore, setFetchedScore] = useState<number | null>(null);
  const [fetchedTag, setFetchedTag] = useState<string | null>(null);
  const [fetchedSubtitle, setFetchedSubtitle] = useState<string | null>(null);
  const [fetchedChildName, setFetchedChildName] = useState<string>("");
  const [showGrowthScoreModal, setShowGrowthScoreModal] = useState<boolean>(false);

  useLockBodyScroll(showGrowthScoreModal);

  useEffect(() => {
    if (!showGrowthScoreModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowGrowthScoreModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showGrowthScoreModal]);

  useEffect(() => {
    if (propScore !== undefined && propScore !== null) return;

    let isMounted = true;
    async function loadScoreData() {
      try {
        const ctx = getActiveUserContext();
        const childParam = ctx.childId ? `childId=${encodeURIComponent(ctx.childId)}` : "";
        const classParam = ctx.classLevel ? `classLevel=${encodeURIComponent(ctx.classLevel)}` : "";
        const qParams = [childParam, classParam].filter(Boolean).join("&");

        const res = await apiFetch(`/api/parent/daily-tip${qParams ? `?${qParams}` : ""}`);
        const tJson = await res.json();
        if (isMounted && tJson.success && tJson.data) {
          if (tJson.data.childName) {
            setFetchedChildName(tJson.data.childName);
          }
          if (tJson.data.metrics) {
            const m = tJson.data.metrics;
            if (m.growthScore !== undefined && m.growthScore !== null) {
              setFetchedScore(Number(m.growthScore));
            }
            if (m.growthTag) setFetchedTag(m.growthTag);
            if (m.growthSubtitle) setFetchedSubtitle(m.growthSubtitle);
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    loadScoreData();
    return () => {
      isMounted = false;
    };
  }, [propScore]);

  const rawScore = propScore !== undefined && propScore !== null
    ? Number(propScore)
    : fetchedScore !== null
      ? Number(fetchedScore)
      : 0;

  const growthScore = Math.min(100, Math.max(0, rawScore));

  const getGrowthBadgeInfo = (s: number) => {
    if (s <= 30) {
      return {
        tag: t("tag_new_parent", "New Parent"),
        subtitle: t("growth_subtitle_0_30", "Begin your journey — complete lessons to grow! 🌱"),
        pillClass: "bg-indigo-50 border-indigo-200 text-indigo-700",
        dialColorClass: "text-[#141779]",
        textColorClass: "text-[#141779]",
      };
    } else if (s <= 50) {
      return {
        tag: t("tag_active_parent", "Active Parent"),
        subtitle: t("growth_subtitle_31_50", "Good progress! Every day counts. 💪"),
        pillClass: "bg-blue-50 border-blue-200 text-blue-700",
        dialColorClass: "text-blue-600",
        textColorClass: "text-blue-700",
      };
    } else if (s <= 70) {
      return {
        tag: t("tag_mindful_parent", "Mindful Parent"),
        subtitle: t("growth_subtitle_51_70", "You're soaring! Keep the momentum going! 🚀"),
        pillClass: "bg-teal-50 border-teal-200 text-[#006a62]",
        dialColorClass: "text-[#006a62]",
        textColorClass: "text-[#006a62]",
      };
    } else if (s <= 85) {
      return {
        tag: t("tag_growth_coach", "Growth Coach"),
        subtitle: t("growth_subtitle_71_85", "Phenomenal dedication! You are inspiring your child. ⭐"),
        pillClass: "bg-amber-50 border-amber-200 text-amber-700",
        dialColorClass: "text-amber-500",
        textColorClass: "text-amber-600",
      };
    } else {
      return {
        tag: t("tag_master_parent", "Master Parent"),
        subtitle: t("growth_subtitle_86_100", "Outstanding! You're in the top 5% of dedicated parents! 🏆"),
        pillClass: "bg-purple-50 border-purple-200 text-purple-700",
        dialColorClass: "text-purple-600",
        textColorClass: "text-purple-700",
      };
    }
  };

  const badgeInfo = getGrowthBadgeInfo(growthScore);
  const displayGrowthTag = propTag || fetchedTag || badgeInfo.tag;
  const displayGrowthSubtitle = propSubtitle || fetchedSubtitle || badgeInfo.subtitle;
  const childName = propChildName || fetchedChildName || "";

  const breakdownPillars = [
    {
      icon: <Brain className="w-5 h-5 text-indigo-600" />,
      iconBg: "bg-indigo-50 border-indigo-200/80",
      title: currentLang === "gu"
        ? "બાળકની ક્વિઝ અને પ્રેક્ટિસ ચોકસાઈ"
        : currentLang === "hi"
          ? "बच्चे की क्विज़ और अभ्यास सटीकता"
          : "Child Practice & Quiz Accuracy",
      weight: "35%",
      badge: currentLang === "gu" ? "મુખ્ય પાયો" : currentLang === "hi" ? "मुख्य आधार" : "Core Pillar",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: currentLang === "gu"
        ? `${childName || "બાળક"} દ્વારા ક્વિઝ અને પ્રેક્ટિસ સત્રોમાં આપેલા સાચા જવાબો અને સુધરેલી ચોકસાઈ.`
        : currentLang === "hi"
          ? `${childName || "बच्चे"} द्वारा क्विज़ और अभ्यास में दिए गए सही उत्तर एवं सटीकता में सुधार।`
          : `Accuracy and correct answers achieved by ${childName || "your child"} during chapter quizzes and practice drills.`
    },
    {
      icon: <BookOpen className="w-5 h-5 text-teal-600" />,
      iconBg: "bg-teal-50 border-teal-200/80",
      title: currentLang === "gu"
        ? "પેરેન્ટ એકેડેમી પાઠ અને માર્ગદર્શન"
        : currentLang === "hi"
          ? "पैरेंट एकेडमी पाठ और मार्गदर्शन"
          : "Parent Academy Lessons",
      weight: "25%",
      badge: currentLang === "gu" ? "પેરેન્ટ ભૂમિકા" : currentLang === "hi" ? "अभिभावक भूमिका" : "Parent Role",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      description: currentLang === "gu"
        ? "તમે પૂર્ણ કરેલા માર્ગદર્શન મોડ્યુલ્સ અને બાળકની મુશ્કેલીઓ ઉકેલવા લીધેલા પગલાં."
        : currentLang === "hi"
          ? "आपके द्वारा पूरे किए गए पैरेंटिंग पाठ और बच्चे की समस्याओं को हल करने के उपाय।"
          : "Parenting micro-lessons completed and guidance actions taken to support your child."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-200/80",
      title: currentLang === "gu"
        ? "દૈનિક સાતત્ય અને સ્ટ્રીક"
        : currentLang === "hi"
          ? "दैनिक निरंतरता और स्ट्रीक"
          : "Daily Practice Consistency",
      weight: "20%",
      badge: currentLang === "gu" ? "આદત નિર્માણ" : currentLang === "hi" ? "आदत निर्माण" : "Habit Building",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description: currentLang === "gu"
        ? "દરરોજ અભ્યાસ કરવાની ટેવ અને એપ પર નિયમિત સક્રિયતા."
        : currentLang === "hi"
          ? "प्रतिदिन पढ़ाई करने की नियमित आदत और ऐप पर दैनिक उपस्थिति।"
          : "Building a regular, unbroken study habit through daily practice and engagement."
    },
    {
      icon: <Target className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-50 border-purple-200/80",
      title: currentLang === "gu"
        ? "સિદ્ધિઓ અને એક્ટિવિટી સ્તર"
        : currentLang === "hi"
          ? "उपलब्धियां और एक्टिविटी स्तर"
          : "Parent XP & Milestones",
      weight: "20%",
      badge: currentLang === "gu" ? "સિદ્ધિઓ" : currentLang === "hi" ? "उपलब्धियां" : "Achievements",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description: currentLang === "gu"
        ? "દૈનિક પડકારો અને સીમાચિહ્નો પાર કરીને મેળવેલ XP અને પ્રોત્સાહક બેજ."
        : currentLang === "hi"
          ? "दैनिक चुनौतियों और माइलस्टोन को पूरा करके अर्जित XP और स्तर।"
          : "Experience points earned and family milestones unlocked across learning activities."
    }
  ];

  return (
    <>
      {/* ── Growth Score Card Container ── */}
      <section
        className={`w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(20,23,121,0.04)] flex items-center gap-3.5 sm:gap-4 overflow-hidden ${className}`}
      >
        {/* Dial circle */}
        <button
          type="button"
          onClick={() => setShowGrowthScoreModal(true)}
          title={t("view_growth_breakdown", "Tap to view breakdown")}
          aria-label={t("how_growth_score_works", "How Growth Score works")}
          className="relative w-20 h-20 sm:w-20 sm:h-20 flex items-center justify-center shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141779] rounded-full"
          style={{ width: "76px", height: "76px", minWidth: "76px", minHeight: "76px", maxWidth: "76px", maxHeight: "76px" }}
        >
          <svg className="w-full h-full -rotate-90 transition-transform group-hover:scale-105 duration-300" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${badgeInfo.dialColorClass} transition-all duration-1000 ease-out`}
              strokeDasharray={`${Math.min(100, Math.max(0, growthScore))}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className={`${badgeInfo.textColorClass} font-black text-lg sm:text-xl leading-none`}>
              {growthScore}%
            </span>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-0.5">
              {currentLang === "gu" ? "સ્કોર" : currentLang === "hi" ? "स्कोर" : "Score"}
            </span>
          </div>
        </button>

        {/* Details body */}
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-black text-[#141779] uppercase tracking-wider shrink-0">
              {t("growth_score", "Growth Score")}
            </span>
            {/* Badge with Info icon on the right side */}
            <button
              type="button"
              onClick={() => setShowGrowthScoreModal(true)}
              title={t("how_growth_score_works", "How Growth Score works")}
              aria-label={t("how_growth_score_works", "How Growth Score works")}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] sm:text-xs font-black cursor-pointer transition-all hover:shadow-2xs active:scale-[0.98] shrink-0 ${badgeInfo.pillClass}`}
            >
              <span>{displayGrowthTag}</span>
              <Info className="w-3 h-3 opacity-75" />
            </button>
          </div>

          <p className="text-slate-600 font-medium text-xs sm:text-[13px] leading-snug">
            {displayGrowthSubtitle}
          </p>
        </div>
      </section>

      {/* ── Growth Score Breakdown Modal ── */}
      {showGrowthScoreModal && (
        <div
          className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 pb-24 sm:p-4 sm:pb-6 animate-in fade-in duration-200 overflow-y-auto overscroll-contain select-none"
          style={{
            zIndex: 99999,
            paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))"
          }}
          onClick={() => setShowGrowthScoreModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[75vh] sm:max-h-[82vh] my-auto animate-in zoom-in-95 duration-200 select-text"
            style={{
              zIndex: 100000,
              maxHeight: "min(78vh, calc(100dvh - 120px - env(safe-area-inset-bottom, 0px)))"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#141779] via-[#006a62] to-amber-500" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-[#141779]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#141779] leading-tight">
                    {currentLang === "gu"
                      ? "ગ્રોથ સ્કોર કેવી રીતે ગણાય છે?"
                      : currentLang === "hi"
                        ? "ग्रोथ स्कोर कैसे काम करता है?"
                        : "How Growth Score Works"}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    {currentLang === "gu"
                      ? "તમારા પરિવારની શીખવાની ગતિનું મૂલ્યાંકન"
                      : currentLang === "hi"
                        ? "पारिवारिक सीखने की निरंतर प्रगति का माप"
                        : "A holistic measure of your family's learning momentum"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGrowthScoreModal(false)}
                aria-label={t("close", "Close")}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Current Score Summary Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/50 border border-indigo-100 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                    <span className={`text-base sm:text-lg font-black ${badgeInfo.textColorClass}`}>
                      {growthScore}%
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#141779] uppercase tracking-wider">
                        {t("growth_score", "Growth Score")}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-black ${badgeInfo.pillClass}`}>
                        {displayGrowthTag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {displayGrowthSubtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillars Introduction */}
              <div className="px-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">
                  {currentLang === "gu"
                    ? "4 મુખ્ય પરિબળો પર આધારિત:"
                    : currentLang === "hi"
                      ? "4 मुख्य स्तंभों पर आधारित:"
                      : "Calculated from 4 core pillars:"}
                </h4>
              </div>

              {/* 4 Pillars List */}
              <div className="space-y-2.5">
                {breakdownPillars.map((pillar, idx) => (
                  <div
                    key={`growth-pillar-${idx}`}
                    className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex items-start gap-3 shadow-2xs"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${pillar.iconBg}`}>
                      {pillar.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h5 className="text-xs sm:text-[13px] font-black text-[#141779] leading-snug flex-1 min-w-0">
                          {pillar.title}
                        </h5>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 whitespace-nowrap self-start mt-0.5 ${pillar.badgeColor}`}>
                          {pillar.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Friendly Pro-Tip */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                  {currentLang === "gu"
                    ? "મહત્વપૂર્ણ ટિપ: દરરોજ સંપૂર્ણ સ્કોર લાવવો જરૂરી નથી! માત્ર 10 મિનિટ નિયમિત પ્રેક્ટિસ અને 1 પેરેન્ટ ગાઈડ વાંચવાથી તમારો ગ્રોથ સ્કોર સતત ઊંચો રહે છે."
                    : currentLang === "hi"
                      ? "सरल टिप: हर दिन पूर्ण स्कोर होना आवश्यक नहीं है! बस 10 मिनट का नियमित अभ्यास और 1 पैरेंट टिप आपके ग्रोथ स्कोर को लगातार बढ़ाए रखती है।"
                      : "Pro-Tip: You don't need perfection every day! Just 10 minutes of daily child practice and reading 1 quick parent guide keeps your score climbing."}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white sm:bg-slate-50/60 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowGrowthScoreModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl bg-[#141779] hover:bg-[#1a1f9c] text-white text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center"
              >
                {t("got_it", "Got it!")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

