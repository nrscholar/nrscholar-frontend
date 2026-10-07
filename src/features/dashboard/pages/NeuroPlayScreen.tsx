import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Brain, CheckCircle2, ChevronRight, Sparkles, 
  Trophy, CheckSquare, MessageSquare, Lightbulb, RotateCcw, Lock, Award, PlayCircle,
  BookOpen, Target, Zap, Shield
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";

// ─── DIRECT CLASS-WISE NEUROPLAY SKILL IMPORTS (CLASSES 1 TO 10) ────────
import { class1Skills } from "../../../data/neuroplay/class1Skills";
import { class2Skills } from "../../../data/neuroplay/class2Skills";
import { class3Skills } from "../../../data/neuroplay/class3Skills";
import { class4Skills } from "../../../data/neuroplay/class4Skills";
import { class5Skills } from "../../../data/neuroplay/class5Skills";
import { class6Skills } from "../../../data/neuroplay/class6Skills";
import { class7Skills } from "../../../data/neuroplay/class7Skills";
import { class8Skills } from "../../../data/neuroplay/class8Skills";
import { class9Skills } from "../../../data/neuroplay/class9Skills";
import { class10Skills } from "../../../data/neuroplay/class10Skills";

const allNeuroPlaySkills = [
  ...class1Skills,
  ...class2Skills,
  ...class3Skills,
  ...class4Skills,
  ...class5Skills,
  ...class6Skills,
  ...class7Skills,
  ...class8Skills,
  ...class9Skills,
  ...class10Skills,
];

// ─── DYNAMIC ICON RENDERER WITH VIBRANT DUAL-RING BADGES ────────────────
const renderSkillIcon = (iconName: string, category: any, size = 32) => {
  const norm = String(iconName || "").toLowerCase();
  const catStr = typeof category === 'object' ? (category.en || '') : String(category || '');
  const catNorm = catStr.toLowerCase();

  let gradient = "from-[#141779] via-[#4F46E5] to-[#7C3AED]";
  let ringColor = "ring-indigo-100 bg-indigo-50/50";
  let IconComponent = Brain;

  if (norm.includes("friend") || norm.includes("math") || catNorm.includes("math") || norm.includes("calc")) {
    gradient = "from-[#141779] via-[#2563EB] to-[#06B6D4]";
    ringColor = "ring-blue-100 bg-blue-50/50";
    IconComponent = Sparkles;
  } else if (norm.includes("story") || norm.includes("read") || catNorm.includes("read")) {
    gradient = "from-[#006a62] via-[#059669] to-[#10B981]";
    ringColor = "ring-emerald-100 bg-emerald-50/50";
    IconComponent = BookOpen;
  } else if (norm.includes("check") || norm.includes("logic") || catNorm.includes("logic")) {
    gradient = "from-[#6366F1] via-[#7C3AED] to-[#9333EA]";
    ringColor = "ring-purple-100 bg-purple-50/50";
    IconComponent = Lightbulb;
  } else if (norm.includes("quiz") || norm.includes("pattern") || catNorm.includes("pattern")) {
    gradient = "from-[#D97706] via-[#F59E0B] to-[#FBBF24]";
    ringColor = "ring-amber-100 bg-amber-50/50";
    IconComponent = Target;
  } else if (norm.includes("shield") || norm.includes("risk") || catNorm.includes("critical")) {
    gradient = "from-[#DC2626] via-[#EA580C] to-[#F97316]";
    ringColor = "ring-rose-100 bg-rose-50/50";
    IconComponent = Shield;
  } else if (norm.includes("trophy") || norm.includes("mission") || norm.includes("reward")) {
    gradient = "from-[#D97706] via-[#EAB308] to-[#FACC15]";
    ringColor = "ring-yellow-100 bg-yellow-50/50";
    IconComponent = Trophy;
  } else if (norm.includes("focus") || norm.includes("attention") || catNorm.includes("attention")) {
    gradient = "from-[#BE185D] via-[#DB2777] to-[#F43F5E]";
    ringColor = "ring-pink-100 bg-pink-50/50";
    IconComponent = Zap;
  }

  return (
    <div className="relative mx-auto mb-4 flex items-center justify-center">
      {/* Outer subtle glow ring */}
      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[30px] p-2 ring-4 ${ringColor} flex items-center justify-center transition-transform hover:scale-105 duration-300`}>
        {/* Core Vibrant Gradient Badge */}
        <div className={`w-full h-full rounded-[24px] bg-gradient-to-tr ${gradient} text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/15 rounded-[24px] blur-xs"></div>
          <IconComponent size={size} className="relative z-10 text-white drop-shadow-md" />
        </div>
      </div>
    </div>
  );
};

// ─── RICH TEXT FORMATTER (CLEANS LATEX & PARSES BOLD MARKDOWN) ──────────
const formatRichText = (text: string) => {
  if (!text) return "";
  const clean = String(text)
    .replace(/\$\\rightarrow\$/g, " → ")
    .replace(/\\rightarrow/g, " → ")
    .replace(/\$\\Rightarrow\$/g, " ⇒ ")
    .replace(/\\Rightarrow/g, " ⇒ ")
    .replace(/\$/g, "");
  
  const parts = clean.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-extrabold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const curatedPhotos = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1584697964190-71c4c15377bf?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1534644107580-3a4dbd494a95?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&q=80&w=400"
];

