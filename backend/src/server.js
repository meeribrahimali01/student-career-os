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

// Parse allowed CORS origins from environment
const rawOrigins = `${env.ALLOWED_ORIGINS || ""},${env.CLIENT_URL || ""}`;
const configuredOrigins = rawOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

// Standard Middlewares & Robust CORS for Vercel + Localhost
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, server-to-server, health checkers)
            if (!origin) return callback(null, true);

            // Allow any localhost/127.0.0.1 origin during development
            if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
                return callback(null, true);
            }

            // Allow explicitly configured origins in environment variables
            if (configuredOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Vercel preview/production deployments matching *.vercel.app
            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            return callback(new Error(`CORS origin not allowed: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    })
);

app.use(express.json());
app.use(requestLogger);

// Global API rate limiter (150 requests per minute per IP)
app.use("/api", createRateLimiter({ windowMs: 60 * 1000, maxRequests: 150 }));

// Root health-check endpoint (for Vercel root ping)
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        service: "Meridian Learning Orbit API",
        status: "healthy",
        version: "1.0.0",
        endpoints: "/api",
    });
});

// Basic health-check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Meridian backend is running",
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// Supabase database health check
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
            message: "Meridian backend is connected to Supabase",
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

process.on("unhandledRejection", (reason, promise) => {
    console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("[Server] Uncaught Exception thrown:", error);
});

// Start server only when executed directly via `node src/server.js` or `npm start`
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Meridian backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;
