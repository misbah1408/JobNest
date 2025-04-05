import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  try {
    const userId = token._id; // or token.sub depending on your JWT config
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    const formData = await request.json();

    // Update user fields from formData
    Object.assign(user, formData);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in saving profile: ", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
