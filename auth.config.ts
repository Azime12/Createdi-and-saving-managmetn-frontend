import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = [
        "/dashboard",
        "/profile",
        "/settings",
      ].some(path => nextUrl.pathname.startsWith(path));

      const isOnAuthRoute = [
        "/auth/login",
        "/auth/register",
        "/auth/request-reset",
        "/"
      ].includes(nextUrl.pathname);

      if (
        nextUrl.pathname.startsWith("/_next/") ||
        nextUrl.pathname.startsWith("/api/") ||
        nextUrl.pathname.includes(".")
      ) {
        return true;
      }

      if (isLoggedIn && isOnAuthRoute) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (!isLoggedIn && isOnProtectedRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
      }

      return true;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
      }
      return token;
    },
  },
  providers: [],
} satisfies NextAuthConfig;