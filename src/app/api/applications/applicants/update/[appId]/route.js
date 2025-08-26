import { NextResponse } from "next/server";
import ApplicationModel from "@/model/Application";
import dbConnect from "@/lib/dbConnect";
import JobModel from "@/model/Job";
import UserModel from "@/model/User";

export async function PATCH(request, { params }) {
  const { appId } = await params;

  if (!appId) {
    return NextResponse.json(
      { error: "Application ID is required" },
      { status: 400 }
    );
  }

  try {
    const payload = await request.json();
    // console.log(employerNotes, status);
    // console.log(payload);

    if (!payload) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(
      appId,
      payload,
      { new: true }
    );
    // console.log(updatedApplication);

    if (!updatedApplication) {
      return NextResponse.json(
        { error: "Application not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  await dbConnect();

  const { appId } = await params;
  console.log("Application ID:", appId);

  if (!appId) {
    return NextResponse.json(
      { error: "Application ID is required" },
      { status: 400 }
    );
  }

  try {
    // Find application
    const application = await ApplicationModel.findById(appId);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Fetch related job + user
    const jobDetails = await JobModel.findById(application.jobId);
    const user = await UserModel.findById(application.userId);

    return NextResponse.json(
      { application, jobDetails, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
