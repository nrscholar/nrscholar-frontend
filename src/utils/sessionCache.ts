
/**
 * sessionCache.ts
 *
 * Provides partitioned, namespaced sessionStorage caching scoped by:
 * - Active child ID (e.g., "child_1", "child_2")
 * - Class level (e.g., "Class 1", "Class 3")
 *
 * Prevents cross-class progress and draft contamination when users switch classes or child profiles.
 */

/**
 * Normalizes any class string or number into standard "Class X".
 */
export function normalizeClassLevel(rawClass?: string | number | null): string {
  if (rawClass === undefined || rawClass === null) return "Class 1";
  const s = String(rawClass).trim();
  const match = s.match(/(?:class\s*|grade\s*)?(\d+)/i);
  if (match) {
    return `Class ${match[1]}`;
  }
  return s || "Class 1";
}

/**
 * Retrieves the active user profile data from localStorage.
 */
export function getActiveUserContext(): { childId: string; classLevel: string } {
  try {
    const raw = localStorage.getItem("userData") || localStorage.getItem("user");
    if (raw) {
      const data = JSON.parse(raw);
      const childId = data?.activeChildId || data?.childId || "child_1";
      const activeChild = Array.isArray(data?.children)
        ? data.children.find((c: any) => c?.childId === childId)
        : null;
      const rawClass = activeChild?.childClass || activeChild?.classLevel || data?.childClass || data?.classLevel || "Class 1";
      return {
        childId: String(childId),
        classLevel: normalizeClassLevel(rawClass),
      };
    }
  } catch (e) {
    console.error("Error reading active user context from localStorage:", e);
  }
  return { childId: "child_1", classLevel: "Class 1" };
}

/**
 * Constructs a namespaced sessionStorage key partitioned by child ID and class level.
 * Example: "nrs_child_1_class_3_activeSubjectId"
 */
export function getScopedKey(baseKey: string, customClass?: string, customChildId?: string): string {
  const ctx = getActiveUserContext();
  const childId = customChildId || ctx.childId;
  const classLevel = normalizeClassLevel(customClass || ctx.classLevel);
  const cleanClass = classLevel.toLowerCase().replace(/\s+/g, "_");
  const cleanChild = childId.toLowerCase().replace(/\s+/g, "_");
  return `nrs_${cleanChild}_${cleanClass}_${baseKey}`;
}

/**
 * Retrieves an item from scoped storage (checks sessionStorage first, falls back to localStorage).
 */
export function getScopedItem(baseKey: string, customClass?: string, customChildId?: string): string | null {
  try {
    const key = getScopedKey(baseKey, customClass, customChildId);
    const val = sessionStorage.getItem(key);
    if (val !== null) return val;
    return localStorage.getItem(key);
  } catch (e) {
    console.error(`Error reading scoped item for ${baseKey}:`, e);
    return null;
  }
}

/**
 * Sets an item in scoped sessionStorage.
 */
export function setScopedItem(baseKey: string, value: string, customClass?: string, customChildId?: string): void {
  try {
    const key = getScopedKey(baseKey, customClass, customChildId);
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.error(`Error setting scoped item for ${baseKey}:`, e);
  }
}

/**
 * Removes a specific scoped item from sessionStorage and localStorage.
 */
export function removeScopedItem(baseKey: string, customClass?: string, customChildId?: string): void {
  try {
    const key = getScopedKey(baseKey, customClass, customChildId);
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing scoped item for ${baseKey}:`, e);
  }
}

/**
 * Clears only the session storage entries belonging to a particular class and child,
 * preserving other classes, children, and non-namespaced items.
 */
export function clearClassSession(classLevel?: string, childId?: string): void {
  try {
    const ctx = getActiveUserContext();
    const targetChild = (childId || ctx.childId).toLowerCase().replace(/\s+/g, "_");
    const targetClass = normalizeClassLevel(classLevel || ctx.classLevel).toLowerCase().replace(/\s+/g, "_");
    const prefix = `nrs_${targetChild}_${targetClass}_`;

    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {
    console.error("Error clearing class session:", e);
  }
}

/**
 * Convenience helper to read parsed JSON from scoped sessionStorage.
 */
export function getScopedJSON<T = any>(baseKey: string, customClass?: string, customChildId?: string): T | null {
  const raw = getScopedItem(baseKey, customClass, customChildId);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Convenience helper to write JSON to scoped sessionStorage.
 */
export function setScopedJSON(baseKey: string, value: any, customClass?: string, customChildId?: string): void {
  try {
    setScopedItem(baseKey, JSON.stringify(value), customClass, customChildId);
  } catch (e) {
    console.error(`Error writing scoped JSON for ${baseKey}:`, e);
  }
}
