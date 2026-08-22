import React from "react";
import {
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { AcademicSubject } from "../../data/studentIntelligence";

interface AcademicTrackerProps {
  subjects: AcademicSubject[];
  cgpa: number;
  onNavigateToRoadmap?: (topicId: string) => void;
}

const SEMESTER_TRENDS = [
  { sem: "Sem 1", sgpa: 8.2, cgpa: 8.2 },
  { sem: "Sem 2", sgpa: 8.4, cgpa: 8.3 },
  { sem: "Sem 3", sgpa: 8.7, cgpa: 8.43 },
  { sem: "Sem 4", sgpa: 8.9, cgpa: 8.55 },
  { sem: "Sem 5 (Current)", sgpa: 8.8, cgpa: 8.6 },
];

export default function AcademicTracker({ subjects, cgpa, onNavigateToRoadmap }: AcademicTrackerProps) {
  const lowestSubject = [...subjects].sort((a, b) => a.score - b.score)[0];
  const highestSubject = [...subjects].sort((a, b) => b.score - a.score)[0];
  const attendanceWarningSubject = subjects.find((s) => s.attendancePct < 80);

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP ACADEMIC SUMMARY & PERFORMANCE INSIGHTS BANNER          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CGPA & Standing Card (4 Columns) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                VIT Chennai • Semester 5
              </span>
            </div>
            <h2 className="text-2xl font-black text-foreground">Cumulative Grade Point</h2>
            <p className="text-xs text-muted-foreground">Department of Computer Science & Engineering</p>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-black text-foreground font-mono">{cgpa.toFixed(2)}</span>
            <span className="text-sm font-bold text-muted-foreground">/ 10.00</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight size={13} /> +0.05 vs S4
            </span>
          </div>

          <div className="space-y-2 pt-3 border-t border-border text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Total Earned Credits:</span>
              <strong className="text-foreground">96 / 160 Credits</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Active Backlogs:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">0 (Clean Record)</strong>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Placement Eligibility:</span>
              <strong className="text-primary flex items-center gap-1">
                <ShieldCheck size={13} /> Super Dream (9.0+ CTC)
              </strong>
            </div>
          </div>
        </div>

        {/* Dynamic Academic AI Insights (8 Columns) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold mb-1">
              <Sparkles size={14} />
              <span>Automated Academic Performance Insights</span>
            </div>
            <h3 className="text-base font-black text-foreground">Semester 5 Telemetry & Core Alerts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Insight 1: Highest Subject */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 size={14} />
                <span>Top Subject Performance</span>
              </div>
              <p className="text-foreground font-semibold">{highestSubject?.name} ({highestSubject?.score}%)</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {highestSubject?.name} improved by +{highestSubject?.trendDelta}% following recent coursework practice.
              </p>
            </div>

            {/* Insight 2: Lowest Subject */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <AlertTriangle size={14} />
                <span>Lowest Core Subject</span>
              </div>
              <p className="text-foreground font-semibold">{lowestSubject?.name} ({lowestSubject?.score}%)</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Operating Systems is your lowest scoring core subject. Recommended revision in Study Roadmap.
              </p>
            </div>

            {/* Insight 3: Attendance Threshold Warning */}
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                <Clock size={14} />
                <span>Attendance Alert</span>
              </div>
              <p className="text-foreground font-semibold">{attendanceWarningSubject?.name} ({attendanceWarningSubject?.attendancePct}%)</p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Attendance is at {attendanceWarningSubject?.attendancePct}%, approaching the 75% mandatory threshold.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            {lowestSubject && (
              <button
                onClick={() => onNavigateToRoadmap?.("os")}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Practice Lowest Subject ({lowestSubject.name.split(" ")[0]}) in Roadmap</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. SGPA PROGRESSION LINE CHART & GRADEBOOK TABLE               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Semester SGPA Trend Chart (5 Columns) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">SGPA & CGPA Progression Trend</h3>
            <p className="text-[11px] text-muted-foreground">Historical trajectory over 5 undergraduate semesters</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEMESTER_TRENDS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="sem" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis domain={[7.5, 10.0]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "11px", color: "#F8FAFC" }}
                />
                <Line type="monotone" dataKey="sgpa" name="Semester SGPA" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cgpa" name="Cumulative CGPA" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester 5 Detailed Gradebook (7 Columns) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Current Semester Course Gradebook</h3>
              <p className="text-[11px] text-muted-foreground">Internal assessments, marks, and attendance compliance</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
              5 Courses Enrolled
            </span>
          </div>

          <div className="overflow-x-auto no-scroll">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-secondary/30">
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-2">Credits</th>
                  <th className="py-2.5 px-2">Internals</th>
                  <th className="py-2.5 px-2">Score</th>
                  <th className="py-2.5 px-2">Grade</th>
                  <th className="py-2.5 px-3">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-foreground">{sub.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{sub.code}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono">{sub.credits}</td>
                    <td className="py-2.5 px-2 font-mono text-muted-foreground">{sub.internalMarks}/50</td>
                    <td className="py-2.5 px-2 font-bold font-mono text-foreground">{sub.score}%</td>
                    <td className="py-2.5 px-2 font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sub.grade === "S" || sub.grade === "A+"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : sub.grade === "A"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      <span
                        className={`text-xs font-mono ${
                          sub.attendancePct < 80 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-foreground"
                        }`}
                      >
                        {sub.attendancePct}%
                      </span>
                      {sub.attendancePct < 80 && (
                        <span className="text-[9px] text-rose-500 block">Warning</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
