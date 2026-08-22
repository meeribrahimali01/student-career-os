import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Bot,
  Library,
  Briefcase,
  MessageSquare,
  Calendar,
  Zap,
  User,
  Search,
  Bell,
  Send,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  GraduationCap,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Target,
  Award,
  FolderGit2,
  ListOrdered,
  Code2,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Flame,
  Sun,
  Moon,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Lock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import CampusMap from "./components/CampusMap";
import StudyRoadmap from "./components/StudyRoadmap";
import AcademicTracker from "./components/AcademicTracker";
import AIDoubtSolver from "./components/AIDoubtSolver";
import SmartResources from "./components/SmartResources";
import CollegeEventHub from "./components/CollegeEventHub";
import PlacementPrep from "./components/PlacementPrep";
import ProductivityCoach from "./components/ProductivityCoach";
import StudentProfile from "./components/StudentProfile";
import DashboardIntelligence from "./components/DashboardIntelligence";
import {
  loadStudentIntelligenceState,
  saveStudentIntelligenceState,
  calculateNextBestActions,
  recordQuestionAttemptEngine,
  Question,
  TopicMastery,
  AcademicSubject,
  StudentProfileData,
} from "../data/studentIntelligence";
import { generateCareerIntelligence } from "../../careerGapService.js";
import {
  generateMockInterview,
  evaluateInterviewAnswer,
  analyzeSkillGap,
  loginUser,
  signupUser,
  logoutUser,
  getAuthMe,
  getStoredAuthToken,
  getStoredUser,
} from "../services/apiClient";

/* ══════════════════════════════════════════════════════════════════ */
/* MERIDIAN NAVIGATION RAIL TAXONOMY                                  */
/* ══════════════════════════════════════════════════════════════════ */

const NAV_SECTIONS = [
  {
    section: "OVERVIEW",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", badge: null },
      { icon: Map, label: "Roadmap", badge: "Live" },
    ],
  },
  {
    section: "LEARNING",
    items: [
      { icon: BookOpen, label: "Academics", badge: null },
      { icon: Bot, label: "AI Tutor", badge: "24/7" },
      { icon: Library, label: "Resources", badge: null },
    ],
  },
  {
    section: "CAREER",
    items: [
      { icon: Briefcase, label: "Career", badge: "AI" },
      { icon: Target, label: "Placement Prep", badge: "CDC" },
      { icon: MessageSquare, label: "Interview Practice", badge: "Gemini" },
    ],
  },
  {
    section: "CAMPUS",
    items: [
      { icon: Compass, label: "Campus Navigator", badge: "3D Map" },
      { icon: Calendar, label: "Events", badge: "4 New" },
    ],
  },
  {
    section: "PERSONAL",
    items: [
      { icon: Zap, label: "Productivity", badge: null },
      { icon: User, label: "Profile", badge: null },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════ */
/* DATA BENCHMARKS & TELEMETRY                                        */
/* ══════════════════════════════════════════════════════════════════ */

const WEEK_DATA_7D = [
  { day: "Sat", hours: 2.5, target: 4.0, today: false },
  { day: "Sun", hours: 4.8, target: 4.0, today: false },
  { day: "Mon", hours: 3.8, target: 4.0, today: false },
  { day: "Tue", hours: 5.6, target: 4.0, today: false },
  { day: "Wed", hours: 3.2, target: 4.0, today: false },
  { day: "Thu", hours: 5.0, target: 4.0, today: false },
  { day: "Fri", hours: 4.8, target: 4.0, today: true },
];

const WEEK_DATA_30D = [
  { day: "W1", hours: 26.5, target: 28.0, today: false },
  { day: "W2", hours: 31.0, target: 28.0, today: false },
  { day: "W3", hours: 24.8, target: 28.0, today: false },
  { day: "W4", hours: 29.5, target: 28.0, today: true },
];

const SUBJECTS = [
  { name: "Data Structures & Algorithms", code: "CS-501", grade: "A", score: 92, credits: 4, attendance: 94, target: 85, instructor: "Dr. K. Sharma" },
  { name: "Full Stack Web Engineering", code: "CS-502", grade: "B+", score: 85, credits: 3, attendance: 88, target: 80, instructor: "Prof. S. Iyer" },
  { name: "Relational Database Systems", code: "CS-503", grade: "A−", score: 88, credits: 4, attendance: 92, target: 85, instructor: "Dr. A. Verma" },
  { name: "Linear Algebra & Optimization", code: "MA-501", grade: "B", score: 76, credits: 3, attendance: 82, target: 75, instructor: "Prof. R. Menon" },
  { name: "Operating Systems & Concurrency", code: "CS-504", grade: "B+", score: 83, credits: 4, attendance: 90, target: 80, instructor: "Dr. M. Patel" },
];

const SGPA_HISTORY = [
  { semester: "Sem 1", sgpa: 8.2, benchmark: 7.5 },
  { semester: "Sem 2", sgpa: 8.4, benchmark: 7.5 },
  { semester: "Sem 3", sgpa: 8.5, benchmark: 7.5 },
  { semester: "Sem 4", sgpa: 8.7, benchmark: 7.5 },
  { semester: "Sem 5 (Current)", sgpa: 8.6, benchmark: 7.5 },
];

const INITIAL_ROADMAP_TIMELINE = [
  { id: 1, label: "HTML5, Semantic UI & Modern CSS Architecture", phase: "Stage 01: Core Foundations", status: "completed" as const, estHours: 15, tag: "Frontend", deliverable: "Semantic Responsive Layout Portfolio" },
  { id: 2, label: "JavaScript Deep Dive, Async/Await & Event Loop", phase: "Stage 01: Core Foundations", status: "completed" as const, estHours: 25, tag: "Core JS", deliverable: "Async Promise Queue Simulator" },
  { id: 3, label: "React Component Architecture & Custom Hooks", phase: "Stage 02: Frameworks & State", status: "completed" as const, estHours: 35, tag: "Frontend", deliverable: "Real-time State Machine UI" },
  { id: 4, label: "Algorithmic Problem Solving & Trees/Graphs", phase: "Stage 02: Problem Solving", status: "active" as const, estHours: 40, tag: "DSA", deliverable: "Blind 75 Graph Traversals (45/75)" },
  { id: 5, label: "Node.js, Express & RESTful Microservices Design", phase: "Stage 03: Backend Architecture", status: "upcoming" as const, estHours: 30, tag: "Backend", deliverable: "JWT-Secured RESTful API Engine" },
  { id: 6, label: "PostgreSQL Normalization, Indexing & ACID", phase: "Stage 03: Data Systems", status: "upcoming" as const, estHours: 25, tag: "Database", deliverable: "Indexed SQL Performance Test Suite" },
  { id: 7, label: "Full Stack Deployment & Docker CI/CD Cloud Pipeline", phase: "Stage 04: Placement Ready", status: "locked" as const, estHours: 50, tag: "DevOps", deliverable: "Production Cloud Capstone" },
];

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Google Cloud & Generative AI Innovation Summit",
    category: "Tech Fest",
    date: "Aug 28, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Main Engineering Auditorium",
    registered: false,
    tags: ["Cloud", "GenAI", "Hands-on"],
    description: "Hands-on generative AI and cloud infrastructure workshops hosted by Google Cloud architects and industry leads.",
  },
  {
    id: 2,
    title: "National Inter-University Hackathon 2026",
    category: "Hackathon",
    date: "Sep 5-6, 2026",
    time: "36 Hours Live",
    location: "Innovation Hub & Virtual",
    registered: true,
    tags: ["Hackathon", "Prizes $15k", "Team"],
    description: "Build AI-powered campus tools for university students. Judged by top Silicon Valley engineers and startup founders.",
  },
  {
    id: 3,
    title: "Microsoft Campus Pre-Placement Technical Talk",
    category: "Placement Drive",
    date: "Sep 12, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Auditorium 2 & Teams",
    registered: false,
    tags: ["SDE Hiring", "Internship", "Campus"],
    description: "Overview of Software Engineering internship and full-time hiring pipelines with live technical Q&A session.",
  },
  {
    id: 4,
    title: "Distributed Systems & System Design Masterclass",
    category: "Workshop",
    date: "Sep 18, 2026",
    time: "11:00 AM - 2:00 PM",
    location: "Lab CS-3",
    registered: false,
    tags: ["System Design", "Microservices", "Scalability"],
    description: "Deep dive into high-throughput microservices, message queues (Kafka), distributed caching, and database sharding.",
  },
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    title: "Striver's SDE Sheet & Blind 75 Algorithm Roadmap",
    category: "Data Structures",
    type: "Practice Sheet",
    difficulty: "Intermediate",
    description: "Curated 75 core algorithmic patterns essential for FAANG and Tier-1 product tech screening rounds.",
    tags: ["DSA", "LeetCode", "Algorithms"],
    link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
  },
  {
    id: 2,
    title: "System Design Primer & Scalability Patterns Guide",
    category: "System Design",
    type: "Reference Guide",
    difficulty: "Advanced",
    description: "Comprehensive visual guide on scaling web architectures, load balancers, caching, and sharding.",
    tags: ["System Design", "Architecture", "Microservices"],
    link: "https://github.com/donnemartin/system-design-primer",
  },
  {
    id: 3,
    title: "Official React & Next.js Architecture Documentation",
    category: "Web Development",
    type: "Documentation",
    difficulty: "Beginner to Pro",
    description: "Modern component lifecycle, Server Actions, suspense boundaries, and rendering performance optimizations.",
    tags: ["React", "Frontend", "JavaScript"],
    link: "https://react.dev",
  },
  {
    id: 4,
    title: "PostgreSQL Masterclass: Schema Design & Indexing",
    category: "Databases",
    type: "Video Course",
    difficulty: "Intermediate",
    description: "Relational modeling, B-tree indexes, execution plans (EXPLAIN ANALYZE), and ACID concurrency controls.",
    tags: ["SQL", "PostgreSQL", "Database"],
    link: "https://www.postgresql.org/docs/",
  },
  {
    id: 5,
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    category: "Core CS",
    type: "Textbook",
    difficulty: "Intermediate",
    description: "Virtualization, concurrency primitives (locks, semaphores), process scheduling, and file system internals.",
    tags: ["OS", "Concurrency", "Linux"],
    link: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
  },
];

