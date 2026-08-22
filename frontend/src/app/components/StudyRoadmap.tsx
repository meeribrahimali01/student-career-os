import React, { useState, useMemo } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Target,
  Play,
  RotateCcw,
  AlertTriangle,
  Award,
  Filter,
  Check,
  X,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { FOUR_YEAR_ROADMAP, RoadmapTopic, YearLevelRoadmap } from "../../data/studyRoadmapData";
import {
  Question,
  INITIAL_QUESTIONS,
  TopicMastery,
  QuestionAttempt,
} from "../../data/studentIntelligence";

interface StudyRoadmapProps {
  topicMasteryMap: Record<string, TopicMastery>;
  onRecordAttempt: (question: Question, isCorrect: boolean, timeSeconds: number, selectedAnswer: any) => void;
  onScheduleRevision: (topicId: string, intervalDays: number) => void;
  onNavigateToAI?: (promptContext: string) => void;
}

export default function StudyRoadmap({
  topicMasteryMap,
  onRecordAttempt,
  onScheduleRevision,
  onNavigateToAI,
}: StudyRoadmapProps) {
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | 4>(3); // Default to current 3rd Year
  const [expandedYearAccordions, setExpandedYearAccordions] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: true,
    4: false,
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

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
  const [quizTimerSeconds, setQuizTimerSeconds] = useState<number>(0);
  const [selectedRevisionInterval, setSelectedRevisionInterval] = useState<number>(3);

  // Toggle Year Accordion
  const toggleYear = (year: number) => {
    setExpandedYearAccordions((prev) => ({ ...prev, [year]: !prev[year] }));
  };

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
              year: 3,
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
    setQuizTimerSeconds(0);
  };

  // Handle Question Submission
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

  // Handle Next Question or Close
  const handleNextOrFinish = () => {
    if (!activeQuestionModal) return;
    if (activeQuestionModal.currentIndex < activeQuestionModal.questions.length - 1) {
      setActiveQuestionModal((prev) =>
        prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null
      );
      setSelectedOption(null);
      setSubmittedAttempt(null);
    } else {
      // Schedule revision on finish
      onScheduleRevision(activeQuestionModal.topicId, selectedRevisionInterval);
      setActiveQuestionModal(null);
    }
  };

  // Categories list for filtering
  const allCategories = ["All", "Data Structures", "Algorithms", "Core CS", "Databases", "Web Development", "Architecture", "DevOps", "Placement"];

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HEADER & DYNAMIC TOPIC PRIORITY RADAR                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Sparkles size={12} />
                Dynamic Engineering Roadmap
              </span>
              <span className="text-xs text-muted-foreground">Four-Year Adaptive Curriculum</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-foreground">
              Personalized Study & Placement Roadmap
            </h1>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Progressive mastery structured across 1st to 4th Year. Practice Easy, Medium, and Hard problem tiers to continuously update your Topic Mastery score and automated revision schedule.
            </p>
          </div>

          {/* Spaced Revision Quick Status Badge */}
          <div className="flex items-center gap-4 bg-secondary/60 border border-border p-3.5 rounded-xl">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                Active Mastery Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">2 Revisions Due Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Priority Radar Map (Weak vs Strong Topics) */}
        <div className="pt-2 border-t border-border">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
            Your Live Topic Priority Matrix
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {Object.values(topicMasteryMap).map((topic) => {
              const badgeColors: Record<string, string> = {
                CRITICAL: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                WEAK: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                AVERAGE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                IMPROVING: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
                STRONG: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
              };

              return (
                <div
                  key={topic.topicId}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                    badgeColors[topic.status] || "bg-secondary border-border"
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wide block opacity-80">
                      {topic.status}
                    </span>
                    <strong className="text-xs font-bold text-foreground truncate block">
                      {topic.topicName}
                    </strong>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span>{topic.masteryScore}% Mastery</span>
                    <button
                      onClick={() => handleLaunchQuiz(topic.topicId, topic.topicName)}
                      className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      Quiz →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* YEAR SELECTION & CATEGORY FILTER TABS                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Year Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scroll">
          {([1, 2, 3, 4] as const).map((yearNum) => {
            const isSelected = selectedYear === yearNum;
            const labels = ["1st Year (Foundations)", "2nd Year (Core CS)", "3rd Year (Systems)", "4th Year (Placement)"];
            return (
              <button
                key={yearNum}
                onClick={() => {
                  setSelectedYear(yearNum);
                  setExpandedYearAccordions((prev) => ({ ...prev, [yearNum]: true }));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card hover:bg-secondary border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {labels[yearNum - 1]}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto no-scroll py-1">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryFilter === cat
                  ? "bg-secondary border-primary text-primary font-bold border"
                  : "bg-card hover:bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4-YEAR EXPANDABLE CURRICULUM SECTIONS                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        {FOUR_YEAR_ROADMAP.filter((y) => y.year === selectedYear).map((yearPlan) => {
          const isExpanded = expandedYearAccordions[yearPlan.year] ?? true;

          const filteredTopics = yearPlan.topics.filter(
            (t) => selectedCategoryFilter === "All" || t.category === selectedCategoryFilter
          );

          return (
            <div key={yearPlan.year} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              {/* Year Banner Header */}
              <div
                onClick={() => toggleYear(yearPlan.year)}
                className="p-4 bg-secondary/40 border-b border-border flex items-center justify-between cursor-pointer hover:bg-secondary/60 transition-colors select-none"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-foreground">{yearPlan.yearTitle}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {yearPlan.completedTopics}/{yearPlan.totalTopics} Completed
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{yearPlan.focusTheme}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28 hidden sm:block">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.round((yearPlan.completedTopics / yearPlan.totalTopics) * 100)}%` }}
                      />
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </div>

              {/* Topics Grid */}
              {isExpanded && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTopics.map((topic) => {
                    const mastery = topicMasteryMap[topic.id];
                    const masteryScore = mastery ? mastery.masteryScore : topic.progressPct;

                    return (
                      <div
                        key={topic.id}
                        className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between space-y-3.5 hover:border-primary/40 transition-all shadow-2xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-primary border border-border">
                                {topic.category}
                              </span>
                              <h4 className="text-sm font-bold text-foreground mt-1">{topic.title}</h4>
                            </div>
                            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md flex-shrink-0">
                              {masteryScore}% Mastery
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {topic.description}
                          </p>

                          {/* Career Relevance Callout */}
                          <div className="text-[11px] text-foreground/80 bg-secondary/50 p-2 rounded-lg border border-border/60 flex items-start gap-1.5">
                            <Target size={13} className="text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-foreground">Placement Value:</strong> {topic.careerRelevance}
                            </span>
                          </div>

                          {/* Subtopic Difficulty Breakdown Tiers */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                              Difficulty Question Tiers:
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-center">
                              {topic.subtopics.map((sub, sIdx) => {
                                const diffColors: Record<string, string> = {
                                  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                                  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                                  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                                };

                                return (
                                  <div
                                    key={sIdx}
                                    className={`p-1.5 rounded-lg border text-[10px] font-semibold flex flex-col justify-between ${
                                      diffColors[sub.difficulty] || "bg-secondary"
                                    }`}
                                  >
                                    <span className="font-bold">{sub.difficulty}</span>
                                    <span className="text-[9px] opacity-80">
                                      {sub.completedCount}/{sub.questionCount} solved
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                          <button
                            onClick={() =>
                              onNavigateToAI?.(`Explain key concepts and interview patterns for "${topic.title}"`)
                            }
                            className="text-[11px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen size={12} />
                            <span>Ask AI Tutor</span>
                          </button>

                          <button
                            onClick={() => handleLaunchQuiz(topic.id, topic.title)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                          >
                            <Play size={12} fill="currentColor" />
                            <span>Attempt Questions</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 5. INTERACTIVE QUESTION ATTEMPT MODAL DIALOG                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {activeQuestionModal.topicName}
                </span>
                <h3 className="text-sm font-bold text-foreground">
                  Question {activeQuestionModal.currentIndex + 1} of {activeQuestionModal.questions.length}
                </h3>
              </div>

              <button
                onClick={() => setActiveQuestionModal(null)}
                className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Question Card */}
            {(() => {
              const currentQ = activeQuestionModal.questions[activeQuestionModal.currentIndex];
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                      {currentQ.difficulty} Tier
                    </span>
                    <span className="text-xs text-muted-foreground">• {currentQ.subtopic}</span>
                  </div>

                  <p className="text-xs font-semibold text-foreground leading-relaxed bg-secondary/40 p-3.5 rounded-xl border border-border">
                    {currentQ.questionText}
                  </p>

                  {/* Options */}
                  {currentQ.options && (
                    <div className="space-y-2">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isSubmitted = submittedAttempt !== null;
                        const isCorrectOption = idx === currentQ.correctAnswer;

                        let optStyle = "bg-secondary/70 border-border hover:border-primary/50 text-foreground";
                        if (isSubmitted) {
                          if (isCorrectOption) {
                            optStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold";
                          } else if (isSelected && !isCorrectOption) {
                            optStyle = "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300";
                          }
                        } else if (isSelected) {
                          optStyle = "bg-primary/10 border-primary text-primary font-bold";
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full p-3 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && isCorrectOption && <Check size={14} className="text-emerald-500" />}
                            {isSubmitted && isSelected && !isCorrectOption && <X size={14} className="text-rose-500" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Immediate Explanation Banner */}
                  {submittedAttempt && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        submittedAttempt.isCorrect
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {submittedAttempt.isCorrect ? (
                          <>
                            <CheckCircle2 size={15} className="text-emerald-500" />
                            <span>Correct! Performance recorded in Topic Mastery.</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={15} className="text-amber-500" />
                            <span>Incorrect. Marked as review priority.</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{submittedAttempt.explanation}</p>

                      {/* Spaced Revision Selector */}
                      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground">Schedule Next Revision:</span>
                        <div className="flex items-center gap-1">
                          {[1, 3, 7, 14].map((days) => (
                            <button
                              key={days}
                              type="button"
                              onClick={() => setSelectedRevisionInterval(days)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                selectedRevisionInterval === days
                                  ? "bg-primary text-white"
                                  : "bg-secondary text-muted-foreground hover:text-foreground"
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
                      <button
                        disabled={selectedOption === null}
                        onClick={handleSubmitAnswer}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextOrFinish}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>
                          {activeQuestionModal.currentIndex < activeQuestionModal.questions.length - 1
                            ? "Next Question"
                            : "Complete & Update Mastery"}
                        </span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
