const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { handleOptionalResumeUpload } = require("../middleware/upload.middleware");
const { createRateLimiter } = require("../middleware/rateLimit.middleware");

// Dedicated rate limiter for AI operations (30 requests/minute per client)
const aiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: "AI request limit exceeded. Please wait a moment before initiating more AI analyses.",
});

router.use(aiRateLimiter);
router.use(authenticate);

// 1. AI Resume Parser
router.post("/resume/parse", handleOptionalResumeUpload, aiController.parseResume);

// 2. AI Skill Gap Analyzer
router.post("/skill-gap", aiController.analyzeSkillGap);

// 3. AI Mock Interview Question Generator
router.post("/interview/generate", aiController.generateMockInterview);

// 4. AI Interview Answer Evaluator
router.post("/interview/evaluate", aiController.evaluateInterviewAnswer);

module.exports = router;
