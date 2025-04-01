import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server"; 

export async function POST(req) {
    await dbConnect();

    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ status: 400, message: "All fields are required" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ status: 401, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: role || "job_seeker", // Default role if not provided
        });

        await newUser.save();

        return NextResponse.json({
            status: 201,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("Error while signing up:", error);
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
