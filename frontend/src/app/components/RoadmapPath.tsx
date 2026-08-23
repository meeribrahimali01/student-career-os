import React from "react";
import { Award, Flag } from "lucide-react";
import { RoadmapTopic } from "../../data/studyRoadmapData";
import { TopicMastery } from "../../data/studentIntelligence";
import RoadmapMilestoneNode from "./RoadmapMilestoneNode";

interface RoadmapPathProps {
  yearTitle: string;
  focusTheme: string;
  topics: RoadmapTopic[];
  topicMasteryMap: Record<string, TopicMastery>;
  selectedMilestoneId?: string;
  onSelectMilestone: (topic: RoadmapTopic) => void;
  onLaunchQuiz: (topicId: string, topicName: string) => void;
}

export default function RoadmapPath({
  yearTitle,
  focusTheme,
  topics,
  topicMasteryMap,
  selectedMilestoneId,
  onSelectMilestone,
  onLaunchQuiz,
}: RoadmapPathProps) {
  return (
    <div className="space-y-6">
      {/* Year Path Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{yearTitle}</h2>
          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">{focusTheme}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#556B5F] dark:text-[#95AFA1]">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.3)] text-[#3B624E] dark:text-[#8EB7A0] text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4E7D63]" /> Mastered
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F2EFE9] dark:bg-[#17241D] border border-[rgba(28,46,36,0.15)] text-[#1C2E24] dark:text-[#F4F7F5] text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1C2E24] dark:bg-[#6E9B82]" /> Active
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F9EBE8] dark:bg-[#281B18] border border-[rgba(158,77,59,0.3)] text-[#9E4D3B] dark:text-[#E28876] text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E4D3B]" /> Needs Practice
          </span>
        </div>
      </div>

      {/* Visual Progression Journey Spine & Milestones */}
      <div className="relative">
        {/* Central Winding Spine */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-[#4E7D63]/30 rounded-full pointer-events-none hidden md:block" />
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-[#4E7D63]/30 rounded-full pointer-events-none md:hidden" />

        {/* Start Milestone Checkpoint Banner */}
        <div className="flex items-center justify-center mb-6">
          <div className="px-4 py-1.5 rounded-full bg-[#F2EFE9] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] text-[#1C2E24] dark:text-[#F4F7F5] text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <Flag size={13} className="text-[#4E7D63]" />
            <span>Journey Stage Milestone Origin</span>
          </div>
        </div>

        {/* Milestones Alternating Grid */}
        <div className="space-y-6 md:space-y-8">
          {topics.map((topic, idx) => {
            const isLeft = idx % 2 === 0;
            const mastery = topicMasteryMap[topic.id];
            const isSelected = selectedMilestoneId === topic.id;

            return (
              <div
                key={topic.id}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
              >
                {/* Desktop Left Side Node (if even index) */}
                <div className={`md:pr-8 ${isLeft ? "block" : "hidden md:block md:invisible"}`}>
                  <RoadmapMilestoneNode
                    topic={topic}
                    index={idx}
                    mastery={mastery}
                    isSelected={isSelected}
                    onSelectMilestone={onSelectMilestone}
                    onLaunchQuiz={onLaunchQuiz}
                  />
                </div>

                {/* Central Step Marker Node (Desktop only) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#FBFBF9] dark:bg-[#17241D] border-2 border-[#4E7D63] hidden md:flex items-center justify-center text-[10px] font-bold text-[#1C2E24] dark:text-[#F4F7F5] shadow-xs z-10">
                  {idx + 1}
                </div>

                {/* Desktop Right Side Node (if odd index) */}
                <div className={`md:pl-8 ${!isLeft ? "block" : "hidden md:block md:invisible"}`}>
                  <RoadmapMilestoneNode
                    topic={topic}
                    index={idx}
                    mastery={mastery}
                    isSelected={isSelected}
                    onSelectMilestone={onSelectMilestone}
                    onLaunchQuiz={onLaunchQuiz}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* End Milestone Trophy Checkpoint */}
        <div className="flex items-center justify-center mt-8 pt-4">
          <div className="px-4 py-2 rounded-xl bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.3)] text-[#3B624E] dark:text-[#8EB7A0] text-xs font-bold flex items-center gap-2 shadow-2xs">
            <Award size={15} className="text-[#4E7D63]" />
            <span>Stage Mastery & Tier-1 Milestone Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
