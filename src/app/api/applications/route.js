import ApplicationModel from "@/model/Application";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
  await dbConnect();

  try {
    const { resumeUrl, coverLetter, status, jobId, userId } =
      await request.json();

    // Validate required fields
    if (!resumeUrl || !jobId || !userId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }
    const existedAppliction = await ApplicationModel.findOne({jobId, userId})
    if(existedAppliction){
        return new Response(
            JSON.stringify({
              success: false,
              message: "Already applied",
            }),
            { status: 401 }
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Application submitted successfully",
        data: {
          id: newApplication._id,
          jobId: newApplication.jobId,
          userId: newApplication.userId,
          resumeUrl: newApplication.resumeUrl,
          coverLetter: newApplication.coverLetter,
          status: newApplication.status,
        },
      }),
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
