const supabase = require("../config/supabase");
const careerService = require("./career.service");

/**
 * Dashboard Service - Aggregates domain metrics for the Student Career & Placement Dashboard
 */
class DashboardService {
    async getStudentDashboard(studentId) {
        // Fetch student profile first
        const { data: student, error: studentError } = await supabase
            .from("students")
            .select(`
                *,
                profile:profiles(id, full_name, email, avatar_url, role)
            `)
            .eq("id", studentId)
            .single();

        if (studentError) throw studentError;

        // Perform parallel queries for dashboard sections
        const [
            academicsRes,
            skillsRes,
            roadmapsRes,
            eventsRes,
            placementsRes,
            applicationsRes,
            resumesRes,
            commRes,
            careerSummary
        ] = await Promise.all([
            supabase.from("academic_records").select("id, semester, academic_year, sgpa, cgpa_at_time, backlogs_count").eq("student_id", studentId).order("semester", { ascending: false }).limit(3),
            supabase.from("student_skills").select("id, proficiency_level, verified, skill:skills(name, category)").eq("student_id", studentId),
            supabase.from("roadmaps").select("id, title, career_goal, status, target_date, items:roadmap_items(id, status, priority)").eq("student_id", studentId).limit(3),
            supabase.from("events").select("id, title, event_type, organizer, venue_type, event_date").eq("is_published", true).gte("event_date", new Date().toISOString()).order("event_date", { ascending: true }).limit(5),
            supabase.from("placement_opportunities").select("id, company_name, role_title, location, employment_type, salary_package, application_deadline").eq("status", "active").order("created_at", { ascending: false }).limit(5),
            supabase.from("placement_applications").select("id, application_status, current_stage, applied_at, opportunity:placement_opportunities(company_name, role_title)").eq("student_id", studentId).order("applied_at", { ascending: false }),
            supabase.from("resumes").select("id, resume_title, version, is_primary, parsing_status, analysis_status, created_at").eq("student_id", studentId).order("version", { ascending: false }),
            supabase.from("communication_sessions").select("id, session_type, topic, score, duration_seconds, status, created_at").eq("student_id", studentId).order("created_at", { ascending: false }).limit(5),
            careerService.generateCareerSummary(studentId).catch(() => null)
        ]);

        const academicRecords = academicsRes.data || [];
        const studentSkills = skillsRes.data || [];
        const roadmaps = roadmapsRes.data || [];
        const upcomingEvents = eventsRes.data || [];
        const activePlacements = placementsRes.data || [];
        const applications = applicationsRes.data || [];
        const resumes = resumesRes.data || [];
        const commSessions = commRes.data || [];

        // Build compact academic overview
        const academicsOverview = {
            current_cgpa: student.current_cgpa,
            recent_semesters: academicRecords,
            total_records: academicRecords.length,
        };

        // Build compact skills overview
        const skillsOverview = {
            total: studentSkills.length,
            verified_count: studentSkills.filter((s) => s.verified).length,
            skills_list: studentSkills.slice(0, 10),
        };

        // Build compact roadmap overview
        const activeRoadmap = roadmaps.find((r) => r.status === "in_progress") || roadmaps[0] || null;
        const roadmapOverview = {
            total_roadmaps: roadmaps.length,
            active_roadmap: activeRoadmap ? {
                id: activeRoadmap.id,
                title: activeRoadmap.title,
                career_goal: activeRoadmap.career_goal,
                status: activeRoadmap.status,
                total_items: activeRoadmap.items?.length || 0,
                completed_items: activeRoadmap.items?.filter((it) => it.status === "completed").length || 0,
            } : null,
        };

        // Build placement applications summary
        const placementOverview = {
            total_applications: applications.length,
            active_applications: applications.filter((a) => !["offered", "rejected", "withdrawn"].includes(a.application_status)),
            recent_applications: applications.slice(0, 3),
            available_opportunities: activePlacements,
        };

        // Build resume status
        const primaryResume = resumes.find((r) => r.is_primary) || resumes[0] || null;
        const resumeOverview = {
            total_resumes: resumes.length,
            primary_resume: primaryResume,
        };

        // Build communication sessions summary
        const communicationOverview = {
            total_sessions: commSessions.length,
            recent_sessions: commSessions,
        };

        return {
            profile: {
                id: student.id,
                full_name: student.profile?.full_name,
                email: student.profile?.email,
                avatar_url: student.profile?.avatar_url,
                college: student.college,
                course: student.course,
                branch: student.branch,
                graduation_year: student.graduation_year,
                semester: student.semester,
                placement_status: student.placement_status,
            },
            career_summary: careerSummary,
            academics: academicsOverview,
            skills: skillsOverview,
            roadmap: roadmapOverview,
            events: upcomingEvents,
            placements: placementOverview,
            resume: resumeOverview,
            communication: communicationOverview,
        };
    }
}

module.exports = new DashboardService();
