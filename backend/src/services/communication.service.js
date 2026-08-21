const supabase = require("../config/supabase");

/**
 * Communication Service - Business & Persistence Logic for Communication Sessions
 */
class CommunicationService {
    async getSessionsByStudentId(studentId) {
        const { data, error } = await supabase
            .from("communication_sessions")
            .select("*")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async createSession(studentId, sessionData) {
        const {
            session_type,
            topic,
            score,
            duration_seconds = 0,
            feedback = {},
            status = "completed"
        } = sessionData;

        const { data, error } = await supabase
            .from("communication_sessions")
            .insert({
                student_id: studentId,
                session_type,
                topic,
                score,
                duration_seconds,
                feedback,
                status,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async getSessionById(sessionId) {
        const { data, error } = await supabase
            .from("communication_sessions")
            .select(`
                *,
                student:students(
                    id,
                    college,
                    course,
                    branch,
                    profile:profiles(full_name, email)
                )
            `)
            .eq("id", sessionId)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new CommunicationService();
