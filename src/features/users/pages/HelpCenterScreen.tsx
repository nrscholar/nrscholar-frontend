import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { apiFetch } from "../../../api";


export default function HelpCenterScreen() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<{question: string, answer: string, _id: string}[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await apiFetch("/api/users/faqs");
        const data = await response.json();
        if (data.success) {
          setFaqs(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch FAQs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans">
      <header className="flex items-center justify-between px-5 py-4 bg-[rgba(247,249,251,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-50 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-1 hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} color="#141779" />
        </button>
        <h1 className="text-2xl font-bold text-[#141779]">Help Center</h1>
        <div className="w-8" />
      </header>

      <main className="px-6 pt-8 pb-24 flex flex-col gap-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#141779] mb-2">How can we help?</h2>
          <p className="text-[#767683] text-sm">Browse our frequently asked questions or get in touch with our team.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#141779] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {faqs.map(faq => (
              <div key={faq._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button 
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#191c1e]">{faq.question}</span>
                  {openFaq === faq._id ? (
                    <ChevronUp size={20} color="#767683" />
                  ) : (
                    <ChevronDown size={20} color="#767683" />
                  )}
                </button>
                {openFaq === faq._id && (
                  <div className="px-4 pb-4 text-[#464652] text-sm leading-relaxed border-t border-gray-50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button 
            onClick={() => window.location.href = "mailto:support@studysaathy.com"}
            className="w-full flex items-center justify-center gap-3 bg-[#141779] text-white py-4 rounded-2xl font-bold shadow-md hover:bg-[#1a1e9c] transition-colors"
          >
            <Mail size={20} />
            Contact Support
          </button>
          <p className="text-center text-xs text-[#767683] mt-3">
            We typically reply within 24 hours.
          </p>
        </div>
      </main>
    </div>
  );
}
