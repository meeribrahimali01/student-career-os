/**
 * Supabase Authentication Middleware for CareerOS
 *
 * Flow:
 * Frontend -> Supabase Auth -> JWT -> Authorization: Bearer <token> -> Middleware -> req.user
 */
const supabase = require("../config/supabase");
const authService = require("../services/auth.service");
const { sendError } = require("../utils/response");

/**
 * Enforce valid Supabase JWT authentication
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendError(res, "Authentication required: Missing or invalid Authorization header", 401);
        }

        const token = authHeader.split(" ")[1];
        if (!token || token.trim() === "") {
            return sendError(res, "Authentication required: Empty token provided", 401);
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return sendError(res, "Unauthorized: Invalid or expired authentication token", 401);
        }

        // Fetch user profile and student mapping
        const profile = await authService.getUserProfile(user.id);
        const student = await authService.getStudentByProfileId(user.id);

        req.user = {
            id: user.id,
            email: user.email,
            profile: profile || { role: "student" },
            student: student || null,
        };

        next();
    } catch (err) {
        next(err);
    }
};

/**
 * Optional authentication: Populates req.user if valid token exists, proceeds regardless
 */
const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            if (token) {
                const { data: { user } } = await supabase.auth.getUser(token);
                if (user) {
                    const profile = await authService.getUserProfile(user.id);
                    const student = await authService.getStudentByProfileId(user.id);
                    req.user = {
                        id: user.id,
                        email: user.email,
                        profile: profile || { role: "student" },
                        student: student || null,
                    };
                }
            }
        }
        next();
    } catch (err) {
        next();
    }
};

module.exports = {
    authenticate,
    optionalAuthenticate,
};
