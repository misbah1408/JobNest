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
      interviewDuration
    } = data || {};
    
    console.log(data);
      
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
          message: "Missing required fields. Please ensure all fields are filled including skills, expiry date, and interview duration." 
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
          message: "Expiry date must be in the future" 
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
          message: "Invalid job type. Must be one of: Full-time, Part-time, Remote, Internship" 
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
          message: "Invalid interview duration. Must be one of: 5m, 10m, 15m, 30m, 60m" 
        }),
        { status: 400 }
      );
    }

    // Map frontend field names to schema field names
    const newJob = new JobModel({
      jobTitle,           // Changed from jobTitle
      jobDescription, // Changed from jobDescription
      companyName,      // Changed from companyName
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
          jobTitle: newJob.title,        // Map back to frontend field names
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
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
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
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const postedBy = searchParams.get("postedBy");
    const active = searchParams.get("active");
    const jobType = searchParams.get("jobType");
    const location = searchParams.get("location");
    const skills = searchParams.get("skills");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Build filter object
    const filter = {};
    
    if (postedBy) {
      filter.postedBy = postedBy;
    }
    
    if (active === "true") {
      filter.isActive = true;
      filter.jobStatus = true;
      filter.expiryDate = { $gt: new Date() };
    }
    
    if (jobType) {
      filter.jobType = jobType;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.skills = { $in: skillsArray };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    // Execute query with pagination
    const jobs = await JobModel.find(filter)
      .populate('postedBy', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalJobs = await JobModel.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);

    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No jobs found",
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalJobs: 0,
            hasNext: false,
            hasPrev: false
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Jobs fetched successfully", 
        jobs,
        pagination: {
          currentPage: page,
          totalPages,
          totalJobs,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      },
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

export async function PUT(request) {
  await dbConnect();
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    const { jobId, ...updateData } = data;

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

    if (job.postedBy.toString() !== token.sub && token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized to update this job" },
        { status: 403 }
      );
    }

    // Update the job
    const updatedJob = await JobModel.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Job updated successfully",
        data: updatedJob
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating job: ", error.message);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
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
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

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

    if (job.postedBy.toString() !== token.sub && token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized to delete this job" },
        { status: 403 }
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