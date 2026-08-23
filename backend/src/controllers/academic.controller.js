const academicService = require("../services/academic.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isNumberInRange, isNonNegativeNumber } = require("../utils/validator");

/**
 * Academic Controller - Handles request validation and responses for Academic endpoints
 */
class AcademicController {
    async getRecordsByStudentId(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const records = await academicService.getRecordsByStudentId(studentId);
            return sendSuccess(res, records);
        } catch (err) {
            next(err);
        }
    }

    async createRecord(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["semester", "academic_year"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { semester, sgpa, cgpa_at_time, percentage, backlogs_count, credits_earned } = req.body;

            if (!isNumberInRange(semester, 1, 12)) {
                return sendError(res, "Semester must be between 1 and 12", 400);
            }

            if (sgpa !== undefined && !isNumberInRange(sgpa, 0, 10)) {
                return sendError(res, "SGPA must be between 0.00 and 10.00", 400);
            }

            if (cgpa_at_time !== undefined && !isNumberInRange(cgpa_at_time, 0, 10)) {
                return sendError(res, "CGPA must be between 0.00 and 10.00", 400);
            }

            if (percentage !== undefined && !isNumberInRange(percentage, 0, 100)) {
                return sendError(res, "Percentage must be between 0.00 and 100.00", 400);
            }

            if (backlogs_count !== undefined && !isNonNegativeNumber(backlogs_count)) {
                return sendError(res, "Backlogs count cannot be negative", 400);
            }

            if (credits_earned !== undefined && !isNonNegativeNumber(credits_earned)) {
                return sendError(res, "Credits earned cannot be negative", 400);
            }

            const newRecord = await academicService.createRecord(studentId, req.body);
            return sendCreated(res, newRecord, "Academic record created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateRecord(req, res, next) {
        try {
            const { recordId } = req.params;
            if (!isValidUUID(recordId)) {
                return sendError(res, "Invalid record ID format", 400);
            }

            const { semester, sgpa, cgpa_at_time, percentage, backlogs_count, credits_earned } = req.body;

            if (semester !== undefined && !isNumberInRange(semester, 1, 12)) {
                return sendError(res, "Semester must be between 1 and 12", 400);
            }

            if (sgpa !== undefined && !isNumberInRange(sgpa, 0, 10)) {
                return sendError(res, "SGPA must be between 0.00 and 10.00", 400);
            }

            if (cgpa_at_time !== undefined && !isNumberInRange(cgpa_at_time, 0, 10)) {
                return sendError(res, "CGPA must be between 0.00 and 10.00", 400);
            }

            if (percentage !== undefined && !isNumberInRange(percentage, 0, 100)) {
                return sendError(res, "Percentage must be between 0.00 and 100.00", 400);
            }

            if (backlogs_count !== undefined && !isNonNegativeNumber(backlogs_count)) {
                return sendError(res, "Backlogs count cannot be negative", 400);
            }

            if (credits_earned !== undefined && !isNonNegativeNumber(credits_earned)) {
                return sendError(res, "Credits earned cannot be negative", 400);
            }

            const updated = await academicService.updateRecord(recordId, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteRecord(req, res, next) {
        try {
            const { recordId } = req.params;
            if (!isValidUUID(recordId)) {
                return sendError(res, "Invalid record ID format", 400);
            }

            await academicService.deleteRecord(recordId);
            return sendSuccess(res, { message: "Academic record deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    async getSubjectGrades(req, res, next) {
        try {
            const studentId = req.user?.student?.id || req.user?.id || req.query.studentId || "00000000-0000-0000-0000-000000000001";
            const semester = parseInt(req.query.semester, 10) || 5;
            const grades = await academicService.getSubjectGrades(studentId, semester);
            return sendSuccess(res, grades);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AcademicController();
