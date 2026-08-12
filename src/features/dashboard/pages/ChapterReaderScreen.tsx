import { ArrowLeft, Maximize2, Minimize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

const MIN_SCALE = 1;
const MAX_SCALE = 4.0;
const BASE_WIDTH = () => Math.min(window.innerWidth - 32, 600);
const SWIPE_THRESHOLD = 60;

export default function ChapterReaderScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chapterId = searchParams.get("chapterId");
  const title = searchParams.get("title") || "Chapter Reader";
  const subjectName = searchParams.get("subjectName") || "";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  const startTimeRef = useRef(Date.now());
  const hasLoggedRef = useRef(false);

  // ─── Two-phase zoom using CSS Zoom ──────────────────────────────────────────
  // committedScale: the scale applied via CSS zoom on the wrapper
  const [committedScale, setCommittedScale] = useState(1);
  const committedScaleRef = useRef(1);                    // mutable, no re-render
  const liveScaleRef = useRef(1);                         // mutable, no re-render

  // Pinch tracking refs
  const lastDistRef = useRef<number | null>(null);
  const lastCommittedAtStartRef = useRef(1);              // committedScale when pinch began
  const isPinchingRef = useRef(false);

  // ─── Swipe (single finger, only at base zoom) ──────────────────────────────
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);
  const [swipeHint, setSwipeHint] = useState<'left' | 'right' | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  // ─── Reading time ─────────────────────────────────────────────────────────
  const logReadingTime = async () => {
    if (hasLoggedRef.current) return;
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    if (timeSpent < 3) return;
    hasLoggedRef.current = true;
    try {
      await apiFetch("/api/parent/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Chapter PDF Reading",
          type: "reading",
          timeTaken: timeSpent,
          correctQuestions: 0,
          totalQuestions: 0,
          details: [],
          chapter: title || undefined,
          subject: subjectName || undefined,
          chapterId: chapterId || undefined,
        }),
      });
    } catch (e) { console.error("Failed to log reading activity", e); }
  };

  useEffect(() => { return () => { logReadingTime(); }; }, []);

  useEffect(() => {
    async function loadPdf() {
      try {
        if (!chapterId) return;
        const res = await apiFetch(`/api/textbook/chapter/${chapterId}/pdf`);
        if (!res.ok) throw new Error("Failed to load PDF");
        const blob = await res.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPdf();
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [chapterId]);

  const toggleFullscreen = () => setIsFullscreen(f => !f);

  const handleReadingComplete = async () => {
    if (!chapterId) return;
    setMarkingComplete(true);
    await logReadingTime();
    try {
      await apiFetch("/api/practice/chapter-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, currentQ: 0, score: 0, completed: false, readingCompleted: true }),
      });
    } catch (_) { /* fall through */ }
    navigate(
      `/mission-roadmap?chapterId=${chapterId}&title=${encodeURIComponent(title)}&subjectName=${encodeURIComponent(subjectName)}`,
      { replace: true }
    );
    setMarkingComplete(false);
  };

  // ─── Pinch distance helper ─────────────────────────────────────────────────
  const getPinchDist = (t: React.TouchList) =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  // ─── Touch handlers ────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Record the distance at pinch-start and the already-committed scale
      lastDistRef.current = getPinchDist(e.touches);
      lastCommittedAtStartRef.current = committedScaleRef.current;
      isPinchingRef.current = true;
      // Cancel any in-flight swipe
      touchStartXRef.current = null;
      isSwipingRef.current = false;
    } else if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      isSwipingRef.current = false;
      lastDistRef.current = null;
      isPinchingRef.current = false;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistRef.current !== null) {
      e.preventDefault();
      const ratio = getPinchDist(e.touches) / lastDistRef.current;
      const rawLive = lastCommittedAtStartRef.current * ratio;
      const clampedTotal = Math.min(MAX_SCALE, Math.max(MIN_SCALE, rawLive));
      liveScaleRef.current = clampedTotal;
      // Directly mutate DOM zoom for smooth 60fps zooming without React re-render
      const el = document.getElementById('pdf-zoom-wrapper');
      if (el) el.style.zoom = String(clampedTotal);
    } else if (
      e.touches.length === 1 &&
      touchStartXRef.current !== null &&
      committedScaleRef.current <= 1.05
    ) {
      const dx = e.touches[0].clientX - touchStartXRef.current;
      const dy = e.touches[0].clientY - (touchStartYRef.current ?? 0);
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isSwipingRef.current = true;
        e.preventDefault();
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isPinchingRef.current) {
      const newCommitted = Math.min(MAX_SCALE, Math.max(MIN_SCALE, liveScaleRef.current));
      committedScaleRef.current = newCommitted;
      liveScaleRef.current = newCommitted;

      // Update React state to match
      setCommittedScale(newCommitted);
      isPinchingRef.current = false;
    }

    if (isSwipingRef.current && touchStartXRef.current !== null && e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        if (dx < 0) {
          setPageNumber(p => { const n = Math.min(p + 1, numPages ?? p); if (n !== p) setSwipeHint('left'); return n; });
        } else {
          setPageNumber(p => { const n = Math.max(p - 1, 1); if (n !== p) setSwipeHint('right'); return n; });
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isSwipingRef.current = false;
    lastDistRef.current = null;
  }, [numPages]);

  // Clear swipe hint
  useEffect(() => {
    if (swipeHint) { const t = setTimeout(() => setSwipeHint(null), 400); return () => clearTimeout(t); }
  }, [swipeHint]);

  // ─── Zoom button helpers ───────────────────────────────────────────────────
  const applyCommit = (next: number) => {
    committedScaleRef.current = next;
    liveScaleRef.current = next;
    const el = document.getElementById('pdf-zoom-wrapper');
    if (el) el.style.zoom = String(next);
    setCommittedScale(next);
  };
  const zoomIn = () => applyCommit(Math.min(MAX_SCALE, parseFloat((committedScaleRef.current + 0.25).toFixed(2))));
  const zoomOut = () => applyCommit(Math.max(MIN_SCALE, parseFloat((committedScaleRef.current - 0.25).toFixed(2))));
  const resetZoom = () => applyCommit(1);

  if (!chapterId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efff]">
        <p className="text-lg font-bold text-[#141779]">Chapter not found</p>
      </div>
    );
  }

  // Keep Page width constant so react-pdf doesn't re-render/flicker the canvas
  const pageWidth = Math.round(BASE_WIDTH());

  return (
    <div className={`flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen overflow-hidden'}`}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      {!isFullscreen && (
        <header className="flex items-center justify-between px-5 py-4 bg-white shrink-0 shadow-sm z-20 relative">
          <button
            onClick={async () => { await logReadingTime(); navigate(-1); }}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-[18px] font-extrabold text-[#141779] truncate px-2 text-center max-w-[200px]">
            {title}
          </h1>
          <button onClick={toggleFullscreen} className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-all">
            <Maximize2 size={22} color="#141779" />
          </button>
        </header>
      )}

      {/* ── Fullscreen exit ──────────────────────────────────────────────────── */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-20">
          <button onClick={toggleFullscreen} className="p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-lg border border-gray-100 transition-all">
            <Minimize2 size={22} color="#141779" />
          </button>
        </div>
      )}

      {/* ── Reader ──────────────────────────────────────────────────────────── */}
      <main
        className="flex-1 relative w-full bg-gradient-to-br from-[#e0c3fc] via-[#f4efff] to-[#8ec5fc] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}   // we control all gestures manually
      >
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />

        {loading && !pdfUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-[#141779] rounded-full animate-spin shadow-md" />
            <p className="text-[#141779] font-extrabold tracking-wide text-lg drop-shadow-sm">Loading Magic Book...</p>
          </div>
        ) : pdfUrl ? (
          /*
           * overflow-auto: scrolls when committed page width > viewport
           * (only after pinch-end when <Page> is re-rendered at the new width)
           */
          <div className="absolute inset-0 overflow-auto" style={{ paddingBottom: '9rem' }}>
            <div className="flex flex-col items-center justify-start min-h-full p-4 min-w-max mx-auto">
              <Document
                file={pdfUrl}
                options={pdfOptions}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <div className="w-12 h-12 border-4 border-white border-t-[#141779] rounded-full animate-spin mt-20 shadow-md" />
                }
              >
                {/*
                  id="pdf-zoom-wrapper" — during a pinch we mutate this element's
                  style.zoom directly (bypassing React) for smooth 60fps feedback.
                  On pinch-end we commit the new scale to state.
                */}
                <div
                  id="pdf-zoom-wrapper"
                  style={{ zoom: committedScale, transformOrigin: 'top center', display: 'inline-block' }}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(20,23,121,0.2)] border-8 border-white/60">
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={false}
                      renderAnnotationLayer={true}
                      devicePixelRatio={2}
                      width={pageWidth}
                    />
                  </div>
                </div>
              </Document>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <p className="text-red-500 font-bold text-lg">Failed to load the book.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#141779] hover:bg-[#0f1159] transition-colors text-white rounded-2xl font-bold shadow-lg">
              Try Again
            </button>
          </div>
        )}

        {/* ── Floating controls ────────────────────────────────────────────── */}
        {pdfUrl && numPages && (
          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-20 px-4">

            {/* Zoom pill */}
            <div className="bg-white/90 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.10)] border border-white/80 px-4 py-2 rounded-full flex items-center gap-3 pointer-events-auto">
              <button onClick={zoomOut} disabled={committedScale <= MIN_SCALE}
                className="p-1.5 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all">
                <ZoomOut size={20} />
              </button>
              <button onClick={resetZoom}
                className="text-xs font-bold text-[#141779] px-2 hover:bg-[#141779]/10 rounded-full py-1 transition-all min-w-[44px] text-center">
                {Math.round(committedScale * 100)}%
              </button>
              <button onClick={zoomIn} disabled={committedScale >= MAX_SCALE}
                className="p-1.5 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all">
                <ZoomIn size={20} />
              </button>
            </div>

            {/* Page navigation pill */}
            <div className="bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white px-6 py-3 rounded-full flex items-center justify-between gap-6 pointer-events-auto min-w-[200px]">
              <button disabled={pageNumber <= 1}
                onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                className="p-2 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all">
                <ChevronLeft size={28} />
              </button>
              <span className="font-extrabold text-[#141779] text-lg tracking-wide">
                {pageNumber} <span className="opacity-40 mx-1 font-normal">/</span> {numPages}
              </span>
              <button disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
                className="p-2 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all">
                <ChevronRight size={28} />
              </button>
            </div>

          </div>
        )}
      </main>

      {/* ── Footer: mark complete ────────────────────────────────────────────── */}
      {!loading && pdfUrl && !isFullscreen && pageNumber === numPages && (
        <div className="bg-white border-t border-gray-100 p-5 shrink-0 flex justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 relative">
          <button
            onClick={handleReadingComplete}
            disabled={markingComplete}
            className="bg-[#141779] hover:bg-[#0f1159] active:scale-95 transition-all text-white font-extrabold py-4 px-8 rounded-2xl shadow-[0_8px_20px_rgba(20,23,121,0.25)] w-full max-w-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {markingComplete ? "Saving..." : "Mark as Reading Complete"}
          </button>
        </div>
      )}
    </div>
  );
}
