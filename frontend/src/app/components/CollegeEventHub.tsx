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
} from "lucide-react";
import { CollegeEventItem } from "../../data/studentIntelligence";

interface CollegeEventHubProps {
  onAddEventToPlan?: (eventTitle: string) => void;
}

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
    organizer: "VIT Chennai Career Development Centre (CDC)",
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
    organizer: "Google Developer Student Club (GDSC) VIT Chennai",
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
      {/* 1. HEADER & OVERVIEW BANNER                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <Calendar size={12} />
            VIT Chennai Event Hub
          </span>
          <span className="text-xs text-muted-foreground">Placement Talks, Hackathons & Tech Drives</span>
        </div>
        <h1 className="text-xl lg:text-2xl font-black text-foreground">Campus Events & Opportunity Gateway</h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          Register for university hackathons, on-campus corporate placement talks, competitive coding sprints, and hands-on developer workshops.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. CATEGORY FILTERS & SEARCH BAR                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card hover:bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, organizers..."
            className="w-full bg-secondary border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary text-foreground"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. EVENT CARDS GRID                                            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-2xs"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {ev.category}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground font-mono">
                  Deadline: {ev.deadline}
                </span>
              </div>

              <h3 className="text-sm font-bold text-foreground leading-snug">{ev.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{ev.description}</p>

              <div className="space-y-1 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-primary flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">{ev.date}</strong> • {ev.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-rose-500 flex-shrink-0" />
                  <span>{ev.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-amber-500 flex-shrink-0" />
                  <span>{ev.organizer}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {ev.tags.map((t, idx) => (
                  <span key={idx} className="text-[9px] bg-secondary text-muted-foreground px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <span className="text-[10px] text-muted-foreground font-medium">
                Eligibility: {ev.eligibility}
              </span>

              <div className="flex items-center gap-2">
                {onAddEventToPlan && (
                  <button
                    onClick={() => onAddEventToPlan(ev.title)}
                    className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Add reminder to Daily Focus Plan"
                  >
                    <Plus size={13} />
                  </button>
                )}
                <button
                  onClick={() => handleToggleRegistration(ev.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    ev.registered
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-primary text-white hover:opacity-95 shadow-xs"
                  }`}
                >
                  {ev.registered ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Registered ✓</span>
                    </>
                  ) : (
                    <span>Register Now</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
