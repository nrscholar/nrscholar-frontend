import { create } from "zustand";

export interface LessonProgress {
  lessonId: string;
  subject: string;
  correctAnswersCount: number;
  totalQuestionsAnswered: number;
  bossTriggered: boolean;
}

export interface BossConfig {
  bossId: string;
  name: string;
  type: "mini" | "mega" | "legendary" | "daily" | "seasonal" | "normal";
  hp: number;
  maxHp: number;
  attackDamage: number;
  rewardCoins: number;
  rewardXP: number;
  badge: string;
  icon: string;
}

export interface BossBattleQuestion {
  question: string;
  options: string[];
  answer: string;
}

// Extensible configurations for bosses across different subjects and tiers
export const BOSS_TEMPLATES: Record<string, Omit<BossConfig, "hp" | "maxHp">> = {
  maths: {
    bossId: "math_monster",
    name: "Math Monster",
    type: "normal",
    attackDamage: 20,
    rewardCoins: 1000,
    rewardXP: 500,
    badge: "Math Champion",
    icon: "👹",
  },
  english: {
    bossId: "grammar_dragon",
    name: "Grammar Dragon",
    type: "normal",
    attackDamage: 20,
    rewardCoins: 1000,
    rewardXP: 500,
    badge: "Grammar Legend",
    icon: "🐉",
  },
  science: {
    bossId: "science_beast",
    name: "Science Beast",
    type: "normal",
    attackDamage: 20,
    rewardCoins: 1000,
    rewardXP: 500,
    badge: "Science Genius",
    icon: "🦁",
  },
  reading: {
    bossId: "book_guardian",
    name: "Book Guardian",
    type: "normal",
    attackDamage: 20,
    rewardCoins: 1000,
    rewardXP: 500,
    badge: "Master Reader",
    icon: "🦉",
  },
  moral_learning: {
    bossId: "kindness_guardian",
    name: "Kindness Guardian",
    type: "normal",
    attackDamage: 20,
    rewardCoins: 1000,
    rewardXP: 500,
    badge: "Kindness Hero",
    icon: "🦄",
  },
};

