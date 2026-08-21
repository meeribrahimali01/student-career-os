/**
 * AI Career Intelligence Engine & Gap Analyzer Service Layer (TypeScript)
 * 
 * Part of Student Career OS - Member 2 (AI / Gemini Responsibility)
 * Connects student profile data to the deployed Supabase Edge Function and
 * generates complete, personalized career intelligence reports.
 * 
 * Includes:
 * - Exponential backoff retry logic for transient Gemini 503 / 429 errors.
 * - Clean structured fallback error: AI_TEMPORARILY_UNAVAILABLE.
 * - Non-retryable immediate error handling for 4xx validation errors.
 */

export interface StudentInput {
  name: string;
  year: number | string;
  branch: string;
  cgpa: number | string;
  careerGoal?: string;
  career_goal?: string;
  skills?: string[] | string;
  interests?: string[] | string;
  id?: string;
  email?: string;
  created_at?: string;
}

export interface AcademicRecord {
  id?: string;
  student_id?: string;
  semester: number;
  subject: string;
  marks: number;
  attendance?: number;
  created_at?: string;
}

export interface NormalizedStudentPayload {
  name: string;
  year: number;
  branch: string;
  cgpa: number;
  careerGoal: string;
  skills: string[];
  interests: string[];
  academicSummary?: {
    totalSubjects: number;
    averageMarks: number;
    records?: AcademicRecord[];
  };
}

export interface CareerGapAnalysis {
  readinessScore: number;
  strengths: string[];
  skillGaps: string[];
  prioritySkills: string[];
  recommendedProjects: string[];
  thirtyDayPlan: string[];
  summary: string;
}

export interface ScoreBreakdown {
  technicalSkills: number;
  projects: number;
  problemSolving: number;
  careerAlignment: number;
  portfolio: number;
  academicFoundation: number;
}

export interface SmartReadinessScore {
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  explanation: string;
  biggestImprovementArea: string;
}

export interface DetailedSkillGap {
  skill: string;
  importance: "Critical" | "High" | "Medium" | "Low";
  reason: string;
  currentLevel: "none" | "beginner" | "intermediate" | "advanced";
  targetLevel: "beginner" | "intermediate" | "advanced" | "proficient";
  estimatedLearningTime: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  skills: string[];
  tasks: string[];
  milestone: string;
}

export interface CareerRoadmap {
  careerGoal: string;
  currentLevel: "Beginner" | "Intermediate" | "Advanced" | string;
  roadmap: RoadmapPhase[];
  projects: string[];
  milestones: string[];
  nextAction: string;
}

export interface DetailedProject {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  technologies: string[];
  skillsCovered: string[];
  whyRecommended: string;
  estimatedDuration: string;
  features: string[];
  resumeValue: string;
}

export interface DailyLearningPlanItem {
  day: number;
  topic: string;
  tasks: string[];
  estimatedTime: string;
  output: string;
  skillTarget: string;
}

export interface DailyNextAction {
  title: string;
  estimatedTime: string;
  reason: string;
  tasks: string[];
}

export interface PortfolioAdvice {
  projectsToHighlight: string[];
  technologiesToEmphasize: string[];
  githubImprovements: string[];
  resumeStrengths: string[];
  missingEvidence: string[];
}

export interface InterviewPreparation {
  technicalTopics: string[];
  codingTopics: string[];
  behavioralTopics: string[];
  projectQuestions: string[];
  priorityTopics: string[];
}

export interface DataQuality {
  profileCompleteness: number;
  confidence: "high" | "medium" | "low";
  missingInformation: string[];
}

export interface CareerIntelligenceReport {
  student: NormalizedStudentPayload;
  careerGoal: string;
  readiness: SmartReadinessScore;
  skillGaps: DetailedSkillGap[];
  prioritySkills: string[];
  roadmap: RoadmapPhase[];
  projects: DetailedProject[];
  learningPlan: DailyLearningPlanItem[];
  portfolioAdvice: PortfolioAdvice;
  interviewPreparation: InterviewPreparation;
  nextAction: DailyNextAction;
  dataQuality: DataQuality;
  summary: string;
  readinessScore: number;
  strengths: string[];
  recommendedProjects: string[];
  thirtyDayPlan: string[];
}

export interface StructuredAIError {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    details?: string;
  };
}

export class AIUnavailableError extends Error {
  public readonly error: {
    code: string;
    message: string;
    retryable: boolean;
    details?: string;
  };

  constructor(details?: string) {
    super("AI service is temporarily unavailable. Please try again later.");
    this.name = "AIUnavailableError";
    this.error = {
      code: "AI_TEMPORARILY_UNAVAILABLE",
      message: "AI service is temporarily unavailable. Please try again later.",
      retryable: true,
      details,
    };
  }
}

export class AIClientError extends Error {
  public readonly statusCode: number;
  public readonly retryable: boolean = false;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AIClientError";
    this.statusCode = statusCode;
  }
}

