import React from "react";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Flame,
  BookOpen,
  Calendar,
  Zap,
  Play,
  RotateCcw,
  Compass,
  MessageSquare,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  TopicMastery,
  AcademicSubject,
  StudentProfileData,
  NextBestAction,
} from "../../data/studentIntelligence";

interface DashboardIntelligenceProps {
  profile: StudentProfileData;
  topicMasteryMap: Record<string, TopicMastery>;
  subjects: AcademicSubject[];
  nextBestActions: NextBestAction[];
  onNavigateToRoadmap?: (topicId?: string) => void;
  onNavigateToAcademics?: () => void;
  onNavigateToCareer?: () => void;
  onNavigateToInterview?: () => void;
  onNavigateToProductivity?: () => void;
  onNavigateToEvents?: () => void;
}

const WEEK_DATA_7D = [
  { day: "Sat", hours: 2.5, target: 3.0 },
  { day: "Sun", hours: 4.5, target: 3.0 },
  { day: "Mon", hours: 3.2, target: 3.0 },
  { day: "Tue", hours: 5.0, target: 3.0 },
  { day: "Wed", hours: 2.8, target: 3.0 },
  { day: "Thu", hours: 4.2, target: 3.0 },
  { day: "Fri", hours: 4.8, target: 3.0, today: true },
];

export default function DashboardIntelligence({
  profile,
  topicMasteryMap,
  subjects,
  nextBestActions,
  onNavigateToRoadmap,
  onNavigateToAcademics,
  onNavigateToCareer,
  onNavigateToInterview,
  onNavigateToProductivity,
  onNavigateToEvents,
}: DashboardIntelligenceProps) {
  // Weakest & Strongest Topics
  const sortedTopics = Object.values(topicMasteryMap).sort((a, b) => a.masteryScore - b.masteryScore);
  const weakestTopic = sortedTopics[0];
  const strongestTopic = sortedTopics[sortedTopics.length - 1];

  // Overdue Revisions
  const dueRevisions = sortedTopics.filter(
    (t) => t.status === "CRITICAL" || t.nextRevisionDue === "TODAY"
  );

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. HERO BANNER WITH TODAY'S STUDENT INTELLIGENCE               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Semester 5 • Placement Cohort
              </span>
              <span className="text-xs text-muted-foreground">{profile.college}</span>
            </div>

            <h1 className="text-2xl font-black text-foreground">
              Good morning, {profile.name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tracking <strong className="text-foreground">{profile.targetRole}</strong> requirements with <strong className="text-primary">72%</strong> placement readiness benchmark.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onNavigateToCareer?.()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all hover:opacity-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              >
                <Sparkles size={13} />
                <span>Run Career Gap Intelligence</span>
              </button>
              <button
                onClick={() => onNavigateToInterview?.()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground bg-secondary hover:bg-secondary/80 border border-border flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>Launch Mock Interview</span>
              </button>
            </div>
          </div>

          {/* Placement Standing Telemetry */}
          <div className="flex items-center gap-5 bg-secondary/50 border border-border p-4 rounded-2xl">
            <div className="text-center space-y-1">
              <span className="text-3xl font-black text-foreground font-mono">85%</span>
              <span className="text-[9px] font-bold text-primary uppercase block">Readiness</span>
            </div>
            <div className="space-y-1 text-xs border-l border-border pl-4">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Benchmark Standing</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> Level 4 Placement Ready
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Immediate Focus</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {weakestTopic ? `${weakestTopic.topicName} (${weakestTopic.masteryScore}%)` : "System Design"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. TODAY'S FOCUS & TOP NEXT-BEST ACTIONS                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Next Best Actions (7 Columns) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <h3 className="text-sm font-bold text-foreground">Today's Focus: Next Best Actions</h3>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              Explainable AI Recommendations
            </span>
          </div>

          <div className="space-y-2.5">
            {nextBestActions.slice(0, 3).map((action) => {
              const urgencyBadge: Record<string, string> = {
                CRITICAL: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                HIGH: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                MEDIUM: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                NORMAL: "bg-secondary text-muted-foreground border-border",
              };

              return (
                <div
                  key={action.id}
                  className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-start justify-between gap-3 hover:border-primary/40 transition-all shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${urgencyBadge[action.urgency]}`}>
                        {action.urgency}
                      </span>
                      <span className="text-xs font-bold text-foreground">{action.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">{action.reason}</p>
                    <span className="text-[10px] text-primary font-medium flex items-center gap-1 pt-0.5">
                      <Clock size={11} /> ~{action.estimatedMinutes} mins • {action.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (action.actionType === "attempt_quiz") {
                        onNavigateToRoadmap?.(action.targetPayload?.topicId);
                      } else if (action.actionType === "view_academic") {
                        onNavigateToAcademics?.();
                      } else if (action.actionType === "start_focus") {
                        onNavigateToProductivity?.();
                      } else if (action.actionType === "practice_interview") {
                        onNavigateToInterview?.();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:opacity-90 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-xs"
                  >
                    <span>Start</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-Day Study Momentum Telemetry (5 Columns) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Study Momentum (7 Days)</h3>
              <p className="text-[11px] text-muted-foreground">Daily focused study hours vs target</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame size={12} /> {profile.studyStreakDays}d Streak
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK_DATA_7D} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "11px", color: "#F8FAFC" }}
                />
                <Bar dataKey="hours" name="Study Hours" radius={[4, 4, 0, 0]}>
                  {WEEK_DATA_7D.map((entry, index) => (
                    <Cell key={index} fill={entry.today ? "#4F46E5" : "#818CF8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
            <span>Today: <strong className="text-foreground">{profile.todayStudyMinutes} mins</strong></span>
            <span>Goal: <strong className="text-foreground">{profile.targetDailyMinutes} mins</strong></span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. WEAK/STRONG INTELLIGENCE & REVISION ALERT PANELS            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weak Topic Alert */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              Priority Weak Area
            </span>
            <AlertTriangle size={15} className="text-rose-500" />
          </div>
          <h4 className="text-sm font-bold text-foreground">{weakestTopic?.topicName}</h4>
          <p className="text-xs text-muted-foreground">
            Current Accuracy: <strong className="text-rose-600 dark:text-rose-400">{weakestTopic?.masteryScore}%</strong> ({weakestTopic?.correctAttempts}/{weakestTopic?.totalAttempts} Solved).
          </p>
          <button
            onClick={() => onNavigateToRoadmap?.(weakestTopic?.topicId)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Practice in Roadmap</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Strong Topic Standing */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Top Strength
            </span>
            <CheckCircle2 size={15} className="text-emerald-500" />
          </div>
          <h4 className="text-sm font-bold text-foreground">{strongestTopic?.topicName}</h4>
          <p className="text-xs text-muted-foreground">
            Current Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">{strongestTopic?.masteryScore}%</strong> ({strongestTopic?.correctAttempts}/{strongestTopic?.totalAttempts} Solved).
          </p>
          <span className="text-xs font-medium text-muted-foreground block pt-1">
            Verified Level 4 Placement Ready ✓
          </span>
        </div>

        {/* Spaced Revision Due */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              Spaced Revision
            </span>
            <Clock size={15} className="text-purple-500" />
          </div>
          <h4 className="text-sm font-bold text-foreground">{dueRevisions.length} Topics Due Today</h4>
          <p className="text-xs text-muted-foreground">
            {dueRevisions.map((t) => t.topicName).slice(0, 2).join(", ")}
          </p>
          <button
            onClick={() => onNavigateToRoadmap?.()}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Start Scheduled Revision</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
