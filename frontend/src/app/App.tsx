import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Bot,
  Library,
  Briefcase,
  MessageSquare,
  Calendar,
  Zap,
  User,
  Search,
  Bell,
  Send,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Sparkles,
  Play,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  Minus,
  AlertCircle,
  RefreshCw,
  Target,
  Award,
  Layers,
  Code2,
  FolderGit2,
  ListOrdered,
  FileText,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { generateCareerIntelligence } from "../../careerGapService.js";

const NAV_SECTIONS = [
  {
    section: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: Map, label: "Roadmap" },
      { icon: BookOpen, label: "Academics" },
    ],
  },
  {
    section: "LEARN",
    items: [
      { icon: Bot, label: "AI Tutor" },
      { icon: Library, label: "Resources" },
    ],
  },
  {
    section: "CAREER",
    items: [
      { icon: Briefcase, label: "Career" },
      { icon: MessageSquare, label: "Interview Practice" },
    ],
  },
  {
    section: "COMMUNITY",
    items: [{ icon: Calendar, label: "Events" }],
  },
  {
    section: "PERSONAL",
    items: [
      { icon: Zap, label: "Productivity" },
      { icon: User, label: "Profile" },
    ],
  },
];

const WEEK_DATA = [
  { day: "Sa", hours: 1.8, today: false },
  { day: "Su", hours: 4.0, today: false },
  { day: "Mo", hours: 3.5, today: false },
  { day: "Tu", hours: 5.1, today: false },
  { day: "We", hours: 2.8, today: false },
  { day: "Th", hours: 4.6, today: false },
  { day: "Fr", hours: 4.5, today: true },
];

const SUBJECTS = [
  { name: "Data Structures", grade: "A", score: 92, change: 3 },
  { name: "Web Development", grade: "B+", score: 85, change: 5 },
  { name: "Database Systems", grade: "A−", score: 88, change: 0 },
  { name: "Linear Algebra", grade: "B", score: 76, change: -2 },
  { name: "Operating Systems", grade: "B+", score: 83, change: 1 },
];

const ROADMAP = [
  { label: "HTML & CSS Fundamentals", done: true },
  { label: "JavaScript Fundamentals", done: true },
  { label: "React & Component Design", done: true },
  { label: "JavaScript Arrays & Methods", done: false, current: true },
  { label: "Node.js & Express", done: false },
  { label: "Databases (SQL & NoSQL)", done: false },
  { label: "Full Stack Capstone Project", done: false },
];

const UPCOMING = [
  {
    title: "DSA Assignment #3",
    type: "assignment" as const,
    due: "Today, 11:59 PM",
    urgent: true,
  },
  {
    title: "Mock Interview — System Design",
    type: "event" as const,
    due: "Tomorrow, 3:00 PM",
    urgent: false,
  },
  {
    title: "Web Dev Project Review",
    type: "assignment" as const,
    due: "Fri, Aug 23",
    urgent: false,
  },
  {
    title: "Tech Fest Registration",
    type: "event" as const,
    due: "Sat, Aug 24",
    urgent: false,
  },
];

const QUICK_PROMPTS = ["Explain recursion", "DSA revision plan", "Mock interview Q&A"];

const CURRENT_STUDENT = {
  name: "Aryan Kumar",
  year: 3, // Semester 5
  branch: "CSE",
  cgpa: 8.6,
  careerGoal: "Full Stack Developer",
  skills: ["Data Structures", "Web Development", "Database Systems", "Operating Systems", "React", "Node.js", "JavaScript", "HTML & CSS"],
  interests: ["Full Stack Web Development", "Cloud Systems", "System Architecture"],
};

const completedCount = ROADMAP.filter((r) => r.done).length;
const roadmapPct = Math.round((completedCount / ROADMAP.length) * 100);

const METRICS = [
  { label: "CGPA", value: "8.6", sub: "of 10.0", badge: "+0.2", positive: true },
  { label: "Study Time", value: "4h 32m", sub: "today", badge: "+32m", positive: true },
  { label: "Skills Mastered", value: "72%", sub: "of roadmap", badge: null, positive: null },
  { label: "Tasks Done", value: "4 / 7", sub: "due today", badge: null, positive: null },
];

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return { bg: "#D1FAE5", text: "#059669" };
  return { bg: "#FEF3C7", text: "#D97706" };
}

