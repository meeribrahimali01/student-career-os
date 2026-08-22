import React, { useState } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { StudentProfileData } from "../../data/studentIntelligence";

interface StudentProfileProps {
  profile: StudentProfileData;
  onUpdateProfile: (updated: StudentProfileData) => void;
}

export default function StudentProfile({ profile, onUpdateProfile }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfileData>(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const getProficiencyLabel = (level: number) => {
    if (level >= 85) return { label: "Expert", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (level >= 70) return { label: "Advanced", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" };
    if (level >= 50) return { label: "Intermediate", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    return { label: "Beginner", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
  };

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP STUDENT IDENTITY CARD                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
          >
            {formData.name.slice(0, 1)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-foreground">{formData.name}</h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.rollNumber} • {formData.branch} • Semester {formData.semester}
            </p>
            <p className="text-xs font-medium text-foreground">{formData.college}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit3 size={13} />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. EDIT FORM OR PROFILE DETAILS                                */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-foreground">Edit Student Profile Details</h3>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save size={13} />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">Target Career Goal</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">LinkedIn URL</label>
              <input
                type="text"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-foreground font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">LeetCode Profile URL</label>
              <input
                type="text"
                value={formData.leetcodeProfile}
                onChange={(e) => setFormData({ ...formData, leetcodeProfile: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 outline-none focus:border-primary text-foreground font-semibold"
              />
            </div>
          </div>
        </form>
      ) : null}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. VERIFIED TECHNICAL SKILL PROFICIENCY MAP                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Technical Skills Map (7 Columns) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Verified Skill Competency Map</h3>
              <p className="text-[11px] text-muted-foreground">Proficiency scores derived from assessments and coursework</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              {formData.skills.length} Tracked Skills
            </span>
          </div>

          <div className="space-y-3">
            {formData.skills.map((skill, idx) => {
              const prof = getProficiencyLabel(skill.level);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{skill.name}</span>
                      {skill.verified && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${prof.color}`}>
                        {prof.label}
                      </span>
                      <span className="font-bold text-foreground">{skill.level}%</span>
                    </div>
                  </div>

                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Profile & Links (5 Columns) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-foreground">Academic Standing & Portfolios</h3>
              <p className="text-[11px] text-muted-foreground">External professional profiles & credentials</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">CURRENT CGPA</span>
                  <span className="text-base font-black text-foreground font-mono">{formData.cgpa} / 10.00</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Top 5% Cohort
                </span>
              </div>

              <div className="p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">TARGET ROLE</span>
                  <span className="text-xs font-bold text-foreground">{formData.targetRole}</span>
                </div>
                <Briefcase size={15} className="text-primary" />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2 pt-2 border-t border-border">
              <a
                href={formData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-between text-xs font-semibold text-foreground transition-all"
              >
                <span>GitHub Developer Profile</span>
                <ExternalLink size={12} className="text-muted-foreground" />
              </a>
              <a
                href={formData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-between text-xs font-semibold text-foreground transition-all"
              >
                <span>LinkedIn Professional Profile</span>
                <ExternalLink size={12} className="text-muted-foreground" />
              </a>
              <a
                href={formData.leetcodeProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-between text-xs font-semibold text-foreground transition-all"
              >
                <span>LeetCode Problem Solving Rank</span>
                <ExternalLink size={12} className="text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
