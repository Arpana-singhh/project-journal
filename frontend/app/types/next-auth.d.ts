import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    avatar?: string;
    isAccountVerified?: boolean;
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role?: string;
      avatar?: string;
      isAccountVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    avatar?: string;
    isAccountVerified?: boolean;
  }
}
