const communicationService = require("../services/communication.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isNumberInRange, isNonNegativeNumber } = require("../utils/validator");

/**
 * Communication Controller - Handles requests and responses for Communication practice sessions
 */
class CommunicationController {
    async getSessionsByStudentId(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const sessions = await communicationService.getSessionsByStudentId(studentId);
            return sendSuccess(res, sessions);
        } catch (err) {
            next(err);
        }
    }

    async getSessionById(req, res, next) {
        try {
            const { sessionId } = req.params;
            if (!isValidUUID(sessionId)) {
                return sendError(res, "Invalid session ID format", 400);
            }

            const session = await communicationService.getSessionById(sessionId);
            if (!session) {
                return sendError(res, "Communication session not found", 404);
            }

            return sendSuccess(res, session);
        } catch (err) {
            next(err);
        }
    }

    async createSession(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["session_type", "topic"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { session_type, score, duration_seconds, status } = req.body;
            const validTypes = ["hr_interview", "technical_interview", "speaking_practice", "communication_exercise", "aptitude_discussion"];
            const validStatuses = ["in_progress", "completed", "abandoned"];

            if (!validTypes.includes(session_type)) {
                return sendError(res, `Invalid session_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (status && !validStatuses.includes(status)) {
                return sendError(res, `Invalid status. Allowed: ${validStatuses.join(", ")}`, 400);
            }

            if (score !== undefined && !isNumberInRange(score, 0, 100)) {
                return sendError(res, "Score must be between 0.00 and 100.00", 400);
            }

            if (duration_seconds !== undefined && !isNonNegativeNumber(duration_seconds)) {
                return sendError(res, "duration_seconds cannot be negative", 400);
            }

            const newSession = await communicationService.createSession(studentId, req.body);
            return sendCreated(res, newSession, "Communication session logged successfully");
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CommunicationController();
