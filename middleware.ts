import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN = ["/admin", "/api/admin"];
const TEACHER = ["/dash", "/classes", "/students", "/attendance", "/leaves", "/reports", "/tasks", "/subjects", "/schedule"];
const STUDENT = ["/portal"];

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const path = req.nextUrl.pathname;
    if (ADMIN.some((p) => path.startsWith(p)) && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (TEACHER.some((p) => path.startsWith(p)) && role !== "TEACHER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (STUDENT.some((p) => path.startsWith(p)) && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/login") || path.startsWith("/api/auth")) return true;
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    "/dash/:path*",
    "/classes/:path*",
    "/students/:path*",
    "/attendance/:path*",
    "/leaves/:path*",
    "/reports/:path*",
    "/tasks/:path*",
    "/subjects/:path*",
    "/schedule/:path*",
    "/portal/:path*",
    "/admin/:path*",
    "/api/((?!auth).*)"
  ]
};
