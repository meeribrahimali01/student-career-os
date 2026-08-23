const curriculumService = require("../services/curriculum.service");
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

class CurriculumController {
  async getCurriculum(req, res, next) {
    try {
      const curriculum = await curriculumService.getCurriculum();
      return sendSuccess(res, curriculum);
    } catch (err) {
      next(err);
    }
  }

  async getQuestionsByTopic(req, res, next) {
    try {
      const { topicId } = req.params;
      const questions = await curriculumService.getQuestionsByTopic(topicId);
      return sendSuccess(res, questions);
    } catch (err) {
      next(err);
    }
  }

  async getStudyResources(req, res, next) {
    try {
      const topicId = req.params.topicId || req.query.topicId || "All";
      const resources = await curriculumService.getStudyResources(topicId);
      return sendSuccess(res, resources);
    } catch (err) {
      next(err);
    }
  }

  async submitQuestionAttempt(req, res, next) {
    try {
      const studentId = resolveStudentId(req);
      const { questionId, topicId, selectedAnswer, timeSeconds } = req.body;

      if (!topicId || selectedAnswer === undefined) {
        return sendError(res, "topicId and selectedAnswer are required", 400);
      }

      const result = await studentIntelligenceService.recordQuestionAttempt(studentId, {
        questionId: questionId || "q_generic",
        topicId,
        selectedAnswer,
        timeSeconds: timeSeconds || 30,
      });

      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CurriculumController();
