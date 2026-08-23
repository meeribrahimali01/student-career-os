const express = require("express");
const router = express.Router();
const academicController = require("../controllers/academic.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { requireStudentOwnership } = require("../middleware/ownership.middleware");

// Gradebook & Normalized Courses
router.get("/grades", academicController.getSubjectGrades);

// Student Academic Records Endpoints (Protected with Student Ownership)
router.get("/:studentId", authenticate, requireStudentOwnership("studentId"), academicController.getRecordsByStudentId);
router.post("/:studentId", authenticate, requireStudentOwnership("studentId"), academicController.createRecord);

// Record Specific Operations (Protected)
router.put("/:recordId", authenticate, academicController.updateRecord);
router.delete("/:recordId", authenticate, academicController.deleteRecord);

module.exports = router;
