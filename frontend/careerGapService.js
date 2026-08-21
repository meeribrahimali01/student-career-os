/**
 * AI Career Intelligence Engine - Frontend Integration Service
 * 
 * For Member 1 (Frontend):
 * This service provides ready-to-use methods for calling the full AI Career Intelligence Engine,
 * Career Gap Analyzer, and Career Roadmap from frontend UI components (React, Vue, Next.js, or Vanilla JS)
 * without exposing any secret Gemini API keys.
 * 
 * Handles transient 503 / 429 errors automatically with 3 exponential backoff retries.
 */

import {
  analyzeCareerGap,
  generateCareerRoadmap,
  generateCareerIntelligence,
  normalizeStudentProfile,
  validateCareerGapAnalysis,
  validateCareerRoadmap,
  validateCareerIntelligenceReport,
  computeSmartReadinessScore,
  buildDetailedSkillGaps,
  buildAdaptiveRoadmap,
  buildProjectRecommendations,
  buildLearningPlan,
  buildDailyNextAction,
  buildPortfolioAdvice,
  buildInterviewPreparation,
  assessDataQuality,
  isTransientError,
  AIUnavailableError,
  AIClientError,
  createCareerGapStore,
  createCareerRoadmapStore,
  createCareerIntelligenceStore,
} from "../ai/career-gap-analyzer.mjs";

export {
  analyzeCareerGap,
  generateCareerRoadmap,
  generateCareerIntelligence,
  normalizeStudentProfile,
  validateCareerGapAnalysis,
  validateCareerRoadmap,
  validateCareerIntelligenceReport,
  computeSmartReadinessScore,
  buildDetailedSkillGaps,
  buildAdaptiveRoadmap,
  buildProjectRecommendations,
  buildLearningPlan,
  buildDailyNextAction,
  buildPortfolioAdvice,
  buildInterviewPreparation,
  assessDataQuality,
  isTransientError,
  AIUnavailableError,
  AIClientError,
  createCareerGapStore,
  createCareerRoadmapStore,
  createCareerIntelligenceStore,
};

export default {
  analyzeCareerGap,
  generateCareerRoadmap,
  generateCareerIntelligence,
};
