import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthService } from "@/app/service/api/auth.services";

const { handlers } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        try {
          const data = await AuthService.login(email, password);

          if (!data.success || !data.token || !data.user) {
            return null;
          }

          const user = data.user as {
            _id: string;
            name: string;
            email: string;
            role: string;
            avatar: string;
            isAccountVerified: boolean;
          };

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isAccountVerified: user.isAccountVerified,
            accessToken: data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.avatar = user.avatar;
        token.isAccountVerified = user.isAccountVerified;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.avatar = token.avatar as string;
      session.user.isAccountVerified = token.isAccountVerified as boolean;
      return session;
    },
  },
});

export const { GET, POST } = handlers;
