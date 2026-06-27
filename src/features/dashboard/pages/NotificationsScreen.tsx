import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-10 overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center px-4 h-16 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-2xl font-bold text-[#141779]">Notifications</h1>
      </header>

      <main className="px-6 pt-8 flex flex-col gap-8 max-w-[500px] mx-auto">
        
        {/* Timeline */}
        <div className="relative pl-1 flex flex-col gap-6">
          {/* Dashed Line */}
          <div className="absolute left-[22px] top-0 bottom-0 border-l-2 border-dashed border-[rgba(20,23,121,0.3)] z-0" />

          {/* Task Reminder */}
          <div className="flex items-start gap-4 z-10 relative">
            <div className="w-10 h-10 rounded-full bg-[#141779] flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)] mt-1">
              <Bell size={20} color="white" />
            </div>
            <div className="flex-1 relative">
              <div className="absolute -left-[6px] top-5 w-4 h-4 bg-[rgba(255,255,255,0.7)] rotate-45 z-0" />
              <button className="w-full text-left bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.5)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors relative z-10">
                <h3 className="text-sm font-semibold text-[#141779] mb-1">Task Reminder</h3>
                <p className="text-base font-medium text-[#191c1e]">Daily Mission: 'The Red Planet' is waiting for you.</p>
              </button>
            </div>
          </div>

          {/* System Update 1 */}
          <div className="flex items-start gap-4 z-10 relative">
            <div className="w-10 h-10 rounded-full bg-[#e0e3e5] flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)] mt-1">
              <Sparkles size={20} color="#141779" />
            </div>
            <div className="flex-1 relative">
              <div className="absolute -left-[6px] top-5 w-4 h-4 bg-[rgba(255,255,255,0.7)] rotate-45 z-0" />
              <button className="w-full text-left bg-[rgba(255,255,255,0.7)] rounded-2xl p-4 border-[1.5px] border-[rgba(255,255,255,0.5)] shadow-[0_1px_5px_rgba(0,0,0,0.05)] hover:bg-white transition-colors relative z-10">
                <h3 className="text-sm font-semibold text-[#767683] mb-1">System Update</h3>
                <p className="text-base font-medium text-[#464652]">New Science lessons added to the Library.</p>
              </button>
            </div>
          </div>
        </div>

        {/* System Update 2 (Pill Layout) */}
        <button className="flex items-center gap-4 bg-[rgba(255,255,255,0.7)] rounded-full p-4 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:bg-white transition-colors text-left">
          <div className="w-12 h-12 rounded-full bg-[#e6e8ea] flex items-center justify-center shrink-0">
            <Sparkles size={24} color="#767683" />
          </div>
          <div className="flex flex-col flex-1">
            <h3 className="text-sm font-semibold text-[#767683] mb-1">System Update</h3>
            <p className="text-base font-medium text-[#464652]">New Science lessons added to the Library.</p>
          </div>
        </button>

        {/* Visual Anchor */}
        <div className="mt-8 relative w-full h-48 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[rgba(0,106,98,0.1)] rounded-full"
          />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcg9JTfpWdNOXpWuO22pAh-SmdrVfI0_D7ceGxeDxO3gO-tl8MfHIl2U2sOBoSOnMQxjKkQkUwK6nFeC7BJX9w_D87zfkhtbhlEtizN4c-C_BFnGPHsqutVbgyi8mzN5DIvrn9JnnMETaWneQo-LPHZ1mcXJ_KjTaLb2iDH6eQKZAhFWejwLoV_BrYdrbu2oYvv2-pxHMPTpNHeQbcPAC-aaCDkttqKHBsgbkXzDtN4wyNlmZnXrR4_vboBBJMBA5cEybt9xqJnA"
            alt="Buddy"
            className="w-32 h-32 object-contain relative z-10"
          />
        </div>

      </main>
    </div>
  );
}
