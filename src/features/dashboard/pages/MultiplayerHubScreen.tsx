import { ArrowLeft, Book, ChevronDown, Globe, Microscope, Shapes, Swords, Trophy, Users, Lock, BookOpen, X, Sparkles, Check, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

const getSubjectStyle = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("math")) return { icon: Shapes, color: "text-[#D97706]", bg: "bg-[#FFFBEB]", border: "border-[#F59E0B]", activeBg: "bg-[#FEF3C7]", glow: "shadow-[0_4px_16px_rgba(245,158,11,0.25)]" };
  if (n.includes("sci")) return { icon: Microscope, color: "text-[#0284C7]", bg: "bg-[#F0F9FF]", border: "border-[#0EA5E9]", activeBg: "bg-[#E0F2FE]", glow: "shadow-[0_4px_16px_rgba(14,165,233,0.25)]" };
  if (n.includes("eng") || n.includes("hind")) return { icon: Book, color: "text-[#6D28D9]", bg: "bg-[#F5F3FF]", border: "border-[#8B5CF6]", activeBg: "bg-[#EDE9FE]", glow: "shadow-[0_4px_16px_rgba(139,92,246,0.25)]" };
  if (n.includes("soc") || n.includes("env")) return { icon: Globe, color: "text-[#DC2626]", bg: "bg-[#FEF2F2]", border: "border-[#EF4444]", activeBg: "bg-[#FEE2E2]", glow: "shadow-[0_4px_16px_rgba(239,68,68,0.25)]" };
  return { icon: BookOpen, color: "text-[#3520A8]", bg: "bg-[#F4EFF7]", border: "border-[#6C4DFF]", activeBg: "bg-[#EAE2FB]", glow: "shadow-[0_4px_16px_rgba(108,77,255,0.25)]" };
};

