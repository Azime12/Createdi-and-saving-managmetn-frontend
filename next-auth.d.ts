// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    roles?: {
      role: string;
      permissions: string[];
    }[];
    accessToken?: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
  }
}
