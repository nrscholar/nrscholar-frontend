// Dynamic on-demand loader for NeuroPlay class skills to eliminate monolithic 1.9MB bundle
import { skillImages } from "./skillImages";

type SkillLoader = () => Promise<any[]>;

const classLoaders: Record<number, SkillLoader> = {
  1: () => import("./class1Skills.js").then((m) => m.class1Skills),
  2: () => import("./class2Skills.js").then((m) => m.class2Skills),
  3: () => import("./class3Skills.js").then((m) => m.class3Skills),
  4: () => import("./class4Skills.js").then((m) => m.class4Skills),
  5: () => import("./class5Skills.js").then((m) => m.class5Skills),
  6: () => import("./class6Skills.js").then((m) => m.class6Skills),
  7: () => import("./class7Skills.js").then((m) => m.class7Skills),
  8: () => import("./class8Skills.js").then((m) => m.class8Skills),
  9: () => import("./class9Skills.js").then((m) => m.class9Skills),
  10: () => import("./class10Skills.js").then((m) => m.class10Skills),
};

const classCache: Record<number, any[]> = {};
let allSkillsCache: any[] | null = null;

/**
 * Load skills for a single class on demand.
 */
export async function loadClassSkills(classLevel: number): Promise<any[]> {
  const cl = Math.max(1, Math.min(10, classLevel));
  if (classCache[cl]) {
    return classCache[cl];
  }
  const loader = classLoaders[cl];
  if (!loader) return [];
  const skills = await loader();
  classCache[cl] = skills;
  return skills;
}

/**
 * Preload all skills across classes 1-10 in background or when navigating completed tab.
 */
export async function loadAllSkills(): Promise<any[]> {
  if (allSkillsCache && allSkillsCache.length > 0) {
    return allSkillsCache;
  }
  const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const results = await Promise.all(classes.map(loadClassSkills));
  allSkillsCache = results.flat();
  return allSkillsCache;
}

/**
 * Synchronous getter for already-cached skills.
 */
export function getCachedSkills(classLevel?: number): any[] {
  if (classLevel !== undefined) {
    return classCache[classLevel] || [];
  }
  if (allSkillsCache) return allSkillsCache;
  const loaded: any[] = [];
  for (let c = 1; c <= 10; c++) {
    if (classCache[c]) loaded.push(...classCache[c]);
  }
  return loaded;
}

export { skillImages };
