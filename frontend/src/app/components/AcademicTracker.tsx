import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
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
} from "recharts";
import { AcademicSubject } from "../../data/studentIntelligence";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CGPA & Standing Card (4 Columns) */}
        <GlassSurface level={3} className="lg:col-span-4 p-5 flex flex-col justify-between space-y-3.5">
          <div className="space-y-1">
            <GlassBadge label="VIT Chennai • Semester 5" variant="primary" />
            <h2 className="text-lg font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight pt-0.5">Academic Standing</h2>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1]">Department of Computer Science & Engineering</p>
          </div>

          <div className="flex items-baseline gap-2.5 my-1">
            <span className="text-4xl lg:text-5xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono tracking-tight">{cgpa.toFixed(2)}</span>
            <span className="text-xs font-semibold text-[#556B5F] dark:text-[#95AFA1] font-mono">/ 10.00</span>
            <GlassBadge label="+0.05 vs S4" variant="success" icon={<ArrowUpRight size={11} />} />
          </div>

          <div className="space-y-1.5 pt-2.5 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] text-xs">
            <div className="flex justify-between text-[#556B5F] dark:text-[#95AFA1]">
              <span>Earned Credits:</span>
              <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-mono">96 / 160 Credits</strong>
            </div>
            <div className="flex justify-between text-[#556B5F] dark:text-[#95AFA1]">
              <span>Active Backlogs:</span>
              <strong className="text-[#3B624E] dark:text-[#8EB7A0]">0 (Clean Record)</strong>
            </div>
            <div className="flex justify-between text-[#556B5F] dark:text-[#95AFA1]">
              <span>Placement Eligibility:</span>
              <strong className="text-[#4E7D63] dark:text-[#6E9B82] flex items-center gap-1">
                <ShieldCheck size={13} /> Super Dream (9.0+ CTC)
              </strong>
            </div>
          </div>
        </GlassSurface>

        {/* Dynamic Academic Performance Insights (8 Columns) */}
        <GlassSurface level={2} className="lg:col-span-8 p-5 flex flex-col justify-between space-y-3.5">
          <div>
            <div className="flex items-center gap-2 text-[#4E7D63] dark:text-[#6E9B82] text-xs font-bold mb-0.5">
              <Sparkles size={13} />
              <span>Automated Academic Performance Insights</span>
            </div>
            <h3 className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Semester 5 Telemetry & Core Alerts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Insight 1: Highest Subject */}
            <div className="bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.25)] p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#3B624E] dark:text-[#8EB7A0] font-bold">
                <CheckCircle2 size={13} />
                <span>Top Subject Performance</span>
              </div>
              <p className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">{highestSubject?.name} ({highestSubject?.score}%)</p>
              <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-tight">
                {highestSubject?.name} improved by +{highestSubject?.trendDelta}% following recent practice.
              </p>
            </div>

            {/* Insight 2: Lowest Subject */}
            <div className="bg-[#FAF2EB] dark:bg-[#28211A] border border-[rgba(140,83,43,0.25)] p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#8C532B] dark:text-[#D49E78] font-bold">
                <AlertTriangle size={13} />
                <span>Lowest Core Subject</span>
              </div>
              <p className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">{lowestSubject?.name} ({lowestSubject?.score}%)</p>
              <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-tight">
                Operating Systems is lowest scoring subject. Recommended revision in Roadmap.
              </p>
            </div>

            {/* Insight 3: Attendance Threshold Warning */}
            <div className="bg-[#F9EBE8] dark:bg-[#281B18] border border-[rgba(158,77,59,0.25)] p-3.5 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#9E4D3B] dark:text-[#E28876] font-bold">
                <Clock size={13} />
                <span>Attendance Alert</span>
              </div>
              <p className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">{attendanceWarningSubject?.name} ({attendanceWarningSubject?.attendancePct}%)</p>
              <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-tight">
                Attendance at {attendanceWarningSubject?.attendancePct}%, near 75% mandatory threshold.
              </p>
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            {lowestSubject && (
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => onNavigateToRoadmap?.("os")}
              >
                <span>Practice Lowest Subject ({lowestSubject.name.split(" ")[0]}) in Roadmap</span>
                <ArrowUpRight size={12} />
              </GlassButton>
            )}
          </div>
        </GlassSurface>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. SGPA PROGRESSION LINE CHART & GRADEBOOK TABLE               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Semester SGPA Trend Chart (5 Columns) */}
        <GlassSurface level={2} className="lg:col-span-5 p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">SGPA & CGPA Progression Trend</h3>
            <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Historical trajectory over 5 undergraduate semesters</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEMESTER_TRENDS} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
                <XAxis dataKey="sem" stroke="#7C9184" fontSize={10} tickLine={false} />
                <YAxis domain={[7.5, 10.0]} stroke="#7C9184" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F2EFE9",
                    borderColor: "rgba(28, 46, 36, 0.15)",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "#1C2E24",
                  }}
                />
                <Line type="monotone" dataKey="sgpa" name="Semester SGPA" stroke="#4E7D63" strokeWidth={2.5} dot={{ r: 4, fill: "#4E7D63" }} />
                <Line type="monotone" dataKey="cgpa" name="Cumulative CGPA" stroke="#1C2E24" strokeWidth={1.8} strokeDasharray="3 3" dot={{ r: 3, fill: "#1C2E24" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassSurface>

        {/* Semester 5 Detailed Gradebook (7 Columns) */}
        <GlassSurface level={2} className="lg:col-span-7 p-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Current Semester Course Gradebook</h3>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Internal assessments, marks, and attendance compliance</p>
            </div>
            <GlassBadge label="5 Courses" variant="primary" />
          </div>

          <div className="overflow-x-auto no-scroll">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(28,46,36,0.08)] text-[10px] text-[#556B5F] dark:text-[#95AFA1] font-bold uppercase tracking-wider bg-[#FAF8F5] dark:bg-[#17241D]">
                  <th className="py-2 px-3">Course</th>
                  <th className="py-2 px-2">Credits</th>
                  <th className="py-2 px-2">Internals</th>
                  <th className="py-2 px-2">Score</th>
                  <th className="py-2 px-2">Grade</th>
                  <th className="py-2 px-3">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(28,46,36,0.06)]">
                {subjects.map((sub) => (
                  <tr key={sub.code} className="hover:bg-[#FAF8F5] dark:hover:bg-[#1C2C23] transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-semibold text-[#1C2E24] dark:text-[#F4F7F5]">{sub.name}</div>
                      <div className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] font-mono">{sub.code}</div>
                    </td>
                    <td className="py-2 px-2 font-mono text-[#556B5F]">{sub.credits}</td>
                    <td className="py-2 px-2 font-mono text-[#556B5F]">{sub.internalMarks}/50</td>
                    <td className="py-2 px-2 font-bold font-mono text-[#1C2E24] dark:text-[#F4F7F5]">{sub.score}%</td>
                    <td className="py-2 px-2 font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          sub.grade === "S" || sub.grade === "A+"
                            ? "bg-[#EDF4F0] text-[#3B624E]"
                            : sub.grade === "A"
                            ? "bg-[#F2EFE9] text-[#1C2E24] border border-[rgba(28,46,36,0.15)]"
                            : "bg-[#FAF2EB] text-[#8C532B]"
                        }`}
                      >
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold">
                      <span
                        className={`text-xs font-mono ${
                          sub.attendancePct < 80 ? "text-[#9E4D3B] font-bold" : "text-[#1C2E24] dark:text-[#F4F7F5]"
                        }`}
                      >
                        {sub.attendancePct}%
                      </span>
                      {sub.attendancePct < 80 && (
                        <span className="text-[9px] text-[#9E4D3B] block">Warning</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
