import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),

    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
        google: {
            clientId: env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
        },
    },

  plugins: [
    emailOTP({
       async sendVerificationOTP({email, otp}){
          await resend.emails.send({
           from: 'Paramount <onboarding@resend.dev>',
           to: [email],
           subject: 'Paramount - Verify your email',
           html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
          });
         }
     }),

     admin(),
  ], 
});
