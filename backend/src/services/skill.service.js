const supabase = require("../config/supabase");

/**
 * Skill Service - Business & Persistence Logic for Master Skills Catalog
 */
class SkillService {
    async getAllSkills(category) {
        let query = supabase
            .from("skills")
            .select("*")
            .order("name", { ascending: true });

        if (category) {
            query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async getSkillById(id) {
        const { data, error } = await supabase
            .from("skills")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new SkillService();
