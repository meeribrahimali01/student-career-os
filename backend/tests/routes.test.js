const http = require("http");
const app = require("../src/server");

async function runTests() {
    console.log("\n========================================================");
    console.log("🚀 STARTING MERIDIAN BACKEND API VERIFICATION SUITE");
    console.log("========================================================\n");

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    let passed = 0;
    let failed = 0;

    async function testEndpoint(name, path, options = {}, validator) {
        try {
            const url = `${baseUrl}${path}`;
            const res = await fetch(url, options);
            const data = await res.json().catch(() => null);
            const isValid = validator(res, data);

            if (isValid) {
                console.log(`✅ [PASS] ${name} (${res.status}) -> ${path}`);
                passed++;
            } else {
                console.error(`❌ [FAIL] ${name} (${res.status}) -> ${path}`, data);
                failed++;
            }
        } catch (err) {
            console.error(`❌ [ERROR] ${name} -> ${err.message}`);
            failed++;
        }
    }

    // 1. Root & Health
    await testEndpoint("Root Ping", "/", {}, (res, data) => res.status === 200 && data.success === true);
    await testEndpoint("Health Check", "/api/health", {}, (res, data) => res.status === 200 && data.success === true);
    await testEndpoint("Supabase DB Health Check", "/api/health/supabase", {}, (res, data) => res.status === 200 && data.success === true);

    // 2. Curriculum & Roadmaps
    await testEndpoint("Curriculum Full Graph", "/api/roadmaps/curriculum", {}, (res, data) => res.status === 200 && (Array.isArray(data.data) || Array.isArray(data)));
    await testEndpoint("Roadmap Years (Auth Protected)", "/api/roadmaps/years", {}, (res, data) => res.status === 401 && data.success === false);

    // 3. Coding Resources & Productivity
    await testEndpoint("Curated Coding Problems", "/api/resources/coding-problems", {}, (res, data) => res.status === 200 && Array.isArray(data.data));
    await testEndpoint("Productivity Tasks", "/api/productivity/tasks", {}, (res, data) => res.status === 200 && Array.isArray(data.data));
    await testEndpoint("College Events", "/api/events", {}, (res, data) => res.status === 200);

    // 4. 404 Handler
    await testEndpoint("Unmatched Route 404", "/api/nonexistent-route", {}, (res, data) => res.status === 404 && data.success === false);

    // 5. CORS Test for Vercel preview & production domains
    try {
        const corsRes = await fetch(`${baseUrl}/api/health`, {
            headers: { Origin: "https://meridian-preview-123.vercel.app" },
        });
        const allowOrigin = corsRes.headers.get("access-control-allow-origin");
        if (allowOrigin === "https://meridian-preview-123.vercel.app") {
            console.log("✅ [PASS] CORS Header for *.vercel.app domain");
            passed++;
        } else {
            console.error(`❌ [FAIL] CORS Header mismatch: ${allowOrigin}`);
            failed++;
        }
    } catch (err) {
        console.error(`❌ [ERROR] CORS Test -> ${err.message}`);
        failed++;
    }

    server.close();

    console.log("\n========================================================");
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("========================================================\n");

    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

runTests();
