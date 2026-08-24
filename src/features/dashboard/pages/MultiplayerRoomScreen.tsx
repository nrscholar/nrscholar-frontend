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
  const [showLeaveModal, setShowLeaveModal] = useState(false);

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

  const handleLeaveRoom = async () => {
    try {
      await apiFetch(`/api/multiplayer/room/${roomId}/quit`, { method: "POST" });
    } catch (e) {
      console.error("Failed to quit room:", e);
    }
    setShowLeaveModal(false);
    navigate("/multiplayer-hub");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4efff] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#ba1a1a] mb-4">{error}</h2>
        <button onClick={() => navigate("/multiplayer-hub")} className="bg-[#141779] text-white px-6 py-3 rounded-full font-bold">
          Go Back
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efff]">
        <div className="w-12 h-12 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#e8ddff] rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#ffd700] rounded-full blur-[100px] opacity-10"></div>

      <header className="flex items-center justify-between px-5 py-6 relative z-10">
        <button onClick={() => setShowLeaveModal(true)} className="p-2 bg-white border border-[#e0e0e0] shadow-sm rounded-full hover:bg-[#e8ddff] transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[18px] font-black text-[#141779] tracking-[2px] uppercase">Waiting Room</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="bg-white border-2 border-[#d0d0d0] rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center shadow-lg">
          <p className="text-[#767683] font-bold text-sm mb-2 uppercase tracking-wider">Room Code</p>
          <div className="bg-[#f4efff] border-2 border-[#e0e0e0] px-6 py-4 rounded-2xl flex items-center gap-4 mb-4 shadow-sm">
            <span className="text-4xl font-black text-[#141779] tracking-[8px]">{room.code}</span>
            <button onClick={copyCode} className="p-2 bg-white rounded-xl hover:bg-[#e8ddff] transition-colors border border-[#e0e0e0]">
              {copied ? <CheckCircle size={24} color="#006a62" /> : <Copy size={24} color="#141779" />}
            </button>
          </div>

          {room.guestJoinError && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] px-4 py-3 rounded-xl text-sm font-bold w-full text-center mb-6 animate-pulse border border-[#ffb4ab]">
              {room.guestJoinError}
            </div>
          )}

          <div className="w-full flex items-center justify-between mt-4">
            {/* Player 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#f4efff] border-4 border-[#141779] overflow-hidden shadow-md">
                 <img src={room.hostAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${room.hostName || 'Host'}`} alt="Host" className="w-full h-full object-cover" />
              </div>
              <p className="mt-3 text-[#141779] font-black max-w-[80px] text-center truncate">{room.hostName}</p>
              <span className="text-[10px] bg-[#f4efff] border border-[#e0e0e0] px-2 py-1 rounded mt-1 text-[#141779] font-bold uppercase">Host</span>
            </div>

            <div className="text-3xl font-black text-[#ff9f43] italic px-4">VS</div>

            {/* Player 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full border-4 ${room.guestId ? 'bg-[#f4efff] border-[#ff9f43] shadow-md' : 'bg-white border-[#d0d0d0] border-dashed flex items-center justify-center'} overflow-hidden`}>
                 {room.guestId ? (
                   <img src={room.guestAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${room.guestName || 'Guest'}`} alt="Guest" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-[#767683] opacity-60 text-xs font-bold text-center">Waiting...</span>
                 )}
              </div>
              <p className="mt-3 text-[#141779] font-black max-w-[80px] text-center truncate">{room.guestName || "Guest"}</p>
              {room.guestId && <span className="text-[10px] bg-[#ffeed1] border border-[#ff9f43] px-2 py-1 rounded mt-1 text-[#ff9f43] font-bold uppercase">Ready</span>}
            </div>
          </div>
          
          <div className="mt-12 text-center w-full">
            {!room.guestId ? (
               <div className="flex flex-col items-center">
                 <div className="w-6 h-6 border-2 border-[#141779] border-t-transparent rounded-full animate-spin mb-3"></div>
                 <p className="text-[#464652] font-bold text-sm animate-pulse">Waiting for opponent to join...</p>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                 <p className="text-[#006a62] font-black text-lg animate-pulse mb-2">Opponent joined!</p>
                 <p className="text-[#464652] font-bold text-xs">Battle starting momentarily...</p>
               </div>
            )}
          </div>

        </div>
      </main>

      {/* LEAVE CONFIRMATION MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col items-center text-center shadow-2xl border-2 border-[#e0e0e0] animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-[#141779] mb-2">Leave Room?</h2>
            <p className="text-[#464652] font-semibold mb-6">
              Are you sure you want to leave this waiting room?
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="flex-grow bg-[#f4efff] text-[#141779] py-3 rounded-xl font-bold hover:bg-[#e8ddff] transition-all border-2 border-[#e0e0e0]"
              >
                Cancel
              </button>
              <button 
                onClick={handleLeaveRoom}
                className="flex-grow bg-[#ba1a1a] text-white py-3 rounded-xl font-bold hover:bg-[#ba1a1a]/80 transition-all"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
