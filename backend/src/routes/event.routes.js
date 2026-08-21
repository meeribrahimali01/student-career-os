const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");
const { requireRole } = require("../middleware/role.middleware");

// Public Event Listings
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

// Student Event Registrations Endpoints (Protected with Ownership)
router.get("/:eventId/registrations", authenticate, eventController.getEventRegistrations);
router.post("/:eventId/register", authenticate, requireStudentOwnership("student_id"), eventController.registerStudentForEvent);
router.delete("/:eventId/register/:studentId", authenticate, requireStudentOwnership("studentId"), eventController.cancelEventRegistration);

// Event Management (Protected for Admin / Faculty / Placement Officers)
router.post("/", authenticate, requireRole("admin", "faculty", "placement_officer"), eventController.createEvent);
router.put("/:id", authenticate, requireRole("admin", "faculty", "placement_officer"), eventController.updateEvent);
router.delete("/:id", authenticate, requireRole("admin", "faculty", "placement_officer"), eventController.deleteEvent);

module.exports = router;
