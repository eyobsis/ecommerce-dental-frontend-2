import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

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
  baseURL: "http://localhost:3000",

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
