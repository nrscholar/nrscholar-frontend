import { useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket } from "lucide-react";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-[#eceef0] rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Rocket size={48} color="#141779" />
      </div>
      
      <h1 className="text-[32px] font-bold text-[#141779] mb-2">404 - Page Not Found</h1>
      <p className="text-[#767683] text-lg font-medium mb-8 max-w-md">
        Oops! Looks like this page got lost in space. Let's get you back on track.
      </p>

      <button
        onClick={() => navigate("/home")}
        className="h-14 px-8 bg-[#141779] rounded-full flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(20,23,121,0.3)] transition-opacity hover:opacity-90"
      >
        <ArrowLeft size={20} color="white" />
        <span className="text-white text-lg font-bold">Back to Home</span>
      </button>
    </div>
  );
}
