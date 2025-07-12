import dbConnect from "@/lib/dbConnect";
import JobModel from "@/model/Job";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();

  const token = await getToken({ req: request });

  if (!token) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const jobDetails = await JobModel.findById(id);

    if (!jobDetails) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Job not found",
        }),
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jobDetails,
    });
  } catch (error) {
    console.error("Error while fetching job details:", error.message);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong",
      }),
      { status: 500 }
    );
  }
}
