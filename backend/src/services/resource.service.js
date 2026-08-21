const supabase = require("../config/supabase");

/**
 * Resource Service - Business & Persistence Logic for Study Resources
 */
class ResourceService {
    async getResources(filters = {}) {
        const { category, type, difficulty, search } = filters;
        let query = supabase
            .from("study_resources")
            .select("*")
            .eq("is_published", true)
            .order("created_at", { ascending: false });

        if (category) query = query.eq("category", category);
        if (type) query = query.eq("resource_type", type);
        if (difficulty) query = query.eq("difficulty", difficulty);
        if (search) query = query.ilike("title", `%${search}%`);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async getResourceById(id) {
        const { data, error } = await supabase
            .from("study_resources")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async createResource(resourceData) {
        const {
            title,
            description,
            resource_type,
            url,
            category,
            difficulty = "beginner",
            tags = [],
            is_published = true,
            created_by
        } = resourceData;

        const { data, error } = await supabase
            .from("study_resources")
            .insert({
                title,
                description,
                resource_type,
                url,
                category,
                difficulty,
                tags,
                is_published,
                created_by,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async updateResource(id, updateData) {
        const allowedFields = [
            "title",
            "description",
            "resource_type",
            "url",
            "category",
            "difficulty",
            "tags",
            "is_published"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("study_resources")
            .update(payload)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deleteResource(id) {
        const { data, error } = await supabase
            .from("study_resources")
            .delete()
            .eq("id", id)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new ResourceService();
