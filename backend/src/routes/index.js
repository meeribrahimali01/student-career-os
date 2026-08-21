const express = require("express");
const router = express.Router();

const studentRoutes = require("./student.routes");
const academicRoutes = require("./academic.routes");
const skillRoutes = require("./skill.routes");
const roadmapRoutes = require("./roadmap.routes");
const roadmapItemRoutes = require("./roadmapItem.routes");
const resourceRoutes = require("./resource.routes");
const eventRoutes = require("./event.routes");
const placementRoutes = require("./placement.routes");
const resumeRoutes = require("./resume.routes");
const communicationRoutes = require("./communication.routes");
const dashboardRoutes = require("./dashboard.routes");

// Mount Module Routers
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

module.exports = router;