export interface CareerGapAnalysisOptions {
  academicRecords?: AcademicRecord[];
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseClient?: {
    functions: {
      invoke: (
        functionName: string,
        options: { body: any; headers?: Record<string, string> }
      ) => Promise<{ data: any; error: any }>;
    };
  };
  timeoutMs?: number;
  signal?: AbortSignal;
  maxRetries?: number;
  retryDelays?: number[];
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
}

export interface CareerGapState {
  data: CareerGapAnalysis | null;
  isLoading: boolean;
  error: string | StructuredAIError | null;
}

export interface CareerRoadmapState {
  data: CareerRoadmap | null;
  gapAnalysis: CareerGapAnalysis | null;
  isLoading: boolean;
  error: string | StructuredAIError | null;
}

export interface CareerIntelligenceState {
  data: CareerIntelligenceReport | null;
  isLoading: boolean;
  error: string | StructuredAIError | null;
}

const DEFAULT_SUPABASE_URL = "https://wijvstnqnofwxuhyxjgk.supabase.co";
export const DEFAULT_RETRY_DELAYS = [1000, 2000, 4000];

/**
 * Checks if an HTTP status code or error text represents a transient, retryable failure.
 */
export function isTransientError(statusCode?: number, errorText?: string, err?: any): boolean {
  if (statusCode === 503 || statusCode === 429 || statusCode === 502 || statusCode === 504) {
    return true;
  }

  // Normal 4xx client errors (400, 401, 403, 404, 422) must not be retried
  if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
    return false;
  }

  const text = (errorText || err?.message || "").toLowerCase();
  if (
    text.includes("503") ||
    text.includes("429") ||
    text.includes("unavailable") ||
    text.includes("high demand") ||
    text.includes("resource_exhausted") ||
    text.includes("rate limit") ||
    text.includes("fetch failed") ||
    text.includes("econnreset") ||
    text.includes("etimedout") ||
    text.includes("network error")
  ) {
    return true;
  }

  return false;
}

/**
 * Utility sleep function.
 */
export function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalizes input student data from either Supabase DB row (snake_case)
 * or frontend form input (camelCase) into the structure expected by the AI service.
 */
export function normalizeStudentProfile(
  student: StudentInput,
  academicRecords?: AcademicRecord[]
): NormalizedStudentPayload {
  if (!student) {
    throw new AIClientError("Student profile data is required.", 400);
  }

  const name = (student.name || "").trim();
  const year = Number(student.year) || 1;
  const branch = (student.branch || "").trim();
  const cgpa = Number(student.cgpa) || 0;
  const careerGoal = (student.careerGoal || student.career_goal || "").trim();

  let skills: string[] = [];
  if (Array.isArray(student.skills)) {
    skills = student.skills.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof student.skills === "string") {
    skills = student.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  let interests: string[] = [];
  if (Array.isArray(student.interests)) {
    interests = student.interests.map((i) => String(i).trim()).filter(Boolean);
  } else if (typeof student.interests === "string") {
    interests = student.interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }

  if (!name) {
    throw new AIClientError("Student name is required.", 400);
  }
  if (!careerGoal) {
    throw new AIClientError("Student career goal is required.", 400);
  }

  const payload: NormalizedStudentPayload = {
    name,
    year,
    branch,
    cgpa,
    careerGoal,
    skills,
    interests,
  };

  if (academicRecords && academicRecords.length > 0) {
    const totalMarks = academicRecords.reduce((sum, r) => sum + (Number(r.marks) || 0), 0);
    payload.academicSummary = {
      totalSubjects: academicRecords.length,
      averageMarks: parseFloat((totalMarks / academicRecords.length).toFixed(2)),
      records: academicRecords,
    };
  }

  return payload;
}

/**
 * Validates that the response from the Edge Function conforms to the CareerGapAnalysis schema.
 */
export function validateCareerGapAnalysis(data: any): CareerGapAnalysis {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI response: Expected an object.");
  }

  const readinessScore = typeof data.readinessScore === "number" ? data.readinessScore : Number(data.readinessScore);
  if (isNaN(readinessScore) || readinessScore < 0 || readinessScore > 100) {
    throw new Error("Invalid readiness score received from AI service.");
  }

  const ensureStringArray = (field: any, fieldName: string): string[] => {
    if (!Array.isArray(field)) {
      if (typeof field === "string" && field.length > 0) {
        return [field];
      }
      return [];
    }
    return field.map((item) => String(item).trim()).filter(Boolean);
  };

  return {
    readinessScore,
    strengths: ensureStringArray(data.strengths, "strengths"),
    skillGaps: ensureStringArray(data.skillGaps, "skillGaps"),
    prioritySkills: ensureStringArray(data.prioritySkills, "prioritySkills"),
    recommendedProjects: ensureStringArray(data.recommendedProjects, "recommendedProjects"),
    thirtyDayPlan: ensureStringArray(data.thirtyDayPlan, "thirtyDayPlan"),
    summary: typeof data.summary === "string" ? data.summary.trim() : "",
  };
}

