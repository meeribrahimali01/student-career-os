/**
 * Lightweight Validation Utility for CareerOS
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (id) => {
    return typeof id === "string" && UUID_REGEX.test(id);
};

const validateRequiredFields = (data, requiredFields) => {
    const missing = [];
    for (const field of requiredFields) {
        if (data[field] === undefined || data[field] === null || data[field] === "") {
            missing.push(field);
        }
    }
    return missing;
};

const isNonNegativeNumber = (val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
};

const isNumberInRange = (val, min, max) => {
    const num = Number(val);
    return !isNaN(num) && num >= min && num <= max;
};

const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

module.exports = {
    isValidUUID,
    validateRequiredFields,
    isNonNegativeNumber,
    isNumberInRange,
    isValidDate,
};
