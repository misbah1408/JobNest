import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // 1. Pass the secret explicitly here
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const url = request.nextUrl;

  // 2. Debugging (Optional: Check Vercel logs to see if token appears now)
  // console.log("Middleware Token:", token ? "Found" : "Missing");

  if (token && ["/sign-in", "/sign-up", "/verify"].includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};