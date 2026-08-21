const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");

// Public Master Skills Catalog Endpoints
router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSkillById);

module.exports = router;
