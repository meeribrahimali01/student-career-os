/**
 * StudentOS Unified Student Intelligence Core & State Engine
 *
 * Connects student activity, academic performance, learning progress,
 * question attempts, weak/strong topics, spaced revision, career goals,
 * productivity, and the Next-Best-Action recommendation engine.
 */

export interface Question {
  id: string;
  topicId: string;
  topicName: string;
  subtopic: string;
  year: 1 | 2 | 3 | 4;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "mcq" | "multiple" | "boolean" | "short_code";
  questionText: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: number | string; // Index for MCQ or exact string
  explanation: string;
  skillTags: string[];
  estimatedMinutes: number;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  topicId: string;
  selectedAnswer: number | string;
  isCorrect: boolean;
  score: number; // 0 to 100
  timeSeconds: number;
  attemptedAt: string;
}

export interface TopicMastery {
  topicId: string;
  topicName: string;
  category: string;
  year: number;
  masteryScore: number; // 0 - 100%
  status: "CRITICAL" | "WEAK" | "AVERAGE" | "IMPROVING" | "STRONG";
  totalAttempts: number;
  correctAttempts: number;
  lastAttemptedAt?: string;
  lastRevisedAt?: string;
  nextRevisionDue?: string;
  revisionIntervalDays: number;
  revisionCount: number;
  priorityScore: number; // Higher means more urgently needs focus
}

export interface AcademicSubject {
  code: string;
  name: string;
  semester: number;
  credits: number;
  score: number; // Percentage / 100
  grade: string;
  attendancePct: number;
  status: "strong" | "average" | "needs_attention";
  trendDelta: number; // e.g. +12 or -5
  internalMarks: number; // out of 50
  endSemMarks: number; // out of 100
}

export interface NextBestAction {
  id: string;
  title: string;
  reason: string;
  category: "Study" | "Revision" | "Academic" | "Career" | "Productivity" | "Interview";
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "NORMAL";
  estimatedMinutes: number;
  actionType: "attempt_quiz" | "revise_topic" | "view_resource" | "practice_interview" | "start_focus" | "view_academic";
  targetPayload?: any;
  completed?: boolean;
}

export interface StudyResourceItem {
  id: string;
  title: string;
  category: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Practice Sheet" | "Interactive Course" | "Documentation" | "Video Guide" | "Reference Book";
  url: string;
  estimatedHours: number;
  relevanceReason?: string;
  tags: string[];
}

export interface CollegeEventItem {
  id: number;
  title: string;
  category: "Hackathon" | "Placement Drive" | "Technical Workshop" | "Coding Contest" | "Guest Lecture";
  organizer: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registered: boolean;
  deadline: string;
  tags: string[];
  eligibility: string;
}

export interface ProductivityTask {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  durationMinutes: number;
  completed: boolean;
  dueDate: string;
  relatedTopicId?: string;
}

export interface StudentProfileData {
  name: string;
  email: string;
  rollNumber: string;
  college: string;
  year: number;
  branch: string;
  semester: number;
  cgpa: number;
  targetRole: string;
  targetCompanies: string[];
  skills: Array<{ name: string; level: number; category: string; verified: boolean }>;
  githubUrl: string;
  linkedinUrl: string;
  leetcodeProfile: string;
  studyStreakDays: number;
  todayStudyMinutes: number;
  targetDailyMinutes: number;
  focusScore: number; // 0 - 100
}

/* ══════════════════════════════════════════════════════════════════ */
/* COMPREHENSIVE INITIAL DATASETS                                     */
/* ══════════════════════════════════════════════════════════════════ */

