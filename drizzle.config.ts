// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "@/config/env";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations/",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DB_URL,
    ssl: "require",
  },
  verbose: true,
  strict: true,
});
