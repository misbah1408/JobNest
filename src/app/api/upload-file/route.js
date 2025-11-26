import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getToken } from "next-auth/jwt";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

export async function POST(request) {
  const token = await getToken({ req: request }); // This is correct

//   console.log("Token:", token); // if null, keep reading...

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData?.get("file") || formData?.get("files[]");
    // console.log(formData);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "jobnest-uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    // console.log(result);  
    
    return NextResponse.json(
      {
        publicId: result.public_id,
        secure_url: result?.secure_url
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Upload image failed", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}