export const INITIAL_QUESTIONS: Question[] = [
  // ─── DATA STRUCTURES: GRAPHS ─────────────────────────────────────
  {
    id: "q_graph_1",
    topicId: "graphs",
    topicName: "Graph Algorithms",
    subtopic: "Shortest Paths (Dijkstra)",
    year: 2,
    difficulty: "Easy",
    type: "mcq",
    questionText: "What is the primary constraint of Dijkstra's algorithm regarding edge weights?",
    options: [
      "All edge weights must be strictly negative",
      "All edge weights must be non-negative",
      "The graph must be a Directed Acyclic Graph (DAG)",
      "The graph must have an even number of vertices",
    ],
    correctAnswer: 1,
    explanation:
      "Dijkstra's algorithm greedily assumes that adding an edge cannot reduce the shortest distance to an already finalized vertex. Negative edge weights violate this invariant, causing incorrect shortest paths.",
    skillTags: ["Graphs", "Dijkstra", "Shortest Path", "Greedy"],
    estimatedMinutes: 2,
  },
  {
    id: "q_graph_2",
    topicId: "graphs",
    topicName: "Graph Algorithms",
    subtopic: "Topological Sorting",
    year: 2,
    difficulty: "Medium",
    type: "mcq",
    questionText: "Which data structure is utilized in Kahn's Algorithm for Topological Sorting to track vertices with in-degree 0?",
    options: ["Max-Heap", "Queue / FIFO Buffer", "Disjoint Set Union (DSU)", "Red-Black Tree"],
    correctAnswer: 1,
    explanation:
      "Kahn's Algorithm iteratively pushes vertices with an in-degree of 0 into a Queue, decrements the in-degree of neighboring nodes upon dequeue, and detects cycles if the processed count < total vertices.",
    skillTags: ["Graphs", "Topological Sort", "Kahn's Algorithm", "Queue"],
    estimatedMinutes: 3,
  },
  {
    id: "q_graph_3",
    topicId: "graphs",
    topicName: "Graph Algorithms",
    subtopic: "Disjoint Set Union (DSU)",
    year: 3,
    difficulty: "Hard",
    type: "mcq",
    questionText: "What is the amortized time complexity per operation in a Disjoint Set Union (DSU) with both Path Compression and Union by Rank?",
    options: ["O(log V)", "O(α(V)) (Inverse Ackermann function)", "O(V)", "O(E log V)"],
    correctAnswer: 1,
    explanation:
      "With both Path Compression and Union by Rank heuristics, the operational time complexity is O(α(V)), where α is the Inverse Ackermann function, which grows so slowly that α(V) ≤ 4 for all practical universe sizes.",
    skillTags: ["Graphs", "DSU", "Kruskal", "Amortized Analysis"],
    estimatedMinutes: 4,
  },

  // ─── DYNAMIC PROGRAMMING ─────────────────────────────────────────
  {
    id: "q_dp_1",
    topicId: "dp",
    topicName: "Dynamic Programming",
    subtopic: "0/1 Knapsack",
    year: 2,
    difficulty: "Easy",
    type: "mcq",
    questionText: "Why can't the Greedy Approach solve the classic 0/1 Knapsack problem optimally?",
    options: [
      "Items cannot be subdivided, creating state-space sub-optimality without exploring combinations",
      "Greedy algorithms cannot run on arrays",
      "0/1 Knapsack requires negative numbers",
      "Dynamic programming is always O(1)",
    ],
    correctAnswer: 0,
    explanation:
      "In 0/1 Knapsack, taking an item with the highest value/weight ratio might prevent picking combinations of other items that yield a higher combined value without exceeding the capacity limit.",
    skillTags: ["Dynamic Programming", "Knapsack", "Greedy vs DP"],
    estimatedMinutes: 2,
  },
  {
    id: "q_dp_2",
    topicId: "dp",
    topicName: "Dynamic Programming",
    subtopic: "Longest Common Subsequence (LCS)",
    year: 3,
    difficulty: "Medium",
    type: "mcq",
    questionText: "What is the space-optimized auxiliary memory complexity to compute the length of LCS between two strings of lengths M and N?",
    options: ["O(M * N)", "O(min(M, N))", "O(M + N)", "O(1)"],
    correctAnswer: 1,
    explanation:
      "Because the recurrence dp[i][j] only references the current row and the previous row (dp[i-1]), we only need to maintain two rows of length min(M, N), reducing space to O(min(M, N)).",
    skillTags: ["Dynamic Programming", "LCS", "Space Optimization"],
    estimatedMinutes: 3,
  },
  {
    id: "q_dp_3",
    topicId: "dp",
    topicName: "Dynamic Programming",
    subtopic: "Matrix Chain Multiplication",
    year: 3,
    difficulty: "Hard",
    type: "mcq",
    questionText: "In Matrix Chain Multiplication with matrices of dimensions d0 x d1, d1 x d2, ... dn-1 x dn, what is the standard DP time complexity?",
    options: ["O(N^2)", "O(N^3)", "O(2^N)", "O(N log N)"],
    correctAnswer: 1,
    explanation:
      "There are O(N^2) subproblems representing sub-chains [i..j], and for each subproblem we test k from i to j-1 (O(N) splits), yielding an overall time complexity of O(N^3).",
    skillTags: ["Dynamic Programming", "MCM", "Partition DP"],
    estimatedMinutes: 4,
  },

  // ─── OPERATING SYSTEMS ───────────────────────────────────────────
  {
    id: "q_os_1",
    topicId: "os",
    topicName: "Operating Systems Internals",
    subtopic: "Process Synchronization",
    year: 2,
    difficulty: "Easy",
    type: "mcq",
    questionText: "Which of the following conditions is NOT one of the 4 Coffman conditions required for a Deadlock to occur?",
    options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed by OS", "Circular Wait"],
    correctAnswer: 2,
    explanation:
      "The 4 Coffman conditions are: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption (resources cannot be forcibly taken), and 4) Circular Wait. If preemption is allowed, deadlock cannot occur.",
    skillTags: ["Operating Systems", "Deadlock", "Coffman Conditions", "Concurrency"],
    estimatedMinutes: 2,
  },
  {
    id: "q_os_2",
    topicId: "os",
    topicName: "Operating Systems Internals",
    subtopic: "Virtual Memory & Paging",
    year: 2,
    difficulty: "Medium",
    type: "mcq",
    questionText: "What phenomenon occurs when excessive page faults cause the OS to spend more time swapping pages than executing instructions?",
    options: ["Starvation", "Thrashing", "Belady's Anomaly", "Internal Fragmentation"],
    correctAnswer: 1,
    explanation:
      "Thrashing occurs when the active working set of processes exceeds physical RAM capacity, causing high-frequency page fault exceptions and disk I/O thrashing.",
    skillTags: ["Operating Systems", "Virtual Memory", "Thrashing", "Paging"],
    estimatedMinutes: 3,
  },

  // ─── DATABASE MANAGEMENT SYSTEMS ─────────────────────────────────
  {
    id: "q_dbms_1",
    topicId: "dbms",
    topicName: "Database Systems & SQL",
    subtopic: "ACID Transactions",
    year: 2,
    difficulty: "Easy",
    type: "mcq",
    questionText: "Which ACID property guarantees that database changes made by a committed transaction survive hardware or server crashes?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswer: 3,
    explanation:
      "Durability ensures that once a transaction commits, its writes are persisted permanently (typically recorded in Write-Ahead Logs / WAL and disk storage) even if power fails.",
    skillTags: ["DBMS", "SQL", "ACID", "Transactions"],
    estimatedMinutes: 2,
  },
  {
    id: "q_dbms_2",
    topicId: "dbms",
    topicName: "Database Systems & SQL",
    subtopic: "Indexing (B+ Trees)",
    year: 2,
    difficulty: "Medium",
    type: "mcq",
    questionText: "Why are B+ Trees preferred over standard Binary Search Trees for database indexes on disk?",
    options: [
      "B+ Trees have high fan-out (wide branching factor), minimizing expensive disk I/O seek operations",
      "BSTs cannot store strings",
      "B+ Trees use less RAM than flat files",
      "B+ Trees do not require locking",
    ],
    correctAnswer: 0,
    explanation:
      "B+ Tree nodes match disk block page sizes (e.g. 4KB/8KB) and store hundreds of keys per node (high fan-out), enabling lookups in 3-4 disk seeks even for billions of rows.",
    skillTags: ["DBMS", "B+ Trees", "Indexing", "Disk I/O"],
    estimatedMinutes: 3,
  },

  // ─── SYSTEM DESIGN & DISTRIBUTED SYSTEMS ─────────────────────────
  {
    id: "q_sd_1",
    topicId: "system_design",
    topicName: "System Design & Cloud",
    subtopic: "CAP Theorem",
    year: 3,
    difficulty: "Medium",
    type: "mcq",
    questionText: "According to the CAP Theorem, in the inevitable presence of a Network Partition (P), what trade-off must a distributed system make?",
    options: [
      "Consistency (C) vs Availability (A)",
      "Performance (P) vs Security (S)",
      "Latency (L) vs Throughput (T)",
      "Atomicity (A) vs Durability (D)",
    ],
    correctAnswer: 0,
    explanation:
      "When network partitions happen (nodes cannot communicate), a distributed system must choose between returning an error/blocking to guarantee Consistency (CP) or returning stale data to maintain Availability (AP).",
    skillTags: ["System Design", "CAP Theorem", "Distributed Systems", "High Availability"],
    estimatedMinutes: 3,
  },
];

