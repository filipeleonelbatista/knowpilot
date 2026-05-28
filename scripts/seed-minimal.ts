import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { checkOllamaHealth } from "../src/lib/ollama/client";
import {
  cleanupUserByEmail,
  seedOrganizationForUser,
} from "./seed-lib";
import {
  DEFAULT_MINIMAL_SEED_EMAIL,
  DEFAULT_MINIMAL_SEED_NAME,
  DEFAULT_MINIMAL_SEED_PASSWORD,
  MINIMAL_SEED_ORG,
} from "./seed-minimal-data";

const email = (
  process.env.SEED_MINIMAL_USER_EMAIL ?? DEFAULT_MINIMAL_SEED_EMAIL
).toLowerCase();
const password =
  process.env.SEED_MINIMAL_USER_PASSWORD ?? DEFAULT_MINIMAL_SEED_PASSWORD;
const name = process.env.SEED_MINIMAL_USER_NAME ?? DEFAULT_MINIMAL_SEED_NAME;
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
    console.log("Removing previous minimal seed user…");
    await cleanupUserByEmail(email);
  }

  const ollamaUp = skipIndex ? false : await checkOllamaHealth();
  if (!skipIndex && !ollamaUp) {
    console.warn(
      "Ollama unavailable — documents will be created without embeddings.",
    );
    console.warn(
      `Start Ollama and run: SEED_USER_EMAIL=${email} pnpm db:seed:index`,
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning();

  const result = await seedOrganizationForUser(
    user!.id,
    MINIMAL_SEED_ORG,
    ollamaUp,
  );

  console.log(
    `\n✓ ${result.orgName} (${result.slug}) — ${result.documentCount} documentos`,
  );
  console.log(`  Atendente: ${MINIMAL_SEED_ORG.attendant.name} (preset SaaS)`);
  console.log(
    `  Fallback: ${MINIMAL_SEED_ORG.attendant.fallbackEmail} · ${MINIMAL_SEED_ORG.attendant.fallbackPhone}`,
  );

  console.log("\n--- Seed minimal concluído ---");
  console.log(`Email:    ${email}`);
  console.log(`Senha:    ${password}`);
  console.log(`Org:      ${result.slug}`);
  console.log(`Docs:     ${result.documentCount}`);
  if (ollamaUp) {
    console.log(`Chunks:   ${result.chunkCount} (indexados via Ollama)`);
  } else {
    console.log(
      `Chunks:   0 — rode: SEED_USER_EMAIL=${email} pnpm db:seed:index`,
    );
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
