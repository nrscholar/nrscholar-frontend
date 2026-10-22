/**
 * Quiz & Mission Question Deduplication and State Validation Utilities
 *
 * Guarantees that questions served within a quiz, mission, or practice session
 * are 100% unique by:
 * 1. Normalized ID matching (handling `question_id`, `questionId`, `_id`, `id` and stripped prefixes)
 * 2. Normalized Question Text / Stem matching (guards against duplicate questions imported with differing IDs)
 */

export interface IdentifiableQuestion {
  question_id?: string | number;
  questionId?: string | number;
  _id?: string | number;
  id?: string | number;
  question?: string;
  text?: string;
  title?: string;
  interaction?: {
    type?: string;
    details?: {
      question?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  options?: any[];
  answer?: any;
  [key: string]: any;
}

/**
 * Normalizes question ID by removing standard prefix tags like `q_` or `boss_`.
 */
export function normalizeQuestionId(rawId: string | number | undefined | null): string {
  if (rawId === undefined || rawId === null) return "";
  let s = String(rawId).trim();
  if (s.startsWith("q_")) {
    s = s.slice(2);
  } else if (s.startsWith("boss_")) {
    s = s.slice(5);
  }
  return s;
}

/**
 * Extracts the canonical identifier from a question object across multiple schema variations.
 */
export function getQuestionIdentifier(q: IdentifiableQuestion | null | undefined): string {
  if (!q || typeof q !== "object") return "";
  const rawId = q.question_id ?? q.questionId ?? q._id ?? q.id;
  return normalizeQuestionId(rawId);
}

/**
 * Normalizes question stem text for content-based duplicate identification.
 * Strips HTML tags, punctuation, multiple whitespaces, and converts to lowercase.
 */
export function getNormalizedQuestionText(q: IdentifiableQuestion | null | undefined): string {
  if (!q || typeof q !== "object") return "";
  const rawText =
    q.question ??
    q.text ??
    q.title ??
    q.interaction?.details?.question ??
    "";
  if (!rawText) return "";

  return String(rawText)
    .toLowerCase()
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[^\w\s\u0A80-\u0AFF\u0900-\u097F]/g, "") // remove punctuation, keeping Latin + Gujarati + Devanagari scripts
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Filters a question array to guarantee 100% unique questions per quiz or mission session.
 * Excludes duplicates by both question ID and normalized question stem text.
 * Preserves the original order of the first occurrence of each distinct question.
 *
 * @param questions Array of question objects from API or state
 * @returns Array of strictly unique questions
 */
export function filterUniqueQuestions<T extends IdentifiableQuestion>(
  questions: T[] | null | undefined
): T[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    return [];
  }

  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();
  const uniqueQuestions: T[] = [];

  for (const q of questions) {
    if (!q || typeof q !== "object") continue;

    const id = getQuestionIdentifier(q);
    const normText = getNormalizedQuestionText(q);

    // Skip if question has neither an ID nor question text
    if (!id && !normText) continue;

    const isDuplicateId = id ? seenIds.has(id) : false;
    const isDuplicateText = normText ? seenTexts.has(normText) : false;

    if (isDuplicateId || isDuplicateText) {
      if (import.meta.env.MODE !== "production") {
        console.warn(
          `[quizQuestionUtils] Excluded duplicate question in quiz session: ID="${id}", Text="${normText.slice(0, 45)}..."`
        );
      }
      continue;
    }

    if (id) seenIds.add(id);
    if (normText) seenTexts.add(normText);
    uniqueQuestions.push(q);
  }

  return uniqueQuestions;
}

/**
 * Cross-filters quiz and boss question sets so that:
 * 1. quizQuestions contains zero internal duplicates.
 * 2. bossQuestions contains zero internal duplicates.
 * 3. bossQuestions contains ZERO questions that appeared in quizQuestions (by ID or text).
 */
export function filterCrossUniqueQuestions<T extends IdentifiableQuestion>(
  quizQuestions: T[] | null | undefined,
  bossQuestions: T[] | null | undefined
): { uniqueQuiz: T[]; uniqueBoss: T[] } {
  const uniqueQuiz = filterUniqueQuestions(quizQuestions);

  const quizIds = new Set<string>();
  const quizTexts = new Set<string>();

  for (const q of uniqueQuiz) {
    const id = getQuestionIdentifier(q);
    const text = getNormalizedQuestionText(q);
    if (id) quizIds.add(id);
    if (text) quizTexts.add(text);
  }

  const rawBossUnique = filterUniqueQuestions(bossQuestions);
  const uniqueBoss: T[] = [];

  for (const b of rawBossUnique) {
    const bId = getQuestionIdentifier(b);
    const bText = getNormalizedQuestionText(b);

    const isOverlapId = bId ? quizIds.has(bId) : false;
    const isOverlapText = bText ? quizTexts.has(bText) : false;

    if (isOverlapId || isOverlapText) {
      if (import.meta.env.MODE !== "production") {
        console.warn(
          `[quizQuestionUtils] Cross-phase duplicate excluded from boss stage: ID="${bId}", Text="${bText.slice(0, 45)}..."`
        );
      }
      continue;
    }

    uniqueBoss.push(b);
  }

  return { uniqueQuiz, uniqueBoss };
}

