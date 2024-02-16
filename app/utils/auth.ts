import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './db';
const nodemailer = require('nodemailer');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: ({
        identifier: email,
        url,
        provider: { server, from },
      }) => {
        const mailTransport = nodemailer.createTransport(server);

        const mailOptions = {
          to: email,
          from,
          subject: 'Your NetFlicks Sign-In Link',
          html: `
            <div style="max-width: 600px; margin: 20px auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #e50914; color: white; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
                <h1 style="margin: 0; font-size: 24px;">Welcome to NetFlicks</h1>
              </div>
              <div style="padding: 20px; text-align: center;">
                <p style="font-size: 16px; color: #333;">
                  You're just one step away from accessing thousands of movies and TV shows on NetFlicks.
                </p>
                <a href="${url}" style="background-color: #e50914; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px auto;">
                  Sign In Now
                </a>
                <p style="font-size: 14px; color: #777;">
                  If you did not request this email, please ignore it.
                </p>
              </div>
              <div style="background-color: #f9f9f9; color: #777; padding: 10px 20px; text-align: center; border-top: 1px solid #ddd;">
                <p style="margin: 0; font-size: 14px;">
                  Need help? Contact our <a href="#" style="color: #e50914; text-decoration: underline;">support team</a>.
                </p>
              </div>
            </div>
          `,
          text: `Welcome to NetFlicks! You're just one step away from accessing thousands of movies and TV shows on NetFlicks. Sign in now: ${url} - If you did not request this email, please ignore it or let us know.`,
        };

        return mailTransport
          .sendMail(mailOptions)
          .then(() => {
            console.log(`Sign-in email sent to ${email}`);
          })
          .catch((error: any) => {
            console.error(`Error sending sign-in email to ${email}`, error);
          });
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
