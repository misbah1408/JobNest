import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(request) {
  await dbConnect();

  try {
    const { name, username, email, password, role } = await request.json();

    if (!name || !username || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    const existingUserByUsername = await UserModel.findOne({
      username: normalizedUsername,
    });

    if (existingUserByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "Username already taken" }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email: normalizedEmail });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpires = new Date(Date.now() + 3600000); // 1 hour expiration

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({ success: false, message: "Email already exists" }),
          { status: 400 }
        );
      } else {
        // Update unverified user with new password and verification code
        existingUserByEmail.password = await bcrypt.hash(password, 10);
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = verifyCodeExpires;
        await existingUserByEmail.save();
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username: normalizedUsername,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
        isVerified: false,
        role: role || "job_seeker",
      });
      // console.log(newUser);
      
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(normalizedEmail, normalizedUsername, verifyCode);

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({ success: false, message: emailResponse.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please verify your email",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in sign-up route: ", error.message);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
