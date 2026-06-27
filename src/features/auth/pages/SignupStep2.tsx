import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Rocket, X, Sparkles, UserRound, GraduationCap, Cake, ChevronDown, Check, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CustomDropdown = ({ label, icon: Icon, iconColor, value, options, onSelect, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 flex-1 relative">
      <label className="text-sm font-semibold text-[#767683] ml-4">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 bg-[rgba(255,255,255,0.5)] rounded-full pl-12 pr-10 text-base font-medium text-[#191c1e] border-2 border-white flex items-center justify-start text-left relative"
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
                <h3 className="text-xl font-bold text-[#141779] mb-4 text-center">Select {label}</h3>
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

export default function SignupStep2Screen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [childName, setChildName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [age, setAge] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");

  const classes = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
  const ages = ["4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years"];
  const boards = ["CBSE (NCERT)", "ICSE", "State Board", "IB", "IGCSE"];

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set("childName", childName);
    params.set("selectedClass", selectedClass);
    params.set("age", age);
    params.set("board", selectedBoard);
    navigate(`/signup-step3?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0e0ff] to-[#e8ddff] font-sans relative pb-10 overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="absolute top-[25%] right-4 opacity-15 rotate-12 pointer-events-none">
        <Sparkles size={120} color="#006a62" />
      </div>
      <div className="absolute bottom-[25%] left-4 opacity-15 -rotate-12 pointer-events-none">
        <Rocket size={80} color="#30007f" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[rgba(255,255,255,0.8)] border-b border-[rgba(255,255,255,0.2)] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Rocket size={28} color="#141779" />
          <h1 className="text-[22px] font-bold text-[#141779] tracking-[-0.5px]">Studysaathy</h1>
        </div>
        <button type="button" onClick={() => navigate("/signup-step1")} className="p-2 hover:bg-gray-100 rounded-full transition-colors z-50">
          <X size={24} color="#767683" />
        </button>
      </header>

      <main className="px-6 pt-8 flex flex-col items-center w-full max-w-[430px] mx-auto relative z-10">
        
        {/* Step Indicator */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#006a62] tracking-[1px]">STEP 2 OF 3</span>
            <span className="text-xs font-bold text-[#767683]">66%</span>
          </div>
          <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
            <div className="h-full bg-[#57fae9] rounded-full w-[66%]" />
          </div>
        </div>

        {/* Glass Content Card */}
        <div className="w-full bg-[rgba(255,255,255,0.7)] rounded-3xl p-6 border-[1.5px] border-white shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
          
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-[28px] font-bold text-[#141779] mb-2 text-center">Who's Exploring?</h2>
            <p className="text-base text-[#464652] font-medium text-center">
              Tell us about your child to personalize their learning journey.
            </p>
          </div>

          <form className="flex flex-col gap-5 mb-6" onSubmit={(e) => e.preventDefault()}>
            
            {/* Child's Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#767683] ml-4">Child's Explorer Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="e.g. Leo Star"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full h-14 bg-[rgba(255,255,255,0.5)] rounded-full pl-12 pr-6 text-base font-medium text-[#191c1e] border-2 border-white focus:outline-none focus:border-[#141779] transition-colors placeholder:text-[#c7c5d4]"
                />
                <UserRound size={22} color="#006a62" className="absolute left-4" />
              </div>
            </div>

            {/* Board Selection */}
            <div className="flex flex-col gap-2">
              <CustomDropdown
                label="Education Board"
                icon={BookOpen}
                iconColor="#006a62"
                value={selectedBoard}
                options={boards}
                onSelect={setSelectedBoard}
                placeholder="Select Board"
              />
            </div>

            {/* Row for Class & Age */}
            <div className="flex gap-3">
              <CustomDropdown
                label="Class/Grade"
                icon={GraduationCap}
                iconColor="#30007f"
                value={selectedClass}
                options={classes}
                onSelect={setSelectedClass}
                placeholder="Select"
              />
              <CustomDropdown
                label="Age"
                icon={Cake}
                iconColor="#141779"
                value={age}
                options={ages}
                onSelect={setAge}
                placeholder="Select"
              />
            </div>
            
          </form>

          {/* Primary Action */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!childName || !selectedClass || !age || !selectedBoard}
            className={`w-full h-14 bg-[#141779] rounded-full flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(20,23,121,0.3)] transition-opacity ${(!childName || !selectedClass || !age || !selectedBoard) ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            <span className="text-white text-lg font-semibold">Almost There</span>
            <Rocket size={22} color="white" />
          </button>
        </div>

        {/* Decorative Astronaut Image Badge */}
        <div className="mt-8 flex items-center gap-4 px-6 py-3 bg-[rgba(42,221,205,0.15)] rounded-full border border-[rgba(255,255,255,0.4)]">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO0uywXKeZFaBqTF0zxGYLlyFO5nR80YlXpDdDN-LCQQy02I46kxfNyZ_ABhaGtIpEj0rOByCUZ_exo_fZrWr1cMy6PDImMjt5Sb8TrJPYa8qz8QeYsSdo-0OwIMhnONQQfJUiM-qKOfYsDC6_TtusgxaiiYmoLaoCJzmQ1dIIKpgT_33IqngfJSAgfBPjexpOA7XmxxMUzeygwSz2xTNeeQmgK1GLBr1GKslEWUMfqNpVqmFJlUKqXLQgbyey9OnEtMGqDdBW-g" 
            alt="Astronaut Badge"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <span className="text-sm font-semibold text-[#005049] flex-1">
            Your space journey is almost ready!
          </span>
        </div>

      </main>
    </div>
  );
}
