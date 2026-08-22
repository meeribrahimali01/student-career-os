/**
 * Frontend REST API Client for CareerOS Backend
 * 
 * Provides safe, typed methods to consume Member 3's Express REST API
 * without bundling or exposing any sensitive keys or credentials.
 */

const API_BASE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5000/api"
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
 * Generic fetch wrapper for backend API calls
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers = {}, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
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
      message: error.message || "Network error connecting to CareerOS backend",
      error: error.message,
    };
  }
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
 * Student Dashboard API (Aggregated Domain Metrics)
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

export default {
  fetchApi,
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
};
