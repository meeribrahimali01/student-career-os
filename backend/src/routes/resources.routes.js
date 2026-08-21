const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const supabase = require("../config/supabase");

/**
 * @route   GET /api/resources
 * @desc    Get published study resources
 * @access  Private
 */
router.get("/", requireAuth, async (req, res, next) => {
    try {
        const { category, resource_type, difficulty } = req.query;
        let query = supabase
            .from("study_resources")
            .select("*")
            .eq("is_published", true)
            .order("created_at", { ascending: false });

        if (category) query = query.eq("category", category);
        if (resource_type) query = query.eq("resource_type", resource_type);
        if (difficulty) query = query.eq("difficulty", difficulty);

        const { data, error } = await query;
        if (error) return next(error);

        res.status(200).json({
            success: true,
            resources: data || [],
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
