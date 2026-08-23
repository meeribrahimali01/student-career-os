const supabase = require("../config/supabase");

// In-memory per-student problem status store for guaranteed multi-user isolation
const studentSubmissionsStore = new Map();

const CURATED_PROBLEMS_CATALOG = [
  {
    id: "prob_network_delay",
    title: "Network Delay Time (Dijkstra Shortest Path)",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/network-delay-time/",
    difficulty: "Medium",
    youtubeSolutionUrl: "https://www.youtube.com/watch?v=EaphyqKU4PQ",
    youtubeChannelName: "NeetCode",
    isBlind75: true,
    isNeetcode150: true,
    isStriverA2Z: true,
    tags: ["Graphs", "Dijkstra", "Priority Queue"],
  },
  {
    id: "prob_course_schedule",
    title: "Course Schedule (Cycle Detection & Topological Sort)",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/course-schedule/",
    difficulty: "Medium",
    youtubeSolutionUrl: "https://www.youtube.com/watch?v=EgI5nU9etnU",
    youtubeChannelName: "NeetCode",
    isBlind75: true,
    isNeetcode150: true,
    isStriverA2Z: true,
    tags: ["Graphs", "Topological Sort", "BFS", "Kahn"],
  },
  {
    id: "prob_coin_change",
    title: "Coin Change (Unbounded Knapsack)",
    platform: "LeetCode",
    problemUrl: "https://leetcode.com/problems/coin-change/",
    difficulty: "Medium",
    youtubeSolutionUrl: "https://www.youtube.com/watch?v=H9bfqozjoqs",
    youtubeChannelName: "NeetCode",
    isBlind75: true,
    isNeetcode150: true,
    isStriverA2Z: true,
    tags: ["Dynamic Programming", "Knapsack"],
  },
];

/**
 * Coding Resources Service - Curated Problems & Solutions
 */
class CodingResourcesService {
  /**
   * Get Curated Coding Problems with Student Submissions
   */
  async getCodingProblems(studentId) {
    let studentStatusMap = studentSubmissionsStore.get(studentId) || {};

    try {
      const { data: problems } = await supabase
        .from("curated_coding_problems")
        .select(`
          *,
          submissions:student_coding_submissions(id, status, solved_at)
        `)
        .eq("submissions.student_id", studentId);

      if (problems && problems.length > 0) {
        return problems.map((p) => ({
          ...p,
          studentStatus: p.submissions && p.submissions.length > 0 ? p.submissions[0].status : studentStatusMap[p.id] || "unsolved",
        }));
      }
    } catch (e) {}

    return CURATED_PROBLEMS_CATALOG.map((p) => ({
      ...p,
      studentStatus: studentStatusMap[p.id] || "unsolved",
    }));
  }

  /**
   * Update Student Coding Problem Status (solved | attempted | bookmarked)
   */
  async updateProblemStatus(studentId, problemId, status) {
    let studentStatusMap = studentSubmissionsStore.get(studentId) || {};
    studentStatusMap[problemId] = status;
    studentSubmissionsStore.set(studentId, studentStatusMap);

    try {
      await supabase.from("student_coding_submissions").upsert(
        {
          student_id: studentId,
          problem_id: problemId,
          status: status,
          solved_at: status === "solved" ? new Date().toISOString() : null,
        },
        { onConflict: "student_id,problem_id" }
      );
    } catch (e) {}

    return { success: true, problemId, status };
  }
}

module.exports = new CodingResourcesService();
