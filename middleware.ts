// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = [
    { path: "/dashboard", roles: ["Admin", "LoanOfficer", "Accountant", "Customer"] },
    { path: "/admin", roles: ["Admin"] },
    { path: "/loans", roles: ["Admin", "LoanOfficer"] },
    { path: "/accounting", roles: ["Admin", "Accountant"] }
  ];

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check protected routes
  const routeConfig = protectedRoutes.find(route => pathname.startsWith(route.path));
  
  if (routeConfig) {
    if (!session?.user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!routeConfig.roles.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Redirect authenticated users from auth pages
  const authRoutes = ["/auth/login", "/auth/register"];
  if (session?.user && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};