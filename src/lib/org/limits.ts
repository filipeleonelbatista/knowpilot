import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { organizationMembers, organizations } from "@/lib/db/schema";

export const FREE_MAX_ORGANIZATIONS = Number(
  process.env.FREE_MAX_ORGANIZATIONS ?? "3",
);

export async function countOwnedFreeOrganizations(
  userId: string,
): Promise<number> {
  const rows = await db
    .select({ id: organizations.id })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizationMembers.organizationId, organizations.id),
    )
    .where(
      and(
        eq(organizationMembers.userId, userId),
        eq(organizationMembers.role, "owner"),
        eq(organizations.plan, "free"),
      ),
    );

  return rows.length;
}

export async function canCreateFreeOrganization(
  userId: string,
): Promise<{ allowed: boolean; count: number; max: number }> {
  const count = await countOwnedFreeOrganizations(userId);
  return {
    allowed: count < FREE_MAX_ORGANIZATIONS,
    count,
    max: FREE_MAX_ORGANIZATIONS,
  };
}
