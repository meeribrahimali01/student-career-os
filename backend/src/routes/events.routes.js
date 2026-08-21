const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const supabase = require("../config/supabase");

/**
 * @route   GET /api/events
 * @desc    Get published college events
 * @access  Private
 */
router.get("/", requireAuth, async (req, res, next) => {
    try {
        const { event_type } = req.query;
        let query = supabase
            .from("events")
            .select("*")
            .eq("is_published", true)
            .order("event_date", { ascending: true });

        if (event_type) query = query.eq("event_type", event_type);

        const { data, error } = await query;
        if (error) return next(error);

        res.status(200).json({
            success: true,
            events: data || [],
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
