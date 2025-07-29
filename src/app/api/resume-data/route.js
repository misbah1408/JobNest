import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ResumeModel from "@/model/Resume";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // const { userId } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId")
    console.log(userId);
    
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
