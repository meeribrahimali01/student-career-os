/**
 * Role-Based Authorization Middleware for CareerOS
 * 
 * Usage:
 * router.post("/admin-only", authenticate, requireRole("admin"), controllerMethod);
 * router.post("/placement-officer-or-admin", authenticate, requireRole("admin", "placement_officer"), controllerMethod);
 */
const { sendError } = require("../utils/response");

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return sendError(res, "Authentication required", 401);
        }

        const userRole = req.user.profile?.role || "student";

        if (!allowedRoles.includes(userRole)) {
            return sendError(res, `Forbidden: Requires one of [${allowedRoles.join(", ")}] roles`, 403);
        }

        next();
    };
};

module.exports = {
    requireRole,
};
