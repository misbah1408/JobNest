import ApplicationModel from "@/model/Application";
import dbConnect from "@/lib/dbConnect";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

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
    const { resumeUrl, coverLetter, status, jobId } = await request.json();
    // Validate required fields
    // console.log(resumeUrl, jobId, coverLetter);
    console.log(resumeUrl);
    

    if (!resumeUrl || !jobId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }
    const existedAppliction = await ApplicationModel.findOne({ jobId, userId });
    if (existedAppliction) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Already applied",
        }),
        { status: 208 }
      );
    }
    // Default status if not provided
    const applicationStatus = status || "pending";

    const newApplication = new ApplicationModel({
      jobId,
      userId,
      resumeUrl,
      coverLetter,
      status: applicationStatus,
    });

    await newApplication.save();

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: {
          id: newApplication._id,
          resumeUrl: newApplication.resumeUrl,
          coverLetter: newApplication.coverLetter,
          status: newApplication.status,
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
