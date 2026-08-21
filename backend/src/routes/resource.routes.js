const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resource.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

// Public Study Resources Discovery
router.get("/", resourceController.getResources);
router.get("/:id", resourceController.getResourceById);

// Resource Management (Protected for Admin / Faculty)
router.post("/", authenticate, requireRole("admin", "faculty"), resourceController.createResource);
router.put("/:id", authenticate, requireRole("admin", "faculty"), resourceController.updateResource);
router.delete("/:id", authenticate, requireRole("admin", "faculty"), resourceController.deleteResource);

module.exports = router;
