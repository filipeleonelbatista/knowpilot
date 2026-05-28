import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { checkOllamaHealth } from "../src/lib/ollama/client";
import {
  DEFAULT_SEED_EMAIL,
  DEFAULT_SEED_NAME,
  DEFAULT_SEED_PASSWORD,
  SEED_ORGS,
} from "./seed-data";
import { cleanupUserByEmail, seedOrganizationForUser } from "./seed-lib";

const email = (process.env.SEED_USER_EMAIL ?? DEFAULT_SEED_EMAIL).toLowerCase();
const password = process.env.SEED_USER_PASSWORD ?? DEFAULT_SEED_PASSWORD;
const name = process.env.SEED_USER_NAME ?? DEFAULT_SEED_NAME;
const skipIndex = process.argv.includes("--skip-index");
const force = process.argv.includes("--force");

async function main(): Promise<void> {
  migrate(db, { migrationsFolder: "./drizzle/migrations" });

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing && !force) {
    console.error(
      `User ${email} already exists. Run with --force to replace seed data.`,
    );
    process.exit(1);
  }

  if (existing) {
    console.log("Removing previous seed user and organizations…");
    await cleanupUserByEmail(email);
  }

  const ollamaUp = skipIndex ? false : await checkOllamaHealth();
  if (!skipIndex && !ollamaUp) {
    console.warn(
      "Ollama unavailable — documents will be created without embeddings.",
    );
    console.warn("Start Ollama and run: pnpm db:seed:index");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning();

  let totalDocs = 0;
  let totalChunks = 0;

  for (const orgDef of SEED_ORGS) {
    const result = await seedOrganizationForUser(user!.id, orgDef, ollamaUp);
    totalDocs += result.documentCount;
    totalChunks += result.chunkCount;
    console.log(
      `\n✓ ${result.orgName} (${result.slug}) — ${result.documentCount} documentos`,
    );
  }

  console.log("\n--- Seed concluído ---");
  console.log(`Email:    ${email}`);
  console.log(`Senha:    ${password}`);
  console.log(`Orgs:     ${SEED_ORGS.map((o) => o.slug).join(", ")}`);
  console.log(`Docs:     ${totalDocs} (${SEED_ORGS.length} bases)`);
  if (ollamaUp) {
    console.log(`Chunks:   ${totalChunks} (indexados via Ollama)`);
  } else {
    console.log("Chunks:   0 — rode com Ollama ativo ou pnpm db:seed:index");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    sqlite.close();
  });
