import { GoogleGenAI, Type } from "npm:@google/genai@2.18.0";

const ai = new GoogleGenAI({
  apiKey: Deno.env.get("GEMINI_API_KEY"),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle browser CORS request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    const student = body.student;

    if (!student) {
      return new Response(
        JSON.stringify({
          error: "Student data is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const prompt = `
You are an AI Career Gap Analyzer for college students.

Analyze the following student's profile and determine how prepared they are
for their target career.

STUDENT PROFILE:
Name: ${student.name}
Year: ${student.year}
Branch: ${student.branch}
CGPA: ${student.cgpa}
Career Goal: ${student.careerGoal}
Current Skills: ${student.skills?.join(", ")}
Interests: ${student.interests?.join(", ")}

Your job is to:

1. Estimate the student's career readiness from 0 to 100.
2. Identify their current strengths.
3. Identify important missing skills.
4. Rank the most important skills they should learn.
5. Recommend practical projects.
6. Create a simple 30-day learning plan.
7. Give a short personalized summary.

Keep recommendations realistic for a college student.
Do not invent work experience, certifications, or achievements.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: {
              type: Type.NUMBER,
              description: "Career readiness score from 0 to 100",
            },
            strengths: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            prioritySkills: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            recommendedProjects: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            thirtyDayPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            summary: {
              type: Type.STRING,
            },
          },
          required: [
            "readinessScore",
            "strengths",
            "skillGaps",
            "prioritySkills",
            "recommendedProjects",
            "thirtyDayPlan",
            "summary",
          ],
        },
      },
    });

    return new Response(response.text, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Career Gap Analyzer Error:", error);

    return new Response(
      JSON.stringify({
        error: "AI Career Gap Analyzer failed",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});