/**
 * Computes an explainable, multi-dimensional Smart Career Readiness Score.
 */
export function computeSmartReadinessScore(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): SmartReadinessScore {
  const overallScore = gapAnalysis.readinessScore;
  const numSkills = student.skills.length;
  const numGaps = gapAnalysis.skillGaps.length;
  const cgpa = student.cgpa;

  const academicFoundation = Math.min(100, Math.round(Math.max(20, (cgpa / 10) * 100)));
  const skillRatio = numSkills + numGaps > 0 ? numSkills / (numSkills + numGaps) : 0.3;
  const technicalSkills = Math.min(100, Math.max(15, Math.round(overallScore * 0.9 + skillRatio * 15)));
  const projects = Math.min(100, Math.max(10, Math.round(overallScore * 0.7 + (student.year >= 3 ? 15 : 5))));
  const hasCodingBasics = student.skills.some((s) => /java|c\+\+|c\b|python|dsa|algo/i.test(s));
  const problemSolving = Math.min(100, Math.max(20, Math.round(hasCodingBasics ? 45 + (cgpa > 8 ? 15 : 5) : 30)));
  const hasGoalKeywords = student.interests.concat(student.skills).some((item) =>
    student.careerGoal.toLowerCase().split(/\s+/).some((w) => w.length > 3 && item.toLowerCase().includes(w))
  );
  const careerAlignment = Math.min(100, Math.max(30, hasGoalKeywords ? 70 : 45));
  const portfolio = Math.min(100, Math.max(10, Math.round(projects * 0.8 + (student.year >= 3 ? 15 : 0))));

  const scoreBreakdown: ScoreBreakdown = {
    technicalSkills,
    projects,
    problemSolving,
    careerAlignment,
    portfolio,
    academicFoundation,
  };

  const areaEntries: [string, number][] = [
    ["Projects & Practical Building", projects],
    ["Technical Skill Coverage", technicalSkills],
    ["Portfolio & GitHub Presence", portfolio],
    ["Problem Solving & DSA", problemSolving],
    ["Academic Consistency", academicFoundation],
  ];
  areaEntries.sort((a, b) => a[1] - b[1]);
  const biggestImprovementArea = areaEntries[0][0];

  const explanation = `${student.name}'s overall readiness score is ${overallScore}/100. Academic foundation is solid (${academicFoundation}/100 with a ${cgpa} CGPA), but the largest area for growth is ${biggestImprovementArea} (${scoreBreakdown.projects}/100), where hands-on projects are required to prove competency in ${student.careerGoal}.`;

  return {
    overallScore,
    scoreBreakdown,
    explanation,
    biggestImprovementArea,
  };
}

/**
 * Transforms raw skill gaps into rich, categorized, explainable gap objects.
 */
export function buildDetailedSkillGaps(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): DetailedSkillGap[] {
  const prioritySet = new Set(gapAnalysis.prioritySkills.map((s) => s.toLowerCase()));
  const allGaps = gapAnalysis.skillGaps.length > 0 ? gapAnalysis.skillGaps : gapAnalysis.prioritySkills;

  return allGaps.map((skillName, index) => {
    const isPriority = prioritySet.has(skillName.toLowerCase()) || index < 2;
    const importance: "Critical" | "High" | "Medium" | "Low" =
      index === 0 ? "Critical" : isPriority ? "High" : index < 4 ? "Medium" : "Low";

    const hasPartial = student.skills.some((s) => s.toLowerCase().includes(skillName.toLowerCase()));
    const currentLevel: "none" | "beginner" | "intermediate" | "advanced" = hasPartial ? "beginner" : "none";
    const targetLevel = importance === "Critical" ? "advanced" : "intermediate";

    const estimatedLearningTime =
      importance === "Critical" ? "3-4 weeks" : importance === "High" ? "2-3 weeks" : "1-2 weeks";

    const reason = `${skillName} is essential for ${student.careerGoal} roles. Currently, your profile lists [${student.skills.join(", ") || "no skills"}] but lacks practical demonstration of ${skillName}.`;

    return {
      skill: skillName,
      importance,
      reason,
      currentLevel,
      targetLevel,
      estimatedLearningTime,
    };
  });
}

/**
 * Builds an adaptive career roadmap tailored to the student's year, CGPA, and career goal.
 */
