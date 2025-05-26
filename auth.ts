import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
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
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken || token.accessToken;

        if (account?.provider === "google" && account.id_token) {
          try {
            const response = await fetch(`${BASE_URL}/auth/social-login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${account.id_token}`,
              },
              body: JSON.stringify({ provider: "google", idToken: account.id_token }),
            });

            if (response.ok) {
              const responseData = await response.json();
              token.user = {
                ...responseData.user,
                accessToken: responseData.token,
              };
              token.accessToken = responseData.token;
            } else {
              console.error("API login failed:", await response.json());
            }
          } catch (error) {
            console.error("Error calling API:", error);
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as ExtendedUser;
      session.accessToken = token.accessToken;
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google" && account?.id_token) {
        try {
          const response = await fetch(`${BASE_URL}/api/auth/social-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${account.id_token}`,
            },
            body: JSON.stringify({ provider: "google", idToken: account.id_token }),
          });

          if (!response.ok) {
            console.error("User registration failed with status:", response.status);
            console.error("Error details:", await response.json());
            return false;
          }

          const responseData = await response.json();
          user = {
            ...responseData.user,
            token: responseData.token,
          };

          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig);