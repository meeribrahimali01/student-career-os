const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { authenticate, optionalAuthenticate } = require("../middleware/auth.middleware");
const authService = require("../services/auth.service");
const { sendSuccess, sendCreated, sendError } = require("../utils/response");

// Email regex pattern for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with email and password via Supabase
 * @access  Public
 */
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return sendError(res, "Please provide both email and password.", 400);
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(cleanEmail)) {
            return sendError(res, "Please enter a valid email address.", 400);
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
        });

        if (error || !data.session) {
            const errMsg = error?.message?.toLowerCase() || "";
            if (errMsg.includes("invalid login credentials") || errMsg.includes("invalid_grant")) {
                return sendError(res, "Invalid email or password. Please try again.", 401);
            }
            if (errMsg.includes("email not confirmed")) {
                return sendError(res, "Email not verified. Please check your inbox to verify your account.", 401);
            }
            return sendError(res, error ? error.message : "Authentication failed", 401);
        }

        const user = data.user;
        const profile = await authService.getUserProfile(user.id);
        const student = await authService.getStudentByProfileId(user.id);

        return sendSuccess(res, {
            token: data.session.access_token,
            expires_at: data.session.expires_at,
            user: {
                id: user.id,
                email: user.email,
                profile: profile || { full_name: user.email.split("@")[0], role: "student" },
                student: student || null,
            },
        }, 200);
    } catch (err) {
        next(err);
    }
});

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new student account via Supabase Auth
 * @access  Public
 */
router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, fullName } = req.body || {};

        if (!email || !password) {
            return sendError(res, "Please provide email and password.", 400);
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(cleanEmail)) {
            return sendError(res, "Please enter a valid email address.", 400);
        }

        if (password.length < 6) {
            return sendError(res, "Password must be at least 6 characters long.", 400);
        }

        const displayName = fullName && fullName.trim() !== "" ? fullName.trim() : cleanEmail.split("@")[0];

        // 1. Create user in Supabase Auth with auto-confirmed email using Admin API
        let authUser = null;
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
            email: cleanEmail,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: displayName,
            },
        });

        if (createError) {
            const errMsg = createError.message?.toLowerCase() || "";
            if (errMsg.includes("already registered") || errMsg.includes("already exists") || errMsg.includes("duplicate")) {
                return sendError(res, "An account with this email already exists. Try signing in instead.", 409);
            }
            return sendError(res, createError.message || "Failed to create account", 400);
        }

        authUser = createData.user;
        if (!authUser) {
            return sendError(res, "User registration failed. Please try again.", 500);
        }

        // 2. Initialize student profile in public.profiles table
        let profile = null;
        try {
            const { data: newProfile } = await supabase
                .from("profiles")
                .upsert({
                    id: authUser.id,
                    email: authUser.email,
                    full_name: displayName,
                    role: "student",
                })
                .select()
                .maybeSingle();
            profile = newProfile;
        } catch (e) {
            console.warn("Profile table upsert warning:", e.message);
        }

        // 3. Initialize default student record in public.students table
        let student = null;
        try {
            const { data: newStudent } = await supabase
                .from("students")
                .upsert({
                    profile_id: authUser.id,
                    college: "National Institute of Technology",
                    branch: "CSE",
                    semester: 5,
                    current_cgpa: 8.6,
                })
                .select()
                .maybeSingle();
            student = newStudent;
        } catch (e) {
            console.warn("Student table upsert warning:", e.message);
        }

        // 4. Automatically sign in the newly registered user to generate active session
        let token = null;
        let expiresAt = null;
        try {
            const { data: sessionData } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });
            token = sessionData?.session?.access_token || null;
            expiresAt = sessionData?.session?.expires_at || null;
        } catch (e) {
            console.warn("Auto-signin warning:", e.message);
        }

        return sendCreated(res, {
            token,
            expires_at: expiresAt,
            user: {
                id: authUser.id,
                email: authUser.email,
                profile: profile || { full_name: displayName, role: "student" },
                student: student || null,
            },
        }, "Registration successful");
    } catch (err) {
        next(err);
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user identity and student mapping
 * @access  Private
 */
router.get("/me", authenticate, async (req, res, next) => {
    try {
        return sendSuccess(res, {
            user: req.user,
        }, 200);
    } catch (err) {
        next(err);
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Terminate session
 * @access  Public / Optional
 */
router.post("/logout", optionalAuthenticate, async (req, res, next) => {
    try {
        return sendSuccess(res, { logged_out: true }, 200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
