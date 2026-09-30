import type { Difficulty } from "./adminApi";

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const DIFFICULTY_TONE = { Easy: "green", Medium: "blue", Hard: "violet" } as const;

export const ROUND_LABELS = { quiz: "Quiz", boss: "Boss", shadow: "Shadow" } as const;
export const ROUND_ORDER = ["quiz", "boss", "shadow"] as const;
