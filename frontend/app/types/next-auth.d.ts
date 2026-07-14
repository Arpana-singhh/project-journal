import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    avatar?: string;
    isAccountVerified?: boolean;
    accessToken?: string;
  }

  interface Session {
    // accessToken intentionally omitted: it must never reach the browser.
    // It stays inside the JWT (HttpOnly cookie) and is only read server-side via getToken().
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
