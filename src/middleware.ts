import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const role = req.nextauth.token?.role;

    // Role-based access control
    if (path.startsWith("/audit-logs") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/inventory") && !["ADMIN", "MANAGER"].includes(role as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/attendance/:path*",
    "/audit-logs/:path*",
    "/" // Protect root and redirect to dashboard if logged in, handled by next config or page
  ],
};
