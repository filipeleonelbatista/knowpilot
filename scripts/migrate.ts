import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "../src/lib/db";

migrate(db, { migrationsFolder: "./drizzle/migrations" });
console.log("Migrations applied.");
sqlite.close();