export function buildAdaptiveRoadmap(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): RoadmapPhase[] {
  const prioritySkills = gapAnalysis.prioritySkills.length > 0 ? gapAnalysis.prioritySkills : gapAnalysis.skillGaps;
  const thirtyDayPlan = gapAnalysis.thirtyDayPlan;

  const phase1Skills = prioritySkills.slice(0, 3);
  const phase2Skills = prioritySkills.slice(3, 6).concat(gapAnalysis.skillGaps.filter((s) => !prioritySkills.includes(s)).slice(0, 2));
  const phase3Skills = gapAnalysis.skillGaps.filter((s) => !phase1Skills.includes(s) && !phase2Skills.includes(s)).slice(0, 3);

  let phase1Title = "Core Fundamentals & Development Setup";
  let phase2Title = "Intermediate Systems & Practical Projects";
  let phase3Title = "Advanced Architecture, Portfolio & Interview Prep";

  if (student.year === 1) {
    phase1Title = "Programming Fundamentals & Version Control";
    phase2Title = "Data Structures & Core Domain Concepts";
    phase3Title = "First Complete Hands-on Project & Exploration";
  } else if (student.year === 2) {
    phase1Title = "Core Stack Foundations & DSA Mastery";
    phase2Title = "Full-Stack / Domain Project Building";
    phase3Title = "System Architecture & Open-Source Exposure";
  } else if (student.year === 3) {
    phase1Title = "Targeted Gap Sprint & Project Polish";
    phase2Title = "Advanced Domain Systems & Internship Prep";
    phase3Title = "Mock Technical Interviews & Resume Packaging";
  } else if (student.year >= 4) {
    phase1Title = "Fast-Track Skill Closing & Capstone System";
    phase2Title = "Placement Interview Coding & System Design";
    phase3Title = "Live Deployment, Portfolio Presentation & Job Applications";
  }

  const phaseDuration = student.year >= 3 ? "2 weeks" : "3 weeks";

  const phase1Tasks = [
    thirtyDayPlan[0] || `Set up professional development environment and Git repository for ${student.careerGoal}`,
    thirtyDayPlan[1] || `Master core syntax and essential patterns of ${phase1Skills.join(", ")}`,
  ];

  const phase2Tasks = [
    thirtyDayPlan[2] || `Build core CRUD / algorithmic modules using ${phase2Skills.join(", ") || phase1Skills[0]}`,
    thirtyDayPlan[3] || `Implement database / API integrations and handle edge-case error scenarios`,
  ];

  const phase3Tasks = [
    `Deploy live demo on Vercel/GitHub/Cloud with detailed documentation and README`,
    `Prepare technical walk-through and solve domain-specific interview questions`,
  ];

  return [
    {
      phase: 1,
      title: phase1Title,
      duration: phaseDuration,
      skills: phase1Skills.length > 0 ? phase1Skills : ["Core Syntax", "Git"],
      tasks: phase1Tasks,
      milestone: `Complete Phase 1 foundations within ${phaseDuration} and push initial codebase to GitHub.`,
    },
    {
      phase: 2,
      title: phase2Title,
      duration: phaseDuration,
      skills: phase2Skills.length > 0 ? phase2Skills : ["Frameworks", "Databases"],
      tasks: phase2Tasks,
      milestone: `Deliver functional prototype addressing ${phase2Skills[0] || 'primary missing skills'}.`,
    },
    {
      phase: 3,
      title: phase3Title,
      duration: student.year >= 3 ? "2 weeks" : "1 month",
      skills: phase3Skills.length > 0 ? phase3Skills : ["System Design", "Testing", "Deployment"],
      tasks: phase3Tasks,
      milestone: `Publish production-ready portfolio project and reach 75+ Career Readiness Score.`,
    },
  ];
}

/**
 * Generates personalized project recommendations explicitly designed to close skill gaps.
 */
export function buildProjectRecommendations(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): DetailedProject[] {
  const topGaps = gapAnalysis.prioritySkills.length > 0 ? gapAnalysis.prioritySkills : gapAnalysis.skillGaps;
  const rawProjects = gapAnalysis.recommendedProjects;

  const projectTemplates: DetailedProject[] = [
    {
      title: rawProjects[0] || `${student.careerGoal} Interactive Dashboard & Tracker`,
      difficulty: student.year === 1 ? "Beginner" : "Intermediate",
      technologies: topGaps.slice(0, 3).concat(["Git", "REST APIs"]),
      skillsCovered: topGaps.slice(0, 3),
      whyRecommended: `Directly closes your primary missing skill gaps (${topGaps.slice(0, 2).join(", ")}) through hands-on implementation.`,
      estimatedDuration: "2-3 weeks",
      features: [
        "User authentication and profile management",
        "Responsive data-driven interface with dynamic filtering",
        "Persistent database storage and REST API integration",
      ],
      resumeValue: `Demonstrates proficiency in ${topGaps.slice(0, 2).join(" and ")} with clean architecture.`,
    },
    {
      title: rawProjects[1] || `End-to-End ${student.careerGoal} Management Platform`,
      difficulty: student.year >= 3 ? "Advanced" : "Intermediate",
      technologies: topGaps.slice(1, 4).concat(["SQL", "Cloud Deployment"]),
      skillsCovered: topGaps.slice(1, 4),
      whyRecommended: `Teaches scalable system architecture and connects ${student.careerGoal} workflows to real data.`,
      estimatedDuration: "3-4 weeks",
      features: [
        "Role-based access control and analytics reporting",
        "Automated background processing / data pipelines",
        "CI/CD deployment with live URL demo",
      ],
      resumeValue: `Shows recruiters you can architect, build, and deploy multi-tier production systems.`,
    },
  ];

  if (rawProjects.length >= 3) {
    projectTemplates.push({
      title: rawProjects[2],
      difficulty: "Advanced",
      technologies: topGaps.slice(0, 4),
      skillsCovered: topGaps.slice(0, 4),
      whyRecommended: `Polishes advanced competencies and serves as a standout capstone portfolio highlight.`,
      estimatedDuration: "3-4 weeks",
      features: [
        "High-performance async operations and caching",
        "Unit and integration test suites",
        "Comprehensive API documentation and architecture diagrams",
      ],
      resumeValue: `Serves as a top-tier capstone project for tech screening interviews.`,
    });
  }

  return projectTemplates;
}

