const express = require("express");
const router = express.Router();
const communicationController = require("../controllers/communication.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");

// Specific Session View (Protected)
router.get("/sessions/:sessionId", authenticate, communicationController.getSessionById);

// Student Communication Sessions Endpoints (Protected with Ownership)
router.get("/:studentId/sessions", authenticate, requireStudentOwnership("studentId"), communicationController.getSessionsByStudentId);
router.post("/:studentId/sessions", authenticate, requireStudentOwnership("studentId"), communicationController.createSession);

module.exports = router;
