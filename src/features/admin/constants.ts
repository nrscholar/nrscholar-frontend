import type { Difficulty } from "./adminApi";

export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const DIFFICULTY_TONE = { Easy: "green", Medium: "blue", Hard: "violet" } as const;
