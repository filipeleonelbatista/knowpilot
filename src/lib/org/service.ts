import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  organizations,
  organizationMembers,
  knowledgeBases,
  attendantConfigs,
} from "@/lib/db/schema";
import type { OrgRole } from "@/lib/auth/permissions";
import { canCreateFreeOrganization } from "@/lib/org/limits";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export class OrganizationLimitError extends Error {
  code = "ORG_LIMIT_FREE" as const;
  count: number;
  max: number;

  constructor(count: number, max: number) {
    super(
      `Plano Free permite no máximo ${max} organizações. Você já possui ${count}.`,
    );
    this.name = "OrganizationLimitError";
    this.count = count;
    this.max = max;
  }
}

export async function createOrganizationForUser(
  userId: string,
  name: string,
): Promise<{ id: string; slug: string }> {
  const limit = await canCreateFreeOrganization(userId);
  if (!limit.allowed) {
    throw new OrganizationLimitError(limit.count, limit.max);
  }

  let slug = slugify(name);
  const existing = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const [org] = await db
    .insert(organizations)
    .values({ name, slug })
    .returning();

  await db.insert(organizationMembers).values({
    organizationId: org!.id,
    userId,
    role: "owner",
  });

  await db.insert(knowledgeBases).values({
    organizationId: org!.id,
    name: "Principal",
  });

  await db.insert(attendantConfigs).values({
    organizationId: org!.id,
  });

  return { id: org!.id, slug: org!.slug };
}

export async function getUserOrgMembership(
  userId: string,
  organizationId: string,
): Promise<{ role: OrgRole; organizationId: string } | null> {
  const row = await db.query.organizationMembers.findFirst({
    where: (m, { and, eq: e }) =>
      and(e(m.userId, userId), e(m.organizationId, organizationId)),
  });
  if (!row) return null;
  return { role: row.role as OrgRole, organizationId: row.organizationId };
}

export async function getOrgBySlug(slug: string) {
  return db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });
}

export async function listUserOrganizations(userId: string) {
  const rows = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      plan: organizations.plan,
      role: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizationMembers.organizationId, organizations.id),
    )
    .where(eq(organizationMembers.userId, userId));

  return rows;
}
