const skillService = require("../services/skill.service");
const { sendSuccess, sendError } = require("../utils/response");
const { isValidUUID } = require("../utils/validator");

/**
 * Skill Controller - Handles request validation and responses for Master Skills Catalog
 */
class SkillController {
    async getAllSkills(req, res, next) {
        try {
            const { category } = req.query;
            const validCategories = ["programming", "technical", "communication", "aptitude", "soft_skills", "domain"];

            if (category && !validCategories.includes(category)) {
                return sendError(res, `Invalid category. Allowed: ${validCategories.join(", ")}`, 400);
            }

            const skills = await skillService.getAllSkills(category);
            return sendSuccess(res, skills);
        } catch (err) {
            next(err);
        }
    }

    async getSkillById(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid skill ID format", 400);
            }

            const skill = await skillService.getSkillById(id);
            if (!skill) {
                return sendError(res, "Skill not found", 404);
            }

            return sendSuccess(res, skill);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SkillController();
