import ApplicationModel from "@/model/Application";
import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import JobModel from "@/model/Job";
import axios from "axios";

export async function POST(request) {
  await dbConnect();
  const token = await getToken({ req: request });
  // console.log(token);
  if (!token) {
    return new Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = token?._id;
  try {
    const { resumeUrl, coverLetter, status, jobId, job } = await request.json();
    // Validate required fields
    // console.log(resumeUrl, jobId, coverLetter);
    // console.log(resumeUrl);

    if (!resumeUrl || !jobId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }
    const existedAppliction = await ApplicationModel.findOne({ jobId, userId });
    if (existedAppliction) {
      return new Response.json(
        {
          success: false,
          message: "Already applied",
        },
        { status: 208 }
      );
    }
    // Default status if not provided
    const applicationStatus = status || "pending";

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
    
    let candidateAnalysis;
    try {
      const res = await axios.post("http://localhost:3000/api/ai/resume-analysis", {resumeText, job} );
      candidateAnalysis = res.data.analysis;
      // console.log(res.data.analysis);
    } catch (error) {
      console.log(error);
      return NextResponse.json({message:"Error while resume analysis"})
    }
    const {matchScore, resumeAnalysis} = candidateAnalysis;
    const newApplication = new ApplicationModel({
      jobId,
      userId,
      resumeUrl,
      coverLetter,
      status: applicationStatus,
      matchScore,
      resumeAnalysis
    });

    await newApplication.save();
    await JobModel.findByIdAndUpdate(jobId, {
      $addToSet: { applicants: userId },
      $inc: { applications: 1 },
    });

    // console.log(newApplication);

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          id: newApplication._id,
          resumeUrl: newApplication.resumeUrl,
          coverLetter: newApplication.coverLetter,
          status: newApplication.status,
          resumeAnalysis: newApplication.resumeAnalysis
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in application route: ", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();
  const token = await getToken({ req: request });
  if (!token) {
    return new Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const userId = token._id;
    // console.log(token);

    const applications = await ApplicationModel.find({ userId });
    if (!applications) {
      return new Response("No applications found", { status: 404 });
    }
    // console.log(applications);

    return NextResponse.json(
      {
        success: true,
        message: "Applications fetched successfully",
        data: applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching data", error);
    return NextResponse.json(
      { error: "Error while fetching data" },
      { status: 500 }
    );
  }
}
