import { apiFetch } from "../../api";

/** One representative class per backend journey tier (dragon 1-4, scientist 5-7, medalist 8-10). */
const TIER_REPRESENTATIVE_CLASSES = [1, 5, 8];

const tierOfClass = (c: number) => (c <= 4 ? 0 : c <= 7 ? 1 : 2);

/**
 * The journey API only returns the nodes of the tier the student belongs to.
 * This fetches the other tiers too and merges every standard (Class 1-10) into one node list.
 * Nodes from other classes are always returned locked (same rule the backend applies).
 */
export async function fetchAllJourneyNodes(
  baseData: any,
  params: { board?: string | null; childId?: string | null }
): Promise<any[] | undefined> {
  const baseNodes: any[] = Array.isArray(baseData?.nodes) ? baseData.nodes : [];
  const activeClass = Number(baseData?.classLevel);
  if (!activeClass || Number.isNaN(activeClass)) return baseData?.nodes;

  const ownTier = tierOfClass(activeClass);
  const others = TIER_REPRESENTATIVE_CLASSES.filter((_, i) => i !== ownTier);

  const results = await Promise.all(
    others.map(async (cls) => {
      try {
        const q = new URLSearchParams();
        q.append("classLevel", String(cls));
        if (params.board) q.append("board", params.board);
        if (params.childId) q.append("child_id", params.childId);
        const res = await apiFetch(`/api/journey/progress?${q.toString()}`);
        if (!res.ok) return [] as any[];
        const json = await res.json();
        const nodes: any[] = json?.success && Array.isArray(json?.data?.nodes) ? json.data.nodes : [];
        return nodes.map((n) => ({
          ...n,
          unlocked: false,
          completed: false,
          nodeProgressPercentage: 0,
          isPriorClass: n.minClass < activeClass,
          isFutureClass: n.minClass > activeClass,
          lockReason: `Class ${n.minClass} is locked`,
        }));
      } catch {
        return [] as any[];
      }
    })
  );

  const merged = [...baseNodes, ...results.flat()].sort((a, b) => (a.minClass || 0) - (b.minClass || 0));
  // Stable global numbering across all standards
  return merged.map((n, i) => ({ ...n, displayLevel: i + 1 }));
}
