import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { username } = await params;
    await dbConnect();

    try {
        const user = await UserModel.findOne({ username }).select("-password -verifyCodeExpires -verifyCode");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
