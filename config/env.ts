// env.ts
import { z } from "zod";

const splitCsv = (value: string) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const toUpperWithFallback = (value: string, fallback: string) => {
  const normalized = value.trim().toUpperCase();
  return normalized || fallback;
};

// Define schema
const envSchema = z.object({
  DB_HOST: z.string().default("localhost"),
  DB_PORT_NO: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("password"),
  DB_NAME: z.string().default("pg"),
  DB_URL: z.string().optional().default(""),
  DB_SEEDING: z.coerce.boolean().default(false),
  DB_MIGRATING: z.coerce.boolean().default(false),
  baseUrl: z.string().default("http://localhost:3001"),
  AUTH_APP_URL: z.string().default("http://localhost:3000"),
  AUTH_TRUSTED_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform(splitCsv),
  SOCIAL_DEFAULT_ACCOUNT_TYPE: z
    .string()
    .default("CLIENT")
    .transform((value) => toUpperWithFallback(value, "CLIENT")),
  SOCIAL_DEFAULT_ROLE: z
    .string()
    .default("CLIENT")
    .transform((value) => toUpperWithFallback(value, "CLIENT")),
  SOCIAL_STAFF_ACCOUNT_TYPE: z
    .string()
    .default("ADMIN")
    .transform((value) => toUpperWithFallback(value, "ADMIN")),
  SOCIAL_STAFF_ROLE: z
    .string()
    .default("ADMIN")
    .transform((value) => toUpperWithFallback(value, "ADMIN")),
  SOCIAL_STAFF_EMAIL_ALLOWLIST: z
    .string()
    .default("")
    .transform((value) => splitCsv(value).map((entry) => entry.toLowerCase())),
  SOCIAL_STAFF_DOMAIN_ALLOWLIST: z
    .string()
    .default("")
    .transform((value) => splitCsv(value).map((entry) => entry.toLowerCase())),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default(""),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  FACEBOOK_CLIENT_ID: z.string().default(""),
  FACEBOOK_CLIENT_SECRET: z.string().default(""),
  TWITTER_CLIENT_ID: z.string().default(""),
  TWITTER_CLIENT_SECRET: z.string().default(""),

});

// Parse process.env with defaults
const env = envSchema.parse(process.env);

export { env };
