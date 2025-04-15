import { NextResponse } from "next/server";
import axios from 'axios';
import { getShortlistDecisions } from "@/lib/geminiShortlistBatch";

// A server-compatible function to extract text from PDFs using axios and pdf-parse-fork
async function getResumeContentFromUrl(resumeUrl) {
  try {
    // Dynamically import pdf-parse-fork to avoid initialization issues
    const pdfParse = (await import('pdf-parse-fork')).default;
    
    // Fetch the PDF as an ArrayBuffer using axios
    const response = await axios.get(resumeUrl, {
      responseType: 'arraybuffer'
    });
    
    // Use pdf-parse to extract text
    const data = await pdfParse(Buffer.from(response.data));
    
    // Return the extracted text
    return data.text;
  } catch (error) {
    console.error("Error processing PDF:", error);
    return "Error reading resume.";
  }
}

export async function POST(req) {
    try {
        // Destructure applicants from the request body
        const { applicants, jobDescription } = await req.json();
        
        // Process applicants
        const processedApplicants = await Promise.all(
          applicants.map(async (app) => {
            const resumeContent = await getResumeContentFromUrl(app.resumeUrl);
            return {
              applicationId: app.applicationId,
              resume: resumeContent,
              coverLetter: app.coverLetter,
            };
          })
        );

        // console.log(processedApplicants);
        const atsApplicants = await getShortlistDecisions(processedApplicants, jobDescription)
        console.log(atsApplicants);
        
        // After processing, return the response to the client
        return NextResponse.json({
          success: true,
          message: 'Applicants processed successfully',
          topApplicants: atsApplicants,
        }, {status: 200});
      } catch (error) {
        console.error("Error processing applicants:", error);
        return NextResponse.json({
          success: false,
          message: 'An error occurred while processing the applicants',
          error: error.message,
        }, {status: 500});
      }
}