const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const supabase = require("../config/supabase");

/**
 * @route   GET /api/placements/opportunities
 * @desc    Get active placement opportunities
 * @access  Private
 */
router.get("/opportunities", requireAuth, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from("placement_opportunities")
            .select("*")
            .eq("status", "active")
            .order("created_at", { ascending: false });

        if (error) return next(error);

        res.status(200).json({
            success: true,
            opportunities: data || [],
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @route   GET /api/placements/applications
 * @desc    Get placement applications for current student
 * @access  Private
 */
router.get("/applications", requireAuth, async (req, res, next) => {
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

        const { data, error } = await supabase
            .from("placement_applications")
            .select(`
                *,
                opportunity:placement_opportunities(*)
            `)
            .eq("student_id", student.id)
            .order("applied_at", { ascending: false });

        if (error) return next(error);

        res.status(200).json({
            success: true,
            applications: data || [],
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
