import React, { useState, useMemo } from "react";
import {
  Library,
  ExternalLink,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Tag,
  ArrowRight,
  Filter,
  Bookmark,
} from "lucide-react";
import { TopicMastery } from "../../data/studentIntelligence";

interface SmartResourcesProps {
  topicMasteryMap: Record<string, TopicMastery>;
  onNavigateToRoadmap?: (topicId: string) => void;
}

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  topicId?: string;
  type: "Practice Sheet" | "Interactive Course" | "Documentation" | "Reference Book" | "Video Series";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  url: string;
  estimatedHours: number;
  tags: string[];
}

const ALL_RESOURCES: ResourceItem[] = [
  // ─── DATA STRUCTURES & ALGORITHMS ────────────────────────────────
  {
    id: "res_striver_dsa",
    title: "Striver's A2Z DSA Course & Blind 75 Sheet",
    category: "Data Structures",
    topicId: "graphs",
    type: "Practice Sheet",
    difficulty: "Intermediate",
    description: "Curated 75 core algorithmic patterns essential for FAANG and Tier-1 product tech screening rounds.",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    estimatedHours: 40,
    tags: ["DSA", "Graphs", "LeetCode", "Dijkstra", "Topological Sort"],
  },
  {
    id: "res_neetcode_dp",
    title: "NeetCode 150: Dynamic Programming Patterns",
    category: "Algorithms",
    topicId: "dp",
    type: "Interactive Course",
    difficulty: "Advanced",
    description: "Structured breakdown of 1D/2D DP, 0/1 Knapsack, Longest Common Subsequence, and DP on Trees.",
    url: "https://neetcode.io/practice",
    estimatedHours: 25,
    tags: ["Dynamic Programming", "Knapsack", "LCS", "Memoization"],
  },

  // ─── OPERATING SYSTEMS ───────────────────────────────────────────
  {
    id: "res_ostep_os",
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    category: "Core CS",
    topicId: "os",
    type: "Reference Book",
    difficulty: "Intermediate",
    description: "Virtualization, concurrency primitives (locks, semaphores, condition variables), and file system internals.",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    estimatedHours: 30,
    tags: ["OS", "Virtual Memory", "Deadlocks", "Concurrency", "Paging"],
  },

  // ─── DATABASE SYSTEMS ────────────────────────────────────────────
  {
    id: "res_postgres_internals",
    title: "PostgreSQL Masterclass: Schema Design & Indexing",
    category: "Databases",
    topicId: "dbms",
    type: "Documentation",
    difficulty: "Intermediate",
    description: "Relational modeling, B-tree indexes, execution plans (EXPLAIN ANALYZE), and ACID concurrency controls.",
    url: "https://www.postgresql.org/docs/",
    estimatedHours: 18,
    tags: ["SQL", "PostgreSQL", "B+ Trees", "ACID", "Transactions"],
  },

  // ─── SYSTEM DESIGN & CLOUD ───────────────────────────────────────
  {
    id: "res_system_design_primer",
    title: "System Design Primer & Scalability Patterns Guide",
    category: "Architecture",
    topicId: "system_design",
    type: "Reference Book",
    difficulty: "Advanced",
    description: "Comprehensive visual guide on scaling web architectures, load balancers, caching, and sharding.",
    url: "https://github.com/donnemartin/system-design-primer",
    estimatedHours: 35,
    tags: ["System Design", "Microservices", "Redis", "Kafka", "CAP"],
  },

  // ─── WEB DEVELOPMENT ─────────────────────────────────────────────
  {
    id: "res_react_docs",
    title: "Official React & Next.js Architecture Documentation",
    category: "Web Development",
    topicId: "web_dev",
    type: "Documentation",
    difficulty: "Beginner",
    description: "Modern component lifecycle, Server Actions, suspense boundaries, and rendering performance optimizations.",
    url: "https://react.dev",
    estimatedHours: 20,
    tags: ["React", "TypeScript", "Frontend", "JavaScript"],
  },
];

export default function SmartResources({ topicMasteryMap, onNavigateToRoadmap }: SmartResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Identify student's weak topics to generate recommended resources
  const weakTopicIds = useMemo(() => {
    return new Set(
      Object.values(topicMasteryMap)
        .filter((t) => t.status === "CRITICAL" || t.status === "WEAK")
        .map((t) => t.topicId)
    );
  }, [topicMasteryMap]);

  // Recommended Resources matching weak topics
  const recommendedResources = useMemo(() => {
    return ALL_RESOURCES.filter((r) => r.topicId && weakTopicIds.has(r.topicId));
  }, [weakTopicIds]);

  // Filtered Catalog
  const filteredResources = useMemo(() => {
    return ALL_RESOURCES.filter((r) => {
      const matchCat = selectedCategory === "All" || r.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.tags.some((t) => t.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categories = ["All", "Data Structures", "Algorithms", "Core CS", "Databases", "Architecture", "Web Development"];

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. HEADER & SMART WEAK-TOPIC RECOMMENDATION SHELF              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Sparkles size={12} />
              Intelligent Curated Resources
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-foreground">Smart Study & Placement Resource Hub</h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Targeted study guides, documentation, and practice sheets dynamically recommended based on your recent Quiz performance and Topic Mastery metrics.
          </p>
        </div>

        {/* Dynamic Recommended Shelf for Weak Topics */}
        {recommendedResources.length > 0 && (
          <div className="pt-3 border-t border-border space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-foreground">
                Recommended For Your Identified Weak Areas:
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendedResources.map((rec) => {
                const mastery = rec.topicId ? topicMasteryMap[rec.topicId] : null;
                return (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-rose-500/10 via-primary/10 to-indigo-500/10 border border-primary/20 flex flex-col justify-between space-y-2 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                          {rec.category} • {rec.type}
                        </span>
                        {mastery && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                            {mastery.topicName} ({mastery.masteryScore}% Accuracy)
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-foreground mt-1">{rec.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{rec.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock size={11} /> ~{rec.estimatedHours} hrs
                      </span>
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-primary hover:opacity-90 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Study Resource</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. SEARCH & ALL RESOURCES CATALOG                              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
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

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, topics..."
              className="w-full bg-secondary border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-all shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-secondary text-primary border border-border">
                    {res.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">{res.type}</span>
                </div>

                <h3 className="text-xs font-bold text-foreground leading-snug">{res.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{res.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {res.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock size={12} /> ~{res.estimatedHours} hrs
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-foreground bg-secondary hover:bg-secondary/80 border border-border flex items-center gap-1 transition-all"
                >
                  <span>Open Resource</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
