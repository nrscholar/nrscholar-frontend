import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Swords, Users, Trophy } from "lucide-react";
import { apiFetch } from "../../../api";

export default function MultiplayerHubScreen() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/multiplayer/room/create", { method: "POST" });
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
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full bg-[#141779] text-white py-5 rounded-[24px] shadow-[0_6px_0_#0b0d4d] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 border-2 border-[#141779]"
          >
            <Users size={24} />
            <span className="text-[18px] font-extrabold tracking-wide uppercase">Create Room</span>
          </button>

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
