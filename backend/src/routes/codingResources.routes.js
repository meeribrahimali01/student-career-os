const express = require("express");
const router = express.Router();
const codingResourcesController = require("../controllers/codingResources.controller");
const { optionalAuthenticate } = require("../middleware/auth.middleware");

router.get("/coding-problems", optionalAuthenticate, (req, res, next) => codingResourcesController.getCodingProblems(req, res, next));
router.post("/coding-problems/:id/status", optionalAuthenticate, (req, res, next) => codingResourcesController.updateProblemStatus(req, res, next));

module.exports = router;