const getSkillPhoto = (skill: any): string => {
  if (skill.imageUrl) return skill.imageUrl;
  const str = String(skill.id || skill.title || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % curatedPhotos.length;
  return curatedPhotos[index];
};

const categoryIcons: Record<string, string> = {
  "Mental Maths / Calculation Strategies": "⚡",
  "MENTAL MATHS": "⚡",
  "MENTAL MATH": "⚡",
  "Memory Strategies": "🧩",
  "MEMORY STRATEGIES": "🧩",
  "Reading / Information Processing": "📖",
  "READING / INFORMATION PROCESSING": "📖",
  "READING & PROCESSING": "📖",
  "Problem Solving Strategies": "💡",
  "PROBLEM SOLVING": "💡",
  "Logic": "📐",
  "LOGIC": "📐",
  "Pattern Recognition": "🔍",
  "PATTERN RECOGNITION": "🔍",
  "Attention / Focus Strategies": "🎯",
  "ATTENTION / FOCUS STRATEGIES": "🎯",
  "ATTENTION & FOCUS": "🎯",
  "ATTENTION / FOCUS": "🎯",
  "Spatial Intelligence Strategies": "🧊",
  "SPATIAL INTELLIGENCE STRATEGIES": "🧊",
  "SPATIAL INTELLIGENCE": "🧊",
  "Critical Thinking Strategies": "⚖️",
  "Metacognition — \"Think About Your Thinking\"": "🪞",
  "METACOGNITION — \"THINK ABOUT YOUR THINKING\"": "🪞",
  "METACOGNITION": "🪞",
  "Higher-Level Cognitive Strategies": "🚀"
};

const getCategoryFallbackImage = (cat: any): string => {
  const catStr = typeof cat === 'object' ? (cat.en || '') : String(cat || '');
  return getSkillPhoto({ title: catStr });
};

const getCategoryIcon = (cat: any): string => {
  const catStr = typeof cat === 'object' ? (cat.en || '') : String(cat || '');
  return categoryIcons[catStr] || "🧠";
};

export default function NeuroPlayScreen() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  // Active language
  const [lang, setLang] = useState<"en" | "hi" | "gu">(() => {
    const current = (i18n.language || "en").toLowerCase();
    if (current.includes("gu")) return "gu";
    if (current.includes("hi")) return "hi";
    return "en";
  });

  // User account ID state for multi-user storage isolation
  const [userId, setUserId] = useState<string | null>(null);

  // Student class level & user XP state
  const [studentClass, setStudentClass] = useState<number>(1);
  const [totalXp, setTotalXp] = useState<number>(() => {
    const stored = localStorage.getItem("neuroplay_total_xp");
    return stored ? parseInt(stored, 10) : 0;
  });

  // NeuroPlay XP state (tracks XP earned inside NeuroPlay starting from 0)
  const [neuroplayXp, setNeuroplayXp] = useState<number>(() => {
    const stored = localStorage.getItem("neuroplay_xp");
    if (stored !== null) return parseInt(stored, 10);
    try {
      const storedSkills = localStorage.getItem("neuroplay_completed_skills");
      const skills = storedSkills ? JSON.parse(storedSkills) : [];
      return skills.length * 20;
    } catch (e) {
      return 0;
    }
  });

  // Array of completed skill IDs (persisted in localStorage)
  const [completedSkillIds, setCompletedSkillIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("neuroplay_completed_skills");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // View mode: 'library' | 'player'
  const [viewMode, setViewMode] = useState<"library" | "player">("library");
  
  // Selected class tab filter: 'for_you' | 'completed' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  const [activeTab, setActiveTab] = useState<string | number>("for_you");

  // Selected skill ID for player
  const [selectedSkillId, setSelectedSkillId] = useState<string>("skill_c1_01");

  // Card interactive state inside player
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const [card3Selected, setCard3Selected] = useState<"A" | "B" | null>(null);
  const [card4Selected, setCard4Selected] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<boolean[]>([false, false, false, false]);
  const [missionClaimed, setMissionClaimed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionErrorToast, setQuestionErrorToast] = useState<string | null>(null);

  // Fetch student class & profile info on mount (with cross-device backend DB sync)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/api/users/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          const user = json.data.user;
          const uid = String(user._id || user.id || user.email || "");
          if (uid) setUserId(uid);

          // 1. Sync completed skills from Backend MongoDB + localStorage
          const apiCompleted: string[] = Array.isArray(user.neuroplayCompletedSkills) ? user.neuroplayCompletedSkills : [];
          const userSkillsKey = uid ? `neuroplay_completed_skills_${uid}` : "neuroplay_completed_skills";
          let localSkills: string[] = [];
          try {
            const stored = localStorage.getItem(userSkillsKey);
            if (stored) localSkills = JSON.parse(stored);
          } catch (e) {}

          const mergedSkills = Array.from(new Set([...apiCompleted, ...localSkills]));
          setCompletedSkillIds(mergedSkills);
          localStorage.setItem(userSkillsKey, JSON.stringify(mergedSkills));

          // If local had skills not yet on backend, sync them to backend in background
          if (localSkills.length > apiCompleted.length) {
            localSkills.forEach(async (skId) => {
              if (!apiCompleted.includes(skId)) {
                try {
                  await apiFetch("/api/users/neuroplay/complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ skillId: skId, xp: 20 })
                  });
                } catch (err) {}
              }
            });
          }

          // 2. Sync NeuroPlay XP
          const apiNeuroXp = typeof user.neuroplayXp === "number" ? user.neuroplayXp : (mergedSkills.length * 20);
          setNeuroplayXp(apiNeuroXp);
          if (uid) localStorage.setItem(`neuroplay_xp_${uid}`, apiNeuroXp.toString());

          // 3. Robust Class Level parsing
          let cls = 1;
          const rawClass = user.childClass || user.studentClass || user.grade;
          if (typeof rawClass === "number") {
            cls = rawClass;
          } else if (typeof rawClass === "string") {
            const match = rawClass.match(/\d+/);
            if (match) cls = parseInt(match[0], 10);
          }
          setStudentClass(cls || 1);

          // 4. Main account XP
          if (user.xp || user.parentXp) {
            const apiXp = user.xp || user.parentXp;
            setTotalXp(prev => Math.max(prev, apiXp));
          }
        }
      } catch (e) {
        console.error("Failed to load student profile:", e);
      }
    };
    fetchProfile();
  }, []);

  // Save completed skill IDs to localStorage whenever updated (per-user key)
  useEffect(() => {
    const key = userId ? `neuroplay_completed_skills_${userId}` : "neuroplay_completed_skills";
    localStorage.setItem(key, JSON.stringify(completedSkillIds));
  }, [completedSkillIds, userId]);

  // Save total XP to localStorage whenever updated (per-user key)
  useEffect(() => {
    const key = userId ? `neuroplay_total_xp_${userId}` : "neuroplay_total_xp";
    localStorage.setItem(key, totalXp.toString());
  }, [totalXp, userId]);

  // Save NeuroPlay XP to localStorage whenever updated (per-user key)
  useEffect(() => {
    const key = userId ? `neuroplay_xp_${userId}` : "neuroplay_xp";
    localStorage.setItem(key, neuroplayXp.toString());
  }, [neuroplayXp, userId]);

  // Master raw skills list with embedded multi-language localization
  const rawSkills = allNeuroPlaySkills;

  // Compute NeuroPlay XP Level calculations (based on current class only)
  const currentClassSkills = rawSkills.filter((s: any) => (s.classLevel || 1) === studentClass);
  const currentClassCompletedCount = currentClassSkills.filter((s: any) => completedSkillIds.includes(s.id)).length;
  const targetClassXp = (currentClassSkills.length || 1) * 20;
  const currentClassXp = currentClassCompletedCount * 20;
  const currentNeuroLevel = Math.floor(neuroplayXp / 100) + 1;
  const xpProgressPercent = Math.min(100, Math.round((currentClassXp / (targetClassXp || 1)) * 100));

  // Process skills array to compute dynamic unlock & completion states
  // Each classLevel has its own independent progression chain
  // Skills from classes other than student's current class are LOCKED (unless completed for replay)
  const computedSkills = (() => {
    // Group skills by classLevel to determine per-class unlock chains
    const classGroups: Record<number, number[]> = {};
    rawSkills.forEach((skill: any, index: number) => {
      const cl = skill.classLevel || 1;
      if (!classGroups[cl]) classGroups[cl] = [];
      classGroups[cl].push(index);
    });

    return rawSkills.map((skill: any, index: number) => {
      const isCompleted = completedSkillIds.includes(skill.id);
      const cl = skill.classLevel || 1;

      // If skill is NOT from the student's current class:
      // - Completed skills can still be replayed (unlocked)
      // - Non-completed skills are locked
      if (cl !== studentClass) {
        return { ...skill, isUnlocked: isCompleted, isCompleted };
      }

      // For current class: normal sequential unlock chain
      const classIndices = classGroups[cl] || [];
      const posInClass = classIndices.indexOf(index);
      // First skill in current class is always unlocked; others require previous in same class
      const isUnlocked = posInClass === 0 || (posInClass > 0 && completedSkillIds.includes(rawSkills[classIndices[posInClass - 1]]?.id));
      return { ...skill, isUnlocked, isCompleted };
    });
  })();


  // Get active skill object based on selectedSkillId
  const selectedSkill = computedSkills.find((s) => s.id === selectedSkillId) || computedSkills[0];

  // Helper to extract localized text
  const getText = (textObj: any): string => {
    if (!textObj) return "";
    if (typeof textObj === "string") return textObj;
    return textObj[lang] || textObj["en"] || "";
  };

  const skillCards = selectedSkill?.cards || selectedSkill?.lessonData?.cards || [];
  const totalCards = skillCards.length || 0;
  const currentCard = skillCards[activeCardIndex] || {};

  // Reset interactive player state when opening a skill
  const handleLaunchSkill = (skill: any) => {
    if (!skill.isUnlocked) return;
    setSelectedSkillId(skill.id);
    setActiveCardIndex(0);
    setCard3Selected(null);
    setCard4Selected(null);
    setChecklistState([false, false, false, false]);
    setMissionClaimed(completedSkillIds.includes(skill.id));
    setQuestionErrorToast(null);
    setViewMode("player");
  };

  // Next step logic enforcing strict gating rules
  const handleNext = () => {
    // Card 3 Gate: Must select an option
    if (currentCard.type === "method_concept_check" && !card3Selected) {
      setQuestionErrorToast(
        lang === "hi" ? "कृपया आगे बढ़ने से पहले एक उत्तर चुनें!" : 
        lang === "gu" ? "કૃપા કરીને આગળ વધતા પહેલાં એક જવાબ પસંદ કરો!" : 
        "Please select an answer before proceeding!"
      );
      setTimeout(() => setQuestionErrorToast(null), 2500);
      return;
    }

    // Card 4 Gate: Must select an option
    if (currentCard.type === "skill_practice_quiz" && !card4Selected) {
      setQuestionErrorToast(
        lang === "hi" ? "कृपया आगे बढ़ने से पहले एक विकल्प चुनें!" : 
        lang === "gu" ? "કૃપા કરીને આગળ વધતા પહેલાં એક વિકલ્પ પસંદ કરો!" : 
        "Please select an option before proceeding!"
      );
      setTimeout(() => setQuestionErrorToast(null), 2500);
      return;
    }

    // Card 6 Gate: MUST check ALL checklist items to proceed
    if (currentCard.type === "action_checklist") {
      const allChecked = checklistState.length > 0 && checklistState.every(x => x === true);
      if (!allChecked) {
        setQuestionErrorToast(
          lang === "hi" ? "आगे बढ़ने से पहले सभी चेकलिस्ट आइटम टिक करें!" : 
          lang === "gu" ? "આગળ વધતા પહેલાં બધા ચકાસણી બોક્સ પસંદ કરો!" : 
          "Please check all checklist items before proceeding!"
        );
        setTimeout(() => setQuestionErrorToast(null), 2500);
        return;
      }
    }

    setQuestionErrorToast(null);
    if (activeCardIndex < totalCards - 1) {
      setDirection(1);
      setActiveCardIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setQuestionErrorToast(null);
    if (activeCardIndex > 0) {
      setDirection(-1);
      setActiveCardIndex(prev => prev - 1);
    }
  };

  const handleToggleChecklist = (idx: number) => {
    setChecklistState(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  // Card 7: Dynamic XP Claiming and Next Skill Unlocking (Guaranteed Completion)
  const handleClaimMission = async () => {
    if (submitting) return;
    setSubmitting(true);

    const isFirstTime = !completedSkillIds.includes(selectedSkill.id);
    const xpGained = isFirstTime ? (selectedSkill.xp || 20) : 0;

    // 1. Immediately mark skill completed in local state & localStorage
    const updatedCompleted = Array.from(new Set([...completedSkillIds, selectedSkill.id]));
    setCompletedSkillIds(updatedCompleted);
    localStorage.setItem("neuroplay_completed_skills", JSON.stringify(updatedCompleted));
    if (userId) {
      localStorage.setItem(`neuroplay_completed_skills_${userId}`, JSON.stringify(updatedCompleted));
    }

    if (isFirstTime) {
      setNeuroplayXp(prev => prev + xpGained);
      setTotalXp(prev => prev + xpGained);
    }

    try {
      // 2. Persist directly to MongoDB via NeuroPlay Sync endpoint
      try {
        const syncRes = await apiFetch("/api/users/neuroplay/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillId: selectedSkill.id,
            xp: xpGained,
            skillTitle: getText(selectedSkill.title),
            classLevel: selectedSkill.classLevel
          })
        });
        const syncJson = await syncRes.json();
        if (syncJson.success && syncJson.data) {
          if (Array.isArray(syncJson.data.completedSkills)) {
            const merged = Array.from(new Set([...syncJson.data.completedSkills, selectedSkill.id]));
            setCompletedSkillIds(merged);
            localStorage.setItem("neuroplay_completed_skills", JSON.stringify(merged));
            if (userId) {
              localStorage.setItem(`neuroplay_completed_skills_${userId}`, JSON.stringify(merged));
            }
          }
          if (typeof syncJson.data.neuroplayXp === "number") {
            setNeuroplayXp(syncJson.data.neuroplayXp);
          }
          if (typeof syncJson.data.totalXp === "number") {
            setTotalXp(syncJson.data.totalXp);
          }
        }
      } catch (syncErr) {
        console.error("Backend NeuroPlay sync error:", syncErr);
      }

      // 3. Also log activity for telemetry
      if (isFirstTime) {
        await apiFetch("/api/parent/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `Completed ${selectedSkill.id}`,
            type: "quiz",
            timeTaken: 120,
            correctQuestions: 1,
            totalQuestions: 1,
            details: [{ skill: getText(selectedSkill.title), xp: xpGained }]
          })
        });
      }

      // 4. Immediately update main dashboard userData in localStorage and dispatch event
      try {
        const cachedData = localStorage.getItem("userData");
        if (cachedData) {
          const u = JSON.parse(cachedData);
          if (isFirstTime) {
            u.xp = (u.xp || 0) + xpGained;
            u.neuroplayXp = (u.neuroplayXp || 0) + xpGained;
          }
          if (!u.neuroplayCompletedSkills) u.neuroplayCompletedSkills = [];
          if (!u.neuroplayCompletedSkills.includes(selectedSkill.id)) {
            u.neuroplayCompletedSkills.push(selectedSkill.id);
          }
          localStorage.setItem("userData", JSON.stringify(u));
        }
      } catch (e) {}
      window.dispatchEvent(new Event("userDataUpdated"));
    } catch (e) {
      console.error("Failed to post activity XP:", e);
    } finally {
      setSubmitting(false);
      setMissionClaimed(true);
    }
  };

  // Launch Next Unlocked Skill directly from Card 7 (within same classLevel)
  const handleLaunchNextSkill = () => {
    const currentSkill = computedSkills.find(s => s.id === selectedSkillId);
    if (!currentSkill) { setViewMode("library"); return; }
    const sameClassSkills = computedSkills.filter((s: any) => (s.classLevel || 1) === (currentSkill.classLevel || 1));
    const posInClass = sameClassSkills.findIndex((s: any) => s.id === selectedSkillId);
    if (posInClass !== -1 && posInClass < sameClassSkills.length - 1) {
      const nextSkill = sameClassSkills[posInClass + 1];
      handleLaunchSkill({ ...nextSkill, isUnlocked: true });
    } else {
      setViewMode("library");
    }
  };

  // Card slide transition variants
  const cardVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25, ease: "easeIn" }
    })
  };

  // Filter skills based on tab selection
  const filteredSkills = computedSkills.filter((skill: any) => {
    // "For You" shows only the student's current class skills
    if (activeTab === "for_you") return (skill.classLevel || 1) === studentClass;
    // "Completed" shows all completed skills across all classes
    if (activeTab === "completed") return skill.isCompleted;
    // Class tabs show that specific class
    if (typeof activeTab === "number") return (skill.classLevel || 1) === activeTab;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODE 1: SKILL LIBRARY VIEW (PARENT ACADEMY PHOTO CARD LAYOUT)        */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === "library" && (
        <div className="min-h-screen bg-[#F8FAFC] pb-12 flex flex-col">
          
          {/* TOP NAV BAR */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/home")}
                className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <Brain className="text-[#4F46E5]" size={22} />
                <h1 className="text-lg font-black text-[#1E1B4B] tracking-tight">NeuroPlay</h1>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5 shadow-inner">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all ${
                  lang === "en" ? "bg-[#1E1B4B] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all ${
                  lang === "hi" ? "bg-[#1E1B4B] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                HI
              </button>
              <button
                onClick={() => setLang("gu")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all ${
                  lang === "gu" ? "bg-[#1E1B4B] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                GU
              </button>
            </div>
          </header>

          <main className="max-w-md mx-auto w-full px-4 pt-4 space-y-6 flex-1">
            
            {/* 1. DYNAMIC GROWTH STATUS HERO CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_8px_24px_rgba(30,27,75,0.06)] border border-slate-100 flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold tracking-wider text-[#10B981] uppercase">
                    {lang === 'hi' ? 'ग्रोथ स्टेटस' : lang === 'gu' ? 'ગ્રોથ સ્ટેટસ' : 'GROWTH STATUS'}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                    Lvl {currentNeuroLevel}
                  </span>
                </div>
                <span className="text-xs font-black text-[#1E1B4B]">
                  {currentClassXp} / {targetClassXp} XP
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black text-[#1E1B4B] tracking-tight">
                  {lang === 'hi' ? `कक्षा ${studentClass} न्यूरोप्ले` : lang === 'gu' ? `ધોરણ ${studentClass} ન્યુરોપ્લે` : `Class ${studentClass} NeuroPlay`}
                </h2>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner mt-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#1E1B4B] to-[#4F46E5] transition-all duration-700 ease-out"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </motion.div>

            {/* 2. HORIZONTALLY SCROLLABLE CLASS FILTER PILLS (CLASS 1 TO 10) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
              {/* For You Pill */}
              <button
                onClick={() => setActiveTab("for_you")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-2xs ${
                  activeTab === "for_you"
                    ? "bg-[#1E1B4B] text-white scale-105 shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {lang === 'hi' ? 'आपके लिए' : lang === 'gu' ? 'તમારા માટે' : 'For You'}
              </button>

              {/* Completed Pill */}
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-2xs ${
                  activeTab === "completed"
                    ? "bg-[#1E1B4B] text-white scale-105 shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {lang === 'hi' ? 'पूर्ण किए गए' : lang === 'gu' ? 'પૂર્ણ થયેલ' : 'Completed'}
              </button>

              {/* Class 1 to 10 Pills */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((clsNum) => (
                <button
                  key={clsNum}
                  onClick={() => setActiveTab(clsNum)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shadow-2xs ${
                    activeTab === clsNum
                      ? "bg-[#1E1B4B] text-white scale-105 shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {lang === 'hi' ? `कक्षा ${clsNum}` : lang === 'gu' ? `ધોરણ ${clsNum}` : `Class ${clsNum}`}
                </button>
              ))}
            </div>

            {/* 3. SECTION TITLE */}
            <div className="flex items-center justify-between pt-2">
              <h3 className="text-lg font-black text-[#1E1B4B] tracking-tight">
                {activeTab === "for_you"
                  ? (lang === 'hi' ? 'अनुशंसित स्किल्स' : lang === 'gu' ? 'ભલામણ કરેલ સ્કીલ્સ' : 'Recommended for You')
                  : activeTab === "completed"
                  ? (lang === 'hi' ? 'पूर्ण किए गए स्किल्स' : lang === 'gu' ? 'પૂર્ણ થયેલ સ્કીલ્સ' : 'Completed Skills')
                  : (lang === 'hi' ? `कक्षा ${activeTab} स्किल्स` : lang === 'gu' ? `ધોરણ ${activeTab} સ્કીલ્સ` : `Class ${activeTab} Skills`)}
              </h3>
              <span className="text-xs font-extrabold text-[#4F46E5]">
                {filteredSkills.length} {lang === 'hi' ? 'स्किल्स' : lang === 'gu' ? 'સ્કીલ્સ' : 'Skills'}
              </span>
            </div>

            {/* 4. PARENT ACADEMY PHOTO-STYLE SKILL CARDS GRID */}
            {filteredSkills.length === 0 ? (
              <div className="bg-white rounded-[24px] p-8 text-center border border-slate-100 shadow-[0_4px_20px_rgba(30,27,75,0.04)] my-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                  <Brain size={24} />
                </div>
                <h4 className="text-sm font-black text-[#1E1B4B]">
                  {activeTab === "completed"
                    ? (lang === 'hi' ? 'कोई पूर्ण किया गया स्किल नहीं है' : lang === 'gu' ? 'કોઈ પૂર્ણ થયેલ સ્કીલ નથી' : 'No Completed Skills Yet')
                    : (lang === 'hi' ? 'कोई नया स्किल उपलब्ध नहीं है' : lang === 'gu' ? 'કોઈ નવું સ્કીલ ઉપલબ્ધ નથી' : 'No skills added yet')}
                </h4>
                <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {activeTab === "completed"
                    ? (lang === 'hi' ? 'पहला स्किल पूरा करें और इसे यहाँ देखें!' : lang === 'gu' ? 'પ્રથમ સ્કીલ પૂર્ણ કરો અને તેને અહીં જુઓ!' : 'Complete your first micro-lesson to see it stored here for unlimited replay practice!')
                    : (lang === 'hi' ? 'कक्षा 1 का स्किल देखने के लिए "Class 1" या "For You" टैब चुनें!' : lang === 'gu' ? 'ધોરણ 1 નું સ્કીલ જોવા માટે "Class 1" અથવા "For You" ટેબ પસંદ કરો!' : 'Select "Class 1" or "For You" tab to explore available micro-lessons!')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 pb-6">
                {filteredSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleLaunchSkill(skill)}
                    className={`bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(30,27,75,0.06)] border border-slate-100 flex flex-col justify-between cursor-pointer group hover:shadow-xl transition-all relative ${
                      !skill.isUnlocked ? "opacity-90" : "hover:-translate-y-1"
                    }`}
                  >
                    {/* Card Cover Photo (Unique Curated Photos per Skill) */}
                    <div className="relative h-28 sm:h-32 overflow-hidden bg-slate-900">
                      <img
                        src={getSkillPhoto(skill)}
                        alt={getText(skill.title)}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          skill.isUnlocked ? "group-hover:scale-110" : "brightness-75"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

                      {/* XP / Status Badge Top-Left */}
                      {skill.isCompleted ? (
                        <div className="absolute top-2 left-2 bg-[#006a62]/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black shadow-sm border border-white/20 flex items-center gap-1 z-10">
                          <CheckCircle2 size={10} className="text-[#57fae9]" />
                          <span>+0 XP ({lang === "hi" ? "पूर्ण" : lang === "gu" ? "પૂર્ણ" : "Completed"})</span>
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 bg-[#141779] backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-black shadow-sm border border-white/20 z-10">
                          +{skill.xp || 20} XP
                        </div>
                      )}

                      {/* Class Badge Top-Right */}
                      <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white px-1.5 py-0.5 rounded-md text-[9px] font-extrabold border border-white/10 z-10">
                        C{skill.classLevel}
                      </div>

                      {/* Duration & Icon Bottom */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between z-10">
                        <span className="text-lg drop-shadow-md">{skill.icon || getCategoryIcon(skill.category)}</span>
                        <span className="bg-black/50 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white/10">
                          {skill.duration || "5 min"}
                        </span>
                      </div>

                      {/* Locked Overlay Icon */}
                      {!skill.isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] flex flex-col items-center justify-center text-white z-20 gap-1 p-2 text-center">
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                            <Lock size={15} />
                          </div>
                          <span className="text-[9px] font-extrabold text-slate-300 tracking-wider uppercase">
                            {skill.classLevel !== studentClass
                              ? (lang === 'hi' ? `कक्षा ${skill.classLevel} बंद है` : lang === 'gu' ? `ધોરણ ${skill.classLevel} લોક છે` : `Class ${skill.classLevel} Locked`)
                              : (lang === 'hi' ? 'पिछला काम पूरा करें' : lang === 'gu' ? 'અગાઉનું સ્કીલ પૂર્ણ કરો' : 'Complete Previous Skill')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Info Section */}
                    <div className="p-3 bg-white backdrop-blur-md flex-1 flex flex-col justify-between text-left border-t border-slate-100">
                      <div>
                        <span className="text-[9px] font-black text-[#006a62] tracking-widest uppercase block mb-0.5">
                          {getText(skill.category)}
                        </span>
                        <h4 className="text-[11px] sm:text-xs font-bold text-[#141779] leading-snug line-clamp-2">
                          {getText(skill.title)}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </main>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODE 2: INTERACTIVE 7-CARD MICRO-LESSON PLAYER                       */}
      {/* (Ultra-Polished Light Theme • 10/10 Aesthetic Score)                */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {viewMode === "player" && (
        <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col justify-between relative overflow-x-hidden">
          
          {/* Ambient Background Glows matching application */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#4F46E5]/10 rounded-full blur-[90px]"></div>
            <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#006a62]/10 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[120px]"></div>
          </div>

          {/* TOP APP BAR & PROGRESS BAR */}
          <header className="px-5 sm:px-6 py-4 flex items-center justify-between z-50 sticky top-0 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs max-w-lg mx-auto w-full">
            <button 
              onClick={() => setViewMode("library")} 
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#141779] flex items-center justify-center transition-all active:scale-95 shadow-2xs border border-slate-200/60"
              aria-label="Back to Library"
            >
              <ArrowLeft size={20} />
            </button>
            
            {/* Center Header: Skill Title & Progress Tracker */}
            <div className="flex-1 mx-3 sm:mx-4 flex flex-col items-center gap-1.5 min-w-0">
              <div className="flex items-center justify-between w-full text-[11px] font-extrabold text-[#141779]">
                <span className="truncate max-w-[170px] sm:max-w-[220px] font-black">{getText(selectedSkill.title)}</span>
                <span className="text-[#4F46E5] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 shrink-0 font-black">
                  {activeCardIndex + 1} / {totalCards}
                </span>
              </div>
              <div className="bg-slate-200/80 rounded-full h-2 w-full overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#141779] via-[#4F46E5] to-[#7C3AED] h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${((activeCardIndex + 1) / totalCards) * 100}%` }}
                />
              </div>
            </div>

            {/* Language Selector Pill */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5 shadow-2xs">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${
                  lang === "en" ? "bg-[#141779] text-white shadow-xs" : "text-slate-500 hover:text-[#141779]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${
                  lang === "hi" ? "bg-[#141779] text-white shadow-xs" : "text-slate-500 hover:text-[#141779]"
                }`}
              >
                HI
              </button>
              <button
                onClick={() => setLang("gu")}
                className={`px-2 py-1 rounded-full text-[10px] font-black transition-all ${
                  lang === "gu" ? "bg-[#141779] text-white shadow-xs" : "text-slate-500 hover:text-[#141779]"
                }`}
              >
                GU
              </button>
            </div>
          </header>

          {/* MAIN LESSON CONTAINER (Centered Elevated Glassmorphic Card) */}
          <main className="flex-1 px-4 sm:px-6 pt-5 pb-32 flex flex-col justify-center max-w-md sm:max-w-lg w-full mx-auto relative z-10">
            
            {/* Warning Toast */}
            <AnimatePresence>
              {questionErrorToast && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-600 text-white font-black text-xs px-4 py-2.5 rounded-full mb-3 shadow-lg mx-auto flex items-center gap-2 border border-rose-300 z-30"
                >
                  <span>⚠️ {questionErrorToast}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeCardIndex}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-7 shadow-[0_15px_45px_rgba(20,23,121,0.08)] border border-slate-200/80 relative overflow-hidden"
              >
                
                {/* ────────────────── CARD 1: PROBLEM HOOK ────────────────── */}
                {currentCard.type === "problem_hook" && (
                  <div className="space-y-4">
                    {renderSkillIcon(currentCard.icon, selectedSkill.category, 36)}

                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#141779] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                        <Sparkles size={12} className="text-[#4F46E5]" />
                        <span>{getText(selectedSkill.category)} • Step 1</span>
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#141779] leading-tight mb-3">
                        {formatRichText(getText(currentCard.title))}
                      </h2>
                    </div>

                    {/* Pain Quotes with Vibrant Speech Bubbles */}
                    <div className="space-y-2.5">
                      {currentCard.pain_quotes?.map((q: any, idx: number) => (
                        <div key={idx} className="bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 flex items-start gap-3 shadow-2xs">
                          <MessageSquare size={17} className="text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm font-bold text-amber-950 italic leading-snug">
                            "{formatRichText(getText(q))}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed text-left pt-1">
                      {formatRichText(getText(currentCard.body))}
                    </p>

                    {/* Key Takeaway Highlight Banner */}
                    <div className="bg-gradient-to-r from-[#141779] via-[#1e1b4b] to-[#312e81] text-white rounded-2xl p-4 shadow-md flex items-center gap-3 border border-indigo-300/20">
                      <Sparkles size={22} className="text-[#57fae9] shrink-0 animate-pulse" />
                      <p className="text-xs sm:text-sm font-extrabold leading-snug text-white">
                        {formatRichText(getText(currentCard.key_takeaway))}
                      </p>
                    </div>
                  </div>
                )}

                {/* ────────────────── CARD 2: RELATABLE STORY ────────────────── */}
                {currentCard.type === "relatable_story" && (
                  <div className="space-y-4">
                    {renderSkillIcon(currentCard.icon, selectedSkill.category, 36)}

                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#006a62] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                        <BookOpen size={12} className="text-[#006a62]" />
                        <span>Step 2 • Real Life Story</span>
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#141779] leading-tight mb-3">
                        {formatRichText(getText(currentCard.title))}
                      </h2>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
                      <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed text-left">
                        {formatRichText(getText(currentCard.story))}
                      </p>
                    </div>

                    {/* Smart Rule Box */}
                    <div className="bg-gradient-to-tr from-amber-500/15 via-yellow-100/70 to-amber-100/50 border-2 border-amber-300/90 rounded-2xl p-4 sm:p-5 shadow-xs text-left">
                      <div className="flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider font-black text-amber-900">
                        <Lightbulb size={16} className="text-amber-600 fill-amber-500" />
                        <span>{lang === 'hi' ? 'स्मार्ट नियम' : lang === 'gu' ? 'સ્માર્ટ નિયમ' : 'Smart Rule'}</span>
                      </div>
                      <p className="text-sm sm:text-base font-extrabold text-[#141779] leading-snug">
                        {formatRichText(getText(currentCard.insight_box))}
                      </p>
                    </div>
                  </div>
                )}

                {/* ────────────────── CARD 3: METHOD CONCEPT CHECK (GATED) ────────────────── */}
                {currentCard.type === "method_concept_check" && (
                  <div className="space-y-4">
                    {renderSkillIcon(currentCard.icon, selectedSkill.category, 36)}

                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[#7C3AED] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                        <Lightbulb size={12} className="text-[#7C3AED]" />
                        <span>Step 3 • Brain Check</span>
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-[#141779] leading-snug mb-5">
                        {formatRichText(getText(currentCard.question))}
                      </h2>
                    </div>

                    {/* 2 Interactive Options (Badges on Left) */}
                    <div className="space-y-3">
                      <button
                        onClick={() => setCard3Selected("A")}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm sm:text-base shadow-xs flex items-center gap-3.5 ${
                          card3Selected === "A"
                            ? "border-rose-400 bg-rose-50/90 text-rose-950 shadow-sm"
                            : "border-slate-200 bg-white text-slate-800 hover:border-indigo-400 hover:shadow-md"
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          card3Selected === "A" ? "bg-rose-500 text-white shadow-sm" : "bg-slate-100 text-slate-600"
                        }`}>
                          A
                        </span>
                        <span className="flex-1 leading-snug">{formatRichText(getText(currentCard.option_a))}</span>
                      </button>

                      <button
                        onClick={() => setCard3Selected("B")}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm sm:text-base shadow-xs flex items-center gap-3.5 ${
                          card3Selected === "B"
                            ? "border-emerald-500 bg-emerald-50/90 text-emerald-950 shadow-md scale-[1.01]"
                            : "border-slate-200 bg-white text-slate-800 hover:border-indigo-400 hover:shadow-md"
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          card3Selected === "B" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600"
                        }`}>
                          B
                        </span>
                        <span className="flex-1 leading-snug">{formatRichText(getText(currentCard.option_b))}</span>
                      </button>
                    </div>

                    {/* Feedback Reveal Box */}
                    {card3Selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col gap-2 ${
                          card3Selected === "B"
                            ? "bg-gradient-to-r from-[#006a62] to-[#047857] text-white"
                            : "bg-gradient-to-r from-[#ba1a1a] to-[#991b1b] text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={22} className="shrink-0 text-white" />
                          <h3 className="font-black text-base sm:text-lg">
                            {card3Selected === "B" 
                              ? (lang === 'hi' ? 'शाबाश! सही उत्तर!' : lang === 'gu' ? 'શાબાશ! સાચો જવાબ!' : 'Spot On! Correct!') 
                              : (lang === 'hi' ? 'पुनर्विचार करें!' : lang === 'gu' ? 'ફરી વિચારો!' : 'Think Again!')}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed text-white/95">
                          {card3Selected === "B"
                            ? formatRichText(getText(currentCard.feedback))
                            : (lang === 'hi' ? 'रटना या उंगलियों पर धीरे-धीरे गिनना समय लेता है। स्मार्ट ट्रिक (Option B) चुनें!' : lang === 'gu' ? 'ગોખણપટ્ટી કે આંગળી પર ધીમે ગણવું સમય બગાડે છે. સ્માર્ટ ટ્રિક (Option B) પસંદ કરો!' : 'Line counting is slow. Choose Option B for the smart cognitive trick!')}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ────────────────── CARD 4: SKILL PRACTICE QUIZ (GATED) ────────────────── */}
                {currentCard.type === "skill_practice_quiz" && (
                  <div className="space-y-4">
                    {renderSkillIcon(currentCard.icon, selectedSkill.category, 36)}

                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#D97706] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                        <Target size={12} className="text-[#D97706]" />
                        <span>Step 4 • Skill Practice Quiz</span>
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-[#141779] leading-snug mb-5">
                        {formatRichText(getText(currentCard.question))}
                      </h2>
                    </div>

                    {/* 4 Options Grid (Badges on Left) */}
                    <div className="space-y-2.5">
                      {currentCard.options?.map((opt: any) => {
                        const isSelected = card4Selected === opt.id;
                        const isCorrect = opt.id === currentCard.correct_option;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setCard4Selected(opt.id)}
                            className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all font-bold text-xs sm:text-sm shadow-xs flex items-center gap-3.5 ${
                              isSelected
                                ? isCorrect
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-md font-black"
                                  : "border-rose-400 bg-rose-50 text-rose-950 font-bold"
                                : "border-slate-200 bg-white text-slate-800 hover:border-indigo-400 hover:shadow-sm"
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                              isSelected
                                ? isCorrect
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "bg-rose-500 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {opt.id}
                            </span>
                            <span className="flex-1 leading-snug">{formatRichText(getText(opt.text))}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quiz Feedback */}
                    {card4Selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col gap-2 ${
                          card4Selected === currentCard.correct_option
                            ? "bg-gradient-to-r from-[#006a62] to-[#047857] text-white"
                            : "bg-gradient-to-r from-[#ba1a1a] to-[#991b1b] text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Trophy size={22} className="shrink-0 text-amber-300" />
                          <h3 className="font-black text-base sm:text-lg">
                            {card4Selected === currentCard.correct_option 
                              ? (lang === 'hi' ? 'शानदार उत्तर!' : lang === 'gu' ? 'શ્રેષ્ઠ ઉત્તર!' : 'Spot On!') 
                              : (lang === 'hi' ? 'पुनः प्रयास करें!' : lang === 'gu' ? 'ફરી પ્રયાસ કરો!' : 'Try Again!')}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed text-white/95">
                          {card4Selected === currentCard.correct_option
                            ? formatRichText(getText(currentCard.feedback))
                            : (lang === 'hi' ? 'सही उत्तर चुनने का पुनः प्रयास करें!' : lang === 'gu' ? 'સાચો ઉત્તર પસંદ કરવા ફરી પ્રયાસ કરો!' : 'Think carefully and select the correct option!')}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* ────────────────── CARD 5: STRATEGY PILLS ────────────────── */}
                {currentCard.type === "strategy_pills" && (
                  <div className="space-y-4">
                    {renderSkillIcon(currentCard.icon, selectedSkill.category, 36)}

                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#141779] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                        <Zap size={12} className="text-[#4F46E5]" />
                        <span>Step 5 • Strategy Formula</span>
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#141779] leading-tight mb-2">
                        {formatRichText(getText(currentCard.title))}
                      </h2>
                      <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed mb-5">
                        {formatRichText(getText(currentCard.body))}
                      </p>
                    </div>

                    {/* Tags Grid with colorful borders */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentCard.tags?.map((tag: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200/90 text-[#141779] font-black py-2.5 px-3 rounded-2xl text-center text-xs shadow-2xs hover:border-indigo-300 transition-colors"
                        >
                          {formatRichText(getText(tag))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ────────────────── CARD 6: ACTION CHECKLIST (STRICT GATED) ────────────────── */}
                {currentCard.type === "action_checklist" && (
                  <div className="space-y-4">
                    {renderSkillIcon(currentCard.icon, selectedSkill.category, 36)}

                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[#006a62] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                        <CheckSquare size={12} className="text-[#006a62]" />
                        <span>Step 6 • Action Checklist</span>
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#141779] leading-tight mb-1">
                        {formatRichText(getText(currentCard.title))}
                      </h2>
                      <p className="text-[11px] text-slate-500 font-semibold italic mb-3">
                        {currentCard.interaction_note || "Check off each action step to unlock the Final Mission"}
                      </p>
                    </div>

                    {/* Checklist Steps */}
                    <div className="space-y-2.5">
                      {currentCard.steps?.map((st: any, idx: number) => {
                        const isChecked = checklistState[idx];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleToggleChecklist(idx)}
                            className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3.5 shadow-xs ${
                              isChecked
                                ? "border-teal-500 bg-teal-50/80 text-teal-950 font-black"
                                : "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 font-bold"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                              isChecked
                                ? "bg-teal-600 text-white shadow-sm"
                                : "border-2 border-slate-300 text-slate-500 bg-slate-50"
                            }`}>
                              {isChecked ? "✓" : (st.step_number || st.correct_order || idx + 1)}
                            </div>
                            <span className="text-xs sm:text-sm leading-snug">
                              {formatRichText(getText(st.text))}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ────────────────── CARD 7: FINAL MISSION & DYNAMIC XP CLAIM ────────────────── */}
                {currentCard.type === "daily_mission" && (
                  <div className="space-y-4 text-center">
                    {renderSkillIcon("trophy", selectedSkill.category, 40)}

                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#D97706] font-extrabold text-[10px] tracking-wider uppercase mb-2 shadow-2xs">
                      <Trophy size={12} className="text-[#D97706]" />
                      <span>Step 7 • Daily Mission</span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#141779] leading-tight mb-3">
                      {formatRichText(getText(currentCard.title))}
                    </h2>

                    {/* Mission Text Card */}
                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-xs max-w-md mx-auto mb-5">
                      <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
                        {formatRichText(getText(currentCard.mission_text))}
                      </p>
                    </div>

                    {/* XP Claim Button */}
                    {!missionClaimed ? (
                      <button
                        onClick={handleClaimMission}
                        disabled={submitting}
                        className="mx-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#141779] via-[#2563EB] to-[#4F46E5] hover:brightness-110 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-500/25 active:scale-95 transition-all w-full max-w-sm"
                      >
                        <Award size={22} className="text-yellow-300" />
                        <span>
                          {submitting 
                            ? (lang === 'hi' ? "कैलकुलेट हो रहा है..." : lang === 'gu' ? "ગણતરી થઈ રહી છે..." : "Calculating XP...") 
                            : (lang === 'hi' ? `कलेक्ट +${selectedSkill.xp || 20} XP और मिशन पूरा करें` : lang === 'gu' ? `એકત્ર કરો +${selectedSkill.xp || 20} XP અને મિશન પૂર્ણ કરો` : `Accept Mission & Claim +${selectedSkill.xp || 20} XP`)}
                        </span>
                      </button>
                    ) : (
                      <div className="bg-gradient-to-r from-[#006a62] to-[#047857] text-white rounded-3xl p-6 shadow-xl space-y-4 max-w-md mx-auto">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 size={30} className="text-[#57fae9]" />
                          <h3 className="text-xl font-black">
                            {completedSkillIds.includes(selectedSkill.id) 
                              ? (lang === 'hi' ? 'मिशन पूरा हुआ! +20 XP' : lang === 'gu' ? 'મિશન પૂર્ણ થયું! +20 XP' : 'Mission Completed! +20 XP') 
                              : 'Practice Completed!'}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-white/90">
                          {lang === 'hi'
                            ? 'शाबाश! आपने यह स्किल पूरा कर लिया है और अगला स्किल अनलॉक हो गया है!'
                            : lang === 'gu'
                            ? 'શાબાશ! તમે આ સ્કીલ પૂર્ણ કરી લીધું છે અને આગામી સ્કીલ અનલોક થઈ ગયું છે!'
                            : 'Awesome! You have completed this micro-lesson and unlocked the next skill in sequence!'}
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                          <button
                            onClick={async () => {
                              await handleClaimMission();
                              handleLaunchNextSkill();
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#57fae9] text-[#141779] font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>{lang === 'hi' ? 'अगला स्किल चालू करें' : lang === 'gu' ? 'આગળનું સ્કીલ શરૂ કરો' : 'Next Skill'}</span>
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              await handleClaimMission();
                              setViewMode("library");
                            }}
                            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/20 text-white font-bold text-xs sm:text-sm hover:bg-white/30 active:scale-95 transition-all"
                          >
                            {lang === 'hi' ? 'लाइब्रेरी पर जाएं' : lang === 'gu' ? 'લાઇબ્રેરી પર જાઓ' : 'Back to Library'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

          {/* STICKY BOTTOM NAVIGATION BAR */}
          <footer className="fixed bottom-0 left-0 right-0 w-full p-4 sm:p-5 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-10px_30px_rgba(20,23,121,0.05)] z-50 max-w-lg mx-auto flex items-center gap-3">
            {activeCardIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-5 py-3.5 rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95 font-black text-sm transition-all shadow-2xs"
              >
                {lang === 'hi' ? 'पीछे' : lang === 'gu' ? 'પાછળ' : 'Back'}
              </button>
            )}

            {activeCardIndex < totalCards - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-[#141779] via-[#1e1b4b] to-[#4F46E5] text-white py-4 rounded-full font-black text-base flex justify-center items-center gap-2 shadow-xl shadow-indigo-900/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{lang === 'hi' ? 'आगे' : lang === 'gu' ? 'આગળ' : 'Continue'}</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={async () => {
                  await handleClaimMission();
                  setViewMode("library");
                }}
                className="flex-1 bg-gradient-to-r from-[#006a62] to-[#047857] text-white py-4 rounded-full font-black text-base flex justify-center items-center gap-2 shadow-xl shadow-emerald-700/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{lang === 'hi' ? 'लाइब्रेरी पर जाएं' : lang === 'gu' ? 'લાઇબ્રેરી પર જાઓ' : 'Finish & Return to Library'}</span>
                <CheckCircle2 size={18} />
              </button>
            )}
          </footer>

        </div>
      )}

    </div>
  );
}
