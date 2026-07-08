import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Award, Zap, Users, HelpCircle, LogOut, User } from "lucide-react";
import { apiFetch } from "../../../api";


export default function ProfileScreen() {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [user, setUser] = useState<any>(null);

  useState(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch(e) {}
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await apiFetch("/api/users/me", {
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
          localStorage.setItem("userData", JSON.stringify(data.data.user));
        }
      } catch (e) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans">
      {/* TopAppBar */}
      <header className="flex items-center justify-between px-5 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-2xl font-bold text-[#141779]">Profile</h1>
        <div className="w-8" /> {/* Spacer */}
      </header>

      <main className="px-6 pt-8 pb-24 flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-[#57fae9] overflow-hidden shadow-sm bg-white flex items-center justify-center">
              {user.childPhoto ? (
                <img
                  src={user.childPhoto}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.childName || "Kid")}&background=random`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#006a62] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Award size={14} color="white" />
              <span className="text-xs font-bold text-white tracking-widest">LVL {user.level}</span>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#141779] tracking-tight">{user.childName}</h2>
            <p className="text-base font-medium text-[#464652]">Explorer Extraordinaire</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-3 flex flex-col items-center border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <Star size={24} color="#006a62" className="mb-1" />
            <span className="text-2xl font-bold text-[#141779]">{user.totalStars}</span>
            <span className="text-xs font-bold text-[#464652] tracking-[1px] uppercase">Stars</span>
          </div>
          <div className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-3 flex flex-col items-center border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <Award size={24} color="#006a62" className="mb-1" />
            <span className="text-2xl font-bold text-[#141779]">{(user.badges || []).length}</span>
            <span className="text-xs font-bold text-[#464652] tracking-[1px] uppercase">Badges</span>
          </div>
          <div className="flex-1 bg-[rgba(255,255,255,0.7)] rounded-2xl p-3 flex flex-col items-center border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
            <Zap size={24} color="#006a62" className="mb-1" />
            <span className="text-2xl font-bold text-[#141779]">{user.streakDays}</span>
            <span className="text-xs font-bold text-[#464652] tracking-[1px] uppercase">Streak</span>
          </div>
        </div>

        {/* Settings List */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate("/edit-profile")}
            className="w-full flex items-center justify-between bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-4">
              <User size={24} color="#141779" />
              <span className="text-lg font-medium text-[#191c1e]">Edit Profile</span>
            </div>
            <ArrowLeft size={24} color="#767683" className="rotate-180" />
          </button>

          <button 
            onClick={() => navigate("/parent")}
            className="w-full flex items-center justify-between bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-4">
              {user.parentPhoto ? (
                <div className="w-7 h-7 rounded-full border border-[rgba(20,23,121,0.2)] overflow-hidden shrink-0">
                  <img src={user.parentPhoto} alt="Parent" className="w-full h-full object-cover" />
                </div>
              ) : (
                <Users size={24} color="#141779" />
              )}
              <span className="text-lg font-medium text-[#191c1e]">Parental Controls</span>
            </div>
            <ArrowLeft size={24} color="#767683" className="rotate-180" />
          </button>

          <button 
            onClick={() => navigate("/help")}
            className="w-full flex items-center justify-between bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-4">
              <HelpCircle size={24} color="#141779" />
              <span className="text-lg font-medium text-[#191c1e]">Help Center</span>
            </div>
            <ArrowLeft size={24} color="#767683" className="rotate-180" />
          </button>

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors mt-4"
          >
            <div className="flex items-center gap-4">
              <LogOut size={24} color="#ba1a1a" />
              <span className="text-lg font-medium text-[#ba1a1a]">Logout</span>
            </div>
          </button>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-[20px] p-4 flex flex-col gap-3 border-[1.5px] border-[#eef0f2] shadow-sm relative z-10 mt-2">
          <h3 className="text-[15px] font-bold text-[#141779]">App Language</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => { localStorage.setItem('i18nextLng', 'en'); window.location.reload(); }}
              className={`flex-1 py-2 rounded-xl border ${localStorage.getItem('i18nextLng') === 'en' || !localStorage.getItem('i18nextLng') ? 'bg-[#141779] text-white border-[#141779]' : 'bg-gray-50 text-[#141779] border-gray-200'} text-sm font-bold transition-colors`}
            >
              English
            </button>
            <button 
              onClick={() => { localStorage.setItem('i18nextLng', 'hi'); window.location.reload(); }}
              className={`flex-1 py-2 rounded-xl border ${localStorage.getItem('i18nextLng') === 'hi' ? 'bg-[#141779] text-white border-[#141779]' : 'bg-gray-50 text-[#141779] border-gray-200'} text-sm font-bold transition-colors`}
            >
              हिन्दी
            </button>
            <button 
              onClick={() => { localStorage.setItem('i18nextLng', 'gu'); window.location.reload(); }}
              className={`flex-1 py-2 rounded-xl border ${localStorage.getItem('i18nextLng') === 'gu' ? 'bg-[#141779] text-white border-[#141779]' : 'bg-gray-50 text-[#141779] border-gray-200'} text-sm font-bold transition-colors`}
            >
              ગુજરાતી
            </button>
          </div>
        </div>
      </main>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[#141779] text-center mb-2">Logout</h3>
            <p className="text-sm text-[#464652] text-center mb-6">
              Are you sure you want to log out of StudySaathy?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleLogout}
                className="w-full py-3.5 bg-[#ba1a1a] text-white rounded-xl font-bold text-sm shadow-md hover:bg-red-700 transition-colors"
              >
                Yes, Log Out
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3.5 bg-[#f0f2f5] text-[#141779] rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
