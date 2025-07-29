import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";
import ResumeModel from "@/model/Resume";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const token = await getToken({ req });
  if (!token) {
    return new Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  await dbConnect();
  try {
    const userId = token?._id;

    const { resumeUrl } = await req.json();
    if (!resumeUrl) {
      return NextResponse.json(
        { error: "resumeUrl is required" },
        { status: 400 }
      );
    }

    // Fetch resume file from Cloudinary
    const pdfParse = (await import("pdf-parse-fork")).default;

    // Fetch the PDF as an ArrayBuffer using axios
    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    // Use pdf-parse to extract text
    let resumeText = "";
    // Detect file type (now using pdf-parse instead of PDFExtract)
    if (resumeUrl.endsWith(".pdf")) {
      const data = await pdfParse(Buffer.from(response.data));
      resumeText = data.text;
    } else if (resumeUrl.endsWith(".docx")) {
      const { value } = await mammoth.extractRawText({ buffer });
      resumeText = value;
    } else if (resumeUrl.endsWith(".txt")) {
      resumeText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Build prompt
    const prompt = `
Extract the following structured data from the resume below.
You are an AI system that extracts structured information from resumes.  
When given a resume text, identify and return the candidate’s details in the following JSON format.  
If any information is missing, return an empty string for that field.  
Be accurate and concise.
Resume Text:
${resumeText}

Output JSON ONLY:
{
  "personal": {
    "tagline": ""(make tag line from resume content),
    "about": ""(summary),
    "email": "",
    "state": "",
    "skills": []
  },
  "education": [
    {
      "college_university": "",
      "graduation_year": "",
      "field_of_study": "",
      "degree": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "link": "",
      "description": "",
      "technologies": []
    }
  ],
  "work_experience": [
    {
      "job_title": "",
      "company": "",
      "duration": "",
      "responsibilities": ""
    }
  ]
}
Missing fields should be empty strings or empty arrays.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    // Gemini may sometimes return Markdown code blocks — strip them
    let text = result.response.text().trim();
    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, "").trim();
    }

    const extracted = JSON.parse(text);
    const resume = await ResumeModel.findOneAndUpdate(
      { userId }, // search by userId
      {
        userId,
        resumeUrl,
        personal: extracted.personal,
        education: extracted.education,
        projects: extracted.projects,
        work_experience: extracted.work_experience,
        parsedAt: new Date(),
        modelUsed: "gemini-2.0-flash",
      },
      { upsert: true, new: true } // new:true returns updated doc
    );
    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error("Error extracting resume:", error);
    return NextResponse.json(
      { error: "Failed to extract resume" },
      { status: 500 }
    );
  }
}