export const INITIAL_TOPIC_MASTERY: Record<string, TopicMastery> = {
  graphs: {
    topicId: "graphs",
    topicName: "Graph Algorithms",
    category: "Data Structures",
    year: 2,
    masteryScore: 42,
    status: "CRITICAL",
    totalAttempts: 5,
    correctAttempts: 2,
    lastAttemptedAt: "Yesterday",
    lastRevisedAt: "5 days ago",
    nextRevisionDue: "TODAY",
    revisionIntervalDays: 1,
    revisionCount: 2,
    priorityScore: 95,
  },
  dp: {
    topicId: "dp",
    topicName: "Dynamic Programming",
    category: "Algorithms",
    year: 3,
    masteryScore: 46,
    status: "WEAK",
    totalAttempts: 6,
    correctAttempts: 3,
    lastAttemptedAt: "2 days ago",
    lastRevisedAt: "6 days ago",
    nextRevisionDue: "Tomorrow",
    revisionIntervalDays: 3,
    revisionCount: 1,
    priorityScore: 90,
  },
  os: {
    topicId: "os",
    topicName: "Operating Systems Internals",
    category: "Core CS",
    year: 2,
    masteryScore: 68,
    status: "IMPROVING",
    totalAttempts: 8,
    correctAttempts: 5,
    lastAttemptedAt: "Today",
    lastRevisedAt: "Yesterday",
    nextRevisionDue: "In 3 days",
    revisionIntervalDays: 7,
    revisionCount: 3,
    priorityScore: 72,
  },
  dbms: {
    topicId: "dbms",
    topicName: "Database Systems & SQL",
    category: "Databases",
    year: 2,
    masteryScore: 88,
    status: "STRONG",
    totalAttempts: 12,
    correctAttempts: 11,
    lastAttemptedAt: "3 days ago",
    lastRevisedAt: "3 days ago",
    nextRevisionDue: "In 14 days",
    revisionIntervalDays: 14,
    revisionCount: 5,
    priorityScore: 30,
  },
  system_design: {
    topicId: "system_design",
    topicName: "System Design & Cloud",
    category: "Architecture",
    year: 3,
    masteryScore: 54,
    status: "WEAK",
    totalAttempts: 4,
    correctAttempts: 2,
    lastAttemptedAt: "4 days ago",
    lastRevisedAt: "4 days ago",
    nextRevisionDue: "TODAY",
    revisionIntervalDays: 3,
    revisionCount: 1,
    priorityScore: 85,
  },
  web_dev: {
    topicId: "web_dev",
    topicName: "Full Stack Web Engineering",
    category: "Software Engineering",
    year: 2,
    masteryScore: 85,
    status: "STRONG",
    totalAttempts: 14,
    correctAttempts: 12,
    lastAttemptedAt: "Today",
    lastRevisedAt: "Today",
    nextRevisionDue: "In 20 days",
    revisionIntervalDays: 30,
    revisionCount: 4,
    priorityScore: 25,
  },
};

