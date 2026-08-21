const express = require("express");
const router = express.Router();
const roadmapController = require("../controllers/roadmap.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");

// Roadmap Item operations
router.get("/:roadmapId/items", authenticate, roadmapController.getRoadmapItems);
router.post("/:roadmapId/items", authenticate, roadmapController.createRoadmapItem);

// Individual Roadmap Operations
router.get("/detail/:roadmapId", authenticate, roadmapController.getRoadmapById);
router.put("/:roadmapId", authenticate, roadmapController.updateRoadmap);
router.delete("/:roadmapId", authenticate, roadmapController.deleteRoadmap);

// Student Roadmaps Endpoints
router.get("/:studentId", authenticate, requireStudentOwnership("studentId"), roadmapController.getRoadmapsByStudentId);
router.post("/:studentId", authenticate, requireStudentOwnership("studentId"), roadmapController.createRoadmap);

module.exports = router;
