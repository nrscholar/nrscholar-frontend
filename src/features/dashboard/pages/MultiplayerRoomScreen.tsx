import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";
import { copyToClipboard } from "../../../utils/clipboard";
import { showNotificationToast } from "../../../components/GlobalNotificationBanner";

export default function MultiplayerRoomScreen() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { t } = useTranslation();
  const [room, setRoom] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const isLeavingRef = useRef(false);
  const isStartingBattleRef = useRef(false);

  const fetchRoomStatus = async () => {
    if (isLeavingRef.current) return;
    try {
      const res = await apiFetch(`/api/multiplayer/room/${roomId}`);
      const data = await res.json();
      if (isLeavingRef.current) return;

      if (data.success && data.data) {
        setRoom(data.data);
        if (data.data.status === "playing" || data.data.status === "ready") {
          isStartingBattleRef.current = true;
          isLeavingRef.current = true;
          if (data.data.status === "ready") {
            apiFetch(`/api/multiplayer/room/${roomId}/start`, { method: "POST" })
              .catch(err => console.error("Failed to auto-start room:", err));
          }
          navigate(`/multiplayer-battle/${roomId}`, { replace: true });
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
    const interval = setInterval(() => {
      if (isLeavingRef.current) return;
      fetchRoomStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, [roomId, navigate]);

  // Cleanly quit/cancel room on backend if user leaves or unmounts before battle starts
  useEffect(() => {
    return () => {
      if (!isStartingBattleRef.current && roomId && !isLeavingRef.current) {
        apiFetch(`/api/multiplayer/room/${roomId}/quit`, { method: "POST" }).catch(() => {});
      }
    };
  }, [roomId]);

  const copyCode = async () => {
    if (room?.code) {
      await copyToClipboard(room.code);
      setCopied(true);
      showNotificationToast({
        title: "Code Copied",
        message: "Room Code copied to clipboard! 📋",
        type: "success"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBackToArena = () => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    if (roomId) {
      apiFetch(`/api/multiplayer/room/${roomId}/quit`, { method: "POST" }).catch(console.error);
    }
    // Cleanly pop back to the Shadow Arena hub
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/multiplayer-hub", { replace: true });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4efff] px-6 text-center">
        <h2 className="text-2xl font-bold text-[#ba1a1a] mb-4">{error}</h2>
        <button onClick={() => navigate("/multiplayer-hub")} className="bg-[#141779] text-white px-6 py-3 rounded-full font-bold">
          {t('go_back', 'Go Back')}
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
    <div className="min-h-screen bg-[#f4efff] font-sans flex flex-col relative overflow-x-clip">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#e8ddff] rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#ffd700] rounded-full blur-[100px] opacity-10"></div>

      <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-6 bg-[#f4efff]/90 backdrop-blur-md">
        <button 
          onClick={handleBackToArena} 
          className="p-2 bg-white border border-[#e0e0e0] shadow-sm rounded-full hover:bg-[#e8ddff] transition-colors"
          aria-label={t('go_back', 'Go Back')}
        >
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-[18px] font-black text-[#141779] tracking-[2px] uppercase">{t('waiting_room', 'WAITING ROOM')}</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="bg-white border-2 border-[#d0d0d0] rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center shadow-lg">
          <p className="text-[#767683] font-bold text-sm mb-2 uppercase tracking-wider">{t('room_code', 'ROOM CODE')}</p>
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
              <span className="text-[10px] bg-[#f4efff] border border-[#e0e0e0] px-2 py-1 rounded mt-1 text-[#141779] font-bold uppercase">{t('host', 'HOST')}</span>
            </div>

            <div className="text-3xl font-black text-[#ff9f43] italic px-4">VS</div>

            {/* Player 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full border-4 ${room.guestId ? 'bg-[#f4efff] border-[#ff9f43] shadow-md' : 'bg-white border-[#d0d0d0] border-dashed flex items-center justify-center'} overflow-hidden`}>
                 {room.guestId ? (
                   <img src={room.guestAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${room.guestName || 'Guest'}`} alt="Guest" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-[#767683] opacity-60 text-xs font-bold text-center">{t('waiting_dots', 'Waiting...')}</span>
                 )}
              </div>
              <p className="mt-3 text-[#141779] font-black max-w-[80px] text-center truncate">{room.guestName || t('guest', 'Guest')}</p>
              {room.guestId && <span className="text-[10px] bg-[#ffeed1] border border-[#ff9f43] px-2 py-1 rounded mt-1 text-[#ff9f43] font-bold uppercase">{t('ready', 'READY')}</span>}
            </div>
          </div>
          
          <div className="mt-12 text-center w-full">
            {!room.guestId ? (
               <div className="flex flex-col items-center">
                 <div className="w-6 h-6 border-2 border-[#141779] border-t-transparent rounded-full animate-spin mb-3"></div>
                 <p className="text-[#464652] font-bold text-sm animate-pulse">{t('waiting_for_opponent', 'Waiting for opponent to join...')}</p>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                 <p className="text-[#006a62] font-black text-lg animate-pulse mb-2">{t('opponent_joined', 'Opponent joined!')}</p>
                 <p className="text-[#464652] font-bold text-xs">{t('battle_starting_momentarily', 'Battle starting momentarily...')}</p>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
