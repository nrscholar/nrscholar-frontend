import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { apiFetch } from "../../../api";

export default function MultiplayerRoomScreen() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const fetchRoomStatus = async () => {
    try {
      const res = await apiFetch(`/api/multiplayer/room/${roomId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setRoom(data.data);
        if (data.data.status === "playing") {
          navigate(`/multiplayer-battle/${roomId}`);
        } else if (data.data.status === "ready") {
          // Both players are in, automatically start the battle!
          apiFetch(`/api/multiplayer/room/${roomId}/start`, { method: "POST" })
            .catch(err => console.error("Failed to auto-start room:", err));
        }
      } else {
        setError(data.message || "Room not found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRoomStatus();
    const interval = setInterval(fetchRoomStatus, 2000); // poll every 2 seconds for faster transition
    return () => clearInterval(interval);
  }, [roomId, navigate]);

  const copyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efff] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#ba1a1a] mb-4">{error}</h2>
        <button onClick={() => navigate("/multiplayer-hub")} className="bg-[#141779] text-white px-6 py-3 rounded-full font-bold">
          Go Back
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141779]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141779] font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#30007f] rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#57fae9] rounded-full blur-[100px] opacity-20"></div>

      <header className="flex items-center justify-between px-5 py-6 relative z-10">
        <button onClick={() => navigate("/multiplayer-hub")} className="p-2 bg-[rgba(255,255,255,0.1)] rounded-full hover:bg-[rgba(255,255,255,0.2)] transition-colors">
          <ArrowLeft size={24} color="white" />
        </button>
        <h1 className="text-[18px] font-bold text-white tracking-[2px] uppercase">Waiting Room</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] backdrop-blur-md rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center">
          <p className="text-[#a4a8f0] font-bold text-sm mb-2 uppercase tracking-wider">Room Code</p>
          <div className="bg-white px-6 py-4 rounded-2xl flex items-center gap-4 mb-8 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="text-4xl font-black text-[#141779] tracking-[8px]">{room.code}</span>
            <button onClick={copyCode} className="p-2 bg-[#f4efff] rounded-xl hover:bg-[#e8ddff] transition-colors">
              {copied ? <CheckCircle size={24} color="#006a62" /> : <Copy size={24} color="#141779" />}
            </button>
          </div>

          <div className="w-full flex items-center justify-between mt-4">
            {/* Player 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#57fae9] border-4 border-white overflow-hidden shadow-[0_0_15px_rgba(87,250,233,0.5)]">
                 <img src={room.hostAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=P1"} alt="Host" className="w-full h-full object-cover" />
              </div>
              <p className="mt-3 text-white font-bold max-w-[80px] text-center truncate">{room.hostName}</p>
              <span className="text-[10px] bg-[rgba(255,255,255,0.2)] px-2 py-1 rounded mt-1 text-white font-bold uppercase">Host</span>
            </div>

            <div className="text-3xl font-black text-[#ff9f43] italic px-4">VS</div>

            {/* Player 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full border-4 ${room.guestId ? 'bg-[#ff9f43] border-white shadow-[0_0_15px_rgba(255,159,67,0.5)]' : 'bg-[rgba(255,255,255,0.1)] border-[rgba(255,255,255,0.2)] border-dashed flex items-center justify-center'} overflow-hidden`}>
                 {room.guestId ? (
                   <img src={room.guestAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=P2"} alt="Guest" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-white opacity-50 text-xs font-bold text-center">Waiting...</span>
                 )}
              </div>
              <p className="mt-3 text-white font-bold max-w-[80px] text-center truncate">{room.guestName || "Guest"}</p>
              {room.guestId && <span className="text-[10px] bg-[rgba(255,255,255,0.2)] px-2 py-1 rounded mt-1 text-white font-bold uppercase">Ready</span>}
            </div>
          </div>
          
          <div className="mt-12 text-center w-full">
            {!room.guestId ? (
               <div className="flex flex-col items-center">
                 <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                 <p className="text-[#a4a8f0] font-bold text-sm animate-pulse">Waiting for opponent to join...</p>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                 <p className="text-[#57fae9] font-black text-lg animate-pulse mb-2">Opponent joined!</p>
                 <p className="text-[#a4a8f0] font-bold text-xs">Battle starting momentarily...</p>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
