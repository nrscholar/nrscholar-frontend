import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Flame,
  FlaskConical,
  Trophy,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

interface SlideData {
  id: number;
  classTag: string;
  classTagColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeIcon: React.ReactNode;
  title: string;
  titleHighlight: string;
  description: string;
  image: string;
  imageAlt: string;
  glowColor: string;
  accentColor: string;
  features: {
    icon: React.ReactNode;
    text: string;
  }[];
  ctaText: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    classTag: "WELCOME • ALL GRADES",
    classTagColor: "text-indigo-700",
    badgeBg: "bg-indigo-50",
    badgeBorder: "border-indigo-200/80",
    badgeIcon: <Rocket size={14} className="text-indigo-600" />,
    title: "Make Learning",
    titleHighlight: "Fun & Easy",
    description:
      "Daily lessons turned into fun games and adventures. Build strong study habits with confidence every day.",
    image: "/splash/screen1_purpose.jpg",
    imageAlt: "Cosmic Book and Rocket representing NR Scholar purpose",
    glowColor: "from-indigo-500/20 via-purple-500/10 to-transparent",
    accentColor: "#141779",
    features: [
      { icon: <Sparkles size={14} className="text-indigo-600" />, text: "Fun Lessons" },
      { icon: <Zap size={14} className="text-indigo-600" />, text: "Daily Streaks" },
    ],
    ctaText: "Get Started",
  },
  {
    id: 2,
    classTag: "CLASS 1 – 4 • DRAGON REALM",
    classTagColor: "text-amber-800",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200/80",
    badgeIcon: <Flame size={14} className="text-amber-600" />,
    title: "Grow Your",
    titleHighlight: "Pet Dragon",
    description:
      "Learn reading and math while caring for your baby dragon. Complete daily lessons to help your dragon grow!",
    image: "/splash/screen2_dragon.jpg",
    imageAlt: "Cute baby dragon hatching from cosmic egg",
    glowColor: "from-amber-500/25 via-orange-500/10 to-transparent",
    accentColor: "#d97706",
    features: [
      { icon: <Flame size={14} className="text-amber-600" />, text: "Pet Dragon Care" },
      { icon: <Sparkles size={14} className="text-amber-600" />, text: "Story Lessons" },
    ],
    ctaText: "Next",
  },
  {
    id: 3,
    classTag: "CLASS 5 – 7 • SCIENCE LAB",
    classTagColor: "text-teal-800",
    badgeBg: "bg-teal-50",
    badgeBorder: "border-teal-200/80",
    badgeIcon: <FlaskConical size={14} className="text-teal-600" />,
    title: "Explore The",
    titleHighlight: "Science Lab",
    description:
      "Try fun science experiments in 3D, solve math step by step, and get help from your AI study friend Saathy.",
    image: "/splash/screen3_scientist.jpg",
    imageAlt: "Student scientist with glowing lab equipment and robot assistant",
    glowColor: "from-teal-500/25 via-emerald-500/10 to-transparent",
    accentColor: "#006a62",
    features: [
      { icon: <FlaskConical size={14} className="text-teal-600" />, text: "3D Science Lab" },
      { icon: <Sparkles size={14} className="text-teal-600" />, text: "AI Study Friend" },
    ],
    ctaText: "Next",
  },
  {
    id: 4,
    classTag: "CLASS 8 – 10 • TOP SCHOLARS",
    classTagColor: "text-blue-900",
    badgeBg: "bg-blue-50",
    badgeBorder: "border-blue-200/80",
    badgeIcon: <Trophy size={14} className="text-amber-600" />,
    title: "Win Medals &",
    titleHighlight: "Top Ranks",
    description:
      "Practice for board exams and tests. Play live quiz battles with friends and climb to Rank #1 on the leaderboard!",
    image: "/splash/screen4_medalist.jpg",
    imageAlt: "Student academic champion on first place podium with trophy and gold medal",
    glowColor: "from-blue-600/25 via-amber-400/15 to-transparent",
    accentColor: "#141779",
    features: [
      { icon: <Trophy size={14} className="text-amber-600" />, text: "Live Quiz Battles" },
      { icon: <Award size={14} className="text-amber-600" />, text: "Rank #1 Leaderboard" },
    ],
    ctaText: "Start Your Journey",
  },
];

