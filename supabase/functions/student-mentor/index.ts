import { GoogleGenAI } from "@google/genai";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle browser CORS request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { student, question } = await req.json();

    // Check input
    if (!student || !question) {
      return new Response(
        JSON.stringify({
          error: "student and question are required",
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

    // Get Gemini API key from Supabase Secret
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Create personalized prompt
    const prompt = `
You are an AI Student Career Mentor.

You help college students from first year until placement.

STUDENT PROFILE:

Name: ${student.name}
Year: ${student.year}
Branch: ${student.branch}
CGPA: ${student.cgpa}
Career Goal: ${student.careerGoal}
Skills: ${student.skills?.join(", ") || "Not provided"}

STUDENT QUESTION:

${question}

Give a personalized answer based on the student's
year, skills, academic situation and career goal.

Structure your response as:

1. Direct Answer
2. Explanation
3. What To Do Next
4. Recommended Learning
5. Advice For This Year

Keep the answer practical and easy for a college student
to understand.
`;

    // Generate AI response
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return new Response(
      JSON.stringify({
        answer: response.text,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("AI Error:", error);

    return new Response(
      JSON.stringify({
        error: "AI service failed",
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