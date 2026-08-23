/**
 * Centralized Environment Configuration & Validation for Meridian Backend
 */
require("dotenv").config();

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173",
    STORAGE_RESUME_BUCKET: process.env.STORAGE_RESUME_BUCKET || "resumes",
};

// Validate critical configurations
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
for (const varName of requiredEnvVars) {
    if (!env[varName]) {
        console.warn(`[CONFIG WARNING] Missing required environment variable: ${varName}`);
    }
}

module.exports = env;
