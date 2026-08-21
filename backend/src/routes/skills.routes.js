const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const supabase = require("../config/supabase");

/**
 * @route   GET /api/skills
 * @desc    Get master list of skills
 * @access  Private
 */
router.get("/", requireAuth, async (req, res, next) => {
    try {
        const { category } = req.query;
        let query = supabase.from("skills").select("*").order("name", { ascending: true });

        if (category) {
            query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) return next(error);

        res.status(200).json({
            success: true,
            skills: data || [],
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
