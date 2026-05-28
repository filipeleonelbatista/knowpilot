import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

const defaultPath = path.join(process.cwd(), "data", "app.db");

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? `file:${defaultPath}`;
  if (url.startsWith("file:")) {
    return url.replace(/^file:/, "");
  }
  return defaultPath;
}

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

if (process.env.RUN_MIGRATIONS === "1") {
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle/migrations") });
}

export { sqlite };
