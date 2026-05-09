import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import { env } from "@/config/env";
import { resolveUserDefaults, authTrustedOrigins } from "@/lib/auth-config";
import { sendResetPasswordEmail } from "@/lib/auth-email";

type GoogleProfileInput = {
  given_name?: string;
  family_name?: string;
  email?: string;
};

type FacebookProfileInput = {
  id?: string;
  name?: string;
  email?: string;
};

type TwitterProfileInput = {
  data?: {
    id?: string;
    name?: string;
    email?: string | null;
    profile_image_url?: string;
    username?: string;
  };
};

const socialProviders = {
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          prompt: "select_account" as const,
          mapProfileToUser: (profile: GoogleProfileInput) => {
            const fullName = [profile.given_name, profile.family_name]
              .filter(Boolean)
              .join(" ")
              .trim();

            return {
              name: fullName || undefined,
              email: profile.email,
            };
          },
        },
      }
    : {}),
  ...(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET
    ? {
        facebook: {
          clientId: env.FACEBOOK_CLIENT_ID,
          clientSecret: env.FACEBOOK_CLIENT_SECRET,
          mapProfileToUser: (profile: FacebookProfileInput) => ({
            name: profile.name,
            email: profile.email ?? `${profile.id}@facebook.placeholder.local`,
          }),
        },
      }
    : {}),
  ...(env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET
    ? {
        twitter: {
          clientId: env.TWITTER_CLIENT_ID,
          clientSecret: env.TWITTER_CLIENT_SECRET,
          mapProfileToUser: (profile: TwitterProfileInput) => {
            const twitterId =
              profile.data?.id ?? profile.data?.username ?? "twitter-user";

            return {
              name: profile.data?.name,
              email:
                profile.data?.email ?? `${twitterId}@twitter.placeholder.local`,
              image: profile.data?.profile_image_url,
            };
          },
        },
      }
    : {}),

};

export const auth = betterAuth({
  baseURL: env.AUTH_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({
        to: user.email,
        resetUrl: url,
      });
    },
    resetPasswordTokenExpiresIn: 3600, //1 hour expiry of token
  },
  socialProviders,
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const { accountType, role } = resolveUserDefaults({
            email: user.email,
            accountType: user.accountType,
            role: user.role,
          });

          return {
            data: {
              ...user,
              accountType,
              role,
            },
          };
        },
      },
    },
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
    origin: authTrustedOrigins,
    credentials: true,
  },
  trustedOrigins: authTrustedOrigins,
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
