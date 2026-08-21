const dashboardService = require("../services/dashboard.service");
const { sendSuccess, sendError } = require("../utils/response");
const { isValidUUID } = require("../utils/validator");

/**
 * Dashboard Controller - Handles requests and responses for Dashboard Aggregation API
 */
class DashboardController {
    async getStudentDashboard(req, res, next) {
        try {
            const { studentId } = req.params;
            if (!isValidUUID(studentId)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const dashboard = await dashboardService.getStudentDashboard(studentId);
            return sendSuccess(res, dashboard);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DashboardController();
