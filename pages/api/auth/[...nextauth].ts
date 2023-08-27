import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider, {
  SendVerificationRequestParams,
} from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          // username: profile.name.replace(/\s/g, "").toLowerCase(),
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
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
};

async function sendVerificationRequest({
  identifier: email,
  url,
  provider: { server, from },
}: SendVerificationRequestParams) {
  const { host } = new URL(url);
  const transport = nodemailer.createTransport(server);
  await transport.sendMail({
    to: email,
    from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email }),
  });
}

// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

  // Some simple styling options
  const textColor = "#444444";
  const mainBackgroundColor = "#dcfce7";
  const buttonBackgroundColor = "#4ade80";
  const buttonBorderColor = "#86efac";
  const buttonTextColor = "#000";

  return `
<body>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="border-radius: 10px; background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="left" style="margin: 10px; font-size: 24px; background: ${mainBackgroundColor}; color: ${textColor}; font-family: serif">
        <strong>Recos.</strong>
      </td>
      <td align=="right"><img src="https://recos.vercel.app/logo.png" width="40" style="float: right; margin: 10px"></td>
    </tr>
    <tr>
      <td colspan="5" align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td colspan="5" align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px; padding: 4px; background: ${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="5" align="center" style="padding: 0px 0px 10px 0px; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Sign in to ${host}\n${url}\n\n`;
}

export default NextAuth(authOptions);
