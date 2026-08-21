import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const student = {
  name: "Rahul",
  year: 1,
  branch: "CSE",
  cgpa: 8.2,
  careerGoal: "Software Developer",
  skills: ["C", "Java basics"],
};

const question = "Should I start DSA now?";

const prompt = `
You are an AI Student Career Mentor.

Your job is to guide college students from their first year
until placement.

Here is the student's profile:

Name: ${student.name}
Year: ${student.year}
Branch: ${student.branch}
CGPA: ${student.cgpa}
Career Goal: ${student.careerGoal}
Skills: ${student.skills.join(", ")}

Student's question:
"${question}"

Give a personalized answer.

Your response should contain:

1. Direct answer
2. Explanation
3. What the student should do next
4. A small learning plan
5. Important advice for this student's year
`;

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  console.log("\n===== AI STUDENT MENTOR =====\n");
  console.log(response.text);
}

main();