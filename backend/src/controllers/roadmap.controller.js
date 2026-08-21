const roadmapService = require("../services/roadmap.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isValidDate, isNonNegativeNumber } = require("../utils/validator");

/**
 * Roadmap Controller - Handles request validation and responses for Roadmaps & Items
 */
class RoadmapController {
    async getRoadmapsByStudentId(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const roadmaps = await roadmapService.getRoadmapsByStudentId(studentId);
            return sendSuccess(res, roadmaps);
        } catch (err) {
            next(err);
        }
    }

    async getRoadmapById(req, res, next) {
        try {
            const { roadmapId } = req.params;
            if (!isValidUUID(roadmapId)) {
                return sendError(res, "Invalid roadmap ID format", 400);
            }

            const roadmap = await roadmapService.getRoadmapById(roadmapId);
            if (!roadmap) {
                return sendError(res, "Roadmap not found", 404);
            }

            return sendSuccess(res, roadmap);
        } catch (err) {
            next(err);
        }
    }

    async createRoadmap(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["title", "career_goal"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { status, start_date, target_date } = req.body;
            if (status && !["not_started", "in_progress", "completed", "paused", "archived"].includes(status)) {
                return sendError(res, "Invalid status value", 400);
            }

            if (start_date && !isValidDate(start_date)) {
                return sendError(res, "Invalid start_date format", 400);
            }

            if (target_date && !isValidDate(target_date)) {
                return sendError(res, "Invalid target_date format", 400);
            }

            const newRoadmap = await roadmapService.createRoadmap(studentId, req.body);
            return sendCreated(res, newRoadmap, "Roadmap created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateRoadmap(req, res, next) {
        try {
            const { roadmapId } = req.params;
            if (!isValidUUID(roadmapId)) {
                return sendError(res, "Invalid roadmap ID format", 400);
            }

            const { status, start_date, target_date } = req.body;
            if (status && !["not_started", "in_progress", "completed", "paused", "archived"].includes(status)) {
                return sendError(res, "Invalid status value", 400);
            }

            if (start_date && !isValidDate(start_date)) {
                return sendError(res, "Invalid start_date format", 400);
            }

            if (target_date && !isValidDate(target_date)) {
                return sendError(res, "Invalid target_date format", 400);
            }

            const updated = await roadmapService.updateRoadmap(roadmapId, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteRoadmap(req, res, next) {
        try {
            const { roadmapId } = req.params;
            if (!isValidUUID(roadmapId)) {
                return sendError(res, "Invalid roadmap ID format", 400);
            }

            await roadmapService.deleteRoadmap(roadmapId);
            return sendSuccess(res, { message: "Roadmap deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    async getRoadmapItems(req, res, next) {
        try {
            const { roadmapId } = req.params;
            if (!isValidUUID(roadmapId)) {
                return sendError(res, "Invalid roadmap ID format", 400);
            }

            const items = await roadmapService.getRoadmapItems(roadmapId);
            return sendSuccess(res, items);
        } catch (err) {
            next(err);
        }
    }

    async createRoadmapItem(req, res, next) {
        try {
            const { roadmapId } = req.params;
            if (!isValidUUID(roadmapId)) {
                return sendError(res, "Invalid roadmap ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["title"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { status, priority, sequence_order, due_date } = req.body;
            if (status && !["pending", "in_progress", "completed", "skipped"].includes(status)) {
                return sendError(res, "Invalid status value", 400);
            }

            if (priority && !["low", "medium", "high", "critical"].includes(priority)) {
                return sendError(res, "Invalid priority value", 400);
            }

            if (sequence_order !== undefined && !isNonNegativeNumber(sequence_order)) {
                return sendError(res, "sequence_order must be a positive number", 400);
            }

            if (due_date && !isValidDate(due_date)) {
                return sendError(res, "Invalid due_date format", 400);
            }

            const newItem = await roadmapService.createRoadmapItem(roadmapId, req.body);
            return sendCreated(res, newItem, "Roadmap item created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateRoadmapItem(req, res, next) {
        try {
            const { itemId } = req.params;
            if (!isValidUUID(itemId)) {
                return sendError(res, "Invalid item ID format", 400);
            }

            const { status, priority, sequence_order, due_date } = req.body;
            if (status && !["pending", "in_progress", "completed", "skipped"].includes(status)) {
                return sendError(res, "Invalid status value", 400);
            }

            if (priority && !["low", "medium", "high", "critical"].includes(priority)) {
                return sendError(res, "Invalid priority value", 400);
            }

            if (sequence_order !== undefined && !isNonNegativeNumber(sequence_order)) {
                return sendError(res, "sequence_order must be a positive number", 400);
            }

            if (due_date && !isValidDate(due_date)) {
                return sendError(res, "Invalid due_date format", 400);
            }

            const updated = await roadmapService.updateRoadmapItem(itemId, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteRoadmapItem(req, res, next) {
        try {
            const { itemId } = req.params;
            if (!isValidUUID(itemId)) {
                return sendError(res, "Invalid item ID format", 400);
            }

            await roadmapService.deleteRoadmapItem(itemId);
            return sendSuccess(res, { message: "Roadmap item deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new RoadmapController();
