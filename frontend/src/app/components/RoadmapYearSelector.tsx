import React from "react";
import { Layers } from "lucide-react";
import { YearLevelRoadmap } from "../../data/studyRoadmapData";
import { GlassSurface, GlassBadge } from "./ui/LiquidGlass";

interface RoadmapYearSelectorProps {
  years: YearLevelRoadmap[];
  selectedYear: 1 | 2 | 3 | 4;
  onSelectYear: (year: 1 | 2 | 3 | 4) => void;
}

export default function RoadmapYearSelector({
  years,
  selectedYear,
  onSelectYear,
}: RoadmapYearSelectorProps) {
  const stageNames = [
    { year: 1 as const, stage: "Stage 01", title: "Foundations", sub: "Logic & Tools", icon: "🌱" },
    { year: 2 as const, stage: "Stage 02", title: "Core CS", sub: "DSA, OS & DBMS", icon: "⚡" },
    { year: 3 as const, stage: "Stage 03", title: "Advanced Systems", sub: "Design & Cloud", icon: "🚀" },
    { year: 4 as const, stage: "Stage 04", title: "Placement Mastery", sub: "FAANG & Capstone", icon: "🏆" },
  ];

  return (
    <GlassSurface level={2} className="p-4.5 space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <GlassBadge
            label="Academic Progression Stages"
            variant="primary"
            icon={<Layers size={12} className="text-[#4E7D63]" />}
          />
          <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] hidden sm:inline font-mono">Continuous 4-Year Journey</span>
        </div>
        <span className="text-[11px] font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono bg-[#EDF4F0] dark:bg-[#1E2F26] px-2.5 py-0.5 rounded-full border border-[rgba(78,125,99,0.3)]">
          Year {selectedYear} Active
        </span>
      </div>

      {/* Connected Stage Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stageNames.map((stageItem) => {
          const yearPlan = years.find((y) => y.year === stageItem.year);
          const isSelected = selectedYear === stageItem.year;
          const completedTopics = yearPlan?.completedTopics || 0;
          const totalTopics = yearPlan?.totalTopics || 1;
          const pct = Math.round((completedTopics / totalTopics) * 100);

          return (
            <button
              key={stageItem.year}
              onClick={() => onSelectYear(stageItem.year)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? "bg-[#FAF8F5] dark:bg-[#203429] border-[#4E7D63] shadow-sm ring-1 ring-[#4E7D63]/30"
                  : "bg-[#F2EFE9] dark:bg-[#17241D] hover:bg-[#EAE6DE] dark:hover:bg-[#1C2C23] border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] text-[#556B5F] dark:text-[#95AFA1] hover:text-[#1C2E24] dark:hover:text-[#F4F7F5]"
              }`}
            >
              {/* Top Row: Stage & Icon */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-[#1C2E24] dark:bg-[#4E7D63] text-[#FBFBF9]"
                      : "bg-[#E8E4DC] dark:bg-[#1D2E24] text-[#556B5F] dark:text-[#95AFA1]"
                  }`}
                >
                  {stageItem.stage}
                </span>
                <span className="text-base">{stageItem.icon}</span>
              </div>

              {/* Middle Row: Title & Subtitle */}
              <div>
                <h4
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? "text-[#1C2E24] dark:text-[#F4F7F5]" : "text-[#1C2E24]/90 dark:text-[#F4F7F5]/90"
                  }`}
                >
                  Year {stageItem.year}: {stageItem.title}
                </h4>
                <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] truncate font-mono">{stageItem.sub}</p>
              </div>

              {/* Bottom Row: Progress Bar */}
              <div className="space-y-1 pt-1 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)]">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#556B5F] dark:text-[#95AFA1]">
                  <span>{completedTopics}/{totalTopics} topics</span>
                  <span className="font-semibold text-[#1C2E24] dark:text-[#F4F7F5]">{pct}%</span>
                </div>
                <div className="h-1.5 bg-[#E8E4DC] dark:bg-[#1D2E24] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct === 100 ? "bg-[#3B624E]" : isSelected ? "bg-[#4E7D63]" : "bg-[#7C9184]/40"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </GlassSurface>
  );
}