export const INITIAL_ACADEMIC_SUBJECTS: AcademicSubject[] = [
  {
    code: "CSE3001",
    name: "Database Management Systems",
    semester: 5,
    credits: 4,
    score: 88,
    grade: "A+",
    attendancePct: 92,
    status: "strong",
    trendDelta: 12,
    internalMarks: 46,
    endSemMarks: 88,
  },
  {
    code: "CSE3002",
    name: "Operating Systems Internals",
    semester: 5,
    credits: 4,
    score: 68,
    grade: "B",
    attendancePct: 81,
    status: "needs_attention",
    trendDelta: -4,
    internalMarks: 34,
    endSemMarks: 68,
  },
  {
    code: "CSE3003",
    name: "Design & Analysis of Algorithms",
    semester: 5,
    credits: 4,
    score: 76,
    grade: "A",
    attendancePct: 88,
    status: "average",
    trendDelta: 6,
    internalMarks: 38,
    endSemMarks: 76,
  },
  {
    code: "CSE3004",
    name: "Computer Networks & Protocols",
    semester: 5,
    credits: 3,
    score: 74,
    grade: "B+",
    attendancePct: 78, // Approaching 75% warning threshold
    status: "needs_attention",
    trendDelta: 2,
    internalMarks: 36,
    endSemMarks: 74,
  },
  {
    code: "CSE3005",
    name: "Full Stack Web Technologies",
    semester: 5,
    credits: 3,
    score: 91,
    grade: "S",
    attendancePct: 95,
    status: "strong",
    trendDelta: 8,
    internalMarks: 48,
    endSemMarks: 91,
  },
];

