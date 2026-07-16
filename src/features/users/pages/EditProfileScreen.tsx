import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserRound, GraduationCap, Cake, BookOpen, Save, Camera, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../../api";

const CustomDropdown = ({ label, icon: Icon, iconColor, value, options, onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 flex-1 relative">
      <label className="text-sm font-semibold text-[#767683] ml-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 bg-white rounded-full pl-12 pr-10 text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none flex items-center justify-start text-left relative"
      >
        <div className="absolute left-4 z-10 flex items-center h-full top-0">
          <Icon size={22} color={iconColor} />
        </div>
        <span className={`truncate ${value ? "text-[#191c1e]" : "text-[#c7c5d4]"}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={24} color="#767683" className="absolute right-3" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-6"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-[320px] bg-white rounded-3xl p-6 max-h-[60vh] flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#141779] mb-4 text-center">Select</h3>
                <div className="overflow-y-auto pr-2">
                  {options.map((opt: string) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onSelect(opt);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between py-4 border-b border-[#f2f4f6] last:border-0"
                    >
                      <span className={`text-base ${value === opt ? 'font-bold text-[#141779]' : 'font-medium text-[#464652]'}`}>
                        {opt}
                      </span>
                      {value === opt && <Check size={20} color="#141779" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const [childName, setChildName] = useState("");
  const [childClass, setChildClass] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childBoard, setChildBoard] = useState("");
  const [childPhoto, setChildPhoto] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChildPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const classes = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const ages = ["4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years", "11 Years", "12 Years", "13 Years", "14 Years", "15 Years"];
  const boards = ["CBSE (NCERT)", "ICSE", "State Board", "IB", "IGCSE"];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await apiFetch("/api/users/me");
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
          setChildName(data.data.user.childName || "");
          setChildClass(data.data.user.childClass || "");
          setChildAge(data.data.user.childAge ? `${data.data.user.childAge} Years` : "");
          setChildBoard(data.data.user.childBoard || "");
          setChildPhoto(data.data.user.childPhoto || "");
        }
      } catch (e) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const ageNum = childAge ? parseInt(childAge.split(" ")[0]) : null;
      const res = await apiFetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName,
          childClass,
          childAge: ageNum,
          childBoard,
          childPhoto
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        setMsg(t('profile_updated_successfully'));
        setTimeout(() => navigate(-1), 1500);
      } else {
        setMsg(data.message || t('failed_to_update_profile'));
      }
    } catch (e) {
      setMsg(t('failed_to_update_profile'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] to-[#f7f9fb] font-sans">
      <header className="flex items-center justify-between px-5 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-2xl font-bold text-[#141779]">{t('edit_profile')}</h1>
        <div className="w-8" />
      </header>

      <main className="px-6 pt-8 pb-24 max-w-md mx-auto">
        <div className="bg-[rgba(255,255,255,0.7)] rounded-3xl p-6 border-[1.5px] border-[rgba(255,255,255,0.8)] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {msg && (
              <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-center font-bold text-sm ${msg.includes("success") ? "bg-[#006a62] text-white" : "bg-[#ba1a1a] text-white"} animate-in fade-in slide-in-from-bottom-5`}>
                {msg}
              </div>
            )}
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center mb-2 relative">
              <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] bg-gray-100 flex items-center justify-center overflow-hidden">
                {childPhoto ? (
                  <img src={childPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(childName || "Kid")}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <label htmlFor="photo-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
                    <Camera size={24} color="white" />
                  </label>
                </div>
              </div>
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
              <span className="text-xs font-bold text-[#767683] mt-2">{t('tap_photo_to_edit')}</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-2">{t('explorer_name')}</label>
              <div className="relative flex items-center">
                <UserRound size={22} color="#006a62" className="absolute left-4" />
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full h-14 bg-white rounded-full pl-12 pr-6 text-base font-medium text-[#191c1e] border-2 border-transparent focus:border-[#141779] outline-none"
                />
              </div>
            </div>

            <CustomDropdown
              label={t('education_board')}
              icon={BookOpen}
              iconColor="#006a62"
              value={childBoard}
              options={boards}
              onSelect={setChildBoard}
              placeholder={t('select_board')}
            />

            <div className="flex gap-3 w-full">
              <CustomDropdown
                label={t('class_grade')}
                icon={GraduationCap}
                iconColor="#30007f"
                value={childClass}
                options={classes}
                onSelect={setChildClass}
                placeholder={t('select')}
              />

              <CustomDropdown
                label={t('age')}
                icon={Cake}
                iconColor="#141779"
                value={childAge}
                options={ages}
                onSelect={setChildAge}
                placeholder={t('select')}
              />
            </div>

            {/* Language Selection */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-semibold text-[#767683] ml-2">{t('app_language')}</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => { localStorage.setItem('i18nextLng', 'en'); window.location.reload(); }}
                  className={`flex-1 py-3 rounded-full border-2 ${localStorage.getItem('i18nextLng') === 'en' || !localStorage.getItem('i18nextLng') ? 'bg-[#141779] text-white border-[#141779]' : 'bg-white text-[#141779] border-gray-200'} text-sm font-bold transition-colors`}
                >
                  English
                </button>
                <button 
                  type="button"
                  onClick={() => { localStorage.setItem('i18nextLng', 'hi'); window.location.reload(); }}
                  className={`flex-1 py-3 rounded-full border-2 ${localStorage.getItem('i18nextLng') === 'hi' ? 'bg-[#141779] text-white border-[#141779]' : 'bg-white text-[#141779] border-gray-200'} text-sm font-bold transition-colors`}
                >
                  हिन्दी
                </button>
                <button 
                  type="button"
                  onClick={() => { localStorage.setItem('i18nextLng', 'gu'); window.location.reload(); }}
                  className={`flex-1 py-3 rounded-full border-2 ${localStorage.getItem('i18nextLng') === 'gu' ? 'bg-[#141779] text-white border-[#141779]' : 'bg-white text-[#141779] border-gray-200'} text-sm font-bold transition-colors`}
                >
                  ગુજરાતી
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              <span className="text-white text-lg font-semibold">{loading ? t('saving') : t('save_profile')}</span>
              {!loading && <Save size={22} color="white" />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
