const resumeService = require("../services/resume.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isNumberInRange } = require("../utils/validator");

/**
 * Resume Controller - Handles metadata and file upload requests for Resumes
 */
class ResumeController {
    async getResumesByStudentId(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const resumes = await resumeService.getResumesByStudentId(studentId);
            return sendSuccess(res, resumes);
        } catch (err) {
            next(err);
        }
    }

    async getResumeDetailById(req, res, next) {
        try {
            const { resumeId } = req.params;
            if (!isValidUUID(resumeId)) {
                return sendError(res, "Invalid resume ID format", 400);
            }

            const resume = await resumeService.getResumeDetailById(resumeId);
            if (!resume) {
                return sendError(res, "Resume not found", 404);
            }

            return sendSuccess(res, resume);
        } catch (err) {
            next(err);
        }
    }

    async uploadResume(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            if (!req.file) {
                return sendError(res, "Resume file is required", 400);
            }

            const is_primary = req.body.is_primary === "true" || req.body.is_primary === true;
            const resume_title = req.body.resume_title || req.file.originalname;

            const newResume = await resumeService.uploadResumeFile(studentId, req.file, {
                is_primary,
                resume_title,
            });

            return sendCreated(res, newResume, "Resume uploaded to storage and metadata saved successfully");
        } catch (err) {
            next(err);
        }
    }

    async createResume(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["file_path"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { version, parsing_status, analysis_status } = req.body;

            if (version !== undefined && !isNumberInRange(version, 1, 100)) {
                return sendError(res, "Version must be a positive integer", 400);
            }

            const validParsingStatuses = ["pending", "processing", "completed", "failed"];
            if (parsing_status && !validParsingStatuses.includes(parsing_status)) {
                return sendError(res, `Invalid parsing_status. Allowed: ${validParsingStatuses.join(", ")}`, 400);
            }

            const validAnalysisStatuses = ["unprocessed", "analyzed", "failed"];
            if (analysis_status && !validAnalysisStatuses.includes(analysis_status)) {
                return sendError(res, `Invalid analysis_status. Allowed: ${validAnalysisStatuses.join(", ")}`, 400);
            }

            const newResume = await resumeService.createResume(studentId, req.body);
            return sendCreated(res, newResume, "Resume metadata created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateResume(req, res, next) {
        try {
            const { resumeId } = req.params;
            if (!isValidUUID(resumeId)) {
                return sendError(res, "Invalid resume ID format", 400);
            }

            const { version, parsing_status, analysis_status } = req.body;

            if (version !== undefined && !isNumberInRange(version, 1, 100)) {
                return sendError(res, "Version must be a positive integer", 400);
            }

            const validParsingStatuses = ["pending", "processing", "completed", "failed"];
            if (parsing_status && !validParsingStatuses.includes(parsing_status)) {
                return sendError(res, `Invalid parsing_status. Allowed: ${validParsingStatuses.join(", ")}`, 400);
            }

            const validAnalysisStatuses = ["unprocessed", "analyzed", "failed"];
            if (analysis_status && !validAnalysisStatuses.includes(analysis_status)) {
                return sendError(res, `Invalid analysis_status. Allowed: ${validAnalysisStatuses.join(", ")}`, 400);
            }

            const updated = await resumeService.updateResume(resumeId, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteResume(req, res, next) {
        try {
            const { resumeId } = req.params;
            if (!isValidUUID(resumeId)) {
                return sendError(res, "Invalid resume ID format", 400);
            }

            await resumeService.deleteResume(resumeId);
            return sendSuccess(res, { message: "Resume and storage object deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ResumeController();