/**
 * Builds a structured, actionable 30-day learning plan.
 */
export function buildLearningPlan(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): DailyLearningPlanItem[] {
  const topSkills = gapAnalysis.prioritySkills.length > 0 ? gapAnalysis.prioritySkills : gapAnalysis.skillGaps;

  return [
    {
      day: 1,
      topic: `${topSkills[0] || "Foundations"} Setup & Syntax Fundamentals`,
      tasks: [
        `Install tools, configure VS Code, and set up Git repository`,
        `Learn core syntax and basic data structures of ${topSkills[0] || "primary language"}`,
        `Complete 5 basic interactive coding exercises`,
      ],
      estimatedTime: "60 minutes",
      output: `Initialized GitHub repo with passing basic exercise scripts.`,
      skillTarget: topSkills[0] || "Core Programming",
    },
    {
      day: 7,
      topic: `Intermediate Concepts & ${topSkills[1] || "Tooling"} Integration`,
      tasks: [
        `Study functions, modules, and error handling mechanisms`,
        `Implement first modular utility and commit version history`,
        `Solve 3 medium difficulty domain problems`,
      ],
      estimatedTime: "60 minutes",
      output: `Working modular program pushed to GitHub with README.`,
      skillTarget: topSkills[1] || "Modular Architecture",
    },
    {
      day: 15,
      topic: `Project Architecture & Core Feature Implementation`,
      tasks: [
        `Scaffold starter project addressing ${gapAnalysis.skillGaps.slice(0, 2).join(" & ")}`,
        `Connect UI components with backend logic / APIs`,
        `Handle loading and error states cleanly`,
      ],
      estimatedTime: "75 minutes",
      output: `Functional prototype with end-to-end data flow.`,
      skillTarget: "Full-Stack Integration",
    },
    {
      day: 22,
      topic: `Data Persistence, Testing & Edge-Case Refactoring`,
      tasks: [
        `Integrate database / persistent storage layer`,
        `Write unit tests for core validation and business logic`,
        `Optimize query performance and UI responsiveness`,
      ],
      estimatedTime: "60 minutes",
      output: `Tested codebase with zero critical runtime errors.`,
      skillTarget: "Testing & Persistence",
    },
    {
      day: 30,
      topic: `Deployment, Documentation & Portfolio Showcase`,
      tasks: [
        `Deploy project to cloud platform (Vercel, Netlify, Render, or Supabase)`,
        `Write professional README with screenshots, architecture diagram, and setup guide`,
        `Record 60-second video demo or link live deployment on resume`,
      ],
      estimatedTime: "90 minutes",
      output: `Live deployed project link and polished GitHub repository.`,
      skillTarget: "Production Deployment",
    },
  ];
}

/**
 * Builds the daily AI next action prompt.
 */
export function buildDailyNextAction(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): DailyNextAction {
  const topSkill = gapAnalysis.prioritySkills[0] || gapAnalysis.skillGaps[0] || "core development";

  return {
    title: `Master ${topSkill} Fundamentals & Setup`,
    estimatedTime: "60 minutes",
    reason: `${topSkill} is your #1 priority skill gap for ${student.careerGoal} roles. Closing this foundation unlocks all subsequent project milestones.`,
    tasks: [
      `Spend 20 mins reviewing official documentation or core tutorial on ${topSkill}.`,
      `Spend 30 mins writing practical code examples in your local IDE.`,
      `Spend 10 mins pushing your practice code to a dedicated GitHub repository.`,
    ],
  };
}

/**
 * Generates portfolio and resume enhancement advice without hallucinating fake achievements.
 */
