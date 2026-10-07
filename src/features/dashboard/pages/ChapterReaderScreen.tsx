import { ArrowLeft, Maximize2, Minimize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
} catch (_) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const pdfOptions = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

const MIN_SCALE = 1.0;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.25;

// ─── Main screen ──────────────────────────────────────────────────────────────
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

  // ─── Window & Dimension tracking ───────────────────────────────────────────
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  useEffect(() => {
    const onResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // PDF Page native aspect ratio (width / height) - defaults to standard A4 (1 / 1.414)
  const [pageAspectRatio, setPageAspectRatio] = useState<number>(1 / 1.414);

  // ─── Zoom State (Double-Buffered for 100% Flash-Free Seamless Zoom) ────────
  const [scale, setScale] = useState<number>(1.0);
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');
  const [slotAScale, setSlotAScale] = useState<number | null>(1.0);
  const [slotBScale, setSlotBScale] = useState<number | null>(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Background rasterization: when scale settles, rasterize in the inactive slot
  useEffect(() => {
    const currentActiveScale = activeSlot === 'A' ? slotAScale : slotBScale;
    if (currentActiveScale === null || scale === currentActiveScale) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (activeSlot === 'A') {
        setSlotBScale(scale);
      } else {
        setSlotAScale(scale);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [scale, activeSlot, slotAScale, slotBScale]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  // ─── Reading time ──────────────────────────────────────────────────────────
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

  const loadPdf = async () => {
    setLoading(true);
    setPdfError(null);
    try {
      if (!chapterId) {
        throw new Error("No chapter ID provided");
      }
      const res = await apiFetch(`/api/textbook/chapter/${chapterId}/pdf`);
      if (!res.ok) throw new Error("Failed to load PDF file from server");
      const blob = await res.blob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error: any) {
      console.error("Error loading PDF:", error);
      setPdfError(error.message || "Failed to load PDF document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdf();
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [chapterId]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
      setIsFullscreen(false);
    }
  };

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

  // ─── Scroll helper ─────────────────────────────────────────────────────────
  const resetScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      scrollContainerRef.current.scrollLeft = 0;
    }
  };

  // ─── Page Navigation ───────────────────────────────────────────────────────
  const goToPrevPage = () => {
    if (pageNumber > 1) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (activeSlot === 'A') setSlotBScale(null);
      else setSlotAScale(null);
      setPageNumber((p) => p - 1);
      resetScrollToTop();
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (activeSlot === 'A') setSlotBScale(null);
      else setSlotAScale(null);
      setPageNumber((p) => p + 1);
      resetScrollToTop();
    }
  };

  // ─── Zoom Controls ─────────────────────────────────────────────────────────
  const handleZoom = (nextScale: number) => {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, parseFloat(nextScale.toFixed(2))));
    const container = scrollContainerRef.current;

    if (!container || clamped === scale) {
      setScale(clamped);
      return;
    }

    const currentScrollLeft = container.scrollLeft;
    const currentScrollTop = container.scrollTop;
    const viewW = container.clientWidth;
    const viewH = container.clientHeight;

    const centerPointX = currentScrollLeft + viewW / 2;
    const centerPointY = currentScrollTop + viewH / 2;

    const zoomRatio = clamped / scale;
    const targetScrollLeft = centerPointX * zoomRatio - viewW / 2;
    const targetScrollTop = centerPointY * zoomRatio - viewH / 2;

    setScale(clamped);

    if (clamped <= MIN_SCALE) {
      container.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: Math.max(0, targetScrollLeft),
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth',
          });
        }
      });
    }
  };

  const zoomIn = () => {
    handleZoom(scale + SCALE_STEP);
  };

  const zoomOut = () => {
    handleZoom(scale - SCALE_STEP);
  };

  const resetZoom = () => {
    handleZoom(1.0);
  };

  // ─── Mouse Drag Panning (for desktop / mouse users when scale > 1) ──────────
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 || !scrollContainerRef.current) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scrollContainerRef.current.scrollLeft,
      scrollTop: scrollContainerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    scrollContainerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
    scrollContainerRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ─── Touch Handlers (Pinch-to-zoom + Swipe on Scale 1) ─────────────────────
  const lastTouchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef(1);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
      initialPinchScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / lastTouchDistRef.current;
      const rawScale = initialPinchScaleRef.current * ratio;
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, parseFloat(rawScale.toFixed(2))));
      setScale(clamped);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    lastTouchDistRef.current = null;
    if (scale <= 1 && touchStartRef.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dy) < 40) {
        if (dx < 0) {
          goToNextPage();
        } else {
          goToPrevPage();
        }
      }
    }
    touchStartRef.current = null;
  };

  if (!chapterId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-bold text-[#141779]">Chapter not found</p>
      </div>
    );
  }

  // ─── Calculate dimensions ──────────────────────────────────────────────────
  const headerH = isFullscreen ? 0 : 54;
  const availW = windowDimensions.width;
  const availH = windowDimensions.height - headerH;

  // On mobile portrait, use 100% of the available screen width
  const isMobilePortrait = availW <= 640 || availW <= availH;
  const basePageWidth = isMobilePortrait
    ? availW
    : Math.min(availW, 720);
  const basePageHeight = Math.round(basePageWidth / pageAspectRatio);

  // Current visual layout dimensions (determines scrollable footprint)
  const currentWidth = Math.round(basePageWidth * scale);
  const currentHeight = Math.round(basePageHeight * scale);

  const renderSlot = (slotKey: 'A' | 'B', slotScale: number) => {
    const isCurrent = activeSlot === slotKey;
    const slotW = Math.round(basePageWidth * slotScale);
    const slotH = Math.round(basePageHeight * slotScale);
    const currentRatio = scale / slotScale;

    return (
      <div
        key={`slot-${slotKey}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: slotW,
          height: slotH,
          transform: currentRatio !== 1 ? `scale(${currentRatio})` : undefined,
          transformOrigin: 'top left',
          zIndex: isCurrent ? 2 : 1,
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
          opacity: isCurrent ? 1 : 0.001,
        }}
      >
        <Page
          key={`page-${pageNumber}-${slotKey}-${slotScale}`}
          pageNumber={pageNumber}
          width={slotW}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          devicePixelRatio={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)}
          loading={
            !hasRenderedOnce ? (
              <div
                style={{ width: slotW, height: slotH }}
                className="flex items-center justify-center bg-white"
              >
                <div className="w-10 h-10 border-4 border-slate-200 border-t-[#141779] rounded-full animate-spin" />
              </div>
            ) : null
          }
          onLoadSuccess={(page) => {
            if (page.width && page.height) {
              setPageAspectRatio(page.width / page.height);
            }
          }}
          onRenderSuccess={() => {
            setHasRenderedOnce(true);
            if (!isCurrent) {
              setActiveSlot(slotKey);
              if (slotKey === 'A') {
                setSlotBScale(null);
              } else {
                setSlotAScale(null);
              }
            }
          }}
          onRenderError={() => {
            if (!isCurrent) {
              if (slotKey === 'A') setSlotAScale(null);
              else setSlotBScale(null);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className={`flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen overflow-hidden'}`}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      {!isFullscreen && (
        <header className="flex items-center justify-between px-5 py-3.5 bg-white shrink-0 shadow-sm z-20 relative border-b border-slate-100">
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

      {/* ── Reader: Clean white background, no purple gradient ──────────────── */}
      <main className="flex-1 relative w-full bg-white overflow-hidden">
        {loading && !pdfUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white z-10">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#141779] rounded-full animate-spin shadow-md" />
            <p className="text-[#141779] font-extrabold tracking-wide text-lg drop-shadow-sm">Loading Magic Book...</p>
          </div>
        ) : pdfError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30 bg-white">
            <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-xl max-w-sm flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-2xl">
                ⚠️
              </div>
              <h3 className="text-lg font-black text-slate-900">Failed to Load PDF</h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                {pdfError}
              </p>
              <button
                onClick={loadPdf}
                className="px-6 py-2.5 bg-[#141779] text-white rounded-full font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-indigo-900 active:scale-95 transition-all"
              >
                Retry Loading
              </button>
            </div>
          </div>
        ) : pdfUrl ? (
          /* Scroll container: full width, clean white, allows full vertical & horizontal scrolling and panning */
          <div
            ref={scrollContainerRef}
            className="absolute inset-0 overflow-auto overscroll-contain select-none bg-white"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: scale > 1 ? 'pan-x pan-y' : 'auto',
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                width: '100%',
                minWidth: currentWidth > availW ? currentWidth : '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                paddingLeft: Math.max(0, Math.floor((availW - currentWidth) / 2)),
                paddingRight: Math.max(0, Math.floor((availW - currentWidth) / 2)),
                paddingTop: '0.75rem',
                paddingBottom: '9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              {/* Outer layout container: provides the exact scrollable bounding box */}
              <div
                style={{
                  width: currentWidth,
                  height: currentHeight,
                  position: 'relative',
                  flexShrink: 0,
                  backgroundColor: '#ffffff',
                }}
              >
                <Document
                  file={pdfUrl}
                  options={pdfOptions}
                  onLoadSuccess={({ numPages: n }) => {
                    setNumPages(n);
                    setPdfError(null);
                  }}
                  onLoadError={(err: Error) => {
                    console.error("PDF Document render error:", err);
                    setPdfError(err?.message || "Failed to parse PDF file content");
                  }}
                  loading={
                    <div className="flex flex-col items-center justify-center p-12 gap-3 bg-white">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#141779] rounded-full animate-spin shadow-md" />
                      <p className="text-[#141779] font-extrabold text-sm tracking-wide">Opening Magic Book...</p>
                    </div>
                  }
                >
                  {slotAScale !== null && renderSlot('A', slotAScale)}
                  {slotBScale !== null && renderSlot('B', slotBScale)}
                </Document>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white">
            <p className="text-red-500 font-bold text-lg">Failed to load the book.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#141779] hover:bg-[#0f1159] transition-colors text-white rounded-2xl font-bold shadow-lg">
              Try Again
            </button>
          </div>
        )}

        {/* ── Floating controls ─────────────────────────────────────────────── */}
        {pdfUrl && numPages && (
          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-30 px-4">

            {/* Mark complete overlay button on final page */}
            {!loading && pageNumber === numPages && (
              <button
                onClick={handleReadingComplete}
                disabled={markingComplete}
                className="pointer-events-auto bg-[#141779] hover:bg-[#0f1159] active:scale-95 transition-all text-white font-black py-3 px-6 rounded-2xl shadow-xl border-2 border-indigo-300/40 text-sm uppercase tracking-wider mb-1 flex items-center gap-2 animate-bounce"
              >
                {markingComplete ? "Saving..." : "✓ Mark Reading Complete"}
              </button>
            )}

            {/* Zoom pill */}
            <div className="bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.12)] border border-slate-200/80 px-4 py-1.5 rounded-full flex items-center gap-3 pointer-events-auto">
              <button
                onClick={zoomOut}
                disabled={scale <= MIN_SCALE}
                className="p-1.5 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={resetZoom}
                className="text-xs font-black text-[#141779] px-2 hover:bg-[#141779]/10 rounded-full py-1 transition-all min-w-[44px] text-center"
                title="Reset Zoom to 100%"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={scale >= MAX_SCALE}
                className="p-1.5 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            {/* Page navigation pill */}
            <div className="bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80 px-5 py-2 rounded-full flex items-center justify-between gap-5 pointer-events-auto min-w-[180px]">
              <button
                disabled={pageNumber <= 1}
                onClick={goToPrevPage}
                className="p-1.5 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all"
                title="Previous Page"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="font-extrabold text-[#141779] text-base tracking-wide">
                {pageNumber} <span className="opacity-40 mx-1 font-normal">/</span> {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={goToNextPage}
                className="p-1.5 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all"
                title="Next Page"
              >
                <ChevronRight size={24} />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
