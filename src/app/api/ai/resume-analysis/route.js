import { GoogleGenerativeAI } from "@google/generative-ai";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const token = await getToken({ req });
  console.log("User token:", token);

  // Uncomment if you want role-based restriction
  // if (token?.role !== "employer") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { resumeText, job } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an expert career coach and recruiter.
Analyze the following resume in the context of the given job details.
Return the analysis in strictly JSON format with this schema:

{
  "matchScore": "<percentage from 0 to 100>",
  "resumeAnalysis": {
    "summary": "<2-3 line summary of candidate profile>",
    "matchingSkills": ["skill1", "skill2", "skill3"],
    "missingSkills": ["skillA", "skillB"],
    "experience": "<3-5 line summary of relevant work experience>",
    "education": "<summary of educational qualifications>",
    "about": {
      "extracurricular": "<extracurriculars or projects>",
      "certifications": "<certifications>",
      "other": "<any other useful highlights>"
    }
  }
}

If a section is not available in the resume, output "N/A".
Do not add explanations or text outside the JSON.

---
Resume:
${resumeText}

Job details:
${JSON.stringify(job)}
    `;

    // console.log("Prompt sent to Gemini:", prompt);

    const result = await model.generateContent(prompt);
    const output = result.response.text();
    // console.log("Raw Gemini Output:", output);

    let analysis;
    try {
      analysis = JSON.parse(output);
    } catch (e) {
      // Attempt cleanup if Gemini adds markdown
      const cleaned = output.replace(/```json|```/g, "").trim();
      try {
        analysis = JSON.parse(cleaned);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid JSON response from Gemini", raw: output },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error("Error in resume analysis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
