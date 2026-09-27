import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rocket,
  ServerOff,
  ShieldAlert,
  WifiOff,
  Clock,
  AlertTriangle,
  ArrowLeft,
  RotateCw,
  LogIn,
} from "lucide-react";

export type ErrorStatusCode = 404 | 500 | 502 | 503 | 401 | 403 | 429 | "offline" | "404" | "500" | "401" | "403" | "offline" | number | string;

export interface UniversalErrorScreenProps {
  statusCode?: ErrorStatusCode;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onHome?: () => void;
  onLogin?: () => void;
  showHomeButton?: boolean;
  customIcon?: React.ReactNode;
  className?: string;
}

interface ErrorConfig {
  codeDisplay: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionIcon: React.ReactNode;
  primaryActionType: "retry" | "home" | "login" | "reconnect";
  showSecondaryHome: boolean;
}

const getErrorConfig = (statusCode?: ErrorStatusCode): ErrorConfig => {
  const codeStr = String(statusCode || "404").toLowerCase();

  if (codeStr === "404") {
    return {
      codeDisplay: "404",
      icon: <Rocket size={48} color="#141779" strokeWidth={1.8} />,
      title: "404 - Page Not Found",
      description: "Looks like this page got lost in space. Let’s get you back on track.",
      primaryActionLabel: "Back to Home",
      primaryActionIcon: <ArrowLeft size={20} color="white" />,
      primaryActionType: "home",
      showSecondaryHome: false,
    };
  }

  if (codeStr === "500" || codeStr === "502" || codeStr === "503") {
    return {
      codeDisplay: codeStr,
      icon: <ServerOff size={48} color="#141779" strokeWidth={1.8} />,
      title: "500 - Server is taking a nap.",
      description: "Oops, something went wrong on our end. Our cosmic engineers are on it.",
      primaryActionLabel: "Retry",
      primaryActionIcon: <RotateCw size={20} color="white" />,
      primaryActionType: "retry",
      showSecondaryHome: true,
    };
  }

  if (codeStr === "401" || codeStr === "403") {
    return {
      codeDisplay: codeStr,
      icon: <ShieldAlert size={48} color="#141779" strokeWidth={1.8} />,
      title: "You shall not pass!",
      description: "It seems you don't have permission to view this galaxy. Try logging in.",
      primaryActionLabel: "Login Again",
      primaryActionIcon: <LogIn size={20} color="white" />,
      primaryActionType: "login",
      showSecondaryHome: true,
    };
  }

  if (codeStr === "offline" || codeStr === "0") {
    return {
      codeDisplay: "Offline",
      icon: <WifiOff size={48} color="#141779" strokeWidth={1.8} />,
      title: "Lost Contact.",
      description: "We can't connect to the mothership. Please check your internet connection and try again.",
      primaryActionLabel: "Reconnect",
      primaryActionIcon: <RotateCw size={20} color="white" />,
      primaryActionType: "reconnect",
      showSecondaryHome: true,
    };
  }

  if (codeStr === "429") {
    return {
      codeDisplay: "429",
      icon: <Clock size={48} color="#141779" strokeWidth={1.8} />,
      title: "Slow Down, Space Cowboy.",
      description: "Too many requests in a short time. Take a breath and try again shortly.",
      primaryActionLabel: "Try Again",
      primaryActionIcon: <RotateCw size={20} color="white" />,
      primaryActionType: "retry",
      showSecondaryHome: true,
    };
  }

  return {
    codeDisplay: codeStr,
    icon: <AlertTriangle size={48} color="#141779" strokeWidth={1.8} />,
    title: "An Unexpected Anomaly Occurred",
    description: "Something unexpected happened while navigating the application.",
    primaryActionLabel: "Retry",
    primaryActionIcon: <RotateCw size={20} color="white" />,
    primaryActionType: "retry",
    showSecondaryHome: true,
  };
};

export default function UniversalErrorScreen({
  statusCode = 404,
  title: customTitle,
  description: customDescription,
  onRetry,
  onHome,
  onLogin,
  showHomeButton,
  customIcon,
  className = "",
}: UniversalErrorScreenProps) {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  // Auto-listen to network state changes if status is offline or detected offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const activeStatusCode = !isOnline && statusCode !== 404 ? "offline" : statusCode;
  const config = getErrorConfig(activeStatusCode);

  const displayTitle = customTitle || config.title;
  const displayDescription = customDescription || config.description;
  const displayIcon = customIcon || config.icon;

  const handleHomeClick = () => {
    if (onHome) {
      onHome();
    } else {
      navigate("/home");
    }
  };

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate("/login");
    }
  };

  const handleRetryClick = () => {
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
      setTimeout(() => setIsRetrying(false), 800);
    } else {
      window.location.reload();
    }
  };

  const handlePrimaryAction = () => {
    switch (config.primaryActionType) {
      case "home":
        handleHomeClick();
        break;
      case "login":
        handleLoginClick();
        break;
      case "retry":
      case "reconnect":
        handleRetryClick();
        break;
      default:
        handleHomeClick();
        break;
    }
  };

  const shouldRenderSecondaryHome =
    showHomeButton !== undefined ? showHomeButton : config.showSecondaryHome;

  return (
    <div
      className={`min-h-screen bg-[#f7f9fb] font-sans flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none ${className}`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#141779]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-md w-full"
      >
        {/* Rounded Icon Housing Container matching image aesthetic */}
        <div className="w-24 h-24 bg-[#eceef0] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#e2e5e9] relative transition-transform duration-300 hover:scale-105">
          {displayIcon}
        </div>

        {/* Error Title */}
        <h1 className="text-[32px] font-bold text-[#141779] mb-3 leading-tight tracking-tight">
          {displayTitle}
        </h1>

        {/* Error Description */}
        <p className="text-[#767683] text-lg font-medium mb-8 max-w-md leading-relaxed">
          {displayDescription}
        </p>

        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          {/* Primary Action Button (Large Dark-Blue Pill) */}
          <button
            onClick={handlePrimaryAction}
            className="w-full sm:w-auto min-w-[200px] h-14 px-8 bg-[#141779] text-white rounded-full flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(20,23,121,0.35)] transition-all hover:opacity-90 active:scale-95 font-bold text-lg cursor-pointer"
          >
            <span className={isRetrying ? "animate-spin" : ""}>
              {config.primaryActionIcon}
            </span>
            <span>{config.primaryActionLabel}</span>
          </button>

          {/* Secondary Action Button (Light Grey Pill - Back to Home) */}
          {shouldRenderSecondaryHome && (
            <button
              onClick={handleHomeClick}
              className="w-full sm:w-auto h-14 px-7 bg-[#eceef0] text-[#141779] border border-[#d5d8dc] rounded-full flex items-center justify-center gap-2 hover:bg-[#e2e5e9] transition-all active:scale-95 font-bold text-lg cursor-pointer shadow-sm"
            >
              <ArrowLeft size={20} color="#141779" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Universal React Error Boundary Component
 * Wraps any component tree to catch runtime errors and render the 500 UniversalErrorScreen state cleanly.
 */
export class UniversalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("UniversalErrorBoundary caught a runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <UniversalErrorScreen
          statusCode={500}
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
            window.location.reload();
          }}
        />
      );
    }

    return this.props.children;
  }
}
