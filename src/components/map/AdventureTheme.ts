export interface MapStageConfig {
  id: string;
  stageNumber: number;
  name: string;
  subtitle: string;
  emoji: string;
  iconBg: string;
  storyQuote: string;
  questsCount: number;
  lessonsCount: number;
  xpReward: number;
  coinReward: number;
  itemReward: string;
  itemIcon: string;
  x: number; // percentage on map (0 - 100)
  y: number; // percentage on map (0 - 100)
  biomeType: "forest" | "cave" | "volcano" | "castle";
  missions: { title: string; type: string; xp: number; icon: string }[];
}

export interface MapWorldThemeConfig {
  type: "dragon" | "science" | "reading" | "space";
  worldTitle: string;
  worldSubtitle: string;
  bgGradient: string;
  trailColor: string;
  trailGlow: string;
  stages: MapStageConfig[];
}

export const NRSCHOLAR_TOKENS = {
  primary: "#2D328F", // Deep Royal Indigo
  primaryDark: "#1E2266",
  secondary: "#14C8C6", // Electric Turquoise
  secondaryLight: "#E6FBFB",
  tertiary: "#8B6AF5", // Soft Violet
  reward: "#FFC857", // Sun Gold
  rewardDark: "#E5AB2C",
  background: "#F4F8FF", // Soft Sky Atmosphere
  textDark: "#1E2A5E",
  textMuted: "#64748B",
};

export const WORLD_THEMES: Record<string, MapWorldThemeConfig> = {
  dragon: {
    type: "dragon",
    worldTitle: "DRAGON REALM",
    worldSubtitle: "The Mystic Valley of Ancient Eggs",
    bgGradient: "from-[#F0F6FF] via-[#E8F1FF] to-[#DCE9FF]",
    trailColor: "#14C8C6",
    trailGlow: "rgba(20, 200, 198, 0.4)",
    stages: [
      {
        id: "stage_1",
        stageNumber: 1,
        name: "Forest Kingdom",
        subtitle: "The Whispering Woods",
        emoji: "🌲",
        iconBg: "from-emerald-400 to-teal-600",
        storyQuote: "Your journey begins in the ancient whispering woods. Complete challenges to awaken the sleeping dragon egg!",
        questsCount: 3,
        lessonsCount: 2,
        xpReward: 350,
        coinReward: 50,
        itemReward: "Dragon Egg",
        itemIcon: "🥚",
        x: 24,
        y: 78,
        biomeType: "forest",
        missions: [
          { title: "Math Forest Battle", type: "math", xp: 150, icon: "📐" },
          { title: "Riddle of the Oak Tree", type: "reading", xp: 100, icon: "📖" },
          { title: "Nature Counting Quest", type: "logic", xp: 100, icon: "🧩" },
        ],
      },
      {
        id: "stage_2",
        stageNumber: 2,
        name: "Dragon Cave",
        subtitle: "The Glowing Crystal Lair",
        emoji: "🐉",
        iconBg: "from-indigo-500 to-purple-700",
        storyQuote: "Deep inside the crystal cave, glowing runes reveal ancient math secrets. Your dragon gains new elemental power here!",
        questsCount: 4,
        lessonsCount: 3,
        xpReward: 500,
        coinReward: 80,
        itemReward: "Dragon Scale",
        itemIcon: "💎",
        x: 50,
        y: 56,
        biomeType: "cave",
        missions: [
          { title: "Crystal Multiplication", type: "math", xp: 200, icon: "💎" },
          { title: "Cave Rune Decipher", type: "reading", xp: 150, icon: "📜" },
          { title: "Dragon Fire Logic", type: "logic", xp: 150, icon: "🔥" },
        ],
      },
      {
        id: "stage_3",
        stageNumber: 3,
        name: "Fire Mountain",
        subtitle: "The Volcanic Peak",
        emoji: "🌋",
        storyQuote: "Cross the molten bridge to test your speed and confidence. Fire sparks light the way to master-level quests!",
        questsCount: 4,
        lessonsCount: 3,
        xpReward: 750,
        coinReward: 120,
        itemReward: "Flame Crown",
        itemIcon: "👑",
        x: 76,
        y: 36,
        biomeType: "volcano",
        missions: [
          { title: "Lava Algebra Sprint", type: "math", xp: 300, icon: "⚡" },
          { title: "Volcanic Reading Trial", type: "reading", xp: 250, icon: "📖" },
          { title: "Boss Dragon Battle", type: "boss", xp: 200, icon: "⚔️" },
        ],
      },
      {
        id: "stage_4",
        stageNumber: 4,
        name: "Dragon Castle",
        subtitle: "The Sky Fortress",
        emoji: "🏰",
        storyQuote: "Reaching the royal sky fortress unlocks the ultimate Cosmic Dragon companion and legendary honor badges!",
        questsCount: 5,
        lessonsCount: 4,
        xpReward: 1200,
        coinReward: 200,
        itemReward: "Cosmic Dragon",
        itemIcon: "🌌",
        x: 50,
        y: 16,
        biomeType: "castle",
        missions: [
          { title: "Royal Crown Championship", type: "math", xp: 400, icon: "🏆" },
          { title: "Sky Fortress Finale", type: "boss", xp: 500, icon: "👑" },
          { title: "Legendary Scholar Quest", type: "reading", xp: 300, icon: "🌟" },
        ],
      },
    ],
  },
};