export default function SplashScreen() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Allow keyboard navigation for testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("hasSeenSplash", "true");
    navigate("/login");
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenSplash", "true");
    navigate("/login");
  };

  const currentSlide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  // Variants for slide animation
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25, ease: "easeIn" as const },
    }),
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#f7f9fb] font-sans flex flex-col justify-between items-center relative overflow-hidden select-none">

      {/* Top Background Ambient Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[460px] h-[340px] rounded-full blur-3xl pointer-events-none transition-all duration-700 bg-gradient-to-b ${currentSlide.glowColor}`}
      />

      {/* Main Container - Pure Mobile Viewport Enclosure */}
      <div className="w-full max-w-[420px] h-[100dvh] flex flex-col justify-between mx-auto px-5 py-4 relative z-10">

        {/* 1. Header Bar: Logo + Skip */}
        <header className="flex items-center justify-between pt-1 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#141779] flex items-center justify-center shadow-md shadow-[#141779]/20">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-black text-[#141779] tracking-tight text-base">
              NR Scholar
            </span>
          </div>

          {!isLast ? (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-[#141779] hover:bg-slate-200/60 active:scale-95 transition-all"
              aria-label="Skip onboarding"
            >
              <span>Skip</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <div className="h-7 w-12" />
          )}
        </header>

        {/* 2. Visual Center Carousel Frame with Touch Gesture Drag */}
        <div className="flex-1 flex flex-col items-center justify-center my-auto relative py-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) handleNext();
                else if (info.offset.x > 40) handlePrev();
              }}
              className="w-full flex flex-col items-center cursor-grab active:cursor-grabbing"
            >
              {/* 3D Illustration Frame */}
              <div className="relative w-[280px] h-[280px] xs:w-[310px] xs:h-[310px] flex items-center justify-center">

                {/* Soft Decorative Ambient Ring */}
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/90 to-white/40 shadow-[0_12px_40px_rgba(20,23,121,0.08)] border border-white/80 p-2.5 backdrop-blur-sm" />

                {/* Floating Corner Accent Pill */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-2 z-20"
                >
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md border ${currentSlide.badgeBg} ${currentSlide.badgeBorder} ${currentSlide.classTagColor}`}>
                    {currentSlide.badgeIcon}
                    <span>{currentSlide.classTag.split("•")[0].trim()}</span>
                  </div>
                </motion.div>

                {/* Main Render Image */}
                <div className="relative w-full h-full rounded-[26px] overflow-hidden shadow-inner bg-slate-100">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.imageAlt}
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle Gradient Vignette at image bottom for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Bottom Information & Action Card */}
        <div className="bg-white rounded-[32px] p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col gap-4">

          {/* Header Tag + Title */}
          <div className="flex flex-col gap-1.5 text-center items-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${currentSlide.badgeBg} ${currentSlide.badgeBorder} ${currentSlide.classTagColor}`}>
              {currentSlide.badgeIcon}
              <span>{currentSlide.classTag}</span>
            </div>

            <h1 className="text-2xl font-black text-[#141779] tracking-tight leading-tight mt-0.5">
              {currentSlide.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141779] to-[#006a62]">
                {currentSlide.titleHighlight}
              </span>
            </h1>

            <p className="text-xs text-[#767683] font-medium leading-relaxed px-1 min-h-[38px]">
              {currentSlide.description}
            </p>
          </div>

          {/* Feature Highlight Chips (2 Badges) */}
          <div className="flex items-center justify-center gap-2">
            {currentSlide.features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm"
              >
                {feat.icon}
                <span>{feat.text}</span>
              </span>
            ))}
          </div>

          {/* Stepper Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 py-0.5">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${isActive
                    ? "w-7 bg-[#141779]"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Action Button & Login Link */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleNext}
              className="w-full h-14 bg-[#141779] hover:bg-[#0f115a] active:scale-98 text-white rounded-2xl font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(20,23,121,0.25)] transition-all"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight size={18} className="text-white" />
            </button>

            {/* Bottom Login Alternative Link */}
            <div className="flex justify-center items-center gap-1.5">
              <span className="text-xs text-[#767683] font-semibold">
                Already have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-xs font-black text-[#141779] hover:underline"
              >
                Log In
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
