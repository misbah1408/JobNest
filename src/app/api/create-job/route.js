import dbConnect from "@/lib/dbConnect";
import JobModel from "@/model/Job";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const token = await getToken({ req: request });

  if (token.role !== "employer") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      jobTitle,
      jobDescription,
      companyName,
      location,
      salary,
      jobType,
      skills,
      jobStatus,
      expiryDate,
      interviewDuration,
    } = data || {};

    // console.log(data);

    // Validate required fields
    if (
      !jobTitle ||
      !jobDescription ||
      !companyName ||
      !location ||
      !skills ||
      !Array.isArray(skills) ||
      skills.length === 0 ||
      !expiryDate ||
      !interviewDuration
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Missing required fields. Please ensure all fields are filled including skills, expiry date, and interview duration.",
        }),
        { status: 400 }
      );
    }

    // Validate expiry date is in the future
    const expiryDateObj = new Date(expiryDate);
    if (expiryDateObj <= new Date()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Expiry date must be in the future",
        }),
        { status: 400 }
      );
    }

    // Validate jobType enum
    const validJobTypes = ["Full-time", "Part-time", "Remote", "Internship"];
    if (!validJobTypes.includes(jobType)) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Invalid job type. Must be one of: Full-time, Part-time, Remote, Internship",
        }),
        { status: 400 }
      );
    }

    // Validate interviewDuration enum
    const validDurations = ["5m", "10m", "15m", "30m", "60m"];
    if (!validDurations.includes(interviewDuration)) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Invalid interview duration. Must be one of: 5m, 10m, 15m, 30m, 60m",
        }),
        { status: 400 }
      );
    }

    // Map frontend field names to schema field names
    const newJob = new JobModel({
      jobTitle, // Changed from jobTitle
      jobDescription, // Changed from jobDescription
      companyName, // Changed from companyName
      location,
      salary: salary || "Not disclosed",
      postedBy: token?._id,
      jobType,
      skills,
      jobStatus: jobStatus || false,
      expiryDate: expiryDateObj,
      interviewDuration,
    });

    await newJob.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "New job created successfully",
        data: {
          id: newJob._id,
          jobTitle: newJob.title, // Map back to frontend field names
          jobDescription: newJob.description,
          companyName: newJob.company,
          location: newJob.location,
          salary: newJob.salary,
          postedBy: newJob.postedBy,
          jobType: newJob.jobType,
          skills: newJob.skills,
          jobStatus: newJob.jobStatus,
          expiryDate: newJob.expiryDate,
          interviewDuration: newJob.interviewDuration,
          createdAt: newJob.createdAt,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create-job route: ", error.message);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong",
      }),
      { status: 500 }
    );
  }
}

// Rest of your GET, PUT, DELETE methods remain the same...
export async function GET(request) {
  await dbConnect();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || null;

  const skip = (page - 1) * limit;

  try {
    const jobs = await JobModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JobModel.countDocuments();

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await dbConnect();
  const token = await getToken({ req: request });

  if (!token.role === "employer") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    const { jobId } = data;
    // console.log(data["updatedData"]);
    let updateData = data["updatedData"];
    updateData.isActive = updateData.jobStatus;
    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Find the job and check if user owns it or is admin
    const job = await JobModel.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Update the job
    const updatedJob = await JobModel.findByIdAndUpdate(jobId, updateData, {
      new: true,
    });
    // console.log(updatedJob);

    return NextResponse.json(
      {
        success: true,
        message: "Job updated successfully",
        data: updatedJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating job: ", error.message);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await dbConnect();
  const token = await getToken({ req: request });
  // console.log(token);

  if (!token.role === "employer") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    // console.log(jobId);

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    // Find the job and check if user owns it or is admin
    const job = await JobModel.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    await JobModel.findByIdAndDelete(jobId);

    return NextResponse.json(
      { success: true, message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting job: ", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
