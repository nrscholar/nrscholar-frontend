/** Shapes and helpers for picture and activity questions (see ActivityQuestion.tsx). */

export type QuestionImage = { type?: string; svg?: string; url?: string };

export interface PlayableQuestion {
  _id?: string;
  question?: string;
  options?: string[];
  answer?: string;
  type?: string;
  image?: QuestionImage;
  // Draft (admin): list in option order. Student API: keyed by option text, because options are shuffled.
  optionImages?: QuestionImage[] | Record<string, QuestionImage>;
  interaction?: { type?: string; details?: any };
}

export const ACTIVITY_TYPES = ["match_pairs", "fill_letters", "ordering"] as const;
export const SEPARATOR = " | ";

export const activityType = (q?: PlayableQuestion | null): string | null => {
  const t = q?.interaction?.type || q?.type;
  return t && (ACTIVITY_TYPES as readonly string[]).includes(t) ? t : null;
};

export const imageSrc = (img?: QuestionImage | null) =>
  img?.url || (img?.svg ? `data:image/svg+xml;utf8,${encodeURIComponent(img.svg)}` : "");

export const optionImage = (q: PlayableQuestion | null | undefined, opt: string, original?: string[]): QuestionImage | undefined => {
  const imgs = q?.optionImages;
  if (!imgs) return undefined;
  if (Array.isArray(imgs)) return imgs[(original || q?.options || []).indexOf(opt)];
  return imgs[opt];
};

export const sameAnswer = (a: unknown, b: unknown) =>
  String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
