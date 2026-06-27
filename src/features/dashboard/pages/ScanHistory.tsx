import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, BookOpen } from "lucide-react";

interface ScanItem {
  id: number;
  title: string;
  emoji?: string;
  facts?: string[];
  date: string;
}

export default function ScanHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ScanItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('scanHistory');
    if (historyStr) {
      try {
        setHistory(JSON.parse(historyStr));
      } catch (e) {
        console.error("Failed to parse scan history", e);
      }
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all scan history?")) {
      localStorage.removeItem('scanHistory');
      setHistory([]);
    }
  };

  const deleteItem = (id: number) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('scanHistory', JSON.stringify(updated));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#fbfaee] font-sans pb-10">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-[#fffde7] border-b border-[rgba(0,0,0,0.06)] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity flex items-center gap-1.5">
            <ArrowLeft size={20} color="#735c00" />
            <span className="text-[#735c00] font-semibold">Back</span>
          </button>
        </div>
        <h1 className="text-xl font-extrabold text-[#1b1c15] absolute left-1/2 -translate-x-1/2">
          Scan History
        </h1>
        {history.length > 0 ? (
          <button onClick={clearHistory} className="bg-[#ffdad6] px-3.5 py-1.5 rounded-xl hover:bg-red-200 transition-colors">
            <span className="text-[#ba1a1a] font-bold text-xs">Clear All</span>
          </button>
        ) : (
          <div className="w-[72px]" />
        )}
      </header>

      <main className="px-5 pt-4 flex flex-col items-center">
        {/* Stats Bar */}
        {history.length > 0 && (
          <div className="w-full max-w-[500px] flex bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-4">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl font-extrabold text-[#1b1c15]">{history.length}</span>
              <span className="text-xs font-semibold text-[#64748b] mt-1">Total Scans</span>
            </div>
            <div className="w-px bg-[#e0e0e0] my-1" />
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl font-extrabold text-[#1b1c15]">{new Set(history.map(h => h.title)).size}</span>
              <span className="text-xs font-semibold text-[#64748b] mt-1">Topics</span>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="w-full max-w-[500px] flex flex-col gap-3">
          {history.length > 0 ? (
            history.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="w-12 h-12 rounded-[14px] bg-[#fffde7] flex items-center justify-center shrink-0 mr-3.5">
                      <span className="text-2xl">{item.emoji || '📸'}</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-base font-bold text-[#1b1c15]">{item.title}</span>
                      <span className="text-xs font-medium text-[#64748b] mt-1">{formatDate(item.date)}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <Trash2 size={20} color="#64748b" />
                    </button>
                  </div>

                  {isExpanded && item.facts && (
                    <div className="mt-3.5 bg-[#f8f9fa] rounded-xl p-3.5">
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <BookOpen size={16} color="#735c00" />
                        <span className="text-[13px] font-bold text-[#735c00]">Saved Facts:</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {item.facts.map((fact, idx) => (
                          <div key={idx} className="flex items-start gap-2 pr-2">
                            <span className="text-sm font-bold text-[#735c00] mt-0.5">•</span>
                            <span className="text-[13px] text-[#374151] leading-5 flex-1">{fact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-10">
              <span className="text-[64px] mb-4">🔬</span>
              <h2 className="text-[22px] font-extrabold text-[#1b1c15] mb-2">No Scans Yet</h2>
              <p className="text-sm text-[#64748b] text-center leading-5 mb-6 max-w-[250px]">
                Open the Scan & Learn camera and start scanning objects around you!
              </p>
              <button
                onClick={() => navigate("/scan-and-learn")}
                className="bg-[#735c00] py-3.5 px-7 rounded-[20px] hover:bg-[#8a6e00] transition-colors"
              >
                <span className="text-white text-[15px] font-bold">📸 Start Scanning</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
