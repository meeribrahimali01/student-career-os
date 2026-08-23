const studentService = require("../services/student.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isNumberInRange } = require("../utils/validator");

/**
 * Student Controller - Handles request validation and responses for Student endpoints
 */
class StudentController {
    async getMyProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            const email = req.user?.email || "";
            const fullName = req.user?.profile?.full_name || email.split("@")[0];

            if (!userId) {
                return sendError(res, "Unauthorized", 401);
            }

            const student = await studentService.getOrCreateStudentByUserId(userId, email, fullName);
            return sendSuccess(res, student);
        } catch (err) {
            next(err);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return sendError(res, "Unauthorized", 401);
            }

            const updated = await studentService.updateProfileAndStudent(userId, req.body || {});
            return sendSuccess(res, updated, 200);
        } catch (err) {
            next(err);
        }
    }

    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const student = await studentService.getStudentById(id);
            if (!student) {
                return sendError(res, "Student not found", 404);
            }

            return sendSuccess(res, student);
        } catch (err) {
            next(err);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const { current_cgpa, semester, graduation_year, placement_status } = req.body;

            if (current_cgpa !== undefined && !isNumberInRange(current_cgpa, 0, 10)) {
                return sendError(res, "CGPA must be a valid number between 0.00 and 10.00", 400);
            }

            if (semester !== undefined && !isNumberInRange(semester, 1, 12)) {
                return sendError(res, "Semester must be between 1 and 12", 400);
            }

            if (graduation_year !== undefined && !isNumberInRange(graduation_year, 2000, 2100)) {
                return sendError(res, "Graduation year must be between 2000 and 2100", 400);
            }

            if (placement_status !== undefined && !["unplaced", "seeking", "placed", "opted_out"].includes(placement_status)) {
                return sendError(res, "Invalid placement status value", 400);
            }

            const updated = await studentService.updateStudent(id, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async getStudentSkills(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const skills = await studentService.getStudentSkills(studentId);
            return sendSuccess(res, skills);
        } catch (err) {
            next(err);
        }
    }

    async addStudentSkill(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["skill_id"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            if (!isValidUUID(req.body.skill_id)) {
                return sendError(res, "Invalid skill ID format", 400);
            }

            const { proficiency_level } = req.body;
            if (proficiency_level && !["beginner", "intermediate", "advanced", "expert"].includes(proficiency_level)) {
                return sendError(res, "Invalid proficiency level. Allowed: beginner, intermediate, advanced, expert", 400);
            }

            const newStudentSkill = await studentService.addStudentSkill(studentId, req.body);
            return sendCreated(res, newStudentSkill, "Skill added to student profile successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateStudentSkill(req, res, next) {
        try {
            const { studentId, skillId } = req.params;
            if (!isValidUUID(studentId) || !isValidUUID(skillId)) {
                return sendError(res, "Invalid ID format", 400);
            }

            const { proficiency_level } = req.body;
            if (proficiency_level && !["beginner", "intermediate", "advanced", "expert"].includes(proficiency_level)) {
                return sendError(res, "Invalid proficiency level. Allowed: beginner, intermediate, advanced, expert", 400);
            }

            const updated = await studentService.updateStudentSkill(studentId, skillId, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteStudentSkill(req, res, next) {
        try {
            const { studentId, skillId } = req.params;
            if (!isValidUUID(studentId) || !isValidUUID(skillId)) {
                return sendError(res, "Invalid ID format", 400);
            }

            await studentService.deleteStudentSkill(studentId, skillId);
            return sendSuccess(res, { message: "Skill removed from student profile successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new StudentController();
