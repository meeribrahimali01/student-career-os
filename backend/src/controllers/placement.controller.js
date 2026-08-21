const placementService = require("../services/placement.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isValidDate } = require("../utils/validator");

/**
 * Placement Controller - Handles request validation and responses for Placements & Applications
 */
class PlacementController {
    async getPlacementOpportunities(req, res, next) {
        try {
            const { status, employment_type, search } = req.query;
            const opportunities = await placementService.getPlacementOpportunities({ status, employment_type, search });
            return sendSuccess(res, opportunities);
        } catch (err) {
            next(err);
        }
    }

    async getPlacementOpportunityById(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid placement opportunity ID format", 400);
            }

            const opportunity = await placementService.getPlacementOpportunityById(id);
            if (!opportunity) {
                return sendError(res, "Placement opportunity not found", 404);
            }

            return sendSuccess(res, opportunity);
        } catch (err) {
            next(err);
        }
    }

    async createPlacementOpportunity(req, res, next) {
        try {
            const missing = validateRequiredFields(req.body, ["company_name", "role_title"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { employment_type, status, application_deadline } = req.body;
            const validTypes = ["full_time", "internship", "internship_to_full_time", "contract"];
            const validStatuses = ["draft", "active", "closed", "cancelled"];

            if (employment_type && !validTypes.includes(employment_type)) {
                return sendError(res, `Invalid employment_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (status && !validStatuses.includes(status)) {
                return sendError(res, `Invalid status. Allowed: ${validStatuses.join(", ")}`, 400);
            }

            if (application_deadline && !isValidDate(application_deadline)) {
                return sendError(res, "Invalid application_deadline format", 400);
            }

            const newOpportunity = await placementService.createPlacementOpportunity(req.body);
            return sendCreated(res, newOpportunity, "Placement opportunity created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updatePlacementOpportunity(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid placement opportunity ID format", 400);
            }

            const { employment_type, status, application_deadline } = req.body;
            const validTypes = ["full_time", "internship", "internship_to_full_time", "contract"];
            const validStatuses = ["draft", "active", "closed", "cancelled"];

            if (employment_type && !validTypes.includes(employment_type)) {
                return sendError(res, `Invalid employment_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (status && !validStatuses.includes(status)) {
                return sendError(res, `Invalid status. Allowed: ${validStatuses.join(", ")}`, 400);
            }

            if (application_deadline && !isValidDate(application_deadline)) {
                return sendError(res, "Invalid application_deadline format", 400);
            }

            const updated = await placementService.updatePlacementOpportunity(id, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deletePlacementOpportunity(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid placement opportunity ID format", 400);
            }

            await placementService.deletePlacementOpportunity(id);
            return sendSuccess(res, { message: "Placement opportunity deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    async getApplicationsByStudentId(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const applications = await placementService.getApplicationsByStudentId(studentId);
            return sendSuccess(res, applications);
        } catch (err) {
            next(err);
        }
    }

    async applyForPlacement(req, res, next) {
        try {
            const { placementId } = req.params;
            if (!isValidUUID(placementId)) {
                return sendError(res, "Invalid placement ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["student_id"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            if (!isValidUUID(req.body.student_id)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const application = await placementService.applyForPlacement(placementId, req.body.student_id, req.body);
            return sendCreated(res, application, "Applied for placement opportunity successfully");
        } catch (err) {
            next(err);
        }
    }

    async updatePlacementApplication(req, res, next) {
        try {
            const { applicationId } = req.params;
            if (!isValidUUID(applicationId)) {
                return sendError(res, "Invalid application ID format", 400);
            }

            const { application_status, interview_date } = req.body;
            const validStatuses = ["applied", "screening", "shortlisted", "interviewing", "offered", "rejected", "withdrawn"];

            if (application_status && !validStatuses.includes(application_status)) {
                return sendError(res, `Invalid application_status. Allowed: ${validStatuses.join(", ")}`, 400);
            }

            if (interview_date && !isValidDate(interview_date)) {
                return sendError(res, "Invalid interview_date format", 400);
            }

            const updated = await placementService.updatePlacementApplication(applicationId, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PlacementController();
