const supabase = require("../config/supabase");

/**
 * Student Service - Business & Persistence Logic for Students & Student Skills
 */
class StudentService {
    async getStudentById(id) {
        const { data, error } = await supabase
            .from("students")
            .select(`
                *,
                profile:profiles(id, full_name, email, avatar_url, role, created_at)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async updateStudent(id, updateData) {
        const allowedFields = [
            "college",
            "course",
            "branch",
            "graduation_year",
            "semester",
            "current_cgpa",
            "career_preferences",
            "placement_status"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("students")
            .update(payload)
            .eq("id", id)
            .select(`
                *,
                profile:profiles(id, full_name, email, avatar_url, role)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    async getStudentSkills(studentId) {
        const { data, error } = await supabase
            .from("student_skills")
            .select(`
                *,
                skill:skills(id, name, category, description)
            `)
            .eq("student_id", studentId)
            .order("created_at", { ascending: true });

        if (error) throw error;
        return data;
    }

    async addStudentSkill(studentId, skillData) {
        const { skill_id, proficiency_level = "beginner", source = "self_reported", verified = false } = skillData;

        // Check if mapping already exists
        const { data: existing } = await supabase
            .from("student_skills")
            .select("id")
            .eq("student_id", studentId)
            .eq("skill_id", skill_id)
            .single();

        if (existing) {
            const err = new Error("Skill is already mapped to this student");
            err.statusCode = 409;
            throw err;
        }

        const { data, error } = await supabase
            .from("student_skills")
            .insert({
                student_id: studentId,
                skill_id,
                proficiency_level,
                source,
                verified,
            })
            .select(`
                *,
                skill:skills(id, name, category, description)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    async updateStudentSkill(studentId, skillId, updateData) {
        const { proficiency_level, source, verified } = updateData;
        const payload = {};

        if (proficiency_level !== undefined) payload.proficiency_level = proficiency_level;
        if (source !== undefined) payload.source = source;
        if (verified !== undefined) payload.verified = verified;

        const { data, error } = await supabase
            .from("student_skills")
            .update(payload)
            .eq("student_id", studentId)
            .eq("skill_id", skillId)
            .select(`
                *,
                skill:skills(id, name, category, description)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    async deleteStudentSkill(studentId, skillId) {
        const { data, error } = await supabase
            .from("student_skills")
            .delete()
            .eq("student_id", studentId)
            .eq("skill_id", skillId)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new StudentService();
