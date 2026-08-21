/**
 * Standardized Response Helpers for CareerOS REST API
 */

const sendSuccess = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data,
    });
};

const sendCreated = (res, data, message = "Resource created successfully") => {
    return res.status(201).json({
        success: true,
        message,
        data,
    });
};

const sendError = (res, message = "An error occurred", statusCode = 500, errors = null) => {
    const payload = {
        success: false,
        message,
    };
    if (errors) {
        payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
};

module.exports = {
    sendSuccess,
    sendCreated,
    sendError,
};
