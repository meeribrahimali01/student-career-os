/**
 * Student Ownership Verification Middleware for CareerOS
 * 
 * Ensures that an authenticated student cannot view, modify, or delete
 * data belonging to another student unless they possess administrative privileges.
 */
const { sendError } = require("../utils/response");
const authService = require("../services/auth.service");

/**
 * Factory middleware to check ownership based on parameter key (default: 'studentId' or 'id')
 */
const requireStudentOwnership = (paramKey = "studentId") => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return sendError(res, "Authentication required", 401);
            }

            const targetStudentId = req.params[paramKey] || req.body[paramKey];

            if (!targetStudentId) {
                return next();
            }

            const isAuthorized = await authService.checkStudentOwnership(req.user, targetStudentId);

            if (!isAuthorized) {
                return sendError(res, "Forbidden: You do not have permission to access or modify this student's data", 403);
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = {
    requireStudentOwnership,
};
