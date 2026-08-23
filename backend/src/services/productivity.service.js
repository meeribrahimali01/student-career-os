const supabase = require("../config/supabase");

// In-memory per-student task and focus sessions store for guaranteed multi-user isolation
const studentTasksStore = new Map();
const studentFocusStore = new Map();

/**
 * Productivity Service - Student-Isolated Tasks and Pomodoro Sessions
 */
class ProductivityService {
  /**
   * Get Student Productivity Tasks
   */
  async getTasks(studentId) {
    try {
      const { data: tasks } = await supabase
        .from("productivity_tasks")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });

      if (tasks && tasks.length > 0) return tasks;
    } catch (e) {}

    // Return the student's actual tasks or empty array
    const inMem = studentTasksStore.get(studentId);
    return inMem || [];
  }

  /**
   * Create New Productivity Task
   */
  async createTask(studentId, { title, category = "Personal Study", priority = "Medium", durationMinutes = 25, dueDate = "Today" }) {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      student_id: studentId,
      title,
      category,
      priority,
      duration_minutes: durationMinutes,
      completed: false,
      due_date: dueDate === "Today" ? new Date().toISOString().split("T")[0] : dueDate,
      created_at: new Date().toISOString(),
    };

    let tasks = studentTasksStore.get(studentId) || [];
    tasks = [newTask, ...tasks];
    studentTasksStore.set(studentId, tasks);

    try {
      await supabase.from("productivity_tasks").insert(newTask);
    } catch (e) {}

    return newTask;
  }

  /**
   * Toggle or Update Task Status
   */
  async updateTask(studentId, taskId, { completed }) {
    let tasks = studentTasksStore.get(studentId) || [];
    tasks = tasks.map((t) => (t.id === taskId ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null } : t));
    studentTasksStore.set(studentId, tasks);

    try {
      await supabase
        .from("productivity_tasks")
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq("id", taskId)
        .eq("student_id", studentId);
    } catch (e) {}

    return { success: true, taskId, completed };
  }

  /**
   * Record Completed Pomodoro Focus Session
   */
  async recordFocusSession(studentId, { durationMinutes = 25, sessionMode = "work" }) {
    const session = {
      student_id: studentId,
      duration_minutes: durationMinutes,
      session_mode: sessionMode,
      completed_at: new Date().toISOString(),
    };

    let sessions = studentFocusStore.get(studentId) || [];
    sessions.push(session);
    studentFocusStore.set(studentId, sessions);

    try {
      await supabase.from("focus_sessions").insert(session);
    } catch (e) {}

    return { success: true, session };
  }
}

module.exports = new ProductivityService();
