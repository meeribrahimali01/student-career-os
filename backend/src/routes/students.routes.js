const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const supabase = require("../config/supabase");

/**
 * @route   GET /api/students/profile
 * @desc    Get student profile for authenticated user
 * @access  Private
 */
router.get("/profile", requireAuth, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from("students")
            .select(`
                *,
                profile:profiles(*)
            `)
            .eq("profile_id", req.user.id)
            .single();

        if (error && error.code !== "PGRST116") {
            return next(error);
        }

        res.status(200).json({
            success: true,
            student: data || null,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
