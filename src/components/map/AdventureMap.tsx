import React, { useState } from "react";
import { motion } from "framer-motion";
import MapLandmark, { LandmarkData } from "./MapLandmark";
import CompanionCharacter from "./CompanionCharacter";
import LocationPreview from "./LocationPreview";

interface AdventureMapProps {
  xp: number;
  userLevel?: number;
  lessonsCompleted?: number;
  companionType?: "dragon" | "science" | "social" | "space" | "ocean" | "history";
  onEnterLocation: (landmark: LandmarkData) => void;
}

export default function AdventureMap({
  xp,
  userLevel = 5,
  lessonsCompleted = 12,
  companionType = "dragon",
  onEnterLocation,
}: AdventureMapProps) {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);

  // Default rich illustrated map landmarks across 6 distinct game regions
  const mapLandmarks: LandmarkData[] = [
    {
      id: "landmark_1",
      name: "Egg Village",
      region: "Dragon Realm 🐉",
      emoji: "🥚",
      status: xp >= 0 ? (xp >= 1000 ? "completed" : "active") : "unlocked",
      x: 18,
      y: 84,
      requiredXp: 0,
      description: "The cozy starting village where dragon eggs hatch in warm embers.",
      missionsCount: 3,
      reward: "Dragon Egg",
      rewardIcon: "🥚",
      themeColor: "#fbbf24",
    },
    {
      id: "landmark_2",
      name: "Forest Kingdom",
      region: "Forest Realm 🌲",
      emoji: "🌲",
      status: xp >= 1000 ? (xp >= 2500 ? "completed" : "active") : "locked",
      x: 42,
      y: 72,
      requiredXp: 1000,
      description: "Ancient enchanted woods filled with mathematical fairy spirits.",
      missionsCount: 4,
      reward: "Forest Crest",
      rewardIcon: "🌿",
      themeColor: "#34d399",
    },
    {
      id: "landmark_3",
      name: "Dragon Cave",
      region: "Dragon Realm 🐉",
      emoji: "🌋",
      status: xp >= 2500 ? (xp >= 5000 ? "completed" : "active") : "locked",
      x: 76,
      y: 60,
      requiredXp: 2500,
      description: "Lair of the Mystic Fire Dragon containing lost ancient scrolls.",
      missionsCount: 5,
      reward: "Dragon Scale",
      rewardIcon: "🔥",
      themeColor: "#f97316",
    },
    {
      id: "landmark_4",
      name: "Science Valley",
      region: "Science Valley 🧪",
      emoji: "🔬",
      status: xp >= 5000 ? (xp >= 10000 ? "completed" : "active") : "locked",
      x: 25,
      y: 44,
      requiredXp: 5000,
      description: "High-tech alchemy lab synthesizing quantum energy catalyst.",
      missionsCount: 4,
      reward: "Quantum Core",
      rewardIcon: "⚛️",
      themeColor: "#38bdf8",
    },
    {
      id: "landmark_5",
      name: "Reading Castle",
      region: "Reading Kingdom 📖",
      emoji: "🏰",
      status: xp >= 10000 ? (xp >= 15000 ? "completed" : "active") : "locked",
      x: 65,
      y: 35,
      requiredXp: 10000,
      description: "Towering grand library with floating magical storybooks.",
      missionsCount: 4,
      reward: "Royal Crown",
      rewardIcon: "👑",
      themeColor: "#c084fc",
    },
    {
      id: "landmark_6",
      name: "Space Observatory",
      region: "Space Observatory 🚀",
      emoji: "🔭",
      status: xp >= 15000 ? "active" : "locked",
      x: 82,
      y: 16,
      requiredXp: 15000,
      description: "Starlight tower reaching beyond the clouds to Planet Nebula.",
      missionsCount: 6,
      reward: "Starlight Orb",
      rewardIcon: "🌌",
      themeColor: "#818cf8",
    },
  ];

  // Determine active landmark and companion coordinates
  const activeLandmark = mapLandmarks.find(m => m.status === "active") || mapLandmarks[0];
  const companionPos = { x: activeLandmark.x + 3, y: activeLandmark.y - 7 };

  return (
    <div className="relative w-full min-h-[820px] bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 overflow-hidden rounded-[36px] border-4 border-amber-400/40 shadow-[0_15px_50px_rgba(0,0,0,0.6)] select-none">
      {/* 1. LIVING ENVIRONMENT BACKGROUND (Terrain, Mountains, Rivers, Islands) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sky Ambient Glows */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

        {/* ILLUSTRATED TERRAIN FEATURE DECORATIONS */}
        {/* Dragon Volcano Region Top Right */}
        <div className="absolute top-12 right-6 text-6xl opacity-30">🌋</div>
        <div className="absolute top-28 right-24 text-4xl opacity-25">🔥</div>

        {/* Forest Region Center Left */}
        <div className="absolute bottom-60 left-6 text-6xl opacity-30">🌲</div>
        <div className="absolute bottom-48 left-20 text-5xl opacity-25">🌳</div>

        {/* Science Valley Middle */}
        <div className="absolute top-72 left-8 text-5xl opacity-30">🧪</div>

        {/* Reading Kingdom Upper Right */}
        <div className="absolute top-44 right-16 text-6xl opacity-30">📜</div>

        {/* Space Observatory Top Peak */}
        <div className="absolute top-6 right-36 text-5xl opacity-30">🪐</div>

        {/* Living Village Expansion Element (grows with lessonsCompleted) */}
        {lessonsCompleted >= 5 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-28 left-36 text-3xl opacity-80"
          >
            🏠
          </motion.div>
        )}
        {lessonsCompleted >= 10 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-36 left-48 text-3xl opacity-80"
          >
            🏰
          </motion.div>
        )}

        {/* CONTINUOUS DRIFTING CLOUDS */}
        <motion.div
          animate={{ x: [-100, 500] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="absolute top-16 left-0 text-3xl opacity-25"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [500, -100] }}
          transition={{ repeat: Infinity, duration: 36, ease: "linear" }}
          className="absolute top-60 left-0 text-4xl opacity-20"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [-100, 500] }}
          transition={{ repeat: Infinity, duration: 42, ease: "linear" }}
          className="absolute bottom-40 left-0 text-3xl opacity-20"
        >
          ☁️
        </motion.div>

        {/* ORGANIC LEY-LINE PATH CONNECTOR SVG */}
        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          <path
            d="M 70 690 Q 160 590 170 590 T 310 490 T 100 360 T 260 290 T 330 130"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
          <path
            d="M 70 690 Q 160 590 170 590 T 310 490 T 100 360 T 260 290 T 330 130"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeDasharray="400"
            strokeDashoffset={400 - Math.min(380, (xp / 15000) * 380)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      {/* 2. INTERACTIVE MAP LANDMARKS */}
      {mapLandmarks.map(landmark => (
        <MapLandmark
          key={landmark.id}
          landmark={landmark}
          onClick={selected => setSelectedLandmark(selected)}
        />
      ))}

      {/* 3. LIVING COMPANION CHARACTER PHYSICALLY ON THE MAP */}
      <CompanionCharacter
        type={companionType}
        position={companionPos}
        level={userLevel}
        onClick={() => setSelectedLandmark(activeLandmark)}
      />

      {/* 4. TAPPABLE LOCATION PREVIEW BOTTOM SHEET */}
      <LocationPreview
        landmark={selectedLandmark}
        onClose={() => setSelectedLandmark(null)}
        onEnter={landmark => {
          setSelectedLandmark(null);
          onEnterLocation(landmark);
        }}
      />
    </div>
  );
}
