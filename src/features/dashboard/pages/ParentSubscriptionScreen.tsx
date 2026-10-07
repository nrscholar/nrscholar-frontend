import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Sparkles, LayoutGrid, CheckSquare, Users, EyeOff, Check, Minus, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../../api";

export default function ParentSubscriptionScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSub() {
      try {
        const cached = localStorage.getItem("userData");
        if (cached) {
          const u = JSON.parse(cached);
          if (u.is_subscribed || u.isSubscribed) setSubscriptionPlan("pro");
        }
        const meRes = await apiFetch("/api/users/me");
        const meJson = await meRes.json();
        if (meJson.success && meJson.data?.user) {
          const u = meJson.data.user;
          localStorage.setItem("userData", JSON.stringify(u));
          if (u.is_subscribed || u.isSubscribed) setSubscriptionPlan("pro");
        }
      } catch (e) {}
    }
    loadSub();
  }, []);

  const handlePlanSelect = async (planId: string) => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/parent/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptionPlan(planId);
        const cached = localStorage.getItem("userData");
        let u = cached ? JSON.parse(cached) : {};
        const isSub = planId.toLowerCase() === "pro";
        u.is_subscribed = isSub;
        u.isSubscribed = isSub;
        u.subscription = planId;
        localStorage.setItem("userData", JSON.stringify(u));
        window.dispatchEvent(new Event("userDataUpdated"));
      }
    } catch (e) {
      console.error("Subscription error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans pb-10">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 h-16 bg-[rgba(247,249,251,0.8)] border-b-[1.5px] border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-xl font-bold text-[#141779]">{t("premium_plan", "Premium Plan")}</h1>
        <div className="w-10" />
      </header>

      <main className="px-6 pt-6 flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-[28px] font-bold text-[#191c1e] mb-2 text-center">{t("choose_your_plan", "Choose Your Plan")}</h2>
          <p className="text-base font-medium text-[#464652] text-center">{t("unlock_full_potential", "Unlock full potential with NR Scholar Pro.")}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-base font-semibold ${!isYearly ? 'text-[#191c1e]' : 'text-[#767683]'}`}>{t("monthly", "Monthly")}</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 bg-[#e0e3e5] rounded-full p-0.5 relative transition-colors"
          >
            <motion.div
              animate={{ x: isYearly ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-[26px] h-[26px] bg-[#006a62] rounded-full shadow-sm"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-base font-semibold ${isYearly ? 'text-[#191c1e]' : 'text-[#767683]'}`}>{t("yearly", "Yearly")}</span>
            <div className="bg-[#57fae9] px-2.5 py-1 rounded-full">
              <span className="text-[10px] font-bold text-[#007168]">{t("save_20_pct", "Save 20%")}</span>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="flex flex-col gap-5 w-full max-w-[400px] mb-8">
          {/* Basic Plan */}
          <div className={`bg-[rgba(255,255,255,0.7)] rounded-2xl p-6 border-2 transition-colors ${subscriptionPlan === "free" ? 'border-[#006a62]' : 'border-[rgba(255,255,255,0.8)]'}`}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-2xl font-bold text-[#191c1e]">{t("basic", "Basic")}</h3>
                <p className="text-sm font-medium text-[#767683] mt-0.5">{t("free_forever", "Free forever")}</p>
              </div>
              <span className="text-[32px] font-bold text-[#191c1e]">₹0</span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} color="#006a62" />
                <span className="text-sm font-semibold text-[#464652]">{t("ai_tutor_access", "AI Tutor access")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} color="#006a62" />
                <span className="text-sm font-semibold text-[#464652]">{t("daily_practice_feat", "Daily Practice")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} color="#006a62" />
                <span className="text-sm font-semibold text-[#464652]">{t("one_subject", "1 Subject")}</span>
              </div>
            </div>

            <button 
              disabled={subscriptionPlan === "free" || loading}
              onClick={() => handlePlanSelect("free")}
              className={`w-full py-4 rounded-full transition-colors font-bold text-sm ${
                subscriptionPlan === "free" ? 'bg-[#e0e3e5] text-[#767683]' : 'border-[1.5px] border-[#c7c5d4] text-[#141779] hover:bg-gray-50'
              }`}
            >
              {subscriptionPlan === "free" ? t("current_plan", "Current Plan") : t("downgrade_to_basic", "Downgrade to Basic")}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`bg-[rgba(255,255,255,0.9)] rounded-2xl p-6 border-[2.5px] transition-colors relative overflow-hidden ${subscriptionPlan === "pro" ? 'border-[#141779]' : 'border-[rgba(255,255,255,0.8)]'}`}>
            <div className="absolute top-0 right-0 bg-[#006a62] px-4 py-1.5 rounded-bl-2xl">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t("recommended", "Recommended")}</span>
            </div>

            <div className="flex justify-between items-start mb-5 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-[#141779]">{t("pro", "Pro")}</h3>
                <p className="text-sm font-medium text-[#767683] mt-0.5">{t("accelerated_learning", "Accelerated Learning")}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-baseline">
                  <span className="text-[32px] font-bold text-[#141779]">{isYearly ? "₹79" : "₹99"}</span>
                  <span className="text-base font-semibold text-[#767683]">/mo</span>
                </div>
                {isYearly && <span className="text-[10px] font-bold text-[#006a62] mt-0.5">{t("billed_yearly_at", "Billed yearly at ₹950")}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Sparkles size={18} color="#006a62" className="drop-shadow-[0_0_4px_rgba(42,221,205,0.8)]" />
                <span className="text-sm font-semibold text-[#191c1e]">{t("unlimited_ai_tutor", "Unlimited AI Tutor")}</span>
              </div>
              <div className="flex items-center gap-3">
                <LayoutGrid size={18} color="#006a62" />
                <span className="text-sm font-semibold text-[#191c1e]">{t("all_subjects", "All Subjects")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckSquare size={18} color="#006a62" />
                <span className="text-sm font-semibold text-[#191c1e]">{t("weekly_tests_feat", "Weekly Tests")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={18} color="#006a62" />
                <span className="text-sm font-semibold text-[#191c1e]">{t("detailed_parent_reports", "Detailed Parent Reports")}</span>
              </div>
              <div className="flex items-center gap-3">
                <EyeOff size={18} color="#006a62" />
                <span className="text-sm font-semibold text-[#191c1e]">{t("ad_free_experience", "Ad-free experience")}</span>
              </div>
            </div>

            <button 
              disabled={subscriptionPlan === "pro" || loading}
              onClick={() => handlePlanSelect("pro")}
              className={`w-full py-4 rounded-full transition-colors font-bold text-sm ${
                subscriptionPlan === "pro" ? 'bg-[#e0e3e5] text-[#767683]' : 'bg-[#141779] text-white hover:opacity-90 shadow-[0_4px_8px_rgba(20,23,121,0.15)]'
              }`}
            >
              {subscriptionPlan === "pro" ? t("current_active_plan", "Current Active Plan") : t("upgrade_to_pro", "Upgrade to Pro")}
            </button>
          </div>
        </div>

        {/* Detailed Comparison (Micro Table) */}
        <div className="w-full max-w-[400px] mb-8">
          <h3 className="text-xs font-bold text-[#464652] tracking-[2px] uppercase text-center mb-4">{t("feature_breakdown", "Feature Breakdown")}</h3>
          
          <div className="bg-[rgba(255,255,255,0.7)] rounded-2xl border-[1.5px] border-[rgba(255,255,255,0.8)] overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[rgba(199,197,212,0.3)]">
              <span className="text-sm font-semibold text-[#464652]">{t("interactive_games", "Interactive Games")}</span>
              <div className="flex gap-8 w-[80px] justify-between">
                <Check size={16} color="#006a62" />
                <Check size={16} color="#006a62" />
              </div>
            </div>

            <div className="flex justify-between items-center px-5 py-4 border-b border-[rgba(199,197,212,0.3)]">
              <span className="text-sm font-semibold text-[#464652]">{t("personalized_roadmap_feat", "Personalized Roadmap")}</span>
              <div className="flex gap-8 w-[80px] justify-between">
                <Minus size={16} color="#c7c5d4" />
                <Check size={16} color="#006a62" />
              </div>
            </div>

            <div className="flex justify-between items-center px-5 py-4">
              <span className="text-sm font-semibold text-[#464652]">{t("priority_support", "Priority Support")}</span>
              <div className="flex gap-8 w-[80px] justify-between">
                <Minus size={16} color="#c7c5d4" />
                <Check size={16} color="#006a62" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Policy */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Lock size={16} color="#767683" />
            <span className="text-xs font-bold text-[#767683]">{t("cancel_anytime_secure", "Cancel anytime. Secure payment.")}</span>
          </div>
          <span className="text-[10px] text-[#c7c5d4] text-center max-w-[250px]">
            {t("terms_privacy_notice", "By continuing, you agree to our Terms of Service and Privacy Policy.")}
          </span>
        </div>

      </main>
    </div>
  );
}

