import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

export type GlassLevel = 1 | 2 | 3 | 4;

interface GlassSurfaceProps extends HTMLMotionProps<"div"> {
  level?: GlassLevel;
  specularTop?: boolean;
  interactive?: boolean;
  glow?: "critical" | "high" | "medium" | "normal" | "primary" | null;
  className?: string;
  children?: React.ReactNode;
}

export function GlassSurface({
  level = 2,
  specularTop = false,
  interactive = false,
  glow = null,
  className = "",
  children,
  ...props
}: GlassSurfaceProps) {
  const levelClasses: Record<GlassLevel, string> = {
    1: "glass-level-1 rounded-2xl",
    2: "glass-level-2 rounded-2xl",
    3: "glass-level-3 rounded-2xl",
    4: "glass-level-4 rounded-2xl",
  };

  const glowClasses: Record<string, string> = {
    critical: "glass-glow-critical rounded-2xl",
    high: "glass-glow-high rounded-2xl",
    medium: "glass-glow-medium rounded-2xl",
    normal: "glass-glow-normal rounded-2xl",
    primary: "glass-level-4 rounded-2xl",
  };

  const interactiveStyles = interactive
    ? "transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md cursor-pointer"
    : "transition-all duration-200";

  return (
    <motion.div
      className={`relative ${
        glow ? glowClasses[glow] : levelClasses[level]
      } ${specularTop ? "glass-specular-top" : ""} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlassFloatingPanel({
  className = "",
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`relative glass-level-3 glass-floating rounded-2xl p-6 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlassCommandSurface({
  className = "",
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`relative glass-level-2 rounded-2xl p-4 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger" | "cyan";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function GlassButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5 font-medium",
    md: "px-4 py-2 text-xs font-semibold rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#1C2E24] hover:bg-[#2B4234] text-[#FBFBF9] shadow-xs border border-[#1C2E24]/30",
    secondary:
      "bg-[#F2EFE9] hover:bg-[#E7E3DB] dark:bg-[#1D2D24] dark:hover:bg-[#253A2E] text-[#1C2E24] dark:text-[#F4F7F5] border border-[#4E7D63]/30 shadow-2xs",
    accent:
      "bg-[#4E7D63] hover:bg-[#3B624E] text-[#FBFBF9] shadow-xs border border-[#4E7D63]/40",
    ghost:
      "bg-transparent hover:bg-[#F2EFE9]/80 dark:hover:bg-[#1D2D24]/80 text-[#556B5F] dark:text-[#95AFA1] hover:text-[#1C2E24] dark:hover:text-[#F4F7F5]",
    danger:
      "bg-[#9E4D3B] hover:bg-[#853E2E] text-[#FBFBF9] border border-[#9E4D3B]/40 shadow-xs",
    cyan:
      "bg-[#4E7D63] hover:bg-[#3B624E] text-[#FBFBF9] shadow-xs border border-[#4E7D63]/40",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center select-none cursor-pointer transition-all duration-150 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface GlassBadgeProps {
  label: string;
  dotColor?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "cyan" | "accent";
  className?: string;
  icon?: React.ReactNode;
}

export function GlassBadge({
  label,
  dotColor,
  variant = "default",
  className = "",
  icon,
}: GlassBadgeProps) {
  const variantStyles = {
    default: "bg-[#F2EFE9] dark:bg-[#1D2D24] border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.1)] text-[#556B5F] dark:text-[#95AFA1]",
    primary: "bg-[#EDF4F0] dark:bg-[#1E2F26] border-[rgba(78,125,99,0.25)] text-[#1C2E24] dark:text-[#E0EAE4] font-semibold",
    accent: "bg-[#EDF4F0] dark:bg-[#1E2F26] border-[rgba(78,125,99,0.3)] text-[#4E7D63] dark:text-[#6E9B82] font-semibold",
    success: "bg-[#EDF4F0] dark:bg-[#1E2F26] border-[rgba(78,125,99,0.35)] text-[#3B624E] dark:text-[#8EB7A0] font-semibold",
    warning: "bg-[#FAF2EB] dark:bg-[#28211A] border-[rgba(140,83,43,0.25)] text-[#8C532B] dark:text-[#D49E78] font-semibold",
    danger: "bg-[#F9EBE8] dark:bg-[#281B18] border-[rgba(158,77,59,0.25)] text-[#9E4D3B] dark:text-[#E28876] font-semibold",
    cyan: "bg-[#EDF4F0] dark:bg-[#1E2F26] border-[rgba(78,125,99,0.3)] text-[#4E7D63] dark:text-[#6E9B82] font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {dotColor && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />}
      <span>{label}</span>
    </span>
  );
}

export function GlassDivider({ className = "" }: { className?: string }) {
  return <div className={`glass-divider w-full my-3 ${className}`} />;
}

interface GlassMetricProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export function GlassMetric({
  label,
  value,
  subtext,
  icon,
  trend,
  trendPositive,
  className = "",
}: GlassMetricProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-xs text-[#556B5F] dark:text-[#95AFA1]">
        <span className="font-medium text-[11px]">{label}</span>
        {icon && <span className="text-[#4E7D63] dark:text-[#6E9B82]">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight font-mono">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[10px] font-semibold ${
              trendPositive ? "text-[#4E7D63] dark:text-[#6E9B82]" : "text-[#8C532B] dark:text-[#D49E78]"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subtext && <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] leading-tight">{subtext}</p>}
    </div>
  );
}
