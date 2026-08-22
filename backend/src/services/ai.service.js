const { GoogleGenAI } = require("@google/genai");
const env = require("../config/env");

/**
 * Centralized AI Service for CareerOS
 * 
 * Powered by Google Gemini via the official @google/genai SDK.
 * Handles:
 * 1. AI Resume Parsing (Multimodal PDF/DOC/Text extraction)
 * 2. AI Skill Gap Analysis (Gap analysis against target career roles)
 * 3. AI Mock Interview Generation & Feedback
 */
class AIService {
    constructor() {
        this.apiKey = env.GEMINI_API_KEY;
        this.modelName = env.GEMINI_MODEL || "gemini-2.5-flash";
        this._client = null;
    }

    /**
     * Lazy initialization of the GoogleGenAI client
     */
    getClient() {
        if (!this.apiKey || this.apiKey.trim() === "" || this.apiKey === "your_gemini_api_key") {
            const err = new Error("Gemini API key is not configured or invalid on the server.");
            err.statusCode = 503;
            throw err;
        }

        if (!this._client) {
            this._client = new GoogleGenAI({ apiKey: this.apiKey });
        }
        return this._client;
    }

    /**
     * Safely parse JSON from model response text
     */
    _cleanAndParseJSON(rawText) {
        if (!rawText || typeof rawText !== "string") {
            throw new Error("Empty response received from Gemini.");
        }

        let cleaned = rawText.trim();
        // Remove markdown code fences if present
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```\s*/i, "").replace(/```\s*$/i, "");
        }

        try {
            return JSON.parse(cleaned.trim());
        } catch (err) {
            throw new Error(`Failed to parse AI output as JSON: ${err.message}`);
        }
    }

    /**
     * 1. AI Resume Parser
     * Extracts structured profile, education, skills, experience, and projects.
     */
    async parseResume({ fileBuffer, mimeType = "application/pdf", textContent = null }) {
        const client = this.getClient();

        const promptText = `
You are an expert AI Technical Recruiter and Resume Parser.
Analyze the provided resume document and extract comprehensive structured information.

Return ONLY a valid JSON object matching this exact schema:
{
  "profile": {
    "full_name": "Full name or empty string",
    "email": "Email address or empty string",
    "phone": "Phone number or empty string",
    "location": "Location/City/Country or empty string",
    "summary": "Professional summary or objective",
    "linkedin": "LinkedIn URL or empty string",
    "github": "GitHub URL or empty string",
    "portfolio": "Portfolio/Website URL or empty string"
  },
  "education": [
    {
      "degree": "Degree name (e.g. B.Tech in Computer Science)",
      "institution": "College/University name",
      "graduation_year": 2026,
      "score_or_cgpa": "8.5 CGPA or 85%"
    }
  ],
  "skills": [
    {
      "name": "Skill name (e.g. Node.js, Python, PostgreSQL)",
      "category": "programming | technical | communication | aptitude | soft_skills | domain",
      "proficiency": "beginner | intermediate | advanced | expert"
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "role": "Job/Internship title",
      "location": "Location",
      "start_date": "Start date",
      "end_date": "End date or Present",
      "is_current": false,
      "description_points": ["Key accomplishment 1", "Key accomplishment 2"]
    }
  ],
  "projects": [
    {
      "title": "Project title",
      "description": "Brief description of the project",
      "technologies_used": ["React", "Express", "PostgreSQL"],
      "link": "Project repo/live link if present"
    }
  ],
  "certifications": [
    {
      "title": "Certificate name",
      "issuer": "Issuing organization",
      "issue_date": "Date if present"
    }
  ],
  "achievements": [
    "Achievement point 1",
    "Achievement point 2"
  ]
}

Ensure all extracted skill names are standardized.
`;

        const contents = [];

        if (fileBuffer) {
            contents.push({
                inlineData: {
                    data: fileBuffer.toString("base64"),
                    mimeType: mimeType || "application/pdf",
                },
            });
        } else if (textContent) {
            contents.push({
                text: `Resume Text:\n${textContent}`,
            });
        } else {
            throw new Error("No resume file buffer or text content provided for parsing.");
        }

        contents.push({ text: promptText });

        const response = await client.models.generateContent({
            model: this.modelName,
            contents,
            config: {
                responseMimeType: "application/json",
            },
        });

        return this._cleanAndParseJSON(response.text);
    }

    /**
     * 2. AI Skill Gap Analyzer
     * Evaluates student's background against a target role and recommends actions.
     */
    async analyzeSkillGap({
        studentProfile = {},
        currentSkills = [],
        academicRecords = [],
        roadmaps = [],
        targetRole = "Software Engineer",
        resumeData = null,
    }) {
        const client = this.getClient();

        const context = {
            target_role: targetRole,
            student: {
                college: studentProfile.college || "N/A",
                course: studentProfile.course || "N/A",
                branch: studentProfile.branch || "N/A",
                semester: studentProfile.semester || "N/A",
                cgpa: studentProfile.current_cgpa || "N/A",
            },
            current_skills: currentSkills.map((s) => ({
                name: s.skill?.name || s.name,
                category: s.skill?.category || s.category,
                proficiency: s.proficiency_level || s.proficiency || "intermediate",
            })),
            academic_summary: academicRecords.map((a) => ({
                semester: a.semester,
                sgpa: a.sgpa,
            })),
            active_roadmaps: roadmaps.map((r) => ({
                title: r.title,
                career_goal: r.career_goal,
                status: r.status,
            })),
            resume_parsed: resumeData || null,
        };

        const promptText = `
You are a senior Technical Career Advisor and Industry Skill Gap Analyst for College Students.
Analyze the following student profile and their current skills against the target industry role: "${targetRole}".

Candidate Data:
${JSON.stringify(context, null, 2)}

Provide a thorough, realistic, and highly actionable skill gap analysis.

Return ONLY a valid JSON object matching this exact schema:
{
  "target_role": "${targetRole}",
  "match_score": 75.5,
  "priority": "high",
  "identified_skills": [
    { "name": "Skill name", "category": "programming", "proficiency": "intermediate" }
  ],
  "missing_skills": [
    { "name": "Skill name", "category": "technical", "importance": "critical | high | medium", "reason": "Why needed for ${targetRole}" }
  ],
  "recommended_skills": [
    { "name": "Skill name", "priority": "high | medium | low", "suggested_timeframe": "2-4 weeks" }
  ],
  "strengths": [
    "Strength point 1",
    "Strength point 2"
  ],
  "skill_gaps": [
    "Description of critical gap 1",
    "Description of gap 2"
  ],
  "recommendations": "Detailed paragraph with actionable advice on what projects to build, topics to study, and certifications to prioritize.",
  "roadmap_suggestions": [
    {
      "step": 1,
      "title": "Milestone title",
      "description": "Concrete action items",
      "target_weeks": 2
    }
  ],
  "analysis_metadata": {
    "evaluation_version": "gemini_v1",
    "role_alignment_index": 80,
    "market_demand_rating": "Very High"
  }
}

Constraints:
- "match_score" must be a float between 0.00 and 100.00.
- "priority" must be one of: "low", "medium", "high".
- "identified_skills", "missing_skills", "recommended_skills" must be non-null arrays.
`;

        const response = await client.models.generateContent({
            model: this.modelName,
            contents: [{ text: promptText }],
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsed = this._cleanAndParseJSON(response.text);

        // Ensure constraint compliance
        if (typeof parsed.match_score !== "number" || parsed.match_score < 0 || parsed.match_score > 100) {
            parsed.match_score = Math.min(100, Math.max(0, Number(parsed.match_score) || 50.0));
        }
        if (!["low", "medium", "high"].includes(parsed.priority)) {
            parsed.priority = "medium";
        }

        return parsed;
    }

    /**
     * 3. AI Mock Interview Generator
     * Generates structured role-specific interview questions.
     */
    async generateMockInterview({
        targetRole = "Software Engineer",
        interviewType = "technical",
        difficulty = "intermediate",
        questionCount = 5,
        studentProfile = {},
        studentSkills = [],
    }) {
        const client = this.getClient();

        const candidateContext = {
            target_role: targetRole,
            interview_type: interviewType,
            difficulty,
            skills: studentSkills.map((s) => s.skill?.name || s.name || s),
            branch: studentProfile.branch || "Computer Science",
            semester: studentProfile.semester || 6,
        };

        const promptText = `
You are an expert technical interviewer and hiring manager conducting a mock interview for a university student.
Target Role: "${targetRole}"
Interview Type: "${interviewType}" (technical, hr, behavioral, or aptitude)
Difficulty Level: "${difficulty}" (beginner, intermediate, advanced)
Number of Questions: ${questionCount}

Candidate Background:
${JSON.stringify(candidateContext, null, 2)}

Generate realistic, high-impact interview questions tailored to the candidate and role.

Return ONLY a valid JSON object matching this exact schema:
{
  "role": "${targetRole}",
  "interview_type": "${interviewType}",
  "difficulty": "${difficulty}",
  "total_questions": ${questionCount},
  "questions": [
    {
      "id": 1,
      "question": "The interview question text",
      "category": "Core Concept / Problem Solving / Behavioral",
      "difficulty": "${difficulty}",
      "rationale": "Why this question is asked for this role",
      "key_points_to_cover": [
        "Key point 1",
        "Key point 2"
      ],
      "sample_answer_outline": "Brief outline of a strong answer"
    }
  ]
}
`;

        const response = await client.models.generateContent({
            model: this.modelName,
            contents: [{ text: promptText }],
            config: {
                responseMimeType: "application/json",
            },
        });

        return this._cleanAndParseJSON(response.text);
    }

    /**
     * 4. AI Interview Feedback Evaluator
     * Scores and provides actionable feedback on an answered interview question.
     */
    async evaluateInterviewAnswer({
        question,
        studentAnswer,
        targetRole = "Software Engineer",
        interviewType = "technical",
    }) {
        const client = this.getClient();

        const promptText = `
You are an expert Interview Coach.
Evaluate the following student's response to an interview question.

Target Role: ${targetRole}
Interview Type: ${interviewType}
Question: "${question}"
Student Answer: "${studentAnswer}"

Provide structured evaluation with a constructive tone.

Return ONLY a valid JSON object matching this exact schema:
{
  "score": 85.0,
  "verdict": "Strong / Needs Improvement / Satisfactory",
  "feedback": {
    "strengths": ["Clear communication", "Correct terminology"],
    "improvements": ["Could explain time complexity", "Add concrete example"],
    "clarity_score": 85,
    "technical_accuracy_score": 90,
    "communication_score": 80,
    "ideal_response_summary": "Summary of what would make a 100% response"
  }
}

Constraints:
- "score" must be a float between 0.00 and 100.00.
`;

        const response = await client.models.generateContent({
            model: this.modelName,
            contents: [{ text: promptText }],
            config: {
                responseMimeType: "application/json",
            },
        });

        const parsed = this._cleanAndParseJSON(response.text);
        if (typeof parsed.score !== "number" || parsed.score < 0 || parsed.score > 100) {
            parsed.score = Math.min(100, Math.max(0, Number(parsed.score) || 70.0));
        }

        return parsed;
    }
}

module.exports = new AIService();
