import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Upload, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../api";

const CHIPS = [
  { emoji: '🌞', label: 'Sun', topic: 'The Sun' },
  { emoji: '🧬', label: 'DNA', topic: 'DNA and genetics' },
  { emoji: '⚡', label: 'Electricity', topic: 'Electricity' },
  { emoji: '🍎', label: 'Gravity', topic: 'Gravity' },
  { emoji: '🌊', label: 'Waves', topic: 'Sound waves' },
  { emoji: '🦋', label: 'Metamorph.', topic: 'Butterfly metamorphosis' },
  { emoji: '⚗️', label: 'Acids', topic: 'Acids and bases' },
  { emoji: '🪐', label: 'Saturn', topic: 'Planet Saturn' },
];

interface AIData {
  tag: string;
  emoji: string;
  title: string;
  summary: string;
  facts: string[];
  funFact: string;
}

export default function ScanAndLearn() {
  const navigate = useNavigate();
  const [state, setState] = useState<'idle' | 'analyzing' | 'result' | 'error'>('idle');
  const [textInput, setTextInput] = useState('');
  const [analysisLabel, setAnalysisLabel] = useState('');
  const [aiData, setAiData] = useState<AIData | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  const handleCameraScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAnalysisLabel('Analyzing your photo...');
      setState('analyzing');
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          const res = await apiFetch("/api/ai/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64String })
          });
          const json = await res.json();
          if (json.success && json.data) {
            setAiData(json.data);
            setFactIndex(0);
            setState('result');
          } else {
            setState('error');
          }
        } catch (err) {
          console.error(err);
          setState('error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextLearn = async (topicString?: string) => {
    const topic = topicString || textInput.trim();
    if (!topic) return;
    setAnalysisLabel(`"${topic}"`);
    setState('analyzing');
    setTextInput('');

    try {
      const res = await apiFetch("/api/ai/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiData(json.data);
        setFactIndex(0);
        setState('result');
      } else {
        setState('error');
      }
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaee] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-[#fffde7] rounded-b-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:opacity-80">
          <ArrowLeft size={20} color="#735c00" />
          <span className="text-[15px] font-semibold text-[#735c00]">Back</span>
        </button>
        <h1 className="text-lg font-extrabold text-[#1b1c15]">🔬 Scan & Learn</h1>
        <button onClick={() => navigate('/scan-history')} className="hover:opacity-80">
          <Clock size={22} color="#735c00" />
        </button>
      </header>

      <main className="p-5 pb-10">
        {state === 'idle' && (
          <div className="animate-in fade-in duration-300">
            {/* Camera card */}
            <div className="bg-white rounded-[22px] p-5 mb-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
              <h2 className="text-lg font-extrabold text-[#1b1c15] mb-1.5">📸 Point & Scan</h2>
              <p className="text-[13px] text-[#64748b] leading-5 mb-4.5">
                Point your camera at any object — plant, book, food, gadget — and AI will teach you about it!
              </p>

              <label className="flex items-center justify-center gap-2.5 bg-[#735c00] py-4 rounded-[18px] mb-3 shadow-[0_6px_10px_rgba(115,92,0,0.3)] cursor-pointer hover:opacity-90 transition-opacity">
                <Camera size={20} color="white" />
                <span className="text-base font-bold text-white">Open Camera & Scan</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraScan} />
              </label>

              <label className="flex items-center justify-center gap-2.5 border-2 border-[#735c00] py-3 rounded-[18px] cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={18} color="#735c00" />
                <span className="text-[15px] font-bold text-[#735c00]">Pick Image from Gallery</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCameraScan} />
              </label>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-[#ddd]" />
              <span className="text-[13px] text-[#aaa] px-3">or type a topic</span>
              <div className="flex-1 h-px bg-[#ddd]" />
            </div>

            {/* Text search */}
            <div className="flex gap-2.5 mb-5">
              <input
                type="text"
                placeholder="e.g. photosynthesis, black hole..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextLearn()}
                className="flex-1 bg-white rounded-[14px] px-4 py-3 text-sm text-[#1b1c15] border-[1.5px] border-[#ddd] outline-none focus:border-[#735c00]"
              />
              <button
                onClick={() => handleTextLearn()}
                disabled={!textInput.trim()}
                className={`rounded-[14px] px-4.5 flex items-center justify-center transition-colors ${textInput.trim() ? 'bg-[#735c00]' : 'bg-[#ccc]'}`}
              >
                <span className="text-white font-extrabold text-[15px]">Go</span>
              </button>
            </div>

            {/* Quick chips */}
            <h3 className="text-sm font-bold text-[#50462a] mb-3">⚡ Quick Topics</h3>
            <div className="flex flex-wrap gap-2.5">
              {CHIPS.map(ch => (
                <button
                  key={ch.topic}
                  onClick={() => { setTextInput(ch.topic); handleTextLearn(); }}
                  className="flex items-center gap-1.5 bg-white py-2.5 px-3.5 rounded-full border-[1.5px] border-[#ddd] hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base">{ch.emoji}</span>
                  <span className="text-[13px] font-semibold text-[#50462a]">{ch.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {state === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <motion.div 
              animate={{ scale: [1, 1.18, 1] }} 
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-[110px] h-[110px] rounded-full bg-[#ffe087] flex items-center justify-center mb-6"
            >
              <div className="w-[78px] h-[78px] rounded-full bg-white flex items-center justify-center border-3 border-[#ebc23e]">
                <span className="text-[32px]">🔬</span>
              </div>
            </motion.div>
            
            <div className="relative w-[55vw] max-w-[200px] h-[188px] mb-5">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-[#735c00] rounded-tl-md" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-[#735c00] rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-[#735c00] rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-[#735c00] rounded-br-md" />
              
              <motion.div
                animate={{ y: [0, 170, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-[#f57f17] shadow-[0_0_6px_#f57f17]"
              />
            </div>

            <h3 className="text-base font-bold text-[#1b1c15] mb-1.5">Analyzing with Gemini AI...</h3>
            <p className="text-[13px] text-[#64748b]">{analysisLabel}</p>
          </div>
        )}

        {state === 'result' && aiData && (
          <motion.div
            initial={{ y: 500 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 8 }}
            className="bg-white rounded-[24px] p-5 shadow-[0_6px_16px_rgba(0,0,0,0.1)] mb-10"
          >
            <div className="inline-block bg-[#fff3e0] py-1 px-3 rounded-xl mb-3.5">
              <span className="text-[#e65100] text-xs font-bold uppercase tracking-wider">{aiData.tag || 'Science'}</span>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <span className="text-[38px]">{aiData.emoji || '🔬'}</span>
              <div className="flex-1">
                <h2 className="text-[22px] font-extrabold text-[#1b1c15]">{aiData.title}</h2>
                <p className="text-[13px] text-[#64748b] mt-1 leading-[18px]">{aiData.summary}</p>
              </div>
            </div>

            {aiData.facts && aiData.facts.length > 0 && (
              <>
                <div className="bg-[#fff3e0] rounded-2xl p-4 mb-3.5">
                  <p className="text-xs font-bold text-[#64748b] mb-2 tracking-wider">💡 Fact {factIndex + 1} of {aiData.facts.length}</p>
                  <p className="text-[15px] font-semibold text-[#e65100] leading-6">{aiData.facts[factIndex]}</p>
                </div>

                <div className="flex justify-center gap-2 mb-3.5">
                  {aiData.facts.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${i === factIndex ? 'w-5 bg-[#e65100]' : 'w-2 bg-[#e0e0e0]'}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={() => setFactIndex((factIndex + 1) % aiData.facts.length)}
                  className="w-full border-2 border-[#e65100] rounded-xl py-3 flex justify-center mb-3.5 hover:bg-orange-50 transition-colors"
                >
                  <span className="text-sm font-bold text-[#e65100]">Next Fact →</span>
                </button>
              </>
            )}

            <div className="bg-[#fffde7] rounded-xl p-3.5 mb-3.5">
              <p className="text-[13px] font-bold text-[#735c00] mb-1.5">🤩 Fun Fact</p>
              <p className="text-sm text-[#50462a] leading-[22px]">{aiData.funFact}</p>
            </div>

            <button onClick={() => setState('idle')} className="w-full bg-[#f5f4e8] rounded-2xl py-3.5 flex justify-center hover:bg-[#e8e7da]">
              <span className="text-[15px] font-bold text-[#50462a]">📸 Scan/Type Another Topic</span>
            </button>
          </motion.div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <span className="text-5xl mb-4">🛸</span>
            <h3 className="text-lg font-bold text-[#1b1c15] mb-2">Cosmic Interference!</h3>
            <p className="text-sm text-[#64748b] text-center mb-6 max-w-[280px]">
              We couldn't analyze the topic or image. Please make sure your network is active and try again.
            </p>
            <button onClick={() => setState('idle')} className="bg-[#735c00] text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-90">
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