const QUICK_PROMPTS = [
  "Explain Dijkstra's shortest path algorithm step by step",
  "Explain SQL Window Functions with practical examples",
  "Cache Invalidation: Write-Through vs Write-Back vs Cache-Aside",
  "What is the difference between Processes and Threads in OS?",
];

const DEFAULT_STUDENT = {
  name: "Aryan Kumar",
  email: "aryan.kumar@meridian.edu",
  year: 3,
  branch: "Computer Science & Engineering",
  college: "VIT Chennai (Vellore Institute of Technology)",
  cgpa: 8.6,
  careerGoal: "Full Stack Developer",
  skills: [
    "Data Structures",
    "Web Development",
    "Database Systems",
    "Operating Systems",
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "PostgreSQL",
    "HTML5 & Tailwind CSS",
  ],
  interests: ["Full Stack Web Engineering", "Distributed Cloud Systems", "System Architecture"],
};

/* ══════════════════════════════════════════════════════════════════ */
/* SIGNATURE ORBITAL READINESS RING (SVG TELEMETRY)                  */
/* ══════════════════════════════════════════════════════════════════ */

function OrbitalReadinessRing({
  value,
  size = 136,
  strokeWidth = 11,
  color = "#4F46E5",
  secondaryColor = "#7C3AED",
  trackColor = "currentColor",
  className = "",
  children,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  secondaryColor?: string;
  trackColor?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 150);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="meridianOrbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#meridianOrbitalGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/* MAIN MERIDIAN APPLICATION ROOT                                     */
/* ══════════════════════════════════════════════════════════════════ */

export default function App() {
  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meridian_theme") || localStorage.getItem("careeros_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("meridian_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("meridian_theme", "light");
    }
  }, [isDark]);

  // Auth State
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // App Navigation State
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [targetCampusLocationId, setTargetCampusLocationId] = useState<string | null>("ab1");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [timeRange, setTimeRange] = useState<"7D" | "30D">("7D");

  // Unified Student Intelligence State
  const [intelState] = useState(() => loadStudentIntelligenceState());
  const [topicMasteryMap, setTopicMasteryMap] = useState<Record<string, TopicMastery>>(intelState.mastery);
  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubject[]>(intelState.subjects);
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(intelState.profile);

  // Derive dynamic Next-Best-Actions connecting all intelligence layers
  const nextBestActions = useMemo(() => {
    return calculateNextBestActions(topicMasteryMap, academicSubjects, studentProfile);
  }, [topicMasteryMap, academicSubjects, studentProfile]);

  // Handler for Question Attempt
  const handleRecordAttempt = (question: Question, isCorrect: boolean, timeSeconds: number, selectedAnswer: any) => {
    const updatedMastery = recordQuestionAttemptEngine(
      topicMasteryMap,
      {
        id: `att_${Date.now()}`,
        questionId: question.id,
        topicId: question.topicId,
        selectedAnswer,
        isCorrect,
        score: isCorrect ? 100 : 0,
        timeSeconds,
        attemptedAt: new Date().toISOString(),
      },
      question
    );
    setTopicMasteryMap(updatedMastery);
    saveStudentIntelligenceState({
      mastery: updatedMastery,
      subjects: academicSubjects,
      profile: studentProfile,
    });
  };

  // Handler for Revision Scheduling
  const handleScheduleRevision = (topicId: string, intervalDays: number) => {
    const existing = topicMasteryMap[topicId];
    if (!existing) return;
    const dueLabel = intervalDays === 1 ? "Tomorrow" : `In ${intervalDays} days`;
    const updated = {
      ...topicMasteryMap,
      [topicId]: {
        ...existing,
        revisionIntervalDays: intervalDays,
        nextRevisionDue: dueLabel,
        revisionCount: (existing.revisionCount || 0) + 1,
        lastRevisedAt: "Just now",
      },
    };
    setTopicMasteryMap(updated);
    saveStudentIntelligenceState({
      mastery: updated,
      subjects: academicSubjects,
      profile: studentProfile,
    });
  };

  // Handler for Profile Updates
  const handleUpdateProfile = (updated: StudentProfileData) => {
    setStudentProfile(updated);
    saveStudentIntelligenceState({
      mastery: topicMasteryMap,
      subjects: academicSubjects,
      profile: updated,
    });
  };

  // Check auth session on startup
  useEffect(() => {
    async function initAuth() {
      const token = getStoredAuthToken();
      if (!token) {
        setAuthStatus("unauthenticated");
        return;
      }
      try {
        const res = await getAuthMe(token);
        if (res.success && res.data?.user) {
          setCurrentUser(res.data.user);
          setAuthStatus("authenticated");
        } else {
          const savedUser = getStoredUser();
          setCurrentUser(savedUser || { email: "student@meridian.edu", profile: { full_name: "Aryan Kumar" } });
          setAuthStatus("authenticated");
        }
      } catch {
        setAuthStatus("unauthenticated");
      }
    }
    initAuth();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanEmail = authEmail.trim().toLowerCase();
    const cleanPassword = authPassword.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setAuthError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (!cleanPassword) {
      setAuthError("Please enter your password.");
      return;
    }

    if (authMode === "signup") {
      if (!authFullName.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (cleanPassword.length < 6) {
        setAuthError("Password must be at least 6 characters long.");
        return;
      }
    }

    setIsAuthenticating(true);

    try {
      if (authMode === "login") {
        const res = await loginUser({ email: cleanEmail, password: cleanPassword });
        if (res.success && res.data?.token) {
          setCurrentUser(res.data.user || { email: cleanEmail, profile: { full_name: cleanEmail.split("@")[0] } });
          setAuthStatus("authenticated");
        } else {
          setAuthError(res.message || "Invalid email or password. Please try again.");
        }
      } else {
        const res = await signupUser({ email: cleanEmail, password: cleanPassword, fullName: authFullName.trim() });
        if (res.success) {
          if (res.data?.token) {
            setCurrentUser(res.data.user || { email: cleanEmail, profile: { full_name: authFullName.trim() || cleanEmail.split("@")[0] } });
            setAuthStatus("authenticated");
          } else {
            // Email verification required
            setAuthMode("login");
            setAuthError("Account created! Please check your email to verify your Meridian account before signing in.");
          }
        } else {
          setAuthError(res.message || "Unable to create your account right now. Please try again.");
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || "Error connecting to Meridian authentication server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickDemoSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await loginUser({ email: "test@careeros.com", password: "password123" });
      if (res.success) {
        setCurrentUser(res.data?.user);
        setAuthStatus("authenticated");
      } else {
        setCurrentUser({ email: "aryan.kumar@meridian.edu", profile: { full_name: "Aryan Kumar", role: "student" } });
        setAuthStatus("authenticated");
      }
    } catch {
      setCurrentUser({ email: "aryan.kumar@meridian.edu", profile: { full_name: "Aryan Kumar", role: "student" } });
      setAuthStatus("authenticated");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logoutUser();
    setCurrentUser(null);
    setAuthStatus("unauthenticated");
  };

  // Roadmap & Tasks Interactive State
  const [roadmapList, setRoadmapList] = useState(INITIAL_ROADMAP_TIMELINE);
  const [eventsList, setEventsList] = useState(INITIAL_EVENTS);
  const [resourcesList] = useState(INITIAL_RESOURCES);
  const [resourceFilter, setResourceFilter] = useState("All");

  // Pomodoro Focus Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);

  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      timer = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      setCompletedSessions((prev) => prev + 1);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, pomodoroSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const pomodoroProgress = Math.round(((25 * 60 - pomodoroSeconds) / (25 * 60)) * 100);

  // AI Tutor Conversational Workspace State
  const [studyChat, setStudyChat] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello Aryan! I am your Meridian AI Engineering Tutor. I can assist with Data Structures, System Design, SQL query optimization, or campus placement interview questions. What would you like to explore today?",
      timestamp: "10:30 AM",
    },
  ]);

  // AI Career Gap Analyzer State
  const [careerStatus, setCareerStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [careerReport, setCareerReport] = useState<any>(null);
  const [careerError, setCareerError] = useState<string | null>(null);
  const [activeCareerTab, setActiveCareerTab] = useState<
    "overview" | "skillgaps" | "roadmap" | "projects" | "learningplan" | "interview"
  >("overview");

  // AI Mock Interview Practice State
  const [interviewRole, setInterviewRole] = useState("Software Engineer");
  const [interviewType, setInterviewType] = useState<
    "technical" | "hr" | "behavioral" | "system_design" | "aptitude"
  >("technical");
  const [interviewDifficulty, setInterviewDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner"
  );
  const [interviewQuestionCount, setInterviewQuestionCount] = useState(2);
  const [interviewStatus, setInterviewStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [interviewData, setInterviewData] = useState<any>(null);
  const [interviewError, setInterviewError] = useState<string | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<Record<number, any>>({});
  const [evaluatingIndex, setEvaluatingIndex] = useState<number | null>(null);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});

  /* ══════════════════════════════════════════════════════════════ */
  /* HANDLERS & API DISPATCHERS                                        */
  /* ══════════════════════════════════════════════════════════════ */

  const handleSendStudyPrompt = (promptText?: string) => {
    const textToSend = promptText || aiInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    let aiReply = "Here is a structured engineering breakdown: ";
    const lower = textToSend.toLowerCase();

    if (lower.includes("library") || lower.includes("books") || lower.includes("study room")) {
      setTargetCampusLocationId("library");
      aiReply =
        "📍 VIT Chennai Central Library (4-Storey Knowledge Repository)\n\n• Location: Central Academic Quadrangle (West of AB-1, North of Admin Block).\n• Timings: 8:00 AM - 10:00 PM (Daily, Extended during FAT exam weeks).\n• Floor Guide:\n  - Ground Floor: Circulation Desk, OPAC Search, Newspaper Lounge\n  - 1st Floor: Core Engineering, CSE & Computing Reference Section\n  - 2nd Floor: Digital Library (120+ High-speed Terminals) & IEEE Portal\n  - 3rd Floor: Higher Studies (GATE/GRE/CAT) & Silent Research Cubicles\n\n💡 Tip: You can open the 'Campus Navigator' tab from the sidebar to view the walking route and building floor directory.";
    } else if (lower.includes("ab1") || lower.includes("ab-1") || lower.includes("academic block 1") || lower.includes("scope")) {
      setTargetCampusLocationId("ab1");
      aiReply =
        "📍 Academic Block 1 (AB-1)\n\n• Location: Central Academic Zone (East of Central Library).\n• Houses: School of Computer Science & Engineering (SCOPE) Dean & Faculty Cabins, Netaji Mini Auditorium, Computing Labs CL-01 to CL-06, and Advanced Cyber Security/AI Research Testbeds.\n• Timings: 8:00 AM - 7:30 PM (Mon-Sat).";
    } else if (lower.includes("ab2") || lower.includes("ab-2") || lower.includes("academic block 2") || lower.includes("sense") || lower.includes("smec")) {
      setTargetCampusLocationId("ab2");
      aiReply =
        "📍 Academic Block 2 (AB-2)\n\n• Location: Central Academic Zone (East of AB-1, South of AB-3).\n• Houses: School of Electronics Engineering (SENSE), School of Mechanical Engineering (SMEC), Civil Surveying, Robotics & Automation Labs, VLSI Testing, and CAD/CAM Computing Suites.\n• Timings: 8:00 AM - 7:30 PM (Mon-Sat).";
    } else if (lower.includes("ab3") || lower.includes("ab-3") || lower.includes("academic block 3") || lower.includes("mega block")) {
      setTargetCampusLocationId("ab3");
      aiReply =
        "📍 Academic Block 3 (AB-3 Mega Complex)\n\n• Location: North Academic Zone (North of AB-1 and AB-2).\n• Houses: Mega Tiered Smart Classrooms, School of Advanced Sciences (SAS), School of Social Sciences & Languages (SSL), Startup Incubation Centre, and Data Science Labs.\n• Timings: 8:00 AM - 8:30 PM (Mon-Sat).";
    } else if (lower.includes("health") || lower.includes("doctor") || lower.includes("hospital") || lower.includes("clinic") || lower.includes("medicine")) {
      setTargetCampusLocationId("health");
      aiReply =
        "📍 VIT Chennai Health Centre & Medical Clinic\n\n• Location: East Residential Enclave (North of V-Mart, West of Delta Hostels).\n• Hours: 24 Hours / 7 Days a week for Emergency Consultation & Triage.\n• Facilities: Resident Medical Officers, 8-Bed Inpatient Ward, 24/7 Pharmacy, and Dedicated Campus Ambulance.\n• Emergency Contact: Extn 108 / +91-44-3993 1108.";
    } else if (lower.includes("food") || lower.includes("canteen") || lower.includes("north square") || lower.includes("dining") || lower.includes("gazebo")) {
      setTargetCampusLocationId("northsquare");
      aiReply =
        "📍 North Square Food Court & Gazebo Discussion Area\n\n• Location: Central Plaza between Academic and Residential Zones.\n• Offerings: Multi-cuisine dining halls, South/North Indian thalis, Chinese wok counters, fresh juice and shake kiosks, Nescafe café, and shaded outdoor Gazebo study pods.\n• Timings: 8:00 AM - 10:30 PM (Daily).";
    } else if (lower.includes("hostel") || lower.includes("alpha") || lower.includes("delta") || lower.includes("beta") || lower.includes("jasmine")) {
      setTargetCampusLocationId("alpha_hostel");
      aiReply =
        "📍 VIT Chennai Hostels & Residential Enclave\n\n• Men's Hostels: Alpha Block, Beta Block, Gamma Block, Delta Blocks (D1 & D2).\n• Women's Hostels: Jasmine & Sarojini Enclaves.\n• Location: East Campus Sector.\n• Facilities: High-speed Wi-Fi, Mess Dining Halls, Gymnasiums, Laundry, Biometric Access, 24/7 Security.\n• In-time Regulation: 9:00 PM (Men's Hostels) / 8:30 PM (Women's Hostels).";
    } else if (lower.includes("sports") || lower.includes("gym") || lower.includes("ground") || lower.includes("swimming") || lower.includes("cricket")) {
      setTargetCampusLocationId("sports_ground");
      aiReply =
        "📍 Sports & Athletics Complex\n\n• Location: West Campus Sector (West of Central Library).\n• Facilities:\n  - Main Sports Oval (Full-size Cricket Turf, Football Ground, 400m Track)\n  - Indoor Sports Complex (Badminton, Table Tennis, Squash, Multi-Gymnasium)\n  - Olympic-Dimension 50m Swimming Pool\n  - Floodlit Synthetic Basketball & Tennis Courts\n• Timings: 6:00 AM - 8:30 AM & 4:30 PM - 7:30 PM.";
    } else if (lower.includes("dijkstra")) {
      aiReply =
        "Dijkstra's Algorithm calculates the shortest paths from a single source node to all other vertices in a weighted graph with non-negative edge weights.\n\nKey Concepts:\n1. Utilizes a Min-Priority Queue (Binary Heap / Fibonacci Heap).\n2. Time Complexity: O((V + E) log V).\n3. Invariant: When a node is popped from the priority queue, its shortest distance is finalized.\n\nOptimal Use Case: Network packet routing, GPS navigation, and latency-minimized service discovery.";
    } else if (lower.includes("window")) {
      aiReply =
        "SQL Window Functions perform aggregate calculations across a set of table rows related to the current row, without collapsing rows like GROUP BY does.\n\nKey Functions:\n• ROW_NUMBER(): Assigns sequential integer within partition.\n• RANK() / DENSE_RANK(): Handles ties with or without gaps.\n• LEAD() / LAG(): Accesses subsequent or previous row values directly.\n\nExample Syntax:\nSELECT department, employee, salary, RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank FROM employees;";
    } else if (lower.includes("cache")) {
      aiReply =
        "Cache Invalidation Architectural Patterns:\n\n1. Cache-Aside (Lazy Loading): Application queries cache first. On miss, queries DB and populates cache.\n2. Write-Through: Data is written to cache and database synchronously.\n3. Write-Behind (Write-Back): Data is written to cache immediately, and asynchronously flushed to DB.\n4. TTL + Pub/Sub Eviction: Time-based expiration coupled with event-driven cache purges for distributed systems.";
    } else {
      aiReply = `Excellent inquiry on "${textToSend}". In standard CS and placement interviews, articulate three key dimensions: 1) Core Definition & Invariants, 2) Time/Space Complexity (Big-O Tradeoffs), and 3) Real-World Distributed Production Example.`;
    }

    setStudyChat((prev) => [
      ...prev,
      userMsg,
      {
        id: Date.now() + 1,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setAiInput("");
  };

  const handleToggleRoadmapItem = (id: number) => {
    setRoadmapList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "completed" ? "upcoming" : "completed" }
          : item
      )
    );
  };

  const handleToggleEventRegistration = (id: number) => {
    setEventsList((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, registered: !ev.registered } : ev))
    );
  };

  const handleGenerateInterview = async () => {
    setInterviewStatus("loading");
    setInterviewError(null);
    setEvaluations({});
    try {
      const res = await generateMockInterview({
        target_role: interviewRole,
        interview_type: interviewType,
        difficulty: interviewDifficulty,
        question_count: interviewQuestionCount,
      });

      if (res.success && res.data) {
        setInterviewData(res.data);
        setInterviewStatus("success");
      } else {
        setInterviewStatus("error");
        setInterviewError(res.message || "Failed to generate mock interview questions.");
      }
    } catch (err: any) {
      console.error("Interview generation error:", err);
      setInterviewStatus("error");
      setInterviewError(err?.message || "Error contacting Meridian AI backend.");
    }
  };

  const handleEvaluateAnswer = async (qIndex: number, questionText: string) => {
    const answer = studentAnswers[qIndex];
    if (!answer || answer.trim() === "") {
      alert("Please write your answer before submitting for AI feedback.");
      return;
    }

    setEvaluatingIndex(qIndex);
    try {
      const res = await evaluateInterviewAnswer({
        question: questionText,
        answer: answer.trim(),
        target_role: interviewRole,
        interview_type: interviewType,
      });

      if (res.success && res.data) {
        setEvaluations((prev) => ({ ...prev, [qIndex]: res.data }));
      } else {
        alert(res.message || "Failed to evaluate answer.");
      }
    } catch (err: any) {
      console.error("Interview evaluation error:", err);
      alert(err?.message || "Error evaluating interview answer.");
    } finally {
      setEvaluatingIndex(null);
    }
  };

  const handleAnalyzeCareerGap = async () => {
    setCareerStatus("loading");
    setCareerError(null);
    try {
      let backendAiData: any = null;
      try {
        const res = await analyzeSkillGap({
          target_role: DEFAULT_STUDENT.careerGoal,
        });
        if (res.success && res.data) {
          backendAiData = res.data;
        }
      } catch (e) {
        console.warn("Backend skill gap API unavailable, falling back to local intelligence synthesis:", e);
      }

      const initialAnalysis = backendAiData
        ? {
            readinessScore: backendAiData.match_score || 75,
            strengths: backendAiData.strengths || [],
            skillGaps: (backendAiData.missing_skills || []).map((s: any) => s.name || s),
            prioritySkills: (backendAiData.recommended_skills || []).map((s: any) => s.name || s),
            summary: backendAiData.recommendations || undefined,
          }
        : undefined;

      const report = await generateCareerIntelligence(DEFAULT_STUDENT, initialAnalysis, {
        academicRecords: SUBJECTS.map((s) => ({
          semester: 5,
          subject: s.name,
          marks: s.score,
        })),
        maxRetries: 2,
        retryDelays: [1000, 2000],
      });

      if (backendAiData) {
        report.aiProvider = "Google Gemini 3.6 Flash (Backend API)";
        report.analysisId = backendAiData.analysis_id || null;
      } else {
        report.aiProvider = "Intelligent Heuristic Synthesis (Local Engine)";
      }

      setCareerReport(report);
      setCareerStatus("success");
    } catch (err: any) {
      console.error("Career Gap Analyzer error:", err);
      setCareerStatus("error");
      setCareerError(
        err?.error?.message ||
          err?.message ||
          "AI service is temporarily experiencing high demand. Please try again."
      );
    }
  };

  const filteredResources = useMemo(() => {
    return resourcesList.filter((r) => {
      const matchCat = resourceFilter === "All" || r.category === resourceFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [resourcesList, resourceFilter, searchQuery]);

  const completedRoadmapCount = roadmapList.filter((r) => r.status === "completed").length;
  const roadmapProgressPct = Math.round((completedRoadmapCount / roadmapList.length) * 100);

  /* ══════════════════════════════════════════════════════════════ */
  /* AUTHENTICATION STATE RENDERING                                     */
  /* ══════════════════════════════════════════════════════════════ */

  // 1. Loading Authentication State
  if (authStatus === "loading") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md pulse-ai-dot"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
          >
            <Compass size={24} />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-foreground">Meridian</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Initializing placement intelligence terminal...</p>
          </div>
          <RefreshCw size={18} className="animate-spin text-primary mt-2" />
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Screen
  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-background text-foreground font-sans">
        {/* Left Hero Branded Canvas */}
        <div
          className="lg:w-7/12 p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden text-white"
          style={{ background: "linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1E1B4B 100%)" }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              >
                <Compass size={22} />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">Meridian</span>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-700/60 ml-2">
                  Enterprise Platform
                </span>
              </div>
            </div>

            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                AI Student Career Intelligence Terminal
              </span>
              <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Build the career you're ready for.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Meridian combines live Gemini engineering evaluations, continuous milestone telemetry, and year-adaptive skill gap analysis for ambitious university students.
              </p>
            </div>
          </div>

          {/* Telemetry Visual Preview on Hero Canvas */}
          <div className="relative z-10 my-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-ai-dot" />
                <span className="text-xs font-bold text-slate-200">Active Placement Radar</span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-300">Tier-1 SDE Standards</span>
            </div>

            <div className="flex items-center gap-5">
              <OrbitalReadinessRing
                value={85}
                size={80}
                strokeWidth={7}
                color="#818CF8"
                secondaryColor="#C084FC"
                trackColor="rgba(255,255,255,0.2)"
              >
                <span className="text-base font-black text-white font-mono">85%</span>
              </OrbitalReadinessRing>

              <div className="space-y-1.5 text-xs">
                <div className="text-slate-300">
                  Target: <strong className="text-white">Full Stack Software Engineer</strong>
                </div>
                <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <ShieldCheck size={13} /> Level 4 Placement Ready (+0.2 CGPA)
                </div>
                <div className="text-[10px] text-slate-400">
                  Automated by Gemini 3.6 & Supabase PostgreSQL
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
            <span>© 2026 Meridian Intelligence Inc.</span>
            <span>VIT Chennai Cohort</span>
          </div>
        </div>

        {/* Right Auth Area */}
        <div className="lg:w-5/12 p-8 lg:p-14 flex flex-col justify-center bg-card border-l border-border">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                {authMode === "login" ? "Welcome back" : "Create student account"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {authMode === "login"
                  ? "Enter your credentials to access your Meridian placement dashboard."
                  : "Sign up to track your skills, milestones, and mock interviews."}
              </p>
            </div>

            {authError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block">Full Name</label>
                  <input
                    type="text"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="e.g. Aryan Kumar"
                    className="w-full bg-secondary border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-primary text-foreground"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">University / Personal Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs outline-none focus:border-primary text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none focus:border-primary text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 disabled:opacity-60 cursor-pointer mt-2"
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>{authMode === "login" ? "Sign In to Meridian" : "Create Meridian Account"}</span>
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-muted-foreground">Or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              onClick={handleQuickDemoSignIn}
              disabled={isAuthenticating}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-secondary hover:bg-secondary/80 border border-border text-foreground flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles size={14} className="text-primary" />
              <span>Instant Demo Access (Aryan Kumar)</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
                  setAuthError(null);
                }}
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                {authMode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Main Application Workspace
  const studentDisplayName = currentUser?.profile?.full_name || DEFAULT_STUDENT.name;
  const studentEmail = currentUser?.email || DEFAULT_STUDENT.email;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-200 font-sans">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MERIDIAN DISTINCTIVE CONTROL RAIL (SIDEBAR)                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-60"
        } flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full z-20 transition-all duration-300 ease-in-out`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0 justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            >
              <Compass size={19} />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-sidebar-foreground truncate">
                    Meridian
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    Pro
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium truncate">Career Control Rail</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="w-6 h-6 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer hidden lg:flex"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Categorized Nav Rails */}
        <nav className="flex-1 py-4 overflow-y-auto no-scroll px-2.5 space-y-4">
          {NAV_SECTIONS.map(({ section, items }) => (
            <div key={section}>
              {!isSidebarCollapsed && (
                <p className="text-[10px] font-extrabold tracking-widest text-muted-foreground px-2.5 mb-1 select-none uppercase">
                  {section}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(({ icon: Icon, label, badge }) => {
                  const active = activeNav === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveNav(label)}
                      title={isSidebarCollapsed ? label : undefined}
                      className={`w-full flex items-center ${
                        isSidebarCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2"
                      } rounded-xl text-xs font-semibold transition-all cursor-pointer relative group ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-xs"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                      )}
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={16}
                          strokeWidth={active ? 2.3 : 1.75}
                          className={active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"}
                        />
                        {!isSidebarCollapsed && <span>{label}</span>}
                      </div>
                      {!isSidebarCollapsed && badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with Dark/Light Mode & Student Profile */}
        <div className="p-2.5 border-t border-sidebar-border flex-shrink-0 space-y-2 bg-sidebar relative">
          {/* Theme Toggle Bar */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-secondary text-xs">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                {isDark ? <Moon size={13} className="text-primary" /> : <Sun size={13} className="text-amber-500" />}
                <span>{isDark ? "Dark Terminal" : "Light Mode"}</span>
              </span>
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background text-foreground border border-border hover:border-primary transition-all cursor-pointer"
              >
                Toggle
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className="w-full flex items-center justify-center p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Moon size={15} className="text-primary" /> : <Sun size={15} className="text-amber-500" />}
            </button>
          )}

          {/* Student Status Profile Badge with Interactive Menu Trigger */}
          <div
            onClick={() => setShowUserMenu((prev) => !prev)}
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center p-1.5" : "gap-2.5 p-2"
            } rounded-xl hover:bg-sidebar-accent/60 transition-all cursor-pointer group`}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}
            >
              {studentDisplayName.slice(0, 2).toUpperCase()}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
                    {studentDisplayName}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded">
                    8.6
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{studentEmail}</p>
              </div>
            )}
          </div>

          {/* Popover User Menu */}
          {showUserMenu && (
            <div className="absolute bottom-16 left-2 right-2 bg-card border border-border rounded-xl p-3 shadow-lg z-50 space-y-2">
              <div className="border-b border-border pb-2">
                <p className="text-xs font-bold text-foreground truncate">{studentDisplayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{studentEmail}</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveNav("Profile");
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <User size={13} className="text-muted-foreground" />
                  <span>Student Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsDark((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon size={13} className="text-primary" /> : <Sun size={13} className="text-amber-500" />}
                    <span>Theme: {isDark ? "Dark" : "Light"}</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer font-bold"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN WORKSPACE CANVAS                                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Sticky Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">Meridian /</span>
            <h2 className="text-sm font-extrabold text-foreground tracking-tight">{activeNav}</h2>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold ml-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-ai-dot" />
              <span>Gemini 3.6 Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, topics, questions..."
                className="w-64 text-xs bg-secondary border border-border rounded-xl pl-8 pr-3 py-1.5 outline-none transition-all placeholder:text-muted-foreground focus:border-primary text-foreground"
              />
            </div>

            <button
              onClick={() => setActiveNav("Events")}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer relative"
            >
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>

            {/* Quick Profile Dropdown Trigger */}
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-secondary border border-border hover:border-primary transition-all cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: "#4F46E5" }}
              >
                {studentDisplayName.slice(0, 1)}
              </div>
              <span className="text-xs font-semibold text-foreground">{studentDisplayName.split(" ")[0]}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-8 no-scroll">
          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 1: DASHBOARD (MOMENTUM & TELEMETRY HUB)               */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Dashboard" && (
            <DashboardIntelligence
              profile={studentProfile}
              topicMasteryMap={topicMasteryMap}
              subjects={academicSubjects}
              nextBestActions={nextBestActions}
              onNavigateToRoadmap={(topicId) => {
                setActiveNav("Roadmap");
              }}
              onNavigateToAcademics={() => setActiveNav("Academics")}
              onNavigateToCareer={() => setActiveNav("Career")}
              onNavigateToInterview={() => setActiveNav("Interview Practice")}
              onNavigateToProductivity={() => setActiveNav("Productivity")}
              onNavigateToEvents={() => setActiveNav("Events")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 2: CAREER INTELLIGENCE & GAP ANALYZER STUDIO          */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Career" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-primary" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      AI Career Intelligence & Placement Radar
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-foreground">
                    Career Gap Analysis & Year-Adaptive Intelligence
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Target Role: <strong className="text-foreground">{DEFAULT_STUDENT.careerGoal}</strong> • Evaluated against Tier-1 SDE Hiring Benchmarks
                  </p>
                </div>

                <button
                  onClick={handleAnalyzeCareerGap}
                  disabled={careerStatus === "loading"}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs flex items-center gap-2 transition-all hover:opacity-95 disabled:opacity-70 cursor-pointer flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                >
                  {careerStatus === "loading" ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Synthesizing with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Analyze My Career Gap</span>
                    </>
                  )}
                </button>
              </div>

              {careerStatus === "error" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={17} className="text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-destructive">Analysis Notice</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{careerError}</p>
                    <button
                      onClick={handleAnalyzeCareerGap}
                      className="mt-2 text-xs font-bold px-3 py-1 rounded-lg bg-destructive text-white cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {careerReport && (
                <div className="space-y-6">
                  <div className="flex border-b border-border space-x-5 overflow-x-auto no-scroll">
                    {[
                      { id: "overview", label: "Readiness & Radar", icon: TrendingUp },
                      { id: "skillgaps", label: `Skill Gaps (${careerReport.skillGaps?.length || 0})`, icon: Target },
                      { id: "roadmap", label: "Adaptive Roadmap", icon: Map },
                      { id: "projects", label: `Projects (${careerReport.projects?.length || 0})`, icon: FolderGit2 },
                      { id: "learningplan", label: "30-Day Plan", icon: ListOrdered },
                      { id: "interview", label: "Interview Prep", icon: Award },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const active = activeCareerTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveCareerTab(tab.id as any)}
                          className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            active
                              ? "border-primary text-primary"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={14} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activeCareerTab === "overview" && (
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 md:col-span-4 bg-card border border-border p-5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">
                              Readiness Score
                            </span>
                            {careerReport.aiProvider && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {careerReport.aiProvider}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <OrbitalReadinessRing
                              value={careerReport.readiness?.overallScore || 75}
                              size={88}
                              strokeWidth={8}
                              color="#4F46E5"
                              secondaryColor="#7C3AED"
                            >
                              <span className="text-xl font-black text-foreground font-mono">
                                {careerReport.readiness?.overallScore || 75}
                              </span>
                            </OrbitalReadinessRing>
                            <div>
                              <span className="text-xs font-bold text-foreground block">
                                Placement Verified
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                                Industry SDE Standard
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-3.5 leading-relaxed bg-secondary p-3 rounded-xl">
                            {careerReport.readiness?.explanation}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-border">
                          <span className="text-[11px] font-bold text-foreground block mb-1">
                            Primary Focus Delta:
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold inline-block">
                            {careerReport.readiness?.biggestImprovementArea || "Distributed Systems & Architecture"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-8 bg-card border border-border p-5 rounded-2xl space-y-3">
                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                          6-Dimension Competency Benchmarks (You vs. Target)
                        </h3>
                        {careerReport.readiness?.scoreBreakdown &&
                          Object.entries(careerReport.readiness.scoreBreakdown).map(
                            ([key, val]: [string, any]) => (
                              <div key={key} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="capitalize font-semibold text-foreground">
                                    {key.replace(/([A-Z])/g, " $1")}
                                  </span>
                                  <span className="font-mono text-muted-foreground font-semibold">
                                    {val}% <span className="text-[10px] text-muted-foreground">(Benchmark: 80%)</span>
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                      width: `${val}%`,
                                      background: val >= 80 ? "#059669" : val >= 70 ? "#4F46E5" : "#D97706",
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  )}

                  {activeCareerTab === "skillgaps" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {careerReport.skillGaps?.map((gap: any, i: number) => (
                        <div key={i} className="bg-card border border-border p-4 rounded-xl space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-foreground">{gap.skill}</h4>
                              <span className="text-[10px] text-muted-foreground">
                                Current: {gap.currentLevel} ➔ Target: <strong className="text-primary">{gap.targetLevel}</strong>
                              </span>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-secondary text-foreground uppercase">
                              {gap.importance} Priority
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{gap.reason}</p>
                          <span className="text-[10px] font-semibold text-muted-foreground block">
                            Est. Learning: {gap.estimatedLearningTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCareerTab === "roadmap" && (
                    <div className="space-y-3">
                      {careerReport.roadmap?.map((phase: any, i: number) => (
                        <div key={i} className="bg-card border border-border p-4 rounded-xl space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center">
                              {phase.phase}
                            </span>
                            <h4 className="text-xs font-bold text-foreground">{phase.title}</h4>
                            <span className="text-[10px] text-muted-foreground ml-auto">{phase.duration}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div className="bg-secondary p-3 rounded-lg text-xs">
                              <span className="font-bold text-foreground block mb-1">Competencies:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                                {phase.milestones?.map((m: string, idx: number) => <li key={idx}>{m}</li>)}
                              </ul>
                            </div>
                            <div className="bg-secondary p-3 rounded-lg text-xs">
                              <span className="font-bold text-foreground block mb-1">Deliverables:</span>
                              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                                {phase.deliverables?.map((d: string, idx: number) => <li key={idx}>{d}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCareerTab === "projects" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {careerReport.projects?.map((proj: any, i: number) => (
                        <div key={i} className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                              {proj.difficulty} • {proj.estimatedDuration}
                            </span>
                            <h4 className="text-xs font-bold text-foreground mt-2">{proj.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{proj.whyRecommended}</p>
                          </div>
                          <div className="pt-2 border-t border-border text-xs text-muted-foreground italic">
                            "{proj.resumeValue}"
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeCareerTab === "learningplan" && (
                    <div className="bg-card border border-border p-5 rounded-2xl space-y-3">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">30-Day Execution Schedule</h3>
                      <div className="space-y-2">
                        {careerReport.learningPlan?.map((plan: any, i: number) => (
                          <div key={i} className="p-3 rounded-xl bg-secondary flex items-start gap-3 text-xs">
                            <span className="px-2 py-0.5 rounded-lg bg-primary text-white font-bold text-[10px]">
                              Day {plan.day}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-foreground">{plan.topic}</h5>
                              <p className="text-[10px] text-muted-foreground">Time: {plan.estimatedTime}</p>
                              <p className="text-primary font-semibold mt-0.5">Deliverable: {plan.output}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCareerTab === "interview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-card border border-border p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Code2 size={15} className="text-primary" />
                          <span>Interview Technical Focus</span>
                        </h4>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5">
                          {careerReport.interviewPreparation?.technicalTopics?.map((t: string, i: number) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-card border border-border p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <FolderGit2 size={15} className="text-primary" />
                          <span>GitHub & Portfolio Guidelines</span>
                        </h4>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5">
                          {careerReport.portfolioAdvice?.githubImprovements?.map((tip: string, i: number) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 3: 4-YEAR ADAPTIVE STUDY ROADMAP & QUESTION ATTEMPTS  */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Roadmap" && (
            <StudyRoadmap
              topicMasteryMap={topicMasteryMap}
              onRecordAttempt={handleRecordAttempt}
              onScheduleRevision={handleScheduleRevision}
              onNavigateToAI={(prompt) => {
                setActiveNav("AI Tutor");
                setAiInput(prompt);
              }}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 4: ACADEMIC & PERFORMANCE TRACKER (VIT CHENNAI)       */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Academics" && (
            <AcademicTracker
              subjects={academicSubjects}
              cgpa={studentProfile.cgpa}
              onNavigateToRoadmap={() => setActiveNav("Roadmap")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 5: AI STUDENT DOUBT SOLVER & TUTOR WORKSPACE          */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "AI Tutor" && (
            <AIDoubtSolver
              initialPrompt={aiInput}
              onNavigateToCampus={(locId) => {
                setTargetCampusLocationId(locId);
                setActiveNav("Campus Navigator");
              }}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 6: SMART STUDY RESOURCES & WEAK-TOPIC RECOMMENDATIONS */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Resources" && (
            <SmartResources
              topicMasteryMap={topicMasteryMap}
              onNavigateToRoadmap={() => setActiveNav("Roadmap")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW: PLACEMENT PREPARATION & TIER-1 ELIGIBILITY RADAR     */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Placement Prep" && (
            <PlacementPrep
              profile={studentProfile}
              onNavigateToCareerGap={() => setActiveNav("Career")}
              onNavigateToInterview={() => setActiveNav("Interview Practice")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 7: AI MOCK INTERVIEW SIMULATOR STUDIO                 */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Interview Practice" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={15} className="text-primary" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Meridian Mock Interview Studio
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-foreground">
                    Interactive Technical Interview Practice
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Powered by Google Gemini • Real-time AI evaluation, scoring & coaching suggestions.
                  </p>
                </div>

                <button
                  onClick={handleGenerateInterview}
                  disabled={interviewStatus === "loading"}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs flex items-center gap-2 transition-all hover:opacity-95 disabled:opacity-70 cursor-pointer flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                >
                  {interviewStatus === "loading" ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Generating Questions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate Questions</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card border border-border p-4 rounded-xl">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Role</label>
                  <input
                    type="text"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    className="w-full text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary text-foreground font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary text-foreground font-semibold cursor-pointer"
                  >
                    <option value="technical">Technical</option>
                    <option value="hr">HR / Behavioral</option>
                    <option value="system_design">System Design</option>
                    <option value="aptitude">Aptitude</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Difficulty</label>
                  <select
                    value={interviewDifficulty}
                    onChange={(e) => setInterviewDifficulty(e.target.value as any)}
                    className="w-full text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary text-foreground font-semibold cursor-pointer"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Count</label>
                  <select
                    value={interviewQuestionCount}
                    onChange={(e) => setInterviewQuestionCount(Number(e.target.value))}
                    className="w-full text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary text-foreground font-semibold cursor-pointer"
                  >
                    <option value={2}>2 Questions</option>
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                  </select>
                </div>
              </div>

              {interviewData && interviewData.questions && (
                <div className="space-y-4">
                  {interviewData.questions.map((q: any, idx: number) => {
                    const evaluation = evaluations[idx];
                    const isEvaluating = evaluatingIndex === idx;
                    const showHints = openHints[idx] || false;

                    return (
                      <div key={idx} className="bg-card border border-border p-5 rounded-2xl space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-primary text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                              {q.category || "Core"}
                            </span>
                          </div>
                          <button
                            onClick={() => setOpenHints((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                            className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                          >
                            <span>{showHints ? "Hide Key Points" : "View Key Points"}</span>
                            {showHints ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-foreground leading-relaxed">{q.question}</h4>

                        {showHints && (
                          <div className="bg-secondary p-3 rounded-xl text-xs text-muted-foreground space-y-1.5">
                            {q.key_points_to_cover && (
                              <div>
                                <span className="font-bold text-foreground">Key points to include:</span>
                                <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                                  {q.key_points_to_cover.map((pt: string, pIdx: number) => <li key={pIdx}>{pt}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={studentAnswers[idx] || ""}
                            onChange={(e) => {
                              const text = e.target.value;
                              setStudentAnswers((prev) => ({ ...prev, [idx]: text }));
                            }}
                            placeholder="Write your structured answer here..."
                            className="w-full text-xs bg-secondary border border-border rounded-xl p-3 outline-none focus:border-primary text-foreground leading-relaxed"
                          />

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleEvaluateAnswer(idx, q.question)}
                              disabled={isEvaluating || !(studentAnswers[idx] || "").trim()}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                            >
                              {isEvaluating ? <RefreshCw size={12} className="animate-spin" /> : <Award size={12} />}
                              <span>{isEvaluating ? "Evaluating..." : "Get AI Feedback"}</span>
                            </button>
                          </div>
                        </div>

                        {evaluation && (
                          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-900 dark:text-emerald-300">
                                AI Coaching Score: {evaluation.score}/100 ({evaluation.verdict})
                              </span>
                            </div>
                            {evaluation.feedback && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
                                <div>
                                  <span className="font-bold text-emerald-800 dark:text-emerald-400 block">✓ Strengths:</span>
                                  <ul className="list-disc list-inside">
                                    {evaluation.feedback.strengths?.map((s: string, sIdx: number) => <li key={sIdx}>{s}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <span className="font-bold text-amber-800 dark:text-amber-400 block">💡 Improvements:</span>
                                  <ul className="list-disc list-inside">
                                    {evaluation.feedback.improvements?.map((imp: string, iIdx: number) => <li key={iIdx}>{imp}</li>)}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW: CAMPUS NAVIGATOR (VIT CHENNAI SPATIAL MAP)         */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Campus Navigator" && (
            <CampusMap
              initialLocationId={targetCampusLocationId}
              onNavigateToTutor={() => setActiveNav("AI Tutor")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 8: CAMPUS EVENTS & DRIVES                             */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Events" && (
            <CollegeEventHub
              onAddEventToPlan={() => setActiveNav("Productivity")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 9: PRODUCTIVITY & POMODORO TIMER                      */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Productivity" && (
            <ProductivityCoach
              studyStreakDays={studentProfile.studyStreakDays}
              focusScore={studentProfile.focusScore}
              todayStudyMinutes={studentProfile.todayStudyMinutes}
              targetDailyMinutes={studentProfile.targetDailyMinutes}
              nextBestActions={nextBestActions}
              onLaunchRoadmapQuiz={() => setActiveNav("Roadmap")}
            />
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 10: STUDENT PROFILE & SETTINGS                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          {activeNav === "Profile" && (
            <StudentProfile
              profile={studentProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
