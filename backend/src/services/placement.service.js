const supabase = require("../config/supabase");

/**
 * Placement Service - Business & Persistence Logic for Placements & Applications
 */
class PlacementService {
    async getPlacementOpportunities(filters = {}) {
        const { status = "active", employment_type, search } = filters;
        let query = supabase
            .from("placement_opportunities")
            .select("*")
            .order("created_at", { ascending: false });

        if (status) query = query.eq("status", status);
        if (employment_type) query = query.eq("employment_type", employment_type);
        if (search) query = query.ilike("role_title", `%${search}%`);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async getPlacementOpportunityById(id) {
        const { data, error } = await supabase
            .from("placement_opportunities")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async createPlacementOpportunity(data) {
        const {
            company_name,
            role_title,
            job_description,
            eligibility_criteria = {},
            location,
            employment_type = "full_time",
            salary_package,
            application_deadline,
            apply_url,
            status = "active"
        } = data;

        const { data: inserted, error } = await supabase
            .from("placement_opportunities")
            .insert({
                company_name,
                role_title,
                job_description,
                eligibility_criteria,
                location,
                employment_type,
                salary_package,
                application_deadline,
                apply_url,
                status,
            })
            .select("*")
            .single();

        if (error) throw error;
        return inserted;
    }

    async updatePlacementOpportunity(id, updateData) {
        const allowedFields = [
            "company_name",
            "role_title",
            "job_description",
            "eligibility_criteria",
            "location",
            "employment_type",
            "salary_package",
            "application_deadline",
            "apply_url",
            "status"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("placement_opportunities")
            .update(payload)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deletePlacementOpportunity(id) {
        const { data, error } = await supabase
            .from("placement_opportunities")
            .delete()
            .eq("id", id)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }

    async getApplicationsByStudentId(studentId) {
        const { data, error } = await supabase
            .from("placement_applications")
            .select(`
                *,
                opportunity:placement_opportunities(*)
            `)
            .eq("student_id", studentId)
            .order("applied_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async applyForPlacement(placementId, studentId, applicationData = {}) {
        const { notes } = applicationData;

        // Check for existing application
        const { data: existing } = await supabase
            .from("placement_applications")
            .select("id")
            .eq("opportunity_id", placementId)
            .eq("student_id", studentId)
            .single();

        if (existing) {
            const err = new Error("Student has already applied for this placement opportunity");
            err.statusCode = 409;
            throw err;
        }

        const { data, error } = await supabase
            .from("placement_applications")
            .insert({
                opportunity_id: placementId,
                student_id: studentId,
                application_status: "applied",
                current_stage: "Applied",
                notes,
            })
            .select(`
                *,
                opportunity:placement_opportunities(*)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    async updatePlacementApplication(applicationId, updateData) {
        const allowedFields = [
            "application_status",
            "current_stage",
            "interview_date",
            "notes",
            "result"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("placement_applications")
            .update(payload)
            .eq("id", applicationId)
            .select(`
                *,
                opportunity:placement_opportunities(*)
            `)
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new PlacementService();
