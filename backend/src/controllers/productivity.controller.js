const productivityService = require("../services/productivity.service");
const { sendSuccess, sendError } = require("../utils/response");

function resolveStudentId(req) {
  if (req.user?.id) return req.user.id;
  if (req.user?.student?.id) return req.user.student.id;
  if (req.user?.profile?.role === "admin" && (req.query?.studentId || req.body?.studentId)) {
    return req.query?.studentId || req.body?.studentId;
  }
  return req.query?.studentId || req.body?.studentId || "00000000-0000-0000-0000-000000000001";
}

class ProductivityController {
  async getTasks(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const tasks = await productivityService.getTasks(studentId);
      return sendSuccess(res, tasks);
    } catch (err) {
      next(err);
    }
  }

  async createTask(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { title, category, priority, durationMinutes, dueDate } = req.body;
      if (!title) {
        return sendError(res, "Task title is required", 400);
      }
      const task = await productivityService.createTask(studentId, {
        title,
        category,
        priority,
        durationMinutes,
        dueDate,
      });
      return sendSuccess(res, task, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { id } = req.params;
      const { completed } = req.body;
      const result = await productivityService.updateTask(studentId, id, { completed });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async recordFocusSession(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { durationMinutes, sessionMode } = req.body;
      const result = await productivityService.recordFocusSession(studentId, {
        durationMinutes: durationMinutes || 25,
        sessionMode: sessionMode || "work",
      });
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductivityController();
