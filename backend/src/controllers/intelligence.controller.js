const studentIntelligenceService = require("../services/studentIntelligence.service");
const { sendSuccess, sendError } = require("../utils/response");

function resolveStudentId(req) {
  if (req.user?.id) return req.user.id;
  if (req.user?.student?.id) return req.user.student.id;
  if (req.user?.profile?.role === "admin" && (req.query?.studentId || req.body?.studentId)) {
    return req.query?.studentId || req.body?.studentId;
  }
  return req.query?.studentId || req.body?.studentId || "00000000-0000-0000-0000-000000000001";
}

class IntelligenceController {
  async getTopicMastery(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const masteryMap = await studentIntelligenceService.getTopicMasteryMap(studentId);
      return sendSuccess(res, masteryMap);
    } catch (err) {
      next(err);
    }
  }

  async getNextBestActions(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const actions = await studentIntelligenceService.getNextBestActions(studentId);
      return sendSuccess(res, actions);
    } catch (err) {
      next(err);
    }
  }

  async completeNextBestAction(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { id } = req.params;
      const result = await studentIntelligenceService.completeNextBestAction(studentId, id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async setRevisionInterval(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { topicId } = req.params;
      const { intervalDays } = req.body;
      const result = await studentIntelligenceService.setRevisionInterval(studentId, topicId, parseInt(intervalDays, 10) || 3);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new IntelligenceController();
