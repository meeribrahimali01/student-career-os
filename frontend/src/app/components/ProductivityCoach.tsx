import React, { useState, useEffect } from "react";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Flame,
  AlertTriangle,
  TrendingUp,
  Target,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ProductivityTask, NextBestAction } from "../../data/studentIntelligence";

interface ProductivityCoachProps {
  studyStreakDays: number;
  focusScore: number;
  todayStudyMinutes: number;
  targetDailyMinutes: number;
  nextBestActions: NextBestAction[];
  onCompleteAction?: (actionId: string) => void;
  onLaunchRoadmapQuiz?: (topicId: string) => void;
}

export default function ProductivityCoach({
  studyStreakDays,
  focusScore,
  todayStudyMinutes,
  targetDailyMinutes,
  nextBestActions,
  onCompleteAction,
  onLaunchRoadmapQuiz,
}: ProductivityCoachProps) {
  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<"work" | "short_break" | "long_break">("work");
  const [completedSessionsToday, setCompletedSessionsToday] = useState(3);

  // Daily Tasks State
  const [dailyTasks, setDailyTasks] = useState<ProductivityTask[]>([
    { id: "task_1", title: "Practice 5 Dijkstra & Graph questions", category: "DSA", priority: "High", durationMinutes: 30, completed: false, dueDate: "Today" },
    { id: "task_2", title: "Review Operating Systems Virtual Memory Notes", category: "Core CS", priority: "Medium", durationMinutes: 25, completed: true, dueDate: "Today" },
    { id: "task_3", title: "Complete System Design Caching & Redis Quiz", category: "Architecture", priority: "High", durationMinutes: 20, completed: false, dueDate: "Today" },
    { id: "task_4", title: "Mock Interview Technical Breakdown", category: "Interview", priority: "Low", durationMinutes: 15, completed: false, dueDate: "Tomorrow" },
  ]);

  const [newTaskInput, setNewTaskInput] = useState("");

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
      setCompletedSessionsToday((prev) => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSetMode = (mode: "work" | "short_break" | "long_break") => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === "work") setTimerSeconds(25 * 60);
    else if (mode === "short_break") setTimerSeconds(5 * 60);
    else setTimerSeconds(15 * 60);
  };

  const handleToggleTask = (id: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: ProductivityTask = {
      id: `task_${Date.now()}`,
      title: newTaskInput.trim(),
      category: "Personal Study",
      priority: "Medium",
      durationMinutes: 25,
      completed: false,
      dueDate: "Today",
    };
    setDailyTasks((prev) => [newTask, ...prev]);
    setNewTaskInput("");
  };

  const progressPct = Math.round((todayStudyMinutes / targetDailyMinutes) * 100);

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP METRICS & PROCRASTINATION INTELLIGENCE RADAR            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Study Streak</span>
            <div className="text-xl font-black text-foreground font-mono">{studyStreakDays} Days 🔥</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active Daily Habit</span>
          </div>
        </div>

        {/* Focus Score */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Zap size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Focus Score</span>
            <div className="text-xl font-black text-foreground font-mono">{focusScore}/100</div>
            <span className="text-[10px] text-primary font-semibold">Top 10% Consistency</span>
          </div>
        </div>

        {/* Daily Time Target */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Daily Study Time</span>
            <div className="text-xl font-black text-foreground font-mono">
              {todayStudyMinutes}m / {targetDailyMinutes}m
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold">{progressPct}% of Daily Goal</span>
          </div>
        </div>

        {/* Focus Sprints Completed */}
        <div className="bg-card border border-border p-5 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Pomodoros Done</span>
            <div className="text-xl font-black text-foreground font-mono">{completedSessionsToday} Sprints</div>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">+75m Deep Focus</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. AI PROCRASTINATION COACH ALERTS & BEHAVIORAL INSIGHTS       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <Sparkles size={12} />
            Behavioral Productivity Telemetry
          </span>
          <span className="text-xs text-muted-foreground">Automated Habit Pattern Recognition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle size={14} />
              <span>Procrastination Pattern Detected</span>
            </div>
            <p className="text-foreground font-semibold">Graph Algorithms Revision Overdue</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              You planned 3 hours of DSA this week but completed 45 minutes. Start with a quick 15-minute concept review to overcome inertia.
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingUp size={14} />
              <span>Peak Focus Efficiency Window</span>
            </div>
            <p className="text-foreground font-semibold">Evening Block (6:30 PM - 9:00 PM)</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Your historical quiz accuracy is 18% higher during evening sessions. Schedule complex System Design study here.
            </p>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <Target size={14} />
              <span>Next-Best-Action Recommendation</span>
            </div>
            <p className="text-foreground font-semibold">Solve 3 Dijkstra Practice MCQs</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Completing this practice session will boost your Graph Mastery from 42% to 60%.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. POMODORO FOCUS TIMER & SMART DAILY PLANNER                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pomodoro Stopwatch (5 Columns) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between items-center text-center space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Deep Work Focus Sprint</h3>
            <p className="text-[11px] text-muted-foreground">Block distractions and build intense learning momentum</p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-xl">
            <button
              onClick={() => handleSetMode("work")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timerMode === "work" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Focus 25m
            </button>
            <button
              onClick={() => handleSetMode("short_break")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timerMode === "short_break" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Short Break 5m
            </button>
            <button
              onClick={() => handleSetMode("long_break")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timerMode === "long_break" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Long Break 15m
            </button>
          </div>

          {/* Giant Digital Clock */}
          <div className="relative py-4">
            <span className="text-6xl font-black text-foreground font-mono tracking-tight">
              {formatTime(timerSeconds)}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning((prev) => !prev)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-95 shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              <span>{isRunning ? "Pause Sprint" : "Start Focus"}</span>
            </button>
            <button
              onClick={() => handleSetMode(timerMode)}
              className="w-9 h-9 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Smart Daily Task Planner (7 Columns) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Smart Daily Priority Tasks</h3>
              <p className="text-[11px] text-muted-foreground">Auto-generated from your weak topics & revision alerts</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {dailyTasks.filter((t) => t.completed).length}/{dailyTasks.length} Completed
            </span>
          </div>

          {/* Add Task Input */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Add custom task or revision note..."
              className="flex-1 bg-secondary border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary text-foreground"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-2 max-h-60 overflow-y-auto no-scroll pr-1">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                  task.completed
                    ? "bg-secondary/40 border-border/50 text-muted-foreground line-through"
                    : "bg-card hover:bg-secondary/60 border-border text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {task.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle size={16} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold block">{task.title}</span>
                    <span className="text-[10px] opacity-70">
                      {task.category} • ~{task.durationMinutes} mins
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    task.priority === "High"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
