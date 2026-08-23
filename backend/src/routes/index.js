const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const curriculumRoutes = require("./curriculum.routes");
const intelligenceRoutes = require("./intelligence.routes");
const productivityRoutes = require("./productivity.routes");
const codingResourcesRoutes = require("./codingResources.routes");
const academicRoutes = require("./academic.routes");
const skillRoutes = require("./skill.routes");
const roadmapItemRoutes = require("./roadmapItem.routes");
const roadmapRoutes = require("./roadmap.routes");
const studentRoutes = require("./student.routes");
const resourceRoutes = require("./resource.routes");
const eventRoutes = require("./event.routes");
const placementRoutes = require("./placement.routes");
const resumeRoutes = require("./resume.routes");
const communicationRoutes = require("./communication.routes");
const dashboardRoutes = require("./dashboard.routes");
const aiRoutes = require("./ai.routes");

// 1. Auth Routes
router.use("/auth", authRoutes);

// 2. Specialized Non-Parameterized Routes First (Prevents /:studentId matching /mastery or /curriculum)
router.use("/roadmaps", curriculumRoutes);
router.use("/students", intelligenceRoutes);
router.use("/dashboard", intelligenceRoutes);
router.use("/resources", codingResourcesRoutes);
router.use("/productivity", productivityRoutes);

// 3. Parameterized & Core Domain Routes
router.use("/students", studentRoutes);
router.use("/academics", academicRoutes);
router.use("/skills", skillRoutes);
router.use("/roadmaps", roadmapRoutes);
router.use("/roadmap-items", roadmapItemRoutes);
router.use("/resources", resourceRoutes);
router.use("/events", eventRoutes);
router.use("/placements", placementRoutes);
router.use("/resumes", resumeRoutes);
router.use("/communication", communicationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
