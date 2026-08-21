/**
 * Module-level test runner for AI Career Intelligence Engine (ai/ directory)
 */

import {
  analyzeCareerGap,
  generateCareerIntelligence,
  generateCareerRoadmap,
} from "./career-gap-analyzer.mjs";

const sampleStudent = {
  name: "Rahul",
  year: 2,
  branch: "CSE",
  cgpa: 8.2,
  careerGoal: "Software Developer",
  skills: ["C", "Java"],
  interests: ["Web Development"],
};

async function run() {
  console.log("Running Career Intelligence test inside ai/ module...");
  const gap = await analyzeCareerGap(sampleStudent);
  const intelligence = await generateCareerIntelligence(sampleStudent, gap);

  console.log("Overall Score:", intelligence.readiness.overallScore);
  console.log("Biggest Improvement Area:", intelligence.readiness.biggestImprovementArea);
  console.log("Skill Gaps:", intelligence.skillGaps.length);
  console.log("Roadmap Phases:", intelligence.roadmap.length);
  console.log("Projects:", intelligence.projects.length);
  console.log("Next Action:", intelligence.nextAction.title);
  console.log("Data Completeness:", intelligence.dataQuality.profileCompleteness + "%");
  console.log("Test completed successfully.");
}

run().catch(console.error);
