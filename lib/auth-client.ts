import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const authBaseURL =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = createAuthClient({
  baseURL: authBaseURL,
  plugins: [
    inferAdditionalFields({
      user: {
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
    }),
  ],
});
