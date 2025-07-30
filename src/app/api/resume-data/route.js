import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResumeModel from "@/model/Resume";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // const { userId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    // console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const resume = await ResumeModel.findOne({ userId });

    if (!resume) {
      return NextResponse.json({ message: "No resume found", resume: null });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await dbConnect();

  // Check token for authentication
  const token = await getToken({ req });
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    // Extract query param
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json(
        { success: false, message: "Resume ID required" },
        { status: 400 }
      );
    }

    // Parse incoming JSON
    const { personal, education, projects, work_experience } = await req.json();

    // Find resume by ID
    const getResume = await ResumeModel.findById(resumeId);

    if (!getResume) {
      return new Response.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }
    // Update fields (only provided ones)
    if (personal) getResume.personal = personal;
    if (education) getResume.education = education;
    if (projects) getResume.projects = projects;
    if (work_experience) getResume.work_experience = work_experience;

    // Save updated resume
    await getResume.save();

    return NextResponse.json(
      {
        success: true,
        message: "Resume updated successfully",
        resume: getResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resume update error:", error);
    return (
      NextResponse.json({
        success: false,
        message: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
