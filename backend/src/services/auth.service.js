const supabase = require("../config/supabase");

/**
 * Auth Service - User and Student Identity Resolution Helpers
 */
class AuthService {
    /**
     * Get user profile from public.profiles table
     */
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, email, avatar_url, role, created_at")
                .eq("id", userId)
                .single();

            if (error && error.code !== "PGRST116") {
                return null;
            }
            return data || null;
        } catch (err) {
            return null;
        }
    }

    /**
     * Get student record associated with a profile/auth user ID
     */
    async getStudentByProfileId(profileId) {
        try {
            const { data, error } = await supabase
                .from("students")
                .select("id, profile_id, college, course, branch, semester, graduation_year, current_cgpa, placement_status")
                .eq("profile_id", profileId)
                .single();

            if (error && error.code !== "PGRST116") {
                return null;
            }
            return data || null;
        } catch (err) {
            return null;
        }
    }

    /**
     * Verify if a user ID owns a given student ID or has administrative privileges
     */
    async checkStudentOwnership(user, targetStudentId) {
        if (!user || !user.id) return false;

        // Admin override
        if (user.profile && (user.profile.role === "admin" || user.profile.role === "placement_officer")) {
            return true;
        }

        // If user already has student attached
        if (user.student && user.student.id) {
            return user.student.id === targetStudentId;
        }

        const student = await this.getStudentByProfileId(user.id);
        if (!student) return false;

        return student.id === targetStudentId;
    }
}

module.exports = new AuthService();
