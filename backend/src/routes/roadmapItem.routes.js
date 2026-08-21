const express = require("express");
const router = express.Router();
const roadmapController = require("../controllers/roadmap.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Roadmap Item Individual Operations
router.put("/:itemId", authenticate, roadmapController.updateRoadmapItem);
router.delete("/:itemId", authenticate, roadmapController.deleteRoadmapItem);

module.exports = router;
