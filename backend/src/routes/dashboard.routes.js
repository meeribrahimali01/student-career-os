const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");

// Student Career & Placement Dashboard Aggregation Endpoint
router.get(
    "/:studentId",
    authenticate,
    requireStudentOwnership("studentId"),
    dashboardController.getStudentDashboard
);

module.exports = router;
