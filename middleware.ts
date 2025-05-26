import { NextResponse, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { routePermissions } from "@/app/lib/routePermissions";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const response = await auth(request);

  // If NextAuth returned a redirect, respect it
  if (response && (response.status === 302 || response.headers.get("location"))) {
    return response;
  }

  const pathname = request.nextUrl.pathname;

  // Public route exceptions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|svg|js|css|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // Get session from cookies
  const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
                      request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return response;
  }

  // Get the full session using the auth function
  const session = await auth();

  // Access control logic
  const routeEntry = Object.entries(routePermissions).find(([prefix]) =>
    pathname.startsWith(prefix)
  );

  if (routeEntry) {
    const [, requiredPermissions] = routeEntry;

    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const userPermissions = session.user.roles?.flatMap(
      (role: any) => role.permissions
    ) || [];

    const hasAccess = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth|403|404).*)",
  ],
};