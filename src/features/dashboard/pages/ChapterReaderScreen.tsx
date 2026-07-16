import { ArrowLeft, Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function ChapterReaderScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chapterId = searchParams.get("chapterId");
  const title = searchParams.get("title") || "Chapter Reader";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    async function loadPdf() {
      try {
        if (!chapterId) return;
        const res = await apiFetch(`/api/textbook/chapter/${chapterId}/pdf`);
        if (!res.ok) throw new Error("Failed to load PDF");
        
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPdf();
    
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [chapterId]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleReadingComplete = async () => {
    if (!chapterId) return;
    setMarkingComplete(true);
    try {
      await apiFetch("/api/practice/chapter-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: chapterId,
          currentQ: 0,
          score: 0,
          completed: false,
          readingCompleted: true
        })
      });
      navigate(`/chapter-questions?chapterId=${chapterId}&chapterName=${encodeURIComponent(title)}`, { replace: true });
    } catch (error) {
      console.error("Error saving progress:", error);
      navigate(`/chapter-questions?chapterId=${chapterId}&chapterName=${encodeURIComponent(title)}`, { replace: true });
    } finally {
      setMarkingComplete(false);
    }
  };

  if (!chapterId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efff]">
        <p className="text-lg font-bold text-[#141779]">Chapter not found</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen overflow-hidden'}`}>
      {/* Header */}
      {!isFullscreen && (
        <header className="flex items-center justify-between px-5 py-4 bg-white shrink-0 shadow-sm z-20 relative">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} color="#141779" />
          </button>
          <h1 className="text-[18px] font-extrabold text-[#141779] truncate px-2 text-center max-w-[250px]">
            {title}
          </h1>
          <button onClick={toggleFullscreen} className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-all">
            <Maximize2 size={22} color="#141779" />
          </button>
        </header>
      )}

      {/* Fullscreen Header Overlay */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-20">
          <button onClick={toggleFullscreen} className="p-3 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-lg border border-gray-100 transition-all">
            <Minimize2 size={22} color="#141779" />
          </button>
        </div>
      )}

      {/* Reader Container */}
      <main className="flex-1 flex flex-col relative w-full h-full bg-gradient-to-br from-[#e0c3fc] via-[#f4efff] to-[#8ec5fc] overflow-hidden">
        
        {/* Playful background decorative elements (optional pure CSS) */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />

        {loading && !pdfUrl ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 z-10">
            <div className="w-12 h-12 border-4 border-white border-t-[#141779] rounded-full animate-spin shadow-md" />
            <p className="text-[#141779] font-extrabold tracking-wide text-lg drop-shadow-sm">Loading Magic Book...</p>
          </div>
        ) : pdfUrl ? (
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-4 pb-32 z-10">
            <Document 
              file={pdfUrl} 
              options={pdfOptions}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="w-12 h-12 border-4 border-white border-t-[#141779] rounded-full animate-spin mt-20 shadow-md" />
              }
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(20,23,121,0.2)] border-8 border-white/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]">
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                  renderAnnotationLayer={true}
                  devicePixelRatio={1}
                  width={Math.min(window.innerWidth - 32, 600)}
                />
              </div>
            </Document>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-red-500 font-bold text-lg">Failed to load the book.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#141779] hover:bg-[#0f1159] transition-colors text-white rounded-2xl font-bold shadow-lg">
              Try Again
            </button>
          </div>
        )}

        {/* Floating Pagination Controls */}
        {pdfUrl && numPages && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-10 px-4">
            <div className="bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white px-6 py-3 rounded-full flex items-center justify-between gap-6 pointer-events-auto min-w-[200px]">
              <button 
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
                className="p-2 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={28} />
              </button>
              <span className="font-extrabold text-[#141779] text-lg tracking-wide">
                {pageNumber} <span className="opacity-40 mx-1 font-normal">/</span> {numPages}
              </span>
              <button 
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(p => Math.min(p + 1, numPages))}
                className="p-2 text-[#141779] hover:bg-[#141779]/10 active:scale-95 rounded-full disabled:opacity-30 transition-all"
              >
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Action - ONLY VISIBLE ON LAST PAGE */}
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
