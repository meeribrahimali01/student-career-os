const supabase = require("../config/supabase");

/**
 * Event Service - Business & Persistence Logic for Events & Event Registrations
 */
class EventService {
    async getEvents(filters = {}) {
        const { event_type, search } = filters;
        let query = supabase
            .from("events")
            .select("*")
            .eq("is_published", true)
            .order("event_date", { ascending: true });

        if (event_type) query = query.eq("event_type", event_type);
        if (search) query = query.ilike("title", `%${search}%`);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async getEventById(id) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async createEvent(eventData) {
        const {
            title,
            description,
            event_type,
            organizer,
            venue_type = "online",
            venue_details,
            event_date,
            end_date,
            registration_deadline,
            registration_url,
            max_participants,
            is_published = true
        } = eventData;

        const { data, error } = await supabase
            .from("events")
            .insert({
                title,
                description,
                event_type,
                organizer,
                venue_type,
                venue_details,
                event_date,
                end_date,
                registration_deadline,
                registration_url,
                max_participants,
                is_published,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async updateEvent(id, updateData) {
        const allowedFields = [
            "title",
            "description",
            "event_type",
            "organizer",
            "venue_type",
            "venue_details",
            "event_date",
            "end_date",
            "registration_deadline",
            "registration_url",
            "max_participants",
            "is_published"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("events")
            .update(payload)
            .eq("id", id)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deleteEvent(id) {
        const { data, error } = await supabase
            .from("events")
            .delete()
            .eq("id", id)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }

    async getEventRegistrations(eventId) {
        const { data, error } = await supabase
            .from("event_registrations")
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
            .eq("event_id", eventId)
            .order("registered_at", { ascending: false });

        if (error) throw error;
        return data;
    }

    async registerStudentForEvent(eventId, studentId) {
        // Check for existing registration
        const { data: existing } = await supabase
            .from("event_registrations")
            .select("id")
            .eq("event_id", eventId)
            .eq("student_id", studentId)
            .single();

        if (existing) {
            const err = new Error("Student is already registered for this event");
            err.statusCode = 409;
            throw err;
        }

        const { data, error } = await supabase
            .from("event_registrations")
            .insert({
                event_id: eventId,
                student_id: studentId,
                registration_status: "registered",
                attendance_status: "unmarked",
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async cancelEventRegistration(eventId, studentId) {
        const { data, error } = await supabase
            .from("event_registrations")
            .delete()
            .eq("event_id", eventId)
            .eq("student_id", studentId)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new EventService();
