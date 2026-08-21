const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");
const { handleResumeUpload } = require("../middleware/upload.middleware");

// Detailed Resume View
router.get("/detail/:resumeId", authenticate, resumeController.getResumeDetailById);

// Resume Metadata / Storage Delete & Update
router.put("/:resumeId", authenticate, resumeController.updateResume);
router.delete("/:resumeId", authenticate, resumeController.deleteResume);

// Student Resume Upload (Supabase Storage + Database Metadata)
router.post(
    "/:studentId/upload",
    authenticate,
    requireStudentOwnership("studentId"),
    handleResumeUpload,
    resumeController.uploadResume
);

// Student Resumes Endpoints
router.get("/:studentId", authenticate, requireStudentOwnership("studentId"), resumeController.getResumesByStudentId);
router.post("/:studentId", authenticate, requireStudentOwnership("studentId"), resumeController.createResume);

module.exports = router;
