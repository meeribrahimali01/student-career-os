/**
 * Four-Year Comprehensive Academic & Career Study Roadmap Data
 */

export interface RoadmapSubtopic {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionCount: number;
  completedCount: number;
  keyConcepts: string[];
}

export interface RoadmapTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedHours: number;
  progressPct: number;
  status: "completed" | "in_progress" | "locked" | "needs_revision";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  subtopics: RoadmapSubtopic[];
  careerRelevance: string;
  skillTags: string[];
}

export interface YearLevelRoadmap {
  year: 1 | 2 | 3 | 4;
  yearTitle: string;
  focusTheme: string;
  totalTopics: number;
  completedTopics: number;
  topics: RoadmapTopic[];
}

export const FOUR_YEAR_ROADMAP: YearLevelRoadmap[] = [
  // ─── 1ST YEAR: FOUNDATIONS & PROBLEM SOLVING ─────────────────────
  {
    year: 1,
    yearTitle: "1st Year — Engineering Foundations & Computational Logic",
    focusTheme: "Programming Fundamentals, Discrete Math, Logic & Development Tooling",
    totalTopics: 5,
    completedTopics: 4,
    topics: [
      {
        id: "y1_prog_fund",
        title: "Programming Fundamentals (C / C++ / Python)",
        category: "Programming",
        description: "Variables, pointers, memory allocation (malloc/free), control flow, and recursion basics.",
        estimatedHours: 45,
        progressPct: 100,
        status: "completed",
        difficulty: "Beginner",
        careerRelevance: "Essential syntactic & pointer memory foundation for all computing systems.",
        skillTags: ["C++", "Pointers", "Recursion", "Memory"],
        subtopics: [
          { name: "Pointers & Dynamic Memory", difficulty: "Easy", questionCount: 10, completedCount: 10, keyConcepts: ["Stack vs Heap", "Pointer Arithmetic", "malloc/free"] },
          { name: "Recursion & Backtracking Basics", difficulty: "Medium", questionCount: 12, completedCount: 12, keyConcepts: ["Base Cases", "Call Stack", "N-Queens warmup"] },
          { name: "Bit Manipulation", difficulty: "Hard", questionCount: 8, completedCount: 8, keyConcepts: ["XOR properties", "Bitmasks", "Power of 2"] },
        ],
      },
      {
        id: "y1_discrete_math",
        title: "Discrete Mathematics & Logic",
        category: "Mathematics",
        description: "Set theory, propositional logic, graph theory foundations, and combinatorics.",
        estimatedHours: 35,
        progressPct: 100,
        status: "completed",
        difficulty: "Beginner",
        careerRelevance: "Formal mathematical modeling behind relational databases and cryptographic primitives.",
        skillTags: ["Discrete Math", "Combinatorics", "Logic"],
        subtopics: [
          { name: "Propositional Logic & Proofs", difficulty: "Easy", questionCount: 8, completedCount: 8, keyConcepts: ["Truth Tables", "Induction", "Contradiction"] },
          { name: "Set Theory & Relations", difficulty: "Medium", questionCount: 10, completedCount: 10, keyConcepts: ["Equivalence Relations", "Functions", "Cardinality"] },
          { name: "Combinatorics & Probability", difficulty: "Hard", questionCount: 8, completedCount: 8, keyConcepts: ["Permutations", "Pigeonhole Principle", "Bayes Rule"] },
        ],
      },
      {
        id: "y1_dsa_basics",
        title: "Data Structures Foundations",
        category: "Data Structures",
        description: "Arrays, Singly/Doubly Linked Lists, Stacks, Queues, and Big-O asymptotic analysis.",
        estimatedHours: 50,
        progressPct: 100,
        status: "completed",
        difficulty: "Beginner",
        careerRelevance: "Core building blocks used across all standard coding screenings.",
        skillTags: ["Arrays", "Linked Lists", "Stacks", "Queues", "Big-O"],
        subtopics: [
          { name: "Array Manipulations & Two Pointers", difficulty: "Easy", questionCount: 15, completedCount: 15, keyConcepts: ["Sliding Window", "Two Pointers", "Prefix Sums"] },
          { name: "Stack & Queue Applications", difficulty: "Medium", questionCount: 14, completedCount: 14, keyConcepts: ["Monotonic Stack", "Next Greater Element", "Deque"] },
          { name: "Linked List Reversal & Fast-Slow Pointers", difficulty: "Hard", questionCount: 10, completedCount: 10, keyConcepts: ["Cycle Detection", "Merge K Lists", "LRU Cache warmup"] },
        ],
      },
      {
        id: "y1_dev_tools",
        title: "Git, Linux Terminal & Open Source",
        category: "Dev Tools",
        description: "CLI proficiency, version control with Git (branching, merge conflicts), and GitHub collaboration.",
        estimatedHours: 20,
        progressPct: 100,
        status: "completed",
        difficulty: "Beginner",
        careerRelevance: "Industry standard collaboration workflow required by day 1 of any internship.",
        skillTags: ["Git", "GitHub", "Linux CLI", "Bash"],
        subtopics: [
          { name: "Git Branching & PR Workflows", difficulty: "Easy", questionCount: 6, completedCount: 6, keyConcepts: ["Rebase vs Merge", "Feature Branches", "Cherry-pick"] },
          { name: "Linux File Permissions & Shell Scripting", difficulty: "Medium", questionCount: 8, completedCount: 8, keyConcepts: ["chmod/chown", "Pipes & Grep", "Cron Jobs"] },
        ],
      },
      {
        id: "y1_mini_projects",
        title: "First-Year Exploration Projects",
        category: "Projects",
        description: "CLI-based utilities, automated scripts, and simple graphical mini-applications.",
        estimatedHours: 30,
        progressPct: 80,
        status: "in_progress",
        difficulty: "Beginner",
        careerRelevance: "Proof of practical coding outside academic examinations.",
        skillTags: ["Projects", "Portfolio", "Python CLI"],
        subtopics: [
          { name: "CLI Expense Manager / File Indexer", difficulty: "Easy", questionCount: 4, completedCount: 3, keyConcepts: ["File I/O", "Parsing JSON/CSV", "Error Handling"] },
        ],
      },
    ],
  },

  // ─── 2ND YEAR: CORE CS & ARCHITECTURE ────────────────────────────
  {
    year: 2,
    yearTitle: "2nd Year — Core Computer Science & Software Engineering",
    focusTheme: "Advanced DSA, DBMS, Operating Systems, Computer Networks & Full Stack",
    totalTopics: 6,
    completedTopics: 4,
    topics: [
      {
        id: "graphs",
        title: "Graph Algorithms & Trees",
        category: "Data Structures",
        description: "BFS/DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Topological Sort, Minimum Spanning Trees (Prim/Kruskal), and DSU.",
        estimatedHours: 60,
        progressPct: 42,
        status: "needs_revision",
        difficulty: "Intermediate",
        careerRelevance: "Critical Tier-1 company interview topic (Google, Amazon, Microsoft).",
        skillTags: ["Graphs", "Dijkstra", "BFS/DFS", "Topological Sort", "DSU"],
        subtopics: [
          { name: "Graph Traversals (BFS & DFS)", difficulty: "Easy", questionCount: 12, completedCount: 8, keyConcepts: ["Connected Components", "Bipartite Check", "Cycle Detection"] },
          { name: "Shortest Paths (Dijkstra, Bellman-Ford)", difficulty: "Medium", questionCount: 15, completedCount: 5, keyConcepts: ["Priority Queue Dijkstra", "Negative Cycles", "DAG Shortest Path"] },
          { name: "Disjoint Set Union & Minimum Spanning Trees", difficulty: "Hard", questionCount: 10, completedCount: 2, keyConcepts: ["Kruskal's Algorithm", "Union by Rank", "Path Compression"] },
        ],
      },
      {
        id: "os",
        title: "Operating Systems Internals",
        category: "Core CS",
        description: "Processes vs Threads, CPU scheduling algorithms, Mutex/Semaphores, Deadlocks, Virtual Memory Paging, and File Systems.",
        estimatedHours: 50,
        progressPct: 68,
        status: "in_progress",
        difficulty: "Intermediate",
        careerRelevance: "Essential for systems programming, backend concurrency, and technical screening interviews.",
        skillTags: ["OS", "Concurrency", "Virtual Memory", "Deadlocks", "Linux"],
        subtopics: [
          { name: "Process Synchronization & Mutex/Semaphores", difficulty: "Easy", questionCount: 10, completedCount: 7, keyConcepts: ["Race Conditions", "Critical Section", "Dining Philosophers"] },
          { name: "Deadlock Detection & Prevention (Banker's)", difficulty: "Medium", questionCount: 12, completedCount: 9, keyConcepts: ["Resource Allocation Graph", "Banker's Algorithm", "Coffman Conditions"] },
          { name: "Virtual Memory & Page Replacement Algorithms", difficulty: "Hard", questionCount: 10, completedCount: 5, keyConcepts: ["LRU / FIFO Paging", "TLB Translation", "Thrashing Analysis"] },
        ],
      },
      {
        id: "dbms",
        title: "Database Management Systems & SQL",
        category: "Databases",
        description: "Relational modeling, Normalization (1NF to BCNF), B+ Tree indexing, ACID transactions, Concurrency Control, and complex SQL Window Functions.",
        estimatedHours: 55,
        progressPct: 88,
        status: "completed",
        difficulty: "Intermediate",
        careerRelevance: "Required for every backend software engineering and full-stack role.",
        skillTags: ["PostgreSQL", "SQL", "Indexing", "ACID", "Normalization"],
        subtopics: [
          { name: "Schema Design & Normalization", difficulty: "Easy", questionCount: 10, completedCount: 10, keyConcepts: ["Functional Dependencies", "3NF vs BCNF", "Decomposition"] },
          { name: "Complex SQL & Window Functions", difficulty: "Medium", questionCount: 15, completedCount: 14, keyConcepts: ["RANK()", "LEAD/LAG", "PARTITION BY", "Subqueries"] },
          { name: "Indexing, B+ Trees & Concurrency Isolation", difficulty: "Hard", questionCount: 12, completedCount: 10, keyConcepts: ["Write-Ahead Logging", "2PL Locking", "Phantom Reads", "EXPLAIN ANALYZE"] },
        ],
      },
      {
        id: "web_dev",
        title: "Full Stack Web Engineering",
        category: "Web Development",
        description: "Modern React with TypeScript, REST APIs in Node.js/Express, JWT auth, database integration, and UI state management.",
        estimatedHours: 70,
        progressPct: 85,
        status: "completed",
        difficulty: "Intermediate",
        careerRelevance: "Directly matches target career goal of Full Stack Software Engineer.",
        skillTags: ["React", "TypeScript", "Node.js", "Express", "REST APIs"],
        subtopics: [
          { name: "React Component Lifecycle & Hooks", difficulty: "Easy", questionCount: 12, completedCount: 12, keyConcepts: ["useState/useEffect", "Custom Hooks", "Context API"] },
          { name: "REST API Architecture & Authentication", difficulty: "Medium", questionCount: 14, completedCount: 12, keyConcepts: ["JWT / Refresh Tokens", "Middleware Chains", "CORS & Security"] },
          { name: "Performance Optimization & SSR", difficulty: "Hard", questionCount: 8, completedCount: 6, keyConcepts: ["Memoization", "Code Splitting", "Virtual DOM diffing"] },
        ],
      },
      {
        id: "networks",
        title: "Computer Networks & Protocols",
        category: "Core CS",
        description: "OSI & TCP/IP stack, TCP 3-way handshake, Flow/Congestion Control, DNS, HTTP/1.1 vs HTTP/2 vs HTTP/3, and WebSockets.",
        estimatedHours: 40,
        progressPct: 74,
        status: "in_progress",
        difficulty: "Intermediate",
        careerRelevance: "Underpins all distributed network communication and API design.",
        skillTags: ["TCP/IP", "HTTP", "DNS", "WebSockets", "Networking"],
        subtopics: [
          { name: "TCP vs UDP & Congestion Control", difficulty: "Easy", questionCount: 8, completedCount: 6, keyConcepts: ["3-Way Handshake", "TCP Slow Start", "Sliding Window Flow Control"] },
          { name: "HTTP/1.1 vs HTTP/2 vs HTTP/3 & TLS", difficulty: "Medium", questionCount: 10, completedCount: 8, keyConcepts: ["Multiplexing", "QUIC Protocol", "SSL/TLS Handshake"] },
          { name: "DNS Resolution & Socket Programming", difficulty: "Hard", questionCount: 8, completedCount: 5, keyConcepts: ["Recursive DNS", "Socket I/O", "Load Balancing DNS"] },
        ],
      },
      {
        id: "oop_design",
        title: "Object-Oriented Design & Patterns",
        category: "Software Engineering",
        description: "SOLID design principles, Factory, Singleton, Observer, Strategy, and Decorator design patterns.",
        estimatedHours: 35,
        progressPct: 80,
        status: "in_progress",
        difficulty: "Intermediate",
        careerRelevance: "Evaluated heavily in Low-Level Design (LLD) placement rounds.",
        skillTags: ["OOP", "SOLID", "Design Patterns", "Java/C++"],
        subtopics: [
          { name: "SOLID Principles in Practice", difficulty: "Easy", questionCount: 8, completedCount: 7, keyConcepts: ["Single Responsibility", "Open-Closed", "Liskov Substitution"] },
          { name: "Creational & Behavioral Design Patterns", difficulty: "Medium", questionCount: 10, completedCount: 8, keyConcepts: ["Factory Method", "Observer Pattern", "Strategy Pattern"] },
        ],
      },
    ],
  },

  // ─── 3RD YEAR: ADVANCED SYSTEMS & SPECIALIZATION ─────────────────
  {
    year: 3,
    yearTitle: "3rd Year — Advanced Systems, System Design & Placement Preparation",
    focusTheme: "System Design, Dynamic Programming, Cloud DevOps, Internships & Major Projects",
    totalTopics: 5,
    completedTopics: 2,
    topics: [
      {
        id: "dp",
        title: "Advanced Dynamic Programming",
        category: "Algorithms",
        description: "1D/2D DP, Knapsack variations, Longest Common Subsequence, DP on Trees, Bitmask DP, and Digit DP.",
        estimatedHours: 65,
        progressPct: 46,
        status: "needs_revision",
        difficulty: "Advanced",
        careerRelevance: "Highest weightage algorithmic category in Tier-1 technical screening interviews.",
        skillTags: ["Dynamic Programming", "Memoization", "Tabulation", "Bitmask DP"],
        subtopics: [
          { name: "1D / 2D Grid DP & Subsequence Problems", difficulty: "Easy", questionCount: 12, completedCount: 7, keyConcepts: ["House Robber", "Coin Change", "Unique Paths"] },
          { name: "Knapsack Variants & Longest Increasing Subsequence", difficulty: "Medium", questionCount: 15, completedCount: 5, keyConcepts: ["Unbounded Knapsack", "O(N log N) LIS Binary Search", "Target Sum"] },
          { name: "Matrix Chain Multiplication & DP on Trees", difficulty: "Hard", questionCount: 12, completedCount: 2, keyConcepts: ["Partition DP", "Tree Diameter with DP", "Bitmask State Representation"] },
        ],
      },
      {
        id: "system_design",
        title: "System Design & Distributed Systems",
        category: "Architecture",
        description: "Horizontal scaling, Load Balancers, Consistent Hashing, Distributed Caching (Redis), Message Queues (Kafka), CAP Theorem, and Database Sharding.",
        estimatedHours: 60,
        progressPct: 54,
        status: "in_progress",
        difficulty: "Advanced",
        careerRelevance: "Deciding factor between standard and Tier-1 High Package engineering placement offers.",
        skillTags: ["System Design", "Microservices", "Redis", "Kafka", "Scalability"],
        subtopics: [
          { name: "Scaling Web Architectures & Load Balancing", difficulty: "Easy", questionCount: 10, completedCount: 7, keyConcepts: ["Stateless Services", "Round-Robin vs Least Connections", "Reverse Proxy (Nginx)"] },
          { name: "Distributed Caching & Message Queues", difficulty: "Medium", questionCount: 14, completedCount: 6, keyConcepts: ["Cache-Aside vs Write-Through", "Redis Eviction", "Kafka Consumer Groups"] },
          { name: "Database Sharding & Consistent Hashing", difficulty: "Hard", questionCount: 10, completedCount: 3, keyConcepts: ["Horizontal Partitioning", "Virtual Nodes in Hash Ring", "Distributed Transactions (2PC/Saga)"] },
        ],
      },
      {
        id: "cloud_devops",
        title: "Cloud & DevOps (Docker, CI/CD, AWS)",
        category: "DevOps",
        description: "Containerization with Docker, Kubernetes fundamentals, GitHub Actions CI/CD pipelines, and AWS core services (EC2, S3, RDS).",
        estimatedHours: 45,
        progressPct: 64,
        status: "in_progress",
        difficulty: "Intermediate",
        careerRelevance: "Modern production engineering benchmark required by growth startups & tech giants.",
        skillTags: ["Docker", "AWS", "CI/CD", "Kubernetes"],
        subtopics: [
          { name: "Docker Containerization & Multi-stage Builds", difficulty: "Easy", questionCount: 8, completedCount: 6, keyConcepts: ["Dockerfile Best Practices", "Docker Compose", "Layer Caching"] },
          { name: "CI/CD Automation with GitHub Actions", difficulty: "Medium", questionCount: 10, completedCount: 7, keyConcepts: ["Automated Testing", "Build Pipelines", "Secrets Management"] },
        ],
      },
      {
        id: "major_projects",
        title: "Production Full Stack Capstone Project",
        category: "Projects",
        description: "End-to-end full stack application with authentication, real-time WebSockets, microservices, cloud deployment, and automated testing.",
        estimatedHours: 80,
        progressPct: 75,
        status: "in_progress",
        difficulty: "Advanced",
        careerRelevance: "Primary technical talking point during resume screening and portfolio review rounds.",
        skillTags: ["Full Stack", "PostgreSQL", "React", "Docker", "Live Production"],
        subtopics: [
          { name: "System Architecture & API Design", difficulty: "Medium", questionCount: 5, completedCount: 4, keyConcepts: ["Database ER Model", "OpenAPI Specification", "Modular Codebase"] },
        ],
      },
      {
        id: "internship_prep",
        title: "Internship & Placement Technical Sprints",
        category: "Placement",
        description: "Mock coding screenings, timed Blind 75 assessments, resume tailoring for ATS, and technical interview simulations.",
        estimatedHours: 50,
        progressPct: 58,
        status: "in_progress",
        difficulty: "Advanced",
        careerRelevance: "Secures summer engineering internships that convert to Pre-Placement Offers (PPOs).",
        skillTags: ["Mock Interviews", "Resume ATS", "Blind 75", "Screening"],
        subtopics: [
          { name: "Timed LeetCode Medium Screening Rounds", difficulty: "Medium", questionCount: 15, completedCount: 8, keyConcepts: ["Time Management", "Edge Case Handling", "Clean Code Formatting"] },
        ],
      },
    ],
  },

  // ─── 4TH YEAR: PLACEMENT MASTERY & INDUSTRIAL ONBOARDING ─────────
  {
    year: 4,
    yearTitle: "4th Year — Placement Sprint, Final Year Capstone & Career Mastery",
    focusTheme: "Placement Drives, Deep Technical Screenings, Capstone Project & Corporate Transition",
    totalTopics: 4,
    completedTopics: 1,
    topics: [
      {
        id: "placement_sprint",
        title: "High-Volume Placement Interview Sprint",
        category: "Placement",
        description: "FAANG-level DSA problem sets, rapid behavioral STAR method simulations, and live coding interview drills.",
        estimatedHours: 60,
        progressPct: 40,
        status: "in_progress",
        difficulty: "Advanced",
        careerRelevance: "Final placement conversion and salary package optimization.",
        skillTags: ["FAANG Prep", "Live Coding", "STAR Method", "High CTC"],
        subtopics: [
          { name: "Hard DSA & Concurrency Problem Drills", difficulty: "Hard", questionCount: 18, completedCount: 6, keyConcepts: ["Segment Trees", "Bitmask Combinatorics", "Multithreaded Coding"] },
          { name: "Behavioral & Leadership STAR Interviews", difficulty: "Medium", questionCount: 10, completedCount: 5, keyConcepts: ["Conflict Resolution", "Project Failures & Learnings", "Amazon Leadership Principles"] },
        ],
      },
      {
        id: "final_project",
        title: "Final Year Capstone Research & Development",
        category: "Projects",
        description: "Industry-sponsored capstone engineering project or academic research paper publication.",
        estimatedHours: 100,
        progressPct: 30,
        status: "in_progress",
        difficulty: "Advanced",
        careerRelevance: "Demonstrates deep problem-solving expertise and research rigor.",
        skillTags: ["Research Paper", "Capstone", "Industry Sponsor"],
        subtopics: [
          { name: "Research Methodology & System Benchmarking", difficulty: "Hard", questionCount: 6, completedCount: 2, keyConcepts: ["Throughput Profiling", "A/B Testing", "Academic Paper Writing"] },
        ],
      },
      {
        id: "core_cs_revision",
        title: "Comprehensive Core CS Speed Revision",
        category: "Core CS",
        description: "Rapid revision sheets for OS, DBMS, Computer Networks, and System Design for round 2 technical rounds.",
        estimatedHours: 30,
        progressPct: 65,
        status: "in_progress",
        difficulty: "Intermediate",
        careerRelevance: "Eliminates surprise rejections on standard undergraduate core CS fundamentals.",
        skillTags: ["Fast Revision", "Core CS Summary", "Cheat Sheets"],
        subtopics: [
          { name: "Core CS Rapid Q&A Flashcards", difficulty: "Medium", questionCount: 20, completedCount: 13, keyConcepts: ["Virtual Memory vs Physical", "TCP Handshake nuances", "ACID vs BASE"] },
        ],
      },
      {
        id: "career_transition",
        title: "Corporate Onboarding & Continuous Learning",
        category: "Career",
        description: "Enterprise software development methodologies (Agile/Scrum), code reviews, production telemetry, and career progression planning.",
        estimatedHours: 25,
        progressPct: 20,
        status: "in_progress",
        difficulty: "Beginner",
        careerRelevance: "Ensures seamless transition from college graduate to high-performing software engineer.",
        skillTags: ["Agile/Scrum", "Code Reviews", "Production Engineering"],
        subtopics: [
          { name: "Git Code Review Etiquette & CI Pipelines", difficulty: "Easy", questionCount: 6, completedCount: 2, keyConcepts: ["Clean PR Descriptions", "Constructive Feedback", "Semantic Versioning"] },
        ],
      },
    ],
  },
];
