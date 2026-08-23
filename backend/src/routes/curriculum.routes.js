const express = require("express");
const router = express.Router();
const curriculumController = require("../controllers/curriculum.controller");
const { optionalAuthenticate } = require("../middleware/auth.middleware");

router.get("/curriculum", (req, res, next) => curriculumController.getCurriculum(req, res, next));
router.get("/resources", (req, res, next) => curriculumController.getStudyResources(req, res, next));
router.get("/resources/:topicId", (req, res, next) => curriculumController.getStudyResources(req, res, next));
router.get("/questions/:topicId", (req, res, next) => curriculumController.getQuestionsByTopic(req, res, next));
router.post("/questions/attempt", optionalAuthenticate, (req, res, next) => curriculumController.submitQuestionAttempt(req, res, next));

module.exports = router;
