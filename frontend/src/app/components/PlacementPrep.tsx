import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { StudentProfileData } from "../../data/studentIntelligence";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";

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
    { label: "Data Structures & Algorithms", score: 72, target: 85, weight: "30%", color: "#4E7D63" },
    { label: "Core CS (OS, DBMS, CN)", score: 64, target: 80, weight: "20%", color: "#3B624E" },
    { label: "Production Full Stack Projects", score: 85, target: 80, weight: "20%", color: "#1C2E24" },
    { label: "Resume ATS Score", score: 90, target: 85, weight: "10%", color: "#6E9B82" },
    { label: "Technical Communication", score: 61, target: 75, weight: "10%", color: "#8C532B" },
    { label: "Mock Technical Screening", score: 58, target: 80, weight: "10%", color: "#9E4D3B" },
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
      <GlassSurface level={2} className="p-5 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <GlassBadge
                label="VIT Chennai Placement Engine"
                variant="primary"
                icon={<ShieldCheck size={11} className="text-[#4E7D63]" />}
              />
              <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">Cohort 2026-2027</span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight">
              Placement & Career Intelligence Portal
            </h1>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
              Tracking your comprehensive readiness benchmark for <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">{profile.targetRole}</strong> across FAANG/Tier-1 Super Dream standards.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <GlassButton
                variant="primary"
                size="md"
                onClick={onNavigateToCareerGap}
              >
                <Sparkles size={13} />
                <span>Run Deep Career Gap Analysis</span>
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="md"
                onClick={onNavigateToInterview}
              >
                <MessageSquare size={13} />
                <span>Launch Mock Interview Studio</span>
              </GlassButton>
            </div>
          </div>

          {/* Placement Readiness Score Box */}
          <GlassSurface level={3} className="p-4 flex items-center gap-4 flex-shrink-0">
            <div className="text-center space-y-0.5">
              <span className="text-3xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">{overallScore}%</span>
              <span className="text-[9px] font-bold text-[#4E7D63] dark:text-[#6E9B82] uppercase block">Overall Score</span>
            </div>
            <div className="text-xs space-y-1 border-l border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] pl-3.5 max-w-xs">
              <div className="font-bold text-[#3B624E] dark:text-[#8EB7A0] flex items-center gap-1">
                <CheckCircle2 size={13} /> Tier-1 Placement Ready
              </div>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1] leading-tight">
                Strong projects & verified ATS resume. Recommended focus on Mock Interviews.
              </p>
            </div>
          </GlassSurface>
        </div>
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. PLACEMENT READINESS RADAR METRICS & COMPANY TIERS           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Breakdown Bars (7 Columns) */}
        <GlassSurface level={2} className="lg:col-span-7 p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Core Competency Assessment</h3>
              <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">Weighted benchmark scores against target role requirements</p>
            </div>
            <GlassBadge label="6 Dimensions" variant="primary" />
          </div>

          <div className="space-y-3">
            {readinessMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#1C2E24] dark:text-[#F4F7F5] flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <span className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] font-mono">({item.weight} weight)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-[#1C2E24] dark:text-[#F4F7F5]">{item.score}%</span>
                    <span className="text-[10px] text-[#556B5F] dark:text-[#95AFA1]">Target: {item.target}%</span>
                  </div>
                </div>

                <div className="h-2 bg-[#E8E4DC] dark:bg-[#1D2E24] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassSurface>

        {/* Company Eligibility Tiers (5 Columns) */}
        <GlassSurface level={2} className="lg:col-span-5 p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">Campus Placement Tiers</h3>
            <p className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">CTC package categories & matching target companies</p>
          </div>

          <div className="space-y-2.5">
            {placementTiers.map((t, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C2E24] dark:text-[#F4F7F5]">{t.tier}</span>
                  <GlassBadge label={t.ctc} variant="primary" />
                </div>
                <div className="text-[11px] text-[#556B5F] dark:text-[#95AFA1]">
                  <strong className="text-[#1C2E24] dark:text-[#F4F7F5]">Companies:</strong> {t.companies.join(", ")}
                </div>
                <div className="text-[10px] font-semibold text-[#3B624E] dark:text-[#8EB7A0] flex items-center gap-1">
                  <CheckCircle2 size={12} /> {t.status}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <GlassButton
              variant="secondary"
              size="md"
              onClick={onNavigateToInterview}
              className="w-full"
            >
              <span>Practice Target Role Questions</span>
              <ArrowRight size={12} />
            </GlassButton>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
