export type OrgRole = "owner" | "admin" | "member";

const ROLE_RANK: Record<OrgRole, number> = {
  member: 1,
  admin: 2,
  owner: 3,
};

export function hasMinRole(
  userRole: OrgRole,
  required: OrgRole,
): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

export function canManageKnowledge(role: OrgRole): boolean {
  return hasMinRole(role, "member");
}

export function canManageAttendant(role: OrgRole): boolean {
  return hasMinRole(role, "admin");
}

export function canManageWidgetKeys(role: OrgRole): boolean {
  return hasMinRole(role, "admin");
}

export function canManagePlan(role: OrgRole): boolean {
  return role === "owner";
}

export function canViewLeads(
  role: OrgRole | null,
  isPlatformAdmin: boolean,
): boolean {
  return isPlatformAdmin || (role !== null && hasMinRole(role, "admin"));
}
