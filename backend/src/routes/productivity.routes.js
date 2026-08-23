const express = require("express");
const router = express.Router();
const productivityController = require("../controllers/productivity.controller");
const { optionalAuthenticate } = require("../middleware/auth.middleware");

router.get("/tasks", optionalAuthenticate, (req, res, next) => productivityController.getTasks(req, res, next));
router.post("/tasks", optionalAuthenticate, (req, res, next) => productivityController.createTask(req, res, next));
router.patch("/tasks/:id", optionalAuthenticate, (req, res, next) => productivityController.updateTask(req, res, next));
router.post("/focus-session", optionalAuthenticate, (req, res, next) => productivityController.recordFocusSession(req, res, next));

module.exports = router;
