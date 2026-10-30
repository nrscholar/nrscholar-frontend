import { apiFetch } from "../api";

const pdfBlobCache = new Map<string, string>();
const pdfFetchingPromises = new Map<string, Promise<string>>();

/**
 * Retrieves a PDF Object URL from memory cache or fetches & caches it from server.
 */
export async function getOrFetchPdfUrl(chapterId: string): Promise<string> {
  if (!chapterId) throw new Error("Invalid chapter ID");

  if (pdfBlobCache.has(chapterId)) {
    return pdfBlobCache.get(chapterId)!;
  }

  if (pdfFetchingPromises.has(chapterId)) {
    return pdfFetchingPromises.get(chapterId)!;
  }

  const fetchPromise = (async () => {
    try {
      const res = await apiFetch(`/api/textbook/chapter/${chapterId}/pdf`);
      if (!res.ok) throw new Error("Failed to load PDF file from server");
      
      const blob = await res.blob();
      if (blob.size === 0) throw new Error("Received empty PDF file from server");
      
      const objectUrl = URL.createObjectURL(blob);
      pdfBlobCache.set(chapterId, objectUrl);
      return objectUrl;
    } catch (err) {
      pdfFetchingPromises.delete(chapterId);
      throw err;
    }
  })();

  pdfFetchingPromises.set(chapterId, fetchPromise);
  return fetchPromise;
}

/**
 * Synchronously checks if a PDF Object URL is already cached in memory.
 */
export function getCachedPdfUrl(chapterId: string): string | null {
  if (!chapterId) return null;
  return pdfBlobCache.get(chapterId) || null;
}

/**
 * Silently prefetches and caches a chapter PDF in memory for 0ms instant loading.
 */
export function prefetchPdf(chapterId: string): void {
  if (!chapterId || pdfBlobCache.has(chapterId) || pdfFetchingPromises.has(chapterId)) {
    return;
  }
  getOrFetchPdfUrl(chapterId).catch(() => {});
}
