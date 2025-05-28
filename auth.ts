// auth.ts
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        token: { label: "Token", type: "text" },
        user: { label: "User", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.token || !credentials?.user) {
            throw new Error("Invalid credentials");
          }

          const user = typeof credentials.user === 'string' 
            ? JSON.parse(credentials.user) 
            : credentials.user;

          return {
            ...user,
            accessToken: credentials.token,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
});