export function buildPortfolioAdvice(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): PortfolioAdvice {
  const topSkills = gapAnalysis.prioritySkills;

  return {
    projectsToHighlight: gapAnalysis.recommendedProjects.slice(0, 2),
    technologiesToEmphasize: student.skills.concat(topSkills.slice(0, 2)),
    githubImprovements: [
      "Maintain a pinned repository for your primary capstone project with a structured README.",
      "Include animated GIF/demo links and architectural diagrams in repository documentation.",
      "Commit regularly to showcase a consistent green contribution streak.",
    ],
    resumeStrengths: [
      `Highlight your academic foundation (${student.cgpa} CGPA in ${student.branch}).`,
      `Frame technical projects with quantifiable impact (e.g., 'Reduced load time by 30%', 'Supported 50+ concurrent requests').`,
      `Group skills into Languages, Frameworks, Developer Tools, and Databases.`,
    ],
    missingEvidence: [
      `Live deployed demo link for projects involving ${topSkills[0] || "target stack"}.`,
      "Verified GitHub repositories showing real commit history rather than tutorial clones.",
    ],
  };
}

/**
 * Generates role-specific technical and behavioral interview preparation guidelines.
 */
export function buildInterviewPreparation(
  student: NormalizedStudentPayload,
  gapAnalysis: CareerGapAnalysis
): InterviewPreparation {
  const goalLower = student.careerGoal.toLowerCase();

  let technicalTopics = ["OOP Concepts", "Data Structures & Algorithms", "Database Normalization & SQL", "REST API Design"];
  let codingTopics = ["Arrays & Two Pointers", "String Manipulation", "HashMap & HashSets", "Binary Search & Sorting"];

  if (goalLower.includes("data") || goalLower.includes("ml") || goalLower.includes("ai")) {
    technicalTopics = ["Supervised vs Unsupervised ML", "Feature Engineering & Scaling", "SQL Aggregations & Joins", "Model Evaluation Metrics (Precision/Recall/F1)"];
    codingTopics = ["NumPy Matrix Operations", "Pandas Data Cleaning", "Algorithmic Complexity", "Statistical Simulations"];
  } else if (goalLower.includes("security") || goalLower.includes("cyber")) {
    technicalTopics = ["TCP/IP & OSI Model", "OWASP Top 10 Vulnerabilities", "Symmetric vs Asymmetric Encryption", "Authentication & JWT Security"];
    codingTopics = ["Socket Programming", "Log Parsing with Python/Bash", "Scripting for Automation", "Binary & Hex Encoding"];
  } else if (goalLower.includes("cloud") || goalLower.includes("devops")) {
    technicalTopics = ["Docker & Container Lifecycle", "CI/CD Pipeline Architecture", "Linux Process & Memory Management", "Cloud Networking & IAM"];
    codingTopics = ["Bash / Shell Scripting", "Python for Automation", "YAML Configuration Parsing", "REST API Integration"];
  }

  return {
    technicalTopics,
    codingTopics,
    behavioralTopics: [
      "Tell me about a challenging bug you encountered in a project and how you solved it.",
      "How do you prioritize learning new technologies alongside your college coursework?",
      "Describe a time you collaborated on a team project or handled disagreements in design.",
    ],
    projectQuestions: [
      `Why did you choose your specific tech stack for "${gapAnalysis.recommendedProjects[0] || 'your main project'}"?`,
      "How did you structure your database schema, and how does it handle data scaling?",
      "If you had another month to work on this project, what performance bottlenecks would you address?",
    ],
    priorityTopics: gapAnalysis.prioritySkills.slice(0, 4),
  };
}

/**
 * Assesses student profile completeness and data confidence.
 */
export function assessDataQuality(student: NormalizedStudentPayload): DataQuality {
  let score = 40;
  const missing: string[] = [];

  if (student.cgpa > 0) score += 20;
  else missing.push("CGPA");

  if (student.skills.length >= 3) score += 20;
  else if (student.skills.length > 0) score += 10;
  else missing.push("Technical Skills List");

  if (student.interests.length > 0) score += 10;
  else missing.push("Career Interests");

  if (student.academicSummary && student.academicSummary.records) score += 10;

  const profileCompleteness = Math.min(100, score);
  const confidence: "high" | "medium" | "low" =
    profileCompleteness >= 80 ? "high" : profileCompleteness >= 60 ? "medium" : "low";

  return {
    profileCompleteness,
    confidence,
    missingInformation: missing,
  };
}

/**
 * Validates that the report conforms to the CareerIntelligenceReport schema.
 */
export function validateCareerIntelligenceReport(data: any): CareerIntelligenceReport {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid Career Intelligence Report: Expected an object.");
  }

  if (!data.readiness || typeof data.readiness.overallScore !== "number") {
    throw new Error("Invalid report: Missing valid readiness score.");
  }

  return data as CareerIntelligenceReport;
}

/**
 * Invokes the AI Career Gap Analyzer Edge Function with bounded exponential backoff retries.
 * 
 * - Retries up to 3 times on transient 503 / 429 / network errors with delays: 1s, 2s, 4s.
 * - Does NOT retry 4xx client errors (400, 401, 403, 404).
 * - Returns structured AIUnavailableError if all retries fail.
 */
