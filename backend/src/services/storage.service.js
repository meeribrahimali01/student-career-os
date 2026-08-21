const supabase = require("../config/supabase");
const env = require("../config/env");

/**
 * Storage Service - Manages Supabase Storage Buckets and Objects
 */
class StorageService {
    constructor() {
        this.resumeBucket = env.STORAGE_RESUME_BUCKET || "resumes";
    }

    /**
     * Ensure the resumes storage bucket exists
     */
    async ensureBucketExists(bucketName = this.resumeBucket) {
        try {
            const { data: buckets, error } = await supabase.storage.listBuckets();
            if (error) {
                console.warn("[STORAGE WARNING] Could not list buckets:", error.message);
                return;
            }

            const exists = buckets.some((b) => b.name === bucketName);
            if (!exists) {
                const { error: createError } = await supabase.storage.createBucket(bucketName, {
                    public: false,
                    fileSizeLimit: 5 * 1024 * 1024,
                    allowedMimeTypes: [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ],
                });

                if (createError) {
                    console.warn(`[STORAGE WARNING] Bucket creation for ${bucketName}:`, createError.message);
                }
            }
        } catch (err) {
            console.warn("[STORAGE EXCEPTION]:", err.message);
        }
    }

    /**
     * Upload a file buffer to Supabase Storage
     */
    async uploadFile(bucketName, storagePath, fileBuffer, contentType) {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(storagePath, fileBuffer, {
                contentType,
                upsert: true,
            });

        if (error) throw error;
        return data;
    }

    /**
     * Delete a file from Supabase Storage
     */
    async deleteFile(bucketName, storagePath) {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .remove([storagePath]);

        if (error) throw error;
        return data;
    }

    /**
     * Generate a signed URL for private access
     */
    async getSignedUrl(bucketName, storagePath, expiresIn = 3600) {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(storagePath, expiresIn);

        if (error) throw error;
        return data?.signedUrl;
    }
}

module.exports = new StorageService();
