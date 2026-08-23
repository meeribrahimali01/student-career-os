import React from "react";
import { motion } from "motion/react";
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
  GraduationCap,
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
import MeridianOrbit3D from "./MeridianOrbit3D";
import { GlassSurface, GlassButton, GlassBadge, GlassMetric } from "./ui/LiquidGlass";

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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. EDITORIAL ASYMMETRIC HERO & 3D LEARNING ORBIT               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7/12: Typography-led Editorial Greeting */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center gap-2">
            <GlassBadge
              label="Semester 5 • Placement Cohort"
              variant="primary"
              icon={<Sparkles size={11} className="text-[#4E7D63]" />}
            />
            <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">VIT-Chennai</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight leading-tight">
            Good afternoon, {profile.name.split(" ")[0]}.
          </h1>

          <p className="text-sm text-[#556B5F] dark:text-[#95AFA1] max-w-xl leading-relaxed">
            You are tracking <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">{profile.targetRole}</strong> requirements with <strong className="text-[#4E7D63] dark:text-[#6E9B82] font-bold">72%</strong> placement readiness benchmark across FAANG & Tier-1 Super Dream standards.
          </p>

          {/* Quick Action Steppers */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => onNavigateToRoadmap?.()}
            >
              <Compass size={14} />
              <span>Resume Learning Journey</span>
              <ArrowRight size={13} />
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="md"
              onClick={() => onNavigateToCareer?.()}
            >
              <Target size={14} />
              <span>Skill Gap Intelligence</span>
            </GlassButton>
          </div>
        </div>

        {/* Right 5/12: Interactive 3D Meridian Learning Orbit Centerpiece */}
        <div className="lg:col-span-5">
          <GlassSurface level={1} className="p-2">
            <MeridianOrbit3D
              score={72}
              activeStage="Stage 02: Core Computer Science"
              onSelectStage={() => onNavigateToRoadmap?.()}
            />
          </GlassSurface>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. SPATIAL METRIC GAUGES                                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Floating CGPA Indicator */}
        <GlassSurface level={2} className="p-4.5 flex flex-col justify-between">
          <GlassMetric
            label="Cumulative GPA"
            value={`${profile.cgpa.toFixed(2)}`}
            trend="+0.18 Delta"
            trendPositive={true}
            subtext="Semester 5 • Top 8%"
            icon={<GraduationCap size={15} />}
          />
        </GlassSurface>

        {/* Metric 2: Today Focus Minutes */}
        <GlassSurface level={2} className="p-4.5 flex flex-col justify-between">
          <GlassMetric
            label="Today's Focused Study"
            value={`${profile.todayStudyMinutes}m`}
            trend={`${profile.targetDailyMinutes}m Goal`}
            trendPositive={profile.todayStudyMinutes >= profile.targetDailyMinutes}
            subtext={`${profile.studyStreakDays}-Day Active Streak`}
            icon={<Flame size={15} />}
          />
        </GlassSurface>

        {/* Metric 3: Verified Topic Mastery */}
        <GlassSurface level={2} className="p-4.5 flex flex-col justify-between">
          <GlassMetric
            label="Mastered Topics"
            value={profile.masteredTopicsCount}
            trend="Level 4 Ready"
            trendPositive={true}
            subtext="Core CS, DSA & Systems"
            icon={<Target size={15} />}
          />
        </GlassSurface>

        {/* Metric 4: Placement Readiness Level */}
        <GlassSurface level={2} className="p-4.5 flex flex-col justify-between">
          <GlassMetric
            label="Placement Readiness"
            value="72%"
            trend="Super Dream"
            trendPositive={true}
            subtext="Tier-1 CDC Standard"
            icon={<ShieldCheck size={15} />}
          />
        </GlassSurface>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. TODAY'S FOCUS: NEXT BEST ACTIONS                            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Best Actions (7 Columns) */}
        <GlassSurface level={2} className="lg:col-span-7 p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4E7D63] pulse-ai-dot" />
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Today's Focus: Next Best Actions</h3>
            </div>
            <GlassBadge label="Autonomous Recommendations" variant="primary" />
          </div>

          {/* Flowing Action Rows with Natural Earth Tonal Accents */}
          <div className="space-y-2.5">
            {nextBestActions.slice(0, 3).map((action, idx) => {
              const glowType: "critical" | "high" | "medium" | "normal" =
                action.urgency === "CRITICAL"
                  ? "critical"
                  : action.urgency === "HIGH"
                  ? "high"
                  : action.urgency === "MEDIUM"
                  ? "medium"
                  : "normal";

              const urgencyBadgeVariant: "danger" | "warning" | "primary" | "success" =
                action.urgency === "CRITICAL"
                  ? "danger"
                  : action.urgency === "HIGH"
                  ? "warning"
                  : action.urgency === "MEDIUM"
                  ? "primary"
                  : "success";

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3.5 rounded-xl transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    glowType === "critical"
                      ? "glass-glow-critical"
                      : glowType === "high"
                      ? "glass-glow-high"
                      : glowType === "medium"
                      ? "glass-glow-medium"
                      : "glass-glow-normal"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <GlassBadge
                        label={action.urgency}
                        variant={urgencyBadgeVariant}
                      />
                      <span className="text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] truncate">{action.title}</span>
                    </div>
                    <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">{action.reason}</p>
                    <span className="text-[10px] text-[#4E7D63] dark:text-[#6E9B82] font-medium flex items-center gap-1 pt-0.5">
                      <Clock size={11} /> ~{action.estimatedMinutes} mins • {action.category}
                    </span>
                  </div>

                  <GlassButton
                    variant="primary"
                    size="sm"
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
                    className="flex-shrink-0"
                  >
                    <span>Launch</span>
                    <ArrowRight size={11} />
                  </GlassButton>
                </motion.div>
              );
            })}
          </div>
        </GlassSurface>

        {/* 7-Day Study Momentum (5 Columns) */}
        <GlassSurface level={2} className="lg:col-span-5 p-5 space-y-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Study Momentum (7 Days)</h3>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Daily focused study hours vs target</p>
            </div>
            <GlassBadge
              label={`${profile.studyStreakDays}d Streak`}
              variant="success"
              icon={<Flame size={12} className="text-[#4E7D63]" />}
            />
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEK_DATA_7D} margin={{ top: 8, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#7C9184" fontSize={10} tickLine={false} />
                <YAxis stroke="#7C9184" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F2EFE9",
                    borderColor: "rgba(28, 46, 36, 0.15)",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "#1C2E24",
                  }}
                />
                <Bar dataKey="hours" name="Study Hours" radius={[4, 4, 0, 0]}>
                  {WEEK_DATA_7D.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.today ? "#4E7D63" : "rgba(78, 125, 99, 0.4)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#556B5F] dark:text-[#95AFA1] pt-2 border-t border-[rgba(28,46,36,0.08)]">
            <span>Today: <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{profile.todayStudyMinutes} mins</strong></span>
            <span>Daily Goal: <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{profile.targetDailyMinutes} mins</strong></span>
          </div>
        </GlassSurface>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4. CONTEXTUAL ACADEMIC, REVISION & STRENGTH SIGNALS            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Priority Weak Area */}
        <GlassSurface level={2} className="p-4.5 space-y-2">
          <div className="flex items-center justify-between">
            <GlassBadge label="Needs Practice" variant="warning" />
            <AlertTriangle size={15} className="text-[#8C532B]" />
          </div>
          <h4 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{weakestTopic?.topicName}</h4>
          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
            Current Accuracy: <strong className="text-[#8C532B] dark:text-[#D49E78] font-semibold">{weakestTopic?.masteryScore}%</strong> ({weakestTopic?.correctAttempts}/{weakestTopic?.totalAttempts} Solved).
          </p>
          <button
            onClick={() => onNavigateToRoadmap?.(weakestTopic?.topicId)}
            className="text-xs font-semibold text-[#4E7D63] dark:text-[#6E9B82] hover:underline flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Practice in Roadmap</span>
            <ArrowRight size={12} />
          </button>
        </GlassSurface>

        {/* Top Verified Strength */}
        <GlassSurface level={2} className="p-4.5 space-y-2">
          <div className="flex items-center justify-between">
            <GlassBadge label="Top Strength" variant="success" />
            <CheckCircle2 size={15} className="text-[#4E7D63]" />
          </div>
          <h4 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{strongestTopic?.topicName}</h4>
          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
            Current Accuracy: <strong className="text-[#3B624E] dark:text-[#8EB7A0] font-semibold">{strongestTopic?.masteryScore}%</strong> ({strongestTopic?.correctAttempts}/{strongestTopic?.totalAttempts} Solved).
          </p>
          <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] block pt-1">
            Verified Level 4 Placement Ready ✓
          </span>
        </GlassSurface>

        {/* Spaced Revision Due */}
        <GlassSurface level={2} className="p-4.5 space-y-2">
          <div className="flex items-center justify-between">
            <GlassBadge label="Spaced Revision" variant="primary" />
            <Clock size={15} className="text-[#4E7D63]" />
          </div>
          <h4 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{dueRevisions.length} Topics Due Today</h4>
          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed truncate">
            {dueRevisions.map((t) => t.topicName).slice(0, 2).join(", ") || "All caught up for today"}
          </p>
          <button
            onClick={() => onNavigateToRoadmap?.()}
            className="text-xs font-semibold text-[#4E7D63] dark:text-[#6E9B82] hover:underline flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Start Scheduled Revision</span>
            <ArrowRight size={12} />
          </button>
        </GlassSurface>
      </div>
    </motion.div>
  );
}
