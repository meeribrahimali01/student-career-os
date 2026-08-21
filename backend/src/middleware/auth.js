const supabase = require("../config/supabase");

/**
 * Authentication Middleware
 * Validates Supabase JWT from the Authorization Bearer header
 */
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing or invalid Authorization header",
            });
        }

        const token = authHeader.split(" ")[1];
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or expired token",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    requireAuth,
};