export async function analyzeCareerGap(
  student: StudentInput,
  options?: CareerGapAnalysisOptions
): Promise<CareerGapAnalysis> {
  const normalizedStudent = normalizeStudentProfile(student, options?.academicRecords);

  // If a Supabase client instance is passed, use client.functions.invoke
  if (options?.supabaseClient?.functions?.invoke) {
    const { data, error } = await options.supabaseClient.functions.invoke("career-gap-analyzer", {
      body: { student: normalizedStudent },
    });

    if (error) {
      if (isTransientError(error.status, error.message, error)) {
        throw new AIUnavailableError(error.message || JSON.stringify(error));
      }
      throw new AIClientError(error.message || "Request failed", error.status || 400);
    }

    return validateCareerGapAnalysis(data);
  }

  const baseUrl = (options?.supabaseUrl || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const endpoint = `${baseUrl}/functions/v1/career-gap-analyzer`;
  const fetchImpl = options?.fetchFn || fetch;
  const sleepImpl = options?.sleepFn || defaultSleep;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.supabaseAnonKey) {
    headers["apikey"] = options.supabaseAnonKey;
    headers["Authorization"] = `Bearer ${options.supabaseAnonKey}`;
  }

  const maxRetries = typeof options?.maxRetries === "number" ? options.maxRetries : 3;
  const delays = options?.retryDelays || DEFAULT_RETRY_DELAYS;
  let lastError: any = null;
  let lastStatusCode: number | undefined = undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const timeoutMs = options?.timeoutMs || 45000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ student: normalizedStudent }),
        signal: options?.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawData = await response.json();
        return validateCareerGapAnalysis(rawData);
      }

      lastStatusCode = response.status;
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch {
        errorBody = response.statusText;
      }

      // Check if transient error
      if (isTransientError(response.status, errorBody)) {
        lastError = new AIUnavailableError(`Status ${response.status}: ${errorBody}`);
        if (attempt < maxRetries) {
          const delayMs = delays[attempt] || 1000 * Math.pow(2, attempt);
          await sleepImpl(delayMs);
          continue; // Retry
        }
      } else {
        // Permanent 4xx error - DO NOT RETRY
        throw new AIClientError(`Request failed with status ${response.status}: ${errorBody}`, response.status);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err instanceof AIClientError) {
        throw err;
      }

      if (err.name === "AbortError") {
        lastError = new AIUnavailableError(`Career Gap Analysis timed out after ${timeoutMs / 1000}s`);
      } else {
        lastError = err;
      }

      if (isTransientError(lastStatusCode, undefined, lastError)) {
        if (attempt < maxRetries) {
          const delayMs = delays[attempt] || 1000 * Math.pow(2, attempt);
          await sleepImpl(delayMs);
          continue;
        }
      } else {
        throw err;
      }
    }
  }

  // If all retries exhausted, throw structured AIUnavailableError
  throw (lastError instanceof AIUnavailableError ? lastError : new AIUnavailableError(lastError?.message));
}

/**
 * Generates the full AI Career Intelligence Report with transient retry handling.
 */
export async function generateCareerIntelligence(
  student: StudentInput,
  gapAnalysis?: CareerGapAnalysis,
  options?: CareerGapAnalysisOptions
): Promise<CareerIntelligenceReport> {
  const normalizedStudent = normalizeStudentProfile(student, options?.academicRecords);

  let analysis = gapAnalysis;
  if (!analysis) {
    analysis = await analyzeCareerGap(normalizedStudent, options);
  }

  const readiness = computeSmartReadinessScore(normalizedStudent, analysis);
  const skillGaps = buildDetailedSkillGaps(normalizedStudent, analysis);
  const roadmap = buildAdaptiveRoadmap(normalizedStudent, analysis);
  const projects = buildProjectRecommendations(normalizedStudent, analysis);
  const learningPlan = buildLearningPlan(normalizedStudent, analysis);
  const nextAction = buildDailyNextAction(normalizedStudent, analysis);
  const portfolioAdvice = buildPortfolioAdvice(normalizedStudent, analysis);
  const interviewPreparation = buildInterviewPreparation(normalizedStudent, analysis);
  const dataQuality = assessDataQuality(normalizedStudent);

  const report: CareerIntelligenceReport = {
    student: normalizedStudent,
    careerGoal: normalizedStudent.careerGoal,
    readiness,
    skillGaps,
    prioritySkills: analysis.prioritySkills,
    roadmap,
    projects,
    learningPlan,
    portfolioAdvice,
    interviewPreparation,
    nextAction,
    dataQuality,
    summary: analysis.summary,
    readinessScore: analysis.readinessScore,
    strengths: analysis.strengths,
    recommendedProjects: analysis.recommendedProjects,
    thirtyDayPlan: analysis.thirtyDayPlan,
  };

  return validateCareerIntelligenceReport(report);
}

