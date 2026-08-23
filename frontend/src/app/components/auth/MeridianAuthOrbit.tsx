import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sun,
  Moon,
  AlertCircle,
  ArrowRight,
  Orbit,
  User,
  GraduationCap,
} from "lucide-react";
import SplineScene3D from "../ui/SplineScene3D";
import MeridianLearningRobot from "./MeridianLearningRobot";
import { GlassBadge } from "../ui/LiquidGlass";

interface MeridianAuthOrbitProps {
  authMode: "login" | "signup";
  setAuthMode: (mode: "login" | "signup") => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (password: string) => void;
  authFullName: string;
  setAuthFullName: (name: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean | ((prev: boolean) => boolean)) => void;
  isAuthenticating: boolean;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  onLoginSubmit: (e: React.FormEvent) => void;
  onQuickDemoSignIn: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean | ((prev: boolean) => boolean)) => void;
}

export default function MeridianAuthOrbit({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authFullName,
  setAuthFullName,
  showPassword,
  setShowPassword,
  isAuthenticating,
  authError,
  setAuthError,
  onLoginSubmit,
  onQuickDemoSignIn,
  isDark,
  setIsDark,
}: MeridianAuthOrbitProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeInput, setActiveInput] = useState<string | null>(null);

  // Mouse move handler for spatial depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Determine robot state
  const robotState = isAuthenticating
    ? "authenticating"
    : authError
    ? "error"
    : activeInput
    ? "typing"
    : "idle";

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden transition-colors duration-500 select-none bg-[#FBFBF9] dark:bg-[#0F1A14] text-[#1C2E24] dark:text-[#F4F7F5]"
    >
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. IMMERSIVE SPLINE 3D ENVIRONMENT                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto opacity-35 dark:opacity-25">
        <SplineScene3D
          sceneUrl="https://prod.spline.design/Ap3r1jgs0kwQjDC/scene.splinecode"
          className="w-full h-full object-cover scale-105"
          isInteractive={true}
          opacity={isDark ? 0.35 : 0.45}
        />
      </div>

      {/* Atmospheric Vignette & Subtle Sage Gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
        style={{
          background: isDark
            ? `radial-gradient(900px circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(78, 125, 99, 0.08), transparent 70%), radial-gradient(circle at 50% 50%, rgba(15, 26, 20, 0.2) 0%, rgba(15, 26, 20, 0.85) 100%)`
            : `radial-gradient(900px circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(78, 125, 99, 0.06), transparent 70%), radial-gradient(circle at 50% 50%, rgba(251, 251, 249, 0.2) 0%, rgba(251, 251, 249, 0.8) 100%)`,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. TOP INSTITUTIONAL BRANDING & THEME TOGGLER                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 px-6 lg:px-12 py-5 flex items-center justify-between pointer-events-auto">
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#FBFBF9] bg-[#1C2E24] dark:bg-[#203429] font-bold text-base shadow-xs flex-shrink-0">
            <span>M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm lg:text-base tracking-tight text-[#1C2E24] dark:text-[#F4F7F5]">
                MERIDIAN
              </span>
              <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#EDF4F0] dark:bg-[#1E2F26] text-[#4E7D63] dark:text-[#6E9B82] border border-[rgba(78,125,99,0.3)]">
                VIT CHENNAI
              </span>
            </div>
            <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] font-mono">Learning Orbit • Student Intelligence</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="px-3.5 py-1.5 rounded-full bg-[#F2EFE9] dark:bg-[#17241D] hover:bg-[#EAE6DE] dark:hover:bg-[#1D2E24] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
        >
          {isDark ? <Sun size={13} className="text-[#8C532B]" /> : <Moon size={13} className="text-[#4E7D63]" />}
          <span className="text-[11px]">{isDark ? "Light Canvas" : "Deep Forest"}</span>
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. CENTERED AUTHENTICATION SURFACE                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 py-6 flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-16 w-full pointer-events-auto">
        {/* Left Column: Atmospheric Typography */}
        <div className="w-full lg:w-6/12 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.3)] text-[#4E7D63] dark:text-[#6E9B82] text-[10px] font-semibold uppercase tracking-wider shadow-2xs">
            <Orbit size={13} className="animate-spin-slow text-[#4E7D63]" />
            <span>VIT Chennai Intelligent Orbit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C2E24] dark:text-[#F4F7F5] leading-[1.15]">
            Autonomous student <span className="text-[#4E7D63] dark:text-[#6E9B82]">intelligence</span> & placement command center.
          </h1>

          <p className="text-xs sm:text-sm text-[#556B5F] dark:text-[#95AFA1] max-w-lg leading-relaxed">
            Uniting semester academics, skill graphs, spaced revision engine, and FAANG placement readiness in a calm, focused environment.
          </p>

          {/* Interactive Feature Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-[11px]">
            {[
              { label: "8.60 CGPA Tracker", icon: GraduationCap },
              { label: "DSA & Systems Matrix", icon: Sparkles },
              { label: "72% Super Dream Match", icon: ShieldCheck },
              { label: "Gemini AI Studio", icon: Orbit },
            ].map((pill, idx) => {
              const IconComp = pill.icon;
              return (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-[#F2EFE9] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] text-[#556B5F] dark:text-[#95AFA1] text-[10px] font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <IconComp size={11} className="text-[#4E7D63] dark:text-[#6E9B82]" />
                  <span>{pill.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Right Column: Clean Cream Login Surface */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full lg:w-5/12 max-w-md bg-[#F2EFE9] dark:bg-[#17241D] border border-[rgba(28,46,36,0.12)] dark:border-[rgba(244,247,245,0.1)] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Top Line Accent */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-[#4E7D63]/50" />

          {/* Robot Companion Greeting Header */}
          <div className="mb-4 pb-3.5 border-b border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex items-center justify-between">
            <MeridianLearningRobot state={robotState} mousePos={mousePos} />
            <GlassBadge label="3D Engine Ready" variant="accent" />
          </div>

          {/* Form Header */}
          <div className="space-y-0.5 mb-4">
            <h2 className="text-xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight">
              {authMode === "login" ? "Welcome Back" : "Create Student Account"}
            </h2>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1]">
              {authMode === "login"
                ? "Sign in to access your personalized learning orbit."
                : "Register to track your verified competencies & placements."}
            </p>
          </div>

          {/* Error Message Alert */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-[#F9EBE8] dark:bg-[#281B18] border border-[rgba(158,77,59,0.3)] text-[#9E4D3B] dark:text-[#E28876] text-xs p-3 rounded-xl flex items-start gap-2"
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{authError}</span>
            </motion.div>
          )}

          {/* Interactive Form */}
          <form onSubmit={onLoginSubmit} className="space-y-3.5">
            {authMode === "signup" && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#1C2E24] dark:text-[#F4F7F5] block">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#556B5F] pointer-events-none" />
                  <input
                    type="text"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    onFocus={() => setActiveInput("fullname")}
                    onBlur={() => setActiveInput(null)}
                    placeholder="e.g. Aryan Kumar"
                    className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] rounded-xl pl-10 pr-3.5 py-2 text-xs outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] transition-colors placeholder:text-[#7C9184]"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#1C2E24] dark:text-[#F4F7F5] block">University Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#556B5F] pointer-events-none" />
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  onFocus={() => setActiveInput("email")}
                  onBlur={() => setActiveInput(null)}
                  placeholder="aryan.kumar@meridian.edu"
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] rounded-xl pl-10 pr-3.5 py-2 text-xs outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] transition-colors placeholder:text-[#7C9184]"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#1C2E24] dark:text-[#F4F7F5] block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#556B5F] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  onFocus={() => setActiveInput("password")}
                  onBlur={() => setActiveInput(null)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] rounded-xl pl-10 pr-10 py-2 text-xs outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] transition-colors placeholder:text-[#7C9184]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#556B5F] hover:text-[#1C2E24] cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-[#FBFBF9] bg-[#1C2E24] hover:bg-[#2B4234] dark:bg-[#4E7D63] dark:hover:bg-[#3B624E] shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer mt-1 select-none border border-[#1C2E24]/20"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{authMode === "login" ? "Sign In to Orbit" : "Create Meridian Account"}</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)]"></div>
            <span className="flex-shrink mx-2 text-[9px] uppercase font-bold text-[#556B5F] dark:text-[#95AFA1]">
              One-Click Instant Access
            </span>
            <div className="flex-grow border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)]"></div>
          </div>

          {/* One-Click Instant Demo Login */}
          <button
            onClick={onQuickDemoSignIn}
            disabled={isAuthenticating}
            className="w-full py-2.5 rounded-xl font-semibold text-xs bg-[#FAF8F5] dark:bg-[#1D2D24] hover:bg-[#EAE6DE] dark:hover:bg-[#253A2E] border border-[rgba(78,125,99,0.3)] text-[#1C2E24] dark:text-[#F4F7F5] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles size={13} className="text-[#4E7D63]" />
            <span>Instant Demo Access (Aryan Kumar)</span>
          </button>

          {/* Mode Switcher */}
          <div className="text-center pt-3">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthError(null);
              }}
              className="text-xs text-[#4E7D63] dark:text-[#6E9B82] font-semibold hover:underline cursor-pointer transition-colors"
            >
              {authMode === "login"
                ? "New student? Create your Meridian account"
                : "Already registered? Sign in to your orbit"}
            </button>
          </div>
        </motion.div>
      </main>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4. INSTITUTIONAL FOOTER BAR                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-20 px-6 lg:px-12 py-4 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.06)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#556B5F] dark:text-[#95AFA1] gap-2 pointer-events-auto bg-[#F2EFE9] dark:bg-[#142019]">
        <div className="flex items-center gap-2">
          <span>VIT Chennai Engineering Cohort</span>
          <span>•</span>
          <span>Autonomous Student Intelligence</span>
        </div>
        <div>
          <span>© 2026 Meridian Learning Orbit</span>
        </div>
      </footer>
    </div>
  );
}
