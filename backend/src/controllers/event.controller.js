const eventService = require("../services/event.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isValidDate, isNonNegativeNumber } = require("../utils/validator");

/**
 * Event Controller - Handles request validation and responses for Events & Registrations
 */
class EventController {
    async getEvents(req, res, next) {
        try {
            const { event_type, search } = req.query;
            const events = await eventService.getEvents({ event_type, search });
            return sendSuccess(res, events);
        } catch (err) {
            next(err);
        }
    }

    async getEventById(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid event ID format", 400);
            }

            const event = await eventService.getEventById(id);
            if (!event) {
                return sendError(res, "Event not found", 404);
            }

            return sendSuccess(res, event);
        } catch (err) {
            next(err);
        }
    }

    async createEvent(req, res, next) {
        try {
            const missing = validateRequiredFields(req.body, ["title", "event_type", "organizer", "event_date"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            const { event_type, venue_type, event_date, end_date, registration_deadline, max_participants } = req.body;
            const validTypes = ["hackathon", "workshop", "seminar", "placement_drive", "coding_contest", "career_fair", "webinar"];

            if (!validTypes.includes(event_type)) {
                return sendError(res, `Invalid event_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (venue_type && !["online", "offline", "hybrid"].includes(venue_type)) {
                return sendError(res, "Invalid venue_type. Allowed: online, offline, hybrid", 400);
            }

            if (!isValidDate(event_date)) {
                return sendError(res, "Invalid event_date format", 400);
            }

            if (end_date && !isValidDate(end_date)) {
                return sendError(res, "Invalid end_date format", 400);
            }

            if (registration_deadline && !isValidDate(registration_deadline)) {
                return sendError(res, "Invalid registration_deadline format", 400);
            }

            if (max_participants !== undefined && !isNonNegativeNumber(max_participants)) {
                return sendError(res, "max_participants must be a positive number", 400);
            }

            const newEvent = await eventService.createEvent(req.body);
            return sendCreated(res, newEvent, "Event created successfully");
        } catch (err) {
            next(err);
        }
    }

    async updateEvent(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid event ID format", 400);
            }

            const { event_type, venue_type, event_date, end_date, registration_deadline, max_participants } = req.body;
            const validTypes = ["hackathon", "workshop", "seminar", "placement_drive", "coding_contest", "career_fair", "webinar"];

            if (event_type && !validTypes.includes(event_type)) {
                return sendError(res, `Invalid event_type. Allowed: ${validTypes.join(", ")}`, 400);
            }

            if (venue_type && !["online", "offline", "hybrid"].includes(venue_type)) {
                return sendError(res, "Invalid venue_type. Allowed: online, offline, hybrid", 400);
            }

            if (event_date && !isValidDate(event_date)) {
                return sendError(res, "Invalid event_date format", 400);
            }

            if (end_date && !isValidDate(end_date)) {
                return sendError(res, "Invalid end_date format", 400);
            }

            if (registration_deadline && !isValidDate(registration_deadline)) {
                return sendError(res, "Invalid registration_deadline format", 400);
            }

            if (max_participants !== undefined && !isNonNegativeNumber(max_participants)) {
                return sendError(res, "max_participants must be a positive number", 400);
            }

            const updated = await eventService.updateEvent(id, req.body);
            return sendSuccess(res, updated);
        } catch (err) {
            next(err);
        }
    }

    async deleteEvent(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidUUID(id)) {
                return sendError(res, "Invalid event ID format", 400);
            }

            await eventService.deleteEvent(id);
            return sendSuccess(res, { message: "Event deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    async getEventRegistrations(req, res, next) {
        try {
            const { eventId } = req.params;
            if (!isValidUUID(eventId)) {
                return sendError(res, "Invalid event ID format", 400);
            }

            const registrations = await eventService.getEventRegistrations(eventId);
            return sendSuccess(res, registrations);
        } catch (err) {
            next(err);
        }
    }

    async registerStudentForEvent(req, res, next) {
        try {
            const { eventId } = req.params;
            if (!isValidUUID(eventId)) {
                return sendError(res, "Invalid event ID format", 400);
            }

            const missing = validateRequiredFields(req.body, ["student_id"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            if (!isValidUUID(req.body.student_id)) {
                return sendError(res, "Invalid student ID format", 400);
            }

            const registration = await eventService.registerStudentForEvent(eventId, req.body.student_id);
            return sendCreated(res, registration, "Registered for event successfully");
        } catch (err) {
            next(err);
        }
    }

    async cancelEventRegistration(req, res, next) {
        try {
            const { eventId, studentId } = req.params;
            if (!isValidUUID(eventId) || !isValidUUID(studentId)) {
                return sendError(res, "Invalid ID format", 400);
            }

            await eventService.cancelEventRegistration(eventId, studentId);
            return sendSuccess(res, { message: "Event registration cancelled successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new EventController();
