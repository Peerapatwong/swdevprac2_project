import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "admin" | "member";
    token: string;
  }
  interface Session {
    user: DefaultSession["user"] & AuthUser;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "member";
    token: string;
  }
}
