const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const { authenticate, optionalAuthenticate } = require("../middleware/auth.middleware");
const { handleOptionalResumeUpload } = require("../middleware/upload.middleware");
const { createRateLimiter } = require("../middleware/rateLimit.middleware");

// Dedicated rate limiter for AI operations (30 requests/minute per client)
const aiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: "AI request limit exceeded. Please wait a moment before initiating more AI analyses.",
});

router.use(aiRateLimiter);

// 1. AI Resume Parser (Authenticated)
router.post("/resume/parse", authenticate, handleOptionalResumeUpload, aiController.parseResume);

// 2. AI Skill Gap Analyzer (Authenticated)
router.post("/skill-gap", authenticate, aiController.analyzeSkillGap);

// 3. AI Mock Interview Question Generator (Supports Authenticated and Optional)
router.post("/interview/generate", optionalAuthenticate, aiController.generateMockInterview);

// 4. AI Interview Answer Evaluator (Supports Authenticated and Optional)
router.post("/interview/evaluate", optionalAuthenticate, aiController.evaluateInterviewAnswer);

module.exports = router;
