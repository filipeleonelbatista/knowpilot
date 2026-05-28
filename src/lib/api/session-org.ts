import { auth } from "@/lib/auth";
import { getUserOrgMembership } from "@/lib/org/service";
import {
  canManageAttendant,
  canManageKnowledge,
  canManagePlan,
  canManageWidgetKeys,
  canViewLeads,
  type OrgRole,
} from "@/lib/auth/permissions";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export async function requireOrgAccess(
  organizationId: string,
  minRole: OrgRole = "member",
) {
  const session = await requireSession();
  if (!session) return null;

  const membership = await getUserOrgMembership(
    session.user.id,
    organizationId,
  );
  if (!membership) return null;

  const rank: Record<OrgRole, number> = {
    member: 1,
    admin: 2,
    owner: 3,
  };
  if (rank[membership.role] < rank[minRole]) return null;

  return { session, membership };
}

export { canManageAttendant, canManageKnowledge, canManagePlan, canManageWidgetKeys, canViewLeads };
