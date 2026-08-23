import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { RoadmapTopic } from "../../data/studyRoadmapData";
import { TopicMastery } from "../../data/studentIntelligence";
import { GlassBadge, GlassButton } from "./ui/LiquidGlass";

interface RoadmapMilestoneNodeProps {
  topic: RoadmapTopic;
  index: number;
  mastery?: TopicMastery;
  isSelected?: boolean;
  onSelectMilestone: (topic: RoadmapTopic) => void;
  onLaunchQuiz: (topicId: string, topicName: string) => void;
}

export default function RoadmapMilestoneNode({
  topic,
  index,
  mastery,
  isSelected,
  onSelectMilestone,
  onLaunchQuiz,
}: RoadmapMilestoneNodeProps) {
  const masteryScore = mastery ? mastery.masteryScore : topic.progressPct;
  const status = mastery?.status || (masteryScore >= 80 ? "STRONG" : masteryScore >= 60 ? "AVERAGE" : "WEAK");
  const isCompleted = masteryScore >= 80 || topic.status === "completed";
  const isRevisionDue = mastery?.nextRevisionDue === "TODAY";
  const isNeedsPractice = status === "CRITICAL" || status === "WEAK";

  // Visual status styles in the natural palette
  let nodeBorderColor = "border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.1)]";
  let nodeBg = "bg-[#F2EFE9] dark:bg-[#17241D]";
  let iconContent = <span className="font-bold text-xs text-[#1C2E24] dark:text-[#F4F7F5]">{index + 1}</span>;
  let statusBadgeVariant: "success" | "warning" | "danger" | "primary" | "default" = "default";
  let statusLabel = "In Progress";

  if (isCompleted) {
    nodeBorderColor = "border-[rgba(78,125,99,0.4)]";
    nodeBg = "bg-[#EDF4F0] dark:bg-[#1E2F26]";
    iconContent = <CheckCircle2 size={18} className="text-[#4E7D63] dark:text-[#6E9B82]" />;
    statusBadgeVariant = "success";
    statusLabel = "Mastered ✓";
  } else if (isRevisionDue) {
    nodeBorderColor = "border-[rgba(140,83,43,0.35)]";
    nodeBg = "bg-[#FAF2EB] dark:bg-[#28211A]";
    iconContent = <RotateCcw size={16} className="text-[#8C532B] dark:text-[#D49E78] animate-spin-slow" />;
    statusBadgeVariant = "warning";
    statusLabel = "Revision Due";
  } else if (isNeedsPractice) {
    nodeBorderColor = "border-[rgba(158,77,59,0.35)]";
    nodeBg = "bg-[#F9EBE8] dark:bg-[#281B18]";
    iconContent = <AlertTriangle size={16} className="text-[#9E4D3B] dark:text-[#E28876]" />;
    statusBadgeVariant = "danger";
    statusLabel = "Needs Practice";
  } else {
    nodeBorderColor = "border-[#4E7D63]/40";
    nodeBg = "bg-[#EDF4F0] dark:bg-[#1E2F26]";
    iconContent = <span className="font-bold text-xs text-[#4E7D63] dark:text-[#6E9B82]">{index + 1}</span>;
    statusBadgeVariant = "primary";
    statusLabel = "Active Node";
  }

  return (
    <div
      onClick={() => onSelectMilestone(topic)}
      className={`group relative rounded-2xl border transition-all duration-150 cursor-pointer p-4 ${
        isSelected
          ? "bg-[#FAF8F5] dark:bg-[#203429] border-[#4E7D63] shadow-sm ring-1 ring-[#4E7D63]/30"
          : "bg-[#F2EFE9] dark:bg-[#17241D] hover:bg-[#EAE6DE] dark:hover:bg-[#1C2C23] border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] shadow-2xs"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Milestone Node Checkpoint */}
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${nodeBg} ${nodeBorderColor}`}
        >
          {iconContent}
        </div>

        {/* Milestone Meta & Information */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <GlassBadge label={topic.category} variant="primary" />
            <GlassBadge label={statusLabel} variant={statusBadgeVariant} />
          </div>

          <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5] truncate group-hover:text-[#4E7D63] transition-colors">
            {topic.title}
          </h3>

          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] line-clamp-2 leading-relaxed">
            {topic.description}
          </p>

          {/* Difficulty Levels Stepper Indicators */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)]">
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-[#556B5F] dark:text-[#95AFA1] font-mono text-[9px] uppercase tracking-wider">Tiers:</span>
              {topic.subtopics.map((sub, sIdx) => {
                const diffBadge: Record<string, string> = {
                  Easy: "text-[#3B624E] bg-[#EDF4F0] border-[rgba(78,125,99,0.3)]",
                  Medium: "text-[#8C532B] bg-[#FAF2EB] border-[rgba(140,83,43,0.3)]",
                  Hard: "text-[#9E4D3B] bg-[#F9EBE8] border-[rgba(158,77,59,0.3)]",
                };
                return (
                  <span
                    key={sIdx}
                    className={`px-1.5 py-0.2 rounded font-semibold text-[9px] border font-mono ${diffBadge[sub.difficulty] || "bg-[#EAE6DE]"}`}
                  >
                    {sub.difficulty[0]}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#1C2E24] dark:text-[#F4F7F5]">
                {masteryScore}%
              </span>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onLaunchQuiz(topic.id, topic.title);
                }}
              >
                <Play size={10} fill="currentColor" />
                <span>Quiz</span>
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
