const express = require("express");
const router = express.Router();
const placementController = require("../controllers/placement.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");
const { requireRole } = require("../middleware/role.middleware");

// Public Placement Listings
router.get("/", placementController.getPlacementOpportunities);
router.get("/:id", placementController.getPlacementOpportunityById);

// Student Placement Applications Endpoints (Protected with Ownership)
router.get("/applications/:studentId", authenticate, requireStudentOwnership("studentId"), placementController.getApplicationsByStudentId);
router.post("/:placementId/apply", authenticate, requireStudentOwnership("student_id"), placementController.applyForPlacement);
router.put("/applications/:applicationId", authenticate, placementController.updatePlacementApplication);

// Placement Opportunity Management (Protected for Admin / Placement Officers)
router.post("/", authenticate, requireRole("admin", "placement_officer"), placementController.createPlacementOpportunity);
router.put("/:id", authenticate, requireRole("admin", "placement_officer"), placementController.updatePlacementOpportunity);
router.delete("/:id", authenticate, requireRole("admin", "placement_officer"), placementController.deletePlacementOpportunity);

module.exports = router;
