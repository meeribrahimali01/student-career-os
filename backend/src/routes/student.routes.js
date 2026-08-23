const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");

// Authenticated Student Identity & Profile Endpoints
router.get("/profile/me", authenticate, studentController.getMyProfile);
router.put("/profile/me", authenticate, studentController.updateMyProfile);

// Student Skills Junction Endpoints (Protected with Student Ownership)
router.get("/:studentId/skills", authenticate, requireStudentOwnership("studentId"), studentController.getStudentSkills);
router.post("/:studentId/skills", authenticate, requireStudentOwnership("studentId"), studentController.addStudentSkill);
router.put("/:studentId/skills/:skillId", authenticate, requireStudentOwnership("studentId"), studentController.updateStudentSkill);
router.delete("/:studentId/skills/:skillId", authenticate, requireStudentOwnership("studentId"), studentController.deleteStudentSkill);

// Student Profile Specific ID Endpoints (Protected with Student Ownership)
router.get("/:id", authenticate, requireStudentOwnership("id"), studentController.getStudentById);
router.put("/:id", authenticate, requireStudentOwnership("id"), studentController.updateStudent);

module.exports = router;
