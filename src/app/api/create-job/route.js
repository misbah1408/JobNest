import dbConnect from "@/lib/dbConnect";
import JobModel from "@/model/Job";

export async function POST(request) {
  await dbConnect();

  try {
    const { title, description, company, location, salary, postedBy, jobType } =
      await request.json();

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
