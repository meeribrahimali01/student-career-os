import React from "react";
import { Sparkles, Target, ArrowRight, Clock, RotateCcw, Play } from "lucide-react";
import { NextBestAction } from "../../data/studentIntelligence";
import { GlassSurface, GlassBadge, GlassButton } from "./ui/LiquidGlass";

interface NextBestActionBannerProps {
  action?: NextBestAction;
  onLaunchQuiz: (topicId: string, topicName: string) => void;
}

export default function NextBestActionBanner({ action, onLaunchQuiz }: NextBestActionBannerProps) {
  if (!action) {
    return (
      <GlassSurface level={2} className="p-4.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.3)] text-[#4E7D63] dark:text-[#6E9B82] flex items-center justify-center shadow-xs flex-shrink-0">
            <Target size={18} />
          </div>
          <div>
            <GlassBadge label="Next Milestone" variant="primary" />
            <h3 className="text-xs font-bold text-[#1C2E24] dark:text-[#F4F7F5] mt-0.5">Explore Learning Path Milestones Below</h3>
            <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Select any topic along the journey path to begin practicing questions.</p>
          </div>
        </div>
      </GlassSurface>
    );
  }

  const isRevision = action.category === "Revision" || action.urgency === "CRITICAL";

  return (
    <GlassSurface
      level={3}
      glow={isRevision ? "critical" : "medium"}
      className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
    >
      <div className="flex items-start gap-3.5 relative z-10">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-[#FBFBF9] shadow-xs flex-shrink-0 ${
            isRevision ? "bg-[#9E4D3B] border border-[#9E4D3B]/30" : "bg-[#1C2E24] dark:bg-[#203429] border border-[#1C2E24]/20"
          }`}
        >
          {isRevision ? <RotateCcw size={18} className="animate-spin-slow" /> : <Sparkles size={18} className="text-[#6E9B82]" />}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GlassBadge
              label={isRevision ? "Priority Revision Due" : "Recommended Next Action"}
              variant={isRevision ? "danger" : "primary"}
            />
            <span className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] flex items-center gap-1 font-mono font-medium">
              <Clock size={11} className="text-[#4E7D63]" /> ~{action.estimatedMinutes} mins
            </span>
          </div>

          <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{action.title}</h3>
          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] max-w-2xl leading-relaxed">{action.reason}</p>
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0 self-end sm:self-center">
        <GlassButton
          variant={isRevision ? "danger" : "primary"}
          size="md"
          onClick={() => {
            const topicId = action.targetPayload?.topicId || "graphs";
            const topicName = action.title.replace("Practice ", "").replace("Review ", "");
            onLaunchQuiz(topicId, topicName);
          }}
        >
          <Play size={12} fill="currentColor" />
          <span>{isRevision ? "Revise Now" : "Practice Next"}</span>
          <ArrowRight size={12} />
        </GlassButton>
      </div>
    </GlassSurface>
  );
}
