import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, BrainCircuit, Target, Zap, Activity, 
  Flame, Sparkles, Compass, Trophy, Star, BookOpen, Heart 
} from "lucide-react";
import { apiFetch } from "../../../api";
import { useTranslation } from "react-i18next";

// Helper to render dynamic Lucide icons returned by backend API
const renderIcon = (iconName: string, size = 18, className = "") => {
  switch (iconName) {
    case "Trophy": return <Trophy size={size} className={className} />;
    case "Heart": return <Heart size={size} className={className} />;
    case "Sparkles": return <Sparkles size={size} className={className} />;
    case "BookOpen": return <BookOpen size={size} className={className} />;
    case "Flame": return <Flame size={size} className={className} />;
    case "Compass": return <Compass size={size} className={className} />;
    case "Zap": return <Zap size={size} className={className} />;
    case "Activity": return <Activity size={size} className={className} />;
    case "Target": return <Target size={size} className={className} />;
    case "BrainCircuit": return <BrainCircuit size={size} className={className} />;
    default: return <Sparkles size={size} className={className} />;
  }
};

export default function ParentLearningDNAScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const cachedDna = (() => {
    try {
      const raw = sessionStorage.getItem("parent_learning_dna_cache");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  })();

  const [loading, setLoading] = useState(!cachedDna || cachedDna?.hasData === false);
  const [dnaData, setDnaData] = useState<any>(cachedDna);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("Parent");

  useEffect(() => {
    (async () => {
      try {
        const [resUser, resDna] = await Promise.all([
          apiFetch("/api/users/me").catch(() => null),
          apiFetch("/api/parent/learning-dna").catch(() => null)
        ]);

        if (resUser) {
          const jsonUser = await resUser.json();
          if (jsonUser.success && jsonUser.data?.user) {
            setUsername(jsonUser.data.user.parentName || jsonUser.data.user.username || "Parent");
            setProfilePic(jsonUser.data.user.parentPhoto || "");
          }
        }

        if (resDna) {
          const json = await resDna.json();
          if (json.success) {
            setDnaData(json.data);
            sessionStorage.setItem("parent_learning_dna_cache", JSON.stringify(json.data));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] px-5 pt-[104px] flex flex-col gap-6 max-w-lg mx-auto">
        <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto flex items-center justify-between px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-gray-100 z-50">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </header>
        <div className="bg-gray-200 animate-pulse rounded-[24px] h-48 w-full mt-4"></div>
        <div className="bg-gray-200 animate-pulse rounded-[24px] h-60 w-full"></div>
        <div className="bg-gray-200 animate-pulse rounded-[24px] h-40 w-full"></div>
      </div>
    );
  }

  // Derive dynamic properties from data
  const hasData = dnaData?.hasData !== false;
  
  // Resolve modal percentages
  const visualPct = dnaData?.visualPercentage ?? 0;
  const kinestheticPct = dnaData?.kinestheticPercentage ?? 0;
  const readingPct = dnaData?.readingPercentage ?? 0;

  // Resolve dominant learning style name and badge dynamically
  const dominantProfile = dnaData?.dominantProfile || "";
  let learnerIdentity = dnaData?.learnerIdentity || "Visual Explorer";
  let identityBadge = dnaData?.identityBadge || "";
  
  if (!identityBadge) {
    if (dominantProfile.toLowerCase().includes("kinesthetic")) {
      learnerIdentity = "Hands-on Builder";
      identityBadge = kinestheticPct > 0 ? `Top ${Math.max(5, 100 - kinestheticPct)}% Kinesthetic Learner` : "Kinesthetic Learner";
    } else if (dominantProfile.toLowerCase().includes("reading") || dominantProfile.toLowerCase().includes("write")) {
      learnerIdentity = "Creative Thinker";
      identityBadge = readingPct > 0 ? `Top ${Math.max(5, 100 - readingPct)}% Focused Reader` : "Reading & Writing Learner";
    } else if (dominantProfile) {
      identityBadge = visualPct > 0 ? `Top ${Math.max(5, 100 - visualPct)}% Visual Learner` : "Visual-Spatial Learner";
    } else {
      identityBadge = "Learning Profile";
    }
  }

  // Resolve learning power metrics
  const focusVal = dnaData?.metrics?.focus ?? 0;
  const confidenceVal = dnaData?.metrics?.confidence ?? 0;
  const consistencyVal = dnaData?.metrics?.motivation ?? 0;

  // Resolve growth mindset metrics
  const curiosityVal = dnaData?.metrics?.curiosity ?? 0;
  const resilienceVal = dnaData?.metrics?.resilience ?? 0;
  const creativityVal = dnaData?.metrics?.learningSpeed ?? 0;

  // AI recommendations
  const firstTip = dnaData?.tips?.[0] || null;

  // Dynamic activities based on backend telemetry
  const activities = Array.isArray(dnaData?.activities) && dnaData.activities.length > 0
    ? dnaData.activities
    : dominantProfile.toLowerCase().includes("kinesthetic") 
    ? [
        { name: "Build It", icon: Trophy, desc: "Solve quizzes containing spatial drag-and-drop actions.", stars: 5 },
        { name: "Practice Together", icon: Heart, desc: "Run a multiplayer quiz and compete in teams.", stars: 5 },
        { name: "Draw It", icon: Sparkles, desc: "Draw shapes and concepts to explain math puzzles.", stars: 4 },
        { name: "Watch It", icon: BookOpen, desc: "Watch concept video cards on the roadmap.", stars: 3 }
      ]
    : dominantProfile.toLowerCase().includes("reading")
    ? [
        { name: "Practice Together", icon: Heart, desc: "Collaboratively read word problems aloud.", stars: 5 },
        { name: "Watch It", icon: BookOpen, desc: "Read chapter reader summaries on the dashboard.", stars: 4 },
        { name: "Draw It", icon: Sparkles, desc: "Draw diagrams associated with text descriptions.", stars: 3 },
        { name: "Build It", icon: Trophy, desc: "Solve vocabulary word sorting games.", stars: 3 }
      ]
    : [
        { name: "Draw It", icon: Sparkles, desc: "Draw concepts and models to process questions.", stars: 5 },
        { name: "Watch It", icon: BookOpen, desc: "Watch active animations of math and science.", stars: 5 },
        { name: "Build It", icon: Trophy, desc: "Construct spatial block puzzles in practice games.", stars: 4 },
        { name: "Practice Together", icon: Heart, desc: "Run flashcard visual drills together.", stars: 3 }
      ];

  // Helper translations for DNA Screen
  const translateLearnerIdentity = (identity: string) => {
    if (!identity) return "";
    if (identity.includes("Hands-on Builder")) return t("hands_on_builder", "Hands-on Builder");
    if (identity.includes("Creative Thinker")) return t("creative_thinker", "Creative Thinker");
    if (identity.includes("Visual Explorer")) return t("visual_explorer", "Visual Explorer");
    return t(identity, identity);
  };

  const translateIdentityBadge = (badge: string) => {
    if (!badge) return "";
    if (badge.includes("Kinesthetic")) {
      const match = badge.match(/Top\s*(\d+)%/i);
      const top = match ? match[1] : "20";
      return t("badge_top_kinesthetic", { top, defaultValue: `Top ${top}% Kinesthetic Learner` });
    }
    if (badge.includes("Focused Reader") || badge.includes("Reading")) {
      const match = badge.match(/Top\s*(\d+)%/i);
      const top = match ? match[1] : "20";
      return t("badge_top_reading", { top, defaultValue: `Top ${top}% Focused Reader` });
    }
    if (badge.includes("Visual")) {
      const match = badge.match(/Top\s*(\d+)%/i);
      const top = match ? match[1] : "20";
      return t("badge_top_visual", { top, defaultValue: `Top ${top}% Visual Learner` });
    }
    return t(badge, badge);
  };

  const translateDnaDescription = (desc: string) => {
    if (!desc) return "";
    if (desc.includes("hands-on learner who thrives on interaction")) {
      return t("desc_kinesthetic_learner", "Your child is a hands-on learner who thrives on interaction, physical activity, and drag-and-drop challenges. They learn best by doing and experimenting.");
    }
    if (desc.includes("spatial concepts dynamically")) {
      return t("desc_visual_learner", "Processes spatial concepts dynamically, resolving math and science models through interactive games rather than plain text descriptions.");
    }
    if (desc.includes("reading texts") || desc.includes("word problems") || desc.includes("textual instructions")) {
      return t("desc_reading_learner", "Your child processes information best through reading texts and writing answers. They show strong retention with word problems and textual instructions.");
    }
    return t(desc, desc);
  };

  const translateCoachTitle = (title: string) => {
    if (!title) return "";
    if (title.includes("Hands-on quizzes")) return t("coach_hands_on_quizzes", "Hands-on quizzes");
    if (title.includes("Write down summaries") || title.includes("summaries")) return t("coach_write_summaries", "Write down summaries");
    if (title.includes("diagrams") || title.includes("visual")) return t("coach_use_diagrams", "Use more diagrams");
    if (title.includes("chunks")) return t("coach_short_chunks", "Short text chunks");
    if (title.includes("breaks")) return t("coach_frequent_breaks", "Frequent active breaks");
    if (title.includes("read aloud")) return t("coach_read_aloud", "Read aloud");
    return t(title, title);
  };

  const translateCoachDesc = (desc: string) => {
    if (!desc) return "";
    if (desc.includes("Incorporate interactive/drag-and-drop practice games")) {
      return t("desc_coach_interactive_games", "Incorporate interactive/drag-and-drop practice games to keep engagement high.");
    }
    if (desc.includes("summarize their learning in a journal")) {
      return t("desc_coach_summaries", "Encourage the child to summarize their learning in a journal or notepad.");
    }
    if (desc.includes("diagrams") || desc.includes("visual connection")) {
      return t("desc_coach_diagrams", "Try drawing out concepts when explaining complex problems. Visual connection helps retain memory.");
    }
    if (desc.includes("short visual bullet points")) {
      return t("desc_coach_short_chunks", "Break down text-heavy explanations into short visual bullet points.");
    }
    if (desc.includes("2-minute stretch")) {
      return t("desc_coach_frequent_breaks", "Encourage taking a 2-minute stretch or movement break between chapters.");
    }
    if (desc.includes("read word problems out loud")) {
      return t("desc_coach_read_aloud", "Let them read word problems out loud to boost comprehension.");
    }
    return t(desc, desc);
  };

  const translateActivityName = (name: string) => {
    if (name === "Build It" || name.includes("Build")) return t("act_build_it", name);
    if (name === "Practice Together" || name.includes("Team")) return t("act_practice_together", name);
    if (name === "Draw It" || name.includes("Sketch")) return t("act_draw_it", name);
    if (name === "Watch It" || name.includes("Videos")) return t("act_watch_it", name);
    return t(name, name);
  };

  const translateActivityDesc = (desc: string) => {
    if (desc.includes("spatial drag-and-drop actions")) return t("desc_act_build_it_spatial", desc);
    if (desc.includes("multiplayer quiz and compete")) return t("desc_act_practice_multiplayer", desc);
    if (desc.includes("shapes and concepts")) return t("desc_act_draw_math", desc);
    if (desc.includes("concept video cards")) return t("desc_act_watch_roadmap", desc);
    if (desc.includes("word problems aloud")) return t("desc_act_practice_aloud", desc);
    if (desc.includes("reader summaries")) return t("desc_act_watch_summaries", desc);
    if (desc.includes("diagrams associated")) return t("desc_act_draw_text", desc);
    if (desc.includes("word sorting games")) return t("desc_act_build_sorting", desc);
    if (desc.includes("concepts and models")) return t("desc_act_draw_models", desc);
    if (desc.includes("animations of math")) return t("desc_act_watch_animations", desc);
    if (desc.includes("block puzzles")) return t("desc_act_build_blocks", desc);
    if (desc.includes("flashcard visual drills")) return t("desc_act_practice_flashcards", desc);
    return t(desc, desc);
  };

  // Dynamic Weekly Trend graph coordinates based on weeklyTrend telemetry array from backend
  const weeklyTrendData: number[] = Array.isArray(dnaData?.weeklyTrend) && dnaData.weeklyTrend.length === 7
    ? dnaData.weeklyTrend
    : [0, 0, 0, 0, 0, 0, 0];

  const chartPoints = weeklyTrendData.map((val, idx) => {
    const x = 30 + idx * 43.33; // 30 (Mon), 73.3 (Tue), 116.6 (Wed), 160 (Thu), 203.3 (Fri), 246.6 (Sat), 290 (Sun)
    const clampedVal = Math.max(0, Math.min(100, val));
    const y = 68 - (clampedVal / 100) * 52; // 0% -> y=68, 100% -> y=16
    return { x: Math.round(x), y: Math.round(y), val: clampedVal };
  });
  
  const pathD = `M ${chartPoints[0].x} ${chartPoints[0].y} ` +
    chartPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1e1e24] font-sans pb-24 relative selection:bg-[#57fae9]/30">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 h-20 bg-white/60 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 max-w-lg mx-auto shadow-sm">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 active:scale-95 transition-all border border-gray-100">
          <ArrowLeft size={20} className="text-[#141779]" />
        </button>
        <div className="w-9 h-9 rounded-full border border-gray-100 overflow-hidden bg-white shrink-0">
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover"
            src={dnaData?.childPhoto || profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dnaData?.childName || username)}&background=141779&color=fff`}
          />
        </div>
        <h1 className="text-xl font-extrabold text-[#141779] truncate">
          {dnaData?.childName
            ? t("child_learning_dna", { name: dnaData.childName, defaultValue: `${dnaData.childName}'s Learning DNA` })
            : t("learning_dna", "Learning DNA")}
        </h1>
      </header>

      {!hasData ? (
        <main className="px-5 pt-12 max-w-lg mx-auto flex flex-col gap-6 items-center justify-center text-center">
          <div className="w-20 h-20 bg-white rounded-[28px] border border-gray-100 shadow-md flex items-center justify-center mb-2">
            <BrainCircuit size={40} className="text-[#141779]/30" />
          </div>
          <h2 className="text-2xl font-black text-[#141779]">{t("awaiting_telemetry", "Awaiting Telemetry")}</h2>
          <p className="text-[15px] text-[#555562] leading-relaxed max-w-[280px]">
            {t("telemetry_desc", "Your child needs to solve more questions and complete roadmaps to build their cognitive Learning DNA profile.")}
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="mt-4 px-8 py-4 bg-[#141779] text-white font-bold rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
          >
            {t("return_to_dashboard", "Return to Dashboard")}
          </button>
        </main>
      ) : (
        <main className="px-5 pt-6 max-w-lg mx-auto flex flex-col gap-6">
          
          {/* Hero Section */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ab47bc]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#57fae9]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Pulsing Brain SVG */}
            <div className="w-24 h-24 mb-4 flex items-center justify-center relative">
              <svg className="w-full h-full text-[#7b1fa2]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20 C35 20, 25 30, 25 45 C25 55, 30 65, 40 70 C42 71, 44 73, 44 75 C44 78, 46 80, 50 80" stroke="url(#brainGradientLeft)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                <path d="M50 20 C65 20, 75 30, 75 45 C75 55, 70 65, 60 70 C58 71, 56 73, 56 75 C56 78, 54 80, 50 80" stroke="url(#brainGradientRight)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                <circle cx="40" cy="35" r="4.5" fill="#ab47bc" />
                <circle cx="60" cy="35" r="4.5" fill="#ab47bc" />
                <circle cx="34" cy="48" r="5" fill="#3cd6c4" />
                <circle cx="66" cy="48" r="5" fill="#3cd6c4" />
                <circle cx="44" cy="62" r="4" fill="#ffb300" />
                <circle cx="56" cy="62" r="4" fill="#ffb300" />
                <line x1="40" y1="35" x2="34" y2="48" stroke="#7b1fa2" strokeWidth="1.5" opacity="0.4" />
                <line x1="60" y1="35" x2="66" y2="48" stroke="#7b1fa2" strokeWidth="1.5" opacity="0.4" />
                <line x1="34" y1="48" x2="44" y2="62" stroke="#3cd6c4" strokeWidth="1.5" opacity="0.4" />
                <line x1="66" y1="48" x2="56" y2="62" stroke="#3cd6c4" strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="#7b1fa2" strokeWidth="2" strokeDasharray="3 3" opacity="0.2" />
                <defs>
                  <linearGradient id="brainGradientLeft" x1="25" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ab47bc" />
                    <stop offset="100%" stopColor="#3cd6c4" />
                  </linearGradient>
                  <linearGradient id="brainGradientRight" x1="75" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ab47bc" />
                    <stop offset="100%" stopColor="#ffb300" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="bg-[#e9e8ff] text-[#4d40b3] text-[11px] font-extrabold tracking-wider px-3 py-1 rounded-full mb-1 border border-[#4d40b3]/10">
              {translateIdentityBadge(dnaData?.identityBadge || identityBadge)}
            </span>
            <h2 className="text-2xl font-black text-[#141779] mb-3">{translateLearnerIdentity(dnaData?.learnerIdentity || learnerIdentity)}</h2>
            <p className="text-[14px] text-[#555562] leading-relaxed max-w-[340px]">
              {translateDnaDescription(dnaData?.description || "")}
            </p>
          </div>

          {/* Section 1: Learning Style */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-extrabold text-[#7c7d8a] tracking-wider uppercase mb-5">{t("learning_modality_style", "Learning Modality Style")}</h3>
            <div className="flex flex-col gap-5">
              
              {/* Visual Modality */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-extrabold text-[#1e1e24] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8b35c5]"></span>
                    {t("visual_modality", "Visual modality")}
                  </span>
                  <span className="font-extrabold text-[#8b35c5]">{visualPct}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8b35c5] to-[#a85ee3] rounded-full transition-all duration-500" style={{ width: `${visualPct}%` }}></div>
                </div>
              </div>

              {/* Hands-on Modality */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-extrabold text-[#1e1e24] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#008272]"></span>
                    {t("handson_modality", "Hands-on modality")}
                  </span>
                  <span className="font-extrabold text-[#008272]">{kinestheticPct}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#008272] to-[#3cd6c4] rounded-full transition-all duration-500" style={{ width: `${kinestheticPct}%` }}></div>
                </div>
              </div>

              {/* Reading Modality */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-extrabold text-[#1e1e24] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b07b00]"></span>
                    {t("reading_writing_modality", "Reading & Writing")}
                  </span>
                  <span className="font-extrabold text-[#b07b00]">{readingPct}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#b07b00] to-[#ffd066] rounded-full transition-all duration-500" style={{ width: `${readingPct}%` }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Learning Power */}
          <div>
            <h3 className="text-sm font-extrabold text-[#7c7d8a] tracking-wider uppercase mb-3 px-1">{t("learning_power", "Learning Power")}</h3>
            <div className="grid grid-cols-3 gap-3">
              
              {/* Focus Card */}
              <div className="bg-gradient-to-b from-white to-[#f9fafe] border border-gray-100 rounded-[22px] p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#e8e9fc] flex items-center justify-center text-[#141779] mb-2 shrink-0">
                  <Target size={18} />
                </div>
                <span className="text-[11px] font-extrabold text-[#7c7d8a] mb-1">{t("focus", "Focus")}</span>
                <span className="text-lg font-black text-[#141779]">{focusVal}%</span>
              </div>

              {/* Confidence Card */}
              <div className="bg-gradient-to-b from-white to-[#f9fafe] border border-gray-100 rounded-[22px] p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#dcf5f2] flex items-center justify-center text-[#008272] mb-2 shrink-0">
                  <Activity size={18} />
                </div>
                <span className="text-[11px] font-extrabold text-[#7c7d8a] mb-1">{t("confidence", "Confidence")}</span>
                <span className="text-lg font-black text-[#008272]">{confidenceVal}%</span>
              </div>

              {/* Consistency Card */}
              <div className="bg-gradient-to-b from-white to-[#f9fafe] border border-gray-100 rounded-[22px] p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#faedd8] flex items-center justify-center text-[#b07b00] mb-2 shrink-0">
                  <Flame size={18} />
                </div>
                <span className="text-[11px] font-extrabold text-[#7c7d8a] mb-1">{t("consistency", "Consistency")}</span>
                <span className="text-lg font-black text-[#b07b00]">{consistencyVal}%</span>
              </div>
            </div>
          </div>

          {/* Section 3: Growth Mindset */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-extrabold text-[#7c7d8a] tracking-wider uppercase mb-5">{t("growth_mindset_profiling", "Growth Mindset Profiling")}</h3>
            <div className="flex flex-col gap-4">
              
              {/* Curiosity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1e1e24]">{t("curiosity", "Curiosity")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2f61d5] rounded-full" style={{ width: `${curiosityVal}%` }} />
                  </div>
                  <span className="text-xs font-black text-[#2f61d5] w-8 text-right">{curiosityVal}%</span>
                </div>
              </div>

              {/* Resilience */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1e1e24]">{t("resilience", "Resilience")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8b35c5] rounded-full" style={{ width: `${resilienceVal}%` }} />
                  </div>
                  <span className="text-xs font-black text-[#8b35c5] w-8 text-right">{resilienceVal}%</span>
                </div>
              </div>

              {/* Creativity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#1e1e24]">{t("creativity", "Creativity")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a874b] rounded-full" style={{ width: `${creativityVal}%` }} />
                  </div>
                  <span className="text-xs font-black text-[#1a874b] w-8 text-right">{creativityVal}%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: AI Coach — only shown when real data available */}
          {firstTip && (
          <div className="bg-gradient-to-r from-[#141779] to-[#3b1580] rounded-[28px] p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-[#57fae9]" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#57fae9]">{t("todays_ai_coach", "TODAY'S AI COACH")}</span>
            </div>
            <h4 className="text-lg font-black mb-2">{translateCoachTitle(firstTip.title)}</h4>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              {translateCoachDesc(firstTip.desc)}
            </p>
            <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 flex items-center justify-between w-max gap-8">
              <span className="text-[11px] font-extrabold text-white/70">{t("efficiency_boost", "Efficiency Boost")}</span>
              <span className="text-sm font-black text-[#57fae9]">+{Math.round(confidenceVal * 0.2 + 10)}% {t("boost", "boost")}</span>
            </div>
          </div>
          )}

          {/* Section 5: Recommended Activities */}
          <div>
            <h3 className="text-sm font-extrabold text-[#7c7d8a] tracking-wider uppercase mb-3 px-1">{t("recommended_activities", "RECOMMENDED ACTIVITIES")}</h3>
            <div className="grid grid-cols-2 gap-3">
              {activities.slice(0, 4).map((act: any, index: number) => {
                return (
                  <div key={index} className="bg-white border border-gray-100 rounded-[22px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.01)] flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#e3eafc] text-[#2f61d5] flex items-center justify-center shrink-0 mb-0.5">
                      {typeof act.icon === "string" ? renderIcon(act.icon, 16, "text-[#2f61d5]") : <act.icon size={16} />}
                    </div>
                    <h4 className="text-[14px] font-black text-[#1e1e24]">{translateActivityName(act.name)}</h4>
                    <p className="text-[10px] text-[#7c7d8a] leading-normal font-medium grow">
                      {translateActivityDesc(act.desc)}
                    </p>
                    <div className="flex gap-0.5 text-[#ffb300]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={10} 
                          fill={i < (act.stars || 4) ? "#ffb300" : "none"} 
                          stroke={i < (act.stars || 4) ? "none" : "#ffb300"} 
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: Achievements */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-extrabold text-[#7c7d8a] tracking-wider uppercase mb-2">{t("collectible_badges", "Collectible Badges")}</h3>
            {(dnaData?.totalAttempts ?? 0) < 5 ? (
              <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-[22px] p-4 text-center mb-4">
                <p className="text-xs font-bold text-[#7c7d8a]">{t("badge_unlock_hint", "Solve at least 5 quizzes to start unlocking badges!")}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-semibold">{t("current_progress", { current: dnaData?.totalAttempts ?? 0, total: 5, defaultValue: `Current Progress: ${dnaData?.totalAttempts ?? 0} / 5` })}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4">
              {dnaData?.badges && Array.isArray(dnaData.badges) ? (
                dnaData.badges.map((b: any) => (
                  <div key={b.id} className={`border rounded-[22px] p-4 text-center flex flex-col items-center gap-1.5 transition-all ${
                    b.unlocked
                      ? "bg-[#e8e9fc] border-[#141779]/20 opacity-100 shadow-2xs" 
                      : "bg-gray-50/50 border-dashed border-gray-200 opacity-50"
                  }`}>
                    {renderIcon(b.icon, 20, b.unlocked ? "text-[#141779]" : "text-gray-400")}
                    <h4 className="text-[13px] font-extrabold text-[#191c1e]">{t(b.name.toLowerCase().replace(/ /g, "_"), { defaultValue: String(b.name) })}</h4>
                    <span className="text-[9px] font-bold text-[#7c7d8a]">{b.unlocked ? t("unlocked", "Unlocked") : (b.progressText ? String(b.progressText) : t("locked", "Locked"))}</span>
                  </div>
                ))
              ) : (
                <>
                  {/* Fallback grid items */}
                  <div className={`border rounded-[22px] p-4 text-center flex flex-col items-center gap-1.5 transition-all ${
                    focusVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5
                      ? "bg-[#e8e9fc] border-[#141779]/20 opacity-100" 
                      : "bg-gray-50/50 border-dashed border-gray-200 opacity-50"
                  }`}>
                    <Trophy size={20} className={focusVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5 ? "text-[#141779]" : "text-gray-400"} />
                    <h4 className="text-[13px] font-extrabold text-[#191c1e]">{t("badge_focus_master", "Focus Master")}</h4>
                    <span className="text-[9px] font-bold text-[#7c7d8a]">{focusVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5 ? t("unlocked", "Unlocked") : t("locked", "Locked")}</span>
                  </div>

                  {/* 7-Day Streak */}
                  <div className={`border rounded-[22px] p-4 text-center flex flex-col items-center gap-1.5 transition-all ${
                    consistencyVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5
                      ? "bg-[#fff3d6] border-[#b07b00]/20 opacity-100" 
                      : "bg-gray-50/50 border-dashed border-gray-200 opacity-50"
                  }`}>
                    <Flame size={20} className={consistencyVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5 ? "text-[#b07b00]" : "text-gray-400"} />
                    <h4 className="text-[13px] font-extrabold text-[#191c1e]">{t("badge_7day_streak", "7-Day Streak")}</h4>
                    <span className="text-[9px] font-bold text-[#7c7d8a]">{consistencyVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5 ? t("unlocked", "Unlocked") : t("locked", "Locked")}</span>
                  </div>

                  {/* Curious Mind */}
                  <div className={`border rounded-[22px] p-4 text-center flex flex-col items-center gap-1.5 transition-all ${
                    curiosityVal >= 65 && (dnaData?.totalAttempts ?? 0) >= 5
                      ? "bg-[#dcf5f2] border-[#008272]/20 opacity-100" 
                      : "bg-gray-50/50 border-dashed border-gray-200 opacity-50"
                  }`}>
                    <Compass size={20} className={curiosityVal >= 65 && (dnaData?.totalAttempts ?? 0) >= 5 ? "text-[#008272]" : "text-gray-400"} />
                    <h4 className="text-[13px] font-extrabold text-[#191c1e]">{t("badge_curious_mind", "Curious Mind")}</h4>
                    <span className="text-[9px] font-bold text-[#7c7d8a]">{curiosityVal >= 65 && (dnaData?.totalAttempts ?? 0) >= 5 ? t("unlocked", "Unlocked") : t("locked", "Locked")}</span>
                  </div>

                  {/* Fast Learner */}
                  <div className={`border rounded-[22px] p-4 text-center flex flex-col items-center gap-1.5 transition-all ${
                    creativityVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5
                      ? "bg-[#dcf2e6] border-[#1a874b]/20 opacity-100" 
                      : "bg-gray-50/50 border-dashed border-gray-200 opacity-50"
                  }`}>
                    <Zap size={20} className={creativityVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5 ? "text-[#1a874b]" : "text-gray-400"} />
                    <h4 className="text-[13px] font-extrabold text-[#191c1e]">{t("badge_fast_learner", "Fast Learner")}</h4>
                    <span className="text-[9px] font-bold text-[#7c7d8a]">{creativityVal >= 70 && (dnaData?.totalAttempts ?? 0) >= 5 ? t("unlocked", "Unlocked") : t("locked", "Locked")}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 7: Progress Chart */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-extrabold text-[#7c7d8a] tracking-wider uppercase mb-5">{t("weekly_trend", "Weekly Trend")}</h3>
            
            {(dnaData?.totalAttempts ?? 0) < 3 ? (
              <div className="w-full bg-gray-50 border border-dashed border-gray-200 rounded-[22px] py-8 text-center flex flex-col items-center justify-center gap-2">
                <Activity size={24} className="text-gray-400 animate-pulse" />
                <p className="text-xs font-bold text-[#7c7d8a]">{t("weekly_trend_hint", "Weekly trend requires at least 3 completed quizzes.")}</p>
                <p className="text-[10px] text-gray-400 font-semibold">{t("current_progress", { current: dnaData?.totalAttempts ?? 0, total: 3, defaultValue: `Current Progress: ${dnaData?.totalAttempts ?? 0} / 3` })}</p>
              </div>
            ) : (
              <>
                {/* Bezier SVG Line Chart */}
                <div className="w-full relative h-[100px] mb-4">
                  <svg className="w-full h-full" viewBox="0 0 320 80" overflow="visible">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="80">
                        <stop offset="0%" stopColor="#ab47bc" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ab47bc" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Horizontal reference lines & Y-axis percentage labels */}
                    <text x="24" y="19" textAnchor="end" className="text-[9px] fill-slate-400 font-bold">100%</text>
                    <line x1="30" y1="16" x2="290" y2="16" stroke="#f1f3f7" strokeWidth="1" />
                    
                    <text x="24" y="45" textAnchor="end" className="text-[9px] fill-slate-400 font-bold">50%</text>
                    <line x1="30" y1="42" x2="290" y2="42" stroke="#f1f3f7" strokeWidth="1" />
                    
                    <text x="24" y="71" textAnchor="end" className="text-[9px] fill-slate-400 font-bold">0%</text>
                    <line x1="30" y1="68" x2="290" y2="68" stroke="#e2e8f0" strokeWidth="1" />
                    
                    {/* Bezier curve path */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="#7b1fa2" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    
                    {/* Under-path fill */}
                    <path 
                      d={`${pathD} L 290 70 L 30 70 Z`} 
                      fill="url(#chartGradient)"
                    />

                    {/* Node points */}
                    {chartPoints.map((p, idx) => (
                      <circle 
                        key={idx} 
                        cx={p.x} 
                        cy={p.y} 
                        r="4" 
                        fill="white" 
                        stroke="#7b1fa2" 
                        strokeWidth="2.5" 
                      />
                    ))}
                  </svg>
                </div>
                
                {/* Days labels */}
                <div className="flex justify-between text-[11px] font-extrabold text-[#7c7d8a] px-2.5">
                  <span>{t("day_mon", "Mon")}</span>
                  <span>{t("day_tue", "Tue")}</span>
                  <span>{t("day_wed", "Wed")}</span>
                  <span>{t("day_thu", "Thu")}</span>
                  <span>{t("day_fri", "Fri")}</span>
                  <span>{t("day_sat", "Sat")}</span>
                  <span>{t("day_sun", "Sun")}</span>
                </div>
              </>
            )}
          </div>

        </main>
      )}
    </div>
  );
}