export const INITIAL_STUDENT_PROFILE: StudentProfileData = {
  name: "Aryan Kumar",
  email: "aryan.kumar@meridian.edu",
  rollNumber: "23BCE10482",
  college: "VIT Chennai (Vellore Institute of Technology)",
  year: 3,
  branch: "Computer Science & Engineering",
  semester: 5,
  cgpa: 8.6,
  targetRole: "Full Stack Software Engineer",
  targetCompanies: ["Google", "Microsoft", "Amazon", "Atlassian", "Uber"],
  skills: [
    { name: "React & TypeScript", level: 88, category: "Frontend", verified: true },
    { name: "Node.js & Express", level: 84, category: "Backend", verified: true },
    { name: "PostgreSQL & SQL", level: 89, category: "Databases", verified: true },
    { name: "Data Structures & Algorithms", level: 68, category: "Core CS", verified: true },
    { name: "Operating Systems Internals", level: 58, category: "Core CS", verified: false },
    { name: "System Design & Microservices", level: 52, category: "Architecture", verified: false },
    { name: "Docker & Cloud Basics", level: 64, category: "DevOps", verified: false },
    { name: "Technical Communication", level: 75, category: "Soft Skills", verified: true },
  ],
  githubUrl: "https://github.com/aryankumar-dev",
  linkedinUrl: "https://linkedin.com/in/aryan-kumar",
  leetcodeProfile: "https://leetcode.com/aryan_vit",
  studyStreakDays: 14,
  todayStudyMinutes: 75,
  targetDailyMinutes: 180,
  focusScore: 86,
};

/* ══════════════════════════════════════════════════════════════════ */
/* CORE INTELLIGENCE FUNCTIONS                                        */
/* ══════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "meridian_student_intelligence_v1";

export function loadStudentIntelligenceState() {
  if (typeof window === "undefined" || !window.localStorage) {
    return {
      mastery: INITIAL_TOPIC_MASTERY,
      subjects: INITIAL_ACADEMIC_SUBJECTS,
      profile: INITIAL_STUDENT_PROFILE,
      attempts: [],
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {
      mastery: INITIAL_TOPIC_MASTERY,
      subjects: INITIAL_ACADEMIC_SUBJECTS,
      profile: INITIAL_STUDENT_PROFILE,
      attempts: [],
    };
    return JSON.parse(raw);
  } catch {
    return {
      mastery: INITIAL_TOPIC_MASTERY,
      subjects: INITIAL_ACADEMIC_SUBJECTS,
      profile: INITIAL_STUDENT_PROFILE,
      attempts: [],
    };
  }
}

export function saveStudentIntelligenceState(state: any) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to persist intelligence state:", e);
  }
}

/**
 * Calculates real-time Next Best Actions connecting all telemetry inputs
 */
