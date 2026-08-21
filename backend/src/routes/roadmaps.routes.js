const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const supabase = require("../config/supabase");

/**
 * @route   GET /api/roadmaps
 * @desc    Get all roadmaps for current student
 * @access  Private
 */
router.get("/", requireAuth, async (req, res, next) => {
    try {
        const { data: student } = await supabase
            .from("students")
            .select("id")
            .eq("profile_id", req.user.id)
            .single();

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        const { data: roadmaps, error } = await supabase
            .from("roadmaps")
            .select(`
                *,
                items:roadmap_items(*)
            `)
            .eq("student_id", student.id)
            .order("created_at", { ascending: false });

        if (error) return next(error);

        res.status(200).json({
            success: true,
            roadmaps: roadmaps || [],
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
