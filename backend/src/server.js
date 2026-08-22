const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const supabase = require("./config/supabase");
const { requestLogger } = require("./utils/logger");
const { createRateLimiter } = require("./middleware/rateLimit.middleware");
const apiRoutes = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

const PORT = env.PORT || 5000;
const CLIENT_URL = env.CLIENT_URL || "http://localhost:5173";

// Standard Middlewares
app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(requestLogger);

// Global API rate limiter (150 requests per minute per IP)
app.use("/api", createRateLimiter({ windowMs: 60 * 1000, maxRequests: 150 }));

// Basic health-check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CareerOS backend is running",
    });
});

app.get("/api/health/supabase", async (req, res) => {
    try {
        const { error } = await supabase
            .from("profiles")
            .select("id")
            .limit(1);

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Supabase connection reached, but the test query failed.",
                error: error.message,
            });
        }

        res.status(200).json({
            success: true,
            message: "CareerOS backend is connected to Supabase",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to connect to Supabase",
            error: error.message,
        });
    }
});

// Mount API routes
app.use("/api", apiRoutes);

// Handle 404 for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// Central error handler
app.use(errorMiddleware);

// Start server only when executed directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`CareerOS backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;
