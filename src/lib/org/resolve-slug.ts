import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrgBySlug, getUserOrgMembership } from "@/lib/org/service";

export async function getOrgAccessBySlug(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const org = await getOrgBySlug(slug);
  if (!org) return null;

  const membership = await getUserOrgMembership(session.user.id, org.id);
  if (!membership) return null;

  return { org, membership, session };
}

export async function requireOrgBySlug(slug: string) {
  const access = await getOrgAccessBySlug(slug);
  if (!access) notFound();
  return access;
}
