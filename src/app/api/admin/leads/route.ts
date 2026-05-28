import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { proLeads, organizations } from "@/lib/db/schema";
import { requireSession } from "@/lib/api/session-org";
import { canViewLeads } from "@/lib/auth/permissions";
import { listUserOrganizations } from "@/lib/org/service";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgs = await listUserOrganizations(session.user.id);
  const adminOrg = orgs.find((o) => canViewLeads(o.role as "owner", false));

  if (!session.user.isPlatformAdmin && !adminOrg) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const leads = await db
    .select({
      id: proLeads.id,
      name: proLeads.name,
      email: proLeads.email,
      phone: proLeads.phone,
      source: proLeads.source,
      status: proLeads.status,
      createdAt: proLeads.createdAt,
      organizationId: proLeads.organizationId,
      orgName: organizations.name,
      orgSlug: organizations.slug,
    })
    .from(proLeads)
    .leftJoin(organizations, eq(proLeads.organizationId, organizations.id))
    .orderBy(desc(proLeads.createdAt));

  return NextResponse.json({ leads });
}
