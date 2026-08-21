const path = require("path");
const supabase = require("../config/supabase");
const storageService = require("./storage.service");

/**
 * Resume Service - Storage & Metadata Management for Resumes
 */
class ResumeService {
    async getResumesByStudentId(studentId) {
        const { data, error } = await supabase
            .from("resumes")
            .select(`
                *,
                analyses:skill_gap_analysis(*)
            `)
            .eq("student_id", studentId)
            .order("version", { ascending: false });

        if (error) throw error;
        return data;
    }

    async getResumeDetailById(resumeId) {
        const { data, error } = await supabase
            .from("resumes")
            .select(`
                *,
                analyses:skill_gap_analysis(*),
                student:students(
                    id,
                    college,
                    course,
                    branch,
                    profile:profiles(full_name, email)
                )
            `)
            .eq("id", resumeId)
            .single();

        if (error) throw error;

        // If file_path exists, generate signed URL if needed
        if (data && data.file_path) {
            try {
                data.signed_url = await storageService.getSignedUrl(storageService.resumeBucket, data.file_path, 3600);
            } catch (err) {
                // Ignore signed url generation errors if storage object is missing
            }
        }

        return data;
    }

    async uploadResumeFile(studentId, file, options = {}) {
        await storageService.ensureBucketExists();

        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        const timestamp = Date.now();
        const storagePath = `student_${studentId}/${timestamp}_${sanitizedName}`;

        // 1. Upload to Supabase Storage
        await storageService.uploadFile(
            storageService.resumeBucket,
            storagePath,
            file.buffer,
            file.mimetype
        );

        // 2. Fetch latest version number for this student
        const { data: latestResumes } = await supabase
            .from("resumes")
            .select("version")
            .eq("student_id", studentId)
            .order("version", { ascending: false })
            .limit(1);

        const nextVersion = (latestResumes && latestResumes[0]?.version) ? latestResumes[0].version + 1 : 1;
        const isPrimary = options.is_primary !== undefined ? options.is_primary : (nextVersion === 1);

        if (isPrimary) {
            await supabase
                .from("resumes")
                .update({ is_primary: false })
                .eq("student_id", studentId);
        }

        // 3. Insert metadata record in PostgreSQL
        const { data, error } = await supabase
            .from("resumes")
            .insert({
                student_id: studentId,
                resume_title: options.resume_title || file.originalname,
                file_path: storagePath,
                file_url: null, // Private storage path referenced
                version: nextVersion,
                is_primary: isPrimary,
                parsing_status: "pending",
                analysis_status: "unprocessed",
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async createResume(studentId, resumeData) {
        const {
            resume_title = "My Resume",
            file_path,
            file_url,
            version = 1,
            is_primary = false,
            parsing_status = "pending",
            parsed_data = {},
            analysis_status = "unprocessed"
        } = resumeData;

        if (is_primary) {
            await supabase
                .from("resumes")
                .update({ is_primary: false })
                .eq("student_id", studentId);
        }

        const { data, error } = await supabase
            .from("resumes")
            .insert({
                student_id: studentId,
                resume_title,
                file_path,
                file_url,
                version,
                is_primary,
                parsing_status,
                parsed_data,
                analysis_status,
            })
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async updateResume(resumeId, updateData) {
        const allowedFields = [
            "resume_title",
            "file_path",
            "file_url",
            "version",
            "is_primary",
            "parsing_status",
            "parsed_data",
            "analysis_status"
        ];

        const payload = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                payload[field] = updateData[field];
            }
        }

        const { data, error } = await supabase
            .from("resumes")
            .update(payload)
            .eq("id", resumeId)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    }

    async deleteResume(resumeId) {
        // 1. Fetch resume to get storage path
        const { data: existingResume } = await supabase
            .from("resumes")
            .select("id, file_path")
            .eq("id", resumeId)
            .single();

        // 2. Delete storage object if present
        if (existingResume?.file_path) {
            try {
                await storageService.deleteFile(storageService.resumeBucket, existingResume.file_path);
            } catch (storageErr) {
                console.warn(`[STORAGE WARNING] Failed to delete storage file ${existingResume.file_path}:`, storageErr.message);
            }
        }

        // 3. Delete database record
        const { data, error } = await supabase
            .from("resumes")
            .delete()
            .eq("id", resumeId)
            .select("id")
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new ResumeService();
