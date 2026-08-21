const supabase = require("../config/supabase");

/**
 * Academic Service - Business & Persistence Logic for Academic Records
 */
class AcademicService {
    async getRecordsByStudentId(studentId) {
        const { data, error } = await supabase
            .from("academic_records")
            .select("*")
            .eq("student_id", studentId)
            .order("semester", { ascending: true });

        if (error) throw error;
        return data;
    }

    async createRecord(studentId, recordData) {
        const {
            semester,
            academic_year,
            sgpa,
            cgpa_at_time,
            percentage,
            credits_earned = 0,
            backlogs_count = 0,
            grade_sheet_url,
            subject_records = []
        } = recordData;

        const { data, error } = await supabase
            .from("academic_records")
            .insert({
                student_id: studentId,
                semester,
                academic_year,
                sgpa,
                cgpa_at_time,
                percentage,
                credits_earned,
                backlogs_count,
                grade_sheet_url,
                subject_records,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async updateRecord(recordId, updateData) {
        const allowedFields = [
            "semester",
            "academic_year",
            "sgpa",
            "cgpa_at_time",
            "percentage",
            "credits_earned",
            "backlogs_count",
            "grade_sheet_url",
            "subject_records"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("academic_records")
            .update(payload)
            .eq("id", recordId)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deleteRecord(recordId) {
        const { data, error } = await supabase
            .from("academic_records")
            .delete()
            .eq("id", recordId)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new AcademicService();