/**
 * Generates a personalized Career Roadmap for a student (Backwards compatible helper).
 */
export async function generateCareerRoadmap(
  student: StudentInput,
  gapAnalysis?: CareerGapAnalysis,
  options?: CareerGapAnalysisOptions
): Promise<CareerRoadmap> {
  const intelligence = await generateCareerIntelligence(student, gapAnalysis, options);

  const currentLevel =
    intelligence.readiness.overallScore < 45
      ? "Beginner"
      : intelligence.readiness.overallScore < 75
      ? "Intermediate"
      : "Advanced";

  return {
    careerGoal: intelligence.careerGoal,
    currentLevel,
    roadmap: intelligence.roadmap,
    projects: intelligence.projects.map((p) => p.title),
    milestones: intelligence.roadmap.map((r) => r.milestone),
    nextAction: `${intelligence.nextAction.title}: ${intelligence.nextAction.tasks[0] || intelligence.nextAction.reason}`,
  };
}

/**
 * State store helper for Career Intelligence in frontend UI components.
 */
export function createCareerIntelligenceStore(options: CareerGapAnalysisOptions = {}) {
  let state: CareerIntelligenceState = {
    data: null,
    isLoading: false,
    error: null,
  };

  const listeners = new Set<(s: CareerIntelligenceState) => void>();

  const getState = (): CareerIntelligenceState => ({ ...state });

  const setState = (updater: Partial<CareerIntelligenceState>) => {
    state = { ...state, ...updater };
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener: (s: CareerIntelligenceState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const execute = async (
    student: StudentInput,
    gapAnalysis?: CareerGapAnalysis,
    executionOptions: CareerGapAnalysisOptions = {}
  ) => {
    setState({ isLoading: true, error: null });
    try {
      const report = await generateCareerIntelligence(student, gapAnalysis, { ...options, ...executionOptions });
      setState({ data: report, isLoading: false, error: null });
      return report;
    } catch (err: any) {
      const errorObj = err?.error || {
        code: "AI_ERROR",
        message: err instanceof Error ? err.message : String(err),
        retryable: false,
      };
      setState({ error: errorObj, isLoading: false });
      throw err;
    }
  };

  return {
    getState,
    subscribe,
    execute,
  };
}

/**
 * State store helper for Career Gap (Backwards compatible helper).
 */
export function createCareerGapStore(options: CareerGapAnalysisOptions = {}) {
  let state: CareerGapState = {
    data: null,
    isLoading: false,
    error: null,
  };

  const listeners = new Set<(s: CareerGapState) => void>();

  const getState = (): CareerGapState => ({ ...state });

  const setState = (updater: Partial<CareerGapState>) => {
    state = { ...state, ...updater };
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener: (s: CareerGapState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const execute = async (student: StudentInput, executionOptions: CareerGapAnalysisOptions = {}) => {
    setState({ isLoading: true, error: null });
    try {
      const result = await analyzeCareerGap(student, { ...options, ...executionOptions });
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (err: any) {
      const errorObj = err?.error || {
        code: "AI_ERROR",
        message: err instanceof Error ? err.message : String(err),
        retryable: false,
      };
      setState({ error: errorObj, isLoading: false });
      throw err;
    }
  };

  return {
    getState,
    subscribe,
    execute,
  };
}

/**
 * State store helper for Career Roadmap (Backwards compatible helper).
 */
export function createCareerRoadmapStore(options: CareerGapAnalysisOptions = {}) {
  let state: CareerRoadmapState = {
    data: null,
    gapAnalysis: null,
    isLoading: false,
    error: null,
  };

  const listeners = new Set<(s: CareerRoadmapState) => void>();

  const getState = (): CareerRoadmapState => ({ ...state });

  const setState = (updater: Partial<CareerRoadmapState>) => {
    state = { ...state, ...updater };
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener: (s: CareerRoadmapState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const execute = async (
    student: StudentInput,
    gapAnalysis?: CareerGapAnalysis,
    executionOptions: CareerGapAnalysisOptions = {}
  ) => {
    setState({ isLoading: true, error: null });
    try {
      let analysis = gapAnalysis;
      if (!analysis) {
        analysis = await analyzeCareerGap(student, { ...options, ...executionOptions });
      }
      const roadmap = await generateCareerRoadmap(student, analysis, { ...options, ...executionOptions });
      setState({ data: roadmap, gapAnalysis: analysis, isLoading: false, error: null });
      return { roadmap, gapAnalysis: analysis };
    } catch (err: any) {
      const errorObj = err?.error || {
        code: "AI_ERROR",
        message: err instanceof Error ? err.message : String(err),
        retryable: false,
      };
      setState({ error: errorObj, isLoading: false });
      throw err;
    }
  };

  return {
    getState,
    subscribe,
    execute,
  };
}
