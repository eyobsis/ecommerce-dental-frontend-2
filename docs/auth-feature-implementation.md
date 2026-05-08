# Better Auth Feature Implementation

## Scope
This implementation adds two features to the current project:

1. Forgot password flow with Better Auth reset tokens.
2. Social login/sign-up flow for Google, Facebook, Twitter, and LinkedIn.

The implementation is designed to be configurable and safe by default.

## Safety Defaults

1. New users from social login default to `CLIENT` role/account type.
2. Staff auto-assignment is disabled by default.
3. Existing auth flows are preserved and extended (not replaced).
4. Legacy paths are redirected for backward compatibility.

## File-by-File Change Log

### 1) Environment and Configuration

- `config/env.ts`
  - Added auth, social policy, SMTP, and provider env variables.
  - Added CSV parsing for trusted origins and allowlists.
  - Added normalized role/account type parsing helpers.

- `.env.example`
  - Added a complete template for all required and optional auth variables.

### 2) Better Auth Server

- `lib/auth.ts`
  - Added dynamic `socialProviders` configuration for:
    - `google`
    - `facebook`
    - `twitter`
    - `linkedin`
  - Replaced reset-password email stub with real dispatch via `sendResetPasswordEmail`.
  - Added `databaseHooks.user.create.before` to assign default `accountType` and `role` when missing.
  - Replaced hardcoded CORS/trusted origins with env-driven origins.

- `lib/auth-config.ts` (new)
  - Centralized auth origin list and CORS origin resolution.
  - Added `resolveUserDefaults` helper:
    - Applies safe default social role/account type.
    - Supports optional email/domain allowlist overrides.

- `lib/auth-email.ts` (new)
  - Added nodemailer-based reset email sender.
  - Added SMTP fallback behavior: if SMTP is not configured, reset links are logged server-side.

- `app/api/auth/[...all]/route.ts`
  - Updated `OPTIONS` preflight response to dynamically resolve allowed origin from trusted origins.
  - Removed hardcoded local network IP from CORS response.

### 3) Better Auth Client

- `lib/auth-client.ts`
  - Replaced hardcoded base URL with configurable value:
    - `NEXT_PUBLIC_AUTH_BASE_URL`
    - fallback to browser origin
    - final fallback to `http://localhost:3000`

### 4) Sign-In and Sign-Up UI

- `app/auth/page.tsx`
  - Added social sign-in handlers for 4 providers.
  - Added loading and error UI state for social and email auth actions.
  - Updated forgot-password link from `/forgot-password` to `/auth/forgot-password`.
  - Aligned password min length with server policy (8 chars).
  - Mapped remember checkbox to Better Auth `rememberMe`.

- `components/register/create-account-form.tsx`
  - Added social sign-up fallback implementation using `signIn.social` when no external handler is supplied.
  - Added loading and error UI state for social actions.
  - Aligned password min length with server policy (8 chars).

### 5) Forgot/Reset Password Routes

- `app/auth/forgot-password/page.tsx` (new)
  - Added reset request form using `requestPasswordReset`.
  - Uses redirect target `/auth/reset-password`.
  - Uses generic success message to avoid account enumeration.

- `app/auth/reset-password/page.tsx` (new)
  - Added reset form using token query param and `resetPassword`.
  - Handles invalid/expired tokens.
  - Includes success state and return-to-login CTA.

### 6) Backward Compatibility Routes

- `app/forgot-password/page.tsx` (new)
  - Redirects to `/auth/forgot-password`.

- `app/reset-password/page.tsx` (new)
  - Redirects to `/auth/reset-password` while preserving query params.

## Configuration Reference

### Required for Social Providers
Set credentials for providers you want enabled. If a provider key/secret is missing, that provider is not configured server-side.

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`
- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`

### Required for Email Sending (Production)

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

If SMTP variables are not set, reset links are logged server-side (dev-safe fallback).

### Social User Role/AccountType Policy

Defaults:

- `SOCIAL_DEFAULT_ACCOUNT_TYPE=CLIENT`
- `SOCIAL_DEFAULT_ROLE=CLIENT`

Optional allowlist override:

- `SOCIAL_STAFF_EMAIL_ALLOWLIST`
- `SOCIAL_STAFF_DOMAIN_ALLOWLIST`
- `SOCIAL_STAFF_ACCOUNT_TYPE=ADMIN`
- `SOCIAL_STAFF_ROLE=ADMIN`

This allows future changes (for example, allowlisted users become staff) without code changes.

## Verification Checklist

1. Email/password sign in still works.
2. Forgot password page sends request and shows generic confirmation.
3. Reset password page accepts valid token and updates password.
4. Expired/invalid reset links show a clear recovery state.
5. Social sign-in works for configured providers.
6. Social sign-in for first-time users creates accounts with expected role/accountType defaults.
7. CORS preflight on `/api/auth/*` returns a trusted origin.
8. Existing `/forgot-password` and `/reset-password` links still work via redirect.

## Notes

- Existing role-based layout behavior remains unchanged.
- The new default policy ensures social users are not accidentally treated as staff unless explicitly configured.
