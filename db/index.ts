import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";
export const connection = postgres(env.DB_URL, {
  max: 1,
});

export const db = drizzle(connection, {
  schema,
  logger: true,
});

export default db;
