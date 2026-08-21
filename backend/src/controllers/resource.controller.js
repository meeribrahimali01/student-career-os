const resourceService = require("../services/resource.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields } = require("../utils/validator");

/**
 * Resource Controller - Handles request validation and responses for Study Resources
 */
class ResourceController {
    async getResources(req, res, next) {
        try {
            const { category, type, difficulty, search } = req.query;
            const resources = await resourceService.getResources({ category, type, difficulty, search });
            return sendSuccess(res, resources);
        } catch (err) {
            next(err);
        }
    }

    async getResourceById(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid resource ID format", 400);
            }

            const resource = await resourceService.getResourceById(id);
            if (!resource) {
                return sendError(res, "Study resource not found", 404);
            }

            return sendSuccess(res, resource);
        } catch (err) {
            next(err);
        }
    }

    async createResource(req, res, next) {
        try {
            const missing = validateRequiredFields(req.body, ["title", "resource_type", "url", "category"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { resource_type, category, difficulty } = req.body;
            const validTypes = ["article", "video", "course", "documentation", "practice_material", "interview_prep", "aptitude", "book"];
            const validCategories = ["programming", "technical", "aptitude", "communication", "interview_prep", "general"];
            const validDifficulties = ["beginner", "intermediate", "advanced", "all_levels"];

            if (!validTypes.includes(resource_type)) {
                return sendError(res, `Invalid resource_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (!validCategories.includes(category)) {
                return sendError(res, `Invalid category. Allowed: ${validCategories.join(", ")}`, 400);
            }

            if (difficulty && !validDifficulties.includes(difficulty)) {
                return sendError(res, `Invalid difficulty. Allowed: ${validDifficulties.join(", ")}`, 400);
            }

            const newResource = await resourceService.createResource(req.body);
            return sendCreated(res, newResource, "Study resource created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateResource(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid resource ID format", 400);
            }

            const { resource_type, category, difficulty } = req.body;
            const validTypes = ["article", "video", "course", "documentation", "practice_material", "interview_prep", "aptitude", "book"];
            const validCategories = ["programming", "technical", "aptitude", "communication", "interview_prep", "general"];
            const validDifficulties = ["beginner", "intermediate", "advanced", "all_levels"];

            if (resource_type && !validTypes.includes(resource_type)) {
                return sendError(res, `Invalid resource_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (category && !validCategories.includes(category)) {
                return sendError(res, `Invalid category. Allowed: ${validCategories.join(", ")}`, 400);
            }

            if (difficulty && !validDifficulties.includes(difficulty)) {
                return sendError(res, `Invalid difficulty. Allowed: ${validDifficulties.join(", ")}`, 400);
            }

            const updated = await resourceService.updateResource(id, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteResource(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid resource ID format", 400);
            }

            await resourceService.deleteResource(id);
            return sendSuccess(res, { message: "Study resource deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ResourceController();
