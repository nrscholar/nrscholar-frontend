import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, PlusCircle, Send, ArrowLeft, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
  image?: string;
};

const getInitialMessages = (t: any): Message[] => [
  {
    id: "1",
    role: "ai",
    text: t('saathy_intro'),
  },
  {
    id: "2",
    role: "user",
    text: t('sample_question'),
  },
  {
    id: "3",
    role: "ai",
    text: t('saathy_response'),
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVAgNd_cTSl56KCFiHwrwHqEQRcO6tGMF09vih5dHm0-eEAxzfgWsdBmLofUdrO4BvNBcESoTnk3Q0JnIy0QWd5UoGUi9j89EDyyIec6oKxuw4tOMNr6VvpEuuG0WpCgMMRug-QfUauVWGPD8331mNsZXE_NgfQY6RUS6_FJRIcOUUi9JWX7AqN2hDl49HUMCS8Nslczuc0IFPVBJDHkvmzIXe7xwlqeXjHaJ0Fw9rLRcUcd9-pRz8W9QId6_VaT7RbyJlR3t7uw",
  },
];

const getQuickReplies = (t: any) => [
  t('quick_reply_1'),
  t('quick_reply_2'),
  t('quick_reply_3'),
];

export default function ChatScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(t));
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState<any>(() => {
    try {
      const u = localStorage.getItem("userData");
      return u ? JSON.parse(u) : null;
    } catch (e) { return null; }
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchProfileAndNotifications = async () => {
      try {
        const res = await apiFetch("/api/users/me");
        const json = await res.json();
        if (json.success && json.data?.user) {
          setUserData(json.data.user);
          localStorage.setItem("userData", JSON.stringify(json.data.user));
        }
      } catch (e) {}

      try {
        const nRes = await apiFetch("/api/notifications");
        const nJson = await nRes.json();
        if (nJson.success && nJson.data) {
          setUnreadCount(nJson.data.filter((n: any) => !n.isRead).length);
        }
      } catch (e) {}
    };
    fetchProfileAndNotifications();
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const chatHistory = newMessages.map(m => ({
        role: m.role,
        text: m.text
      }));
      const res = await apiFetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          text: data.message || t('saathy_fallback')
        }
      ]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          text: t('saathy_error')
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col relative pb-32 max-w-md mx-auto">
      
      {/* Sticky Header */}
      <header className="sticky top-0 left-0 right-0 w-full max-w-md mx-auto z-50 bg-white border-b border-slate-100 rounded-b-[28px] shadow-xs pb-1">
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:opacity-90 transition-opacity shrink-0 bg-[#141779] shadow-xs"
            >
              {userData?.childPhoto ? (
                <img src={userData.childPhoto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#141779] text-white font-bold text-xs flex items-center justify-center">
                  {userData?.childName ? userData.childName.slice(0, 2).toUpperCase() : "NR"}
                </div>
              )}
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <h1 className="text-sm font-black text-slate-900 leading-tight truncate">{userData?.childName || "Explorer"}</h1>
                <span className="text-[10px] text-[#4f46e5] bg-[#eef2ff] font-black px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                  {userData?.childClass || t('class_10', { defaultValue: "Class 10" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] text-slate-400 font-extrabold whitespace-nowrap">
                  {t('explorer_level', { defaultValue: "Explorer Level" })} {userData?.level || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Currency & Streak Stats */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => navigate("/home")}
              className="bg-[#fff7ed] border border-orange-100/80 rounded-2xl px-2 py-1 flex flex-col items-center justify-center min-w-[44px] hover:scale-105 active:scale-95 transition-transform shadow-2xs"
            >
              <span className="text-[11px] font-black text-[#ea580c] leading-none">🔥 {userData?.streakDays || 0}</span>
            </button>
            <button
              onClick={() => navigate("/practice/inventory")}
              className="bg-[#fffbeb] border border-amber-100/80 rounded-2xl px-2 py-1 flex flex-col items-center justify-center min-w-[44px] hover:scale-105 active:scale-95 transition-transform shadow-2xs"
            >
              <span className="text-[11px] font-black text-[#b45309] leading-none">🪙 {userData?.coins || 0}</span>
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="w-9 h-9 rounded-2xl bg-slate-50 shadow-2xs flex items-center justify-center hover:bg-slate-100 transition-all shrink-0 border border-slate-100 relative"
            >
              <Bell size={16} className="text-[#1c1970]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold border border-white pointer-events-none z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-4 flex flex-col gap-6">
        {messages.map((msg) => {
          if (msg.role === "ai") {
            const parts = msg.text.split("\n\n");
            return (
              <div key={msg.id} className="flex items-end gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-[#57fae9] flex items-center justify-center shadow-[0_0_15px_rgba(87,250,233,0.5)] shrink-0">
                  <Sparkles size={16} color="#007168" />
                </div>
                <div className="bg-[rgba(255,255,255,0.7)] border-[1.5px] border-[rgba(255,255,255,0.4)] p-4 rounded-2xl rounded-bl-sm max-w-[85%] flex flex-col">
                  {parts.map((part, index) => (
                    <div key={index}>
                      {index > 0 && msg.image && (
                        <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.3)] my-3">
                          <img src={msg.image} alt="Message attachment" className="w-full h-32 object-cover" />
                        </div>
                      )}
                      <p className="text-base font-medium text-[#191c1e] leading-relaxed whitespace-pre-wrap">{part}</p>
                    </div>
                  ))}
                  {parts.length === 1 && msg.image && (
                    <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.3)] mt-3">
                      <img src={msg.image} alt="Message attachment" className="w-full h-32 object-cover" />
                    </div>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div key={msg.id} className="flex flex-row-reverse items-end gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-[#2d328f] flex items-center justify-center shrink-0">
                  <User size={16} color="white" />
                </div>
                <div className="bg-[#2d328f] p-4 rounded-2xl rounded-br-sm max-w-[85%] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <p className="text-base font-medium text-white leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          }
        })}

        {isTyping && (
          <div className="flex items-end gap-3 w-full opacity-70">
            <div className="w-8 h-8 rounded-full bg-[#57fae9] flex items-center justify-center shrink-0">
              <Sparkles size={16} color="#007168" />
            </div>
            <div className="flex items-center gap-1 p-4">
              <div className="w-2 h-2 rounded-full bg-[#006a62] animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-[#006a62] animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-[#006a62] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 px-6 pb-4 bg-gradient-to-t from-[#f7f9fb] via-[rgba(247,249,251,0.9)] to-transparent pt-6 z-40">
        
        {/* Quick Replies */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
          {getQuickReplies(t).map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSend(reply)}
              className="whitespace-nowrap bg-white border border-[#c7c5d4] px-4 py-2 rounded-full text-sm font-semibold text-[#006a62] hover:bg-gray-50 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="bg-[rgba(255,255,255,0.7)] border-[1.5px] border-[rgba(191,194,255,0.3)] rounded-full flex items-center p-2 gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
          <button className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
            <PlusCircle size={24} color="#464652" />
          </button>
          <input
            type="text"
            placeholder={t('ask_saathy')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent text-base font-medium text-[#191c1e] placeholder:text-[#464652] focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={`w-10 h-10 bg-[#141779] rounded-full flex items-center justify-center transition-opacity ${!input.trim() ? "opacity-50" : "hover:opacity-90"}`}
          >
            <Send size={20} color="white" />
          </button>
        </div>

      </div>

    </div>
  );
}
