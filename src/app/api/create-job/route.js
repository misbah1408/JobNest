import dbConnect from "@/lib/dbConnect";
import JobModel from "@/model/Job";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const token = await getToken({ req: request });
  console.log(token);
  
  if (token.role !== "employer") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();
      const { title, description, company, location, salary, postedBy, jobType } = data || {};
      console.log(data);
      
    if (
      !title ||
      !description ||
      !company ||
      !location ||
      !postedBy ||
      !jobType
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const newJob = new JobModel({
      title,
      description,
      company,
      location,
      salary: salary || "Not discosed",
      postedBy,
      jobType,
    });

    await newJob.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "New job created successfully",
        data: {
          id: newJob._id,
          title: newJob.title,
          description: newJob.description,
          company: newJob.company,
          location: newJob.location,
          salary: newJob.salary,
          postedBy: newJob.postedBy,
          jobType: newJob.jobType,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create-job route: ", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong",
      }),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const postedBy = searchParams.get("postedBy");
    // console.log("searchParams ",searchParams);

    const filter = postedBy ? { postedBy } : {};

    const jobs = await JobModel.find(filter);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        { success: false, message: "No jobs found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Jobs fetched successfully", jobs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching jobs: ", error.message);
    return NextResponse.json(
      { error: "Error in fetching jobs" },
      { status: 500 }
    );
  }
}
