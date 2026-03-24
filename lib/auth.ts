import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset Your Password",
      //   resetLink: url,
      // });
    },
    resetPasswordTokenExpiresIn: 3600, //1 hour expiry of token
  },
  logger: {
    disabled: false,
    disableColors: false,
    level: "info",
    log: (level, message, ...args) => {
      // Custom logging implementation
      console.log(`[${level}] ${message}`, ...args);
    },
  },
  // advanced: {
  //   crossSubDomainCookies: {
  //     enabled: true,
  //     domain: "localhost:3000",
  //   },
  //   // defaultCookieAttributes: {
  //   //   secure: true,
  //   //   httpOnly: true,
  //   // },
  // },
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
  trustedOrigins: ["http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      accountType: {
        type: "string",
      },
      phone_number: {
        type: "string",
      },
    },
  },
});
