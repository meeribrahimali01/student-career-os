const codingResourcesService = require("../services/codingResources.service");
const { sendSuccess, sendError } = require("../utils/response");

function resolveStudentId(req) {
  if (req.user?.id) return req.user.id;
  if (req.user?.student?.id) return req.user.student.id;
  if (req.user?.profile?.role === "admin" && (req.query.studentId || req.body.studentId)) {
    return req.query.studentId || req.body.studentId;
  }
  return req.query.studentId || req.body.studentId || "00000000-0000-0000-0000-000000000001";
}

class CodingResourcesController {
  async getCodingProblems(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const problems = await codingResourcesService.getCodingProblems(studentId);
      return sendSuccess(res, problems);
    } catch (err) {
      next(err);
    }
  }

  async updateProblemStatus(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return sendError(res, "Status is required (solved | attempted | bookmarked)", 400);
      }
      const result = await codingResourcesService.updateProblemStatus(studentId, id, status);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CodingResourcesController();
