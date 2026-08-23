const express = require("express");
const router = express.Router();
const intelligenceController = require("../controllers/intelligence.controller");
const { optionalAuthenticate } = require("../middleware/auth.middleware");

router.get("/mastery", optionalAuthenticate, (req, res, next) => intelligenceController.getTopicMastery(req, res, next));
router.get("/next-actions", optionalAuthenticate, (req, res, next) => intelligenceController.getNextBestActions(req, res, next));
router.post("/next-actions/:id/complete", optionalAuthenticate, (req, res, next) => intelligenceController.completeNextBestAction(req, res, next));
router.post("/revisions/:topicId/schedule", optionalAuthenticate, (req, res, next) => intelligenceController.setRevisionInterval(req, res, next));

module.exports = router;
