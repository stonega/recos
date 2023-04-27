import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: profile.name.replace(/\s/g, "").toLowerCase(),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) { token.accessToken = account.access_token
        }
        return token
    },
    async session({ session, user }) {
      // @ts-ignore
      session.user.id = user.id;
      // @ts-ignore
      session.user.username = user.username;
      return session;
    },
  },
};

export default NextAuth(authOptions);
