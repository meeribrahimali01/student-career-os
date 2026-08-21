const supabase = require("../config/supabase");

/**
 * Career Service - Structured Career Summary & Readiness Metrics Generator
 * 
 * Provides deterministic, rule-based career summaries combining academics, skills,
 * roadmaps, applications, resumes, and communication performance.
 */
class CareerService {
    async generateCareerSummary(studentId) {
        // Fetch student details
        const { data: student, error: studentErr } = await supabase
            .from("students")
            .select(`
                *,
                profile:profiles(full_name, email)
            `)
            .eq("id", studentId)
            .single();

        if (studentErr) throw studentErr;

        // Fetch parallel domain records
        const [
            academicsRes,
            skillsRes,
            roadmapsRes,
            placementsRes,
            resumesRes,
            communicationRes
        ] = await Promise.all([
            supabase.from("academic_records").select("*").eq("student_id", studentId).order("semester", { ascending: true }),
            supabase.from("student_skills").select("*, skill:skills(*)").eq("student_id", studentId),
            supabase.from("roadmaps").select("*, items:roadmap_items(*)").eq("student_id", studentId),
            supabase.from("placement_applications").select("*, opportunity:placement_opportunities(*)").eq("student_id", studentId),
            supabase.from("resumes").select("*").eq("student_id", studentId).order("version", { ascending: false }),
            supabase.from("communication_sessions").select("*").eq("student_id", studentId)
        ]);

        const academicRecords = academicsRes.data || [];
        const studentSkills = skillsRes.data || [];
        const roadmaps = roadmapsRes.data || [];
        const applications = placementsRes.data || [];
        const resumes = resumesRes.data || [];
        const commSessions = communicationRes.data || [];

        // 1. Academic Metrics
        const totalBacklogs = academicRecords.reduce((sum, r) => sum + (r.backlogs_count || 0), 0);
        const latestRecord = academicRecords[academicRecords.length - 1] || null;

        // 2. Skills Metrics
        const skillCategories = {};
        for (const sk of studentSkills) {
            const cat = sk.skill?.category || "general";
            skillCategories[cat] = (skillCategories[cat] || 0) + 1;
        }

        // 3. Roadmap Progress Metrics
        let totalRoadmapTasks = 0;
        let completedRoadmapTasks = 0;
        for (const rm of roadmaps) {
            if (rm.items && Array.isArray(rm.items)) {
                totalRoadmapTasks += rm.items.length;
                completedRoadmapTasks += rm.items.filter((it) => it.status === "completed").length;
            }
        }
        const roadmapCompletionRate = totalRoadmapTasks > 0 ? Math.round((completedRoadmapTasks / totalRoadmapTasks) * 100) : 0;

        // 4. Placement Pipeline
        const applicationStatusCounts = {};
        for (const app of applications) {
            applicationStatusCounts[app.application_status] = (applicationStatusCounts[app.application_status] || 0) + 1;
        }

        // 5. Communication Practice Metrics
        const completedCommSessions = commSessions.filter((s) => s.status === "completed");
        const avgCommScore = completedCommSessions.length > 0
            ? Math.round(completedCommSessions.reduce((sum, s) => sum + Number(s.score || 0), 0) / completedCommSessions.length)
            : 0;

        // 6. Placement Readiness Score (Rule-based composite 0 - 100)
        let readinessScore = 0;
        // CGPA (up to 30 points)
        const cgpa = Number(student.current_cgpa || (latestRecord ? latestRecord.sgpa : 0));
        readinessScore += Math.min(30, Math.round((cgpa / 10) * 30));
        // Skills count (up to 25 points, 5 points per verified/added skill up to 5)
        readinessScore += Math.min(25, studentSkills.length * 5);
        // Resume presence (up to 20 points)
        if (resumes.length > 0) readinessScore += 20;
        // Roadmap progress (up to 15 points)
        readinessScore += Math.round((roadmapCompletionRate / 100) * 15);
        // Communication practice (up to 10 points)
        if (completedCommSessions.length > 0) readinessScore += 10;

        return {
            student_id: student.id,
            full_name: student.profile?.full_name || "CareerOS Student",
            college: student.college,
            branch: student.branch,
            semester: student.semester,
            placement_status: student.placement_status,
            readiness_score: readinessScore,
            metrics: {
                current_cgpa: cgpa,
                total_backlogs: totalBacklogs,
                total_skills: studentSkills.length,
                skill_categories: skillCategories,
                active_roadmaps_count: roadmaps.filter((r) => r.status === "in_progress").length,
                roadmap_completion_rate: roadmapCompletionRate,
                total_applications: applications.length,
                application_breakdown: applicationStatusCounts,
                primary_resume_uploaded: resumes.some((r) => r.is_primary) || resumes.length > 0,
                completed_communication_sessions: completedCommSessions.length,
                average_communication_score: avgCommScore,
            },
        };
    }
}

module.exports = new CareerService();
