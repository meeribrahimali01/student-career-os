import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Zap } from "lucide-react";

interface MeridianLearningRobotProps {
  state: "idle" | "typing" | "authenticating" | "success" | "error";
  message?: string;
  mousePos: { x: number; y: number }; // normalized -0.5 to 0.5
}

export default function MeridianLearningRobot({
  state,
  message,
  mousePos,
}: MeridianLearningRobotProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic Blink Cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Pupil displacement based on normalized mouse position
  const pupilX = Math.max(-4, Math.min(4, mousePos.x * 12));
  const pupilY = Math.max(-3, Math.min(3, mousePos.y * 10));

  // Determine speech bubble text
  const defaultMessages: Record<string, string> = {
    idle: "Ready to launch your learning orbit.",
    typing: "Entering university credentials...",
    authenticating: "Verifying encrypted session...",
    success: "Authentication verified! Initializing orbit...",
    error: "Let's check those credentials again.",
  };

  const activeMessage = message || defaultMessages[state] || defaultMessages.idle;

  return (
    <div className="flex items-center gap-3">
      {/* Robot Head Capsule */}
      <motion.div
        animate={
          state === "authenticating"
            ? { y: [0, -3, 0], rotate: [0, 1, -1, 0] }
            : state === "success"
            ? { y: [0, -5, 0], scale: [1, 1.05, 1] }
            : { y: [0, -2, 0] }
        }
        transition={{
          repeat: state === "authenticating" ? Infinity : 0,
          duration: state === "authenticating" ? 1.2 : 2.5,
          ease: "easeInOut",
        }}
        className="relative w-11 h-11 rounded-xl bg-[#1C2E24] dark:bg-[#1E2F26] border border-[#1C2E24]/20 shadow-xs flex items-center justify-center flex-shrink-0 select-none overflow-hidden"
      >
        {/* Ambient Top Light */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-[#4E7D63]/80" />

        {/* Robot Visor Glass */}
        <div className="w-7 h-4.5 rounded-lg bg-[#0F1A14] border border-[#4E7D63]/30 flex items-center justify-center gap-1.5 px-1 shadow-inner relative overflow-hidden">
          {/* Eye Left */}
          <motion.div
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
              backgroundColor:
                state === "error"
                  ? "#9E4D3B"
                  : state === "success"
                  ? "#4E7D63"
                  : state === "authenticating"
                  ? "#6E9B82"
                  : "#4E7D63",
            }}
            transition={{ duration: 0.12 }}
            style={{
              transform: `translate(${pupilX}px, ${pupilY}px)`,
            }}
            className="w-1.5 h-1.5 rounded-full"
          />

          {/* Eye Right */}
          <motion.div
            animate={{
              scaleY: isBlinking ? 0.1 : 1,
              backgroundColor:
                state === "error"
                  ? "#9E4D3B"
                  : state === "success"
                  ? "#4E7D63"
                  : state === "authenticating"
                  ? "#6E9B82"
                  : "#4E7D63",
            }}
            transition={{ duration: 0.12 }}
            style={{
              transform: `translate(${pupilX}px, ${pupilY}px)`,
            }}
            className="w-1.5 h-1.5 rounded-full"
          />
        </div>

        {/* Antenna Light */}
        <div className="absolute -top-0.5 w-1.5 h-1.5 rounded-full bg-[#4E7D63]" />
      </motion.div>

      {/* Contextual Micro-Dialogue Bubble */}
      <motion.div
        key={state}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15 }}
        className="px-3 py-1 rounded-xl bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] text-xs text-[#1C2E24] dark:text-[#F4F7F5] flex items-center gap-2 shadow-2xs select-none max-w-xs"
      >
        {state === "authenticating" && <RefreshCw size={12} className="text-[#4E7D63] animate-spin" />}
        {state === "success" && <CheckCircle2 size={12} className="text-[#3B624E]" />}
        {state === "error" && <AlertCircle size={12} className="text-[#9E4D3B]" />}
        {state === "idle" && <Sparkles size={12} className="text-[#4E7D63]" />}
        {state === "typing" && <Zap size={12} className="text-[#4E7D63]" />}

        <span className="text-[10px] font-medium leading-tight">{activeMessage}</span>
      </motion.div>
    </div>
  );
}
