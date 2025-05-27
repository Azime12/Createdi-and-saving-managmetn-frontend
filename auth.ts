import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { BASE_URL } from "./constants/apiConfig";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  accessToken?: string;
  loginBy?: "google" | "credentials";
  idToken?: string;
  roles?: Array<{
    name: string;
    permissions: string[];
  }>;
}

interface ExtendedSession {
  user: ExtendedUser;
  accessToken?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        token: { label: "Token", type: "text" },
        user: { label: "User", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token || !credentials?.user || typeof credentials.user !== "string") {
          throw new Error("Invalid token or user data");
        }

        try {
          const user: ExtendedUser = JSON.parse(credentials.user);
          return {
            ...user,
            accessToken: credentials.token as string,
            loginBy: "credentials",
          };
        } catch (error) {
          throw new Error("Failed to parse user data");
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && account?.id_token) {
        try {
          const res = await fetch(`${BASE_URL}/auth/social-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${account.id_token}`,
            },
            body: JSON.stringify({ provider: "google", idToken: account.id_token }),
          });

          if (!res.ok) {
            console.error("❌ Google signIn API error:", await res.text());
            return false;
          }

          const result = await res.json();

          // Attach user info temporarily to be stored in JWT later
          user.id = result.user.id;
          user.name = result.user.name;
          user.email = result.user.email;
          user.image = result.user.image;
          user.roles = result.user.roles;
          user.accessToken = result.token;
          user.loginBy = "google";

          return true;
        } catch (err) {
          console.error("🔥 Error during Google social-login:", err);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as ExtendedUser;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  // Optional: enable debug logging
  // debug: true,
} satisfies NextAuthConfig);
