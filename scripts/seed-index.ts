import { eq, inArray } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "../src/lib/db";
import {
  knowledgeBases,
  knowledgeDocuments,
  organizationMembers,
  users,
} from "../src/lib/db/schema";
import { checkOllamaHealth } from "../src/lib/ollama/client";
import { indexDocument } from "../src/lib/rag/index-document";
import { DEFAULT_SEED_EMAIL } from "./seed-data";

const email = (process.env.SEED_USER_EMAIL ?? DEFAULT_SEED_EMAIL).toLowerCase();

async function main(): Promise<void> {
  migrate(db, { migrationsFolder: "./drizzle/migrations" });

  if (!(await checkOllamaHealth())) {
    console.error("Ollama is not reachable. Start Ollama and pull embed model.");
    process.exit(1);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    console.error(`Seed user ${email} not found. Run pnpm db:seed first.`);
    process.exit(1);
  }

  const memberships = await db
    .select({ organizationId: organizationMembers.organizationId })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, user.id));

  const orgIds = memberships.map((m) => m.organizationId);
  const kbs = await db.query.knowledgeBases.findMany({
    where: inArray(knowledgeBases.organizationId, orgIds),
  });
  const kbIds = kbs.map((k) => k.id);
  if (kbIds.length === 0) {
    console.log("No knowledge bases found for seed user.");
    return;
  }

  const docs = await db.query.knowledgeDocuments.findMany({
    where: inArray(knowledgeDocuments.knowledgeBaseId, kbIds),
  });
  let totalChunks = 0;

  for (const doc of docs) {
    const chunks = await indexDocument(
      doc.id,
      doc.knowledgeBaseId,
      doc.content,
    );
    totalChunks += chunks;
    process.stdout.write(".");
  }

  console.log(`\nIndexed ${docs.length} documents (${totalChunks} chunks).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    sqlite.close();
  });
