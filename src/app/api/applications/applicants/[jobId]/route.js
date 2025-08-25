import ApplicationModel from "@/model/Application";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    const { jobId } = await params;
    // console.log("jobId:", jobId);

    try {
        const applications = await ApplicationModel.aggregate([
            {
                $match: {
                    jobId: new mongoose.Types.ObjectId(jobId) // assuming jobId is an ObjectId
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 1,
                    jobId: 1,
                    userId: 1,
                    status: 1,
                    resumeUrl: 1,
                    coverLetter: 1,
                    appliedAt: 1,
                    employerNotes: 1,
                    matchScore:1,
                    user: {
                        _id: "$userDetails._id",
                        name: "$userDetails.name",
                        email: "$userDetails.email",
                        username: "$userDetails.username"
                    }
                }
            }
        ]);

        if (applications.length === 0) {
            return new Response(JSON.stringify({ error: 'Applications not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(applications), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
