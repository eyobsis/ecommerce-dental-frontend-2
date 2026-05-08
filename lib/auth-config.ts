import { env } from "@/config/env";

const DEFAULT_CLIENT_ACCOUNT_TYPE = "CLIENT";
const DEFAULT_CLIENT_ROLE = "CLIENT";

const staffEmailAllowlist = new Set(env.SOCIAL_STAFF_EMAIL_ALLOWLIST);
const staffDomainAllowlist = new Set(env.SOCIAL_STAFF_DOMAIN_ALLOWLIST);

export const authTrustedOrigins =
  env.AUTH_TRUSTED_ORIGINS.length > 0
    ? env.AUTH_TRUSTED_ORIGINS
    : [env.AUTH_APP_URL];

export const primaryAuthOrigin = authTrustedOrigins[0] ?? env.AUTH_APP_URL;

const hasValue = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalizeEmail = (email: unknown): string | null => {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return normalized || null;
};

const getEmailDomain = (email: string | null): string | null => {
  if (!email) return null;
  const atIndex = email.lastIndexOf("@");
  if (atIndex < 0 || atIndex === email.length - 1) return null;
  return email.slice(atIndex + 1);
};

const normalizeRoleLikeValue = (value: string, fallback: string) => {
  const normalized = value.trim().toUpperCase();
  return normalized || fallback;
};

const isAllowlistedStaffUser = (email: string | null) => {
  if (!email) return false;
  if (staffEmailAllowlist.has(email)) return true;

  const domain = getEmailDomain(email);
  return !!domain && staffDomainAllowlist.has(domain);
};

type ResolveUserDefaultsInput = {
  email?: unknown;
  accountType?: unknown;
  role?: unknown;
};

export function resolveUserDefaults(input: ResolveUserDefaultsInput) {
  const normalizedEmail = normalizeEmail(input.email);
  const allowlistedStaff = isAllowlistedStaffUser(normalizedEmail);

  const baseAccountType = allowlistedStaff
    ? env.SOCIAL_STAFF_ACCOUNT_TYPE
    : env.SOCIAL_DEFAULT_ACCOUNT_TYPE;
  const baseRole = allowlistedStaff
    ? env.SOCIAL_STAFF_ROLE
    : env.SOCIAL_DEFAULT_ROLE;

  const accountType = hasValue(input.accountType)
    ? normalizeRoleLikeValue(input.accountType, baseAccountType)
    : normalizeRoleLikeValue(baseAccountType, DEFAULT_CLIENT_ACCOUNT_TYPE);

  const role = hasValue(input.role)
    ? normalizeRoleLikeValue(input.role, baseRole)
    : normalizeRoleLikeValue(baseRole, DEFAULT_CLIENT_ROLE);

  return {
    accountType,
    role,
  };
}

export function resolveCorsOrigin(requestOrigin: string | null) {
  if (!requestOrigin) return primaryAuthOrigin;
  if (authTrustedOrigins.includes(requestOrigin)) return requestOrigin;
  return primaryAuthOrigin;
}
