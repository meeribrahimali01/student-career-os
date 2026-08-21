/**
 * Lightweight In-Memory Rate Limiting Middleware for CareerOS
 * 
 * Configurable for general routes and sensitive AI/upload routes.
 */
const { sendError } = require("../utils/response");

const createRateLimiter = ({
    windowMs = 60 * 1000, // 1 minute window
    maxRequests = 100,    // max 100 requests per window
    message = "Too many requests, please try again later."
} = {}) => {
    const hits = new Map();

    // Clean up expired entries every 5 minutes
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of hits.entries()) {
            if (now - record.startTime > windowMs) {
                hits.delete(key);
            }
        }
    }, 5 * 60 * 1000).unref();

    return (req, res, next) => {
        const clientKey = req.ip || req.headers["x-forwarded-for"] || "global";
        const now = Date.now();

        let clientRecord = hits.get(clientKey);

        if (!clientRecord || (now - clientRecord.startTime > windowMs)) {
            clientRecord = {
                count: 1,
                startTime: now,
            };
            hits.set(clientKey, clientRecord);
            return next();
        }

        clientRecord.count++;

        if (clientRecord.count > maxRequests) {
            res.setHeader("Retry-After", Math.ceil((windowMs - (now - clientRecord.startTime)) / 1000));
            return sendError(res, message, 429);
        }

        next();
    };
};

module.exports = {
    createRateLimiter,
};