function scoreBarColor(score: number) {
  if (score >= 90) return "#10B981";
  if (score >= 80) return "#6366F1";
  if (score >= 70) return "#F59E0B";
  return "#EF4444";
}

function importanceBadgeStyle(importance: string) {
  switch (importance?.toLowerCase()) {
    case "critical":
      return { bg: "#FEE2E2", text: "#DC2626", border: "#FCA5A5" };
    case "high":
      return { bg: "#FFEDD5", text: "#EA580C", border: "#FDBA74" };
    case "medium":
      return { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" };
    default:
      return { bg: "#E0E7FF", text: "#4F46E5", border: "#C7D2FE" };
  }
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [aiInput, setAiInput] = useState("");
  const [timeRange, setTimeRange] = useState<"7D" | "30D">("7D");

  // AI Career Gap Analyzer State
  const [careerStatus, setCareerStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [careerReport, setCareerReport] = useState<any>(null);
  const [careerError, setCareerError] = useState<string | null>(null);
  const [activeCareerTab, setActiveCareerTab] = useState<"overview" | "skillgaps" | "roadmap" | "projects" | "learningplan" | "interview">("overview");

  const handleAnalyzeCareerGap = async () => {
    setCareerStatus("loading");
    setCareerError(null);
    try {
      const report = await generateCareerIntelligence(CURRENT_STUDENT, undefined, {
        academicRecords: SUBJECTS.map((s) => ({
          semester: 5,
          subject: s.name,
          marks: s.score,
        })),
        maxRetries: 3,
        retryDelays: [1000, 2000, 4000],
      });
      setCareerReport(report);
      setCareerStatus("success");
    } catch (err: any) {
      console.error("Career Gap Analyzer error:", err);
      setCareerStatus("error");
      setCareerError(
        err?.error?.message ||
        err?.message ||
        "AI service is temporarily experiencing high demand. Please try again."
      );
    }
  };

  return (
    <>
      <style>{`
        .no-scroll::-webkit-scrollbar { display: none; }
        .no-scroll { scrollbar-width: none; }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-background">
        {/* ── Sidebar ──────────────────────────────── */}
        <aside className="w-60 flex-shrink-0 bg-card border-r border-border flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-5 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "#6366F1" }}
              >
                <GraduationCap size={14} className="text-white" />
              </div>
              <span className="text-[15px] font-semibold text-foreground tracking-tight">
                StudentOS
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto no-scroll px-3 space-y-5">
            {NAV_SECTIONS.map(({ section, items }) => (
              <div key={section}>
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground px-2 mb-1.5 select-none">
                  {section}
                </p>
                <div className="space-y-0.5">
                  {items.map(({ icon: Icon, label }) => {
                    const active = activeNav === label;
                    return (
                      <button
                        key={label}
                        onClick={() => setActiveNav(label)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                          active
                            ? "bg-accent text-primary font-medium"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Icon size={16} strokeWidth={active ? 2 : 1.75} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Profile footer */}
          <div className="border-t border-border p-3 flex-shrink-0">
            <button
              onClick={() => setActiveNav("Profile")}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                style={{ background: "#6366F1" }}
              >
                AK
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">{CURRENT_STUDENT.name}</p>
                <p className="text-xs text-muted-foreground truncate">CS · Semester 5</p>
              </div>
            </button>
          </div>
        </aside>

        {/* ── Right pane ───────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center px-8 gap-5 flex-shrink-0">
            <div className="flex-1 flex items-center gap-3">
              <p className="text-sm font-medium text-foreground">{activeNav}</p>
              {activeNav === "Career" && (
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#EEF2FF", color: "#6366F1" }}>
                  AI Career Intelligence
                </span>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 w-60 h-9 bg-secondary rounded-lg px-3 border border-transparent focus-within:border-primary focus-within:bg-card transition-colors">
              <Search size={14} className="text-muted-foreground flex-shrink-0" />
              <input
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                placeholder="Search anything..."
              />
            </div>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
              <Bell size={18} />
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: "#6366F1" }}
              />
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer select-none"
              style={{ background: "#6366F1" }}
            >
              AK
            </div>
          </header>

          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto no-scroll px-8 py-7">
            {/* ── TAB 1: DEDICATED CAREER / ROADMAP VIEW ────────────────── */}
            {activeNav === "Career" || activeNav === "Roadmap" ? (
              <div className="space-y-6">
                {/* Hero Header */}
                <div className="bg-card rounded-2xl border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} style={{ color: "#6366F1" }} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary" style={{ color: "#6366F1" }}>
                        AI Career Intelligence Engine
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Target Role: {CURRENT_STUDENT.careerGoal}
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-xl">
                      Personalized career gap intelligence, adaptive roadmap milestones, and gap-closing project recommendations for Semester 5 (Year 3).
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAnalyzeCareerGap}
                      disabled={careerStatus === "loading"}
                      className="px-5 py-2.5 rounded-xl font-medium text-sm text-white shadow-sm flex items-center gap-2 transition-all hover:opacity-95 disabled:opacity-75 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}
                    >
                      {careerStatus === "loading" ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Analyzing your career profile...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Analyze My Career Gap</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {careerStatus === "loading" && (
                  <div className="bg-card rounded-2xl border border-border p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse" style={{ background: "#EEF2FF" }}>
                      <RefreshCw size={28} className="animate-spin" style={{ color: "#6366F1" }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Analyzing your career profile...</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        Evaluating your skills, CGPA ({CURRENT_STUDENT.cgpa}), and course performance against {CURRENT_STUDENT.careerGoal} industry benchmarks with Gemini AI.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {careerStatus === "error" && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 dark:text-red-200">Analysis Notice</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{careerError}</p>
                      <button
                        onClick={handleAnalyzeCareerGap}
                        className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Career Intelligence Content Grid */}
                {careerReport && (
                  <div className="space-y-6">
                    {/* Top Row: Readiness Score & Daily Next Action */}
                    <div className="grid grid-cols-12 gap-6">
                      {/* 1. Readiness Score Card */}
                      <div className="col-span-12 lg:col-span-6 bg-card rounded-2xl border border-border p-6 space-y-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                              Career Readiness
                            </span>
                            <h3 className="text-xl font-bold text-foreground mt-1">
                              {careerReport.readiness?.overallScore ?? careerReport.readinessScore}/100 Score
                            </h3>
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#059669" }}>
                            {careerReport.currentLevel || "Intermediate"}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${careerReport.readiness?.overallScore ?? careerReport.readinessScore}%`,
                              background: scoreBarColor(careerReport.readiness?.overallScore ?? careerReport.readinessScore),
                            }}
                          />
                        </div>

                        {/* Breakdown bars */}
                        {careerReport.readiness?.scoreBreakdown && (
                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <span className="text-xs text-muted-foreground">Technical Skills</span>
                              <p className="text-base font-semibold text-foreground mt-0.5">
                                {careerReport.readiness.scoreBreakdown.technicalSkills}%
                              </p>
                            </div>
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <span className="text-xs text-muted-foreground">Projects</span>
                              <p className="text-base font-semibold text-foreground mt-0.5">
                                {careerReport.readiness.scoreBreakdown.projects}%
                              </p>
                            </div>
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <span className="text-xs text-muted-foreground">Academic Foundation</span>
                              <p className="text-base font-semibold text-foreground mt-0.5">
                                {careerReport.readiness.scoreBreakdown.academicFoundation}%
                              </p>
                            </div>
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <span className="text-xs text-muted-foreground">Problem Solving</span>
                              <p className="text-base font-semibold text-foreground mt-0.5">
                                {careerReport.readiness.scoreBreakdown.problemSolving}%
                              </p>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {careerReport.readiness?.explanation || careerReport.summary}
                        </p>
                      </div>

                      {/* 2. Daily AI Next Action */}
                      <div className="col-span-12 lg:col-span-6 bg-card rounded-2xl border border-border p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Target size={15} style={{ color: "#6366F1" }} />
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#6366F1" }}>
                              Immediate Next Action
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">
                            {careerReport.nextAction?.title || "Master Priority Skill Fundamentals"}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {careerReport.nextAction?.reason || "Highest leverage action to close your primary career gap today."}
                          </p>
                        </div>

                        {careerReport.nextAction?.tasks && (
                          <div className="bg-secondary/60 rounded-xl p-3.5 space-y-2">
                            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                              <Clock size={12} style={{ color: "#6366F1" }} />
                              Daily Action Plan ({careerReport.nextAction.estimatedTime || "60 mins"})
                            </p>
                            <ul className="space-y-1.5">
                              {careerReport.nextAction.tasks.map((task: string, i: number) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <Check size={13} className="text-primary mt-0.5 flex-shrink-0" style={{ color: "#6366F1" }} />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                          <span>Confidence: {careerReport.dataQuality?.confidence || "High"}</span>
                          <span>Completeness: {careerReport.dataQuality?.profileCompleteness || 85}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Sub-Tabs */}
                    <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scroll">
                      {[
                        { id: "overview", label: "Overview & Gaps", icon: AlertCircle },
                        { id: "roadmap", label: "Phased Roadmap", icon: Map },
                        { id: "projects", label: "Recommended Projects", icon: FolderGit2 },
                        { id: "learningplan", label: "30-Day Plan", icon: ListOrdered },
                        { id: "interview", label: "Interview Prep & Portfolio", icon: Award },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setActiveCareerTab(id as any)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            activeCareerTab === id
                              ? "bg-primary text-white"
                              : "text-muted-foreground hover:bg-secondary"
                          }`}
                          style={activeCareerTab === id ? { background: "#6366F1" } : {}}
                        >
                          <Icon size={14} />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* TAB VIEW 1: Overview & Gaps */}
                    {activeCareerTab === "overview" && (
                      <div className="grid grid-cols-12 gap-6">
                        {/* Strengths */}
                        <div className="col-span-12 lg:col-span-5 bg-card rounded-2xl border border-border p-6 space-y-4">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Award size={16} className="text-emerald-500" />
                            Identified Strengths
                          </h4>
                          <ul className="space-y-2.5">
                            {(careerReport.strengths || []).map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-foreground bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-3 rounded-xl">
                                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Priority Skills */}
                          <div className="pt-3">
                            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                              Priority Skills Ranking
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {(careerReport.prioritySkills || []).map((p: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                                  style={{ background: "#EEF2FF", color: "#4338CA", borderColor: "#C7D2FE" }}
                                >
                                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                                    {i + 1}
                                  </span>
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Skill Gaps Matrix */}
                        <div className="col-span-12 lg:col-span-7 bg-card rounded-2xl border border-border p-6 space-y-4">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <AlertCircle size={16} style={{ color: "#6366F1" }} />
                            Skill Gap Analysis Matrix
                          </h4>

                          <div className="space-y-3">
                            {(careerReport.skillGaps || []).map((gap: any, i: number) => {
                              const isDetailed = typeof gap === "object";
                              const skillName = isDetailed ? gap.skill : gap;
                              const importance = isDetailed ? gap.importance : "High";
                              const badge = importanceBadgeStyle(importance);

                              return (
                                <div key={i} className="bg-secondary/40 border border-border rounded-xl p-3.5 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-foreground">{skillName}</span>
                                    <span
                                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                                      style={{ background: badge.bg, color: badge.text }}
                                    >
                                      {importance}
                                    </span>
                                  </div>
                                  {isDetailed && (
                                    <>
                                      <p className="text-xs text-muted-foreground leading-relaxed">{gap.reason}</p>
                                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                                        <span>Target: <strong>{gap.targetLevel}</strong></span>
                                        <span>•</span>
                                        <span>Est. Time: <strong>{gap.estimatedLearningTime}</strong></span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB VIEW 2: Phased Roadmap */}
                    {activeCareerTab === "roadmap" && (
                      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">Adaptive Career Roadmap (Semester 5 / Year 3)</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Phased learning progression designed to take you from current readiness to placement ready.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {(careerReport.roadmap || []).map((phase: any, i: number) => (
                            <div key={i} className="bg-secondary/30 border border-border rounded-2xl p-5 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-7 h-7 rounded-lg text-white font-semibold text-xs flex items-center justify-center"
                                    style={{ background: "#6366F1" }}
                                  >
                                    {phase.phase || i + 1}
                                  </div>
                                  <h5 className="text-sm font-bold text-foreground">{phase.title}</h5>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                                  {phase.duration}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {(phase.skills || []).map((s: string, sIdx: number) => (
                                  <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-card text-muted-foreground border border-border">
                                    {s}
                                  </span>
                                ))}
                              </div>

                              <ul className="space-y-1.5 pt-1">
                                {(phase.tasks || []).map((task: string, tIdx: number) => (
                                  <li key={tIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>

                              {phase.milestone && (
                                <div className="text-xs font-medium text-primary bg-indigo-50/60 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2" style={{ color: "#4338CA" }}>
                                  <Award size={14} />
                                  <span>Milestone: {phase.milestone}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB VIEW 3: Recommended Projects */}
                    {activeCareerTab === "projects" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(careerReport.projects || careerReport.recommendedProjects || []).map((p: any, i: number) => {
                          const isObj = typeof p === "object";
                          const title = isObj ? p.title : p;
                          const difficulty = isObj ? p.difficulty : "Intermediate";
                          const why = isObj ? p.whyRecommended : "Designed to close primary skill gaps.";
                          const resume = isObj ? p.resumeValue : "Great capstone addition for resume.";
                          const techs = isObj && Array.isArray(p.technologies) ? p.technologies : ["React", "Node.js", "SQL"];

                          return (
                            <div key={i} className="bg-card rounded-2xl border border-border p-6 flex flex-col justify-between space-y-4">
                              <div className="space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-sm font-bold text-foreground leading-snug">{title}</h5>
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground flex-shrink-0">
                                    {difficulty}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{why}</p>

                                <div className="flex flex-wrap gap-1 pt-1">
                                  {techs.map((t: string, tIdx: number) => (
                                    <span key={tIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary text-foreground">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="border-t border-border pt-3 space-y-1">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                  Resume Impact
                                </span>
                                <p className="text-xs text-foreground font-medium">{resume}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* TAB VIEW 4: 30-Day Learning Plan */}
                    {activeCareerTab === "learningplan" && (
                      <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">30-Day Actionable Learning Plan</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Structured milestones prioritizing critical skill gaps first.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(careerReport.learningPlan || []).map((item: any, i: number) => (
                            <div key={i} className="bg-secondary/30 border border-border rounded-xl p-4 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-primary" style={{ color: "#6366F1" }}>
                                  Day {item.day}
                                </span>
                                <span className="text-[11px] text-muted-foreground">{item.estimatedTime}</span>
                              </div>
                              <h5 className="text-sm font-semibold text-foreground">{item.topic}</h5>

                              <ul className="space-y-1">
                                {(item.tasks || []).map((t: string, tIdx: number) => (
                                  <li key={tIdx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                    <span>•</span>
                                    <span>{t}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="text-[11px] font-medium bg-card p-2 rounded-lg border border-border text-foreground">
                                <strong>Output:</strong> {item.output}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB VIEW 5: Interview Prep & Portfolio */}
                    {activeCareerTab === "interview" && (
                      <div className="grid grid-cols-12 gap-6">
                        {/* Interview Prep */}
                        <div className="col-span-12 lg:col-span-6 bg-card rounded-2xl border border-border p-6 space-y-4">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <MessageSquare size={16} style={{ color: "#6366F1" }} />
                            Technical & Coding Interview Topics
                          </h4>

                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Technical Core</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {(careerReport.interviewPreparation?.technicalTopics || []).map((topic: string, i: number) => (
                                  <span key={i} className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-lg">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Coding Patterns</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {(careerReport.interviewPreparation?.codingTopics || []).map((topic: string, i: number) => (
                                  <span key={i} className="text-xs bg-secondary text-foreground px-2.5 py-1 rounded-lg">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-border pt-3">
                              <span className="text-xs font-semibold text-foreground">Sample Project Defense Question:</span>
                              <p className="text-xs text-muted-foreground italic mt-1 bg-secondary/50 p-3 rounded-xl">
                                "{careerReport.interviewPreparation?.projectQuestions?.[0] || 'Why did you choose your specific tech stack for your primary project?'}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Portfolio & Resume Advice */}
                        <div className="col-span-12 lg:col-span-6 bg-card rounded-2xl border border-border p-6 space-y-4">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FileText size={16} style={{ color: "#6366F1" }} />
                            Portfolio & Resume Enhancements
                          </h4>

                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-foreground">GitHub Actions:</span>
                              <ul className="space-y-1.5 mt-1.5">
                                {(careerReport.portfolioAdvice?.githubImprovements || []).map((tip: string, i: number) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <Check size={13} className="text-primary mt-0.5 flex-shrink-0" style={{ color: "#6366F1" }} />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="border-t border-border pt-3">
                              <span className="text-xs font-semibold text-foreground">Resume Strengths to Highlight:</span>
                              <ul className="space-y-1.5 mt-1.5">
                                {(careerReport.portfolioAdvice?.resumeStrengths || []).map((tip: string, i: number) => (
                                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <Check size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Idle prompt if not analyzed yet */}
                {!careerReport && careerStatus === "idle" && (
                  <div className="bg-card rounded-2xl border border-border p-10 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#EEF2FF" }}>
                      <Sparkles size={22} style={{ color: "#6366F1" }} />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Ready to analyze your career gap?</h3>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Click the "Analyze My Career Gap" button above to evaluate your readiness for {CURRENT_STUDENT.careerGoal} roles.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ── TAB 2: DEFAULT DASHBOARD VIEW ────────────────────────── */
              <>
                {/* ── Greeting ──────────────────────── */}
                <div className="mb-7">
                  <h1 className="text-xl font-semibold text-foreground">Good morning 👋</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Here's your progress and what to focus on today.
                  </p>
                </div>

                {/* ── Metrics row ───────────────────── */}
                <div className="grid grid-cols-4 gap-4 mb-7">
                  {METRICS.map((m) => (
                    <div
                      key={m.label}
                      className="bg-card rounded-xl border border-border px-5 py-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                          {m.label}
                        </span>
                        {m.badge && (
                          <span
                            className="text-[11px] font-medium px-1.5 py-0.5 rounded"
                            style={
                              m.positive
                                ? { background: "#D1FAE5", color: "#059669" }
                                : { background: "#FEE2E2", color: "#DC2626" }
                            }
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-semibold text-foreground leading-none mb-1">
                        {m.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* ── Two-column grid ───────────────── */}
                <div className="grid grid-cols-12 gap-6">
                  {/* LEFT — 7/12 */}
                  <div className="col-span-7 space-y-6">
                    {/* Next Best Action */}
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                      <div className="border-b border-border px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={13} style={{ color: "#6366F1" }} />
                          <span
                            className="text-[11px] font-semibold tracking-wider uppercase"
                            style={{ color: "#6366F1" }}
                          >
                            Next Best Action
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Based on your roadmap</span>
                      </div>

                      <div className="px-6 py-5 flex items-start gap-5">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: "#EEF2FF" }}
                        >
                          <Play size={18} style={{ color: "#6366F1" }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h2 className="text-[15px] font-semibold text-foreground">
                            {careerReport?.nextAction?.title || "Complete JavaScript Arrays"}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {careerReport?.nextAction?.reason || "Master array methods — map, filter, reduce — essential for your React learning path."}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock size={12} />
                              {careerReport?.nextAction?.estimatedTime || "45 min"}
                            </span>
                            <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-md">
                              Intermediate
                            </span>
                            <span className="text-xs text-muted-foreground">Step 4 of 7</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveNav("Career")}
                          className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ background: "#6366F1" }}
                        >
                          Start learning
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Weekly Study Activity */}
                    <div className="bg-card rounded-xl border border-border px-6 py-5">
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">Weekly Study Activity</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            26.3 hrs this week · +12% vs last week
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {(["7D", "30D"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTimeRange(t)}
                              className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                                timeRange === t
                                  ? "font-medium"
                                  : "text-muted-foreground hover:bg-secondary"
                              }`}
                              style={
                                timeRange === t
                                  ? { background: "#EEF2FF", color: "#6366F1" }
                                  : {}
                              }
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <ResponsiveContainer width="100%" height={140}>
                        <BarChart
                          data={WEEK_DATA}
                          barSize={30}
                          margin={{ top: 0, right: 0, left: -24, bottom: 0 }}
                        >
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#9CA3AF" }}
                            tickFormatter={(v: number) => `${v}h`}
                          />
                          <Tooltip
                            cursor={{ fill: "#F9FAFB", radius: 4 }}
                            contentStyle={{
                              border: "1px solid #E5E7EB",
                              borderRadius: 8,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                              fontSize: 12,
                              padding: "6px 10px",
                              color: "#111827",
                            }}
                            formatter={(v: number) => [`${v}h`, "Study time"]}
                          />
                          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                            {WEEK_DATA.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={entry.today ? "#6366F1" : "#E0E7FF"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#6366F1" }} />
                          <span className="text-xs text-muted-foreground">Today</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#E0E7FF" }} />
                          <span className="text-xs text-muted-foreground">Past days</span>
                        </div>
                      </div>
                    </div>

                    {/* Academic Performance */}
                    <div className="bg-card rounded-xl border border-border px-6 py-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Academic Performance</h3>
                        <button
                          onClick={() => setActiveNav("Academics")}
                          className="text-xs font-medium cursor-pointer"
                          style={{ color: "#6366F1" }}
                        >
                          View details
                        </button>
                      </div>

                      <div className="space-y-0">
                        {SUBJECTS.map((s, i) => {
                          const gc = gradeColor(s.grade);
                          return (
                            <div
                              key={s.name}
                              className={`flex items-center gap-4 py-2.5 ${
                                i < SUBJECTS.length - 1 ? "border-b border-border" : ""
                              }`}
                            >
                              <span className="text-sm text-foreground font-medium w-44 truncate flex-shrink-0">
                                {s.name}
                              </span>

                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${s.score}%`,
                                      background: scoreBarColor(s.score),
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-6 text-right flex-shrink-0">
                                  {s.score}
                                </span>
                              </div>

                              <span
                                className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                                style={{ background: gc.bg, color: gc.text }}
                              >
                                {s.grade}
                              </span>

                              <span
                                className="flex items-center gap-0.5 text-xs w-8 flex-shrink-0"
                                style={{
                                  color:
                                    s.change > 0
                                      ? "#059669"
                                      : s.change < 0
                                      ? "#DC2626"
                                      : "#9CA3AF",
                                }}
                              >
                                {s.change > 0 ? (
                                  <ChevronUp size={12} />
                                ) : s.change < 0 ? (
                                  <ChevronDown size={12} />
                                ) : (
                                  <Minus size={12} />
                                )}
                                {s.change !== 0 && Math.abs(s.change)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT — 5/12 (Career Section) */}
                  <div className="col-span-5 space-y-6">
                    {/* Career Roadmap Card with AI Gap Analyzer integration */}
                    <div className="bg-card rounded-xl border border-border px-5 py-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles size={13} style={{ color: "#6366F1" }} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary" style={{ color: "#6366F1" }}>
                              AI Career Intelligence
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">Career Roadmap</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Toward {CURRENT_STUDENT.careerGoal}
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveNav("Career")}
                          className="text-xs font-medium cursor-pointer"
                          style={{ color: "#6366F1" }}
                        >
                          View full
                        </button>
                      </div>

                      {/* Prominent Analyze My Career Gap Button */}
                      <button
                        onClick={handleAnalyzeCareerGap}
                        disabled={careerStatus === "loading"}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-75 cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}
                      >
                        {careerStatus === "loading" ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Analyzing your career profile...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Analyze My Career Gap</span>
                          </>
                        )}
                      </button>

                      {/* Error state */}
                      {careerStatus === "error" && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 text-xs text-red-600 dark:text-red-300">
                          {careerError}
                        </div>
                      )}

                      {/* Success Results in Card */}
                      {careerReport && (
                        <div className="bg-secondary/40 border border-border rounded-xl p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">
                              Readiness Score: {careerReport.readiness?.overallScore ?? careerReport.readinessScore}/100
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#059669" }}>
                              {careerReport.currentLevel || "Intermediate"}
                            </span>
                          </div>

                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${careerReport.readiness?.overallScore ?? careerReport.readinessScore}%`,
                                background: scoreBarColor(careerReport.readiness?.overallScore ?? careerReport.readinessScore),
                              }}
                            />
                          </div>

                          {careerReport.prioritySkills && (
                            <div className="pt-1">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Top Missing Skill:</span>
                              <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mt-0.5">
                                • {careerReport.prioritySkills[0] || "Advanced Web Development"}
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => setActiveNav("Career")}
                            className="w-full text-center text-xs font-medium pt-1 text-primary hover:underline cursor-pointer"
                            style={{ color: "#6366F1" }}
                          >
                            Explore Full Gap Intelligence ➔
                          </button>
                        </div>
                      )}

                      {/* Original Figma Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">{roadmapPct}% complete</span>
                          <span className="text-muted-foreground">
                            {completedCount}/{ROADMAP.length} milestones
                          </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${roadmapPct}%`, background: "#6366F1" }}
                          />
                        </div>
                      </div>

                      {/* Original Figma Milestones */}
                      <div className="space-y-0.5">
                        {ROADMAP.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg"
                            style={item.current ? { background: "#EEF2FF" } : {}}
                          >
                            {item.done ? (
                              <CheckCircle2 size={14} style={{ color: "#6366F1" }} className="flex-shrink-0" />
                            ) : item.current ? (
                              <div
                                className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0"
                                style={{ borderColor: "#6366F1" }}
                              />
                            ) : (
                              <Circle size={14} className="text-border flex-shrink-0" />
                            )}

                            <span
                              className={`text-xs flex-1 ${
                                item.done
                                  ? "line-through text-muted-foreground"
                                  : item.current
                                  ? "font-medium"
                                  : "text-muted-foreground"
                              }`}
                              style={item.current ? { color: "#4338CA" } : {}}
                            >
                              {item.label}
                            </span>

                            {item.current && (
                              <span
                                className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded flex-shrink-0"
                                style={{ background: "#6366F1" }}
                              >
                                Next
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Study Assistant */}
                    <div className="bg-card rounded-xl border border-border px-5 py-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot size={14} style={{ color: "#6366F1" }} />
                        <h3 className="text-sm font-semibold text-foreground">AI Study Assistant</h3>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {QUICK_PROMPTS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setAiInput(p)}
                            className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full hover:bg-accent hover:text-primary transition-colors cursor-pointer"
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <input
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ask me anything about your studies..."
                          className="w-full text-sm bg-secondary border border-border rounded-lg px-3.5 py-2.5 pr-10 outline-none transition-colors placeholder:text-muted-foreground"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#6366F1";
                            e.currentTarget.style.background = "#fff";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "";
                            e.currentTarget.style.background = "";
                          }}
                        />
                        <button
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                          style={{ background: "#6366F1" }}
                        >
                          <Send size={11} className="text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Upcoming */}
                    <div className="bg-card rounded-xl border border-border px-5 py-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Upcoming</h3>
                        <button className="text-xs font-medium cursor-pointer" style={{ color: "#6366F1" }}>
                          View all
                        </button>
                      </div>

                      <div className="space-y-0">
                        {UPCOMING.map((item, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-3 py-3 ${
                              i < UPCOMING.length - 1 ? "border-b border-border" : ""
                            }`}
                          >
                            <div
                              className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                background: item.urgent
                                  ? "#EF4444"
                                  : item.type === "event"
                                  ? "#6366F1"
                                  : "#F59E0B",
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground font-medium leading-snug">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.due}</p>
                            </div>
                            <span
                              className="text-[11px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                              style={
                                item.type === "assignment"
                                  ? { background: "#FEF3C7", color: "#D97706" }
                                  : { background: "#EEF2FF", color: "#6366F1" }
                              }
                            >
                              {item.type === "assignment" ? "Task" : "Event"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
