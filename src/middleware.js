import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If logged in, prevent access to auth pages
  if (token && ["/sign-in", "/sign-up", "/verify"].includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not logged in, restrict access to protected routes
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next(); // Allow request to proceed
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};