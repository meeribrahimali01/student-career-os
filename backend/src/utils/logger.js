/**
 * Safe Request Logger Utility for CareerOS Backend
 * 
 * Never logs:
 * - Authorization header / JWTs
 * - Passwords or service-role keys
 * - Resume binaries or private student info
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const statusColor = status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";
        const resetColor = "\x1b[0m";

        if (process.env.NODE_ENV !== "test") {
            console.log(`[HTTP] ${method} ${originalUrl} ${statusColor}${status}${resetColor} - ${duration}ms`);
        }
    });

    next();
};

module.exports = {
    requestLogger,
};
