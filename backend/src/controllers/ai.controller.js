const aiService = require("../services/ai.service");
const supabase = require("../config/supabase");
const storageService = require("../services/storage.service");
const authService = require("../services/auth.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");
const { isValidUUID, validateRequiredFields, isNumberInRange } = require("../utils/validator");

/**
 * AI Controller - Request handling and orchestration for Gemini AI features
 */
class AIController {
    /**
     * POST /api/ai/resume/parse
     * Parses an uploaded resume file or an existing stored resume record
     */
    async parseResume(req, res, next) {
        try {
            const studentId = req.body.student_id || req.body.studentId || req.user?.student?.id;
            const resumeId = req.body.resume_id || req.body.resumeId;

            // Validate student ownership if studentId is provided
            if (studentId) {
                if (!isValidUUID(studentId)) {
                    return sendError(res, "Invalid student ID format", 400);
                }
                const isAuthorized = await authService.checkStudentOwnership(req.user, studentId);
                if (!isAuthorized) {
                    return sendError(res, "Forbidden: Unauthorized student access", 403);
                }
            }

            let fileBuffer = null;
            let mimeType = "application/pdf";
            let targetResumeRecord = null;

            // Case A: File uploaded directly in this request
            if (req.file) {
                fileBuffer = req.file.buffer;
                mimeType = req.file.mimetype;
            }
            // Case B: Parse existing resume by resumeId from Supabase Storage
            else if (resumeId) {
                if (!isValidUUID(resumeId)) {
                    return sendError(res, "Invalid resume ID format", 400);
                }

                const { data: resume, error: resumeErr } = await supabase
                    .from("resumes")
                    .select("*")
                    .eq("id", resumeId)
                    .single();

                if (resumeErr || !resume) {
                    return sendError(res, "Resume record not found", 404);
                }

                // Check student ownership for this resume
                const isAuthorized = await authService.checkStudentOwnership(req.user, resume.student_id);
                if (!isAuthorized) {
                    return sendError(res, "Forbidden: Unauthorized access to this resume", 403);
                }

                targetResumeRecord = resume;
                fileBuffer = await storageService.downloadFile(storageService.resumeBucket, resume.file_path);
                mimeType = resume.file_path.endsWith(".docx")
                    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    : resume.file_path.endsWith(".doc")
                    ? "application/msword"
                    : "application/pdf";
            }
            // Case C: Raw resume text
            else if (req.body.resume_text) {
                const parsedData = await aiService.parseResume({ textContent: req.body.resume_text });
                return sendSuccess(res, {
                    resume_id: null,
                    parsed: parsedData,
                });
            } else {
                return sendError(res, "Please provide a resume file, a resume_id, or resume_text to parse.", 400);
            }

            // Call Gemini AI parser
            const parsedData = await aiService.parseResume({ fileBuffer, mimeType });

            // If a database record exists or is associated with a student, update the metadata
            if (targetResumeRecord) {
                await supabase
                    .from("resumes")
                    .update({
                        parsed_data: parsedData,
                        parsing_status: "completed",
                    })
                    .eq("id", targetResumeRecord.id);
            }

            return sendSuccess(res, {
                resume_id: targetResumeRecord?.id || null,
                parsed: parsedData,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/ai/skill-gap
     * Performs AI Skill Gap Analysis against a target role and persists the analysis
     */
    async analyzeSkillGap(req, res, next) {
        try {
            const studentId = req.body.student_id || req.body.studentId || req.user?.student?.id;
            const targetRole = req.body.target_role || req.body.targetRole;
            const resumeId = req.body.resume_id || req.body.resumeId || null;

            if (!studentId || !isValidUUID(studentId)) {
                return sendError(res, "Valid student_id is required", 400);
            }

            if (!targetRole || typeof targetRole !== "string" || targetRole.trim() === "") {
                return sendError(res, "target_role is required (e.g. 'Full Stack Developer', 'Data Scientist')", 400);
            }

            if (resumeId && !isValidUUID(resumeId)) {
                return sendError(res, "Invalid resume_id format", 400);
            }

            // Verify ownership
            const isAuthorized = await authService.checkStudentOwnership(req.user, studentId);
            if (!isAuthorized) {
                return sendError(res, "Forbidden: Unauthorized student access", 403);
            }

            // 1. Fetch student data from Supabase
            const [studentRes, skillsRes, academicsRes, roadmapsRes, resumeRes] = await Promise.all([
                supabase.from("students").select("*, profile:profiles(*)").eq("id", studentId).single(),
                supabase.from("student_skills").select("*, skill:skills(*)").eq("student_id", studentId),
                supabase.from("academic_records").select("*").eq("student_id", studentId).order("semester", { ascending: true }),
                supabase.from("roadmaps").select("*, items:roadmap_items(*)").eq("student_id", studentId),
                resumeId ? supabase.from("resumes").select("*").eq("id", resumeId).single() : Promise.resolve({ data: null })
            ]);

            if (studentRes.error || !studentRes.data) {
                return sendError(res, "Student profile not found", 404);
            }

            const studentProfile = studentRes.data;
            const currentSkills = skillsRes.data || [];
            const academicRecords = academicsRes.data || [];
            const roadmaps = roadmapsRes.data || [];
            const resumeData = resumeRes.data?.parsed_data || null;

            // 2. Call Gemini AI skill gap analyzer
            const analysisResult = await aiService.analyzeSkillGap({
                studentProfile,
                currentSkills,
                academicRecords,
                roadmaps,
                targetRole: targetRole.trim(),
                resumeData,
            });

            // 3. Persist to public.skill_gap_analysis table
            const { data: savedAnalysis, error: saveErr } = await supabase
                .from("skill_gap_analysis")
                .insert({
                    student_id: studentId,
                    resume_id: resumeId,
                    target_role: targetRole.trim(),
                    identified_skills: analysisResult.identified_skills || [],
                    missing_skills: analysisResult.missing_skills || [],
                    recommended_skills: analysisResult.recommended_skills || [],
                    match_score: analysisResult.match_score,
                    priority: analysisResult.priority || "medium",
                    recommendations: analysisResult.recommendations || "",
                    analysis_metadata: {
                        strengths: analysisResult.strengths || [],
                        skill_gaps: analysisResult.skill_gaps || [],
                        roadmap_suggestions: analysisResult.roadmap_suggestions || [],
                        evaluated_at: new Date().toISOString(),
                    },
                })
                .select("*")
                .single();

            if (saveErr) {
                console.warn("[SKILL_GAP DB WARNING] Failed to persist analysis to database:", saveErr.message);
            }

            return sendCreated(res, {
                analysis_id: savedAnalysis?.id || null,
                ...analysisResult,
            }, "Skill gap analysis completed and saved successfully");
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/ai/interview/generate
     * Generates personalized mock interview questions
     */
    async generateMockInterview(req, res, next) {
        try {
            const studentId = req.body.student_id || req.body.studentId || req.user?.student?.id;
            const targetRole = req.body.target_role || req.body.targetRole || "Software Engineer";
            const interviewType = req.body.interview_type || req.body.interviewType || "technical";
            const difficulty = req.body.difficulty || "intermediate";
            const questionCount = Number(req.body.question_count || req.body.questionCount) || 5;

            const validInterviewTypes = ["technical", "hr", "behavioral", "aptitude", "system_design"];
            if (!validInterviewTypes.includes(interviewType)) {
                return sendError(res, `Invalid interview_type. Allowed: ${validInterviewTypes.join(", ")}`, 400);
            }

            const validDifficulties = ["beginner", "intermediate", "advanced"];
            if (!validDifficulties.includes(difficulty)) {
                return sendError(res, `Invalid difficulty. Allowed: ${validDifficulties.join(", ")}`, 400);
            }

            if (!isNumberInRange(questionCount, 1, 15)) {
                return sendError(res, "question_count must be between 1 and 15", 400);
            }

            let studentProfile = {};
            let studentSkills = [];

            if (studentId && isValidUUID(studentId)) {
                const [sRes, skRes] = await Promise.all([
                    supabase.from("students").select("*").eq("id", studentId).single(),
                    supabase.from("student_skills").select("*, skill:skills(*)").eq("student_id", studentId)
                ]);
                if (sRes.data) studentProfile = sRes.data;
                if (skRes.data) studentSkills = skRes.data;
            }

            const interviewData = await aiService.generateMockInterview({
                targetRole: targetRole.trim(),
                interviewType,
                difficulty,
                questionCount,
                studentProfile,
                studentSkills,
            });

            return sendSuccess(res, interviewData);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/ai/interview/evaluate
     * Evaluates a student's answer to an interview question and optionally logs a communication session
     */
    async evaluateInterviewAnswer(req, res, next) {
        try {
            const studentId = req.body.student_id || req.body.studentId || req.user?.student?.id;
            const { question, answer, target_role, interview_type, save_session = true } = req.body;

            const missing = validateRequiredFields(req.body, ["question", "answer"]);
            if (missing.length > 0) {
                return sendError(res, `Missing required fields: ${missing.join(", ")}`, 400);
            }

            if (studentId) {
                if (!isValidUUID(studentId)) {
                    return sendError(res, "Invalid student ID format", 400);
                }
                const isAuthorized = await authService.checkStudentOwnership(req.user, studentId);
                if (!isAuthorized) {
                    return sendError(res, "Forbidden: Unauthorized student access", 403);
                }
            }

            const evaluation = await aiService.evaluateInterviewAnswer({
                question,
                studentAnswer: answer,
                targetRole: target_role || "Software Engineer",
                interviewType: interview_type || "technical",
            });

            let savedSession = null;
            if (save_session && studentId) {
                // Map to allowed session_type enum
                const validTypes = ["hr_interview", "technical_interview", "speaking_practice", "communication_exercise", "aptitude_discussion"];
                const mappedType = interview_type === "hr" ? "hr_interview" : "technical_interview";

                const { data: sessionData, error: sessionErr } = await supabase
                    .from("communication_sessions")
                    .insert({
                        student_id: studentId,
                        session_type: mappedType,
                        topic: question.length > 100 ? question.substring(0, 97) + "..." : question,
                        score: evaluation.score,
                        duration_seconds: Number(req.body.duration_seconds) || 60,
                        feedback: evaluation.feedback || {},
                        status: "completed",
                    })
                    .select("*")
                    .single();

                if (!sessionErr) {
                    savedSession = sessionData;
                }
            }

            return sendSuccess(res, {
                session_id: savedSession?.id || null,
                ...evaluation,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AIController();
