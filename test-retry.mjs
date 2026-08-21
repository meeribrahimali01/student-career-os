/**
 * Unit Tests for Transient Gemini Error Handling & Exponential Backoff Retries
 * 
 * Verifies:
 * 1. Immediate success (1 attempt, 0 retries).
 * 2. 503 UNAVAILABLE then success on 2nd attempt.
 * 3. 503 UNAVAILABLE 3 times (exhaustion ➔ structured AI_TEMPORARILY_UNAVAILABLE error).
 * 4. 429 Too Many Requests then success on 2nd attempt.
 * 5. Permanent 4xx error (400 Bad Request) fails immediately with 0 retries.
 */

import {
  analyzeCareerGap,
  isTransientError,
  AIUnavailableError,
  AIClientError,
} from "./ai/career-gap-analyzer.mjs";

const sampleStudent = {
  name: "Rahul",
  year: 2,
  branch: "CSE",
  cgpa: 8.2,
  careerGoal: "Software Developer",
  skills: ["C", "Java"],
  interests: ["Web Development"],
};

const mockValidResponse = {
  readinessScore: 50,
  strengths: ["Good foundation in C and Java"],
  skillGaps: ["JavaScript", "Git & GitHub"],
  prioritySkills: ["JavaScript", "Git"],
  recommendedProjects: ["Portfolio Website"],
  thirtyDayPlan: ["Days 1-7: Learn JavaScript"],
  summary: "Solid foundation, needs web development skills.",
};

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    throw new Error(message);
  }
}

async function runRetryUnitTests() {
  console.log("================================================================");
  console.log("🧪 TESTING EXPONENTIAL BACKOFF RETRIES & ERROR RECOVERY");
  console.log("================================================================\n");

  const recordedDelays = [];
  const mockSleep = async (ms) => {
    recordedDelays.push(ms);
  };

  // TEST 1: Immediate Success
  console.log("✅ Test 1: Immediate Success (1 attempt, 0 retries)...");
  recordedDelays.length = 0;
  let test1Calls = 0;
  const mockFetch1 = async () => {
    test1Calls++;
    return {
      ok: true,
      status: 200,
      json: async () => mockValidResponse,
    };
  };

  const res1 = await analyzeCareerGap(sampleStudent, {
    fetchFn: mockFetch1,
    sleepFn: mockSleep,
  });
  assert(test1Calls === 1, "Immediate success should only make 1 call");
  assert(recordedDelays.length === 0, "No delays should be triggered on immediate success");
  assert(res1.readinessScore === 50, "Valid response returned");
  console.log("   Passed.\n");

  // TEST 2: 503 then Success
  console.log("🔄 Test 2: 503 UNAVAILABLE then Success on 2nd attempt...");
  recordedDelays.length = 0;
  let test2Calls = 0;
  const mockFetch2 = async () => {
    test2Calls++;
    if (test2Calls === 1) {
      return {
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        text: async () => "This model is currently experiencing high demand. Spikes in demand are usually temporary.",
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => mockValidResponse,
    };
  };

  const res2 = await analyzeCareerGap(sampleStudent, {
    fetchFn: mockFetch2,
    sleepFn: mockSleep,
    retryDelays: [1000, 2000, 4000],
  });
  assert(test2Calls === 2, "Should have made exactly 2 attempts");
  assert(recordedDelays.length === 1 && recordedDelays[0] === 1000, "Should have waited 1000ms before retry 1");
  assert(res2.readinessScore === 50, "Valid response received after retry");
  console.log("   Passed.\n");

  // TEST 3: 503 Three Times (Exhaustion -> Structured Error)
  console.log("🛑 Test 3: 503 UNAVAILABLE three times (Exhaustion ➔ Structured Error)...");
  recordedDelays.length = 0;
  let test3Calls = 0;
  const mockFetch3 = async () => {
    test3Calls++;
    return {
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      text: async () => "High demand",
    };
  };

  let caughtError3 = null;
  try {
    await analyzeCareerGap(sampleStudent, {
      fetchFn: mockFetch3,
      sleepFn: mockSleep,
      maxRetries: 3,
      retryDelays: [1000, 2000, 4000],
    });
  } catch (err) {
    caughtError3 = err;
  }

  assert(test3Calls === 4, `Should make 4 attempts total (1 initial + 3 retries), made: ${test3Calls}`);
  assert(
    recordedDelays.length === 3 &&
    recordedDelays[0] === 1000 &&
    recordedDelays[1] === 2000 &&
    recordedDelays[2] === 4000,
    "Should follow exponential backoff: 1s, 2s, 4s"
  );
  assert(caughtError3 instanceof AIUnavailableError, "Error must be AIUnavailableError");
  assert(caughtError3.error?.code === "AI_TEMPORARILY_UNAVAILABLE", "Error code must be AI_TEMPORARILY_UNAVAILABLE");
  assert(caughtError3.error?.retryable === true, "Error must indicate retryable: true");
  console.log("   Structured Error Output:", JSON.stringify(caughtError3.error, null, 2));
  console.log("   Passed.\n");

  // TEST 4: 429 then Success
  console.log("🔄 Test 4: 429 Too Many Requests then Success on 2nd attempt...");
  recordedDelays.length = 0;
  let test4Calls = 0;
  const mockFetch4 = async () => {
    test4Calls++;
    if (test4Calls === 1) {
      return {
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        text: async () => "RESOURCE_EXHAUSTED: Rate limit exceeded",
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => mockValidResponse,
    };
  };

  const res4 = await analyzeCareerGap(sampleStudent, {
    fetchFn: mockFetch4,
    sleepFn: mockSleep,
  });
  assert(test4Calls === 2, "Should succeed on 2nd attempt after 429");
  assert(recordedDelays.length === 1 && recordedDelays[0] === 1000, "Waited 1000ms before retry");
  assert(res4.readinessScore === 50, "Valid response received");
  console.log("   Passed.\n");

  // TEST 5: Permanent 4xx Error (400 Bad Request)
  console.log("🚫 Test 5: Permanent 4xx Error (400 Bad Request ➔ 0 retries)...");
  recordedDelays.length = 0;
  let test5Calls = 0;
  const mockFetch5 = async () => {
    test5Calls++;
    return {
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () => JSON.stringify({ error: "Invalid student payload" }),
    };
  };

  let caughtError5 = null;
  try {
    await analyzeCareerGap(sampleStudent, {
      fetchFn: mockFetch5,
      sleepFn: mockSleep,
    });
  } catch (err) {
    caughtError5 = err;
  }

  assert(test5Calls === 1, `Non-retryable 400 error should ONLY make 1 attempt, made: ${test5Calls}`);
  assert(recordedDelays.length === 0, "No delays should occur for 400 error");
  assert(caughtError5 instanceof AIClientError, "Error must be AIClientError");
  assert(caughtError5.statusCode === 400, "Error status must be 400");
  assert(caughtError5.retryable === false, "Error must indicate retryable: false");
  console.log("   Passed.\n");

  console.log("================================================================");
  console.log("🎉 ALL 5 RETRY UNIT TESTS PASSED SUCCESSFULLY!");
  console.log("================================================================");
}

runRetryUnitTests().catch((err) => {
  console.error("❌ Retry unit test failed:", err);
  process.exit(1);
});
