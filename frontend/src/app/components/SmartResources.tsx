import React, { useState, useMemo } from "react";
import {
  Library,
  ExternalLink,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Bookmark,
  Play,
  Code2,
  Star,
  ArrowRight,
} from "lucide-react";
import { TopicMastery } from "../../data/studentIntelligence";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";
import { MERIDIAN_STUDY_RESOURCES, SmartStudyResource } from "../../data/meridianStudyResourcesData";

interface SmartResourcesProps {
  topicMasteryMap?: Record<string, TopicMastery>;
  onNavigateToRoadmap?: (topicId: string) => void;
}

export default function SmartResources({
  topicMasteryMap = {},
  onNavigateToRoadmap,
}: SmartResourcesProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("meridian_bookmarked_resources");
        return saved ? JSON.parse(saved) : ["res_graph_abdul_bari", "res_sd_primer"];
      } catch {
        return ["res_graph_abdul_bari", "res_sd_primer"];
      }
    }
    return ["res_graph_abdul_bari", "res_sd_primer"];
  });

  const [visitedIds, setVisitedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("meridian_visited_resources");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Toggle Bookmark
  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("meridian_bookmarked_resources", JSON.stringify(updated));
    }
  };

  // Open Link & Mark Visited
  const handleOpenResource = (resource: SmartStudyResource) => {
    if (!visitedIds.includes(resource.id)) {
      const updated = [...visitedIds, resource.id];
      setVisitedIds(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("meridian_visited_resources", JSON.stringify(updated));
      }
    }
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  // Identify student's weak topics to prioritize
  const weakTopicIds = useMemo(() => {
    return Object.entries(topicMasteryMap)
      .filter(([_, m]) => m.status === "CRITICAL" || m.status === "WEAK")
      .map(([id]) => id);
  }, [topicMasteryMap]);

  // Topic Options
  const topicFilterOptions = [
    { value: "All", label: "All Topics (41 Resources)" },
    { value: "foundations", label: "Foundations & Memory" },
    { value: "oop", label: "Object-Oriented Programming" },
    { value: "dsa_linear", label: "Linear DSA" },
    { value: "dsa_trees", label: "Trees & BST" },
    { value: "dsa_graphs", label: "Graph Algorithms" },
    { value: "dsa_dp", label: "Dynamic Programming" },
    { value: "os", label: "Operating Systems" },
    { value: "dbms", label: "Database Management" },
    { value: "networks", label: "Computer Networks" },
    { value: "system_design", label: "System Design" },
    { value: "cloud_devops", label: "Cloud & DevOps" },
    { value: "placement_sprints", label: "Placement Prep" },
  ];

  // Filtering Logic
  const filteredResources = useMemo(() => {
    return MERIDIAN_STUDY_RESOURCES.filter((res) => {
      if (selectedTopic !== "All" && res.topicId !== selectedTopic) return false;
      if (selectedType !== "All" && res.type !== selectedType) return false;
      if (selectedDifficulty !== "All" && res.difficulty !== selectedDifficulty) return false;
      if (selectedPlatform !== "All" && res.platform !== selectedPlatform) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesAuthor = res.authorOrChannel.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesTopic = res.topicName.toLowerCase().includes(q);
        const matchesTags = res.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesTopic && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      // Prioritize weak topics
      const aIsWeak = weakTopicIds.includes(a.topicId);
      const bIsWeak = weakTopicIds.includes(b.topicId);
      if (aIsWeak && !bIsWeak) return -1;
      if (!aIsWeak && bIsWeak) return 1;
      return 0;
    });
  }, [selectedTopic, selectedType, selectedDifficulty, selectedPlatform, searchQuery, weakTopicIds]);

  const youtubeCount = MERIDIAN_STUDY_RESOURCES.filter((r) => r.platform === "YouTube").length;
  const codingCount = MERIDIAN_STUDY_RESOURCES.filter((r) => r.type === "Coding Platform" || r.type === "Practice Sheet").length;
  const docsCount = MERIDIAN_STUDY_RESOURCES.filter((r) => r.type === "Documentation" || r.type === "Reference Book").length;

  return (
    <div className="space-y-5">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP HERO HEADER & METRICS                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={2} className="p-5 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <GlassBadge
                label="Verified Educational Ecosystem"
                variant="primary"
                icon={<Sparkles size={11} className="text-[#4E7D63]" />}
              />
              <span className="text-xs text-[#556B5F] dark:text-[#95AFA1] font-mono">Curated 4-Year Library</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] tracking-tight">
              Smart Study & Practice Resource Matrix
            </h1>
            <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed">
              Every topic across your academic and placement roadmap is paired with verified documentation, masterclass video series (Abdul Bari, Striver, NeetCode), and interactive coding sheets.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] text-center min-w-[80px]">
              <span className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono block">{MERIDIAN_STUDY_RESOURCES.length}</span>
              <span className="text-[9px] font-semibold text-[#556B5F] dark:text-[#95AFA1] uppercase">Resources</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] text-center min-w-[80px]">
              <span className="text-base font-bold text-[#4E7D63] dark:text-[#6E9B82] font-mono block">{youtubeCount}</span>
              <span className="text-[9px] font-semibold text-[#556B5F] dark:text-[#95AFA1] uppercase">Video Series</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] text-center min-w-[80px]">
              <span className="text-base font-bold text-[#3B624E] dark:text-[#8EB7A0] font-mono block">{codingCount}</span>
              <span className="text-[9px] font-semibold text-[#556B5F] dark:text-[#95AFA1] uppercase">Coding Sheets</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.08)] text-center min-w-[80px]">
              <span className="text-base font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono block">{docsCount}</span>
              <span className="text-[9px] font-semibold text-[#556B5F] dark:text-[#95AFA1] uppercase">Docs & Books</span>
            </div>
          </div>
        </div>

        {/* Personalized Focus Alert */}
        {weakTopicIds.length > 0 && (
          <div className="p-3 rounded-xl bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.3)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4E7D63] pulse-ai-dot" />
              <p className="text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5]">
                <strong className="text-[#4E7D63] dark:text-[#6E9B82] font-bold">Targeted Recommendation:</strong> Weak topic signals in <strong className="underline decoration-[#4E7D63]/50">{weakTopicIds.map((t) => t.toUpperCase()).join(", ")}</strong>. High-yield diagnostic resources prioritized below.
              </p>
            </div>
            {onNavigateToRoadmap && (
              <button
                onClick={() => onNavigateToRoadmap(weakTopicIds[0])}
                className="text-[11px] font-bold text-[#4E7D63] dark:text-[#6E9B82] hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <span>View on Roadmap</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. ADVANCED INTERACTIVE FILTERING BAR                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <GlassSurface level={1} className="p-3.5 space-y-2.5">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#556B5F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, algorithm, author (Abdul Bari, Striver, NeetCode), or tag..."
              className="w-full text-xs pl-9 pr-3.5 py-1.5 bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] rounded-xl outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] placeholder:text-[#7C9184] transition-colors"
            />
          </div>

          {/* Quick Clear */}
          {(selectedTopic !== "All" || selectedType !== "All" || selectedDifficulty !== "All" || selectedPlatform !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedTopic("All");
                setSelectedType("All");
                setSelectedDifficulty("All");
                setSelectedPlatform("All");
                setSearchQuery("");
              }}
              className="px-3 py-1.5 text-xs font-semibold text-[#556B5F] hover:text-[#1C2E24] bg-[#E8E4DC] dark:bg-[#1D2E24] rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Multi-Row Filter Selects */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#556B5F] dark:text-[#95AFA1] block mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full text-xs bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] rounded-lg px-2 py-1 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] font-medium cursor-pointer"
            >
              {topicFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#556B5F] dark:text-[#95AFA1] block mb-1">Format</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] rounded-lg px-2 py-1 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] font-medium cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="Video Series">Video Series (YouTube)</option>
              <option value="Documentation">Official Documentation</option>
              <option value="Practice Sheet">Practice Sheet</option>
              <option value="Coding Platform">Coding Platform</option>
              <option value="Reference Book">Reference Book</option>
              <option value="Interactive Course">Interactive Course</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#556B5F] dark:text-[#95AFA1] block mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full text-xs bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] rounded-lg px-2 py-1 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] font-medium cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider text-[#556B5F] dark:text-[#95AFA1] block mb-1">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full text-xs bg-[#FAF8F5] dark:bg-[#17241D] border border-[rgba(28,46,36,0.1)] rounded-lg px-2 py-1 outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] font-medium cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="YouTube">YouTube</option>
              <option value="LeetCode">LeetCode</option>
              <option value="Official Docs">Official Docs</option>
              <option value="takeUforward">takeUforward / Striver</option>
              <option value="NeetCode">NeetCode</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
              <option value="GitHub">GitHub</option>
              <option value="MIT OCW">MIT OCW</option>
            </select>
          </div>
        </div>
      </GlassSurface>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. RESOURCE CARDS GRID                                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredResources.map((resource) => {
          const isBookmarked = bookmarkedIds.includes(resource.id);
          const isVisited = visitedIds.includes(resource.id);
          const isWeakTopic = weakTopicIds.includes(resource.topicId);

          return (
            <GlassSurface
              key={resource.id}
              level={2}
              className={`p-4 flex flex-col justify-between space-y-3 hover:border-[#4E7D63]/40 transition-all duration-150 group relative ${
                isWeakTopic ? "ring-1 ring-[#4E7D63]/30" : ""
              }`}
            >
              {/* Header Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Platform Tag */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#17241D] text-[#1C2E24] dark:text-[#F4F7F5] border border-[rgba(28,46,36,0.1)]">
                      {resource.platform === "YouTube" && <Play size={10} className="fill-[#9E4D3B] text-[#9E4D3B]" />}
                      {resource.platform === "LeetCode" && <Code2 size={10} className="text-[#8C532B]" />}
                      {resource.platform}
                    </span>

                    {/* Difficulty Badge */}
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      resource.difficulty === "Beginner"
                        ? "bg-[#EDF4F0] text-[#3B624E]"
                        : resource.difficulty === "Intermediate"
                        ? "bg-[#FAF2EB] text-[#8C532B]"
                        : "bg-[#F9EBE8] text-[#9E4D3B]"
                    }`}>
                      {resource.difficulty}
                    </span>

                    {/* Recommended Star */}
                    {resource.isRecommended && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#FAF2EB] text-[#8C532B] flex items-center gap-0.5">
                        <Star size={9} className="fill-[#8C532B]" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleBookmark(resource.id, e)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isBookmarked
                        ? "bg-[#EDF4F0] border-[#4E7D63] text-[#4E7D63]"
                        : "bg-[#FAF8F5] border-[rgba(28,46,36,0.1)] text-[#556B5F] hover:text-[#1C2E24]"
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Save Resource"}
                  >
                    <Bookmark size={13} className={isBookmarked ? "fill-[#4E7D63]" : ""} />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#556B5F] dark:text-[#95AFA1] block mb-0.5">
                    {resource.topicName}
                  </span>
                  <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5] group-hover:text-[#4E7D63] transition-colors leading-snug line-clamp-2">
                    {resource.title}
                  </h3>
                </div>

                {/* Author & Hours */}
                <div className="flex items-center gap-2 text-[11px] text-[#556B5F] dark:text-[#95AFA1] font-medium">
                  <span>By <strong className="text-[#1C2E24] dark:text-[#F4F7F5] font-semibold">{resource.authorOrChannel}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    ~{resource.estimatedHours}h
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] leading-relaxed line-clamp-3">
                  {resource.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {resource.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FAF8F5] dark:bg-[#17241D] text-[#556B5F] dark:text-[#95AFA1] border border-[rgba(28,46,36,0.08)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-[#556B5F] flex items-center gap-1">
                  {isVisited && (
                    <>
                      <CheckCircle2 size={12} className="text-[#4E7D63]" />
                      <span className="text-[#4E7D63]">Opened</span>
                    </>
                  )}
                </span>

                <GlassButton
                  variant={resource.platform === "YouTube" ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => handleOpenResource(resource)}
                  className="flex items-center gap-1.5 group/btn"
                >
                  <span>{resource.platform === "YouTube" ? "Watch Video" : resource.platform === "LeetCode" ? "Solve Problem" : "Open Resource"}</span>
                  <ExternalLink size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </GlassButton>
              </div>
            </GlassSurface>
          );
        })}
      </div>

      {/* Empty Filter State */}
      {filteredResources.length === 0 && (
        <GlassSurface level={1} className="p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8E4DC] dark:bg-[#1D2E24] mx-auto flex items-center justify-center text-[#556B5F]">
            <BookOpen size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">No resources matched your active filters</h3>
          <p className="text-xs text-[#556B5F] dark:text-[#95AFA1] max-w-sm mx-auto">
            Try adjusting your search keywords, difficulty, or selecting "All Topics" to browse the full verified study matrix.
          </p>
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedTopic("All");
              setSelectedType("All");
              setSelectedDifficulty("All");
              setSelectedPlatform("All");
              setSearchQuery("");
            }}
          >
            Reset All Filters
          </GlassButton>
        </GlassSurface>
      )}
    </div>
  );
}
