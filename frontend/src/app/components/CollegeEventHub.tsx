import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
  Tag,
  ExternalLink,
  Users,
  Award,
  Filter,
  Plus,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  Layers,
  BookOpen,
} from "lucide-react";
import { CollegeEventItem } from "../../data/studentIntelligence";
import { GlassSurface, GlassButton, GlassBadge, GlassDivider } from "./ui/LiquidGlass";

interface CollegeEventHubProps {
  onAddEventToPlan?: (eventTitle: string) => void;
}

const OFFICIAL_EVENTHUB_URL = "https://eventhubcc.vit.ac.in/EventHub/eventPreview";

const INITIAL_COLLEGE_EVENTS: CollegeEventItem[] = [
  {
    id: 1,
    title: "TechnoVIT 2026: 36-Hour National Hackathon",
    category: "Hackathon",
    organizer: "School of Computer Science & Engineering (SCOPE)",
    date: "Oct 12-14, 2026",
    time: "9:00 AM IST",
    location: "Mahatma Gandhi Auditorium (MGA)",
    description: "Build production-grade decentralized AI & Web3 applications with $10,000 prize pool and direct fast-track internship screening.",
    registered: true,
    deadline: "Oct 5, 2026",
    tags: ["Hackathon", "AI", "Web3", "Cash Prize"],
    eligibility: "All B.Tech/M.Tech Students",
  },
  {
    id: 2,
    title: "Google SDE Campus Placement & Career Keynote",
    category: "Placement Drive",
    organizer: "VIT-Chennai Career Development Centre (CDC)",
    date: "Nov 02, 2026",
    time: "2:00 PM - 5:30 PM",
    location: "Academic Block 3 (AB-3 Tiered Auditorium)",
    description: "On-campus placement talk and online coding test registration for 2027 Full Stack & Cloud Software Engineering roles.",
    registered: false,
    deadline: "Oct 28, 2026",
    tags: ["Google", "Placement", "Super Dream", "CTC 32+ LPA"],
    eligibility: "Final & Pre-Final Year (CGPA ≥ 8.0)",
  },
  {
    id: 3,
    title: "Distributed Systems & Kafka Microservices Workshop",
    category: "Technical Workshop",
    organizer: "Google Developer Student Club (GDSC) VIT-Chennai",
    date: "Sep 28, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Academic Block 1 (Netaji Auditorium)",
    description: "Hands-on implementation of event-driven microservices with Apache Kafka, Docker Compose, and Redis Pub/Sub.",
    registered: false,
    deadline: "Sep 25, 2026",
    tags: ["System Design", "Kafka", "Docker", "Hands-on"],
    eligibility: "Open to all branches",
  },
  {
    id: 4,
    title: "CodeCraft: Monthly Competitive Programming Sprint",
    category: "Coding Contest",
    organizer: "Competitive Coding Guild (CodeChef VIT)",
    date: "Every Saturday",
    time: "8:00 PM - 10:30 PM",
    location: "Online / CodeChef Platform",
    description: "Speed contest featuring 5 algorithmic problems ranging from Division 2 to Division 1 ratings.",
    registered: true,
    deadline: "Rolling Enrollment",
    tags: ["Competitive Programming", "DSA", "CodeChef", "Rankings"],
    eligibility: "All students",
  },
  {
    id: 5,
    title: "Microsoft Cloud Architecture & AI Engineering Day",
    category: "Guest Lecture",
    organizer: "Microsoft Student Ambassadors (MLSA)",
    date: "Oct 20, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Central Library Seminar Hall",
    description: "Industry architects discuss production LLM deployment, Vector DB indexing, and Azure Cloud scalability.",
    registered: false,
    deadline: "Oct 18, 2026",
    tags: ["Microsoft", "Azure", "LLMs", "Industry Talk"],
    eligibility: "All students",
  },
];