// Left Shadow Fighter Silhouette SVG
const FighterLeftSVG = () => (
  <svg viewBox="0 0 100 120" className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[0_0_10px_rgba(108,77,255,0.8)]">
    <defs>
      <linearGradient id="fighterGlowLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9C7CFF" />
        <stop offset="100%" stopColor="#3520A8" />
      </linearGradient>
      <filter id="glowLeft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glowLeft)">
      <ellipse cx="50" cy="100" rx="36" ry="8" fill="url(#fighterGlowLeft)" opacity="0.5" />
      <circle cx="58" cy="24" r="11" fill="#140B3B" stroke="#9C7CFF" strokeWidth="2" />
      <path d="M 46 20 Q 34 16 30 22 Q 40 24 47 26 Z" fill="#6C4DFF" />
      <path d="M 48 35 Q 65 32 68 47 L 60 72 L 40 70 L 38 50 Z" fill="#0D0628" stroke="#6C4DFF" strokeWidth="1.5" />
      <path d="M 64 38 L 84 30 L 90 36 L 68 48 Z" fill="#1B1052" stroke="#9C7CFF" strokeWidth="1.5" />
      <path d="M 46 40 L 30 47 L 34 54 L 50 46 Z" fill="#0A041E" stroke="#6C4DFF" strokeWidth="1" />
      <path d="M 42 70 L 22 100 L 12 98 L 34 67 Z" fill="#0A041E" stroke="#6C4DFF" strokeWidth="1.5" />
      <path d="M 58 71 L 75 100 L 88 100 L 66 68 Z" fill="#140B3B" stroke="#9C7CFF" strokeWidth="1.5" />
      <path d="M 59 14 A 11 11 0 0 1 68 27" fill="none" stroke="#F4C95D" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// Right Shadow Fighter Silhouette SVG
const FighterRightSVG = () => (
  <svg viewBox="0 0 100 120" className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[0_0_10px_rgba(244,201,93,0.8)]">
    <defs>
      <linearGradient id="fighterGlowRight" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F4C95D" />
        <stop offset="100%" stopColor="#FF5252" />
      </linearGradient>
      <filter id="glowRight" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glowRight)">
      <ellipse cx="50" cy="100" rx="36" ry="8" fill="url(#fighterGlowRight)" opacity="0.5" />
      <circle cx="42" cy="24" r="11" fill="#140B3B" stroke="#F4C95D" strokeWidth="2" />
      <path d="M 54 20 Q 66 16 70 22 Q 60 24 53 26 Z" fill="#FF5252" />
      <path d="M 52 35 Q 35 32 32 47 L 40 72 L 60 70 L 62 50 Z" fill="#0D0628" stroke="#F4C95D" strokeWidth="1.5" />
      <path d="M 36 38 L 16 30 L 10 36 L 32 48 Z" fill="#1B1052" stroke="#F4C95D" strokeWidth="1.5" />
      <path d="M 54 40 L 70 47 L 66 54 L 50 46 Z" fill="#0A041E" stroke="#FF5252" strokeWidth="1" />
      <path d="M 58 70 L 78 100 L 88 98 L 66 67 Z" fill="#0A041E" stroke="#F4C95D" strokeWidth="1.5" />
      <path d="M 42 71 L 25 100 L 12 100 L 34 68 Z" fill="#140B3B" stroke="#F4C95D" strokeWidth="1.5" />
      <path d="M 41 14 A 11 11 0 0 0 32 27" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

export default function MultiplayerHubScreen() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chapter, setChapter] = useState("Mix Chapters");
  const [chaptersList, setChaptersList] = useState<string[]>([]);
  const [myClass, setMyClass] = useState("Class 1");
  const [myCoins, setMyCoins] = useState(0);
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [myStreak, setMyStreak] = useState(0);
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  // Dynamic Subjects & Chapter Locks
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [practiceChapters, setPracticeChapters] = useState<any[]>([]);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);

  useEffect(() => {
    apiFetch("/api/users/me").then(r => r.json()).then(d => {
      if (d.success && d.data?.user) {
        if (d.data.user.childClass) setMyClass(d.data.user.childClass);
        setMyCoins(d.data.user.coins || 0);
        setMyStreak(d.data.user.multiplayerStreak || 0);
      }
    });

    Promise.all([
      apiFetch("/api/practice/subjects"),
      apiFetch("/api/parent/controls")
    ])
      .then(async ([subjRes, controlsRes]) => {
        const subjData = await subjRes.json();
        const controlsData = await controlsRes.json();

        let restricted: Record<string, boolean> = {};
        if (controlsData.success && controlsData.data?.parentControls?.restrictedSubjects) {
          restricted = controlsData.data.parentControls.restrictedSubjects;
        }

        if (subjData.success && subjData.data && subjData.data.length > 0) {
          const allowedSubjects = subjData.data.filter((s: any) => !restricted[s.name]);
          setSubjects(allowedSubjects);
          if (allowedSubjects.length > 0) {
            setActiveSubject(allowedSubjects[0]);
          }
        }
      });
  }, []);

  useEffect(() => {
    if (!activeSubject) return;

    // Fetch Practice Chapters & Progress
    Promise.all([
      apiFetch(`/api/practice/chapters/${activeSubject._id}`),
      apiFetch(`/api/practice/chapter-progress`)
    ]).then(async ([chRes, pRes]) => {
      const chData = await chRes.json();
      const pData = await pRes.json();

      let fetchedChapters: any[] = [];
      if (chData.success) {
        fetchedChapters = chData.data;
        setPracticeChapters(fetchedChapters);
      } else {
        setPracticeChapters([]);
      }

      if (pData.success && pData.data) {
        const completedIds = pData.data
          .filter((p: any) => p.chapterCompleted || p.completed)
          .map((p: any) => p.chapterId);
        setCompletedChapterIds(completedIds);
      } else {
        setCompletedChapterIds([]);
      }

      const chapterNames = fetchedChapters.map(c => c.name);
      setChaptersList(chapterNames);
      
      if (!chapterNames.includes(chapter) && chapter !== "Mix Chapters") {
        setChapter("Mix Chapters");
      }
    }).catch(() => {});
  }, [activeSubject, myClass]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isChapterUnlocked = (chName: string) => {
    if (chName === "Mix Chapters" || chName === "Mix Chapters (All)") return true;
    const pracCh = practiceChapters.find(p => p.name === chName);
    if (!pracCh) return true;
    return completedChapterIds.includes(pracCh._id) || completedChapterIds.includes(`${pracCh._id}_hard`);
  };

  const getMixChapterOrder = () => {
    if (!practiceChapters.length || !completedChapterIds.length) return 1;
    const completedOrders = practiceChapters
      .filter(p => completedChapterIds.includes(p._id) || completedChapterIds.includes(`${p._id}_hard`))
      .map(p => p.order || 1);
    return completedOrders.length > 0 ? Math.max(...completedOrders) : 1;
  };

  const getEntryFee = (order: number) => {
    return 100;
  };

  const currentOrder = chapter === "Mix Chapters" ? getMixChapterOrder() : (practiceChapters.find(p => p.name === chapter)?.order || 1);
  const entryFee = getEntryFee(currentOrder);

  const hasCompletedAnyChapterInSubject = () => {
    if (!practiceChapters.length) return true;
    return practiceChapters.some(ch => 
      completedChapterIds.includes(ch._id) || completedChapterIds.includes(`${ch._id}_hard`)
    );
  };

  const handleCreateRoom = async () => {
    if (!hasCompletedAnyChapterInSubject()) {
      setError(`You must complete at least one chapter in ${activeSubject?.name || "this subject"} to enter the Shadow Arena!`);
      return;
    }
    if (myCoins < entryFee) {
      setError(`Not enough coins! You need at least ${entryFee} coins to play Shadow Arena in this city.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/multiplayer/room/create", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: activeSubject?.name || "Mathematics", chapter })
      });
      const data = await res.json();
      if (data.success && data.data) {
        navigate(`/multiplayer-room/${data.data._id}`);
      } else {
        setError(data.message || "Failed to create room");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (myCoins < 100) {
      setError("Not enough coins! You need at least 100 coins to join any Arena match.");
      return;
    }
    if (joinCode.length < 6) {
      setError("Code must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/multiplayer/room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode })
      });
      const data = await res.json();
      if (data.success && data.data) {
        navigate(`/multiplayer-room/${data.data.roomId}`);
      } else {
        setError(data.message || "Invalid room code");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#F4EFF7] via-[#F9F6FF] to-[#FFFFFF] text-[#141779] font-sans flex flex-col justify-between overflow-hidden relative">
      {/* Background Soft Glow Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[35%] rounded-full bg-[#6C4DFF]/10 blur-[80px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#F4C95D]/15 blur-[90px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] rounded-full bg-[#3520A8]/5 blur-[70px]" />
      </div>

      {/* TOP NAVIGATION HUD BAR */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-white/80 backdrop-blur-md border-b border-[#E5DBFB] sticky top-0 z-40 shrink-0 shadow-sm">
        <button 
          onClick={() => setShowLeaveModal(true)} 
          className="w-9 h-9 rounded-full bg-[#F4EFF7] border border-[#E5DBFB] hover:bg-[#EAE2FB] flex items-center justify-center transition-all active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft size={18} className="text-[#141779]" />
        </button>

        <div className="flex items-center gap-1.5">
          <Sparkles size={16} className="text-[#6C4DFF] animate-pulse" />
          <h1 className="text-[16px] font-black tracking-widest uppercase text-[#141779]">
            SHADOW ARENA
          </h1>
        </div>

        {/* COIN HUD BADGE */}
        <div className="flex items-center gap-1.5 bg-white border-2 border-[#F4C95D] px-2.5 py-1 rounded-full shadow-[0_2px_8px_rgba(244,201,93,0.3)]">
          <span className="text-xs">🪙</span>
          <span className="text-xs font-black text-[#141779] tracking-wide">{myCoins}</span>
        </div>
      </header>

      {/* MAIN GAME LOBBY CONTENT AREA (COMPACT NO-SCROLL LAYOUT) */}
      <main className="px-4 py-2 flex-1 flex flex-col justify-between max-w-[430px] mx-auto w-full z-10 overflow-y-auto overflow-x-hidden scrollbar-none">
        
        {/* HERO 1V1 SHADOW BATTLE STAGE */}
        <section className="flex flex-col items-center shrink-0">
          <div className="w-full bg-gradient-to-b from-[#180C4F] to-[#2B1778] border-2 border-[#6C4DFF]/40 rounded-2xl p-2.5 relative shadow-[0_8px_20px_rgba(20,23,121,0.25)] overflow-hidden">
            {/* Background Battle Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Fighter Duel Stage */}
            <div className="relative flex items-center justify-between px-3 py-1">
              {/* Player 1 Left */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-white bg-[#6C4DFF] px-2 py-0.5 rounded-full border border-[#9C7CFF] mb-0.5 shadow-sm">
                  YOU
                </span>
                <FighterLeftSVG />
              </div>

              {/* Center VS Emblem */}
              <div className="flex flex-col items-center z-10 mx-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4C95D] via-[#FF5252] to-[#6C4DFF] p-[2px] shadow-[0_0_16px_rgba(244,201,93,0.8)] animate-pulse">
                  <div className="w-full h-full bg-[#120738] rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-[#F4C95D] tracking-tighter italic">VS</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-white tracking-widest mt-1 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  ARENA 1v1
                </span>
              </div>

              {/* Player 2 Right */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#141779] bg-[#F4C95D] px-2 py-0.5 rounded-full border border-[#FFD700] mb-0.5 shadow-sm">
                  CHALLENGER
                </span>
                <FighterRightSVG />
              </div>
            </div>

            {/* Subtitle tag */}
            <p className="text-center text-[10px] font-bold text-[#EAE2FB] mt-0.5 tracking-tight">
              Challenge your friend • Answer faster • Win rewards
            </p>
          </div>
        </section>

        {/* BATTLE STATUS & STREAK REWARD BADGE */}
        <section className="my-1.5 shrink-0">
          <div className="bg-white border-2 border-[#E5DBFB] rounded-xl px-3 py-1.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FEF3C7] border border-[#F59E0B]/40 flex items-center justify-center shrink-0">
                <Trophy size={14} className="text-[#D97706]" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-[#141779] uppercase tracking-wider leading-none">
                  25 WIN STREAK CHALLENGE
                </p>
                <p className="text-[9px] font-bold text-[#6D28D9] mt-0.5 leading-none">
                  {myStreak > 0 ? `Current Streak: ${myStreak} Wins 🏆` : "Win 25 matches for physical prize!"}
                </p>
              </div>
            </div>

            {/* Streak Progress Indicator */}
            <div className="flex items-center gap-1 bg-[#F4EFF7] border border-[#E5DBFB] px-2 py-1 rounded-lg">
              <span className="text-xs">🔥</span>
              <span className="text-xs font-black text-[#141779]">{myStreak}/25</span>
            </div>
          </div>
        </section>

        {/* TAB SWITCHER: CREATE BATTLE vs JOIN ROOM */}
        <section className="flex bg-[#EAE2FB] p-1 rounded-xl border border-[#E5DBFB] shrink-0 my-1">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "create"
                ? "bg-gradient-to-r from-[#6C4DFF] to-[#3520A8] text-white shadow-md border border-[#9C7CFF]/50"
                : "text-[#6D28D9] hover:text-[#141779]"
            }`}
          >
            <Swords size={14} />
            <span>CREATE BATTLE</span>
          </button>

          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "join"
                ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-md border border-[#FFD700]/50"
                : "text-[#6D28D9] hover:text-[#141779]"
            }`}
          >
            <Key size={14} />
            <span>JOIN WITH CODE</span>
          </button>
        </section>

        {/* DYNAMIC ERROR TOAST */}
        {error && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white border-l-4 border-red-600 border-y border-r border-red-200 rounded-xl p-3 shadow-2xl backdrop-blur-md z-50 flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-xs font-bold text-[#141779] leading-tight">{error}</p>
            </div>
            <button onClick={() => setError("")} className="p-1 text-red-600 hover:bg-red-50 rounded-full">
              <X size={16} />
            </button>
          </div>
        )}

        {/* TAB 1: CREATE BATTLE SETUP */}
        {activeTab === "create" && (
          <div className="flex-1 flex flex-col justify-between my-1 gap-2">
            {/* SUBJECT SELECTION SECTION */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-[#141779]">
                  CHOOSE YOUR BATTLE
                </span>
                <span className="text-[10px] font-bold text-[#6D28D9]">
                  Pick a subject
                </span>
              </div>

              {/* 2-COLUMN SUBJECT CARDS GRID */}
              <div className="grid grid-cols-2 gap-2">
                {subjects.map(subj => {
                  const isSelected = activeSubject?._id === subj._id;
                  const style = getSubjectStyle(subj.name);
                  const Icon = style.icon;
                  return (
                    <button
                      key={subj._id}
                      onClick={() => {
                        setActiveSubject(subj);
                        setChapter("Mix Chapters");
                      }}
                      className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected 
                          ? `${style.activeBg} ${style.border} ${style.glow} scale-[1.02] z-10` 
                          : 'bg-white border-[#E5DBFB] hover:border-[#6C4DFF]/40 text-[#464652]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${style.bg} shrink-0`}>
                        <Icon size={20} className={style.color} />
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-3">
                        <p className={`text-xs font-black uppercase tracking-tight truncate ${isSelected ? "text-[#141779]" : "text-[#464652]"}`}>
                          {subj.name}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#6C4DFF] text-white flex items-center justify-center shadow-sm">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHAPTER SELECTOR */}
            {chaptersList.length > 0 && (
              <div className="flex flex-col gap-1 relative my-0.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#6D28D9] px-0.5">
                  CHAPTER / BATTLEGROUND
                </span>

                <button
                  onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border-2 border-[#E5DBFB] hover:border-[#6C4DFF] rounded-xl py-2.5 px-3.5 text-xs font-bold text-[#141779] focus:outline-none transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <Swords size={14} className="text-[#6C4DFF] shrink-0" />
                    <span className="truncate">{chapter === "Mix Chapters" ? "Mix Chapters (All)" : chapter}</span>
                  </div>
                  <ChevronDown size={18} className={`text-[#6D28D9] transition-transform duration-300 ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Chapter Dropdown Menu */}
                {isChapterDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border-2 border-[#E5DBFB] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-44 overflow-y-auto scrollbar-thin">
                      <div
                        onClick={() => { setChapter("Mix Chapters"); setIsChapterDropdownOpen(false); }}
                        className={`px-3.5 py-2.5 text-xs font-bold cursor-pointer transition-colors border-b border-[#F0EBFB] flex items-center justify-between ${
                          chapter === "Mix Chapters" ? 'bg-[#3520A8] text-white' : 'text-[#141779] hover:bg-[#F4EFF7]'
                        }`}
                      >
                        <span>⚔ Mix Chapters (All)</span>
                        {chapter === "Mix Chapters" && <Check size={14} />}
                      </div>

                      {chaptersList.map(c => {
                        const unlocked = isChapterUnlocked(c);
                        return (
                          <div
                            key={c}
                            onClick={() => { 
                              if (unlocked) {
                                setChapter(c); 
                                setIsChapterDropdownOpen(false); 
                              } else {
                                setError("Please first complete this chapter in your learning path to unlock it in the Arena!");
                                setTimeout(() => setError(""), 4000);
                              }
                            }}
                            className={`px-3.5 py-2.5 text-xs font-bold cursor-pointer transition-colors border-b border-[#F0EBFB] last:border-0 flex items-center justify-between ${
                              !unlocked ? 'bg-gray-50 text-gray-400' :
                              chapter === c ? 'bg-[#3520A8] text-white' : 'text-[#464652] hover:bg-[#F4EFF7]'
                            }`}
                          >
                            <span className="truncate pr-2">{c}</span>
                            {!unlocked ? (
                              <Lock size={14} className="shrink-0 text-gray-400" />
                            ) : (
                              chapter === c && <Check size={14} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CREATE BATTLE CTA BUTTON */}
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6C4DFF] via-[#512BE2] to-[#3520A8] hover:from-[#7C5DFF] hover:to-[#4529C8] text-white py-3 rounded-xl shadow-[0_4px_16px_rgba(108,77,255,0.35)] active:scale-[0.98] transition-all flex flex-col items-center justify-center border border-[#9C7CFF]/40 relative overflow-hidden group shrink-0 mt-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="text-sm font-black tracking-wider uppercase">
                  {loading ? "CREATING BATTLE..." : "⚔ CREATE BATTLE"}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#F4C95D] mt-0.5">
                Cost: {entryFee} Coins | Win: {entryFee * 2} Coins
              </span>
            </button>
          </div>
        )}

        {/* TAB 2: JOIN WITH CODE SETUP */}
        {activeTab === "join" && (
          <div className="flex-1 flex flex-col justify-center gap-4 my-4">
            <div className="bg-white border-2 border-[#E5DBFB] rounded-2xl p-4 flex flex-col gap-4 text-center shadow-sm">
              <div>
                <h3 className="text-sm font-black text-[#141779] uppercase tracking-wider">
                  ENTER ROOM CODE
                </h3>
                <p className="text-[11px] text-[#6D28D9] mt-1">
                  Ask your friend for their 6-digit Shadow Arena battle code.
                </p>
              </div>

              <input
                type="text"
                placeholder="ENTER 6-DIGIT CODE"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-[#F4EFF7] border-2 border-[#F59E0B] focus:border-[#D97706] rounded-xl py-3 px-4 text-center text-2xl font-black text-[#141779] tracking-[8px] focus:outline-none transition-all uppercase placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-bold placeholder:text-xs"
              />

              <button
                onClick={handleJoinRoom}
                disabled={loading || joinCode.length < 6}
                className={`w-full py-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                  joinCode.length === 6 
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white border-[#FFD700] shadow-[0_4px_16px_rgba(245,158,11,0.4)] active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                <span className="text-sm font-black tracking-wider uppercase">
                  {loading ? "JOINING BATTLE..." : "JOIN BATTLE MATCH"}
                </span>
                <span className="text-[10px] font-bold text-white/80">Cost: 100 Coins</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* LEAVE CONFIRMATION MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs flex flex-col items-center text-center shadow-2xl border-2 border-[#E5DBFB] animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-3">
              <Swords size={24} className="text-red-600" />
            </div>
            <h2 className="text-lg font-black text-[#141779] mb-1">Leave Shadow Arena?</h2>
            <p className="text-xs font-semibold text-[#6D28D9] mb-5">
              Are you sure you want to exit the battle lobby?
            </p>
            <div className="flex gap-2.5 w-full">
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 bg-[#F4EFF7] text-[#141779] py-2.5 rounded-xl font-bold text-xs hover:bg-[#EAE2FB] transition-all border border-[#E5DBFB]"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLeaveModal(false);
                  navigate("/home");
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-xl font-bold text-xs hover:brightness-110 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
              >
                Leave Arena
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
