// env.ts
import { z } from "zod";

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
});

// Parse process.env with defaults
const env = envSchema.parse(process.env);

export { env };