// Harder questions library mapped by subject keys
export const HARD_QUESTIONS_POOL: Record<string, BossBattleQuestion[]> = {
  maths: [
    { question: "What is 34 + 28?", options: ["52", "62", "64", "72"], answer: "62" },
    { question: "What is 52 + 17?", options: ["67", "69", "79", "68"], answer: "69" },
    { question: "What is 91 + 9?", options: ["90", "99", "100", "110"], answer: "100" },
    { question: "What is 143 - 59?", options: ["84", "94", "74", "86"], answer: "84" },
    { question: "What is 12 x 8?", options: ["80", "96", "88", "104"], answer: "96" },
  ],
  english: [
    { question: "Choose the correct spelling:", options: ["Neccessary", "Necessary", "Necassary", "Necessery"], answer: "Necessary" },
    { question: "Which word is a conjunction?", options: ["Quickly", "Beautiful", "Although", "Under"], answer: "Although" },
    { question: "Find the plural form of 'Crisis':", options: ["Crisis", "Crises", "Crisises", "Crisises"], answer: "Crises" },
    { question: "Identify the pronoun in: 'She read the book.'", options: ["She", "Read", "The", "Book"], answer: "She" },
    { question: "What is the synonym of 'Ample'?", options: ["Scarce", "Abundant", "Tiny", "Quiet"], answer: "Abundant" },
  ],
  science: [
    { question: "Which planet has the most visible rings?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], answer: "Saturn" },
    { question: "What force keeps us on the ground?", options: ["Friction", "Magnetism", "Gravity", "Air Resistance"], answer: "Gravity" },
    { question: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
    { question: "What is the boiling point of water in Celsius?", options: ["0°C", "50°C", "100°C", "200°C"], answer: "100°C" },
    { question: "Which organ pumps blood in our body?", options: ["Brain", "Lungs", "Heart", "Liver"], answer: "Heart" },
  ],
  reading: [
    { question: "What is the main idea of a story?", options: ["The characters' names", "Where the story takes place", "What the story is mostly about", "The book layout"], answer: "What the story is mostly about" },
    { question: "What is the antonym of 'generous'?", options: ["Kind", "Helpful", "Selfish", "Polite"], answer: "Selfish" },
    { question: "If a character is 'courageous', they are:", options: ["Scared", "Brave", "Angry", "Sleepy"], answer: "Brave" },
    { question: "What does the prefix 'un-' mean in 'unhappy'?", options: ["Again", "Not", "Before", "Very"], answer: "Not" },
    { question: "An author's purpose in writing a recipe is to:", options: ["Persuade", "Entertain", "Instruct", "Inform"], answer: "Instruct" },
  ],
  moral_learning: [
    { question: "What is the best way to help a sad friend?", options: ["Ignore them", "Tell them to cheer up", "Listen to them and offer a hug", "Walk away"], answer: "Listen to them and offer a hug" },
    { question: "If you find a lost toy at school, you should:", options: ["Keep it", "Give it to a teacher", "Throw it away", "Hide it"], answer: "Give it to a teacher" },
    { question: "Being empathetic means:", options: ["Winning all games", "Understanding how others feel", "Always being loud", "Doing whatever you want"], answer: "Understanding how others feel" },
    { question: "Why is sharing important?", options: ["It makes you lose your items", "It shows kindness and builds friendships", "It is only a strict rule", "It is a chore"], answer: "It shows kindness and builds friendships" },
    { question: "When someone does something nice for you, you say:", options: ["Thank you", "No thanks", "Okay", "Goodbye"], answer: "Thank you" },
  ],
};

interface BossBattleState {
  progress: LessonProgress;
  playerEnergy: number;
  bossHp: number;
  currentBoss: BossConfig | null;
  battleQuestions: BossBattleQuestion[];
  currentQuestionIndex: number;
  battleStatus: "idle" | "intro" | "active" | "victory" | "failure";
  streak: number;
  consecutiveCorrectCount: number;

  // Actions
  recordAnswer: (lessonId: string, subject: string, isCorrect: boolean) => { triggered: boolean };
  triggerBoss: (subject: string, lessonId: string) => void;
  startBattle: () => void;
  submitBattleAnswer: (userAnswer: string) => { isCorrect: boolean; damageDealt: number; damageTaken: number; bossDefeated: boolean; playerDefeated: boolean };
  retryBattle: () => void;
  resetBattle: () => void;
}

export const useBossBattleStore = create<BossBattleState>((set, get) => ({
  progress: {
    lessonId: "",
    subject: "",
    correctAnswersCount: 0,
    totalQuestionsAnswered: 0,
    bossTriggered: false,
  },
  playerEnergy: 100,
  bossHp: 1000,
  currentBoss: null,
  battleQuestions: [],
  currentQuestionIndex: 0,
  battleStatus: "idle",
  streak: 0,
  consecutiveCorrectCount: 0,

  recordAnswer: (lessonId: string, subject: string, isCorrect: boolean) => {
    const currentProgress = get().progress;
    
    // If we switched to a new lesson, reset the counts
    const isNewLesson = currentProgress.lessonId !== lessonId;
    
    const newCorrectCount = isCorrect
      ? (isNewLesson ? 1 : currentProgress.correctAnswersCount + 1)
      : (isNewLesson ? 0 : currentProgress.correctAnswersCount);
      
    const newConsecutiveCount = isCorrect
      ? get().consecutiveCorrectCount + 1
      : 0;

    const newTotalAnswered = isNewLesson ? 1 : currentProgress.totalQuestionsAnswered + 1;
    const triggered = newCorrectCount >= 1 && !currentProgress.bossTriggered;

    set((state) => ({
      progress: {
        lessonId,
        subject,
        correctAnswersCount: newCorrectCount,
        totalQuestionsAnswered: newTotalAnswered,
        bossTriggered: triggered ? true : currentProgress.bossTriggered,
      },
      consecutiveCorrectCount: newConsecutiveCount,
      streak: isCorrect ? state.streak + 1 : 0,
    }));

    if (triggered) {
      get().triggerBoss(subject, lessonId);
    }

    return { triggered };
  },

  triggerBoss: (subject: string, lessonId: string) => {
    // Normalise subject name to find correct boss
    const subjectKey = subject.toLowerCase().replace(/\s+/g, "_");
    let mappedKey = "maths"; // Fallback to maths

    if (subjectKey.includes("math")) mappedKey = "maths";
    else if (subjectKey.includes("english") || subjectKey.includes("grammar")) mappedKey = "english";
    else if (subjectKey.includes("science")) mappedKey = "science";
    else if (subjectKey.includes("read")) mappedKey = "reading";
    else if (subjectKey.includes("moral") || subjectKey.includes("kind")) mappedKey = "moral_learning";

    const template = BOSS_TEMPLATES[mappedKey] || BOSS_TEMPLATES.maths;
    const bossQuestions = HARD_QUESTIONS_POOL[mappedKey] || HARD_QUESTIONS_POOL.maths;

    const currentBoss: BossConfig = {
      ...template,
      hp: 1000,
      maxHp: 1000,
    };

    set({
      currentBoss,
      bossHp: 1000,
      playerEnergy: 100,
      battleQuestions: bossQuestions,
      currentQuestionIndex: 0,
      battleStatus: "intro",
    });
  },

  startBattle: () => {
    set({ battleStatus: "active" });
  },

  submitBattleAnswer: (userAnswer: string) => {
    const { battleQuestions, currentQuestionIndex, currentBoss, bossHp, playerEnergy } = get();
    if (!currentBoss) {
      return { isCorrect: false, damageDealt: 0, damageTaken: 0, bossDefeated: false, playerDefeated: false };
    }

    const currentQ = battleQuestions[currentQuestionIndex];
    const isCorrect = currentQ.answer === userAnswer;

    let damageDealt = 0;
    let damageTaken = 0;
    let newBossHp = bossHp;
    let newPlayerEnergy = playerEnergy;

    if (isCorrect) {
      damageDealt = 200; // Correct answer deals 200 damage
      newBossHp = Math.max(0, bossHp - damageDealt);
    } else {
      damageTaken = currentBoss.attackDamage || 20; // Incorrect answer hurts player
      newPlayerEnergy = Math.max(0, playerEnergy - damageTaken);
    }

    const bossDefeated = newBossHp <= 0;
    const playerDefeated = newPlayerEnergy <= 0;

    let nextStatus = get().battleStatus;
    if (bossDefeated) {
      nextStatus = "victory";
    } else if (playerDefeated) {
      nextStatus = "failure";
    }

    set((state) => ({
      bossHp: newBossHp,
      playerEnergy: newPlayerEnergy,
      battleStatus: nextStatus,
      // Move to next question, wrapping around if needed
      currentQuestionIndex: (state.currentQuestionIndex + 1) % battleQuestions.length,
      streak: isCorrect ? state.streak + 1 : 0,
    }));

    return {
      isCorrect,
      damageDealt,
      damageTaken,
      bossDefeated,
      playerDefeated,
    };
  },

  retryBattle: () => {
    set({
      playerEnergy: 100,
      bossHp: 1000,
      currentQuestionIndex: 0,
      battleStatus: "active",
      streak: 0,
    });
  },

  resetBattle: () => {
    set((state) => ({
      battleStatus: "idle",
      playerEnergy: 100,
      bossHp: 1000,
      currentBoss: null,
      battleQuestions: [],
      currentQuestionIndex: 0,
      // Keep bossTriggered as false to allow triggering again on the next 10 questions
      progress: {
        ...state.progress,
        correctAnswersCount: 0,
        bossTriggered: false,
      },
    }));
  },
}));
