import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getShortlistDecisions = async (
  applicants = [],
  jobDescription
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const results = [];

  for (const applicant of applicants) {
    const { applicationId, resume, coverLetter } = applicant;

    const prompt = `You are an ATS (Applicant Tracking System) assistant.
                    Given a resume and a job description, analyze and return the following in JSON format:
                    {
                        "applicationId": "${applicationId}",
                        "matchScore": (integer from 0 to 100),
                        "matchedSummary": [
                            "Highlight 1 - a key match between the resume and job description",
                            "Highlight 2 - another strong alignment",
                            "Optional Highlight 3"
                        ],
                        "shortlistingDecision": "✅ Shortlist" or "❌ Reject",
                        "reason": "Brief but insightful justification for the decision",
                        "consider": true or false
                    }
                    Cover leter:
                    ${coverLetter}

                    Resume:
                    ${resume}

                    Job Description:
                    ${jobDescription}
                    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const match = text.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = match ? match[1] : text;

      const parsed = JSON.parse(jsonString);
      results.push(parsed);
    } catch (error) {
      console.error("Gemini error for app ID", applicationId, error);
      results.push({
        applicationId,
        error: "Failed to analyze resume",
      });
    }
  }
  return results;
};
