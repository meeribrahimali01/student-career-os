import React from "react";
import {
  Briefcase,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  ExternalLink,
  Code2,
  BookOpen,
  MessageSquare,
  Flame,
} from "lucide-react";
import { StudentProfileData } from "../../data/studentIntelligence";

interface PlacementPrepProps {
  profile: StudentProfileData;
  onNavigateToCareerGap?: () => void;
  onNavigateToInterview?: () => void;
}

export default function PlacementPrep({
  profile,
  onNavigateToCareerGap,
  onNavigateToInterview,
}: PlacementPrepProps) {
  const readinessMetrics = [
    { label: "Data Structures & Algorithms", score: 72, target: 85, weight: "30%", color: "#4F46E5" },
    { label: "Core CS (OS, DBMS, CN)", score: 64, target: 80, weight: "20%", color: "#06B6D4" },
    { label: "Production Full Stack Projects", score: 85, target: 80, weight: "20%", color: "#10B981" },
    { label: "Resume ATS Score", score: 90, target: 85, weight: "10%", color: "#8B5CF6" },
    { label: "Technical Communication", score: 61, target: 75, weight: "10%", color: "#F59E0B" },
    { label: "Mock Technical Screening", score: 58, target: 80, weight: "10%", color: "#EF4444" },
  ];

  const overallScore = Math.round(
    readinessMetrics.reduce((acc, m) => acc + (m.score * parseInt(m.weight)) / 100, 0)
  );

  const placementTiers = [
    { tier: "Super Dream Tier", ctc: "12 - 45+ LPA", companies: ["Google", "Microsoft", "Amazon", "Atlassian", "Uber"], status: "On Track (72% Match)" },
    { tier: "Dream Tier", ctc: "6 - 12 LPA", companies: ["Oracle", "Cisco", "Deloitte", "Samsung", "Societe Generale"], status: "Eligible (88% Match)" },
    { tier: "Standard Tier", ctc: "4 - 6 LPA", companies: ["TCS Digital", "Wipro Turbo", "Infosys SP", "Accenture"], status: "100% Eligible" },
  ];

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP PLACEMENT READINESS HERO                                */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <ShieldCheck size={12} />
                VIT Chennai Placement Readiness Engine
              </span>
              <span className="text-xs text-muted-foreground">Placement Cohort 2026-2027</span>
            </div>

            <h1 className="text-xl lg:text-2xl font-black text-foreground">
              Placement & Career Intelligence Portal
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tracking your comprehensive readiness benchmark for <strong className="text-foreground">{profile.targetRole}</strong> across FAANG/Tier-1 Super Dream standards.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={onNavigateToCareerGap}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              >
                <Sparkles size={13} />
                <span>Run Deep Career Gap Analysis</span>
              </button>
              <button
                onClick={onNavigateToInterview}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground bg-secondary hover:bg-secondary/80 border border-border flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>Launch Mock Interview Studio</span>
              </button>
            </div>
          </div>

          {/* Concentric Placement Readiness Score Box */}
          <div className="flex items-center gap-5 bg-secondary/50 border border-border p-5 rounded-2xl">
            <div className="text-center space-y-1">
              <span className="text-4xl font-black text-foreground font-mono">{overallScore}%</span>
              <span className="text-[10px] font-bold text-primary uppercase block">Overall Readiness</span>
            </div>
            <div className="text-xs space-y-1 border-l border-border pl-4">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> Tier-1 Placement Ready
              </div>
              <p className="text-[11px] text-muted-foreground">
                Strong projects & resume. Recommended improvement in Mock Interviews & Operating Systems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. PLACEMENT READINESS RADAR METRICS & COMPANY TIERS           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Readiness Breakdown Bars (7 Columns) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Core Competency Assessment</h3>
              <p className="text-[11px] text-muted-foreground">Weighted benchmark scores against target role requirements</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
              6 Assessment Dimensions
            </span>
          </div>

          <div className="space-y-3.5">
            {readinessMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({item.weight} weight)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-foreground">{item.score}%</span>
                    <span className="text-[10px] text-muted-foreground">Target: {item.target}%</span>
                  </div>
                </div>

                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Eligibility Tiers (5 Columns) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Campus Placement Tiers</h3>
            <p className="text-[11px] text-muted-foreground">CTC package categories & matching target companies</p>
          </div>

          <div className="space-y-2.5">
            {placementTiers.map((t, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-secondary/50 border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{t.tier}</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
                    {t.ctc}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <strong>Companies:</strong> {t.companies.join(", ")}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {t.status}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToInterview}
              className="w-full py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Practice Target Role Questions</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
