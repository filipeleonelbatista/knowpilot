import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../src/lib/db";
import {
  attendantConfigs,
  knowledgeBases,
  knowledgeDocuments,
  organizationMembers,
  organizations,
  users,
  widgetKeys,
} from "../src/lib/db/schema";
import { indexDocument } from "../src/lib/rag/index-document";
import type { SeedOrgDefinition } from "./seed-data";

export async function cleanupUserByEmail(email: string): Promise<void> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });
  if (!user) return;

  const memberships = await db
    .select({ organizationId: organizationMembers.organizationId })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, user.id));

  const orgIds = memberships.map((r) => r.organizationId);
  if (orgIds.length > 0) {
    await db.delete(organizations).where(inArray(organizations.id, orgIds));
  }

  await db.delete(users).where(eq(users.id, user.id));
}

export type SeedOrgResult = {
  orgName: string;
  slug: string;
  documentCount: number;
  chunkCount: number;
};

export async function seedOrganizationForUser(
  userId: string,
  orgDef: SeedOrgDefinition,
  ollamaUp: boolean,
): Promise<SeedOrgResult> {
  const [org] = await db
    .insert(organizations)
    .values({ name: orgDef.name, slug: orgDef.slug, plan: "free" })
    .returning();

  await db.insert(organizationMembers).values({
    organizationId: org!.id,
    userId,
    role: "owner",
  });

  const [kb] = await db
    .insert(knowledgeBases)
    .values({ organizationId: org!.id, name: orgDef.kbName })
    .returning();

  await db.insert(attendantConfigs).values({
    organizationId: org!.id,
    ...orgDef.attendant,
  });

  await db.insert(widgetKeys).values({
    organizationId: org!.id,
    label: "Site principal",
    publicKey: `wk_${nanoid(24)}`,
    allowedOrigins: JSON.stringify([
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ]),
    active: true,
  });

  let chunkCount = 0;

  for (const doc of orgDef.documents) {
    const [inserted] = await db
      .insert(knowledgeDocuments)
      .values({
        knowledgeBaseId: kb!.id,
        title: doc.title,
        content: doc.content,
        updatedAt: new Date(),
      })
      .returning();

    if (ollamaUp) {
      chunkCount += await indexDocument(
        inserted!.id,
        kb!.id,
        doc.content,
      );
      process.stdout.write(".");
    }
  }

  return {
    orgName: orgDef.name,
    slug: orgDef.slug,
    documentCount: orgDef.documents.length,
    chunkCount,
  };
}
