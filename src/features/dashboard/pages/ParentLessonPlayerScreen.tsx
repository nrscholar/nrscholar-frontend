import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, CheckCircle, ShieldCheck, Star, Brain, Check, MessageCircle, Volume2, UserCheck, Flame, BookOpen, Search, MonitorOff, Clock } from "lucide-react";

export default function ParentLessonPlayerScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('id') || 'focus';

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);

  const totalSteps = 8;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setAnimateIn(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimateIn(true);
      }, 300);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
    if (option === 'B') {
      setShowFeedback(true);
    } else {
      setTimeout(() => setSelectedOption(null), 1000);
    }
  };

  const IllustrationBlock = ({ children, bg, text }: { children: React.ReactNode, bg: string, text: string }) => (
    <div className={`w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ${bg} ${text} relative`}>
      <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md"></div>
      <div className="relative z-10 scale-125">{children}</div>
    </div>
  );

  const renderListeningLesson = () => (
    <>
      {/* SCREEN 1 */}
      {currentStep === 0 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#141779]/10" text="text-[#141779]">
            <MessageCircle size={48} />
          </IllustrationBlock>
          <h2 className="text-2xl font-bold text-[#141779] mb-6">A Common Parenting Problem</h2>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Have you ever said:</p>
            <div className="bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm space-y-2 font-semibold text-[#141779] italic">
              <p>"Finish your homework."</p>
              <p>"Put your phone down."</p>
              <p>"Listen to me."</p>
            </div>
            <p>And your child completely ignores you?</p>
            <p>Most parents think their child is being stubborn.</p>
            <p className="font-bold text-[#191c1e]">But what if the real reason is something else?</p>
          </div>
        </div>
      )}

      {/* SCREEN 2 */}
      {currentStep === 1 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#006a62]/10" text="text-[#006a62]">
            <Brain size={48} />
          </IllustrationBlock>
          <h2 className="text-2xl font-bold text-[#006a62] mb-6">Meet Rahul</h2>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Every day Rahul hears:</p>
            <div className="bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm text-sm font-semibold text-[#006a62] grid grid-cols-2 gap-2">
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Wake up.</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Brush your teeth.</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Eat quickly.</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Finish homework.</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Don't watch TV.</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Go to sleep.</span>
            </div>
            <p>His mother is trying to help.</p>
            <p className="font-bold text-[#191c1e]">But Rahul feels overwhelmed.</p>
          </div>
        </div>
      )}

      {/* SCREEN 3 */}
      {currentStep === 2 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#ba1a1a]/10" text="text-[#ba1a1a]">
            <ShieldCheck size={48} />
          </IllustrationBlock>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Imagine someone giving you instructions all day.</p>
            <p>Even adults would feel frustrated.</p>
            <p className="font-bold text-[#141779] text-xl py-4">Children feel the same way.</p>
            <p>Many children stop listening not because they are bad.</p>
            <div className="bg-[#141779]/5 p-5 rounded-2xl border border-[#141779]/20 text-[#141779] font-bold">
              They stop listening because they hear too many commands and too few conversations.
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 4 */}
      {currentStep === 3 && (
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-[#141779] mb-8 text-center">Which approach feels better?</h2>
          <div className="space-y-4 mb-8">
            <button onClick={() => handleOptionSelect('A')} className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selectedOption === 'A' ? 'border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]' : 'border-[#c7c5d4]/50 bg-white hover:border-[#141779]/30'}`}>
              <span className="font-bold block mb-1">Option A:</span>
              <span className="text-lg">"Go study now."</span>
            </button>
            <button onClick={() => handleOptionSelect('B')} className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selectedOption === 'B' || showFeedback ? 'border-[#006a62] bg-[#57fae9]/20 text-[#006a62]' : 'border-[#c7c5d4]/50 bg-white hover:border-[#141779]/30'}`}>
              <span className="font-bold block mb-1">Option B:</span>
              <span className="text-lg">"Can we study together for 10 minutes?"</span>
            </button>
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${showFeedback ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#006a62] text-white p-5 rounded-2xl shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#57fae9]">
                <CheckCircle size={24} fill="currentColor" className="text-white" />
                <h3 className="font-bold text-xl">Correct!</h3>
              </div>
              <p className="text-white/90 font-medium">One feels like an order. The other feels like teamwork.</p>
              <p className="font-bold">Children cooperate more when they feel respected.</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5 */}
      {currentStep === 4 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#30007f]/10" text="text-[#30007f]">
            <Volume2 size={48} />
          </IllustrationBlock>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Another common mistake is <span className="font-bold text-[#30007f]">repetition</span>.</p>
            <p>Many parents repeat the same instruction 5 or 6 times.</p>
            <p className="mt-8 mb-2 text-sm text-[#767683] uppercase tracking-widest font-bold">What children learn:</p>
            <div className="bg-[#f2f4f6] p-6 rounded-2xl border-l-4 border-[#30007f] font-bold text-xl text-[#30007f] italic">
              "I don't need to respond the first time."
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6 */}
      {currentStep === 5 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#006a62]/10" text="text-[#006a62]">
            <UserCheck size={48} />
          </IllustrationBlock>
          <h2 className="text-2xl font-bold text-[#006a62] mb-6">Instead:</h2>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#006a62]/10 flex items-center justify-center text-[#006a62]"><Check size={16} /></div>
              <span className="font-bold text-lg text-[#191c1e]">Make eye contact.</span>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#006a62]/10 flex items-center justify-center text-[#006a62]"><Check size={16} /></div>
              <span className="font-bold text-lg text-[#191c1e]">Move closer.</span>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#006a62]/10 flex items-center justify-center text-[#006a62]"><Check size={16} /></div>
              <span className="font-bold text-lg text-[#191c1e]">Speak calmly.</span>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#006a62]/10 flex items-center justify-center text-[#006a62]"><Check size={16} /></div>
              <span className="font-bold text-lg text-[#191c1e]">Say it once.</span>
            </div>
          </div>
          <p className="text-xl font-bold text-[#141779]">A calm voice often works better than a loud voice.</p>
        </div>
      )}

      {/* SCREEN 7 */}
      {currentStep === 6 && (
        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-[#141779] to-[#30007f] p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h2 className="text-sm font-bold text-[#57fae9] tracking-widest uppercase mb-2">Today's Parent Mission</h2>
            <p className="text-2xl font-bold mb-6">Replace one command with one conversation.</p>
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                <p className="text-sm text-white/70 font-bold mb-1">Instead of:</p>
                <p className="text-lg font-bold">"Do your homework."</p>
              </div>
              <div className="bg-[#57fae9]/20 border border-[#57fae9]/50 p-4 rounded-xl backdrop-blur-md">
                <p className="text-sm text-[#57fae9] font-bold mb-1">Try:</p>
                <p className="text-lg font-bold text-white">"What is the first thing you need to finish today?"</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={() => setMissionAccepted(!missionAccepted)} className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${missionAccepted ? 'border-[#006a62] bg-[#006a62]/10' : 'border-[#c7c5d4]/50 bg-white'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${missionAccepted ? 'bg-[#006a62] text-white' : 'bg-[#e0e3e5] text-[#767683]'}`}>
                {missionAccepted && <Check size={18} />}
              </div>
              <span className={`font-bold text-lg ${missionAccepted ? 'text-[#006a62]' : 'text-[#464652]'}`}>I will try this today.</span>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-1"><Star size={20} fill="currentColor" /></div>
              <span className="text-xs font-bold text-[#464652]">+20 XP</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#141779] mb-1"><BookOpen size={20} fill="currentColor" /></div>
              <span className="text-xs font-bold text-[#464652]">+1 Lesson</span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 8 */}
      {currentStep === 7 && (
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto relative mb-6">
            <div className="absolute inset-0 bg-[#006a62] rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 bg-[#57fae9] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(87,250,233,0.5)]">
              <CheckCircle size={64} className="text-[#006a62]" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#141779] mb-4">Great job!</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c7c5d4]/30 mb-8 inline-block">
            <p className="text-lg font-bold text-[#464652] mb-2">Parenting is not about controlling children.</p>
            <p className="text-xl font-bold text-[#006a62]">It's about connecting with them.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#141779]/5 rounded-2xl p-4 flex flex-col items-center">
              <Star className="text-[#141779] mb-2" size={28} fill="currentColor" />
              <span className="text-xl font-bold text-[#141779]">+20 XP</span>
              <span className="text-xs text-[#767683] uppercase font-bold tracking-wider">Earned</span>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center">
              <Flame className="text-orange-500 mb-2" size={28} fill="currentColor" />
              <span className="text-xl font-bold text-orange-600">6 Days</span>
              <span className="text-xs text-[#767683] uppercase font-bold tracking-wider">Streak</span>
            </div>
          </div>
          <div className="bg-[#f2f4f6] rounded-2xl p-4 text-left border border-[#c7c5d4]/30">
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2">Next Lesson Preview</p>
            <p className="font-bold text-[#191c1e]">The 5-Second Pause Technique Before Reacting in Anger</p>
          </div>
        </div>
      )}
    </>
  );

  const renderFocusLesson = () => (
    <>
      {/* SCREEN 1 */}
      {currentStep === 0 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#141779]/10" text="text-[#141779]">
            <Search size={48} />
          </IllustrationBlock>
          <h2 className="text-2xl font-bold text-[#141779] mb-6">The Focus Struggle</h2>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Does your child start studying...</p>
            <div className="bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm space-y-2 font-semibold text-[#141779] italic text-left pl-6">
              <ul className="list-disc space-y-2">
                <li>Then suddenly look at toys?</li>
                <li>Look outside the window?</li>
                <li>Ask random questions?</li>
                <li>Or get distracted within minutes?</li>
              </ul>
            </div>
            <p>Many parents think:</p>
            <p className="font-bold text-[#191c1e]">"My child cannot focus."</p>
            <p className="font-bold text-[#ba1a1a]">But the truth may surprise you.</p>
          </div>
        </div>
      )}

      {/* SCREEN 2 */}
      {currentStep === 1 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#006a62]/10" text="text-[#006a62]">
            <MonitorOff size={48} />
          </IllustrationBlock>
          <h2 className="text-2xl font-bold text-[#006a62] mb-6">Meet Aarav</h2>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Every evening his mother tells him to study.</p>
            <p>But within minutes:</p>
            <div className="bg-white p-4 rounded-xl border border-[#c7c5d4]/40 shadow-sm text-sm font-semibold text-[#006a62] grid grid-cols-2 gap-2">
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Looks at TV</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Checks toys</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Water bottle</span>
              <span className="bg-[#f2f4f6] py-2 rounded-lg">Forgets study</span>
            </div>
            <p>His mother thinks:</p>
            <p className="font-bold text-[#191c1e]">"Aarav never focuses."</p>
          </div>
        </div>
      )}

      {/* SCREEN 3 */}
      {currentStep === 2 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#ba1a1a]/10" text="text-[#ba1a1a]">
            <Volume2 size={48} />
          </IllustrationBlock>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Imagine trying to read a book in the middle of a busy road.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-white px-3 py-1 rounded shadow-sm text-sm font-bold text-[#141779]">Cars passing.</span>
              <span className="bg-white px-3 py-1 rounded shadow-sm text-sm font-bold text-[#141779]">People talking.</span>
              <span className="bg-white px-3 py-1 rounded shadow-sm text-sm font-bold text-[#141779]">Horns.</span>
            </div>
            <p className="font-bold text-[#ba1a1a] text-xl py-2">Difficult, right?</p>
            <p>That's how many children feel when there are too many distractions around them.</p>
            <div className="bg-[#141779]/5 p-5 rounded-2xl border border-[#141779]/20 text-[#141779] font-bold">
              Focus is not only about the child. The environment matters too.
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 4 */}
      {currentStep === 3 && (
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-[#141779] mb-8 text-center">Which study environment helps focus?</h2>
          <div className="space-y-4 mb-8">
            <button onClick={() => handleOptionSelect('A')} className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selectedOption === 'A' ? 'border-[#ba1a1a] bg-[#ffdad6] text-[#ba1a1a]' : 'border-[#c7c5d4]/50 bg-white hover:border-[#141779]/30'}`}>
              <span className="font-bold block mb-2">Option A:</span>
              <ul className="list-disc pl-5 font-medium space-y-1">
                <li>TV ON</li>
                <li>Mobile Nearby</li>
                <li>Toys Visible</li>
              </ul>
            </button>
            <button onClick={() => handleOptionSelect('B')} className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selectedOption === 'B' || showFeedback ? 'border-[#006a62] bg-[#57fae9]/20 text-[#006a62]' : 'border-[#c7c5d4]/50 bg-white hover:border-[#141779]/30'}`}>
              <span className="font-bold block mb-2">Option B:</span>
              <ul className="list-disc pl-5 font-medium space-y-1">
                <li>Quiet Space</li>
                <li>Mobile Away</li>
                <li>Clean Desk</li>
              </ul>
            </button>
          </div>
          <div className={`transition-all duration-500 overflow-hidden ${showFeedback ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-[#006a62] text-white p-5 rounded-2xl shadow-lg flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#57fae9]">
                <CheckCircle size={24} fill="currentColor" className="text-white" />
                <h3 className="font-bold text-xl">Correct!</h3>
              </div>
              <p className="text-white/90 font-medium">Children focus better when distractions are reduced.</p>
              <p className="font-bold">A focused environment creates focused behavior.</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5 */}
      {currentStep === 4 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#30007f]/10" text="text-[#30007f]">
            <Clock size={48} />
          </IllustrationBlock>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <p>Many parents make another common mistake.</p>
            <div className="bg-[#f2f4f6] p-6 rounded-2xl border-l-4 border-[#ba1a1a] font-bold text-[#ba1a1a]">
              They expect children to focus for too long.
            </div>
            <p>Imagine asking a beginner runner to run a marathon.</p>
            <p className="font-bold text-[#30007f] text-xl py-4">Children build focus gradually. Not instantly.</p>
          </div>
        </div>
      )}

      {/* SCREEN 6 */}
      {currentStep === 5 && (
        <div className="text-center">
          <IllustrationBlock bg="bg-[#006a62]/10" text="text-[#006a62]">
            <CheckCircle size={48} />
          </IllustrationBlock>
          <h2 className="text-2xl font-bold text-[#006a62] mb-6">Try the 10-Minute Focus Rule.</h2>
          <div className="space-y-4 text-[#464652] text-lg font-medium leading-relaxed">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c7c5d4]/40 text-left">
              <p className="text-xs text-[#767683] font-bold uppercase mb-1">Instead of saying:</p>
              <p className="font-bold text-[#ba1a1a]">"Study for one hour."</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#006a62]/40 text-left">
              <p className="text-xs text-[#006a62] font-bold uppercase mb-1">Say:</p>
              <p className="font-bold text-[#006a62]">"Let's focus for just 10 minutes."</p>
            </div>
            <p className="text-xl font-bold text-[#141779] mt-6">Small wins feel achievable. And success builds confidence.</p>
          </div>
        </div>
      )}

      {/* SCREEN 7 */}
      {currentStep === 6 && (
        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-[#141779] to-[#30007f] p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <h2 className="text-sm font-bold text-[#57fae9] tracking-widest uppercase mb-2">Today's Parent Mission</h2>
            <p className="text-2xl font-bold mb-6">Create a 10-minute distraction-free study session.</p>
            <div className="space-y-3 relative z-10 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
              <h3 className="font-bold text-white/80 text-sm uppercase tracking-wider mb-2">Steps:</h3>
              <div className="flex items-start gap-3"><Check size={20} className="text-[#57fae9] mt-0.5" /><span className="font-bold">Remove mobile phones</span></div>
              <div className="flex items-start gap-3"><Check size={20} className="text-[#57fae9] mt-0.5" /><span className="font-bold">Clear unnecessary items</span></div>
              <div className="flex items-start gap-3"><Check size={20} className="text-[#57fae9] mt-0.5" /><span className="font-bold">Set a 10-minute timer</span></div>
              <div className="flex items-start gap-3"><Check size={20} className="text-[#57fae9] mt-0.5" /><span className="font-bold">Encourage effort, not perfection</span></div>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={() => setMissionAccepted(!missionAccepted)} className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${missionAccepted ? 'border-[#006a62] bg-[#006a62]/10' : 'border-[#c7c5d4]/50 bg-white'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${missionAccepted ? 'bg-[#006a62] text-white' : 'bg-[#e0e3e5] text-[#767683]'}`}>
                {missionAccepted && <Check size={18} />}
              </div>
              <span className={`font-bold text-lg ${missionAccepted ? 'text-[#006a62]' : 'text-[#464652]'}`}>I will try this today.</span>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-1"><Star size={20} fill="currentColor" /></div>
              <span className="text-xs font-bold text-[#464652]">+20 XP</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#141779] mb-1"><BookOpen size={20} fill="currentColor" /></div>
              <span className="text-xs font-bold text-[#464652]">+1 Lesson</span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 8 */}
      {currentStep === 7 && (
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto relative mb-6">
            <div className="absolute inset-0 bg-[#006a62] rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 bg-[#57fae9] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(87,250,233,0.5)]">
              <CheckCircle size={64} className="text-[#006a62]" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#141779] mb-4">Great job!</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c7c5d4]/30 mb-8 inline-block">
            <p className="text-lg font-bold text-[#464652] mb-2">Children are not born with strong focus.</p>
            <p className="text-xl font-bold text-[#006a62]">Focus grows with practice, environment, and encouragement.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#141779]/5 rounded-2xl p-4 flex flex-col items-center">
              <Star className="text-[#141779] mb-2" size={28} fill="currentColor" />
              <span className="text-xl font-bold text-[#141779]">+20 XP</span>
              <span className="text-xs text-[#767683] uppercase font-bold tracking-wider">Earned</span>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center">
              <Flame className="text-orange-500 mb-2" size={28} fill="currentColor" />
              <span className="text-xl font-bold text-orange-600">6 Days</span>
              <span className="text-xs text-[#767683] uppercase font-bold tracking-wider">Streak</span>
            </div>
          </div>
          <div className="bg-[#f2f4f6] rounded-2xl p-4 text-left border border-[#c7c5d4]/30">
            <p className="text-xs font-bold text-[#767683] uppercase tracking-wider mb-2">Next Lesson Preview</p>
            <p className="font-bold text-[#191c1e]">Why Rewards Work Better Than Constant Reminders</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="bg-[#f7f9fb] min-h-screen font-sans text-[#191c1e] flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#141779]/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#006a62]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Progress Header */}
      <header className="px-5 py-4 pt-6 flex items-center gap-4 relative z-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#e0e3e5] rounded-full transition-colors">
          <X size={24} className="text-[#464652]" />
        </button>
        <div className="flex-1 h-3 bg-[#e0e3e5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#006a62] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-32 flex flex-col justify-center relative z-10">
        <div className={`transition-all duration-300 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          {lessonId === 'listening' ? renderListeningLesson() : renderFocusLesson()}
        </div>
      </main>

      {/* Bottom Fixed Navigation */}
      <footer className="fixed bottom-0 w-full p-5 bg-[rgba(247,249,251,0.95)] backdrop-blur-md border-t border-[#c7c5d4]/30 z-50">
        {currentStep === 3 ? (
          <button 
            onClick={nextStep}
            disabled={!showFeedback}
            className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${showFeedback ? 'bg-[#006a62] text-white hover:bg-[#00524c] active:scale-95' : 'bg-[#e0e3e5] text-[#767683] cursor-not-allowed'}`}
          >
            Continue
          </button>
        ) : currentStep === 6 ? (
          <button 
            onClick={nextStep}
            disabled={!missionAccepted}
            className={`w-full py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg ${missionAccepted ? 'bg-[#141779] text-white hover:bg-[#0f1159] active:scale-95' : 'bg-[#e0e3e5] text-[#767683] cursor-not-allowed'}`}
          >
            Complete Lesson
          </button>
        ) : currentStep === 7 ? (
          <button 
            onClick={() => navigate('/parent/lessons')}
            className="w-full bg-[#141779] text-white py-4 rounded-full font-bold text-lg flex justify-center items-center shadow-lg shadow-[#141779]/30 active:scale-95 transition-transform"
          >
            Continue Learning
          </button>
        ) : (
          <button 
            onClick={nextStep}
            className="w-full bg-[#141779] text-white py-4 rounded-full font-bold text-lg flex justify-center items-center shadow-lg shadow-[#141779]/30 active:scale-95 transition-transform"
          >
            {currentStep === 0 ? "Continue" : "Next"}
          </button>
        )}
      </footer>

    </div>
  );
}
