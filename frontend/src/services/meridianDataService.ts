/**
 * Meridian Data Service — Typed Unified Client for Meridian Learning Orbit
 * 
 * Directly connects frontend views with backend PostgreSQL / Supabase APIs,
 * while maintaining local cache & seamless fallbacks.
 */

import { fetchApi, ApiResponse } from "./apiClient";

export interface CurriculumTopic {
  id: string;
  topic_key: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimated_hours: number;
  career_relevance: string;
  skill_tags: string[];
  subtopics: Array<{
    id?: string;
    name: string;
    difficulty: "Easy" | "Medium" | "Hard";
    key_concepts: string[];
  }>;
}

export interface CurriculumYear {
  year_number: number;
  title: string;
  focus_theme: string;
  topics: CurriculumTopic[];
}

export interface AssessmentQuestion {
  id: string;
  topic_key: string;
  subtopic_name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question_type: "mcq" | "multiple" | "boolean" | "short_code";
  question_text: string;
  code_snippet?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  skill_tags: string[];
  estimated_minutes: number;
}

export interface QuestionAttemptPayload {
  questionId: string;
  topicId: string;
  selectedAnswer: number | string;
  timeSeconds?: number;
}

export interface QuestionAttemptResult {
  success: boolean;
  isCorrect: boolean;
  score: number;
  mastery: any;
  revision: any;
}

export interface SubjectGradeRecord {
  code: string;
  name: string;
  semester: number;
  credits: number;
  score: number;
  grade: string;
  attendancePct: number;
  status: "strong" | "average" | "needs_attention";
  trendDelta: number;
  internalMarks: number;
  endSemMarks: number;
}

export interface CodingProblemItem {
  id: string;
  title: string;
  platform: string;
  problemUrl: string;
  difficulty: "Easy" | "Medium" | "Hard";
  youtubeSolutionUrl?: string;
  youtubeChannelName?: string;
  isBlind75?: boolean;
  isNeetcode150?: boolean;
  isStriverA2Z?: boolean;
  tags: string[];
  studentStatus: "solved" | "attempted" | "bookmarked" | "unsolved";
}

class MeridianDataService {
  /**
   * Fetch 4-Year Curriculum Hierarchy
   */
  async getCurriculum(): Promise<CurriculumYear[]> {
    const res = await fetchApi<CurriculumYear[]>("/roadmaps/curriculum");
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }

  /**
   * Fetch Assessment Questions for a Topic
   */
  async getQuestionsByTopic(topicId: string): Promise<AssessmentQuestion[]> {
    const res = await fetchApi<AssessmentQuestion[]>(`/roadmaps/questions/${encodeURIComponent(topicId)}`);
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }

  /**
   * Record Question Attempt
   */
  async submitQuestionAttempt(payload: QuestionAttemptPayload): Promise<ApiResponse<QuestionAttemptResult>> {
    return fetchApi<QuestionAttemptResult>("/roadmaps/questions/attempt", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Fetch Student Topic Mastery
   */
  async getTopicMastery(): Promise<Record<string, any>> {
    const res = await fetchApi<Record<string, any>>("/students/mastery");
    if (res.success && res.data) {
      return res.data;
    }
    return {};
  }

  /**
   * Schedule Spaced Revision
   */
  async setRevisionSchedule(topicId: string, intervalDays: number): Promise<ApiResponse> {
    return fetchApi(`/students/revisions/${encodeURIComponent(topicId)}/schedule`, {
      method: "POST",
      body: JSON.stringify({ intervalDays }),
    });
  }

  /**
   * Fetch Explainable Next-Best-Actions
   */
  async getNextBestActions(): Promise<any[]> {
    const res = await fetchApi<any[]>("/dashboard/next-actions");
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }

  /**
   * Complete a Next-Best-Action
   */
  async completeNextBestAction(actionId: string): Promise<ApiResponse> {
    return fetchApi(`/dashboard/next-actions/${encodeURIComponent(actionId)}/complete`, {
      method: "POST",
    });
  }

  /**
   * Fetch Course Gradebook
   */
  async getSubjectGrades(semester: number = 5): Promise<SubjectGradeRecord[]> {
    const res = await fetchApi<SubjectGradeRecord[]>(`/academics/grades?semester=${semester}`);
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }

  /**
   * Fetch Productivity Tasks
   */
  async getProductivityTasks(): Promise<any[]> {
    const res = await fetchApi<any[]>("/productivity/tasks");
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }

  /**
   * Create Productivity Task
   */
  async createProductivityTask(task: { title: string; category?: string; priority?: string; durationMinutes?: number; dueDate?: string }): Promise<ApiResponse> {
    return fetchApi("/productivity/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  /**
   * Toggle Task Completion
   */
  async updateProductivityTask(taskId: string, completed: boolean): Promise<ApiResponse> {
    return fetchApi(`/productivity/tasks/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    });
  }

  /**
   * Record Focus Session (Pomodoro)
   */
  async recordFocusSession(session: { durationMinutes: number; sessionMode: string }): Promise<ApiResponse> {
    return fetchApi("/productivity/focus-session", {
      method: "POST",
      body: JSON.stringify(session),
    });
  }

  /**
   * Fetch Curated Coding Problems
   */
  async getCodingProblems(): Promise<CodingProblemItem[]> {
    const res = await fetchApi<CodingProblemItem[]>("/resources/coding-problems");
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }

  /**
   * Update Coding Problem Status
   */
  async updateCodingProblemStatus(problemId: string, status: "solved" | "attempted" | "bookmarked"): Promise<ApiResponse> {
    return fetchApi(`/resources/coding-problems/${encodeURIComponent(problemId)}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Get Current Authenticated Student Profile
   */
  async getMyProfile(): Promise<any> {
    const res = await fetchApi("/students/profile/me");
    if (res.success && res.data) {
      return res.data;
    }
    return null;
  }

  /**
   * Update Authenticated Student Profile
   */
  async updateMyProfile(profileData: any): Promise<ApiResponse> {
    return fetchApi("/students/profile/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
}

export const meridianDataService = new MeridianDataService();
export default meridianDataService;
