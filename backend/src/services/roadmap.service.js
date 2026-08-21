const supabase = require("../config/supabase");

/**
 * Roadmap Service - Business & Persistence Logic for Roadmaps & Roadmap Items
 */
class RoadmapService {
    async getRoadmapsByStudentId(studentId) {
        const { data, error } = await supabase
            .from("roadmaps")
            .select(`
                *,
                items:roadmap_items(*)
            `)
            .eq("student_id", studentId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async getRoadmapById(roadmapId) {
        const { data, error } = await supabase
            .from("roadmaps")
            .select(`
                *,
                items:roadmap_items(*)
            `)
            .eq("id", roadmapId)
            .single();

        if (error) throw error;
        return data;
    }

    async createRoadmap(studentId, roadmapData) {
        const {
            title,
            career_goal,
            description,
            status = "in_progress",
            start_date,
            target_date
        } = roadmapData;

        const { data, error } = await supabase
            .from("roadmaps")
            .insert({
                student_id: studentId,
                title,
                career_goal,
                description,
                status,
                start_date,
                target_date,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async updateRoadmap(roadmapId, updateData) {
        const allowedFields = [
            "title",
            "career_goal",
            "description",
            "status",
            "start_date",
            "target_date"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("roadmaps")
            .update(payload)
            .eq("id", roadmapId)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deleteRoadmap(roadmapId) {
        const { data, error } = await supabase
            .from("roadmaps")
            .delete()
            .eq("id", roadmapId)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }

    async getRoadmapItems(roadmapId) {
        const { data, error } = await supabase
            .from("roadmap_items")
            .select("*")
            .eq("roadmap_id", roadmapId)
            .order("sequence_order", { ascending: true });

        if (error) throw error;
        return data;
    }

    async createRoadmapItem(roadmapId, itemData) {
        const {
            title,
            description,
            sequence_order = 1,
            status = "pending",
            priority = "medium",
            due_date,
            completed_at
        } = itemData;

        const { data, error } = await supabase
            .from("roadmap_items")
            .insert({
                roadmap_id: roadmapId,
                title,
                description,
                sequence_order,
                status,
                priority,
                due_date,
                completed_at,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async updateRoadmapItem(itemId, updateData) {
        const allowedFields = [
            "title",
            "description",
            "sequence_order",
            "status",
            "priority",
            "due_date",
            "completed_at"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        if (payload.status === "completed" && !payload.completed_at) {
            payload.completed_at = new Date().toISOString();
        } else if (payload.status && payload.status !== "completed" && !updateData.completed_at) {
            payload.completed_at = null;
        }

        const { data, error } = await supabase
            .from("roadmap_items")
            .update(payload)
            .eq("id", itemId)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deleteRoadmapItem(itemId) {
        const { data, error } = await supabase
            .from("roadmap_items")
            .delete()
            .eq("id", itemId)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new RoadmapService();
