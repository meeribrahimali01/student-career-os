import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  ArrowRight,
  Target,
  ShieldCheck,
  Play,
} from "lucide-react";
import { FOUR_YEAR_ROADMAP, RoadmapTopic } from "../../data/studyRoadmapData";
import {
  Question,
  INITIAL_QUESTIONS,
  TopicMastery,
  NextBestAction,
} from "../../data/studentIntelligence";
import RoadmapYearSelector from "./RoadmapYearSelector";
import NextBestActionBanner from "./NextBestActionBanner";
import RoadmapPath from "./RoadmapPath";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";

interface PersonalizedRoadmapProps {
  topicMasteryMap: Record<string, TopicMastery>;
  nextBestActions?: NextBestAction[];
  onRecordAttempt: (
    question: Question,
    isCorrect: boolean,
    timeSeconds: number,
    selectedAnswer: any
  ) => void;
  onScheduleRevision: (topicId: string, intervalDays: number) => void;
  onNavigateToAI?: (promptContext: string) => void;
  onNavigateToResources?: (topicId: string) => void;
}

export default function PersonalizedRoadmap({
  topicMasteryMap,
  nextBestActions = [],
  onRecordAttempt,
  onScheduleRevision,
  onNavigateToAI,
  onNavigateToResources,
}: PersonalizedRoadmapProps) {
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | 4>(2); // Default to Core CS Year 2
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapTopic | null>(null);

  // Question Attempt Modal State
  const [activeQuestionModal, setActiveQuestionModal] = useState<{
    topicId: string;
    topicName: string;
    questions: Question[];
    currentIndex: number;
  } | null>(null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submittedAttempt, setSubmittedAttempt] = useState<{
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [quizTimerSeconds] = useState<number>(0);
  const [selectedRevisionInterval, setSelectedRevisionInterval] = useState<number>(3);

  // Current year plan
  const currentYearPlan = useMemo(() => {
    return FOUR_YEAR_ROADMAP.find((y) => y.year === selectedYear) || FOUR_YEAR_ROADMAP[1];
  }, [selectedYear]);

  // Overall calculations across all 4 years
  const totalRoadmapTopics = useMemo(() => {
    return FOUR_YEAR_ROADMAP.reduce((acc, y) => acc + y.totalTopics, 0);
  }, []);

  const totalCompletedTopics = useMemo(() => {
    return FOUR_YEAR_ROADMAP.reduce((acc, y) => acc + y.completedTopics, 0);
  }, []);

  const overallMasteryPct = Math.round((totalCompletedTopics / totalRoadmapTopics) * 100);

  // Top Next Best Action for the Journey
  const topJourneyAction = nextBestActions[0];

  // Launch Question Attempt Flow
  const handleLaunchQuiz = (topicId: string, topicName: string) => {
    const matchedQuestions = INITIAL_QUESTIONS.filter((q) => q.topicId === topicId);
    const questionsToUse =
      matchedQuestions.length > 0
        ? matchedQuestions
        : [
            {
              id: `q_${topicId}_generic`,
              topicId,
              topicName,
              subtopic: "Core Fundamentals",
              year: selectedYear,
              difficulty: "Medium",
              type: "mcq",
              questionText: `What is the primary optimization objective when implementing standard operations in ${topicName}?`,
              options: [
                "Minimizing asymptotic time complexity and auxiliary space overhead",
                "Increasing the lines of code in production",
                "Avoiding all loop constructs",
                "Forcing all data to stay in CPU registers",
              ],
              correctAnswer: 0,
              explanation: `In engineering interviews and real-world systems, the primary invariant for ${topicName} is achieving optimal Big-O time and space tradeoffs.`,
              skillTags: [topicName, "CS Fundamentals"],
              estimatedMinutes: 3,
            } as Question,
          ];

    setActiveQuestionModal({
      topicId,
      topicName,
      questions: questionsToUse,
      currentIndex: 0,
    });
    setSelectedOption(null);
    setSubmittedAttempt(null);
  };

  // Handle Answer Submission
  const handleSubmitAnswer = () => {
    if (!activeQuestionModal || selectedOption === null) return;
    const currentQ = activeQuestionModal.questions[activeQuestionModal.currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    setSubmittedAttempt({
      isCorrect,
      explanation: currentQ.explanation,
    });

    onRecordAttempt(currentQ, isCorrect, quizTimerSeconds || 45, selectedOption);
  };

  // Handle Next Question or Finish
  const handleNextOrFinish = () => {
    if (!activeQuestionModal) return;
    if (activeQuestionModal.currentIndex < activeQuestionModal.questions.length - 1) {
      setActiveQuestionModal((prev) =>
        prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null
      );
      setSelectedOption(null);
      setSubmittedAttempt(null);
    } else {
      // Schedule revision on quiz completion
      onScheduleRevision(activeQuestionModal.topicId, selectedRevisionInterval);
      setActiveQuestionModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP HERO HEADER & OVERALL JOURNEY TELEMETRY                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={2} className="p-5 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <GlassBadge
                label="Visual Learning Journey"
                variant="primary"
                icon={<Sparkles size={11} className="text-[#4E7D63]" />}
              />
              <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">VIT-Chennai Engineering Roadmap</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#1C2E24] dark:text-[#F4F7F5]">
              Personalized Study & Career Progression Path
            </h1>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
              Progress through your 4-year engineering path from foundational computation to core CS, advanced systems design, and FAANG placement readiness.
            </p>
          </div>

          {/* Overall Journey Completion Telemetry */}
          <GlassSurface level={3} className="p-3.5 flex items-center gap-4 flex-shrink-0">
            <div className="text-center space-y-0.5">
              <span className="text-2xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">
                {overallMasteryPct}%
              </span>
              <span className="text-[9px] font-bold text-[#4E7D63] dark:text-[#6E9B82] uppercase block">
                Total Path Mastery
              </span>
            </div>
            <div className="space-y-1 text-xs border-l border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] pl-3.5">
              <div className="font-semibold text-[#1C2E24] dark:text-[#F4F7F5] flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#4E7D63]" />
                <span>{totalCompletedTopics} of {totalRoadmapTopics} Topics Mastered</span>
              </div>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">
                Active Year: <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-mono">Year {selectedYear}</strong>
              </p>
            </div>
          </GlassSurface>
        </div>
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. NEXT BEST ACTION JOURNEY BANNER                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <NextBestActionBanner
        action={topJourneyAction}
        onLaunchQuiz={handleLaunchQuiz}
      />

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. 4-YEAR CONTINUOUS STAGE STEPPER                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <RoadmapYearSelector
        years={FOUR_YEAR_ROADMAP}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4. VISUAL LEARNING PATH CANVAS                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={2} className="p-5">
        <RoadmapPath
          yearTitle={currentYearPlan.yearTitle}
          focusTheme={currentYearPlan.focusTheme}
          topics={currentYearPlan.topics}
          topicMasteryMap={topicMasteryMap}
          selectedMilestoneId={selectedMilestone?.id}
          onSelectMilestone={setSelectedMilestone}
          onLaunchQuiz={handleLaunchQuiz}
        />
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 5. MILESTONE DETAILS MODAL OVERLAY                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C2E24]/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#F2EFE9] dark:bg-[#1A2820] border border-[rgba(28,46,36,0.12)] dark:border-[rgba(244,247,245,0.1)] rounded-2xl max-w-xl w-full p-5 shadow-xl space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] pb-2.5">
                <div className="space-y-0.5">
                  <GlassBadge label={selectedMilestone.category} variant="primary" />
                  <h3 className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5] mt-1">
                    {selectedMilestone.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="w-7 h-7 rounded-lg hover:bg-[#EAE6DE] dark:hover:bg-[#1D2E24] flex items-center justify-center text-[#556B5F] dark:text-[#95AFA1] hover:text-[#1C2E24] dark:hover:text-[#F4F7F5] cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
                {selectedMilestone.description}
              </p>

              <div className="text-[11px] text-[#1C2E24] dark:text-[#F4F7F5] bg-[#FAF8F5] dark:bg-[#17241D] p-3 rounded-xl border border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex items-start gap-2">
                <Target size={14} className="text-[#4E7D63] flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1C2E24] dark:text-[#F4F7F5]">Placement Value:</strong> {selectedMilestone.careerRelevance}
                </span>
              </div>

              {/* Subtopic Difficulty Progression Tiers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-[#556B5F] dark:text-[#95AFA1] uppercase tracking-wider block">
                  Progression Difficulty Tiers
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {selectedMilestone.subtopics.map((sub, sIdx) => {
                    const diffBadge: Record<string, string> = {
                      Easy: "bg-[#EDF4F0] text-[#3B624E] border-[rgba(78,125,99,0.3)]",
                      Medium: "bg-[#FAF2EB] text-[#8C532B] border-[rgba(140,83,43,0.3)]",
                      Hard: "bg-[#F9EBE8] text-[#9E4D3B] border-[rgba(158,77,59,0.3)]",
                    };
                    return (
                      <div
                        key={sIdx}
                        className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                          diffBadge[sub.difficulty] || "bg-[#F2EFE9]"
                        }`}
                      >
                        <div>
                          <span className="font-bold block">{sub.difficulty}</span>
                          <span className="text-[10px] opacity-85 truncate block">{sub.name}</span>
                        </div>
                        <span className="text-[10px] font-mono mt-1.5 opacity-90">
                          {sub.completedCount}/{sub.questionCount} Solved
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2.5 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onNavigateToAI?.(`Explain core patterns and interview questions for "${selectedMilestone.title}"`);
                      setSelectedMilestone(null);
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Ask AI Tutor</span>
                  </GlassButton>

                  {onNavigateToResources && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onNavigateToResources(selectedMilestone.id);
                        setSelectedMilestone(null);
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Smart Resources</span>
                    </GlassButton>
                  )}
                </div>

                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleLaunchQuiz(selectedMilestone.id, selectedMilestone.title);
                    setSelectedMilestone(null);
                  }}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Attempt Questions</span>
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 6. INTERACTIVE QUESTION ATTEMPT MODAL DIALOG                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeQuestionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C2E24]/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#F2EFE9] dark:bg-[#1A2820] border border-[rgba(28,46,36,0.12)] dark:border-[rgba(244,247,245,0.1)] rounded-2xl max-w-xl w-full p-5 shadow-xl space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] pb-2.5">
                <div className="space-y-0.5">
                  <GlassBadge label={activeQuestionModal.topicName} variant="primary" />
                  <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5] mt-1">
                    Question {activeQuestionModal.currentIndex + 1} of {activeQuestionModal.questions.length}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveQuestionModal(null)}
                  className="w-7 h-7 rounded-lg hover:bg-[#EAE6DE] dark:hover:bg-[#1D2E24] flex items-center justify-center text-[#556B5F] dark:text-[#95AFA1] hover:text-[#1C2E24] dark:hover:text-[#F4F7F5] cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Question Card */}
              {(() => {
                const currentQ = activeQuestionModal.questions[activeQuestionModal.currentIndex];
                return (
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#17241D] text-[#1C2E24] dark:text-[#F4F7F5] border border-[rgba(28,46,36,0.1)] font-mono">
                        {currentQ.difficulty} Tier
                      </span>
                      <span className="text-xs text-[#556B5F] dark:text-[#95AFA1]">• {currentQ.subtopic}</span>
                    </div>

                    <p className="text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] leading-relaxed bg-[#FAF8F5] dark:bg-[#17241D] p-3.5 rounded-xl border border-[rgba(28,46,36,0.08)]">
                      {currentQ.questionText}
                    </p>

                    {/* Options */}
                    {currentQ.options && (
                      <div className="space-y-2">
                        {currentQ.options.map((opt, idx) => {
                          const isSelected = selectedOption === idx;
                          const isSubmitted = submittedAttempt !== null;
                          const isCorrectOption = idx === currentQ.correctAnswer;

                          let optStyle = "bg-[#FAF8F5] dark:bg-[#17241D] border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] hover:border-[#4E7D63]/50 text-[#1C2E24] dark:text-[#F4F7F5]";
                          if (isSubmitted) {
                            if (isCorrectOption) {
                              optStyle = "bg-[#EDF4F0] border-[#4E7D63] text-[#2B583E] font-bold";
                            } else if (isSelected && !isCorrectOption) {
                              optStyle = "bg-[#F9EBE8] border-[#9E4D3B] text-[#853E2E]";
                            }
                          } else if (isSelected) {
                            optStyle = "bg-[#EDF4F0] dark:bg-[#1E2F26] border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] font-bold shadow-2xs";
                          }

                          return (
                            <button
                              key={idx}
                              disabled={isSubmitted}
                              onClick={() => setSelectedOption(idx)}
                              className={`w-full p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {isSubmitted && isCorrectOption && <Check size={14} className="text-[#4E7D63]" />}
                              {isSubmitted && isSelected && !isCorrectOption && <X size={14} className="text-[#9E4D3B]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Immediate Explanation Banner */}
                    {submittedAttempt && (
                      <div
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          submittedAttempt.isCorrect
                            ? "bg-[#EDF4F0] border-[rgba(78,125,99,0.3)] text-[#2B583E]"
                            : "bg-[#FAF2EB] border-[rgba(140,83,43,0.3)] text-[#8C532B]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {submittedAttempt.isCorrect ? (
                            <>
                              <CheckCircle2 size={15} className="text-[#4E7D63]" />
                              <span>Correct! Performance recorded in Topic Mastery.</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle size={15} className="text-[#8C532B]" />
                              <span>Incorrect. Marked as review priority.</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">{submittedAttempt.explanation}</p>

                        {/* Spaced Revision Selector */}
                        <div className="pt-2 border-t border-[rgba(28,46,36,0.1)] flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-[#556B5F]">Schedule Next Revision:</span>
                          <div className="flex items-center gap-1">
                            {[1, 3, 7, 14, 30].map((days) => (
                              <button
                                key={days}
                                type="button"
                                onClick={() => setSelectedRevisionInterval(days)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                                  selectedRevisionInterval === days
                                    ? "bg-[#1C2E24] text-[#FBFBF9]"
                                    : "bg-[#E8E4DC] text-[#556B5F] hover:text-[#1C2E24]"
                                }`}
                              >
                                {days === 1 ? "Tomorrow" : `${days}d`}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 flex justify-end gap-2">
                      {!submittedAttempt ? (
                        <GlassButton
                          variant="primary"
                          size="md"
                          disabled={selectedOption === null}
                          onClick={handleSubmitAnswer}
                        >
                          Submit Answer
                        </GlassButton>
                      ) : (
                        <GlassButton
                          variant="primary"
                          size="md"
                          onClick={handleNextOrFinish}
                        >
                          <span>
                            {activeQuestionModal.currentIndex < activeQuestionModal.questions.length - 1
                              ? "Next Question"
                              : "Complete & Update Mastery"}
                          </span>
                          <ArrowRight size={13} />
                        </GlassButton>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
