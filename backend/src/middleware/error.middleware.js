/**
 * Central Error Handling Middleware for CareerOS REST API
 */
const { sendError } = require("../utils/response");

const errorMiddleware = (err, req, res, next) => {
    // If response was already sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
    let message = err.message || "Internal Server Error";

    // Handle Supabase/PostgREST specific error codes
    if (err.code === "23505") { // unique_violation
        statusCode = 409;
        message = "A record with these unique details already exists.";
    } else if (err.code === "23503") { // foreign_key_violation
        statusCode = 400;
        message = "Referenced parent record does not exist or has invalid relations.";
    } else if (err.code === "23514") { // check_violation
        statusCode = 400;
        message = "The provided data violates field constraints.";
    } else if (err.code === "22P02") { // invalid_text_representation
        statusCode = 400;
        message = "Invalid format provided for one or more fields.";
    } else if (err.code === "PGRST116") { // single row not found
        statusCode = 404;
        message = "The requested resource was not found.";
    }

    return sendError(res, message, statusCode, err.errors || null);
};

module.exports = errorMiddleware;
