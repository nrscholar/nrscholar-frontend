import { ArrowLeft, Book, ChevronDown, Globe, Microscope, Shapes, Swords, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api";

export default function MultiplayerHubScreen() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chapter, setChapter] = useState("Mix Chapters");
  const [chaptersList, setChaptersList] = useState<string[]>([]);
  const [myClass, setMyClass] = useState("Class 1");
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);

  useEffect(() => {
    apiFetch("/api/users/me").then(r => r.json()).then(d => {
      if (d.success && d.data?.user?.childClass) {
        setMyClass(d.data.user.childClass);
      }
    });
  }, []);

  useEffect(() => {
    apiFetch(`/api/multiplayer/chapters?subject=${encodeURIComponent(subject)}&class_name=${encodeURIComponent(myClass)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setChaptersList(d.data);
          if (!d.data.includes(chapter)) setChapter("Mix Chapters");
        }
      });
  }, [subject, myClass]);

  const handleCreateRoom = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/multiplayer/room/create", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, chapter })
      });
      const data = await res.json();
      if (data.success && data.data) {
        navigate(`/multiplayer-room/${data.data._id}`);
      } else {
        setError(data.message || "Failed to create room");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (joinCode.length < 6) {
      setError("Code must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/multiplayer/room/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode })
      });
      const data = await res.json();
      if (data.success && data.data) {
        navigate(`/multiplayer-room/${data.data.roomId}`);
      } else {
        setError(data.message || "Invalid room code");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col pb-24 relative">
      <header className="flex items-center justify-between px-5 py-4 bg-[#f4efff] sticky top-0 z-40">
        <button onClick={() => navigate("/home")} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#141779]">Shadow Arena</h1>
        <div className="w-8" />
      </header>

      <main className="px-6 pt-6 flex-1 flex flex-col items-center justify-center gap-8">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#141779] to-[#30007f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_16px_rgba(20,23,121,0.3)] border-4 border-white">
            <Swords size={48} color="white" />
          </div>
          <h2 className="text-3xl font-black text-[#141779] mb-2 leading-tight">Arena 1v1</h2>
          <p className="text-[#464652] font-semibold">Challenge friends in real-time. Win 25 in a row for a physical prize!</p>
        </div>

        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] px-4 py-3 rounded-2xl text-sm font-bold w-full text-center">
            {error}
          </div>
        )}

        <div className="w-full flex flex-col gap-4">
          <div className="bg-white p-5 rounded-[24px] border-2 border-[#d0d0d0] shadow-sm flex flex-col gap-4">
            <label className="text-[#141779] font-bold text-sm uppercase">Select Subject</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {[
                { id: "Mathematics", icon: Shapes, color: "text-[#ff9f43]", bg: "bg-[rgba(255,159,67,0.1)]", border: "border-[#ff9f43]" },
                { id: "Science", icon: Microscope, color: "text-[#57fae9]", bg: "bg-[rgba(87,250,233,0.1)]", border: "border-[#57fae9]" },
                { id: "English", icon: Book, color: "text-[#a4a8f0]", bg: "bg-[rgba(164,168,240,0.1)]", border: "border-[#a4a8f0]" },
                { id: "Social Studies", icon: Globe, color: "text-[#ffb4ab]", bg: "bg-[rgba(255,180,171,0.1)]", border: "border-[#ffb4ab]" }
              ].map(subj => {
                const isSelected = subject === subj.id;
                const Icon = subj.icon;
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSubject(subj.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected 
                      ? `${subj.bg} ${subj.border} shadow-[0_4px_12px_rgba(0,0,0,0.1)] scale-105` 
                      : 'bg-white border-[#e0e0e0] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Icon size={28} className={isSelected ? subj.color : "text-[#767683]"} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? subj.color : "text-[#767683]"}`}>
                      {subj.id}
                    </span>
                  </button>
                )
              })}
            </div>
            
            {chaptersList.length > 0 && (
              <>
                <label className="text-[#141779] font-bold text-sm uppercase mt-2">Select Chapter</label>
                <div className="relative">
                  <button
                    onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                    className="w-full flex items-center justify-between bg-[#f4efff] border-2 border-[#e0e0e0] rounded-xl py-4 px-5 text-[15px] font-bold text-[#141779] focus:outline-none focus:border-[#141779] transition-colors shadow-sm"
                  >
                    <span className="truncate pr-4">{chapter === "Mix Chapters" ? "Mix Chapters (All)" : chapter}</span>
                    <ChevronDown size={24} className={`transition-transform duration-300 ${isChapterDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isChapterDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#e0e0e0] rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="max-h-60 overflow-y-auto">
                        <div
                          onClick={() => { setChapter("Mix Chapters"); setIsChapterDropdownOpen(false); }}
                          className={`px-5 py-4 text-[15px] font-bold cursor-pointer transition-colors border-b border-[#f0f0f0] ${
                            chapter === "Mix Chapters" ? 'bg-[#141779] text-white' : 'text-[#141779] hover:bg-[#f4efff]'
                          }`}
                        >
                          Mix Chapters (All)
                        </div>
                        {chaptersList.map(c => (
                          <div
                            key={c}
                            onClick={() => { setChapter(c); setIsChapterDropdownOpen(false); }}
                            className={`px-5 py-4 text-[15px] font-bold cursor-pointer transition-colors border-b border-[#f0f0f0] last:border-0 ${
                              chapter === c ? 'bg-[#141779] text-white' : 'text-[#464652] hover:bg-[#f4efff]'
                            }`}
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-[#141779] text-white py-5 rounded-2xl shadow-[0_6px_0_#0b0d4d] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 border-2 border-[#141779]"
            >
              <Users size={24} />
              <span className="text-[18px] font-extrabold tracking-wide uppercase">Create Room</span>
            </button>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t-2 border-dashed border-[#d0d0d0]"></div>
            <span className="flex-shrink-0 mx-4 text-[#767683] font-bold text-sm">OR JOIN</span>
            <div className="flex-grow border-t-2 border-dashed border-[#d0d0d0]"></div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border-2 border-[#d0d0d0] shadow-sm flex flex-col gap-4">
            <input
              type="text"
              placeholder="ENTER 6-DIGIT CODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full bg-[#f4efff] border-2 border-[#e0e0e0] rounded-xl py-4 px-4 text-center text-2xl font-black text-[#141779] tracking-[6px] focus:outline-none focus:border-[#141779] transition-colors uppercase placeholder:text-[#afafaf] placeholder:tracking-normal placeholder:font-bold placeholder:text-sm"
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading || joinCode.length < 6}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                joinCode.length === 6 
                ? 'bg-[#ff9f43] text-white shadow-[0_4px_0_#d17e30] active:translate-y-[4px] active:shadow-none' 
                : 'bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed'
              }`}
            >
              <span className="text-[16px] font-extrabold tracking-wide uppercase">Join Battle</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 bg-[rgba(255,215,0,0.15)] px-5 py-4 rounded-[20px] w-full">
          <Trophy size={32} color="#ff9f43" className="shrink-0" />
          <p className="text-sm font-bold text-[#141779]">
            The <span className="text-[#ff9f43]">25-Win Streak Challenge</span> is active! Prove you are the ultimate champion.
          </p>
        </div>
      </main>
    </div>
  );
}
