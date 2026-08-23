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
  ShieldCheck,
} from "lucide-react";
import { ProductivityTask, NextBestAction } from "../../data/studentIntelligence";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";

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
      {/* 1. TOP METRICS                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <GlassSurface level={2} className="p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF2EB] dark:bg-[#28211A] text-[#8C532B] dark:text-[#D49E78] flex items-center justify-center flex-shrink-0">
            <Flame size={20} className="text-[#8C532B]" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#556B5F] dark:text-[#95AFA1] uppercase">Study Streak</span>
            <div className="text-xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{studyStreakDays} Days</div>
            <span className="text-[10px] text-[#4E7D63] dark:text-[#6E9B82] font-medium">Active Daily Habit</span>
          </div>
        </GlassSurface>

        {/* Focus Score */}
        <GlassSurface level={2} className="p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4F0] dark:bg-[#1E2F26] text-[#4E7D63] dark:text-[#6E9B82] flex items-center justify-center flex-shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#556B5F] dark:text-[#95AFA1] uppercase">Focus Score</span>
            <div className="text-xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{focusScore}/100</div>
            <span className="text-[10px] text-[#4E7D63] dark:text-[#6E9B82] font-medium">Top 10% Consistency</span>
          </div>
        </GlassSurface>

        {/* Daily Time Target */}
        <GlassSurface level={2} className="p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4F0] dark:bg-[#1E2F26] text-[#3B624E] dark:text-[#8EB7A0] flex items-center justify-center flex-shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#556B5F] dark:text-[#95AFA1] uppercase">Daily Study Time</span>
            <div className="text-xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">
              {todayStudyMinutes}m / {targetDailyMinutes}m
            </div>
            <span className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] font-medium">{progressPct}% of Daily Goal</span>
          </div>
        </GlassSurface>

        {/* Focus Sprints Completed */}
        <GlassSurface level={2} className="p-4.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] text-[#1C2E24] dark:text-[#F4F7F5] border border-[rgba(28,46,36,0.1)] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-[#4E7D63]" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#556B5F] dark:text-[#95AFA1] uppercase">Pomodoros Done</span>
            <div className="text-xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{completedSessionsToday} Sprints</div>
            <span className="text-[10px] text-[#4E7D63] dark:text-[#6E9B82] font-medium">+75m Deep Focus</span>
          </div>
        </GlassSurface>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. BEHAVIORAL PRODUCTIVITY TELEMETRY                           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={2} className="p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <GlassBadge
            label="Behavioral Productivity Telemetry"
            variant="primary"
            icon={<Sparkles size={11} className="text-[#4E7D63]" />}
          />
          <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">Automated Pattern Recognition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#FAF2EB] dark:bg-[#28211A] border border-[rgba(140,83,43,0.25)] p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#8C532B] dark:text-[#D49E78] font-bold">
              <AlertTriangle size={13} />
              <span>Procrastination Pattern Detected</span>
            </div>
            <p className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">Graph Algorithms Revision Overdue</p>
            <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
              Planned 3h of DSA this week with 45m done. Start with a 15-minute concept review to overcome inertia.
            </p>
          </div>

          <div className="bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.25)] p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#3B624E] dark:text-[#8EB7A0] font-bold">
              <TrendingUp size={13} />
              <span>Peak Focus Efficiency Window</span>
            </div>
            <p className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">Evening Block (6:30 PM - 9:00 PM)</p>
            <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
              Historical accuracy is 18% higher during evening sessions. Schedule complex System Design study here.
            </p>
          </div>

          <div className="bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.25)] p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#4E7D63] dark:text-[#6E9B82] font-bold">
              <Target size={13} />
              <span>Next-Best-Action Recommendation</span>
            </div>
            <p className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">Solve 3 Dijkstra Practice MCQs</p>
            <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
              Completing this practice session will boost your Graph Mastery from 42% to 60%.
            </p>
          </div>
        </div>
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. POMODORO FOCUS TIMER & SMART DAILY PLANNER                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pomodoro Stopwatch (5 Columns) */}
        <GlassSurface level={3} className="lg:col-span-5 p-6 flex flex-col justify-between items-center text-center space-y-5">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight">Deep Work Focus Instrument</h3>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1]">Build intense learning momentum with distraction-free intervals</p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#EAE6DE] dark:bg-[#142019] p-1 rounded-xl border border-[rgba(28,46,36,0.08)]">
            <button
              onClick={() => handleSetMode("work")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timerMode === "work" ? "bg-[#1C2E24] dark:bg-[#4E7D63] text-[#FBFBF9] shadow-2xs" : "text-[#556B5F] hover:text-[#1C2E24]"
              }`}
            >
              Focus 25m
            </button>
            <button
              onClick={() => handleSetMode("short_break")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timerMode === "short_break" ? "bg-[#1C2E24] dark:bg-[#4E7D63] text-[#FBFBF9] shadow-2xs" : "text-[#556B5F] hover:text-[#1C2E24]"
              }`}
            >
              Break 5m
            </button>
            <button
              onClick={() => handleSetMode("long_break")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timerMode === "long_break" ? "bg-[#1C2E24] dark:bg-[#4E7D63] text-[#FBFBF9] shadow-2xs" : "text-[#556B5F] hover:text-[#1C2E24]"
              }`}
            >
              Long 15m
            </button>
          </div>

          {/* Clock Display */}
          <div className="relative py-2">
            <span className="text-6xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono tracking-tight">
              {formatTime(timerSeconds)}
            </span>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2.5">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              <span>{isRunning ? "Pause Sprint" : "Start Focus"}</span>
            </GlassButton>

            <button
              onClick={() => handleSetMode(timerMode)}
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] hover:bg-[#EAE6DE] border border-[rgba(28,46,36,0.1)] flex items-center justify-center text-[#556B5F] hover:text-[#1C2E24] cursor-pointer transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </GlassSurface>

        {/* Smart Daily Task Planner (7 Columns) */}
        <GlassSurface level={2} className="lg:col-span-7 p-5 flex flex-col justify-between space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Smart Daily Priority Tasks</h3>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Auto-generated from weak topics & revision alerts</p>
            </div>
            <GlassBadge
              label={`${dailyTasks.filter((t) => t.completed).length}/${dailyTasks.length} Done`}
              variant="success"
            />
          </div>

          {/* Add Task Input */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Add custom task or revision note..."
              className="flex-1 bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] rounded-xl px-3.5 py-1.5 text-xs outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] placeholder:text-[#7C9184]"
            />
            <GlassButton variant="primary" size="sm" type="submit">
              <Plus size={12} />
              <span>Add</span>
            </GlassButton>
          </form>

          {/* Task List */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto no-scroll pr-0.5">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                  task.completed
                    ? "bg-[#FAF8F5]/60 dark:bg-[#17241D]/40 border-[rgba(28,46,36,0.04)] text-[#7C9184] line-through opacity-70"
                    : "bg-[#FAF8F5] dark:bg-[#17241D] hover:bg-[#FAF8F5] border-[rgba(28,46,36,0.08)] text-[#1C2E24] dark:text-[#F4F7F5]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {task.completed ? (
                    <CheckCircle2 size={16} className="text-[#4E7D63] flex-shrink-0" />
                  ) : (
                    <Circle size={16} className="text-[#7C9184] flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold block">{task.title}</span>
                    <span className="text-[10px] text-[#556B5F] dark:text-[#95AFA1]">
                      {task.category} • ~{task.durationMinutes} mins
                    </span>
                  </div>
                </div>

                <GlassBadge
                  label={task.priority}
                  variant={task.priority === "High" ? "danger" : "default"}
                />
              </div>
            ))}
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
