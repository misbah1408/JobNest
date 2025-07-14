import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const {
    jobTitle,
    companyName,
    jobType,
    location,
    salary,
    expiryDate,
    skills,
  } = await req.json();
  console.log(
    jobTitle,
    companyName,
    jobType,
    location,
    salary,
    expiryDate,
    skills
  );

  const prompt = `
You are an expert recruiter. Using the following job details, generate a professional job description in the exact format below:

- Job Title: ${jobTitle}
- Company Name: ${companyName}
- Job Type: ${jobType}
- Location: ${location}
- Salary: ${salary}
- Application Expiry Date: ${expiryDate}
- Required Skills: ${skills}

🟢 Start with a **1-line summary under 20 words** about the role (do not include company or title).

Then write the full job description using the following **exact numbered format** (do not skip any section):

1. **About the Company**  
Introduce the company — its mission, industry, what it does, and why it’s a great place to work.

2. **Job Overview**  
Describe the job in detail: responsibilities, the team, who the company is looking for, and what impact the person will make.

3. **Responsibilities** (each as a new line)  
- Use bullet points  
- Focus on real tasks the candidate will do

4. **Requirements** (each as a new line)  
- Use bullet points  
- Mention skills, qualifications, tools, tech, or experience

5. **Benefits**  
Mention perks, work environment, flexibility, or compensation.

💡 End with a 1-line call-to-action encouraging candidates to apply before the expiry date.

Use **markdown formatting** with bold section titles and blank lines between bullet points for clear readability.

Keep total word count under 300.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({ description: text });
  } catch (err) {
    console.error("Gemini error:", err);
    return Response.json(
      { error: "Failed to generate description." },
      { status: 500 }
    );
  }
}
