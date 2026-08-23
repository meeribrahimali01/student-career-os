import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Edit3,
  Save,
} from "lucide-react";
import { StudentProfileData } from "../../data/studentIntelligence";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";

interface StudentProfileProps {
  profile: StudentProfileData;
  onUpdateProfile?: (updated: StudentProfileData) => void;
}

export default function StudentProfile({ profile, onUpdateProfile }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfileData>(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onUpdateProfile?.(formData);
  };

  const getProficiencyLabel = (level: number) => {
    if (level >= 85) return { label: "Advanced", color: "bg-[#EDF4F0] text-[#3B624E] border-[rgba(78,125,99,0.3)]" };
    if (level >= 65) return { label: "Proficient", color: "bg-[#F2EFE9] text-[#1C2E24] border-[rgba(28,46,36,0.15)]" };
    return { label: "Developing", color: "bg-[#FAF2EB] text-[#8C532B] border-[rgba(140,83,43,0.3)]" };
  };

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP STUDENT IDENTITY SURFACE                                */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={2} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[#FBFBF9] bg-[#1C2E24] dark:bg-[#203429] text-xl font-bold shadow-xs flex-shrink-0">
            <span>{formData.name.slice(0, 1)}</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{formData.name}</h1>
              <GlassBadge label="Verified Student" variant="primary" icon={<ShieldCheck size={11} className="text-[#4E7D63]" />} />
            </div>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">
              {formData.rollNumber} • {formData.branch} • Semester {formData.semester}
            </p>
            <p className="text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5]">{formData.college}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <Edit3 size={13} />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </GlassButton>
        </div>
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. EDIT FORM OR PROFILE DETAILS                                */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {isEditing ? (
        <GlassSurface level={3} className="p-5 space-y-3.5">
          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-[rgba(28,46,36,0.08)] pb-2.5">
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Edit Student Profile Details</h3>
              <GlassButton
                type="submit"
                variant="primary"
                size="sm"
              >
                <Save size={13} />
                <span>Save Changes</span>
              </GlassButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#556B5F] font-semibold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-xl px-3 py-1.5 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#556B5F] font-semibold">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-xl px-3 py-1.5 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#556B5F] font-semibold">Target Career Goal</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-xl px-3 py-1.5 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#556B5F] font-semibold">GitHub Profile URL</label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-xl px-3 py-1.5 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#556B5F] font-semibold">LinkedIn URL</label>
                <input
                  type="text"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-xl px-3 py-1.5 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[#556B5F] font-semibold">LeetCode Profile URL</label>
                <input
                  type="text"
                  value={formData.leetcodeProfile}
                  onChange={(e) => setFormData({ ...formData, leetcodeProfile: e.target.value })}
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-xl px-3 py-1.5 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5]"
                />
              </div>
            </div>
          </form>
        </GlassSurface>
      ) : null}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. VERIFIED TECHNICAL SKILL PROFICIENCY MAP                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Technical Skills Map (7 Columns) */}
        <GlassSurface level={2} className="lg:col-span-7 p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Verified Skill Competency Map</h3>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Proficiency scores derived from assessments and coursework</p>
            </div>
            <GlassBadge label={`${formData.skills.length} Tracked Skills`} variant="primary" />
          </div>

          <div className="space-y-2.5">
            {formData.skills.map((skill, idx) => {
              const prof = getProficiencyLabel(skill.level);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#1C2E24] dark:text-[#F4F7F5]">{skill.name}</span>
                      {skill.verified && <CheckCircle2 size={12} className="text-[#4E7D63]" />}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${prof.color}`}>
                        {prof.label}
                      </span>
                      <span className="font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{skill.level}%</span>
                    </div>
                  </div>

                  <div className="h-2 bg-[#E8E4DC] dark:bg-[#1D2E24] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4E7D63] transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassSurface>

        {/* Academic Profile & Links (5 Columns) */}
        <GlassSurface level={2} className="lg:col-span-5 p-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Academic Standing & Portfolios</h3>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">External professional profiles & credentials</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#556B5F] block font-bold uppercase">CURRENT CGPA</span>
                  <span className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{formData.cgpa} / 10.00</span>
                </div>
                <GlassBadge label="Top 5% Cohort" variant="success" />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#556B5F] block font-bold uppercase">TARGET ROLE</span>
                  <span className="text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5]">{formData.targetRole}</span>
                </div>
                <Briefcase size={14} className="text-[#4E7D63]" />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-1.5 pt-2 border-t border-[rgba(28,46,36,0.08)]">
              <a
                href={formData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] hover:bg-[#EAE6DE] border border-[rgba(28,46,36,0.08)] flex items-center justify-between text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] transition-colors"
              >
                <span>GitHub Developer Profile</span>
                <ExternalLink size={12} className="text-[#556B5F]" />
              </a>
              <a
                href={formData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] hover:bg-[#EAE6DE] border border-[rgba(28,46,36,0.08)] flex items-center justify-between text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] transition-colors"
              >
                <span>LinkedIn Professional Profile</span>
                <ExternalLink size={12} className="text-[#556B5F]" />
              </a>
              <a
                href={formData.leetcodeProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] hover:bg-[#EAE6DE] border border-[rgba(28,46,36,0.08)] flex items-center justify-between text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] transition-colors"
              >
                <span>LeetCode Problem Solving Rank</span>
                <ExternalLink size={12} className="text-[#556B5F]" />
              </a>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
