const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get("/me", requireAuth, async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
