/**
 * AI Career Intelligence Engine & Gap Analyzer Service Layer (ES Module)
 * 
 * Part of Student Career OS - Member 2 (AI / Gemini Responsibility)
 * Secure client-side & backend service communicating with the Supabase Edge Function.
 * 
 * Includes:
 * - Bounded exponential backoff retry logic (up to 3 retries, delays: 1s, 2s, 4s).
 * - Automatic detection of transient 503 (High Demand / UNAVAILABLE) and 429 errors.
 * - Non-retryable immediate error handling for 4xx validation errors.
 * - Structured fallback error format: AI_TEMPORARILY_UNAVAILABLE.
 */

export const DEFAULT_SUPABASE_URL = "https://wijvstnqnofwxuhyxjgk.supabase.co";
export const DEFAULT_RETRY_DELAYS = [1000, 2000, 4000];

export class AIUnavailableError extends Error {
  constructor(details) {
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
  constructor(message, statusCode) {
    super(message);
    this.name = "AIClientError";
    this.statusCode = statusCode;
    this.retryable = false;
  }
}

/**
 * Checks if an HTTP status code or error text represents a transient, retryable failure.
 */
export function isTransientError(statusCode, errorText, err) {
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
 * Default sleep implementation.
 */
export function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalizes input student data from either Supabase DB row (snake_case)
 * or frontend form input (camelCase) into the structure expected by the AI service.
 */
export function normalizeStudentProfile(student, academicRecords = []) {
  if (!student || typeof student !== "object") {
    throw new AIClientError("Student profile data is required.", 400);
  }

  const name = String(student.name || "").trim();
  const year = Number(student.year) || 1;
  const branch = String(student.branch || "").trim();
  const cgpa = Number(student.cgpa) || 0;
  const careerGoal = String(student.careerGoal || student.career_goal || "").trim();

  let skills = [];
  if (Array.isArray(student.skills)) {
    skills = student.skills.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof student.skills === "string") {
    skills = student.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  let interests = [];
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

  const payload = {
    name,
    year,
    branch,
    cgpa,
    careerGoal,
    skills,
    interests,
  };

  if (Array.isArray(academicRecords) && academicRecords.length > 0) {
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
export function validateCareerGapAnalysis(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI response: Expected an object.");
  }

  const readinessScore = typeof data.readinessScore === "number" ? data.readinessScore : Number(data.readinessScore);
  if (isNaN(readinessScore) || readinessScore < 0 || readinessScore > 100) {
    throw new Error("Invalid readiness score received from AI service.");
  }

  const ensureStringArray = (field) => {
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
    strengths: ensureStringArray(data.strengths),
    skillGaps: ensureStringArray(data.skillGaps),
    prioritySkills: ensureStringArray(data.prioritySkills),
    recommendedProjects: ensureStringArray(data.recommendedProjects),
    thirtyDayPlan: ensureStringArray(data.thirtyDayPlan),
    summary: typeof data.summary === "string" ? data.summary.trim() : "",
  };
}

/**
 * Computes an explainable, multi-dimensional Smart Career Readiness Score.
 */
export function computeSmartReadinessScore(student, gapAnalysis) {
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

  const scoreBreakdown = {
    technicalSkills,
    projects,
    problemSolving,
    careerAlignment,
    portfolio,
    academicFoundation,
  };

  const areaEntries = [
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
export function buildDetailedSkillGaps(student, gapAnalysis) {
  const prioritySet = new Set(gapAnalysis.prioritySkills.map((s) => s.toLowerCase()));
  const allGaps = gapAnalysis.skillGaps.length > 0 ? gapAnalysis.skillGaps : gapAnalysis.prioritySkills;

  return allGaps.map((skillName, index) => {
    const isPriority = prioritySet.has(skillName.toLowerCase()) || index < 2;
    const importance = index === 0 ? "Critical" : isPriority ? "High" : index < 4 ? "Medium" : "Low";

    const hasPartial = student.skills.some((s) => s.toLowerCase().includes(skillName.toLowerCase()));
    const currentLevel = hasPartial ? "beginner" : "none";
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
export function buildAdaptiveRoadmap(student, gapAnalysis) {
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
      milestone: `Deliver functional prototype addressing ${phase2Skills[0] || "primary missing skills"}.`,
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
export function buildProjectRecommendations(student, gapAnalysis) {
  const topGaps = gapAnalysis.prioritySkills.length > 0 ? gapAnalysis.prioritySkills : gapAnalysis.skillGaps;
  const rawProjects = gapAnalysis.recommendedProjects;

  const projectTemplates = [
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
export function buildLearningPlan(student, gapAnalysis) {
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
export function buildDailyNextAction(student, gapAnalysis) {
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
export function buildPortfolioAdvice(student, gapAnalysis) {
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
export function buildInterviewPreparation(student, gapAnalysis) {
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
export function assessDataQuality(student) {
  let score = 40;
  const missing = [];

  if (student.cgpa > 0) score += 20;
  else missing.push("CGPA");

  if (student.skills.length >= 3) score += 20;
  else if (student.skills.length > 0) score += 10;
  else missing.push("Technical Skills List");

  if (student.interests.length > 0) score += 10;
  else missing.push("Career Interests");

  if (student.academicSummary && student.academicSummary.records) score += 10;

  const profileCompleteness = Math.min(100, score);
  const confidence = profileCompleteness >= 80 ? "high" : profileCompleteness >= 60 ? "medium" : "low";

  return {
    profileCompleteness,
    confidence,
    missingInformation: missing,
  };
}

/**
 * Validates that the report conforms to the CareerIntelligenceReport schema.
 */
export function validateCareerIntelligenceReport(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid Career Intelligence Report: Expected an object.");
  }

  if (!data.readiness || typeof data.readiness.overallScore !== "number") {
    throw new Error("Invalid report: Missing valid readiness score.");
  }

  return data;
}

/**
 * Invokes the AI Career Gap Analyzer Edge Function with bounded exponential backoff retries.
 * 
 * - Retries up to 3 times on transient 503 / 429 / network errors with delays: 1s, 2s, 4s.
 * - Does NOT retry 4xx client errors (400, 401, 403, 404).
 * - Returns structured AIUnavailableError if all retries fail.
 */
export async function analyzeCareerGap(student, options = {}) {
  const normalizedStudent = normalizeStudentProfile(student, options.academicRecords);

  if (options.supabaseClient && options.supabaseClient.functions && typeof options.supabaseClient.functions.invoke === "function") {
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

  const baseUrl = (options.supabaseUrl || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const endpoint = `${baseUrl}/functions/v1/career-gap-analyzer`;
  const fetchImpl = options.fetchFn || fetch;
  const sleepImpl = options.sleepFn || defaultSleep;

  const headers = {
    "Content-Type": "application/json",
  };

  if (options.supabaseAnonKey) {
    headers["apikey"] = options.supabaseAnonKey;
    headers["Authorization"] = `Bearer ${options.supabaseAnonKey}`;
  }

  const maxRetries = typeof options.maxRetries === "number" ? options.maxRetries : 3;
  const delays = options.retryDelays || DEFAULT_RETRY_DELAYS;
  let lastError = null;
  let lastStatusCode = undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const timeoutMs = options.timeoutMs || 45000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ student: normalizedStudent }),
        signal: options.signal || controller.signal,
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

      if (isTransientError(response.status, errorBody)) {
        lastError = new AIUnavailableError(`Status ${response.status}: ${errorBody}`);
        if (attempt < maxRetries) {
          const delayMs = delays[attempt] || 1000 * Math.pow(2, attempt);
          await sleepImpl(delayMs);
          continue;
        }
      } else {
        // Permanent 4xx error - DO NOT RETRY
        throw new AIClientError(`Request failed with status ${response.status}: ${errorBody}`, response.status);
      }
    } catch (err) {
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

  throw (lastError instanceof AIUnavailableError ? lastError : new AIUnavailableError(lastError?.message));
}

/**
 * Generates the full AI Career Intelligence Report with retry protection.
 */
export async function generateCareerIntelligence(student, gapAnalysis, options = {}) {
  const normalizedStudent = normalizeStudentProfile(student, options.academicRecords);

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

  const report = {
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
export async function generateCareerRoadmap(student, gapAnalysis, options = {}) {
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
export function createCareerIntelligenceStore(options = {}) {
  let state = {
    data: null,
    isLoading: false,
    error: null,
  };

  const listeners = new Set();

  const getState = () => ({ ...state });

  const setState = (updater) => {
    state = { ...state, ...updater };
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const execute = async (student, gapAnalysis, executionOptions = {}) => {
    setState({ isLoading: true, error: null });
    try {
      const report = await generateCareerIntelligence(student, gapAnalysis, { ...options, ...executionOptions });
      setState({ data: report, isLoading: false, error: null });
      return report;
    } catch (err) {
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
export function createCareerGapStore(options = {}) {
  let state = {
    data: null,
    isLoading: false,
    error: null,
  };

  const listeners = new Set();

  const getState = () => ({ ...state });

  const setState = (updater) => {
    state = { ...state, ...updater };
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const execute = async (student, executionOptions = {}) => {
    setState({ isLoading: true, error: null });
    try {
      const result = await analyzeCareerGap(student, { ...options, ...executionOptions });
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (err) {
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
export function createCareerRoadmapStore(options = {}) {
  let state = {
    data: null,
    gapAnalysis: null,
    isLoading: false,
    error: null,
  };

  const listeners = new Set();

  const getState = () => ({ ...state });

  const setState = (updater) => {
    state = { ...state, ...updater };
    listeners.forEach((listener) => listener(getState()));
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const execute = async (student, gapAnalysis, executionOptions = {}) => {
    setState({ isLoading: true, error: null });
    try {
      let analysis = gapAnalysis;
      if (!analysis) {
        analysis = await analyzeCareerGap(student, { ...options, ...executionOptions });
      }
      const roadmap = await generateCareerRoadmap(student, analysis, { ...options, ...executionOptions });
      setState({ data: roadmap, gapAnalysis: analysis, isLoading: false, error: null });
      return { roadmap, gapAnalysis: analysis };
    } catch (err) {
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
