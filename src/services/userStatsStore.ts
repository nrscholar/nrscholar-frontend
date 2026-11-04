import { create } from "zustand";

export interface LevelInfo {
  level: number;
  percent: number;
  nextXp: number;
  currentXp: number;
  xpNeededForNext: number;
}

/**
 * Math-aligned level thresholds matching backend retention & curriculum specifications:
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * Level >= 4: 250 * 1.5^(level - 3)
 */
export function getLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, Number(xp) || 0);
  if (safeXp < 100) {
    return { level: 1, percent: Math.round((safeXp / 100) * 100), nextXp: 100, currentXp: 0, xpNeededForNext: 100 - safeXp };
  }
  if (safeXp < 250) {
    return { level: 2, percent: Math.round(((safeXp - 100) / 150) * 100), nextXp: 250, currentXp: 100, xpNeededForNext: 250 - safeXp };
  }
  
  let lvl = 3;
  while (true) {
    const currentThreshold = Math.floor(250 * Math.pow(1.5, lvl - 3));
    const nextThreshold = Math.floor(250 * Math.pow(1.5, (lvl + 1) - 3));
    if (safeXp >= nextThreshold) {
      lvl++;
    } else {
      const range = nextThreshold - currentThreshold;
      const progress = safeXp - currentThreshold;
      const percent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
      return { 
        level: lvl, 
        percent, 
        nextXp: nextThreshold, 
        currentXp: currentThreshold, 
        xpNeededForNext: Math.max(0, nextThreshold - safeXp) 
      };
    }
  }
}

interface UserStatsState {
  userData: any;
  xp: number;
  coins: number;
  streakDays: number;
  level: number;
  levelInfo: LevelInfo;
  badges: any[];
  childName: string;
  childClass: string;
  childPhoto: string;
  activeChildId: string;

  // Actions
  syncFromUserData: (userDoc?: any) => void;
  updateStats: (updates: Partial<{ xp: number; coins: number; streakDays: number; badges: any[] }>) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
}

function parseUserDataFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function extractStateFromUser(u: any) {
  const activeChildId = u?.activeChildId || u?.children?.[0]?.childId || u?.childId || "child_1";
  const activeChild = Array.isArray(u?.children) 
    ? u.children.find((c: any) => c.childId === activeChildId) || u.children[0]
    : null;

  const xp = Number(activeChild?.xp ?? u?.xp ?? 0);
  const coins = Number(activeChild?.coins ?? u?.coins ?? 0);
  const streakDays = Number(activeChild?.streakDays ?? u?.streakDays ?? 0);
  const badges = activeChild?.badges || u?.badges || [];
  const childName = activeChild?.childName || u?.childName || u?.fullName || "Explorer";
  const childClass = activeChild?.childClass || u?.childClass || "";
  const childPhoto = activeChild?.childPhoto || u?.childPhoto || "";

  const levelInfo = getLevelInfo(xp);
  // Authoritatively compute level from accumulated XP so headers and screens match 100%
  const level = levelInfo.level;

  return {
    userData: u,
    xp,
    coins,
    streakDays,
    level,
    levelInfo,
    badges,
    childName,
    childClass,
    childPhoto,
    activeChildId
  };
}

const initialUser = parseUserDataFromStorage();
const initialDerived = extractStateFromUser(initialUser);

export const useUserStatsStore = create<UserStatsState>((set, get) => ({
  ...initialDerived,

  syncFromUserData: (userDoc?: any) => {
    const u = userDoc || parseUserDataFromStorage();
    if (!u) return;

    const derived = extractStateFromUser(u);

    // Normalize stored level to computed level if stored was stale or outdated
    if (u.level !== derived.level) {
      u.level = derived.level;
      if (Array.isArray(u.children)) {
        u.children = u.children.map((c: any) => 
          c.childId === derived.activeChildId ? { ...c, level: derived.level } : c
        );
      }
      try {
        localStorage.setItem("userData", JSON.stringify(u));
      } catch (e) {}
    }

    set({ ...derived });
  },

  updateStats: (updates) => {
    const current = get();
    const newXp = updates.xp !== undefined ? updates.xp : current.xp;
    const newCoins = updates.coins !== undefined ? updates.coins : current.coins;
    const newStreak = updates.streakDays !== undefined ? updates.streakDays : current.streakDays;
    const newBadges = updates.badges !== undefined ? updates.badges : current.badges;

    const levelInfo = getLevelInfo(newXp);
    const newLevel = levelInfo.level;

    const u = current.userData ? { ...current.userData } : {};
    u.xp = newXp;
    u.coins = newCoins;
    u.streakDays = newStreak;
    u.badges = newBadges;
    u.level = newLevel;

    if (Array.isArray(u.children)) {
      u.children = u.children.map((c: any) => 
        c.childId === current.activeChildId ? { ...c, xp: newXp, coins: newCoins, level: newLevel, badges: newBadges } : c
      );
    }

    try {
      localStorage.setItem("userData", JSON.stringify(u));
      window.dispatchEvent(new CustomEvent("userDataUpdated"));
    } catch (e) {}

    set({
      userData: u,
      xp: newXp,
      coins: newCoins,
      streakDays: newStreak,
      badges: newBadges,
      level: newLevel,
      levelInfo
    });
  },

  addXp: (amount: number) => {
    const currentXp = get().xp;
    get().updateStats({ xp: currentXp + amount });
  },

  addCoins: (amount: number) => {
    const currentCoins = get().coins;
    get().updateStats({ coins: currentCoins + amount });
  }
}));

// Setup global event listeners to keep store in real-time sync across all routes & tabs
if (typeof window !== "undefined") {
  const syncStore = () => {
    useUserStatsStore.getState().syncFromUserData();
  };

  window.addEventListener("userDataUpdated", syncStore);
  window.addEventListener("storage", (e) => {
    if (e.key === "userData") {
      syncStore();
    }
  });
}

