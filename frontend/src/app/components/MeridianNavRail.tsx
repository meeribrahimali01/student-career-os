import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Bot,
  Library,
  Briefcase,
  Target,
  MessageSquare,
  Compass,
  Calendar,
  Zap,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  icon: any;
  label: string;
  badge?: string | null;
  desc: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const MERIDIAN_NAV_TAXONOMY: NavSection[] = [
  {
    section: "INTELLIGENCE",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", badge: null, desc: "Command center & telemetry" },
      { icon: Map, label: "Roadmap", badge: "Live", desc: "4-Year learning journey" },
    ],
  },
  {
    section: "ACADEMICS",
    items: [
      { icon: BookOpen, label: "Academics", badge: null, desc: "Gradebook & attendance" },
      { icon: Bot, label: "AI Tutor", badge: "24/7", desc: "Contextual doubt solver" },
      { icon: Library, label: "Resources", badge: null, desc: "Curated smart sheets" },
    ],
  },
  {
    section: "CAREER & CAMPUS",
    items: [
      { icon: Briefcase, label: "Career", badge: "AI", desc: "Skill gap analysis" },
      { icon: Target, label: "Placement Prep", badge: "CDC", desc: "Super Dream radar" },
      { icon: MessageSquare, label: "Interview Practice", badge: "Live", desc: "Mock screening studio" },
      { icon: Compass, label: "Campus Navigator", badge: "3D Map", desc: "VIT-Chennai spatial guide" },
      { icon: Calendar, label: "Events", badge: "Official", desc: "Official VIT EventHub" },
    ],
  },
  {
    section: "PERSONAL",
    items: [
      { icon: Zap, label: "Productivity", badge: null, desc: "Pomodoro & streaks" },
      { icon: User, label: "Profile", badge: null, desc: "Student competencies" },
    ],
  },
];

interface MeridianNavRailProps {
  activeNav: string;
  onSelectNav: (label: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  studentName: string;
  studentEmail: string;
  onLogout: () => void;
}

export default function MeridianNavRail({
  activeNav,
  onSelectNav,
  isCollapsed,
  onToggleCollapsed,
  studentName,
  studentEmail,
  onLogout,
}: MeridianNavRailProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="h-full bg-[#F2EFE9] dark:bg-[#142019] border-r border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex flex-col justify-between flex-shrink-0 z-30 select-none relative shadow-xs"
    >
      {/* Top Brand Area */}
      <div className="p-4 border-b border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex items-center justify-between">
        <div
          onClick={() => onSelectNav("Dashboard")}
          className="flex items-center gap-3 cursor-pointer overflow-hidden group"
        >
          {/* Meridian Monogram */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#FBFBF9] bg-[#1C2E24] dark:bg-[#203429] border border-[#1C2E24]/20 font-bold text-sm shadow-xs flex-shrink-0">
            <span>M</span>
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="min-w-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight">MERIDIAN</span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-[#EDF4F0] dark:bg-[#1E2F26] text-[#4E7D63] dark:text-[#6E9B82] border border-[rgba(78,125,99,0.3)]">
                    VIT
                  </span>
                </div>
                <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1] truncate font-mono">Learning Orbit</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapsed}
          className="w-7 h-7 rounded-lg hover:bg-[#E8E5DD] dark:hover:bg-[#1D2E24] flex items-center justify-center text-[#556B5F] dark:text-[#95AFA1] hover:text-[#1C2E24] dark:hover:text-[#F4F7F5] transition-colors cursor-pointer"
          title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 no-scroll">
        {MERIDIAN_NAV_TAXONOMY.map((sectionGroup, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {!isCollapsed && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#7C9184] dark:text-[#718A7D] px-2 block mb-1">
                {sectionGroup.section}
              </span>
            )}

            {sectionGroup.items.map((item) => {
              const isActive = activeNav === item.label;
              const IconComp = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => onSelectNav(item.label)}
                  className={`w-full relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer group ${
                    isActive
                      ? "text-[#1C2E24] dark:text-[#F4F7F5] font-bold bg-[#E2ECE5] dark:bg-[#1D2E24] border border-[rgba(78,125,99,0.25)] shadow-2xs"
                      : "text-[#556B5F] dark:text-[#95AFA1] hover:text-[#1C2E24] dark:hover:text-[#F4F7F5] hover:bg-[#E8E5DD]/70 dark:hover:bg-[#1A2820]"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#4E7D63]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive
                        ? "text-[#4E7D63] dark:text-[#6E9B82] bg-[#FBFBF9] dark:bg-[#142019] shadow-2xs"
                        : "text-[#556B5F] dark:text-[#95AFA1] group-hover:text-[#1C2E24] dark:group-hover:text-[#F4F7F5]"
                    }`}
                  >
                    <IconComp size={15} />
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="text-left min-w-0">
                        <span className="block truncate">{item.label}</span>
                        <span className="text-[9px] text-[#7C9184] dark:text-[#718A7D] font-normal block truncate">
                          {item.desc}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded-full bg-[#EDF4F0] dark:bg-[#1E2F26] text-[#4E7D63] dark:text-[#6E9B82] border border-[rgba(78,125,99,0.3)] ml-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Student Profile & Quick Actions */}
      <div className="p-3 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] bg-[#EAE6DE] dark:bg-[#101B15]">
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={() => onSelectNav("Profile")}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer overflow-hidden flex-1 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#FBFBF9] bg-[#1C2E24] dark:bg-[#203429] text-xs font-bold shadow-2xs flex-shrink-0">
              {studentName.slice(0, 1).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] block truncate group-hover:text-[#4E7D63] transition-colors">
                  {studentName}
                </span>
                <span className="text-[10px] text-[#7C9184] dark:text-[#718A7D] block truncate font-mono">{studentEmail}</span>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="w-7 h-7 rounded-lg hover:bg-[#F9EBE8] dark:hover:bg-[#281B18] text-[#556B5F] dark:text-[#95AFA1] hover:text-[#9E4D3B] dark:hover:text-[#E28876] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
