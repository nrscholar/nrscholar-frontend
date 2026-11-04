import { apiFetch } from "../api";

// Chapter PDFs are delivered from S3 in chunks of CHUNK_PAGES pages. Raw bytes are cached
// in memory (no blob: URLs). Chunk 0 also reports the total page count.
export const CHUNK_PAGES = 10;

export interface PdfChunk {
  data: ArrayBuffer;
  totalPages: number;
  chunkCount: number;
}

const chunkCache = new Map<string, PdfChunk>();
const inflight = new Map<string, Promise<PdfChunk>>();
const key = (chapterId: string, chunk: number) => `${chapterId}:${chunk}`;

export async function getOrFetchPdfChunk(chapterId: string, chunk: number): Promise<PdfChunk> {
  if (!chapterId) throw new Error("Invalid chapter ID");
  const k = key(chapterId, chunk);

  const cached = chunkCache.get(k);
  if (cached) return cached;
  const pending = inflight.get(k);
  if (pending) return pending;

  const p = (async () => {
    try {
      const res = await apiFetch(`/api/textbook/chapter/${chapterId}/pdf-chunk?chunk=${chunk}`);
      if (!res.ok) throw new Error("Failed to load PDF file from server");
      const data = await res.arrayBuffer();
      if (data.byteLength === 0) throw new Error("Received empty PDF file from server");
      const totalPages = parseInt(res.headers.get("X-Total-Pages") || "", 10);
      const chunkCount = parseInt(res.headers.get("X-Chunk-Count") || "", 10);
      if (!totalPages || !chunkCount) throw new Error("Invalid PDF chunk response");
      const result: PdfChunk = { data, totalPages, chunkCount };
      chunkCache.set(k, result);
      return result;
    } finally {
      inflight.delete(k);
    }
  })();

  inflight.set(k, p);
  return p;
}

export function getCachedPdfChunk(chapterId: string, chunk: number): PdfChunk | null {
  if (!chapterId) return null;
  return chunkCache.get(key(chapterId, chunk)) || null;
}

/** Silently prefetches the first chunk of a chapter PDF. */
export function prefetchPdf(chapterId: string): void {
  if (!chapterId) return;
  getOrFetchPdfChunk(chapterId, 0).catch(() => {});
}