export default function CollegeEventHub({ onAddEventToPlan }: CollegeEventHubProps) {
  const [activeTab, setActiveTab] = useState<"official" | "directory">("official");
  const [events, setEvents] = useState<CollegeEventItem[]>(INITIAL_COLLEGE_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleToggleRegistration = (id: number) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, registered: !ev.registered } : ev))
    );
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCategory = selectedCategory === "All" || ev.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        ev.title.toLowerCase().includes(query) ||
        ev.description.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query) ||
        ev.tags.some((t) => t.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const categories = ["All", "Hackathon", "Placement Drive", "Technical Workshop", "Coding Contest", "Guest Lecture"];

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. HEADER & OFFICIAL EVENTHUB HERO BANNER                      */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={2} className="p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <GlassBadge
                label="VIT-Chennai Official Portal"
                variant="primary"
                icon={<Globe size={12} />}
              />
              <span className="text-xs text-muted-foreground font-mono">University Event Gateway</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-foreground">
              VIT Chennai EventHub
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Discover upcoming events, workshops, hackathons, guest lectures, and career placement drives at VIT-Chennai. The official EventHub is the authoritative source for all university event registrations and approvals.
            </p>
          </div>

          {/* Primary Action Button to Open Official Portal */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <a
              href={OFFICIAL_EVENTHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all hover:opacity-95 cursor-pointer backdrop-blur-md"
              style={{ background: "linear-gradient(135deg, #1E40AF 0%, #4F46E5 100%)" }}
            >
              <Globe size={14} />
              <span>Open Official EventHub</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
          <GlassButton
            variant={activeTab === "official" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab("official")}
          >
            <Globe size={13} />
            <span>Official EventHub Integration</span>
          </GlassButton>

          <GlassButton
            variant={activeTab === "directory" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab("directory")}
          >
            <Calendar size={13} />
            <span>Quick Register & Calendar Hub</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/20 ml-0.5">
              {events.length}
            </span>
          </GlassButton>
        </div>
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. TAB 1: OFFICIAL EVENTHUB EMBED & PORTAL HUB               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "official" && (
        <div className="space-y-4">
          {/* Official Portal Guide & Direct Launch Card */}
          <GlassSurface level={2} className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    VIT-Chennai EventHub Portal Access
                  </h3>
                  <GlassBadge label="Active Verified URL" variant="success" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct university endpoint: <code className="text-primary font-mono text-[11px] bg-white/20 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">{OFFICIAL_EVENTHUB_URL}</code>
                </p>
              </div>

              <a
                href={OFFICIAL_EVENTHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              >
                <span>Launch in Full Browser Window</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Embed & Security Architecture Notice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/15 dark:border-white/10 space-y-1 backdrop-blur-md">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Student Authentication</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Log in with your official VIT VTOP / EventHub credentials to submit official participation forms.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/15 dark:border-white/10 space-y-1 backdrop-blur-md">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Calendar size={14} className="text-primary" />
                  <span>Verified Attendance</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Participation certificates and OD (On-Duty) requests are synchronized directly via EventHub.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/15 dark:border-white/10 space-y-1 backdrop-blur-md">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Sparkles size={14} className="text-purple-500" />
                  <span>CareerOS Placement Sync</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Add key tech fest milestones directly to your Meridian learning journey and daily focus sprint.
                </p>
              </div>
            </div>
          </GlassSurface>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. TAB 2: QUICK REGISTER DIRECTORY & SEARCH                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <GlassSurface level={2} className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, keywords, venues..."
                  className="w-full text-xs bg-white/20 dark:bg-slate-900/60 border border-white/20 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-primary text-foreground backdrop-blur-md"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scroll w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white/15 dark:bg-white/5 hover:bg-white/25 text-muted-foreground hover:text-foreground border border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </GlassSurface>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => (
              <GlassSurface key={ev.id} level={2} className="p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <GlassBadge label={ev.category} variant="primary" />
                    <span className="text-[10px] font-mono text-muted-foreground">{ev.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground leading-snug">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{ev.description}</p>

                  <div className="space-y-1 pt-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-primary flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-purple-400 flex-shrink-0" />
                      <span>{ev.time} • Deadline: {ev.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {ev.tags?.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-white/20 dark:bg-white/5 border border-white/10 text-muted-foreground font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <GlassButton
                    variant={ev.registered ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleToggleRegistration(ev.id)}
                  >
                    {ev.registered ? (
                      <>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>Register Now</span>
                      </>
                    )}
                  </GlassButton>
                </div>
              </GlassSurface>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