export function calculateNextBestActions(
  masteryMap: Record<string, TopicMastery>,
  subjects: AcademicSubject[],
  profile: StudentProfileData
): NextBestAction[] {
  const actions: NextBestAction[] = [];

  // 1. Identify Overdue Revision or Critical Topic
  const topicsList = Object.values(masteryMap);
  const criticalTopic = topicsList.find((t) => t.status === "CRITICAL" || t.nextRevisionDue === "TODAY");
  if (criticalTopic) {
    actions.push({
      id: "nba_critical_topic",
      title: `Practice ${criticalTopic.topicName}`,
      reason: `Recent accuracy is ${criticalTopic.masteryScore}% and revision is overdue. Highest priority for placement readiness.`,
      category: "Revision",
      urgency: "CRITICAL",
      estimatedMinutes: 20,
      actionType: "attempt_quiz",
      targetPayload: { topicId: criticalTopic.topicId },
    });
  }

  // 2. Identify Lowest-Scoring Academic Subject
  const lowestSubject = [...subjects].sort((a, b) => a.score - b.score)[0];
  if (lowestSubject && lowestSubject.score < 75) {
    actions.push({
      id: "nba_academic_subject",
      title: `Review ${lowestSubject.name}`,
      reason: `${lowestSubject.name} is currently your lowest core subject (${lowestSubject.score}% average).`,
      category: "Academic",
      urgency: "HIGH",
      estimatedMinutes: 30,
      actionType: "view_academic",
      targetPayload: { subjectCode: lowestSubject.code },
    });
  }

  // 3. System Design / Career Target Gap
  const systemDesign = masteryMap["system_design"];
  if (systemDesign && systemDesign.masteryScore < 65) {
    actions.push({
      id: "nba_system_design",
      title: "Complete System Design Fundamentals",
      reason: `Target role is "${profile.targetRole}". High-level architecture & caching is a required interview benchmark.`,
      category: "Career",
      urgency: "HIGH",
      estimatedMinutes: 25,
      actionType: "attempt_quiz",
      targetPayload: { topicId: "system_design" },
    });
  }

  // 4. Daily Focus / Productivity Milestone
  if (profile.todayStudyMinutes < profile.targetDailyMinutes) {
    const remainingMins = profile.targetDailyMinutes - profile.todayStudyMinutes;
    actions.push({
      id: "nba_focus_session",
      title: `Launch 25-min Pomodoro Sprint`,
      reason: `You have completed ${profile.todayStudyMinutes}m out of your ${profile.targetDailyMinutes}m daily target (${profile.studyStreakDays}-day streak active).`,
      category: "Productivity",
      urgency: "MEDIUM",
      estimatedMinutes: 25,
      actionType: "start_focus",
    });
  }

  // 5. Mock Interview Practice
  actions.push({
    id: "nba_mock_interview",
    title: "Run Technical Screening Mock",
    reason: "Benchmark your technical depth and problem breakdown structure with Gemini AI.",
    category: "Interview",
    urgency: "NORMAL",
    estimatedMinutes: 15,
    actionType: "practice_interview",
  });

  return actions;
}

/**
 * Updates topic mastery score upon question completion
 */
export function recordQuestionAttemptEngine(
  currentMastery: Record<string, TopicMastery>,
  attempt: QuestionAttempt,
  question: Question
): Record<string, TopicMastery> {
  const existing = currentMastery[question.topicId] || {
    topicId: question.topicId,
    topicName: question.topicName,
    category: "Computer Science",
    year: question.year,
    masteryScore: 50,
    status: "AVERAGE",
    totalAttempts: 0,
    correctAttempts: 0,
    revisionIntervalDays: 3,
    revisionCount: 0,
    priorityScore: 50,
  };

  const newTotal = existing.totalAttempts + 1;
  const newCorrect = existing.correctAttempts + (attempt.isCorrect ? 1 : 0);

  // Difficulty weighting multiplier
  const diffMultiplier = question.difficulty === "Hard" ? 1.4 : question.difficulty === "Medium" ? 1.0 : 0.8;
  const rawPct = (newCorrect / newTotal) * 100;
  const adjustedScore = Math.min(100, Math.max(10, Math.round(rawPct * diffMultiplier)));

  let status: TopicMastery["status"] = "AVERAGE";
  if (adjustedScore < 45) status = "CRITICAL";
  else if (adjustedScore < 60) status = "WEAK";
  else if (adjustedScore < 75) status = "AVERAGE";
  else if (adjustedScore < 85) status = "IMPROVING";
  else status = "STRONG";

  const updated: TopicMastery = {
    ...existing,
    totalAttempts: newTotal,
    correctAttempts: newCorrect,
    masteryScore: adjustedScore,
    status,
    lastAttemptedAt: "Just now",
    priorityScore: 100 - adjustedScore,
  };

  return {
    ...currentMastery,
    [question.topicId]: updated,
  };
}
