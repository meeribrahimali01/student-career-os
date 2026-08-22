/**
 * Frontend REST API Client for Meridian Backend
 * 
 * Provides safe, typed methods to consume Express REST APIs
 * without bundling or exposing any sensitive keys or credentials.
 */

const API_BASE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "/api"
).replace(/\/$/, "");

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  records?: T;
  error?: string;
}

export interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Automatically retrieve active Supabase JWT from browser localStorage
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined" || !window.localStorage) return null;

  try {
    const directToken = localStorage.getItem("meridian_token") || localStorage.getItem("careeros_token");
    if (directToken && directToken.trim() !== "") return directToken;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || "";
      if (key.includes("auth-token") || key.includes("supabase.auth.token")) {
        const val = localStorage.getItem(key);
        if (!val) continue;
        try {
          const parsed = JSON.parse(val);
          if (parsed.access_token) return parsed.access_token;
          if (parsed.currentSession?.access_token) return parsed.currentSession.access_token;
        } catch {
          if (typeof val === "string" && val.startsWith("ey")) return val;
        }
      }
    }
  } catch {
    // Ignore storage access errors
  }
  return null;
}

export function storeAuthToken(token: string, user?: any) {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.setItem("meridian_token", token);
  localStorage.setItem("careeros_token", token);
  if (user) {
    localStorage.setItem("meridian_user", JSON.stringify(user));
  }
}

export function getStoredUser(): any | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const userStr = localStorage.getItem("meridian_user") || localStorage.getItem("careeros_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.removeItem("meridian_token");
  localStorage.removeItem("careeros_token");
  localStorage.removeItem("meridian_user");
  localStorage.removeItem("careeros_user");
}

/**
 * Generic fetch wrapper for backend API calls
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers = {}, ...restOptions } = options;

  const resolvedToken = token || getStoredAuthToken();
  const isFormData = typeof FormData !== "undefined" && restOptions.body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  };

  if (resolvedToken) {
    requestHeaders["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: requestHeaders,
      ...restOptions,
    });

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: response.ok,
      message: response.statusText,
    }));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        error: data.error || response.statusText,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error connecting to Meridian backend",
      error: error.message,
    };
  }
}

/**
 * Authentication Endpoints
 */
export async function loginUser(credentials: { email: string; password: string }): Promise<ApiResponse> {
  const res = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  if (res.success && res.data?.token) {
    storeAuthToken(res.data.token, res.data.user);
  }
  return res;
}

export async function signupUser(payload: { email: string; password: string; fullName?: string }): Promise<ApiResponse> {
  const res = await fetchApi("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res.success && res.data?.token) {
    storeAuthToken(res.data.token, res.data.user);
  }
  return res;
}

export async function getAuthMe(token?: string): Promise<ApiResponse> {
  return fetchApi("/auth/me", { token });
}

export async function logoutUser(): Promise<ApiResponse> {
  try {
    await fetchApi("/auth/logout", { method: "POST" });
  } finally {
    clearAuthToken();
  }
  return { success: true, message: "Logged out" };
}

/**
 * Health Check API
 */
export async function getHealth(): Promise<ApiResponse> {
  return fetchApi("/health");
}

export async function getSupabaseHealth(): Promise<ApiResponse> {
  return fetchApi("/health/supabase");
}

/**
 * Student Dashboard API
 */
export async function getStudentDashboard(studentId: string, token?: string): Promise<ApiResponse> {
  return fetchApi(`/dashboard/${encodeURIComponent(studentId)}`, { token });
}

/**
 * Student Profile & Skills API
 */
export async function getStudentProfile(studentId: string, token?: string): Promise<ApiResponse> {
  return fetchApi(`/students/${encodeURIComponent(studentId)}`, { token });
}

export async function getStudentSkills(studentId: string, token?: string): Promise<ApiResponse> {
  return fetchApi(`/students/${encodeURIComponent(studentId)}/skills`, { token });
}

export async function getSkillsCatalog(category?: string): Promise<ApiResponse> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return fetchApi(`/skills${query}`);
}

/**
 * Academic Records API
 */
export async function getAcademicRecords(studentId: string, token?: string): Promise<ApiResponse> {
  return fetchApi(`/academics/${encodeURIComponent(studentId)}`, { token });
}

/**
 * Roadmaps API
 */
export async function getStudentRoadmaps(studentId: string, token?: string): Promise<ApiResponse> {
  return fetchApi(`/roadmaps/${encodeURIComponent(studentId)}`, { token });
}

/**
 * Placements API
 */
export async function getPlacementOpportunities(): Promise<ApiResponse> {
  return fetchApi("/placements");
}

/**
 * Events API
 */
export async function getEvents(): Promise<ApiResponse> {
  return fetchApi("/events");
}

/**
 * Resources API
 */
export async function getResources(params?: { category?: string; type?: string; difficulty?: string }): Promise<ApiResponse> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.difficulty) searchParams.set("difficulty", params.difficulty);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return fetchApi(`/resources${query}`);
}

/**
 * AI Services API (Gemini Powered Backend)
 */
export interface GenerateInterviewParams {
  target_role: string;
  interview_type?: "technical" | "hr" | "behavioral" | "aptitude" | "system_design";
  difficulty?: "beginner" | "intermediate" | "advanced";
  question_count?: number;
  student_id?: string;
}

export async function generateMockInterview(params: GenerateInterviewParams, token?: string): Promise<ApiResponse> {
  return fetchApi("/ai/interview/generate", {
    method: "POST",
    body: JSON.stringify(params),
    token,
  });
}

export interface EvaluateInterviewParams {
  question: string;
  answer: string;
  target_role?: string;
  interview_type?: string;
  student_id?: string;
  save_session?: boolean;
}

export async function evaluateInterviewAnswer(params: EvaluateInterviewParams, token?: string): Promise<ApiResponse> {
  return fetchApi("/ai/interview/evaluate", {
    method: "POST",
    body: JSON.stringify(params),
    token,
  });
}

export interface AnalyzeSkillGapParams {
  target_role: string;
  student_id?: string;
  resume_id?: string;
}

export async function analyzeSkillGap(params: AnalyzeSkillGapParams, token?: string): Promise<ApiResponse> {
  return fetchApi("/ai/skill-gap", {
    method: "POST",
    body: JSON.stringify(params),
    token,
  });
}

export async function parseResume(payload: FormData | { resume_id: string } | { resume_text: string }, token?: string): Promise<ApiResponse> {
  return fetchApi("/ai/resume/parse", {
    method: "POST",
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
    token,
  });
}

export default {
  fetchApi,
  getStoredAuthToken,
  storeAuthToken,
  getStoredUser,
  clearAuthToken,
  loginUser,
  signupUser,
  getAuthMe,
  logoutUser,
  getHealth,
  getSupabaseHealth,
  getStudentDashboard,
  getStudentProfile,
  getStudentSkills,
  getSkillsCatalog,
  getAcademicRecords,
  getStudentRoadmaps,
  getPlacementOpportunities,
  getEvents,
  getResources,
  generateMockInterview,
  evaluateInterviewAnswer,
  analyzeSkillGap,
  parseResume,
};
